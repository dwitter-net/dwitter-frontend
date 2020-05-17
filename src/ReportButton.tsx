import React, { useState, useContext } from "react";
import { Context } from "./Context";
import { reportDweet } from "./api";

export const ReportButton: React.FC<{ dweetId : number, isEmptyStateDweet : boolean }> = (props) => {
  const [hasReported, setHasReported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [context, _] = useContext(Context);
  return (
        <a
            href="#"
            style={{
                marginLeft: 16,
                    ...(props.isEmptyStateDweet
                        ? { background: "var(--blue)", borderRadius: 4, opacity: 0.33 }
                        : {}),
                    ...(hasReported
                        ? {color: "gray"}
                        : {}),
            }}
            onClick={async (e) => {
                e.preventDefault();

                if (hasReported){
                    return;
                }
                if (!window.confirm(
                    'Are you sure you want to report this to a moderator?')) {
                    return;
                }
                try {
                    await context.requireLogin({
                        reason:
                        "You need to log in in order to report this dweet! Log in now, the dweet will be reported",
                        nextAction: "report dweet",
                    });
                } catch {
                    return;
                }

                setIsLoading(true);
                try{
                    await reportDweet(props.dweetId)
                    setHasReported(true);
                }catch{
                    alert("Something went wrong when trying to report this dweet. If this persists, let us know on discord");
                    setHasReported(false);
                }finally{
                    setIsLoading(false);
                }
            }
            }
        >
            {isLoading ? 'Reporting' : hasReported ? 'Reported' : 'Report'}
        </a>
  );
};
