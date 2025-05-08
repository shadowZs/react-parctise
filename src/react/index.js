import { getDOMElementByVdom, createDOMElement } from "../react-dom/client";

function createElement(type, config, ...children) {
  const props = { ...config, children: Array.from(children) };
  return {
    type,
    props,
  };
}

class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
  }

  setState(partialState) {
    const isFunction = typeof partialState === "function";

    const newState = isFunction ? partialState(this.state) : partialState;
    this.state = {
      ...newState,
      ...partialState,
    };
    console.log(this.state);
    // update dom when state update
    this.forceUpdate();
  }

  // update view dom
  forceUpdate() {
    const newRenderVdom = this.render();
    const oldRenderVdom = this.oldRenderVdom;
    const oldDOMElement = getDOMElementByVdom(oldRenderVdom);
    const newDOMElement = createDOMElement(newRenderVdom);
    const parentDOM = oldDOMElement.parentNode;
    parentDOM.replaceChild(newDOMElement, oldDOMElement);

    // after replace child with new dom element, the old dom element will be removed
    this.oldRenderVdom = newRenderVdom;
  }
}

const React = { createElement, Component };

export default React;
