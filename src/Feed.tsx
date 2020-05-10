import React, { useState, useEffect } from "react";
import { DweetCard } from "./DweetCard";
import { Dweet, getDweets } from "./api";

interface Props {
  feedName: string;
  order_by: string;
}

export const Feed: React.FC<Props> = (props) => {
  const [dweets, setDweets] = useState<Dweet[] | null>(null);

  useEffect(() => {
    getDweets(props.order_by).then((data) => {
      setDweets(data.results);
    });
  }, [props.order_by]);

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
          <a
            href="#"
            style={{ fontWeight: "bold", padding: "12px 16px 16px 16px" }}
          >
            #cavern
          </a>
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

        {dweets &&
          dweets.map((dweet) => <DweetCard key={dweet.id} dweet={dweet} />)}
      </div>
    </div>
  );
};
