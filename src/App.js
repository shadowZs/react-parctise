import React from "./react";

class App extends React.Component {
  state = {
    count: 0,
  };
  handleClick = () => {
    this.setState((state) => ({
      count: state.count + 1,
    }));

    console.log("setState1 =>", this.state);
    this.setState({
      count: this.state.count + 1,
    });

    console.log("setState2 =>", this.state);

    setTimeout(() => {
      this.setState({
        count: this.state.count + 1,
      });
      console.log("setTimout1 =>", this.state);

      this.setState({
        count: this.state.count + 1,
      });
      console.log("setTimout2 =>", this.state);
    });
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
