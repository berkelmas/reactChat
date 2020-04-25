import React, { useEffect } from "react";
import { Divider, Button, Typography } from "antd";
import { Route } from "react-router-dom";
import { socket } from "../App";
import { getOnlineUsers } from "../services/user-service";
import { _convertOnlineUsers } from "../utilities/convertOnlineUsers";
import { useDispatch, useSelector } from "react-redux";
import {
  setOnlineUsersAction,
  logoutAction,
} from "../store/actions/user-actions";
import { showNotification } from "../utilities/showNotification";
import ChatRoomScreen from "./ChatRoomScreen";

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
      socket.off("get online users");
    };
  }, [dispatch]);

  const handleChat = (user) => {
    props.history.push(`/all-rooms/${user.username}`);
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    props.history.push("/");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div
            style={{ border: "none", minHeight: "700px" }}
            className="card shadow"
          >
            <h5 className="pt-3 pl-2" style={{ color: "#4697F8" }}>
              Online
            </h5>
            <ul
              className="list-group mb-3 border-0"
              style={{ height: "500px", overflow: "scroll" }}
            >
              {onlineUsers.map((user, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center border-0"
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
            <Typography.Text className="mt-auto pl-3 pb-3">
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
        </div>
        <div className="col-md-8">
          <div className="card shadow border-0" style={{ minHeight: "700px" }}>
            <Route path="/all-rooms/:user" component={ChatRoomScreen}></Route>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRoomsScreen;
