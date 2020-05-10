import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { getDweet, Dweet } from "./api";
import { DweetCard } from "./DweetCard";

export const SingleDweet: React.FC<RouteComponentProps<{ id: string }>> = (
  props
) => {
  const [dweet, setDweet] = useState<Dweet | null>(null);

  useEffect(() => {
    getDweet(+props.match.params.id).then(setDweet);
  }, [props.match.params.id]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="mt-3" style={{ maxWidth: 600, flex: 1 }}>
        {dweet && <DweetCard dweet={dweet} />}
      </div>
    </div>
  );
};
