import React from "react";
import store from "./store";
import { Provider } from "./react-redux";
import ReduxChildComponnet from "./ReduxChildComponnet";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <h1>Hello World</h1>

        <ReduxChildComponnet />
      </div>
    </Provider>
  );
};

export default App;
