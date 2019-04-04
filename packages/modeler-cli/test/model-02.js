const React = require("react");
const {
  Model,
  RoundedCube,
  Sphere,
  Union,
  Subtract
} = require("../../modeler");

module.exports = () => (
  <Model>
    <Union>
      <Subtract>
        <Union>
          <RoundedCube radius={[1, 0.1, 2]} />
          <Sphere center={[1, 0, 0]} radius={1} />
        </Union>

        <Sphere center={[0, 1, 0]} />
      </Subtract>
    </Union>
  </Model>
);
