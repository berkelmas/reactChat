import axios from "axios";
import { config } from "../config";

export const getMessages = (users) => {
  return axios.post(`${config.apiUrl}get-messages`, {
    users,
  });
};
