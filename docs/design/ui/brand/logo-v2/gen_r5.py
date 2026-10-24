"""Round 5: the Euca wordmark after the client's video lessons (see LESSONS.md).

Changes from round 4: one colour by default, optical corrections (overshoot, bowls slightly
wider than tall, a thinner reversed cut, pair-by-pair spacing), one eye size everywhere,
an expression system, and a stretch variant. Geometry helpers come from gen_r4.

    python gen_r5.py <out-dir>
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_r4 import arc, disc_with_slot, fmt, pill, stroke_outline, wind  # noqa: E402

OUT = sys.argv[1]
INK, PORCELAIN, WHITE = "#15171d", "#eceef3", "#ffffff"
HUES = {"e": "#ff5f73", "u": "#f2ab1d", "c": "#3cc47c", "a": "#2db4dc", "s": "#8e6cf0"}
EYE = 1.05  # one eye size for every letter
WIDEN = 1.035  # bowls slightly wider than tall, so they don't look stiff
PAIR_GAP = {("e", "u"): 9, ("u", "c"): 9, ("c", "a"): 5, ("a", "s"): 9}  # spaced by eye
REVERSED_THIN = 0.7  # light on dark looks heavier: shave the bodies, open the holes


def xscale(pts, cx, k=WIDEN):
    return [(cx + (x - cx) * k, y) for x, y in pts]


def eyes(x, y, expr="calm", grow=0.0, k=EYE):
    """The Look in the app's expressions (prototype eyesFor), scaled by EYE; grow opens the holes."""
    g = grow
    L, R = x - 6.5 * k, x + 6.5 * k
    if expr == "sleepy":  # closed: short level bars
        return [pill(cx, y + 3, 4 * k + g, 13 * k + g, 78) for cx in (L, R)]
    if expr == "surprised":
        return [pill(cx, y, 8 * k + g, 11 * k + g, 0) for cx in (L, R)]
    if expr == "curious":
        return [pill(L, y, 7.6 * k + g, 18 * k + g, -12), pill(R, y + 2, 6.4 * k + g, 11 * k + g, -12)]
    if expr == "look-up":
        return [pill(cx + 3, y - 3, 7 * k + g, 16 * k + g, -12) for cx in (L, R)]
    return [pill(cx, y, 7 * k + g, 16 * k + g, -12) for cx in (L, R)]


def letters(t=0.0, expr="calm"):
    """Each letter: ([body outlines], [eye outlines]). t thins the bodies and opens the holes."""
    out = {}
    # Round letters overshoot: tops at 12, bottoms at 94; flat tops sit at 14.
    out["e"] = ([xscale(disc_with_slot(44, 53, 41 - t, (38, 67), 15, 6 + t), 44)], eyes(40, 37, expr, 2 * t))
    u = [(2 + t, 14 + t), (33 - t, 14 + t)] + arc(40, 38, 7 + t, 180, 0, 16) + \
        [(47 + t, 14 + t), (78 - t, 14 + t)] + arc(40, 56, 38 - t, 0, 180, 64)
    out["u"] = ([u], eyes(40, 70, expr, 2 * t))
    out["c"] = ([xscale(disc_with_slot(44, 53, 41 - t, (58, 54), 0, 13 + t), 44)], eyes(38, 32, expr, 2 * t))
    h = 13 - t
    stem = [(71 - h, 29)] + arc(71, 29, h, 180, 360, 16) + [(71 + h, 81)] + arc(71, 81, h, 0, 180, 16)
    out["a"] = ([xscale(arc(40, 55, 38 - t, 0, 360), 40), stem], eyes(38, 56, expr, 2 * t))
    s_curve = [((65, 30), (60, 24), (51, 21), (40, 21)), ((40, 21), (25, 21), (14, 28), (14, 38)),
               ((14, 38), (14, 58), (66, 48), (66, 69)), ((66, 69), (66, 80), (55, 85), (40, 85)),
               ((40, 85), (29, 85), (19, 82), (13, 76))]
    width = lambda u_: 16 + 7 * math.sin(math.pi * min(max((u_ - 0.12) / 0.76, 0), 1)) - 2 * t
    out["s"] = ([stroke_outline(s_curve, width)], eyes(41, 55, expr, 2 * t, k=0.88))  # the s spine is narrower
    return out


