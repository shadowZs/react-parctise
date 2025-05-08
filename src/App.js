import React from "./react";

class App extends React.Component {
  state = {
    count: 0,
  };
  handleClick = () => {
    this.setState((state) => ({
      count: state.count + 1,
    }));
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>+ {this.state.count}</button>
      </div>
    );
  }
}

export default App;
