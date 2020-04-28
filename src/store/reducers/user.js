import { renew_online_users, success_login, logout } from "../types/user-types";

const INITIAL_STATE = {
  user: null,
  onlineUsers: [],
  loginSuccess: false,
};

export const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case renew_online_users:
      return { ...state, onlineUsers: action.payload };
    case success_login:
      return { ...state, user: action.payload, loginSuccess: true };
    case logout:
      return { ...state, user: null, onlineUsers: [] };
    default:
      return state;
  }
};
