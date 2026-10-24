"""Quartet: the Eucas mark, as numbers. Measures it and writes every logo master.

The mark is four of the agent shapes in a 2 x 2 (BRAND.md section 6). The geometry lives in spec() so
the optical corrections are explicit and repeatable. Masters are plain filled paths built from arcs and
the avatar's own curves (no strokes, masks or transforms).

    python quartet.py measure          # areas, boxes and gaps: original vs refined
    python quartet.py write [out-dir]  # write the masters (default: next to this file)
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
INK, PORCELAIN = "#15171d", "#eceef3"
HUES = {"sphere": "#ff5f73", "triangle": "#f2ab1d", "square": "#3cc47c", "droplet": "#e05cb4"}
DROPLET = [((50, 8), (60, 24), (84, 44), (84, 64)), ((84, 64), (84, 83), (69, 95), (50, 95)),
           ((50, 95), (31, 95), (16, 83), (16, 64)), ((16, 64), (16, 44), (40, 24), (50, 8))]
REVERSED_THIN = 0.6  # light on dark reads heavier: shave each shape this much for mark-on-dark


def spec(t=0.0):
    """The refined Quartet on a 100 grid. t shaves every shape for light-on-dark use.

    Corrections from the 2026-10-24 review (../logo-lessons.md):
    - Even weight: the triangle and droplet were about a third lighter than the sphere and square, so the
      mark leaned left. The triangle grows (points read small), the droplet grows a little.
    - Even gaps: neighbours sit 11.8-14 apart (8.3 at the droplet's tip, which reads wider than it is).
    - Overshoot: the sphere and droplet pass their seat edges slightly so they look as big as the flat shapes.
    - One corner family: triangle and square corners are both drawn round, at 4.5 and 11.
    - Clean angles: the triangle is equilateral (sides at 60 degrees), not a near miss.
    - No strokes: the triangle's round corners are drawn, not made by a stroke.
    """
    s = 0.485 - t / 45
    return {
        "sphere": ("circle", (25, 25, 20.2 - t)),
        "triangle": ("rounded", (inset_triangle([(75, 2), (75 + 42.5 / math.sqrt(3), 44.5),
                                                  (75 - 42.5 / math.sqrt(3), 44.5)], t), 4.5)),
        "square": ("rounded", ([(7 + t, 57 + t), (44 - t, 57 + t), (44 - t, 94 - t), (7 + t, 94 - t)], 11 - t)),
        "droplet": ("droplet", (74.5 - 50 * s, 95 - t - 95 * s, s)),
    }


def inset_triangle(pts, t):
    """An equilateral triangle shrunk by t on every side (scaled about its centre), so its sides stay at 60 degrees."""
    cx, cy = sum(x for x, _ in pts) / 3, sum(y for _, y in pts) / 3
    k = 1 - t / (abs(pts[1][1] - pts[0][1]) / 3)
    return [(cx + (x - cx) * k, cy + (y - cy) * k) for x, y in pts]


ORIGINAL = {  # the 2026-10-23 Quartet, for comparison (its triangle was a stroke-rounded path)
    "sphere": ("circle", (26, 26, 20)),
    "triangle": ("rounded", ([(74, 4.9), (95.3, 46), (52.7, 46)], 3)),
    "square": ("rounded", ([(7, 55), (45, 55), (45, 93), (7, 93)], 12)),
    "droplet": ("droplet", (51.1, 50.3, 0.46)),
}


def corners(pts, r):
    """For each corner of a clockwise polygon: (tangent in, tangent out) for a fillet of radius r."""
    out = []
    for i, p in enumerate(pts):
        a, b = pts[i - 1], pts[(i + 1) % len(pts)]
        u1 = ((a[0] - p[0]), (a[1] - p[1]))
        u2 = ((b[0] - p[0]), (b[1] - p[1]))
        l1, l2 = math.hypot(*u1), math.hypot(*u2)
        u1, u2 = (u1[0] / l1, u1[1] / l1), (u2[0] / l2, u2[1] / l2)
        theta = math.acos(max(-1.0, min(1.0, u1[0] * u2[0] + u1[1] * u2[1])))
        d = r / math.tan(theta / 2)
        out.append(((p[0] + u1[0] * d, p[1] + u1[1] * d), (p[0] + u2[0] * d, p[1] + u2[1] * d)))
    return out


def bez(seg, t):
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = seg
    u = 1 - t
    return (u ** 3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3,
            u ** 3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3)


def num(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def to_d(kind, args):
    """SVG path data with true arcs and curves."""
    if kind == "circle":
        cx, cy, r = args
        return (f"M{num(cx - r)} {num(cy)}A{num(r)} {num(r)} 0 1 1 {num(cx + r)} {num(cy)}"
                f"A{num(r)} {num(r)} 0 1 1 {num(cx - r)} {num(cy)}Z")
    if kind == "rounded":
        pts, r = args
        cs = corners(pts, r)
        d = f"M{num(cs[0][1][0])} {num(cs[0][1][1])}"
        for i in range(1, len(cs) + 1):
            tin, tout = cs[i % len(cs)]
            d += f"L{num(tin[0])} {num(tin[1])}A{num(r)} {num(r)} 0 0 1 {num(tout[0])} {num(tout[1])}"
        return d + "Z"
    x, y, s = args
    p = lambda q: f"{num(x + q[0] * s)} {num(y + q[1] * s)}"  # noqa: E731
    return f"M{p(DROPLET[0][0])}" + "".join(f"C{p(c1)} {p(c2)} {p(e)}" for _, c1, c2, e in DROPLET) + "Z"


def to_points(kind, args):
    """The same shapes as dense points, for measuring."""
    if kind == "circle":
        cx, cy, r = args
        return [(cx + r * math.cos(math.radians(i)), cy + r * math.sin(math.radians(i))) for i in range(360)]
    if kind == "rounded":
        pts, r = args
        cs, out = corners(pts, r), []
        for i, (tin, tout) in enumerate(cs):
            p = pts[i]
            mid = ((tin[0] + tout[0]) / 2, (tin[1] + tout[1]) / 2)
            cl = math.hypot(mid[0] - p[0], mid[1] - p[1])
            dist = math.hypot(math.hypot(tin[0] - p[0], tin[1] - p[1]), r)
            c = (p[0] + (mid[0] - p[0]) / cl * dist, p[1] + (mid[1] - p[1]) / cl * dist)
            a1, a2 = math.atan2(tin[1] - c[1], tin[0] - c[0]), math.atan2(tout[1] - c[1], tout[0] - c[0])
            da = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi
            out += [(c[0] + r * math.cos(a1 + da * k / 16), c[1] + r * math.sin(a1 + da * k / 16)) for k in range(17)]
            nxt = cs[(i + 1) % len(cs)][0]
            out += [(tout[0] + (nxt[0] - tout[0]) * k / 80, tout[1] + (nxt[1] - tout[1]) * k / 80) for k in range(1, 80)]
        return out
    x, y, s = args
    return [(x + px * s, y + py * s) for seg in DROPLET for px, py in (bez(seg, i / 90) for i in range(90))]


def area(p):
    return abs(sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(p, p[1:] + p[:1]))) / 2


def gap(p, q):
    return min(math.hypot(a[0] - b[0], a[1] - b[1]) for a in p[::2] for b in q[::2])


def report(name, sp):
    pts = {k: to_points(*v) for k, v in sp.items()}
    print(f"--- {name}")
    for k, p in pts.items():
        xs, ys = [x for x, _ in p], [y for _, y in p]
        print(f"  {k:9s} area {area(p):7.1f}  box x {min(xs):5.1f}-{max(xs):5.1f} y {min(ys):5.1f}-{max(ys):5.1f}")
    pairs = [("sphere", "triangle"), ("sphere", "square"), ("triangle", "droplet"), ("square", "droplet")]
    print("  gaps: " + "  ".join(f"{a[:3]}-{b[:3]} {gap(pts[a], pts[b]):.1f}" for a, b in pairs))


def shapes(sp, fills):
    return "".join(f'<path fill="{fills[k]}" d="{to_d(*v)}"/>' for k, v in sp.items())


def one(fill):
    return {k: fill for k in HUES}


def scaled(kind, args, k, o):
    if kind == "circle":
        cx, cy, r = args
        return (cx * k + o, cy * k + o, r * k)
    if kind == "rounded":
        pts, r = args
        return ([(x * k + o, y * k + o) for x, y in pts], r * k)
    x, y, s = args
    return (x * k + o, y * k + o, s * k)


def svg(body, label, w=100, h=100, vb="0 0 100 100", comment=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{w}" height="{h}" role="img" '
            f'aria-label="{label}">\n  <!-- {comment} -->\n  {body}\n</svg>\n')


def app_icon(kind):
    """The app icon: the colour mark on an Ink glass tile (macOS squircle at 56 %, Windows tile at 60 %)."""
    squircle = ("M50 0C77 0 89 0 94.5 5.5C100 11 100 23 100 50C100 77 100 89 94.5 94.5C89 100 77 100 50 100"
                "C23 100 11 100 5.5 94.5C0 89 0 77 0 50C0 23 0 11 5.5 5.5C11 0 23 0 50 0Z")
    rounded = "M10 0H90A10 10 0 0 1 100 10V90A10 10 0 0 1 90 100H10A10 10 0 0 1 0 90V10A10 10 0 0 1 10 0Z"
    tile = squircle if kind == "macos" else rounded
    k = 0.56 if kind == "macos" else 0.60
    o = (100 - 100 * k) / 2
    mark = {name: (kd, scaled(kd, args, k, o)) for name, (kd, args) in spec().items()}
    body = ('<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2f38"/>'
            '<stop offset="1" stop-color="#15171d"/></linearGradient><linearGradient id="hl" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#fff" stop-opacity=".13"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>'
            f'</linearGradient></defs><path d="{tile}" fill="url(#bg)"/><path d="{tile}" fill="url(#hl)"/>'
            f'<path d="{tile}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.4"/>' + shapes(mark, HUES))
    if kind == "macos":
        return svg(body, "Eucas app icon, macOS", 512, 512, comment="macOS master: squircle, Ink glass, the colour mark "
                   "at 56 %. Export .icns and Linux PNGs from this file. Generated by quartet.py.")
    return svg(body, "Eucas app icon, Windows", 256, 256, comment="Windows master: rounded tile (r 10), Ink glass, the "
               "colour mark at 60 %. Export the ICO sizes 16-256. Generated by quartet.py.")


def write(out):
    gen = "Generated by quartet.py; edit spec() there, not this file."
    name = ('<text x="136" y="80" fill="#15171d" font-family="\'Instrument Sans\', \'Segoe UI Variable Display\', '
            '\'Segoe UI\', system-ui, sans-serif" font-weight="600" font-size="84" letter-spacing="-2.94" '
            'textLength="220" lengthAdjust="spacing">eucas</text>')
    files = {
        "mark.svg": svg(shapes(spec(), one(INK)), "Eucas mark", comment=f"The Quartet, Ink, for light grounds. {gen}"),
        "mark-on-dark.svg": svg(shapes(spec(REVERSED_THIN), one(PORCELAIN)), "Eucas mark",
                                comment=f"Porcelain on dark, shaved {REVERSED_THIN} so it doesn't look heavier. {gen}"),
        "mark-colour.svg": svg(shapes(spec(), HUES), "Eucas mark, colour",
                               comment=f"Colour: app icon and brand moments only. {gen}"),
        "favicon.svg": svg('<style>path{fill:#15171d}@media (prefers-color-scheme:dark){path{fill:#eceef3}}</style>'
                           + shapes(spec(), one(INK)), "Eucas", 16, 16, comment=f"Favicon: Ink, Porcelain on dark. {gen}"),
        "lockup.svg": svg(shapes(spec(), one(INK)) + name, "eucas", 362, 100, "0 0 362 100",
                          "Lockup: mark, gap 0.36 x height, the name in Instrument Sans 600 at 0.84 x height. "
                          f"The name is live text: outline it before shipping. {gen}"),
        "app-icon-macos.svg": app_icon("macos"),
        "app-icon-windows.svg": app_icon("windows"),
    }
    for fname, s in files.items():
        with open(os.path.join(out, fname), "w", encoding="utf-8", newline="\n") as fh:
            fh.write(s)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "measure":
        report("original", ORIGINAL)
        report("refined", spec())
    elif cmd == "write":
        write(sys.argv[2] if len(sys.argv) > 2 else HERE)
    else:
        sys.exit(__doc__)
