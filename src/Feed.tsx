import React, { useState, useEffect } from "react";
import { DweetCard } from "./DweetCard";
import { Dweet, getDweets } from "./api";
import { Link, RouteComponentProps, NavLink } from "react-router-dom";

interface Props {
  feedName: string;
  order_by: string;
}

export const Feed: React.FC<
  Props & RouteComponentProps<{ hashtag?: string }>
> = (props) => {
  const [dweets, setDweets] = useState<Dweet[] | null>(null);

  const hashtag = props.match.params.hashtag || "";

  useEffect(() => {
    getDweets(props.order_by, hashtag).then((data) => {
      setDweets(data.results);
    });
  }, [hashtag, props.order_by]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 600,
          paddingTop: 16,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {hashtag ? (
          <div className="card text-center mb-3 px-3" style={{ padding: 16 }}>
            <div className="d-flex align-items-center">
              <div
                style={{
                  fontWeight: "bold",
                  marginRight: 16,
                  flex: 1,
                  textAlign: "left",
                }}
              >
                #{hashtag}
              </div>
              <div style={{ marginLeft: 16, display: "flex" }}>
                <NavLink
                  to={`/h/${hashtag}/top`}
                  exact={true}
                  style={{
                    width: 48,
                  }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  top
                </NavLink>
                <NavLink
                  to={`/h/${hashtag}/new`}
                  exact={true}
                  style={{
                    width: 48,
                  }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  new
                </NavLink>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="card text-center mb-3 px-3"
            style={{
              paddingTop: 4,
              paddingBottom: 4,
              display: "flex",
              color: "white",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link
              to="/h/cavern/top"
              href="#"
              style={{ fontWeight: "bold", padding: "12px 16px 16px 16px" }}
            >
              #cavern
            </Link>
            <div
              style={{
                color: "#222",
                background: "#eee",
                marginTop: -4,
                marginBottom: -4,
                marginLeft: -16,
                marginRight: -16,
                paddingTop: 4,
                paddingBottom: 4,
                paddingRight: 16,
                paddingLeft: 16,
                alignSelf: "stretch",
                textAlign: "center",
              }}
            >
              Theme challenge of the month
            </div>
          </div>
        )}
        {dweets &&
          dweets.map((dweet) => <DweetCard key={dweet.id} dweet={dweet} />)}
      </div>
    </div>
  );
};
