/**
 * combineReducers receive a object of reducers and return a new reducer function, the function will return a new state
 * @param {*} reducers object
 */
export function combineReducers(reducers) {
  return function (state = {}, action) {
    let newState = {};
    // call each reducer and merge the new state
    for (let key in reducers) {
      newState[key] = reducers[key](state[key], action);
    }
    return newState;
  };
}
