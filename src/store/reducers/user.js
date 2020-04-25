import { renew_online_users, add_username, logout } from "../types/user-types";

const INITIAL_STATE = {
  username: null,
  onlineUsers: [],
};

export const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case renew_online_users:
      return { ...state, onlineUsers: action.payload };
    case add_username:
      return { ...state, username: action.payload };
    case logout:
      return { ...state, username: null, onlineUsers: [] };
    default:
      return state;
  }
};
