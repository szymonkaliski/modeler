const React = require("react");
const { Model, Sphere, Cube, Subtract } = require("../../modeler-csg");

const A = () => <Cube />;
const B = () => <Sphere radius={1.2} />;

module.exports = () => (
  <Model>
    <Subtract>
      <A />
      <B />
    </Subtract>
  </Model>
);
