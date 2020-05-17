import React from "react";
import { User } from "./api";
import { Link } from "react-router-dom";

export const UserView: React.FC<{ user: User; link?: boolean }> = (props) => {
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

      {props.link !== false ? (
        <Link to={"/u/" + props.user.username} className="no-link-color">
          <div style={{ fontWeight: "bold" }}>{props.user.username}</div>
        </Link>
      ) : (
        <div style={{ fontWeight: "bold" }}>{props.user.username}</div>
      )}
    </div>
  );
};
