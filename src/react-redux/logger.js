/**
 *
 * @param {*} param store
 * @returns dispatch function
 */
export function logger({ getState, dispatch }) {
  return function (next) {
    return function (action) {
      console.log("dispatching", action);
      let result = next(action);
      console.log("next state", getState());
      return result;
    };
  };
}
