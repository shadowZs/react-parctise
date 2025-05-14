import React, { useEffect, useState } from "react";

import { legacy_createStore as createStore, bindActionCreators } from "./redux";
import reducer from "./reducers";
const store = createStore(reducer);

const actionCreators = {
  increment: () => ({ type: "INCREMENT" }),
  decrement: () => ({ type: "DECREMENT" }),
  add: () => ({ type: "ADD" }),
  sub: () => ({ type: "MINUS" }),
};

function Redux() {
  const [state, setState] = useState({});

  useEffect(() => {
    store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const boundActionCreators = bindActionCreators(
    actionCreators,
    store.dispatch
  );

  return (
    <div>
      <h1>count1: {state?.count1?.count}</h1>
      <button onClick={boundActionCreators.increment}> Add </button>
      <button onClick={boundActionCreators.decrement}> sub </button>
      <br />

      <h1>count2 {state.count2?.count}</h1>
      <button onClick={boundActionCreators.add}> Add </button>
      <button onClick={boundActionCreators.sub}> sub </button>

      <br />
    </div>
  );
}

export default Redux;
