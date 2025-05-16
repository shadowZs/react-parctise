import React from "react";
import { connect, useSelector, useDispatch } from "./react-redux";

function ReduxChildComponnet(props) {
  const state = useSelector((state) => state);

  return (
    <div>
      <button onClick={props.increment}>count1 +</button>
      <span>{state.count1}</span>
      <br />
      <button onClick={props.add}> count2 +</button>
      <span>{state.count2}</span>
    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  const add = () => {
    dispatch({
      type: "ADD",
    });
  };
  const increment = () => {
    dispatch({
      type: "INCREMENT",
    });
  };

  return {
    add,
    increment,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxChildComponnet);
