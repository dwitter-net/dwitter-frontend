import React from "react";
import { User } from "./api";

export const UserView: React.FC<{ user: User }> = (props) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <img
        src={props.user.avatar}
        alt=""
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          boxShadow: "0 0px 2px rgba(0, 0, 0, 0.2)",
          marginRight: 16,
        }}
      />

      <div style={{ fontWeight: "bold" }}>{props.user.username}</div>
    </div>
  );
};
