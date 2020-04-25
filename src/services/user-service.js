import axios from "axios";
import { config } from "../config";

export const registerUser = (username) => {
  return axios.post(`${config.apiUrl}register-user`, { username });
};

export const getOnlineUsers = () => {
  return axios.get(`${config.apiUrl}get-online-users`);
};
