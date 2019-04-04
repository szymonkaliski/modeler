const browserify = require("browserify");
const chokidar = require("chokidar");
const createSocket = require("socket.io");
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

  const run = ({ scripts }) => {
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
            <script>
              window.MODELER_NAME = "${modelFile.replace(/^\.\//, "")}"
            </script>
            <script>${scripts.vendor}</script>
            <script>${scripts.frontend}</script>
          </body>
        </html>
      `);
      } else if (req.url.includes(modelFile.replace(/^\.\//, ""))) {
        watchify(req, res);
      }
    });

    const connections = {};
    const io = createSocket(server);

    io.on("connection", socket => {
      connections[socket.id] = socket;
      socket.on("disconnect", () => delete connections[socket.id]);
    });

    chokidar
      .watch(modelFile)
      .on("all", () =>
        Object.values(connections).forEach(socket => socket.emit("reload"))
      );

    getPort({ port }).then(port =>
      server.listen(port, () =>
        console.log(`running on http://localhost:${port}`)
      )
    );
  };
  vendorBundler.bundle((err, vendor) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    frontendBundler.bundle((err, frontend) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      run({ scripts: { vendor, frontend } });
    });
  });
};
