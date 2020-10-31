import React, { useState, useContext } from "react";
import { topBarMaxWidth, Context } from "./Context";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { Link, useLocation, NavLink } from "react-router-dom";
import { UserView } from "./UserView";

export const Header: React.FC<{}> = (props) => {
  const [isUserMenuDropdownOpen, setIsUserMenuDropdownOpen] = useState(false);
  const [isMobileNavMenuOpen, setIsMobileNavMenuOpen] = useState(false);
  const [subItemMenuOpenMap, setSubItemMenuOpenMap] = useState<{
    [key: string]: boolean | undefined;
  }>({});

  const [context] = useContext(Context);

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
      width: 48,
      subitems: [
        {
          name: "week",
          to: "/top/week",
        },
        {
          name: "month",
          to: "/top/month",
        },
        {
          name: "year",
          to: "/top/year",
        },
        {
          name: "all",
          to: "/top/all",
        },
      ],
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

  const location = useLocation();

  const collapsedMenuItem = menu.find(
    (item) => item.to === location.pathname
  ) || { name: "menu", to: "/" };

  return (
    <header>
      <div
        style={{
          maxWidth: topBarMaxWidth,
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
              {collapsedMenuItem.to && (
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
              )}
            </DropdownToggle>
            <DropdownMenu>
              {menu.map((item) =>
                item.to ? (
                  <Link
                    className="dropdown-item"
                    to={item.to}
                    onClick={() => setIsMobileNavMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  item.subitems?.map((subitem) => (
                    <Link
                      className="dropdown-item"
                      to={subitem.to}
                      onClick={() => setIsMobileNavMenuOpen(false)}
                    >
                      {item.name} | {subitem.name}
                    </Link>
                  ))
                )
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="d-none d-sm-flex align-items-center">
          {menu.map((item) =>
            !item.subitems ? (
              <NavLink
                key={item.name}
                to={item.to}
                exact={true}
                style={{ width: item.width }}
                activeStyle={{ fontWeight: "bold" }}
              >
                {item.name}
              </NavLink>
            ) : (
              <div>
                <Dropdown
                  isOpen={subItemMenuOpenMap[item.name]}
                  toggle={() =>
                    setSubItemMenuOpenMap((previous) => ({
                      ...previous,
                      [item.name]: !previous[item.name],
                    }))
                  }
                >
                  <DropdownToggle caret>
                    <NavLink
                      key={item.name}
                      to={
                        ["week", "month", "year", "all"]
                          .filter(
                            (period) => location.pathname === "/top/" + period
                          )
                          .join("") || "/top"
                      }
                      exact={true}
                      style={{ width: item.width }}
                      activeStyle={{ fontWeight: "bold" }}
                      onClick={(e) => item.subitems && e.preventDefault()}
                    >
                      {item.name}
                      {["week", "month", "year", "all"]
                        .filter(
                          (period) => location.pathname === "/top/" + period
                        )
                        .map((period) => " | " + period)}
                    </NavLink>
                  </DropdownToggle>
                  <DropdownMenu>
                    {item.subitems?.map((item) => (
                      <NavLink
                        className="dropdown-item"
                        key={item.name}
                        to={item.to}
                        exact={true}
                        activeStyle={{ fontWeight: "bold" }}
                        onClick={() => setSubItemMenuOpenMap({})}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            )
          )}
        </div>
        <div style={{ flex: 1 }} />
        <div className="create-new-dweet">
          <NavLink 
            to="/create"
            className="btn btn-primary d-flex align-items-center justify-content-center"
          >
            <span className="plus-icon"></span>
            <span className="create-new-dweet-label">
              New <span className="create-dweet-label">dweet</span>
            </span>
          </NavLink>
        </div>
        {context.user ? (
          <Dropdown
            isOpen={isUserMenuDropdownOpen}
            toggle={() => setIsUserMenuDropdownOpen(!isUserMenuDropdownOpen)}
            style={{ marginRight: -16 }}
          >
            <DropdownToggle
              style={{
                paddingLeft: 16,
                paddingRight: 16,
              }}
            >
              <UserView user={context.user} link={false} />
            </DropdownToggle>
            <DropdownMenu className="right">
              <Link
                className="dropdown-item"
                to={"/u/" + context.user.username + "/top"}
                onClick={() => {
                  setIsUserMenuDropdownOpen(false);
                }}
              >
                My dweets
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
  );
};
