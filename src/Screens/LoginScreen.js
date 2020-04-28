import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "antd";
import { loginAction } from "../store/actions/user-actions";

const LoginScreen = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const reduxUsername = useSelector((state) => state.userReducer.username);

  // useEffect(() => {
  //   if (reduxUsername) {
  //     history.push("/all-rooms");
  //   }
  // }, [history, reduxUsername]);

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (username !== "" && password !== "") {
      dispatch(loginAction({ username, password }));
      // history.push("/all-rooms");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f7f7f7" }}
    >
      <div className="card shadow-sm" style={{ minWidth: "300px" }}>
        <div className="card-body">
          <h3>Start Chat</h3>
          <form onSubmit={handleSubmit}>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Email"
              className="mb-3 mt-3"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mb-3 mt-3"
            />
            <Button onClick={handleSubmit} type="primary" className="w-100">
              Start Chat
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
