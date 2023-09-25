import React, { useState, useContext } from 'react';
import { Context } from './Context';
import { reportDweet, reportComment } from './api';

export const ReportButton: React.FC<{
  dweetId?: number;
  commentId?: number;
  isEmptyStateDweet: boolean;
}> = (props) => {
  const [hasReported, setHasReported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [context] = useContext(Context);

  const object = props.dweetId ? 'dweet' : 'comment';
  return (
    <a
      href="/"
      style={{
        ...(props.isEmptyStateDweet
          ? { background: 'var(--blue)', borderRadius: 4, opacity: 0.33 }
          : {}),
        ...(hasReported ? { color: 'gray' } : {}),
      }}
      onClick={async (e) => {
        e.preventDefault();

        if (hasReported) {
          return;
        }
        if (
          !window.confirm(
            'Are you sure you want to report this to a moderator?'
          )
        ) {
          return;
        }
        try {
          await context.requireLogin({
            reason: `You need to log in in order to report this ${object}! Log in now, the ${object} will be reported.`,
            nextAction: `report ${object}`,
          });
        } catch {
          return;
        }

        setIsLoading(true);
        try {
          if (props.dweetId) {
            await reportDweet(props.dweetId);
          }
          if (props.commentId) {
            await reportComment(props.commentId);
          }
          setHasReported(true);
        } catch {
          alert(
            `Something went wrong when trying to report this ${object}. If this persists, let us know on discord.`
          );
          setHasReported(false);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {isLoading ? 'reporting' : hasReported ? 'reported' : 'report'}
    </a>
  );
};
