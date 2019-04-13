const Reconciler = require("react-reconciler");
const { CSG } = require("@jscad/csg");

const childHostContext = {};
const rootHostContext = {};

const makeOp = op => {
  const Op = class {
    appendChild(child) {
      if (!this.csg) {
        this.csg = new CSG();
        this.csg = this.csg.union(child.csg);
        this.parts = [child.csg];
      } else {
        this.csg = this.csg[op](child.csg);
        this.parts = [...this.parts, child.csg];
      }
    }
  };

  return new Op();
};

const makeShape = (fnName, defaultProps = {}) => props => {
  const csg = CSG[fnName]({ ...defaultProps, ...props });
  return { csg };
};

const createElement = (type, props) => {
  const TYPES = {
    ROOT: () => makeOp("union"),

    sphere: makeShape("sphere", {
      center: [0, 0, 0],
      radius: 1,
      resolution: 32
    }),

    cube: makeShape("cube", { center: [0, 0, 0], radius: [1, 1, 1] }),

    roundedCube: makeShape("roundedCube", {
      center: [0, 0, 0],
      radius: [1, 1, 1],
      roundradius: 0.1,
      resolution: 32
    }),

    cylinder: makeShape("cylinder", {
      start: [0, 0, 0],
      end: [1, 0, 0],
      radius: 1,
      resolution: 32
    }),

    roundedCylinder: makeShape("roundedCylinder", {
      start: [0, 0, 0],
      end: [1, 0, 0],
      radius: 1,
      resolution: 32
    }),

    ellipticCylinder: makeShape("cylinderElliptic", {
      start: [0, 0, 0],
      end: [1, 0, 0],
      radius: [1, 1],
      radiusStart: [1, 1],
      radiusEnd: [1, 1],
      resolution: 32
    }),

    union: () => makeOp("union"),
    subtract: () => makeOp("subtract"),
    intersect: () => makeOp("intersect")
  };

  const ret = TYPES[type](props);
  ret.type = type;

  return ret;
};

const CSGRenderer = new Reconciler({
  useSyncScheduling: true,
  supportsMutation: true,
  isPrimaryRenderer: false,

  now: Date.now,

  getRootHostContext() {
    return rootHostContext;
  },

  getChildHostContext() {
    return childHostContext;
  },

  shouldSetTextContent() {
    return false;
  },

  prepareForCommit() {},

  resetAfterCommit() {},

  createInstance(type, props) {
    return createElement(type, props);
  },

  finalizeInitialChildren() {},

  appendInitialChild(parent, child) {
    parent.appendChild(child);
  },

  appendChild(parent, child) {
    parent.appendChild(child);
  },

  removeChild(parent, child) {
    console.warn("removeChild not implemented!", { parent, child });
  },

  appendChildToContainer(parent, child) {
    parent.appendChild(child);
  },

  getPublicInstance(instance) {
    return instance;
  }
});

module.exports = {
  createElement,
  CSGRenderer
};
