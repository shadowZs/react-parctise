import React, { useLayoutEffect } from "react";
import { useContext } from "../react";
import ReactReduxContext from "./ReactReduxContext";

export function connect(mapStateToProps, mapDispatchToProps) {
  return function (Component) {
    // return <Component {...propsState} {...propsDispatch} />;
    return function (props) {
      const { store } = useContext(ReactReduxContext);
      const propsState = mapStateToProps(store.getState());
      const propsDispatch = mapDispatchToProps(store.dispatch);

      const [state, setState] = React.useState({});

      useLayoutEffect(() => {
        const unsubscribe = store.subscribe(() => {
          setState(store.getState());
        });

        return () => unsubscribe();
      }, [store]);

      return <Component {...props} {...propsState} {...propsDispatch} />;
    };
  };
}

export function Provider(props) {
  const store = props.store;
  return (
    <ReactReduxContext.Provider value={{ store }}>
      {props.children}
    </ReactReduxContext.Provider>
  );
}

export function useSelector(selector) {
  const { store } = useContext(ReactReduxContext);
  return selector(store.getState());
}

export function useDispatch() {
  const { store } = React.useContext(ReactReduxContext);
  return store.dispatch;
}

export function compose(...funcs) {
  if (funcs.length === 0) return (arg) => arg;

  if (funcs.length === 1) return funcs[0];

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}

//applyMiddleware(...middlewares)(createStore)(reducer, preloadedState, enhancer);
// middle receive a store a its argument and return a new dispatch
export function applyMiddleware(...middlewares) {
  return (createStore) => {
    return (...args) => {
      const store = createStore(...args);
      let { dispatch } = store;
      const middlewareAPI = {
        dispatch: (action) => dispatch(action),
        getState: store.getState,
      };

      const chains = middlewares.map((middleware) => middleware(middlewareAPI));
      dispatch = compose(...chains)(store.dispatch);

      return {
        ...store,
        dispatch,
      };
    };
  };
}
