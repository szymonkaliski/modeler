const React = require("react");

module.exports = {
  Model: ({ children }) => (
    <div>
      <h1>Model</h1>
      <div>{children}</div>
    </div>
  ),

  Cube: () => <h2>Cube</h2>
};
