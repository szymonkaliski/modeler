const { CSG } = require("@jscad/csg");
const Reconciler = require("react-reconciler");

const emptyObject = {};

let ROOT_NODE_INSTANCE = null;

const createElement = (type, props) => {
  console.log("createElement", { type, props });

  const TYPES = {
    ROOT: new CSG(),

    cube: CSG.cube(),
    sphere: CSG.sphere()
  };

  return TYPES[type];
};

const getHostContextNode = rootNode => {
  if (typeof rootNode !== undefined) {
    return (ROOT_NODE_INSTANCE = rootNode);
  } else {
    return (ROOT_NODE_INSTANCE = new CSG());
  }
};

const CSGRenderer = new Reconciler({
  appendChild(parent, child) {
    console.log("appendChild", { parent, child });
  },

  createInstance(type, props) {
    return createElement(type, props);
  },

  createTextInstance() {},

  finalizeInitialChildren() {
    return false;
  },

  getPublicInstance(inst) {
    return inst;
  },

  prepareForCommit() {},

  prepareUpdate() {
    return true;
  },

  resetAfterCommit() {},

  resetTextContent() {},

  getRootHostContext(instance) {
    return getHostContextNode(instance);
  },

  getChildHostContext() {
    return emptyObject;
  },

  shouldSetTextContent() {
    return false;
  },

  now() {},

  useSyncScheduling: true,

  supportsMutation: false,

  isPrimaryRenderer: false
});

class Cube {
  constructor(root, props) {
    console.log("CUBE", root, props)
  }

  appendChild(child) {
    console.log("CUBE appendChild", child)
  }
}

module.exports = {
  createElement,
  CSGRenderer,
  Cube
};
