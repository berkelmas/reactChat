import { notification } from "antd";

export const showNotification = (data) => {
  notification.open({
    message: `New Message From ${data.sender}`,
    description: data.message,
  });
};
