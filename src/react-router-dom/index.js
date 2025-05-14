import React, { useLayoutEffect } from "react";
import { createBrowserHistory } from "history";
import { Router } from "../react-router";

export function BrowserRouter({ children }) {
  const historyRef = React.useRef(null);

  if (!historyRef.current) {
    historyRef.current = createBrowserHistory();
  }

  const history = historyRef.current;

  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => {
    history.listen(setState);
  }, [history]);

  return (
    <Router location={state.location} navigator={history} children={children} />
  );
}
