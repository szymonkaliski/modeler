const React = require("react");
const { Model, Subtract, Cube, Sphere } = require("../../modeler");

module.exports = () => (
  <Model>
    <Subtract>
      <Cube />
      <Sphere pos={[0, 1, 0]} />
    </Subtract>
  </Model>
);
