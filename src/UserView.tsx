import React from "react";
import { User } from "./api";
import { Link } from "react-router-dom";

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

  <Link to={"/u/" + props.user.username}>
  <div style={{ fontWeight: "bold" }}>
      <span style={{ opacity: "0.5",}}>
          u/
      </span>
      {props.user.username}
    </div>
  </Link>
  </div>
  );
};
