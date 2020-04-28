import { combineReducers } from "redux";
import { userReducer } from "./user";
import { connectRouter } from "connected-react-router";

export const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    userReducer: userReducer,
  });
