const React = require("react");
const { Model, Cube, Sphere, Union, Subtract } = require("../../modeler");




module.exports = () => (
  <Model>
    <Subtract>
      <Union>
        <Cube />
        <Sphere pos={[1, 0, 0]} />
      </Union>

      <Sphere pos={[0, 1, 0]} />
    </Subtract>
  </Model>
);
