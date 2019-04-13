const React = require("react");
const { Model } = require("../../modeler-csg");

const A = () => <cube />;
const B = () => <sphere radius={1.2} />;

module.exports = () => (
  <Model>
    <subtract>
      <A />
      <B />
    </subtract>
  </Model>
);
