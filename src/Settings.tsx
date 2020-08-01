import React, { useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { UserView } from "./UserView";
import { Helmet } from "react-helmet";
import { Context, pageMaxWidth, themes } from "./Context";
import { SetEmailForm } from "./SetEmailForm";
import { SetPasswordForm } from "./SetPasswordForm";

export const Settings: React.FC<RouteComponentProps> = () => {
  const [context, setContext] = useContext(Context);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <div style={{ maxWidth: pageMaxWidth, flex: 1, padding: 16 }}>
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
        </div>

        <div className="card p-3 mt-3">
          <SetEmailForm />
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
                    ).matches
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

        <div className="card p-3 mt-3">
          <SetPasswordForm />
        </div>
      </div>
    </div>
  );
};
