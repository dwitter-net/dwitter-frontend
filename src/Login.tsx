import React, { useState, useContext } from "react";
import { login, getUser } from "./api";
import { RouteComponentProps } from "react-router-dom";
import { Context } from "./Context";

export const Login: React.FC<RouteComponentProps> = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [_, setContext] = useContext(Context);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 600,
          flex: 1,
          justifyContent: "center",
          display: "flex",
          flexDirection: "row",
        }}
        className="card mt-3 p-3"
      >
        <form
          style={{
            maxWidth: 16 * 18,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            login(username, password)
              .then((data) => localStorage.setItem("token", data.token))
              .then(() => getUser("me"))
              .then((user) => {
                setContext({ user });
                localStorage.setItem("user", JSON.stringify(user));
                setUsername("");
                setPassword("");
                props.history.push("/");
              });
          }}
        >
          <label htmlFor="username">Username</label>
          <input
            autoFocus={true}
            id="username"
            name="username"
            type="text"
            className="form-control mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn btn-primary mb-3"
            style={{ alignSelf: "flex-end" }}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};