def bbox_x(polys):
    xs = [x for p in polys for x, _ in p]
    return min(xs), max(xs)


def rotate(pts, c, deg):
    a = math.radians(deg)
    return [(c[0] + (x - c[0]) * math.cos(a) - (y - c[1]) * math.sin(a),
             c[1] + (x - c[0]) * math.sin(a) + (y - c[1]) * math.cos(a)) for x, y in pts]


def word(mode, expr="calm", crowd=None, exprs=None):
    """The wordmark. crowd: per-letter (degrees, dy) for the stretch; exprs: per-letter expressions."""
    t = REVERSED_THIN if mode == "reversed" else 0.0
    parts, x, prev = [], 0.0, None
    for i, ch in enumerate("eucas"):
        bodies, eye = letters(t, exprs[i] if exprs else expr)[ch]
        lo, hi = bbox_x(bodies)
        x += 0 if prev is None else PAIR_GAP[(prev, ch)]
        dx = x - lo

        deg, dy = crowd[i] if crowd else (0, 0)
        centre = dx + (lo + hi) / 2

        def place(p, dx=dx, deg=deg, dy=dy, c=centre):
            """Move a letter into place; the stretch also tilts it as one piece about its own centre."""
            return [(px, py + dy) for px, py in rotate([(q + dx, r) for q, r in p], (c, 53), deg)]
        fill = {"colour": HUES[ch], "ink": INK, "reversed": PORCELAIN}[mode]
        d = " ".join(fmt(wind(place(b), True)) for b in bodies) + " " + \
            " ".join(fmt(wind(place(e), False)) for e in eye)
        parts.append(f'<path fill="{fill}" d="{d}"/>')
        if mode == "colour":
            parts.append(f'<path fill="{WHITE}" d="{" ".join(fmt(place(e)) for e in eye)}"/>')
        x += hi - lo
        prev = ch
    return parts, x


def svg_word(mode, **kw):
    parts, w = word(mode, **kw)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 2 {w + 12:.0f} 102"><title>eucas</title>'
            f'{"".join(parts)}</svg>\n')


def svg_e(mode, small=False):
    """The e alone, cut from the wordmark. The small cut has bigger eyes and a wider smile for 16-32 px."""
    t = REVERSED_THIN if mode == "reversed" else 0.0
    if small:
        body = xscale(disc_with_slot(44, 53, 41 - t, (34, 69), 15, 9 + t), 44)
        eye = [pill(41 + dx, 34, 12.5 + 2 * t, 28 + 2 * t, -12) for dx in (-11, 11)]
    else:
        (body,), eye = letters(t)["e"]
    fill = {"colour": HUES["e"], "ink": INK, "reversed": PORCELAIN}[mode]
    d = fmt(wind(body, True)) + " " + " ".join(fmt(wind(e, False)) for e in eye)
    extra = f'<path fill="{WHITE}" d="{" ".join(fmt(e) for e in eye)}"/>' if mode == "colour" else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 3 100 100"><title>eucas</title>'
            f'<path fill="{fill}" d="{d}"/>{extra}</svg>\n')


def svg_system():
    """The logo as a system: the same five letters in the app's expressions."""
    rows = [("calm", None), ("look-up", None), ("sleepy", None),
            (None, ["curious", "calm", "surprised", "calm", "look-up"])]
    out, w = [], 0
    for r, (expr, exprs) in enumerate(rows):
        parts, w = word("ink", expr=expr or "calm", exprs=exprs)
        out.append(f'<g transform="translate(0 {r * 120})">{"".join(parts)}</g>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 2 {w + 12:.0f} {120 * len(rows) - 16}">'
            f'<title>eucas expressions</title>{"".join(out)}</svg>\n')


if __name__ == "__main__":
    files = {f"r5-word-{m}.svg": svg_word(m) for m in ("ink", "reversed", "colour")}
    files.update({f"r5-e-{m}.svg": svg_e(m) for m in ("ink", "reversed", "colour")})
    files.update({f"r5-e-small-{m}.svg": svg_e(m, True) for m in ("ink", "reversed", "colour")})
    files["r5-system.svg"] = svg_system()
    files["r5-stretch-ink.svg"] = svg_word("ink", crowd=[(-9, 3), (6, -6), (-4, 4), (8, -3), (-7, -7)])
    for name, s in files.items():
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            f.write(s)
