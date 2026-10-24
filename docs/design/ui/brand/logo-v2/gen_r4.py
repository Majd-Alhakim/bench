"""Round 4: the eucas wordmark, every letter a Euca, as true outlines.

No masks, strokes or live text: each letter is one filled path, and the eyes are holes
(subpaths wound the other way, nonzero fill). The colour version also lays white eyes on top
so the Look stays white on dark grounds, like the avatars in the app.

    python gen_r4.py <out-dir>
"""
import math
import os
import sys

OUT = sys.argv[1]
INK, PORCELAIN, WHITE = "#15171d", "#eceef3", "#ffffff"
HUES = {"e": "#ff5f73", "u": "#f2ab1d", "c": "#3cc47c", "a": "#2db4dc", "s": "#8e6cf0"}
GAP = 10


def fmt(pts):
    return "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in pts) + " Z"


def area(pts):
    return sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1])) / 2


def wind(pts, cw=True):
    """Return pts wound clockwise on screen (positive area in y-down coordinates) or the reverse."""
    return pts if (area(pts) > 0) == cw else pts[::-1]


def arc(cx, cy, r, a0, a1, n=48):
    """Points on a circle from angle a0 to a1 (degrees, y-down, clockwise positive)."""
    steps = max(2, int(abs(a1 - a0) / 360 * n * 4))
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / steps)),
             cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / steps))) for i in range(steps + 1)]


def pill(cx, cy, w, h, deg):
    """A vertical pill rotated deg about its centre: one eye of the Look."""
    r = w / 2
    pts = arc(cx, cy - h / 2 + r, r, 180, 360, 16) + arc(cx, cy + h / 2 - r, r, 0, 180, 16)
    a = math.radians(deg)
    return [(cx + (x - cx) * math.cos(a) - (y - cy) * math.sin(a),
             cy + (x - cx) * math.sin(a) + (y - cy) * math.cos(a)) for x, y in pts]


def look(x, y, k):
    """The Look: two pills 7 x 16, -12 deg, 13 apart (the avatar's calm eyes), scaled by k."""
    return [pill(x + dx * k, y, 7 * k, 16 * k, -12) for dx in (-6.5, 6.5)]


def circle_hits(cx, cy, r, p, d):
    """Intersections of the line p + t d with a circle, sorted by t."""
    fx, fy = p[0] - cx, p[1] - cy
    a, b, c = d[0] ** 2 + d[1] ** 2, 2 * (fx * d[0] + fy * d[1]), fx * fx + fy * fy - r * r
    s = math.sqrt(b * b - 4 * a * c)
    return sorted(((-b - s) / (2 * a), (-b + s) / (2 * a)))


def ang(cx, cy, p):
    return math.degrees(math.atan2(p[1] - cy, p[0] - cx))


def disc_with_slot(cx, cy, r, start, deg, half):
    """A disc with a round-ended slot from `start` out through the right edge, rising `deg` degrees."""
    d = (math.cos(math.radians(-deg)), math.sin(math.radians(-deg)))
    n = (d[1], -d[0])  # upward normal
    up = (start[0] + n[0] * half, start[1] + n[1] * half)
    lo = (start[0] - n[0] * half, start[1] - n[1] * half)
    tu, tl = circle_hits(cx, cy, r, up, d)[1], circle_hits(cx, cy, r, lo, d)[1]
    pu = (up[0] + d[0] * tu, up[1] + d[1] * tu)
    pl = (lo[0] + d[0] * tl, lo[1] + d[1] * tl)
    a_u, a_l = ang(cx, cy, pu), ang(cx, cy, pl)
    # Outer arc the long way: from the upper hit, counter-clockwise on screen, round to the lower hit.
    outer = arc(cx, cy, r, a_u, a_l - 360 if a_l > a_u else a_l)
    end_a = math.degrees(math.atan2(n[1], n[0]))
    cap = arc(start[0], start[1], half, end_a + 180, end_a + 360, 24)  # lower edge round the end to the upper edge
    return outer + cap + [pu]


