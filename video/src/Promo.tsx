import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const bg = '#0b0b14';
const accent = '#7c5cff';

const Title: React.FC<{text: string; sub?: string}> = ({text, sub}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14}});
  const opacity = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 80}}>
      <div style={{fontSize: 120, fontWeight: 800, color: 'white', transform: `scale(${0.8 + 0.2 * s})`, opacity}}>{text}</div>
      {sub && <div style={{fontSize: 48, color: '#b9b9d0', marginTop: 24, opacity}}>{sub}</div>}
    </AbsoluteFill>
  );
};

export const Promo: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 30% 20%, ${accent}55, ${bg} 60%)`, fontFamily: 'system-ui, sans-serif'}}>
    <Sequence from={0} durationInFrames={150}><Title text="QRVibe" sub="Free QR code generator" /></Sequence>
    <Sequence from={150} durationInFrames={150}><Title text="Custom. Scannable. Free." sub="Colors, logos, shapes — no signup" /></Sequence>
    <Sequence from={300} durationInFrames={150}><Title text="Try it now" sub="Edit src/Promo.tsx to change this" /></Sequence>
  </AbsoluteFill>
);
