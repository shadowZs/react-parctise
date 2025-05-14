export * from "./bindActionCreator";
export * from "./combineReducers";

export const legacy_createStore = (reducer, preState) => {
  let state = preState;
  const subscribers = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    subscribers.forEach((callback) => callback());
  }

  function subscribe(callback) {
    subscribers.push(callback);

    // return a function to subscribe the listener
    return () => {
      let index = subscribers.indexOf(callback);
      subscribers.splice(index, 1);
    };
  }

  // dispatch the first time for update init value;
  dispatch({ type: "@@INIT" });

  return {
    getState,
    dispatch,
    subscribe,
  };
};
