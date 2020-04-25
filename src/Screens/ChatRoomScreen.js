import React, { useEffect, useState } from "react";
import { socket } from "../App";

const ChatRoomScreen = () => {
  const [messageState, setMessageState] = useState("");
  const [myMessages, setMyMessages] = useState([]);
  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMyMessages((prev) => [...prev, msg]);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("chat message", messageState);
    setMessageState("");
  };

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "#f7f7f7" }}
      className="d-flex flex-column justify-content-between"
    >
      <div style={{ flex: 1 }}>
        {myMessages.map((item, index) => (
          <div key={index} className="card w-25 m-3 mr-auto shadow-sm border-0">
            <div className="card-body">
              <span className="message-sender">Berk Elmas</span>
              <div className="pt-3 pb-3">
                <p>{item}</p>
              </div>

              <span className="message-date">03/02/2020</span>
            </div>
          </div>
        ))}
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
