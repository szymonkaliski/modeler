const OrbitControls = require("three-orbitcontrols");
const React = require("react");
const ReactDOM = require("react-dom");
const load = require("load-script2");
const { Canvas, useThree } = require("react-three-fiber");
const { ClientSocket, useSocket } = require("use-socketio");
const { SphereGeometry, MeshBasicMaterial } = require("three");

const { useRef, useEffect, useState } = React;

const DEBUG_LIGHT = false;

const Main = () => {
  const { camera, canvas } = useThree();
  const orbitControls = useRef();
  const [modelFn, setModelFn] = useState(null);

  const loadModel = () => {
    load(`/${window.MODELER_NAME}`, err => {
      if (err) {
        return console.error(err);
      }

      if (window.MODELER_MODEL) {
        setModelFn(window.MODELER_MODEL);
      }
    });
  };

  useSocket("reload", () => loadModel());
  useEffect(() => loadModel(), []);

  useEffect(() => {
    orbitControls.current = new OrbitControls(camera, canvas);
    orbitControls.current.enableDamping = false;
    orbitControls.current.enableZoom = true;
  }, [camera, canvas]);

  const lightPosition = [0, 100, 0];

  return (
    <>
      <ambientLight color={0x888888} />
      <spotLight position={lightPosition} />

      {DEBUG_LIGHT && (
        <mesh
          geometry={new SphereGeometry(0.05, 0.05, 0.05)}
          position={lightPosition}
          material={new MeshBasicMaterial({ color: 0x000000 })}
        />
      )}

      <gridHelper args={[100, 1000, 0xeeeeee, 0xeeeeee]} />
      <gridHelper args={[100, 100, 0xaaaaaa, 0xaaaaaa]} />

      {modelFn}
    </>
  );
};

const App = () => (
  <div style={{ width: "100vw", height: "100vh" }}>
    <Canvas style={{ background: "#dddddd" }}>
      <ClientSocket url={document.location.origin}>
        <Main />
      </ClientSocket>
    </Canvas>
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
