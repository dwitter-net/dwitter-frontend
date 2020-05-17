import React from "react";
import { User } from "./api";
import { Link } from "react-router-dom";

function avatar(user: User, right: boolean){
  return (
      <img
        src={user.avatar}
        alt=""
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          boxShadow: "0 0px 2px rgba(0, 0, 0, 0.2)",
          marginRight: right? 0 : 16 ,
          marginLeft: right? 8 : 0,
        }}
      />
    );
}

export const UserView: React.FC<{ user: User; link?: boolean; }> = (props) => {

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
          <div style={{ fontWeight: "bold" }}>
          {props.user.username}
          </div>
        </Link>
      ) : (
        <div style={{ fontWeight: "bold" }}>{props.user.username}</div>
      )}

    </div>
  );
};

export const UserViewRight: React.FC<{ user: User }> = (props) => {

  return (
    <>
        <Link to={"/u/" + props.user.username} className="no-link-color">
            <span style={{ fontWeight: "bold" }}>
              <span style={{ opacity: "0.5"}}>
                u/
              </span>
              { props.user.username }
            </span>
          </Link>
        { avatar(props.user, true) }
      </>
  );
};
