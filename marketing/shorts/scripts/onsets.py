# Finds the accents (note onsets) and the beat grid of a music cut, so motion can land on them.
#   ffmpeg -i music.wav -ac 1 -ar 8000 -f s16le out/m.raw && python -I scripts/onsets.py out/m.raw
import math
import struct
import sys

SR, HOP = 8000, 80  # 10 ms frames
raw = open(sys.argv[1], "rb").read()
x = struct.unpack(f"<{len(raw)//2}h", raw)
# Emphasise attacks (strings and piano onsets) with a first difference, then frame energy in dB.
env = []
for i in range(0, len(x) - HOP, HOP):
    e = sum((x[j] - x[j - 1]) ** 2 for j in range(i + 1, i + HOP)) / HOP
    env.append(10 * math.log10(e + 1))
flux = [0.0] + [max(0.0, env[i] - env[i - 1]) for i in range(1, len(env))]
# Peaks above a moving threshold, at least 150 ms apart.
on = []
for i in range(3, len(flux) - 3):
    w = flux[max(0, i - 50):i + 50]
    thr = sum(w) / len(w) * 1.8 + 0.6
    if flux[i] > thr and flux[i] == max(flux[i - 3:i + 4]) and (not on or i - on[-1][0] >= 15):
        on.append((i, flux[i]))
# Tempo: autocorrelation of the flux between 60 and 160 bpm.
best = max(range(int(60 / 160 * 100), int(60 / 60 * 100)), key=lambda L: sum(flux[i] * flux[i - L] for i in range(L, len(flux))))
print(f"tempo ~{6000 / best:.1f} bpm (beat {best * 10} ms)")
strong = sorted(on, key=lambda o: -o[1])[:24]
print("onsets s (strength):", " ".join(f"{i/100:.2f}({v:.1f})" for i, v in on))
print("strongest:", " ".join(f"{i/100:.2f}" for i, _ in sorted(strong)))
