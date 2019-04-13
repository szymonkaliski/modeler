const babelPresetReact = require("@babel/preset-react").default;
const babelify = require("babelify");
const browserify = require("browserify");
const chokidar = require("chokidar");
const createSocket = require("socket.io");
const fs = require("fs");
const getPort = require("get-port");
const path = require("path");
const watchifyMiddleware = require("watchify-middleware");
const { createServer } = require("http");

module.exports = ({ port, modelFile }) => {
  const modelBundler = browserify(modelFile, {
    cache: {},
    packageCache: {},
    basedir: process.cwd(),
    standalone: "MODELER_MODEL" // main trick - expose model function using window.MODELER_MODEL
  })
    .transform(babelify, {
      global: true,
      presets: [babelPresetReact]
    })
    .external("react");

  const watchify = watchifyMiddleware.emitter(modelBundler);

  watchify.on("error", e => {
    console.log(e.toString());
  });

  watchify.on("bundle-error", e => {
    console.log(e.toString());
  });

  const server = createServer((req, res) => {
    const vendorBundle = fs.readFileSync(
      path.join(__dirname, "bundle/vendor.js")
    );

    const frontendBundle = fs.readFileSync(
      path.join(__dirname, "bundle/frontend.js")
    );

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
            <script>
              window.MODELER_NAME = "${modelFile.replace(/^\.\//, "")}"
            </script>
            <script>${vendorBundle}</script>
            <script>${frontendBundle}</script>
          </body>
        </html>
      `);
    } else if (req.url.includes(modelFile.replace(/^\.\//, ""))) {
      watchify.middleware(req, res);
    }
  });

  const connections = {};
  const io = createSocket(server);

  io.on("connection", socket => {
    connections[socket.id] = socket;
    socket.on("disconnect", () => delete connections[socket.id]);
  });

  chokidar.watch(modelFile).on("all", () => {
    console.log(`${new Date().toLocaleString()}\tchange detected, reloading`);
    Object.values(connections).forEach(socket => socket.emit("reload"));
  });

  getPort({ port }).then(port =>
    server.listen(port, () =>
      console.log(`running on http://localhost:${port}`)
    )
  );
};
