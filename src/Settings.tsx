import React, { useState, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { UserView } from "./UserView";
import { Context } from "./Context";

export const Settings: React.FC<RouteComponentProps> = (props) => {
  const [email, setEmail] = useState("");
  const [context, _] = useContext(Context);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="mt-3" style={{ maxWidth: 600, flex: 1 }}>
        <div className="card p-3">
          <UserView user={context.user!} />

          <p className="mt-3">
            Your avatar is automatically fetched from your email address. Change
            your avatar on{" "}
            <a
              href="https://gravatar.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gravatar
            </a>
            .
          </p>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="text"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
