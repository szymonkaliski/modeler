const React = require("react");
const { Model, Sphere, Cube, Subtract } = require("../../modeler-csg");

const A = () => <Cube radius={[20, 2, 20]} />;
const B = () => <Sphere radius={10} />;

module.exports = () => (
  <Model>
    <Subtract>
      <A />
      <B />
    </Subtract>
  </Model>
);
