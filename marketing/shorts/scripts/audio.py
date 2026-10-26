# Synthesises the audio for the motion-graphics videos: Eucas's own sounds and an original music bed.
#   python -I marketing/shorts/scripts/audio.py
# Everything here is generated from code in this repo, so Eucas owns it (see marketing/ready/media/CREDITS.md).
# Writes public/audio/*.wav (48 kHz, 16-bit). Pure Python: no third-party packages.
import math
import os
import random
import struct
import wave

SR = 48000
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "audio")
os.makedirs(OUT, exist_ok=True)
random.seed(7)


def save(name, left, right=None, normalise=False):
    right = right or left
    peak = max(1e-9, max(max(abs(x) for x in left), max(abs(x) for x in right)))
    # Headroom, never clip; Eucas's sounds are normalised so the mix sets their level, not the synthesis.
    k = 0.89 / peak if (peak > 0.89 or normalise) else 1.0
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<hh", int(l * k * 32767), int(r * k * 32767)) for l, r in zip(left, right)))


def buf(seconds):
    return [0.0] * int(seconds * SR)


# ---------- Eucas sounds: the same synthesis as the prototype (prototype/src/app.js, SFX) ----------
def tone(b, t0, f, dur, gain=0.16, glide=None):
    """A sine with an 8 ms exponential attack and an exponential fall to silence, as in tone() in app.js."""
    n0, n = int(t0 * SR), int((dur + 0.03) * SR)
    ph = 0.0
    for i in range(n):
        t = i / SR
        ff = f * (glide ** min(1.0, t / (dur * 0.8))) if glide else f
        ph += 2 * math.pi * ff / SR
        if t < 0.008:
            g = 0.0001 * (gain / 0.0001) ** (t / 0.008)
        elif t < dur:
            g = gain * (0.0001 / gain) ** ((t - 0.008) / (dur - 0.008))
        else:
            g = 0.0
        if n0 + i < len(b):
            b[n0 + i] += math.sin(ph) * g


def needs():
    b = buf(0.5)
    tone(b, 0, 440, 0.17, 0.17)
    tone(b, 0.11, 587.33, 0.21, 0.18)
    return b


def done():
    b = buf(0.5)
    tone(b, 0, 739.99 * 1.012, 0.38, 0.19, glide=1 / 1.012)
    tone(b, 0, 1479.98, 0.16, 0.04)
    return b


def stopped():
    b = buf(0.5)
    tone(b, 0, 698.46, 0.14, 0.16)
    tone(b, 0.1, 523.25, 0.26, 0.17)
    return b


# ---------- UI ticks and whooshes (soft, short) ----------
def tick():
    b = buf(0.08)
    prev = 0.0
    for i in range(len(b)):
        t = i / SR
        x = random.uniform(-1, 1)
        hp = x - prev  # crude high-pass: a dry click, not a beep
        prev = x
        b[i] = (hp * 0.25 + math.sin(2 * math.pi * 2400 * t) * 0.35) * math.exp(-t * 90) * 0.5
    return b


def whoosh(dur=0.42):
    b = buf(dur)
    lp = 0.0
    for i in range(len(b)):
        t = i / SR
        p = t / dur
        env = math.sin(math.pi * p) ** 2
        cutoff = 0.008 + 0.03 * p  # a dark breath that brightens a little as it passes
        lp += (random.uniform(-1, 1) - lp) * cutoff
        b[i] = lp * env * 2.2
    return b


# ---------- Music: an original calm bed in D major (the key of the Eucas sounds), 96 bpm ----------
BPM = 96
BEAT = 60 / BPM
BAR = BEAT * 4
NOTE = {"D2": 73.42, "B1": 61.74, "G1": 49.0, "A1": 55.0, "D3": 146.83, "F#3": 185.0, "A3": 220.0, "C#4": 277.18,
        "B2": 123.47, "D4": 293.66, "F#4": 369.99, "G2": 98.0, "B3": 246.94, "E4": 329.63, "A2": 110.0, "E3": 164.81,
        "G3": 196.0, "A4": 440.0, "B4": 493.88, "D5": 587.33, "F#5": 739.99, "C#5": 554.37, "E5": 659.26, "G4": 392.0}
