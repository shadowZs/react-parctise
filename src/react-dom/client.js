import { REACT_TEXT, REACT_FORWARDREF } from "./constants";
import { isUndefined, isDefined, wrapToArray, wrapToVdom } from "./util";
import { setEventDelegation } from "./event";

let currentVdom = null;
let currentRoot = null;
let currentRootVdom = null;
function createRoot(container) {
  const root = {
    render(rootVdom) {
      currentRootVdom = rootVdom;

      mountVdom(rootVdom, container);
      setEventDelegation(container);
    },

    // update root vdom when hooks changed
    update() {
      compareVdom(container, currentRootVdom, currentRootVdom);
    },
  };

  currentRoot = root;

  return root;
}

// convert vdom to real dom
export function createDOMElement(vdom) {
  if (isUndefined(vdom)) return null;
  const { type } = vdom;
  if (type?.$$typeof === REACT_FORWARDREF) {
    return createForwardComponent(vdom);
  }
  if (vdom?.$$typeof === REACT_TEXT) {
    return createTextComponent(vdom);
  } else if (typeof type === "function") {
    // isReactComponent figure out it's a class component
    if (type.isReactComponent) {
      return createClassComponent(vdom);
    }
    return createFunctionComponent(vdom);
  } else {
    return createNativeComponent(vdom);
  }
}

/**
 * create text component
 * @param {*} vdom
 * @returns domElement
 */
function createTextComponent(vdom) {
  const domElement = document.createTextNode(vdom.props);
  vdom.domElement = domElement;
  return domElement;
}

function createForwardComponent(vdom) {
  const { type, props, ref } = vdom;
  const { render } = type;
  const renderVdom = render(props, ref);

  vdom.oldRenderVdom = renderVdom;
  return createDOMElement(renderVdom);
}

function createClassComponent(vdom) {
  const { type, props, ref } = vdom;
  const instance = new type(props);
  instance?.componentWillMount?.();

  const renderVdom = instance.render();

  const domElement = createDOMElement(renderVdom);

  // domElement.componentDidMount = instance?.componentDidMount;

  if (ref) {
    ref.current = instance;
  }

  // save renderVdom and instance in instance to force update
  // as forceUpdate can't get vdom, so mount the oldRenderVdom in instance
  instance.oldRenderVdom = renderVdom;
  vdom.instance = instance;
  return domElement;
}

function createFunctionComponent(vdom) {
  const { type, props } = vdom;

  if (!vdom.hooks) {
    vdom.hooks = {
      hookIndex: 0,
      hookStates: [],
    };
  }

  currentVdom = vdom;

  const renderVdom = type(props);
  const domElement = createDOMElement(renderVdom);

  vdom.oldRenderVdom = renderVdom;
  return domElement;
}

function createNativeComponent(vdom) {
  const { type, props, ref } = vdom;

  const domElement = document.createElement(type);

  vdom.domElement = domElement;

  if (ref) {
    ref.current = domElement;
  }

  updateProps(domElement, {}, props);
  mountChildren(vdom, domElement);
  return domElement;
}

function updateProps(domElement, oldProps = {}, newProps = {}) {
  Object.keys(oldProps).forEach((name) => {
    if (!newProps.hasOwnProperty(name)) {
      if (name === "style") {
        // if style is not exist, then remove all style
        const styles = oldProps[name];
        Object.keys(styles).forEach(
          (styleProp) => (document.style[styleProp] = null)
        );
      } else if (name.startsWith("on")) {
        delete domElement.reactEvent[name];
      } else {
        delete domElement[name];
      }
    }
  });

  Object.keys(newProps).forEach((name) => {
    if (name === "children") return;

    if (name === "style") {
      Object.assign(domElement.style, newProps.style);
    } else if (name.startsWith("on")) {
      if (!domElement.reactEvents) {
        domElement.reactEvents = {};
      }
      domElement.reactEvents[name] = newProps[name];
    } else {
      domElement[name] = newProps[name];
    }
  });
}

function mountChildren(vdom, parentDOM) {
  let children = vdom?.props?.children || [];

  const childrenArray = wrapToArray(children);
  children = childrenArray.forEach((child) => {
    child = wrapToVdom(child);
    mountVdom(child, parentDOM);
  });
}

/**
 *
 * @param {*} vdom
 * @returns dom elements
 */

export function getDOMElementByVdom(vdom) {
  if (isUndefined(vdom)) {
    return null;
  }

  const { type } = vdom;
  if (typeof type === "function") {
    if (type.isReactComponent) {
      const instance = vdom.instance;
      return getDOMElementByVdom(instance.oldRenderVdom);
    }

    return getDOMElementByVdom(vdom.oldRenderVdom);
  }

  return vdom.domElement;
}

