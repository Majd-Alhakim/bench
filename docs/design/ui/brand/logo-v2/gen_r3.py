"""Round 3: the eucas wordmark where every letter is a Euca (avatar body + the Look).

Writes colour and one-colour versions. Concept stage: cut-outs use <mask>; boolean them before the kit.
"""
import os, sys

OUT = sys.argv[1]
INK, WHITE = "#15171d", "#ffffff"
HUES = {"e": "#ff5f73", "u": "#f2ab1d", "c": "#3cc47c", "a": "#2db4dc", "s": "#8e6cf0"}


def eyes(x, y, k=1.0, fill=WHITE):
    """The Look: two pills 7 x 16, rotated -12 deg, 13 apart (prototype avatarSVG 'calm')."""
    w, h, g = 7 * k, 16 * k, 13 * k
    return "".join(
        f'<rect x="{cx - w / 2:.1f}" y="{y - h / 2:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{w / 2:.1f}" '
        f'transform="rotate(-12 {cx:.1f} {y:.1f})" fill="{fill}"/>'
        for cx in (x - g / 2, x + g / 2)
    )


# Each letter: (advance width, body svg, cut-outs svg drawn black in the mask, eye position, eye scale)
LETTERS = {
    # e: a sphere whose bar is a slot rising 15 deg to the right edge
    "e": (88, '<circle cx="44" cy="52" r="42"/>',
          '<path d="M38 60 L96 44.5 L96 56.5 L38 72 Z"/><circle cx="38" cy="66" r="6"/>', (40, 36), 1.15),
    # u: a rounded-bottom body with a notch for its counter
    "u": (80, '<path d="M2 12 H78 V58 A38 38 0 0 1 2 58 Z" />',
          '<rect x="33" y="0" width="14" height="44" rx="7"/>', (40, 70), 1.15),
    # c: an egg with a bite on the right
    "c": (82, '<path d="M44 10 C66 10 82 30 82 52 C82 76 66 94 44 94 C22 94 4 76 4 52 C4 30 22 10 44 10 Z"/>',
          '<rect x="44" y="40" width="70" height="26" rx="13"/>', (36, 25), 1.15),
    # a: a sphere bowl joined to a stem
    "a": (86, '<circle cx="40" cy="54" r="38"/><rect x="58" y="16" width="26" height="78" rx="13"/>',
          '', (38, 56), 1.15),
    # s: a heavy stroked s (stroke kept for the concept)
    "s": (78, '<path d="M64 28 C58 20 50 16 39 16 C25 16 16 24 16 35 C16 57 64 46 64 70 C64 83 54 90 39 90 '
              'C28 90 18 86 12 77" fill="none" stroke-width="26" stroke-linecap="round"/>',
          '', (40, 53), 0.95),
}
GAP = 10


def wordmark(colour, bg):
    x, parts, defs = 0, [], []
    for i, ch in enumerate("eucas"):
        adv, body, cut, (ex, ey), k = LETTERS[ch]
        fill = HUES[ch] if colour else (INK if bg == WHITE else "#eceef3")
        mask = ""
        if cut:
            mid = f"m{i}"
            defs.append(f'<mask id="{mid}"><rect x="-20" y="-20" width="140" height="140" fill="#fff"/>'
                        f'<g fill="#000">{cut}</g></mask>')
            mask = f' mask="url(#{mid})"'
        eye_fill = WHITE if (colour or bg == WHITE) else INK
        g = (f'<g transform="translate({x} 0)"><g fill="{fill}" stroke="{fill}" stroke-width="0"{mask}>{body}</g>'
             f'{eyes(ex, ey, k, eye_fill)}</g>')
        g = g.replace('stroke-width="26"', f'stroke="{fill}" stroke-width="26"')
        parts.append(g)
        x += adv + GAP
    w = x - GAP + 8
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 0 {w} 104"><title>eucas</title>'
            f'<defs>{"".join(defs)}</defs>{"".join(parts)}</svg>\n')


for name, colour, bg in (("r3-word-colour.svg", True, WHITE), ("r3-word-ink.svg", False, WHITE),
                         ("r3-word-reversed.svg", False, INK)):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(wordmark(colour, bg))
