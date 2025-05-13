import React from "./react";

const Context = React.createContext();
const { Provider, Consumer } = Context;

class Child extends React.Component {
  render() {
    return (
      <Consumer>
        {({ name }) => {
          return <div>{name}</div>;
        }}
      </Consumer>
    );
  }
}

class App extends React.Component {
  state = {
    name: "zhangsan",
  };
  changeNames = () => {
    this.setState({
      name: "lisi",
    });
  };
  render() {
    return (
      <Provider value={this.state}>
        <div>
          <button onClick={this.changeNames}>change name</button>
          <Child />
        </div>
      </Provider>
    );
  }
}

export default App;
