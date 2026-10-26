#!/usr/bin/env bash
# Renders stills of one composition at the given frames and joins them into one contact sheet.
#   bash scripts/sheet.sh V1-v out/sheet.png 45 120 260
id=$1; out=$2; shift 2
args=(); i=0
for f in "$@"; do npx remotion still "$id" "out/_s$i.png" --frame="$f" --log=error >/dev/null 2>&1; args+=(-i "out/_s$i.png"); i=$((i+1)); done
ffmpeg -loglevel error -y "${args[@]}" -filter_complex "hstack=$i,scale=1900:-1" "$out"
rm -f out/_s*.png
