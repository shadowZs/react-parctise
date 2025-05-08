import { REACT_TEXT } from "./constants";
import { isUndefined, wrapToArray, wrapToVdom } from "./util";
import { setEventDelegation } from "./event";

function createRoot(container) {
  return {
    render(rootVdom) {
      mountVdom(rootVdom, container);
      setEventDelegation(container);
    },
  };
}

function mountVdom(vdom, parentDOM) {
  if (!vdom) {
    return;
  }

  const domElement = createDOMElement(vdom);
  parentDOM.appendChild(domElement);
}

// convert vdom to real dom
export function createDOMElement(vdom) {
  if (isUndefined(vdom)) return null;

  const { type } = vdom;
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
  return document.createTextNode(vdom.props);
}

function createClassComponent(vdom) {
  const { type, props } = vdom;
  const instance = new type(props);
  const renderVdom = instance.render();

  const domElement = createDOMElement(renderVdom);

  // save renderVdom and instance in instance to force update
  // as forceUpdate can't get vdom, so mount the oldRenderVdom in instance
  instance.oldRenderVdom = renderVdom;
  vdom.instance = instance;
  return domElement;
}

function createFunctionComponent(vdom) {
  const { type, props } = vdom;
  const renderVdom = type(props);
  const domElement = createDOMElement(renderVdom);

  vdom.oldRenderVdom = renderVdom;
  return domElement;
}

function createNativeComponent(vdom) {
  const { type, props } = vdom;

  const domElement = document.createElement(type);

  vdom.domElement = domElement;

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
  const children = vdom?.props?.children || [];
  const childrenArray = wrapToArray(children);
  childrenArray.forEach((child) => {
    mountVdom(wrapToVdom(child), parentDOM);
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

const ReactDOM = {
  createRoot,
};
export default ReactDOM;
