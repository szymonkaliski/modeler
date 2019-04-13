const React = require("react");
const { MeshLambertMaterial, MeshBasicMaterial } = require("three");

const { useMemo } = React;

const { createElement, CSGRenderer } = require("./reconciler");
const { geometryFromPolygons } = require("./utils");

let ROOT = null;

const Mesh = ({ model, material }) => {
  const polygons = useMemo(() => model.toPolygons(), [model]);
  const geometry = useMemo(() => geometryFromPolygons(polygons), [polygons]);

  return <mesh geometry={geometry} material={material} />;
};

const Model = ({ children, showParts }) => {
  if (!ROOT) {
    ROOT = CSGRenderer.createContainer(createElement("ROOT"));
  }

  CSGRenderer.updateContainer(children, ROOT, null);
  const model = CSGRenderer.getPublicRootInstance(ROOT);

  return (
    <>
      <Mesh model={model.csg} material={new MeshLambertMaterial()} />

      {showParts &&
        (model.parts || []).map((part, i) => (
          <Mesh
            key={i}
            model={part}
            material={
              new MeshBasicMaterial({ wireframe: true, color: 0x888888 })
            }
          />
        ))}
    </>
  );
};

module.exports = {
  Model
};
