const React = require("react");
const { MeshLambertMaterial } = require("three");

const { useMemo } = React;

const { geometryFromPolygons } = require("./utils");
const { createElement, CSGRenderer } = require("./reconciler");

let ROOT = null;

const Mesh = ({ model, material }) => {
  const polygons = useMemo(() => model.toPolygons(), [model]);
  const geometry = useMemo(() => geometryFromPolygons(polygons), [polygons]);

  return <mesh geometry={geometry} material={material} />;
};

const Model = ({ children }) => {
  if (!ROOT) {
    ROOT = CSGRenderer.createContainer(createElement("ROOT"));
  }

  CSGRenderer.updateContainer(children, ROOT, null);
  const model = CSGRenderer.getPublicRootInstance(ROOT);

  return <Mesh model={model.csg} material={new MeshLambertMaterial()} />;
};

module.exports = {
  Model
};
