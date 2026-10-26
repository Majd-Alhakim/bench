import { Composition, Still } from "remotion";
import { Card, Count, CountProps, Screen } from "./Card";
import { IMAGES } from "./images";
import { EyeSheet } from "./mg/EyeSheet";
import { V1, V1_FRAMES } from "./mg/V1";
import { Format, LAYOUTS, Short } from "./Short";
import { FPS, VIDEOS, durationOf } from "./videos";

const FORMATS: Format[] = ["v", "h", "s"];

/** One composition per video and format: V1-v (9:16), V1-h (16:9), V1-s (1:1). */
export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.flatMap((video) =>
      FORMATS.map((format) => (
        <Composition
          key={`${video.id}-${format}`}
          id={`${video.id}-${format}`}
          component={Short}
          defaultProps={{ video, format }}
          durationInFrames={durationOf(video)}
          fps={FPS}
          width={LAYOUTS[format].w}
          height={LAYOUTS[format].h}
        />
      )),
    )}
    {IMAGES.map(({ id, width, height, ...card }) => (
      <Still key={id} id={id} component={Card} defaultProps={{ ...card, width, height }} width={width} height={height} />
    ))}
    {/* The evening count: npx remotion still count-square out/day3.png --props='{"day":3,"n":47,"goal":100,"line":"..."}' */}
    {([["count-square", 1200, 1200], ["count-wide", 1600, 900]] as const).map(([id, width, height]) => (
      <Still
        key={id}
        id={id}
        component={Count}
        defaultProps={{ day: 1, n: 0, goal: 100, line: "If 100 people join by Sunday, I build it.", width, height } satisfies CountProps & { width: number; height: number }}
        width={width}
        height={height}
      />
    ))}
    {(["h", "v", "s"] as const).map((fmt) => (
      <Composition key={fmt} id={`MG-V1-${fmt}`} component={V1} defaultProps={{ fmt }} durationInFrames={V1_FRAMES} fps={30} width={fmt === "v" ? 1080 : fmt === "h" ? 1920 : 1080} height={fmt === "v" ? 1920 : 1080} />
    ))}
    <Still id="eye-sheet" component={EyeSheet} width={1440} height={900} />
    {/* Product Hunt thumbnail: the notch at rest, Calm eyes. */}
    <Still
      id="ph-thumb"
      component={() => (
        <div style={{ position: "absolute", inset: 0, background: "#0b0c11" }}>
          <Screen route="n-rest" focus={[880, 0, 160, 80]} area={[0, 80, 240, 120]} maxZoom={8} bare />
        </div>
      )}
      width={240}
      height={240}
    />
  </>
);
