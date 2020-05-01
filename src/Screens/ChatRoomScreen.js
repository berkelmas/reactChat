import React, { useEffect, useState, useRef } from "react";
import { socket } from "../App";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getMessages } from "../services/message-service";
import { ReloadOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button } from "antd";

const ChatRoomScreen = () => {
  const { user } = useParams();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.userReducer.user);
  const [messageState, setMessageState] = useState("");
  const [myMessages, setMyMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesLeft, setMessagesLeft] = useState(true);
  const [userTyping, setUserTyping] = useState(false);
  const chatContainer = useRef();
  useEffect(() => {
    socket.on("chat message", (data) => {
      if (data.sender._id === user || data.sender._id === reduxUser._id) {
        setMyMessages((prev) => [...prev, data]);
        chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
        if (data.sender._id === user) {
          socket.emit("read message", {
            message: data,
            token: localStorage.getItem("token"),
          });
        }
      }
    });

    socket.on("read message", (msg) => {
      setMyMessages((prev) =>
        prev.map((item) => (item._id === msg._id ? msg : item))
      );
    });

    return () => {
      socket.off("chat message");
      socket.off("read message");
    };
  }, [dispatch, reduxUser, user]);

  useEffect(() => {
    setMyMessages([]);
    setCurrentPage(0);
    setMessagesLeft(true);

    socket.on("typing", (writingUserId) => {
      if (writingUserId === user) {
        setUserTyping(true);
        setTimeout(() => {
          setUserTyping(false);
        }, 1000);
      }
    });
    return () => {
      socket.off("typing");
    };
  }, [user]);

  useEffect(() => {
    if (reduxUser && messagesLeft) {
      setMessagesLoading(true);
      getMessages([user, reduxUser._id], currentPage * 2, 2).then((res) => {
        setMessagesLeft(res.data.messagesLeft);
        if (res.data.messagesLeft) {
          setMyMessages((prev) => [...res.data.messages.reverse(), ...prev]);
        }
        setMessagesLoading(false);
      });
    }
  }, [user, reduxUser, currentPage, messagesLeft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("chat message", {
      message: messageState,
      sender: reduxUser._id,
      receiver: user,
    });
    setMessageState("");
  };

  return (
    <div
      ref={chatContainer}
      style={{
        height: "95vh",
        backgroundColor: "#f7f7f7",
        overflow: "scroll",
      }}
      className="d-flex flex-column justify-content-between"
    >
      {messagesLeft && (
        <Button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          type="primary"
          shape="circle"
          icon={messagesLoading ? <LoadingOutlined /> : <ReloadOutlined />}
          size={"large"}
          className="mr-auto ml-auto mt-4"
        />
      )}
      <div style={{ flex: 1 }}>
        {myMessages.map((item, index) => (
          <div
            key={index}
            className={`card w-50 m-3 shadow-sm border-0 ${
              item.sender._id === reduxUser._id ? "ml-auto" : "mr-auto"
            }`}
          >
            <div className="card-body">
              <span className="message-sender">{item.sender.fullName}</span>
              <div className="pt-3 pb-3">
                <p>{item.message}</p>
              </div>

              <span className="message-date">
                {new Date(item.timeCreated).toLocaleString()}
              </span>
              {item.sender._id === reduxUser._id && (
                <span className="read-status">
                  {item.readBy.map((item) => item.user).includes(user)
                    ? `Read`
                    : `Unread`}
                </span>
              )}
            </div>
          </div>
        ))}
        <div style={{ height: "100px" }}></div>
      </div>
      <div>
        {userTyping && <p className="mb-4 pb-3 pl-3">Typing...</p>}
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
            onChange={(e) => {
              setMessageState(e.target.value);
              socket.emit("typing", {
                writingToUserId: user,
                writingUserId: reduxUser._id,
              });
            }}
            placeholder="Write Some..."
          />
        </form>
      </div>
    </div>
  );
};

export default ChatRoomScreen;
