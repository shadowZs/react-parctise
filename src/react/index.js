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
}

const React = { createElement, Component };

export default React;
