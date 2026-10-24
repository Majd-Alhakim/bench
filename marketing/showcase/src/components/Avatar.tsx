import React from "react";
import { AVATAR, AvatarShape, C } from "../brand";
import { Eyes } from "./Eyes";

type Props = { shape: AvatarShape; hue: string; size: number; open?: number; lookX?: number; lookY?: number };

/** A flat agent avatar: the body in its hue, white eyes (BRAND.md section 8). */
export const Avatar: React.FC<Props> = ({ shape, hue, size, open = 1, lookX = 0, lookY = 0 }) => {
  const a = AVATAR[shape];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <path d={a.d} fill={hue} />
      <Eyes x={a.eye[0]} y={a.eye[1]} gap={a.eye[2]} w={7} open={open} lookX={lookX} lookY={lookY} fill={C.white} />
    </svg>
  );
};
