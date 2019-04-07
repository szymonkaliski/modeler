const React = require("react");
const { CSG } = require("@jscad/csg");
const { MeshLambertMaterial, MeshBasicMaterial } = require("three");

const { geometryFromPolygons } = require("./utils");

const { useMemo } = React;

const Mesh = ({ model, material }) => {
  const polygons = useMemo(() => model.toPolygons(), [model]);
  const geometry = useMemo(() => geometryFromPolygons(polygons), [polygons]);

  return <mesh geometry={geometry} material={material} />;
};

const getToModel = node =>
  Array.isArray(node) ? node : getToModel(node.type(node.props));

const Model = ({ children, showParts = true }) => {
  const child = React.Children.only(children);

  let [model, parts] = getToModel(child);

  if (!parts) {
    parts = [model];
  } else if (!parts.length) {
    parts = [parts];
  }

  return (
    <>
      <Mesh model={model} material={new MeshLambertMaterial()} />
      {showParts &&
        parts.map((part, i) => (
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

const makeShape = (fnName, defaultValues) => values => {
  const shape = CSG[fnName]({ ...defaultValues, ...values });
  return [shape];
};

const makeOp = fnName => ({ children }) => {
  const childArray = React.Children.toArray(children).map(child =>
    getToModel(child)
  );

  return childArray.reduce((memo, [model, parts]) => {
    parts = parts || [model];

    if (!memo) {
      return [model, parts];
    }

    return [memo[0][fnName](model), [...memo[1], ...parts]];
  }, undefined);
};

const modelFromOnlyChild = children => {
  const child = React.Children.only(children);
  return getToModel(child);
};

const Rotate = ({
  children,
  rotationCenter = [0, 0, 0],
  rotationAxis = [1, 0, 0],
  degrees = 45
}) => {
  const [model, parts] = modelFromOnlyChild(children);
  return [model.rotate(rotationCenter, rotationAxis, degrees), parts];
};

const Translate = ({ children, translation = [1, 0, 0] }) => {
  const [model, parts] = modelFromOnlyChild(children);
  return [model.translate(translation), parts];
};

const Scale = ({ children, scale = [2, 2, 2] }) => {
  const [model, parts] = modelFromOnlyChild(children);
  return [model.scale(scale), parts];
};

module.exports = {
  Model,

  Sphere: makeShape("sphere", { center: [0, 0, 0], radius: 1, resolution: 32 }),

  Cube: makeShape("cube", { center: [0, 0, 0], radius: [1, 1, 1] }),
  RoundedCube: makeShape("roundedCube", {
    center: [0, 0, 0],
    radius: [1, 1, 1],
    roundradius: 0.1,
    resolution: 32
  }),

  Cylinder: makeShape("cylinder", {
    start: [0, 0, 0],
    end: [1, 0, 0],
    radius: 1,
    resolution: 32
  }),
  RoundedCylinder: makeShape("roundedCylinder", {
    start: [0, 0, 0],
    end: [1, 0, 0],
    radius: 1,
    resolution: 32
  }),
  EllipticCylinder: makeShape("cylinderElliptic", {
    start: [0, 0, 0],
    end: [1, 0, 0],
    radius: [1, 1],
    radiusStart: [1, 1],
    radiusEnd: [1, 1],
    resolution: 32
  }),

  Union: makeOp("union"),
  Subtract: makeOp("subtract"),
  Intersect: makeOp("intersect"),

  Rotate,
  Translate,
  Scale
};
