const React = require("react");
const { Model } = require("../../modeler-csg");

module.exports = () => (
  <Model>
    <subtract>
      <cube />
      <sphere radius={1.3} />
    </subtract>
  </Model>
);
