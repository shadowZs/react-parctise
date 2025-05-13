import React, { useEffect } from "react";

function Router() {
  useEffect(() => {
    window.addEventListener("popstate", () => {
      console.log("popstate");
    });
  }, []);

  const jump = (path) => {
    window.history.pushState({}, "", path);

    document.getElementById("app").innerHTML = path;
  };

  return (
    <div>
      <button onClick={() => jump("/a")}>a</button>
      <br />
      <button onClick={() => jump("/b")}>b</button>

      <div id="app"></div>
    </div>
  );
}

export default Router;
