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
import { AppContext, Context } from "./Context";
import { About } from "./About";
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Modal,
} from "reactstrap";
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
  <Feed order_by="-likes" {...props} />
);

const HotFeed = (props: RouteComponentProps) => (
  <Feed order_by="-hotness" {...props} />
);

const NewHashtagFeed = (props: RouteComponentProps<{ hashtag: string }>) => (
  <Feed order_by="-posted" {...props} />
);

const TopHashtagFeed = (props: RouteComponentProps<{ hashtag: string }>) => (
  <Feed order_by="-likes" {...props} />
);

const HotHashtagFeed = (props: RouteComponentProps<{ hashtag: string }>) => (
  <Feed order_by="-hotness" {...props} />
);

const HotUserFeed = (props: RouteComponentProps<{ username: string }>) => (
  <Feed order_by="-hotness" {...props} />
);

const TopUserFeed = (props: RouteComponentProps<{ username: string }>) => (
  <Feed order_by="-likes" {...props} />
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
  const [context, setContext] = useState<AppContext>({
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Context.Provider
      value={[context, (partial) => setContext({ ...context, ...partial })]}
    >
      <Router>
        <div className="App">
          <header>
            <div
              style={{
                maxWidth: 600,
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
              <NavLink
                to="/"
                exact={true}
                style={{ width: 48 }}
                activeStyle={{ fontWeight: "bold" }}
              >
                hot
              </NavLink>
              <NavLink
                to="/new"
                exact={true}
                style={{ width: 48 }}
                activeStyle={{ fontWeight: "bold" }}
              >
                new
              </NavLink>
              <NavLink
                to="/top"
                exact={true}
                style={{ width: 48 }}
                activeStyle={{ fontWeight: "bold" }}
              >
                top
              </NavLink>
              <NavLink
                to="/random"
                exact={true}
                style={{ width: 64 + 16 }}
                activeStyle={{ fontWeight: "bold" }}
              >
                random
              </NavLink>
              <NavLink
                to="/about"
                exact={true}
                style={{ width: 64 + 16 }}
                activeStyle={{ fontWeight: "bold" }}
              >
                about
              </NavLink>
              <div style={{ flex: 1 }} />
              {context.user ? (
                <Dropdown
                  isOpen={isDropdownOpen}
                  toggle={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <DropdownToggle>
                    <UserView user={context.user} />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>
                      <Link to={"/u/" + context.user.username + "/top"}>
                        My profile
                      </Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link to={"/u/" + context.user.username + "/awesome"}>
                        My awesomed dweets
                      </Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link to={"/" + context.user.username + "/settings"}>
                        Settings
                      </Link>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                      onClick={(e) => {
                        e.preventDefault();
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/";
                      }}
                    >
                      Log out
                    </DropdownItem>
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
