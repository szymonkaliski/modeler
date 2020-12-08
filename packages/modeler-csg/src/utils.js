const { Geometry, Vector3, Face3, Color } = require("three");

const geometryFromPolygons = polygons => {
  const geometry = new Geometry();

  // @todo de-duplicate
  const getGeometryVertice = (v) => {
    geometry.vertices.push(new Vector3(v.x, v.y, v.z));
    return geometry.vertices.length - 1;
  };

  for (let i = 0; i < polygons.length; i++) {
    let vertices = [];

    for (let j = 0; j < polygons[i].vertices.length; j++) {
      vertices.push(getGeometryVertice(polygons[i].vertices[j].pos));
    }

    if (vertices[0] === vertices[vertices.length - 1]) {
      vertices.pop();
    }

    for (let j = 2; j < vertices.length; j++) {
      const normal = polygons[i].plane.normal;
      const color = polygons[i].shared.color;

      const face = new Face3(
        vertices[0],
        vertices[j - 1],
        vertices[j],
        new Vector3(normal.x, normal.y, normal.z),
        color
          ? new Color(
              ((color[0] * 255) << 16) |
                ((color[1] * 255) << 8) |
                (color[2] * 255)
            )
          : undefined
      );

      geometry.faces.push(face);
    }
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  return geometry;
};

module.exports = { geometryFromPolygons };
