import React, { useState } from "react";

import { legacy_createStore as createStore, bindActionCreators } from "./redux";
let initialState = { count: 0 };
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
};

function Redux() {
  const [count, setCount] = useState(0);

  const store = createStore(reducer);
  store.subscribe(() => {
    setCount(store.getState().count);
  });

  const add = () => ({ type: "INCREMENT" });

  const sub = () => ({ type: "DECREMENT" });

  const actionCreators = {
    add,
    sub,
  };

  const boundActionCreators = bindActionCreators(
    actionCreators,
    store.dispatch
  );

  return (
    <div>
      <h1>Redux {count}</h1>
      <button onClick={boundActionCreators.add}> Add </button>
      <button onClick={boundActionCreators.sub}> sub </button>
    </div>
  );
}

export default Redux;
