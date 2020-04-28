import React, { useEffect, useState } from "react";
import { Button, Typography } from "antd";
import { Route } from "react-router-dom";
import { socket } from "../App";
import { getAllUsers } from "../services/user-service";
import { useDispatch, useSelector } from "react-redux";
import {
  setOnlineUsersAction,
  logoutAction,
} from "../store/actions/user-actions";
import { showNotification } from "../utilities/showNotification";
import ChatRoomScreen from "./ChatRoomScreen";

const AllRoomsScreen = (props) => {
  const dispatch = useDispatch();
  const [availableUsers, setAvailableUsers] = useState([]);
  const onlineUsers = useSelector((state) => state.userReducer.onlineUsers);
  const reduxUser = useSelector((state) => state.userReducer.user);

  useEffect(() => {
    getAllUsers(0, 9999).then((res) => {
      const { users } = res.data;
      setAvailableUsers(users);
    });

    socket.on("get online users", (onlineUsers) => {
      dispatch(setOnlineUsersAction(onlineUsers));
    });

    socket.on("chat message", showNotification);

    return () => {
      socket.off("chat message", showNotification);
      socket.off("get online users");
    };
  }, [dispatch]);

  const handleChat = (user) => {
    props.history.push(`/all-rooms/${user._id}`);
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
              {availableUsers.map((user, index) => (
                <li
                  key={user._id}
                  className="list-group-item d-flex justify-content-between align-items-center border-0"
                >
                  <Typography.Paragraph className="mb-0 d-flex align-items-center">
                    {user.fullName}
                    {onlineUsers.find(
                      (onlineUser) => onlineUser.email === user.email
                    ) && (
                      <span
                        style={{
                          height: "10px",
                          width: "10px",
                          marginLeft: "10px",
                          borderRadius: "10px",
                          backgroundColor: "#3F91F7",
                        }}
                      ></span>
                    )}
                  </Typography.Paragraph>
                  {user.email !== (reduxUser && reduxUser.email) && (
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
