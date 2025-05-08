import React from "./react";

// class Child extends React.Component {
//   render() {
//     return <div className="child">child</div>;
//   }
// }

function Child(props, forwardRef) {
  return <input ref={forwardRef} />;
}

const ForwardChildRef = React.forwardRef(Child);

class App extends React.Component {
  state = {
    count: 0,
  };

  inputRef = React.createRef();
  childRef = React.createRef();

  handleClick = () => {
    this.childRef.current.focus();
  };

  render() {
    return (
      <div>
        <input ref={this.inputRef} />
        <ForwardChildRef ref={this.childRef} />
        <button onClick={this.handleClick}>click</button>
      </div>
    );
  }
}

export default App;
