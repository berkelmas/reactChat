import axios from "axios";
import { config } from "../config";

export const getMessages = (users, skip, limit) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${config.apiUrl}get-messages`,
    {
      users,
      skip,
      limit,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getUnreadMessageCount = () => {
  const token = localStorage.getItem("token");
  return axios.get(`${config.apiUrl}unread-messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
