import React, { useState, useContext } from 'react';
import { Context } from './Context';
import { deleteComment, deleteDweet } from './api';

export const DeleteButton: React.FC<{
  dweetId?: number;
  commentId?: number;
  onDeleted?: () => void;
  isEmptyStateDweet: boolean;
}> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [context] = useContext(Context);

  const object = props.dweetId ? 'dweet' : 'comment';
  return (
    <a
      href="/"
      style={{
        ...(props.isEmptyStateDweet
          ? { background: 'var(--blue)', borderRadius: 4, opacity: 0.33 }
          : { color: 'var(--red)' }),
      }}
      onClick={async (e) => {
        e.preventDefault();

        if (
          !window.confirm(
            'Are you sure you want to delete this ' + object + '?'
          )
        ) {
          return;
        }
        try {
          await context.requireLogin({
            reason: `You need to log in in order to delete this ${object}! Log in now, the ${object} will be deleted if it's yours.`,
            nextAction: `Delete ${object}`,
          });
        } catch {
          return;
        }

        setIsLoading(true);
        try {
          if (props.dweetId) {
            await deleteDweet(props.dweetId);
            if (props.onDeleted) {
              props.onDeleted();
            }
          } else if (props.commentId) {
            await deleteComment(props.commentId);
            if (props.onDeleted) {
              props.onDeleted();
            }
          }
        } catch (e) {
          console.log(e);
          alert(
            `Something went wrong when trying to delete this ${object}. If this persists, let us know on discord.`
          );
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {isLoading ? 'deleting' : 'delete'}
    </a>
  );
};
