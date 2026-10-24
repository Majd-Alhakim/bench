import React from "react";

type Props = {
  x: number;
  y: number;
  /** Distance from the centre to each eye (the prototype's `gap`). */
  gap: number;
  /** Eye width; height is 2.3x (the Look's calm pills). */
  w: number;
  /** 0 = closed, 1 = open. */
  open: number;
  lookX?: number;
  lookY?: number;
  fill: string;
};

/** The Look: two slanted pills, -12 degrees, as on every agent avatar (BRAND.md section 5). */
export const Eyes: React.FC<Props> = ({ x, y, gap, w, open, lookX = 0, lookY = 0, fill }) => {
  const h = w * 2.3 * Math.max(open, 0.08);
  return (
    <g fill={fill}>
      {[-gap, gap].map((dx) => {
        const cx = x + dx + lookX;
        const cy = y + lookY;
        return (
          <rect
            key={dx}
            x={cx - w / 2}
            y={cy - h / 2}
            width={w}
            height={h}
            rx={Math.min(w, h) / 2}
            transform={`rotate(-12 ${cx} ${cy})`}
          />
        );
      })}
    </g>
  );
};
