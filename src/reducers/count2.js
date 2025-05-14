export default function count2(state = { count: 1 }, action) {
  switch (action.type) {
    case "ADD":
      return { count: state.count + 1 };
    case "MINUS":
      return { count: state.count - 1 };
    default:
      return state;
  }
}
