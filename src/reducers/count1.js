export default function count1(state = { count: 0 }, action) {
  // console.log("state1 -->", state);
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}
