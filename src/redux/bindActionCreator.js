function bindActionCreator(actionCreator, dispatch) {
  return function (...args) {
    dispatch(actionCreator.apply(this, args));
  };
}

/**
 *  create action creator return
 * @param {*} actionCreator a function or a object
 * @param {*} dispatch
 * @returns a function or a list to dispatch action
 */
export function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch);
  } else {
    return Object.keys(actionCreators).reduce((result, key) => {
      result[key] = bindActionCreator(actionCreators[key], dispatch);
      return result;
    }, {});
  }
}