CHORDS = [  # (bass, pad, arpeggio), two bars each
    ("D2", ["D3", "F#3", "A3", "C#4"], ["F#4", "A4", "C#5", "E5"]),
    ("B1", ["B2", "D3", "F#3", "A3"], ["D4", "F#4", "A4", "B4"]),
    ("G1", ["G2", "B3", "D4", "F#4"], ["B4", "D5", "F#5", "D5"]),
    ("A1", ["A2", "E3", "G3", "C#4"], ["E4", "A4", "C#5", "E5"]),
]


def music(seconds, drums_from, drums_to, arp_from):
    L, R = buf(seconds), buf(seconds)
    n = len(L)

    def add(t0, dur, f, amp, attack, release, pan=0.0, harm=0.12, detune=0.0):
        a, r = int(attack * SR), int(release * SR)
        n0, nn = int(t0 * SR), int((dur + release) * SR)
        lg, rg = math.cos((pan + 1) * math.pi / 4), math.sin((pan + 1) * math.pi / 4)
        for i in range(nn):
            j = n0 + i
            if j >= n:
                break
            t = i / SR
            env = min(1.0, i / a) if a else 1.0
            if t > dur:
                env *= max(0.0, 1 - (t - dur) / release)
            ph = 2 * math.pi * f * (1 + detune) * t
            x = (math.sin(ph) + harm * math.sin(2 * ph)) * env * amp
            L[j] += x * lg
            R[j] += x * rg

    t = 0.0
    k = 0
    while t < seconds:
        bass, pad, arp = CHORDS[k % len(CHORDS)]
        span = BAR * 2
        add(t, span * 0.95, NOTE[bass] * 2, 0.10, 0.08, 0.6, 0.0, 0.05)
        for idx, p in enumerate(pad):  # a warm pad: each note twice, detuned and panned apart
            add(t, span * 0.98, NOTE[p], 0.042, 0.9, 1.2, -0.45 + idx * 0.3, 0.10, 0.0015)
            add(t, span * 0.98, NOTE[p], 0.042, 0.9, 1.2, 0.45 - idx * 0.3, 0.10, -0.0015)
        e = 0
        while e < 16:  # eighth-note plucks, sparse
            te = t + e * BEAT / 2
            if arp_from <= te < seconds - 1.0 and e % 2 == 0:
                add(te, 0.05, NOTE[arp[(e // 2) % 4]], 0.050, 0.004, 0.38, -0.3 if e % 4 == 0 else 0.3, 0.25)
            e += 1
        t += span
        k += 1

    # Soft kick on beats 1 and 3, a hushed hat on the off-beats.
    beat_t = 0.0
    bi = 0
    while beat_t < seconds:
        if drums_from <= beat_t < drums_to:
            if bi % 2 == 0:
                n0 = int(beat_t * SR)
                ph = 0.0
                for i in range(int(0.28 * SR)):
                    if n0 + i >= n:
                        break
                    tt = i / SR
                    ph += 2 * math.pi * (52 + 70 * math.exp(-tt * 30)) / SR
                    x = math.sin(ph) * math.exp(-tt * 13) * 0.22
                    L[n0 + i] += x
                    R[n0 + i] += x
            n0 = int((beat_t + BEAT / 2) * SR)
            prev = 0.0
            for i in range(int(0.05 * SR)):
                if n0 + i >= n:
                    break
                xr = random.uniform(-1, 1)
                prev += (xr - prev) * 0.35  # soften the top end
                h = (xr - prev) * math.exp(-i / SR * 90) * 0.012
                L[n0 + i] += h * 0.8
                R[n0 + i] += h
        beat_t += BEAT
        bi += 1

    fade_in, fade_out = int(0.6 * SR), int(1.6 * SR)
    for i in range(n):
        g = min(1.0, i / fade_in) * min(1.0, (n - i) / fade_out)
        L[i] *= g
        R[i] *= g
    return L, R


if __name__ == "__main__":
    save("needs.wav", needs(), normalise=True)
    save("done.wav", done(), normalise=True)
    save("stopped.wav", stopped(), normalise=True)
    save("tick.wav", tick())
    save("whoosh.wav", whoosh())
    # V1: 23.5 s. Drums from the first beat after the hook until the end card; plucks after the peek opens.
    save("music-v1.wav", *music(23.5, drums_from=BAR * 1, drums_to=20.0, arp_from=2.0))
    print("ok")
