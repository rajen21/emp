import { combineReducers } from 'redux';
import homeReducer from "../containers/home/homeSlice";

const rootReducer = combineReducers({
  homeReducer
});

export default rootReducer;
