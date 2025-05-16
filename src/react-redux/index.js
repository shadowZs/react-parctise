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
  console.log("store ===>", store.dispatch);
  return store.dispatch;
}
