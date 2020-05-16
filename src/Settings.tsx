import React, { useState, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { UserView } from "./UserView";
import { Context, themes } from "./Context";

export const Settings: React.FC<RouteComponentProps> = (props) => {
  const [email, setEmail] = useState("");
  const [context, setContext] = useContext(Context);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 600, flex: 1, padding: 16 }}>
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

        <div className="card p-3 mt-3">
          <div style={{ fontWeight: "bold", marginBottom: 16 }}>
            Color scheme
          </div>
          {[
            { key: "light", name: "Light" },
            { key: "dark", name: "Dark" },
            { key: "automatic", name: "Automatically use OS settings" },
          ].map((mode) => (
            <div className="custom-control custom-radio">
              <input
                className="custom-control-input"
                checked={
                  mode.key ===
                  (window.localStorage.getItem("themeMode") || "automatic")
                }
                type="radio"
                name="theme-mode"
                value={mode.key}
                id={"theme-mode-" + mode.key}
                onChange={() => {
                  window.localStorage.setItem("themeMode", mode.key);
                  let themeMode = mode.key;
                  if (themeMode === "automatic") {
                    themeMode = window.matchMedia(
                      "(prefers-colors-scheme: dark)"
                    )
                      ? "dark"
                      : "light";
                  }
                  setContext({ theme: themes[themeMode] });
                }}
              />
              <label
                className="custom-control-label"
                htmlFor={"theme-mode-" + mode.key}
              >
                {mode.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
