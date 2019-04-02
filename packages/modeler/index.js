const React = require("react");
const { CSG } = require("@jscad/csg");
const { MeshLambertMaterial } = require("three");

const { geometryFromPolygons } = require("./utils");

const { useMemo } = React;

const Model = ({ children }) => {
  const { type, props } = React.Children.only(children);
  const model = type(props);

  const polygons = useMemo(() => model.toPolygons(), [model]);
  const geometry = useMemo(() => geometryFromPolygons(polygons), [polygons]);

  return <mesh geometry={geometry} material={new MeshLambertMaterial()} />;
};

// TODO: size
const Cube = ({ pos = [0, 0, 0] }) =>
  CSG.cube().transform(CSG.Matrix4x4.translation(pos));

// TODO: r
const Sphere = ({ pos = [0, 0, 0] }) =>
  CSG.sphere().transform(CSG.Matrix4x4.translation(pos));

const reduceLeft = (xs, cb) => xs.slice(1).reduce(cb, xs[0]);

const Union = ({ children }) => {
  const childArray = React.Children.toArray(children).map(({ type, props }) =>
    type(props)
  );

  return reduceLeft(childArray, (memo, model) => memo.union(model));
};

const Subtract = ({ children }) => {
  const childArray = React.Children.toArray(children).map(({ type, props }) =>
    type(props)
  );

  return reduceLeft(childArray, (memo, model) => memo.subtract(model));
};

module.exports = {
  Model,
  Cube,
  Sphere,
  Union,
  Subtract
};
