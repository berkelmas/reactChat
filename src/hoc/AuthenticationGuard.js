import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthenticationGuard = ({ component: Component, ...rest }) => {
  // const user = useSelector((state) => state.userReducer.user);
  let user = localStorage.getItem("token");
  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default AuthenticationGuard;
