import React, { useEffect } from "react";
import { Divider, Button, Typography } from "antd";
import { socket } from "../App";
import { getOnlineUsers } from "../services/user-service";
import { _convertOnlineUsers } from "../utilities/convertOnlineUsers";
import { useDispatch, useSelector } from "react-redux";
import {
  setOnlineUsersAction,
  logoutAction,
} from "../store/actions/user-actions";
import { showNotification } from "../utilities/showNotification";

const AllRoomsScreen = (props) => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.userReducer.onlineUsers);
  const username = useSelector((state) => state.userReducer.username);

  useEffect(() => {
    getOnlineUsers().then((res) => {
      const onlineUsers = res.data.result;
      const users = _convertOnlineUsers(onlineUsers);
      dispatch(setOnlineUsersAction(users));
    });

    socket.on("get online users", (onlineUsers) => {
      const users = _convertOnlineUsers(onlineUsers);
      dispatch(setOnlineUsersAction(users));
    });

    socket.on("chat message", showNotification);

    return () => {
      socket.off("chat message", showNotification);
    };
  }, [dispatch]);

  const handleChat = (user) => {
    props.history.push(`/chat-room/${user.username}`);
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    props.history.push("/");
  };

  return (
    <div className="container">
      <Divider orientation="left">Available To Chat</Divider>
      <ul className="list-group mb-3">
        {onlineUsers.map((user, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <Typography.Paragraph className="mb-0 d-flex align-items-center">
              {user.username}
            </Typography.Paragraph>
            {user.username !== username && (
              <Button onClick={() => handleChat(user)} type="primary">
                Chat
              </Button>
            )}
          </li>
        ))}
      </ul>
      <Typography.Text>
        Do you want to{" "}
        <Typography.Text
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
          type="secondary"
        >
          log out?
        </Typography.Text>
      </Typography.Text>
    </div>
  );
};

export default AllRoomsScreen;
