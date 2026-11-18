import {Composition} from 'remotion';
import {Promo} from './Promo';

const FPS = 30;
const DURATION = 15 * FPS;

export const Root = () => (
  <>
    <Composition id="Promo" component={Promo} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
    <Composition id="PromoVertical" component={Promo} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
  </>
);
