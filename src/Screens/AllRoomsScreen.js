import React, { useEffect, useState } from "react";
import { Divider, Button, Typography } from "antd";
import { socket } from "../App";
import { getOnlineUsers } from "../services/user-service";
import { _convertOnlineUsers } from "../utilities/convertOnlineUsers";
import { useDispatch, useSelector } from "react-redux";
import {
  setOnlineUsersAction,
  logoutAction,
} from "../store/actions/user-actions";

const AllRoomsScreen = (props) => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.userReducer.onlineUsers);

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
  }, [dispatch]);

  const handleChat = (user) => {
    console.log(user);
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
            <Typography.Paragraph className="mb-0">
              {user.username}
            </Typography.Paragraph>
            <Button onClick={() => handleChat(user)} type="primary">
              Chat
            </Button>
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
