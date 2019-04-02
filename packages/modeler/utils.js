const { Geometry, Vector3, Face3 } = require("three");

const geometryFromPolygons = polygons => {
  const geometry = new Geometry();

  const getGeometryVertice = (geometry, v) => {
    geometry.vertices.push(new Vector3(v.x, v.y, v.z));
    return geometry.vertices.length - 1;
  };

  for (let i = 0; i < polygons.length; i++) {
    let vertices = [];

    for (let j = 0; j < polygons[i].vertices.length; j++) {
      vertices.push(getGeometryVertice(geometry, polygons[i].vertices[j].pos));
    }

    if (vertices[0] === vertices[vertices.length - 1]) {
      vertices.pop();
    }

    for (let j = 2; j < vertices.length; j++) {
      const face = new Face3(
        vertices[0],
        vertices[j - 1],
        vertices[j],
        new Vector3().copy(polygons[i].plane.normal)
      );

      geometry.faces.push(face);
    }
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  return geometry;
};

module.exports = { geometryFromPolygons };
