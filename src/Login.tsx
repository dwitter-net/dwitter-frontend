import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { LoginForm } from "./LoginForm";

export const Login: React.FC<RouteComponentProps> = (props) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 600, flex: 1, padding: 16 }}>
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
          }}
          className="card p-3"
        >
          <LoginForm
            onLogin={() => {
              props.history.push("/");
            }}
          />
        </div>
      </div>
    </div>
  );
};
