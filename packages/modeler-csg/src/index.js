const React = require("react");
const { MeshStandardMaterial, MeshBasicMaterial } = require("three");

const { createElement, CSGRenderer } = require("./reconciler");
const { geometryFromPolygons } = require("./utils");

let ROOT = null;

const Mesh = ({ model, material }) => {
  const polygons = model.toPolygons();
  const geometry = geometryFromPolygons(polygons);

  return <mesh geometry={geometry} material={material} />;
};

const Model = ({
  children,
  showParts = false,
  showModel = true,
  modelMaterial = new MeshStandardMaterial({
    roughness: 1.0,
    metalness: 0.0,
    color: 0x333333
  }),
  partsMaterial = new MeshBasicMaterial({ wireframe: true, color: 0x888888 })
}) => {
  React.Children.only(children);

  if (!ROOT) {
    ROOT = CSGRenderer.createContainer(createElement("ROOT"));
  }

  CSGRenderer.updateContainer(children, ROOT, null);
  const model = CSGRenderer.getPublicRootInstance(ROOT);

  return (
    <>
      {showModel && <Mesh model={model.csg} material={modelMaterial} />}

      {showParts &&
        (model.parts || []).map((part, i) => (
          <Mesh key={i} model={part} material={partsMaterial} />
        ))}
    </>
  );
};

module.exports = { Mesh, Model };
