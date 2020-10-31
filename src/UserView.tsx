import React, { CSSProperties } from "react";
import { User } from "./api";
import { Link } from "react-router-dom";

function avatar(user: User, right: boolean) {
  const style = {
    width: 32,
    height: 32,
    borderRadius: 16,
    boxShadow: "0 0px 2px rgba(0, 0, 0, 0.2)",
    marginRight: right ? 0 : 16,
    marginLeft: right ? 8 : 0,
    background: "#f5f5f5",
  };
  if (!user.avatar) {
    return <div style={style} />;
  }
  return <img src={user.avatar} alt="" style={style} />;
}

function username(user: User){
  return <span style={{ fontWeight: "bold" }} className="username-text">
            <span style={{ opacity: "0.5" }}>u/</span>
            {user.username}
          </span>
}

export const UserView: React.FC<{ user: User; link?: boolean }> = (props) => {
  const style: CSSProperties = {
    fontWeight: "bold",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {avatar(props.user, false)}

      {props.link !== false ? (
        <Link to={"/u/" + props.user.username} className="no-link-color">
          <div style={style}>
            { username(props.user) }
          </div>
        </Link>
      ) : (
        <div style={style}>
          { username(props.user) }
        </div>
      )}
    </div>
  );
};

export const UserViewRight: React.FC<{ user: User }> = (props) => {
  return (
    <>
      <Link to={"/u/" + props.user.username} className="no-link-color">
          { username(props.user) }
      </Link>
      {avatar(props.user, true)}
    </>
  );
};
