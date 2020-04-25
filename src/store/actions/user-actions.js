import { socket } from "../../App";
import {
  add_username,
  renew_online_users,
  no_action,
  logout,
} from "../types/user-types";

export const addUsernameAction = (username) => {
  return (dispatch) => {
    socket.emit("register user socketid", username);
    localStorage.setItem("username", username);
    dispatch({ type: add_username, payload: username });
  };
};

export const rebuildUserFromLocalStorage = () => {
  const username = localStorage.getItem("username");
  if (username) {
    socket.emit("register user socketid", username);
    return { type: add_username, payload: username };
  }
  return { type: no_action };
};

export const setOnlineUsersAction = (onlineUsers) => {
  return { type: renew_online_users, payload: onlineUsers };
};

export const logoutAction = () => {
  return (dispatch) => {
    socket.emit("logout user");
    localStorage.removeItem("username");
    dispatch({ type: logout });
  };
};
