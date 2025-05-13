import React from "./react";

class ChildComponent extends React.Component {
  onClick = () => {
    console.log("child");
  };

  render() {
    return (
      <div className="child" onClick={this.onClick}>
        child
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  // eslint-disable-next-line react/no-typos
  // getDerivedStateFromProps(props, state) {
  //   console.log("props =>", props);
  // }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentDidMount(props, state) {
    console.log("componentDidMount");
  }

  shouldComponentUpdate() {
    console.log("should component update");
  }

  // getSnapshotBeforeUpdate() {
  //   console.log("getSnapShotbeforeUpdate");
  // }

  componentWillUnmount() {
    console.log("component will unmount");
  }

  handleClick = () => {
    this.setState({
      count: this.state.count + 1,
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>+</button>
        {this.state.count}
        <div>
          <ChildComponent />
        </div>
      </div>
    );
  }
}

export default App;
