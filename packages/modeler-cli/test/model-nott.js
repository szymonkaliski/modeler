const React = require("react");
const { Model } = require("../../modeler-csg");

const range = n => Array.from({ length: n }).map((_, i) => i);

const USE_ENV = process.env.RENDER_TOP || process.env.RENDER_BOTTOM;
const RENDER_TOP = USE_ENV ? process.env.RENDER_TOP === "true" : true;
const RENDER_BOTTOM = USE_ENV ? process.env.RENDER_BOTTOM === "true" : false;

// in CM
const MONOME_SIZE = [24, 12];
const TOP_SIZE = [MONOME_SIZE[0], 5.5];
const PLATE_MARGIN = 0.5;
const PLATE_HEIGHT = 0.25;

const TopPlate = () => (
  <cube
    radius={[
      MONOME_SIZE[0] / 2 + PLATE_MARGIN,
      PLATE_HEIGHT / 2,
      (TOP_SIZE[1] + MONOME_SIZE[1]) / 2 + PLATE_MARGIN
    ]}
    position={[0, , 0]}
    center={[0, PLATE_HEIGHT / 2]}
  />
);

const Dial = ({ yOffset }) => {
  const r = 0.7 / 2;
  const x = MONOME_SIZE[0] / 2 - 6.8;
  const y = -(MONOME_SIZE[1] + TOP_SIZE[1]) / 2 + yOffset;

  return <cylinder radius={r} start={[x, 0, y]} end={[x, 1, y]} />;
};

const MonomeButtons = () => (
  <>
    {range(16).map(i =>
      range(8).map(j => {
        const size = 1;
        const x = -MONOME_SIZE[0] / 2 + size / 2 + 0.2 + i * (size + 0.5);
        const y =
          -MONOME_SIZE[1] / 2 +
          size / 2 +
          0.2 +
          j * (size + 0.5) +
          TOP_SIZE[1] / 2;

        return (
          <cube key={`${i}-${j}`} radius={size / 2} center={[x, size / 2, y]} />
        );
      })
    )}
  </>
);

const MonomeScrewes = () => (
  <>
    {range(8).map(i =>
      range(4).map(j => {
        const r = 0.2;
        const x = -MONOME_SIZE[0] / 2 + 1.45 + i * 3;
        const y = -MONOME_SIZE[1] / 2 + 1.45 + j * 3 + TOP_SIZE[1] / 2;

        return <cylinder radius={r / 2} start={[x, 0, y]} end={[x, 1, y]} />;
      })
    )}
  </>
);

const PiSoundScrewes = () => (
  <>
    {[[-1.8, 0.4], [-1.8, 5.2], [-7.6, 0.4], [-7.6, 5.2]].map(([ox, oy]) => {
      const r = 0.4;

      const x = MONOME_SIZE[0] / 2 + ox;
      const y = -(MONOME_SIZE[1] + TOP_SIZE[1]) / 2 + oy;

      return <cylinder radius={r / 2} start={[x, 0, y]} end={[x, 1, y]} />;
    })}
  </>
);

const RaspberryScrewes1 = () => (
  <>
    {[[-1.8, 0.4], [-1.8, 5.2], [-7.6, 0.4], [-7.6, 5.2]].map(([ox, oy]) => {
      const r = 0.4;

      const x = MONOME_SIZE[0] / 2 + ox;
      const y = -(MONOME_SIZE[1] + TOP_SIZE[1]) / 2 + oy;

      return <cylinder radius={r / 2} start={[x, 0, y]} end={[x, 1, y]} />;
    })}
  </>
);

const RaspberryScrewes2 = () => (
  <>
    {[[2.3, 0.4], [2.3, 5.2], [8.1, 0.4], [8.1, 5.2]].map(([ox, oy]) => {
      const r = 0.4;

      const x = -MONOME_SIZE[0] / 2 + ox;
      const y = -(MONOME_SIZE[1] + TOP_SIZE[1]) / 2 + oy;

      return <cylinder radius={r / 2} start={[x, 0, y]} end={[x, 1, y]} />;
    })}
  </>
);

const PlateScrewes = () => (
  <>
    {[
      [-0.25, -0.25],
      [-0.25, MONOME_SIZE[1] + TOP_SIZE[1] + 0.25],
      [MONOME_SIZE[0] + 0.25, -0.25],
      [MONOME_SIZE[0] + 0.25, MONOME_SIZE[1] + TOP_SIZE[1] + 0.25]
    ].map(([ox, oy]) => {
      const r = 0.2;

      const x = -MONOME_SIZE[0] / 2 + ox;
      const y = -(MONOME_SIZE[1] + TOP_SIZE[1]) / 2 + oy;

      return <cylinder radius={r / 2} start={[x, 0, y]} end={[x, 1, y]} />;
    })}
  </>
);

module.exports = () => (
  <Model showParts={true}>
    <subtract>
      <TopPlate />

      {RENDER_TOP && <MonomeButtons />}
      {RENDER_TOP && <MonomeScrewes />}
      {RENDER_TOP && [1.7, 3.7].map(offset => <Dial yOffset={offset} />)}

      {RENDER_TOP && <PiSoundScrewes />}

      {(RENDER_TOP || RENDER_BOTTOM) && <RaspberryScrewes1 />}
      {RENDER_BOTTOM && <RaspberryScrewes2 />}
      {(RENDER_TOP || RENDER_BOTTOM) && <PlateScrewes />}
    </subtract>
  </Model>
);
