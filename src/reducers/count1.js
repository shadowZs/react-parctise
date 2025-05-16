export default function count1(state = 0, action) {
  // console.log("state1 -->", state);
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}
