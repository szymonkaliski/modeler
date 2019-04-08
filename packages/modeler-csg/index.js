const React = require("react");

const { createElement, CSGRenderer } = require("./reconciler");

const Model = ({ children }) => {
  console.log({ CSGRenderer });
  console.log({ children });

  const container = createElement("ROOT");
  console.log({ container });
  const node = CSGRenderer.createContainer(container);
  console.log({ node });
  CSGRenderer.updateContainer(children, node, null);

  console.log({ container });

  return null;
};

module.exports = {
  Model
};
