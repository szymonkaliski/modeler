const browserify = require("browserify");
const fs = require("fs");
const { CSG } = require("@jscad/csg");
const { stlSerializer } = require("@jscad/io");

module.exports = ({ modelFile, outFile }) =>
  browserify(modelFile, {
    node: true,
    basedir: process.cwd()
  })
    .transform("babelify", { presets: ["@babel/react"] })
    .external("react")
    .external("react-dom")
    .external("three")
    .bundle((err, code) => {
      let evaled;

      try {
        evaled = eval(code.toString());
      } catch (err) {
        console.error(err);
        process.exit(1);
      }

      if (evaled) {
        // black magic below

        const createNode = evaled(1); // no idea why `1`
        const node = createNode();

        // <Model /> allows only one child
        const firstChild = node.props.children;

        // we only care about the model, not the parts
        const [model, _] = firstChild.type(firstChild.props);

        const MM = 10;

        const scaledModel = model.transform(
          CSG.Matrix4x4.scaling([MM, MM, MM])
        );

        const rawData = stlSerializer.serialize(scaledModel, { binary: false });

        fs.writeFileSync(outFile, rawData.join());
      }
    });