def stroke_outline(curve, width, samples=240):
    """Outline a centreline (list of cubic segments) with variable width and round caps."""
    def bez(seg, t):
        (x0, y0), (x1, y1), (x2, y2), (x3, y3) = seg
        u = 1 - t
        return (u ** 3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3,
                u ** 3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3)

    per = samples // len(curve)
    c = [bez(s, i / per) for s in curve for i in range(per)] + [curve[-1][3]]
    left, right = [], []
    for i, p in enumerate(c):
        a, b = c[max(i - 1, 0)], c[min(i + 1, len(c) - 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]
        ln = math.hypot(dx, dy)
        nx, ny = -dy / ln, dx / ln
        w = width(i / (len(c) - 1)) / 2
        left.append((p[0] + nx * w, p[1] + ny * w))
        right.append((p[0] - nx * w, p[1] - ny * w))
    w0, w1 = width(0) / 2, width(1) / 2
    end = arc(c[-1][0], c[-1][1], w1,
              math.degrees(math.atan2(left[-1][1] - c[-1][1], left[-1][0] - c[-1][0])),
              math.degrees(math.atan2(left[-1][1] - c[-1][1], left[-1][0] - c[-1][0])) - 180, 24)[1:-1]
    start = arc(c[0][0], c[0][1], w0,
                math.degrees(math.atan2(right[0][1] - c[0][1], right[0][0] - c[0][0])),
                math.degrees(math.atan2(right[0][1] - c[0][1], right[0][0] - c[0][0])) - 180, 24)[1:-1]
    return left + end + right[::-1] + start


def letters():
    """Each letter: (advance, [body outlines], [eye outlines])."""
    k = 1.15
    out = {}
    # e: the sphere with its bar cut as a slot rising 15 degrees, the smile.
    out["e"] = (88, [disc_with_slot(44, 52, 42, (38, 66), 15, 6)], look(40, 36, k))
    # u: a body with a round bottom and a notch for its counter.
    u = [(2, 12), (33, 12)] + arc(40, 37, 7, 180, 0, 16) + [(47, 12), (78, 12)] + arc(40, 58, 38, 0, 180, 64)
    out["u"] = (80, [u], look(40, 70, k))
    # c: the sphere with a wide, level opening.
    out["c"] = (84, [disc_with_slot(44, 52, 42, (58, 53), 0, 13)], look(38, 30, k))
    # a: a sphere bowl joined to a stem (union: both wound the same way).
    stem = [(58, 29)] + arc(71, 29, 13, 180, 360, 16) + [(84, 81)] + arc(71, 81, 13, 0, 180, 16)
    out["a"] = (86, [arc(40, 54, 38, 0, 360), stem], look(38, 56, k))
    # s: a variable-width stroke: heavy spine, lighter terminals, so both counters stay open.
    s_curve = [((65, 30), (60, 24), (51, 21), (40, 21)), ((40, 21), (25, 21), (14, 28), (14, 38)),
               ((14, 38), (14, 58), (66, 48), (66, 69)), ((66, 69), (66, 80), (55, 85), (40, 85)),
               ((40, 85), (29, 85), (19, 82), (13, 76))]
    width = lambda t: 16 + 7 * math.sin(math.pi * min(max((t - 0.12) / 0.76, 0), 1))
    out["s"] = (78, [stroke_outline(s_curve, width)], look(40, 53, 0.9))
    return out


def svg_word(mode):
    x, parts = 0, []
    L = letters()
    for ch in "eucas":
        adv, bodies, eyes = L[ch]
        sh = lambda pts: [(px + x, py) for px, py in pts]
        d = " ".join(fmt(wind(sh(b), True)) for b in bodies) + " " + " ".join(fmt(wind(sh(e), False)) for e in eyes)
        fill = {"colour": HUES[ch], "ink": INK, "reversed": PORCELAIN}[mode]
        parts.append(f'<path fill="{fill}" d="{d}"/>')
        if mode == "colour":
            parts.append(f'<path fill="{WHITE}" d="{" ".join(fmt(sh(e)) for e in eyes)}"/>')
        x += adv + GAP
    w = x - GAP
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 4 {w + 8} 100"><title>eucas</title>'
            f'{"".join(parts)}</svg>\n')


def svg_e(mode, small=False):
    """The e alone: the app icon and favicon. The small cut has bigger eyes and a wider slot for 16-32 px."""
    if small:
        body = disc_with_slot(44, 52, 42, (34, 68), 15, 9)
        eyes = look(41, 33, 1.75)
    else:
        adv, (body,), eyes = letters()["e"]
    d = fmt(wind(body, True)) + " " + " ".join(fmt(wind(e, False)) for e in eyes)
    fill = {"colour": HUES["e"], "ink": INK, "reversed": PORCELAIN}[mode]
    extra = f'<path fill="{WHITE}" d="{" ".join(fmt(e) for e in eyes)}"/>' if mode == "colour" else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 2 100 100"><title>eucas</title>'
            f'<path fill="{fill}" d="{d}"/>{extra}</svg>\n')


if __name__ == "__main__":
    for mode in ("colour", "ink", "reversed"):
        for name, s in ((f"r4-word-{mode}.svg", svg_word(mode)), (f"r4-e-{mode}.svg", svg_e(mode)),
                        (f"r4-e-small-{mode}.svg", svg_e(mode, True))):
            with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
                f.write(s)
