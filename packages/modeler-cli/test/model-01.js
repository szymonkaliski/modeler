const React = require("react");
const { Model, Subtract, Cube, Sphere } = require("../../modeler-csg");

module.exports = () => (
  <Model>
    <Subtract>
      <Cube />
      <Sphere radius={1.3} />
    </Subtract>
  </Model>
);