export function compareVdom(parentDOM, oldRenderVdom, newRenderVdom) {
  if (isUndefined(oldRenderVdom) && isUndefined(newRenderVdom)) {
    return null;
  } else if (isUndefined(oldRenderVdom) && isDefined(newRenderVdom)) {
    unMountVdom(oldRenderVdom);
    mountVdom(newRenderVdom, parentDOM);
  } else if (isDefined(oldRenderVdom) && isUndefined(newRenderVdom)) {
    unMountVdom(oldRenderVdom);
  } else if (
    isDefined(oldRenderVdom) &&
    isDefined(newRenderVdom) &&
    oldRenderVdom.type !== newRenderVdom.type
  ) {
    unMountVdom(oldRenderVdom);
    mountVdom(newRenderVdom, parentDOM);
  } else if (
    isDefined(oldRenderVdom) &&
    isDefined(newRenderVdom) &&
    oldRenderVdom.type === newRenderVdom.type
  ) {
    updateVdom(oldRenderVdom, newRenderVdom);
  }
}

function updateVdom(oldVdom, newVdom) {
  // console.log("update vdom", oldVdom, newVdom);
  const { type } = oldVdom;
  if (type?.$$typeof === REACT_FORWARDREF) {
    updateForwardComponent(oldVdom, newVdom);
  } else if (typeof type === "string") {
    updateNativeComponent(oldVdom, newVdom);
  } else if (typeof newVdom === "string" || typeof newVdom === "number") {
    console.log("update text component", newVdom, oldVdom);
    updateTextComponent(oldVdom, newVdom);
  } else if (typeof type === "function") {
    if (type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom);
    } else {
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}

function updateForwardComponent(oldVdom, newVdom) {
  const { type, props, ref } = newVdom;
  const { render } = type;
  const newRenderVdom = render(props, ref);
  const parentDOM = getParentDOMByVdom(oldVdom);
  compareVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
}

function updateNativeComponent(oldVdom, newVdom) {
  const domElement = getDOMElementByVdom(oldVdom);
  updateProps(domElement, newVdom.props, oldVdom.props);
  updateChildren(domElement, newVdom.props.children, oldVdom.props.children);
}

function updateTextComponent(oldVdom, newVdom) {
  const domElement = (newVdom.domElement = getDOMElementByVdom(oldVdom));
  if (oldVdom.props !== newVdom.props) {
    domElement.textContent = newVdom.props;
  }
}

function updateClassComponent(oldVdom, newVdom) {
  const instance = (newVdom.instance = oldVdom.instance);
  instance.emitUpdate(newVdom.props);
}

function updateFunctionComponent(oldVdom, newVdom) {
  // reset hooks index when function component update
  const hooks = (newVdom.hooks = oldVdom.hooks);
  hooks.hookIndex = 0;
  currentVdom = newVdom;

  const { type, props } = newVdom;
  const newRenderVdom = type(props);
  const parentDOM = getParentDOMByVdom(oldVdom);
  compareVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
}

function updateChildren(domElement, newVChildren, oldVChildren) {
  const oldChildrenArray = wrapToArray(oldVChildren);
  const newChildrenArray = wrapToArray(newVChildren);
  const maxLength = Math.max(oldChildrenArray.length, newChildrenArray.length);

  for (let i = 0; i < maxLength; i++) {
    compareVdom(domElement, oldChildrenArray[i], newChildrenArray[i]);
  }
}

function getParentDOMByVdom(vdom) {
  return getDOMElementByVdom(vdom)?.parentNode;
}
function unMountVdom(vdom) {
  const domElement = vdom.domElement;
  domElement.remove();
}

function mountVdom(vdom, parentDOM) {
  if (!vdom) {
    return;
  }

  const domElement = createDOMElement(vdom);
  parentDOM.appendChild(domElement);

  domElement.componentDidMount?.();
}

/**
 *
 * @param {*} reducer
 * @param {*} initialState
 * @returns
 */
export function useReducer(reducer, initialState) {
  const { hooks } = currentVdom;
  const { hookIndex, hookStates } = hooks;
  const hookState = hookStates[hookIndex];
  if (isUndefined(hookState)) {
    hookStates[hookIndex] = initialState;
  }
  function dispatch(action) {
    hookStates[hookIndex] = reducer(hookStates[hookIndex], action);
    currentRoot.update();
  }

  return [hookStates[hooks.hookIndex++], dispatch];
}
const ReactDOM = {
  createRoot,
};
export default ReactDOM;
