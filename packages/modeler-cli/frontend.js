const React = require("react");
const ReactDOM = require("react-dom");

console.log("model", window.MODELER_MODEL);

const App = () => <div>{window.MODELER_MODEL()}</div>;

ReactDOM.render(<App />, document.getElementById("root"));
