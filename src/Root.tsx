import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Proof } from "./Proof";
import { Showcase } from "./Showcase";
import { Tutorial } from "./Tutorial";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="Proof"
        component={Proof}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Showcase"
        component={Showcase}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Tutorial"
        component={Tutorial}
        durationInFrames={1146}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
