import React, { useEffect, useState } from "react";
import { socket } from "../App";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { _convertOnlineUsers } from "../utilities/convertOnlineUsers";
import { setOnlineUsersAction } from "../store/actions/user-actions";

const ChatRoomScreen = () => {
  const { user } = useParams();
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.userReducer.onlineUsers);
  const username = useSelector((state) => state.userReducer.username);
  const [messageState, setMessageState] = useState("");
  const [myMessages, setMyMessages] = useState([]);
  useEffect(() => {
    socket.on("chat message", (data) => {
      setMyMessages((prev) => [
        ...prev,
        { message: data.message, type: data.type },
      ]);
    });
    socket.on("get online users", (onlineUsers) => {
      const users = _convertOnlineUsers(onlineUsers);
      dispatch(setOnlineUsersAction(users));
    });
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(onlineUsers);
    // socket.emit("chat message", {
    //   sockets: onlineUsers.find(
    //     (item) => item.username === JSON.parse(user).username
    //   ).sockets,
    //   message: messageState,
    // });
    socket.emit("chat message", {
      sockets: onlineUsers.find(
        (item) => item.username === JSON.parse(user).username
      ).sockets,
      message: messageState,
    });
    setMessageState("");
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f7f7f7",
        overflow: "scroll",
      }}
      className="d-flex flex-column justify-content-between"
    >
      <div style={{ flex: 1 }}>
        {myMessages.map((item, index) => (
          <div
            key={index}
            className={`card w-25 m-3 shadow-sm border-0 ${
              item.type === "to" ? "ml-auto" : "mr-auto"
            }`}
          >
            <div className="card-body">
              <span className="message-sender">
                {item.type === "to" ? username : JSON.parse(user).username}
              </span>
              <div className="pt-3 pb-3">
                <p>{item.message}</p>
              </div>

              <span className="message-date">03/02/2020</span>
            </div>
          </div>
        ))}
        <div style={{ height: "100px" }}></div>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: "white",
        }}
        className="pt-3 pb-3 pl-2 pr-2 shadow-lg"
      >
        <input
          className="form-control"
          value={messageState}
          onChange={(e) => setMessageState(e.target.value)}
          placeholder="Write Some..."
        />
      </form>
    </div>
  );
};

export default ChatRoomScreen;
