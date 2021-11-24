import React, { useState, useEffect, useRef, useContext } from "react";
import { DweetCard } from "./DweetCard";
import { Dweet, getDweets, Stats, getStats} from "./api";
import { Link, RouteComponentProps, NavLink } from "react-router-dom";
import { Context } from "./Context";
import { Helmet } from "react-helmet";
import { pageMaxWidth } from "./Context";

export interface FeedProps {
  order_by: string;
  name: string;
  period?: "week" | "month" | "year" | "all";
}

export const Feed: React.FC<
  FeedProps & RouteComponentProps<{ hashtag?: string; username?: string }>
> = (props) => {
  const [dweets, setDweets] = useState<Dweet[][]>([]);
  const pageState = useRef({ current: 0, target: 0 });
  const [page, setPage] = useState(0);
  const [stats, setStats] = useState<Stats>({awesome_count: 0, dweet_count: 0});

  const hashtag = props.match.params.hashtag || "";
  const username = props.match.params.username || "";
  const infiniteScrollSensorDivRef = useRef<HTMLDivElement>(null);
  const infiniteScrollSensorDiv = infiniteScrollSensorDivRef.current;
  const [context] = useContext(Context);

  useEffect(() => {
    if (!infiniteScrollSensorDiv) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.intersectionRatio > 0) {
          if (pageState.current.target === pageState.current.current) {
            pageState.current.target += 1;
            setPage(pageState.current.target);
          }
        }
      }
    });
    observer.observe(infiniteScrollSensorDiv);
  }, [infiniteScrollSensorDiv]);

  useEffect(() => {
    getDweets(
      props.order_by,
      hashtag,
      username,
      page,
      props.period || "all"
    ).then((data) => {
      pageState.current.current = page;
      setDweets((dweets) => {
        dweets[page] = data.results;
        return dweets.slice();
      });
    });
  }, [
    hashtag,
    page,
    props.order_by,
    username,
    props.period,
    props.history.length,
  ]);

  useEffect(
    () => {
      if(username) {
        getStats(username).then(setStats)
      }
    },
    [username]
  );

  const pathRoot = hashtag ? "/h/" + hashtag : "/u/" + username;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Helmet>
        <title>{props.name}</title>
      </Helmet>
      <div
        style={{
          maxWidth: pageMaxWidth,
          width: "100%",
          padding: 16,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {hashtag || username ? (
          <div className="card text-center mb-3 p-3">
            <div className="d-flex align-items-center">
              <div
                style={{
                  fontWeight: "bold",
                  marginRight: 16,
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {hashtag && "#" + hashtag}
                {
                  username &&
                  <span title={`Total dweets: ${stats.dweet_count}`}>
                  {`u/${username}(${stats.awesome_count})`}
                  </span>
                }
              </div>
              <div style={{ marginLeft: 16, display: "flex" }}>
                <NavLink
                  to={`${pathRoot}/hot`}
                  exact={true}
                  style={{
                    width: 48,
                  }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  hot
                </NavLink>
                <NavLink
                  to={`${pathRoot}/new`}
                  exact={true}
                  style={{
                    width: 48,
                  }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  new
                </NavLink>
                <NavLink
                  to={`${pathRoot}/top`}
                  exact={true}
                  style={{
                    width: 48,
                  }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  top
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
                background: context.theme.secondaryBackgroundColor,
                color: context.theme.secondaryTextColor,
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

        {dweets.length === 0 && <DweetCard dweet={null} />}

        {dweets.flat().map((dweet) => (
          <DweetCard key={dweet.id} dweet={dweet} />
        ))}
      </div>
      <div
        ref={infiniteScrollSensorDivRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "100vh",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
