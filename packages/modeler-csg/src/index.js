const React = require("react");
const { MeshStandardMaterial, MeshBasicMaterial } = require("three");

const { createElement, CSGRenderer } = require("./reconciler");
const { geometryFromPolygons } = require("./utils");

const Mesh = ({ model, material }) => {
  const geometry = React.useMemo(() => {
    const polygons = model.toPolygons();
    return geometryFromPolygons(polygons);
  }, [model]);

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
  // read children once
  const childrenRef = React.useRef(children);

  // generate the model
  const root = React.useMemo(() => {
    // content accumulator object as fiber container root
    const rootObject = createElement("ROOT");

    // create and populate fiber tree
    const fiberContainer = CSGRenderer.createContainer(rootObject);
    CSGRenderer.updateContainer(childrenRef.current, fiberContainer, null);

    // read directly from root object
    // (using getPublicRootInstance on root fiber node does not return entire content)
    return rootObject;
  }, []);

  return (
    <>
      {showModel && <Mesh model={root.csg} material={modelMaterial} />}

      {showParts &&
        (root.parts || []).map((part, i) => (
          <Mesh key={i} model={part} material={partsMaterial} />
        ))}
    </>
  );
};

const Geometry = ({ attach = "geometry", children }) => {
  // read children once
  const childrenRef = React.useRef(children);

  // generate the model
  const model = React.useMemo(() => {
    // content accumulator object as fiber container root
    const rootObject = createElement("ROOT");

    // create and populate fiber tree
    const fiberContainer = CSGRenderer.createContainer(rootObject);
    CSGRenderer.updateContainer(childrenRef.current, fiberContainer, null);

    // read directly from root object
    // (using getPublicRootInstance on root fiber node does not return entire content)
    return rootObject.csg;
  }, []);

  // convert CSG model polygons to Three
  const geometry = React.useMemo(() => {
    const polygons = model.toPolygons();
    return geometryFromPolygons(polygons);
  }, [model]);

  return <primitive attach={attach} object={geometry} />;
};

module.exports = { Mesh, Model, Geometry };
