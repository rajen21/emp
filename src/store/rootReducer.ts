import { combineReducers } from 'redux';
import homeReducer from "../containers/home/homeSlice";
import workspaceReducer from "../containers/workspaces/workspaceSliice";
import employeeReducer from "../containers/employee/employeeSlice";

const rootReducer = combineReducers({
  homeReducer,
  workspaceReducer,
  employeeReducer,
});

export default rootReducer;
