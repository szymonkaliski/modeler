const React = require("react");
const ReactDOM = require("react-dom");
const { Canvas } = require("react-three-fiber");
const { Model } = require("modeler-csg");

ReactDOM.render(
  <Canvas>
    <ambientLight color={0x888888} />
    <spotLight position={[0, 10, 10]} />

    <Model>
      <subtract>
        <cube />
        <sphere radius={1.3} />
      </subtract>
    </Model>
  </Canvas>,
  document.getElementById("root")
);
