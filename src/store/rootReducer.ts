import { combineReducers } from 'redux';
import homeReducer from "../containers/home/homeSlice";
import workspaceReducer from "../containers/workspaces/workspaceSliice";

const rootReducer = combineReducers({
  homeReducer,
  workspaceReducer,
});

export default rootReducer;
