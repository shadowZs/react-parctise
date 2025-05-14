import React from "react";
const locationContext = React.createContext({});
const navigatorContext = React.createContext({});

export { locationContext, navigatorContext };

export function Router({ children, location, navigator }) {
  return (
    <locationContext.Provider value={location}>
      <navigatorContext.Provider value={navigator}>
        {children}
      </navigatorContext.Provider>
    </locationContext.Provider>
  );
}

export function Routes({ children }) {
  let routes = [];
  React.Children.forEach(children, (child) => {
    const { path, element } = child.props;
    routes.push({ path, element });
  });
  return useRoutes(routes);
}

function useRoutes(routes) {
  const location = React.useContext(locationContext);
  const pathname = location.pathname;

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const { path, element } = route;
    const regExp = new RegExp(`^${path}$`);
    if (regExp.test(pathname)) {
      return element;
    }
  }
  return null;
}

export function Route() {}
