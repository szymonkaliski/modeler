const React = require("react");
const { Model } = require("../../modeler-csg");

module.exports = () => (
  <Model>
    <subtract>
      <union>
        <sphere center={[1, 0, 0]} radius={1} />
        <roundedCube radius={[1, 0.1, 2]} />
      </union>

      <sphere center={[0, 1, 0]} />
    </subtract>
  </Model>
);
