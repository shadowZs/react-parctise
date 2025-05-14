import React, { useEffect } from "react";
import { BrowserRouter } from "./react-router-dom";
import { Route, Routes } from "./react-router";
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/user" element={<div>User</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
