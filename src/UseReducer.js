import React from "./react";

function UserReducer() {
  function reducer(state, action) {
    switch (action.type) {
      case "add":
        return state + 1;
      case "minus":
        return state - 1;
      default:
        return state;
    }
  }

  const [count, dispatch] = React.useReducer(reducer, 0);
  console.log(count);
  function handleClick() {
    dispatch({ type: "add" });
  }

  return (
    <div>
      <button onClick={handleClick}>Add</button>
      {count}
    </div>
  );
}

export default UserReducer;
