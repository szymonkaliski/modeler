const browserify = require("browserify");
const chokidar = require("chokidar");
const fs = require("fs");
const getPort = require("get-port");
const watchifyMiddleware = require("watchify-middleware");
const { argv } = require("yargs");
const { createServer } = require("http");
const path = require("path");

const [modelFile] = argv._;
const port = argv.port || 3000;
const debug = argv.d || argv.debug;

if (!fs.existsSync(modelFile)) {
  console.log(`${modelFile} not found, exiting`);
  process.exit(1);
}

const modelBundler = browserify(modelFile, {
  cache: {},
  packageCache: {},
  basedir: process.cwd(),
  debug,
  standalone: "MODELER_MODEL" // the trick - expose model function using window.MODELER_MODEL
})
  .transform("babelify", { presets: ["@babel/react"] })
  .external("react");

const watchify = watchifyMiddleware(modelBundler);

const frontendBundler = browserify(path.join(__dirname, "frontend.js"))
  .transform("babelify", { presets: ["@babel/react"] })
  .external("react")
  .external("react-dom");

const vendorBundler = browserify()
  .require("react")
  .require("react-dom");

vendorBundler.bundle((err, vendor) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  frontendBundler.bundle((err, bundled) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    const server = createServer((req, res) => {
      if (req.url === "/") {
        res.end(`
          <html>
            <head>
              <title>modeler: ${modelFile}</title>
              <style>
                body {
                  margin: 0;
                }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script>${vendor}</script>
              <script src="/${modelFile.replace(/^\.\//, "")}"></script>
              <script>${bundled}</script>
            </body>
          </html>
        `);
      } else if (req.url.includes(modelFile.replace(/^\.\//, ""))) {
        watchify(req, res);
      }
    });

    getPort({ port }).then(port => {
      server.listen(port, () => {
        console.log(`running on http://localhost:${port}`);
      });
    });
  });
});
