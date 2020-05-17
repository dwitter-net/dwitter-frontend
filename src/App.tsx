import React, { useState } from "react";
import "./App.scss";

//@ts-ignore
import { linkify } from "react-linkify";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Link,
  RouteComponentProps,
} from "react-router-dom";
import { Feed } from "./Feed";
import { Login } from "./Login";
import { UserView } from "./UserView";
import { AppContext, Context, themes } from "./Context";
import { About } from "./About";
import { Dropdown, DropdownToggle, DropdownMenu, Modal } from "reactstrap";
import { Create } from "./Create";
import { SingleDweet } from "./SingleDweet";
import { Settings } from "./Settings";
import { LoginForm } from "./LoginForm";

const NewFeed = (props: RouteComponentProps) => (
  <Feed order_by="-posted" {...props} />
);

const RandomFeed = (props: RouteComponentProps) => (
  <Feed order_by="?" {...props} />
);

const TopFeed = (props: RouteComponentProps) => (
  <Feed order_by="-awesome_count" {...props} />
);

const HotFeed = (props: RouteComponentProps) => (
  <Feed order_by="-hotness" {...props} />
);

const NewHashtagFeed = (props: RouteComponentProps<{ hashtag: string }>) => (
  <Feed order_by="-posted" {...props} />
);

const TopHashtagFeed = (props: RouteComponentProps<{ hashtag: string }>) => (
  <Feed order_by="-awesome_count" {...props} />
);

const HotHashtagFeed = (props: RouteComponentProps<{ hashtag: string }>) => (
  <Feed order_by="-hotness" {...props} />
);

const HotUserFeed = (props: RouteComponentProps<{ username: string }>) => (
  <Feed order_by="-hotness" {...props} />
);

const TopUserFeed = (props: RouteComponentProps<{ username: string }>) => (
  <Feed order_by="-awesome_count" {...props} />
);

const NewUserFeed = (props: RouteComponentProps<{ username: string }>) => (
  <Feed order_by="-posted" {...props} />
);

for (const item of [
  {
    prefix: "d/",
    regex: /[a-zA-Z0-9_]+/,
    normalize: (match: any) => (match.url = "/" + match.url),
  },
  {
    prefix: "u/",
    regex: /[a-zA-Z0-9_]+/,
    normalize: (match: any) => (match.url = "/" + match.url),
  },
  {
    prefix: "c/",
    regex: /[a-zA-Z0-9_]+/,
    normalize: (match: any) => (match.url = "/" + match.url),
  },
  {
    prefix: "#",
    regex: /[a-zA-Z_][a-zA-Z0-9_-]+/,
    normalize: (match: any) =>
      (match.url = "/h/" + match.url.slice(1) + "/top"),
  },
]) {
  linkify.add(item.prefix, {
    validate: (text: string, pos: number, self: any) => {
      const tail = text.slice(pos);
      if (item.regex.test(tail)) {
        const match = tail.match(item.regex);
        if (match) {
          return match[0].length;
        }
      }
      return 0;
    },
    normalize: item.normalize,
  });
}

interface LoginRequest {
  reason: string;
  nextAction: string;
  promise: Promise<any>;
  resolve: () => void;
  reject: () => void;
}

