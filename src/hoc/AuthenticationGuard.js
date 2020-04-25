import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthenticationGuard = ({ component: Component, ...rest }) => {
  const username = useSelector((state) => state.userReducer.username);

  return (
    <Route
      {...rest}
      render={(props) =>
        username ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default AuthenticationGuard;
