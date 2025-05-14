import { combineReducers } from "../redux";
import count1 from "./count1";
import count2 from "./count2";

export const defaultValue = { count1: 0, count2: 0 };

export default combineReducers({
  count1,
  count2,
});
