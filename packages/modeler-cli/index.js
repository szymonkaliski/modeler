const fs = require("fs");
const { argv } = require("yargs");

const server = require("./server");
const toSTL = require("./to-stl");

const [modelFile] = argv._;
const port = argv.port || 3000;
const stl = argv.stl;

if (!fs.existsSync(modelFile)) {
  console.log(`${modelFile} not found, exiting`);
  process.exit(1);
}

if (!stl) {
  server({ port, modelFile });
} else {
  toSTL({ modelFile, outFile: stl });
}
