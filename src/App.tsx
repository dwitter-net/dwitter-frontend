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
} from "reactstrap";
import { Create } from "./Create";
import { SingleDweet } from "./SingleDweet";
import { Settings } from "./Settings";

for (const item of [
  {
    prefix: "d/",
    regex: /[a-zA-Z0-9_]+/,
    normalize: (match: any) => (match.url = "https://dwitter.net/" + match.url),
  },
  {
    prefix: "u/",
    regex: /[a-zA-Z0-9_]+/,
    normalize: (match: any) => (match.url = "https://dwitter.net/" + match.url),
  },
  {
    prefix: "c/",
    regex: /[a-zA-Z0-9_]+/,
    normalize: (match: any) => (match.url = "https://dwitter.net/" + match.url),
  },
  {
    prefix: "#",
    regex: /[a-zA-Z_][a-zA-Z0-9_-]+/,
    normalize: (match: any) =>
      (match.url = "https://dwitter.net/h/" + match.url.slice(1)),
  },
]) {
  linkify.add(item.prefix, {
    validate: (text: string, pos: number, self: any) => {
      console.log("validato", item.prefix, text, pos);
      const tail = text.slice(pos);
      console.log("tail", tail);
      if (item.regex.test(tail)) {
        console.log("matcho");
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

function App() {
  const [context, setContext] = useState<AppContext>({
    user: JSON.parse(localStorage.getItem("user") || "null"),
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
                      <Link to={"/d/" + context.user.username}>My profile</Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link to={"/d/" + context.user.username + "/awesome"}>
                        My awesomed dweets
                      </Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link to={"/" + context.user.username + "/settings"}>
                        Settings
                      </Link>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Log out</DropdownItem>
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
            <Route
              path="/create"
              key="new"
              exact={true}
              component={Create}
            ></Route>
            {context.user && (
              <Route
                path={"/" + context.user.username + "/settings"}
                exact={true}
                component={Settings}
              />
            )}
            <Route path="/d/:id" exact={true} component={SingleDweet} />
            <Route path="/new" key="new" exact={true}>
              <Feed key="new" feedName="new" order_by="-posted" />
            </Route>
            <Route path="/top" key="top" exact={true}>
              <Feed key="top" feedName="top" order_by="-likes" />
            </Route>
            <Route path="/random" key="random" exact={true}>
              <Feed key="random" feedName="random" order_by="?" />
            </Route>
            <Route path="/about" exact={true} component={About} />
            <Route path="" key="hot" exact={true}>
              <Feed key="hot" feedName="hot" order_by="-hotness" />
            </Route>
          </Switch>
        </div>
      </Router>
    </Context.Provider>
  );
}

export default App;
