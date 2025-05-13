import {
  getDOMElementByVdom,
  createDOMElement,
  compareVdom,
} from "../react-dom/client";
import { REACT_FORWARDREF, REACT_CONTEXT } from "../react-dom/constants";
import { isDefined, isUndefined, wrapToVdom } from "../react-dom/util";

let isBathingUpdate = false;

let dirtyComponents = new Set();

export function setBatchingUpdate(value) {
  isBathingUpdate = value;
}

// force update dirty component
export function flushDirtyComponents() {
  dirtyComponents.forEach((component) => component.forceUpdate());
  dirtyComponents.clear();
}

function createElement(type, config, ...children) {
  const { ref, ...others } = config;
  const props = {
    ...others,
    children: Array.from(children).map((child) => wrapToVdom(child)),
  };

  return {
    type,
    ref,
    props,
  };
}

class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.pendingState = []; // batch update state
  }

  setState(partialState, callback = () => {}) {
    if (isBathingUpdate) {
      dirtyComponents.add(this);
      this.pendingState.push(partialState);
    } else {
      const isFunction = typeof partialState === "function";
      const newState = isFunction ? partialState(this.state) : partialState;
      this.state = {
        ...newState,
        ...partialState,
      };

      // update dom when state update
      this.updateIfNeeded();

      // trgger setState callback function
      callback();
    }
  }

  caculateState = () => {
    return this.pendingState.reduce((state, partialState) => {
      const isFunction = typeof partialState === "function";
      const newState = isFunction ? partialState(this.state) : partialState;

      return {
        ...state,
        ...newState,
      };
    }, this.state);
  };

  updateIfNeeded() {
    if (!this.shouldComponentUpdate?.()) {
      return;
    }

    this.forceUpdate();
  }

  emitUpdate(nextProps, nextState) {
    this.nextProps = nextProps;
    if (nextProps || this.pendingState.length > 0) {
      this.updateIfNeeded();
    }
  }
  // update view dom
  forceUpdate() {
    this.state = this.caculateState();
    this.pendingState = [];

    const newRenderVdom = this.render();
    const oldRenderVdom = this.oldRenderVdom;
    const oldDOMElement = getDOMElementByVdom(oldRenderVdom);
    const newDOMElement = createDOMElement(newRenderVdom);
    const parentDOM = oldDOMElement.parentNode;
    parentDOM.replaceChild(newDOMElement, oldDOMElement);

    // compareVdom(parentDOM, oldRenderVdom, newRenderVdom);

    // after replace child with new dom element, the old dom element will be removed
    this.oldRenderVdom = newRenderVdom;
  }
}

function createRef(initialValue) {
  return {
    current: initialValue,
  };
}

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARDREF,
    render,
  };
}

function createContext(defaultValue) {
  const context = {
    type: REACT_CONTEXT,
    _currentValue: defaultValue,
    Provider: (props) => {
      context._currentValue = props.value;
      return props.children;
    },
    Consumer: (props) => {
      return props.children(context._currentValue);
    },
  };

  return context;
}

function useContext(context) {
  return context._currentValue;
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  createContext,
  useContext,
};

export default React;