function App() {
  const [
    currentLoginRequest,
    setCurrentLoginRequest,
  ] = useState<LoginRequest | null>(null);

  let themeMode = localStorage.getItem("themeMode") || "automatic";
  if (themeMode === "automatic") {
    themeMode = window.matchMedia("(prefers-colors-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  const [context, setContext] = useState<AppContext>({
    theme: themes[themeMode],
    user: JSON.parse(localStorage.getItem("user") || "null"),
    requireLogin: async (options: { reason: string; nextAction: string }) => {
      if (localStorage.getItem("user")) {
        return;
      }
      if (currentLoginRequest) {
        return await currentLoginRequest.promise;
      }
      const loginPromise: Partial<LoginRequest> = { ...options };
      loginPromise.promise = new Promise((resolve, reject) => {
        loginPromise.resolve = resolve;
        loginPromise.reject = reject;
      });
      setCurrentLoginRequest(loginPromise as LoginRequest);
      try {
        await loginPromise.promise;
      } catch {
        setCurrentLoginRequest(null);
        throw new Error();
      }
      if (currentLoginRequest === loginPromise) {
        setCurrentLoginRequest(null);
      }
    },
  });

  const [isUserMenuDropdownOpen, setIsUserMenuDropdownOpen] = useState(false);
  const [isMobileNavMenuOpen, setIsMobileNavMenuOpen] = useState(false);

  const menu = [
    {
      name: "hot",
      to: "/",
      width: 48,
    },
    {
      name: "new",
      to: "/new",
      width: 48,
    },
    {
      name: "top",
      to: "/top",
      width: 48,
    },
    {
      name: "random",
      to: "/random",
      width: 80,
    },
    {
      name: "about",
      to: "/about",
      width: 80,
    },
  ];

  const collapsedMenuItem = menu.find(
    (item) => item.to === window.location.pathname
  ) || { name: "menu", to: "/" };

  return (
    <Context.Provider
      value={[context, (partial) => setContext({ ...context, ...partial })]}
    >
      <style>
        {`:root {${Object.entries(context.theme)
          .map(([key, value]) => "--" + key + ": " + value)
          .join(";")}}`}
      </style>
      <Router>
        <div
          className="App"
          style={{
            background: context.theme.pageBackgroundColor,
            color: context.theme.mainTextColor,
          }}
        >
          <header>
            <div
              style={{
                maxWidth: 600,
                paddingLeft: 16,
                paddingRight: 16,
                display: "flex",
                alignItems: "center",
                flex: 1,
                textAlign: "center",
              }}
            >
              <div style={{ marginRight: 32 }}>
                <a href="/" className="no-link-styling">
                  Dwitter.net
                </a>
              </div>
              <div className="d-flex d-sm-none">
                <Dropdown
                  isOpen={isMobileNavMenuOpen}
                  toggle={() => setIsMobileNavMenuOpen(!isMobileNavMenuOpen)}
                >
                  <DropdownToggle caret={true}>
                    <NavLink
                      to={collapsedMenuItem.to}
                      exact={true}
                      style={{
                        pointerEvents: "none",
                        display: "inline-block",
                        marginRight: 8,
                      }}
                      activeStyle={{
                        fontWeight: "bold",
                      }}
                    >
                      {collapsedMenuItem.name}
                    </NavLink>
                  </DropdownToggle>
                  <DropdownMenu>
                    {menu.map((item) => (
                      <Link
                        className="dropdown-item"
                        to={item.to}
                        onClick={() => setIsMobileNavMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="d-none d-sm-flex">
                {menu.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    exact={true}
                    style={{ width: item.width }}
                    activeStyle={{ fontWeight: "bold" }}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
              <div style={{ flex: 1 }} />
              {context.user ? (
                <Dropdown
                  isOpen={isUserMenuDropdownOpen}
                  toggle={() =>
                    setIsUserMenuDropdownOpen(!isUserMenuDropdownOpen)
                  }
                  style={{ marginRight: -16 }}
                >
                  <DropdownToggle
                    style={{
                      paddingLeft: 16,
                      paddingRight: 16,
                    }}
                  >
                    <UserView user={context.user} />
                  </DropdownToggle>
                  <DropdownMenu className="right">
                    <Link
                      className="dropdown-item"
                      to={"/u/" + context.user.username + "/top"}
                      onClick={() => {
                        setIsUserMenuDropdownOpen(false);
                      }}
                    >
                      My profile
                    </Link>
                    <Link
                      className="dropdown-item"
                      to={"/u/" + context.user.username + "/awesome"}
                      onClick={() => {
                        setIsUserMenuDropdownOpen(false);
                      }}
                    >
                      My awesomed dweets
                    </Link>
                    <Link
                      className="dropdown-item"
                      to={"/" + context.user.username + "/settings"}
                      onClick={() => {
                        setIsUserMenuDropdownOpen(false);
                      }}
                    >
                      Settings
                    </Link>
                    <div
                      style={{
                        height: 1,
                        background: context.theme.secondaryBorderColor,
                        marginTop: 8,
                        marginBottom: 8,
                      }}
                    />
                    <Link
                      className="dropdown-item"
                      to={"/"}
                      onClick={(e) => {
                        e.preventDefault();
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/";
                      }}
                    >
                      Log out
                    </Link>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <NavLink to="/accounts/login" exact={true}>
                  Log in
                </NavLink>
              )}
            </div>
          </header>
          <Switch>
            <Route
              path="/accounts/login/"
              exact={true}
              component={Login}
            ></Route>
            <Route path="/create" exact={true} component={Create}></Route>
            {context.user && (
              <Route
                path={"/" + context.user.username + "/settings"}
                exact={true}
                component={Settings}
              />
            )}
            <Route path="/d/:id" exact={true} component={SingleDweet} />
            <Route path="/new" exact={true} component={NewFeed} />
            <Route path="/top" exact={true} component={TopFeed} />
            <Route path="/random" exact={true} component={RandomFeed} />
            <Route
              path="/h/:hashtag/top"
              exact={true}
              component={TopHashtagFeed}
            />
            <Route
              path="/h/:hashtag/hot"
              exact={true}
              component={HotHashtagFeed}
            />
            <Route path="/h/:hashtag" exact={true} component={HotHashtagFeed} />
            <Route
              path="/h/:hashtag/new"
              exact={true}
              component={NewHashtagFeed}
            />
            <Route
              path="/u/:username/top"
              exact={true}
              component={TopUserFeed}
            />
            <Route
              path="/u/:username/hot"
              exact={true}
              component={HotUserFeed}
            />
            <Route path="/u/:username" exact={true} component={HotUserFeed} />
            <Route
              path="/u/:username/new"
              exact={true}
              component={NewUserFeed}
            />
            <Route path="/about" exact={true} component={About} />

            <Route path="" exact={true} component={HotFeed} />
          </Switch>
        </div>
        <Modal
          isOpen={!!currentLoginRequest}
          keyboard={true}
          toggle={() => currentLoginRequest && currentLoginRequest.reject()}
        >
          <div className="p-3">
            <div className="d-flex justify-content-center align-items-center flex-column">
              <div className="d-flex justify-content-center align-items-stretch flex-column">
                <div
                  className="alert alert-info"
                  style={{
                    marginTop: 16,
                    marginBottom: 32,
                    maxWidth: 16 * 18,
                  }}
                >
                  {currentLoginRequest && currentLoginRequest.reason}
                </div>

                {currentLoginRequest && (
                  <LoginForm
                    nextAction={currentLoginRequest.nextAction}
                    onLogin={() => {
                      currentLoginRequest.resolve();
                      setCurrentLoginRequest(null);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </Modal>
      </Router>
    </Context.Provider>
  );
}

export default App;
