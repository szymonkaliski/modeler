const React = require("react");
const { Model, Subtract, Cube, Sphere } = require("../../modeler-csg");

module.exports = () => (
  <Model>
    <subtract>
      <cube />
      <sphere radius={1.3} />
    </subtract>

    {/* <Subtract> */}
    {/*   <Cube /> */}
    {/*   <Sphere radius={1.3} /> */}
    {/* </Subtract> */}
  </Model>
);
