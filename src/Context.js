import React from "./react";

const Context = React.createContext();
const { Provider, Consumer } = Context;

class Child extends React.Component {
  useContextValue = React.useContext(Context);

  render() {
    return (
      <Consumer>
        {({ name }) => {
          return (
            <div>
              <div>consumer value: {name}</div>
              <div>useContext value: {this.useContextValue.name}</div>
            </div>
          );
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
