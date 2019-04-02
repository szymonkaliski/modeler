const OrbitControls = require("three-orbitcontrols");
const React = require("react");
const ReactDOM = require("react-dom");
const { Canvas, useThree } = require("react-three-fiber");
const { SphereGeometry, MeshBasicMaterial } = require("three");

const { useRef, useEffect } = React;

const DEBUG_LIGHT = false;

const Main = () => {
  const { camera, canvas } = useThree();
  const orbitControls = useRef();

  useEffect(() => {
    orbitControls.current = new OrbitControls(camera, canvas);
    orbitControls.current.enableDamping = false;
    orbitControls.current.enableZoom = true;
  }, [camera, canvas]);

  const lightPosition = [0, 10, 0];

  return (
    <>
      <ambientLight color="#333333" />
      <spotLight position={lightPosition} />

      {DEBUG_LIGHT && (
        <mesh
          geometry={new SphereGeometry(0.05, 0.05, 0.05)}
          position={lightPosition}
          material={new MeshBasicMaterial({ color: 0x000000 })}
        />
      )}

      <gridHelper args={[100, 1000, 0xbbbbbb, 0xcccccc]} />
      <gridHelper args={[100, 100, 0x888888, 0x888888]} />

      {window.MODELER_MODEL()}
    </>
  );
};

const App = () => (
  <div style={{ width: "100vw", height: "100vh"}}>
    <Canvas style={{ background: "#dddddd" }}>
      <Main />
    </Canvas>
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
