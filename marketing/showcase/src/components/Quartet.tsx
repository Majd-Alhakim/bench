import React from "react";
import { C, QUARTET, SHAPE_NAMES, ShapeName } from "../brand";
import { Eyes } from "./Eyes";

export type ShapePose = {
  dx?: number;
  dy?: number;
  rotate?: number;
  scale?: number;
  /** 0 = no eyes, 1 = eyes fully open. */
  eyes?: number;
  lookX?: number;
  lookY?: number;
};

type Props = {
  size: number;
  colour?: boolean;
  fill?: string;
  eyeFill?: string;
  poses?: Partial<Record<ShapeName, ShapePose>>;
  style?: React.CSSProperties;
};

/** The Quartet mark; each shape can move, tilt and wake up with the Look. */
export const Quartet: React.FC<Props> = ({ size, colour = false, fill = C.ink, eyeFill = C.porcelain, poses = {}, style }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: "visible", ...style }}>
    {SHAPE_NAMES.map((name) => {
      const s = QUARTET[name];
      const p = poses[name] ?? {};
      const [cx, cy] = s.centre;
      const t = `translate(${cx + (p.dx ?? 0)} ${cy + (p.dy ?? 0)}) rotate(${p.rotate ?? 0}) scale(${p.scale ?? 1}) translate(${-cx} ${-cy})`;
      return (
        <g key={name} transform={t}>
          <path d={s.d} fill={colour ? s.colour : fill} />
          {(p.eyes ?? 0) > 0 && (
            <Eyes
              x={s.eyes[0]}
              y={s.eyes[1]}
              gap={6.2}
              w={3.6}
              open={p.eyes ?? 0}
              lookX={p.lookX}
              lookY={p.lookY}
              fill={colour ? C.white : eyeFill}
            />
          )}
        </g>
      );
    })}
  </svg>
);
