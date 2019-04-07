const React = require("react");
const {
  Model,
  RoundedCube,
  Sphere,
  Union,
  Subtract,
  Rotate,
  Translate,
  Scale
} = require("../../modeler-csg");

module.exports = () => (
  <Model>
    <Union>
      <Subtract>
        <Union>
          <Sphere center={[1, 0, 0]} radius={1} />
          <Scale scale={2.0}>
            <RoundedCube radius={[1, 0.1, 2]} />
          </Scale>
        </Union>

        <Sphere center={[0, 1, 0]} />
      </Subtract>
    </Union>
  </Model>
);
