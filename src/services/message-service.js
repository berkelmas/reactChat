import axios from "axios";
import { config } from "../config";

export const getMessages = (users, skip, limit) => {
  return axios.post(`${config.apiUrl}get-messages`, {
    users,
    skip,
    limit,
  });
};
