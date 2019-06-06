import { combineReducers } from "redux";
import currentUser from "./currentUser";
import error from "./error";
import userdata from "./userDataReducer";
import connectionInfo from "./ConnectionInfoReducer";

export default combineReducers({
  currentUser,
  error,
  userdata,
  connectionInfo
});
