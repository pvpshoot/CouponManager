import { combineReducers } from "redux";
// Reducers
import couponReducer from "./coupon-reducer";
// Combine Reducers
var reducers = combineReducers({
  couponReducer
});
export default reducers;
