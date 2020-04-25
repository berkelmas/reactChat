import React, { useEffect } from "react";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginScreen from "./Screens/LoginScreen";
import AllRoomsScreen from "./Screens/AllRoomsScreen";
import ChatRoomScreen from "./Screens/ChatRoomScreen";
import AuthenticationGuard from "./hoc/AuthenticationGuard";
// REDUX
import { useDispatch } from "react-redux";
import { rebuildUserFromLocalStorage } from "./store/actions/user-actions";

export const socket = io("http://localhost:2000");

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rebuildUserFromLocalStorage());
  }, [dispatch]);

  return (
    <Router>
      <Switch>
        <Route path="/" exact={true} component={LoginScreen}></Route>
        <AuthenticationGuard
          path="/all-rooms"
          component={AllRoomsScreen}
        ></AuthenticationGuard>
        <Route path="/chat-room/:userid" component={ChatRoomScreen}></Route>
      </Switch>
    </Router>
  );
}

export default App;
