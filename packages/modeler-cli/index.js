#!/usr/bin/env node

const fs = require("fs");
const yargs = require("yargs");

const server = require("./server");
const toSTL = require("./to-stl");

const { argv } = yargs
  .usage("Usage: $0 --model [model-file.js] [command]")
  .option("model", { alias: "m", describe: "input model file", type: "string" })
  .demandOption("model", "Model file has to be provided")
  .command("preview", "serve live-reload preview", yargs =>
    yargs.option("port", {
      alias: "p",
      describe: "port to server from",
      type: "number"
    })
  )
  .command("export", "export to STL file", yargs =>
    yargs
      .option("out", {
        alias: "o",
        describe: "output STL file",
        type: "string"
      })
      .demandOption("out", "Output file has to be provided")
  )
  .demandCommand(1, 1, "One command has to be provided");

const [command] = argv._;
const modelFile = argv.model;
const port = argv.port || 3000;
const stl = argv.out;

if (!fs.existsSync(modelFile)) {
  console.log(`${modelFile} not found, exiting`);
  process.exit(1);
}

if (command === "preview") {
  server({ port, modelFile });
}

if (command === "export") {
  toSTL({ modelFile, outFile: stl });
}
