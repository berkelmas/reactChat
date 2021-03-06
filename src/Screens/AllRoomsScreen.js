import React, { useEffect, useState } from "react";
import { Button, Typography } from "antd";
import { Route, NavLink } from "react-router-dom";
import { socket } from "../App";
import { getAllUsers } from "../services/user-service";
import { useDispatch, useSelector } from "react-redux";
import {
  setOnlineUsersAction,
  logoutAction,
} from "../store/actions/user-actions";
import { showNotification } from "../utilities/showNotification";
import ChatRoomScreen from "./ChatRoomScreen";
import { getUnreadMessageCount } from "../services/message-service";

const AllRoomsScreen = (props) => {
  const dispatch = useDispatch();
  const [availableUsers, setAvailableUsers] = useState([]);
  const onlineUsers = useSelector((state) => state.userReducer.onlineUsers);
  const reduxUser = useSelector((state) => state.userReducer.user);
  const [unreadMessageHash, setUnreadMessageHash] = useState([]);

  useEffect(() => {
    getAllUsers(0, 9999).then((res) => {
      const { users } = res.data;
      if (reduxUser) {
        setAvailableUsers(users.filter((user) => user._id !== reduxUser._id));
      } else {
        setAvailableUsers(users);
      }
    });

    getUnreadMessageCount().then((res) => {
      setUnreadMessageHash(res.data.result);
    });

    socket.on("get online users", (onlineUsers) => {
      dispatch(setOnlineUsersAction(onlineUsers));
    });

    socket.on("unread message count", (data) => {
      setUnreadMessageHash(data);
    });

    return () => {
      socket.off("get online users");
    };
  }, [dispatch, reduxUser]);

  useEffect(() => {
    console.log(unreadMessageHash);
  }, [unreadMessageHash]);

  const handleLogout = () => {
    dispatch(logoutAction());
    props.history.push("/");
  };

  return (
    <div>
      <div
        style={{ height: "100vh", width: "100vw", overflow: "hidden" }}
        className="row m-0"
      >
        <div className="col-md-3 p-0" style={{ zIndex: 1000 }}>
          <div
            style={{ border: "none", height: "100%" }}
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
                <NavLink
                  to={`/all-rooms/${user._id}`}
                  activeClassName="selected-chat"
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

                  <span
                    style={{
                      border: "1px solid #767676",
                      borderRadius: "100px",
                      height: "30px",
                      width: "30px",
                      padding: "5px",
                      color: "#767676",
                    }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    {unreadMessageHash.find((item) => item._id === user._id)
                      ? unreadMessageHash.find((item) => item._id === user._id)
                          .count
                      : `0`}
                  </span>
                </NavLink>
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
        <div className="col-md-9 p-0">
          <div className="card shadow border-0" style={{ height: "100%" }}>
            <Route path="/all-rooms/:user" component={ChatRoomScreen}></Route>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRoomsScreen;
