"""Round 6: four new directions, black first (see ROUND-6.md).

    python gen_r6.py <out-dir>
"""
import math
import os
import sys

OUT = sys.argv[1]


def fmt(pts):
    return "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in pts) + " Z"


def pt(c, r, deg):
    a = math.radians(deg)
    return (c[0] + r * math.cos(a), c[1] - r * math.sin(a))  # degrees counter-clockwise, y up


def ring_segment(c, r0, r1, a0, a1, gap):
    """One stone of an arch: the ring between r0 and r1 from a0 to a1 degrees, trimmed by gap/2 each side."""
    def trim(r, a, sign):
        return a + sign * math.degrees(gap / 2 / r)
    n = 24
    outer = [pt(c, r1, trim(r1, a0, 1) + (trim(r1, a1, -1) - trim(r1, a0, 1)) * i / n) for i in range(n + 1)]
    inner = [pt(c, r0, trim(r0, a1, -1) + (trim(r0, a0, 1) - trim(r0, a1, -1)) * i / n) for i in range(n + 1)]
    return outer + inner


def keystone():
    """A: an arch on two legs, a doorway; the keystone in the middle sits a little proud, just set."""
    c, parts = (128, 128), []
    for i in range(5):
        a0, a1 = i * 36, (i + 1) * 36
        seg = ring_segment(c, 50, 102, a0, a1, 9)
        if i == 2:
            seg = [(x, y - 14) for x, y in seg]
        parts.append(fmt(seg))
    parts.append(fmt([(26, 132.5), (78, 132.5), (78, 232), (26, 232)]))  # legs, one gap below the first stones
    parts.append(fmt([(178, 132.5), (230, 132.5), (230, 232), (178, 232)]))
    return f'<path d="{" ".join(parts)}"/>'


def kite():
    """B: a kite of four panels on one string that ends with you (the dot)."""
    top, right, bottom, left = (126, 18), (200, 84), (126, 186), (52, 84)
    centre = (126, 84)
    g = 5  # half the gap between panels

    def clip_quadrant(qx, qy):
        """One panel: the kite clipped to a quadrant of the cross, inset by the gap."""
        pts = []
        poly = [top, right, bottom, left]
        # Sample the kite edges and keep points in the quadrant, then close with the inset cross corner.
        for (x0, y0), (x1, y1) in zip(poly, poly[1:] + poly[:1]):
            for i in range(41):
                x, y = x0 + (x1 - x0) * i / 40, y0 + (y1 - y0) * i / 40
                if (x - centre[0]) * qx >= g and (y - centre[1]) * qy >= g:
                    pts.append((x, y))
        pts.append((centre[0] + qx * g, centre[1] + qy * g))
        return pts
    panels = [clip_quadrant(qx, qy) for qx, qy in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
    string = ('<path d="M126 186 C126 214 96 222 66 232" fill="none" stroke="#000" '
              'stroke-width="9" stroke-linecap="round"/><circle cx="54" cy="236" r="13"/>')
    return f'<path d="{" ".join(fmt(p) for p in panels)}"/>{string}'


def offset(line, d):
    """Offset a polyline sideways by d (positive = to the right of travel), with mitred joints."""
    out = []
    for i, p in enumerate(line):
        segs = []
        for a, b in ((line[i - 1], p) if i else (None, None), (p, line[i + 1]) if i < len(line) - 1 else (None, None)):
            if a is not None:
                dx, dy = b[0] - a[0], b[1] - a[1]
                ln = math.hypot(dx, dy)
                segs.append((-dy / ln, dx / ln))
        mx, my = segs[0][0] + segs[-1][0], segs[0][1] + segs[-1][1]
        ml = math.hypot(mx, my)
        mx, my = mx / ml, my / ml  # mitre direction
        k = d / (mx * segs[0][0] + my * segs[0][1])
        out.append((p[0] + mx * k, p[1] + my * k))
    return out


def dovetail():
    """C: two pieces cut to fit, joined by two dovetails, no glue."""
    g = 4.5  # half the gap, measured square to the cut
    # The cut, top to bottom: two tails, wider at their ends than at the neck.
    join = [(108, 34), (108, 62), (164, 47), (164, 117), (108, 102), (108, 154), (164, 139), (164, 209), (108, 194),
            (108, 222)]
    left = [(34, 34)] + offset(join, g) + [(34, 222)]
    right = [(222, 34), (222, 222)] + offset(join, -g)[::-1]
    return f'<path d="{fmt(left)} {fmt(right)}"/>'


def seen_through():
    """D (stretch): a needle, and a thread that passes through its eye and loops into an e."""
    # Needle: a long tapered shape at 40 degrees, eye near the top.
    ang = math.radians(-50)
    ux, uy = math.cos(ang), math.sin(ang)  # along the needle, toward the top right
    nx, ny = -uy, ux
    base = (70, 214)  # the point
    L = 200
    tip = base
    head = (base[0] + ux * L, base[1] + uy * L)
    def at(s, w):
        return (base[0] + ux * s + nx * w, base[1] + uy * s + ny * w)
    body = [tip] + [at(s, 4 + 7 * min(s / 60, 1)) for s in range(10, L, 10)] + \
           [at(L - 11 + 11 * math.sin(math.radians(a)), 11 * math.cos(math.radians(a))) for a in range(0, 181, 15)] + \
           [at(s, -(4 + 7 * min(s / 60, 1))) for s in range(L - 10, 9, -10)]
    eye = [at(L - 18 + 10 * math.sin(math.radians(a)), 3.2 * math.cos(math.radians(a))) for a in range(0, 361, 15)]
    eye_c = at(L - 18, 0)
    needle = f'<path fill-rule="evenodd" d="{fmt(body)} {fmt(eye[::-1])}"/>'
    # Thread: comes from the right, passes through the eye, falls and ties a loop shaped like an e.
    ex, ey = eye_c
    thread = (f'<path d="M{ex - 22:.0f} {ey - 20:.0f} C{ex - 12:.0f} {ey - 8:.0f} {ex:.0f} {ey:.0f} {ex:.0f} {ey:.0f} '
              f'C{ex + 40:.0f} {ey + 14:.0f} 236 120 214 160 C200 186 172 188 168 216" fill="none" stroke="#000" '
              f'stroke-width="9" stroke-linecap="round"/><circle cx="168" cy="222" r="11"/>')
    return needle + thread


def svg(body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{body}</svg>\n'


if __name__ == "__main__":
    for name, body in (("r6-a-keystone.svg", keystone()), ("r6-b-kite.svg", kite()),
                       ("r6-c-dovetail.svg", dovetail()), ("r6-d-seen-through.svg", seen_through())):
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            f.write(svg(body))
