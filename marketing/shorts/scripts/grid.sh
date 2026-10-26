#!/usr/bin/env bash
# Joins images into a grid: bash scripts/grid.sh out.png COLS a.png b.png ...
out=$1; cols=$2; shift 2
args=(); n=0
for f in "$@"; do args+=(-i "$f"); n=$((n+1)); done
rows=$(( (n + cols - 1) / cols ))
ffmpeg -loglevel error -y "${args[@]}" -filter_complex "$(for i in $(seq 0 $((n-1))); do printf "[%d]" $i; done)concat=n=$n:v=1:a=0,tile=${cols}x${rows}" -frames:v 1 "$out"
