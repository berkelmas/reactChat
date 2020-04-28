import { socket } from "../../App";
import { loginService, verifyJWT } from "../../services/user-service";
import {
  success_login,
  renew_online_users,
  no_action,
  logout,
} from "../types/user-types";
import jwt from "jsonwebtoken";
import { push } from "connected-react-router";

export const loginAction = ({ username, password }) => {
  return (dispatch) => {
    loginService(username, password)
      .then((res) => {
        const userData = res.data;
        const tokenPayload = jwt.decode(userData.token);
        socket.emit("register user socketid", tokenPayload._id);
        localStorage.setItem("token", userData.token);
        dispatch({ type: success_login, payload: tokenPayload });
        dispatch(push("/all-rooms"));
      })
      .catch((err) => dispatch({ type: no_action }));
  };
};

export const rebuildUserFromLocalStorage = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyJWT(token)
        .then((res) => {
          const tokenPayload = jwt.decode(token);
          socket.emit("register user socketid", tokenPayload._id);
          dispatch({ type: success_login, payload: tokenPayload });
          // push("/all-rooms");
        })
        .catch((err) => {
          dispatch({ type: logout });
          socket.emit("logout user");
          localStorage.removeItem("token");
          push("/");
        });
    }
    dispatch({ type: logout });
  };
};

export const setOnlineUsersAction = (onlineUsers) => {
  return { type: renew_online_users, payload: onlineUsers };
};

export const logoutAction = () => {
  return (dispatch) => {
    socket.emit("logout user");
    localStorage.removeItem("token");
    dispatch({ type: logout });
  };
};
