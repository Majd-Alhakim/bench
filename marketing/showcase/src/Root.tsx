import { Composition } from "remotion";
import { Showcase } from "./Showcase";
import { DURATION, FPS } from "./timeline";

export const RemotionRoot: React.FC = () => (
  <Composition id="EucasShowcase" component={Showcase} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
);
