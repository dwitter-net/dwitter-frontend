import React, { useState, useEffect, useContext } from 'react';
import { Dweet, setLike } from './api';
import { Context } from './Context';

export const AwesomeButton: React.FC<{
  dweet: Dweet | null;
  onUpdate?: (dweet: Dweet) => void;
}> = ({ dweet, onUpdate }) => {
  const [context] = useContext(Context);
  const [isAwesomeLoading, setIsAwesomeLoading] = useState(false);
  const [hasUserAwesomed, setHasUserAwesomed] = useState(
    dweet?.has_user_awesomed || false
  );
  const [cachedAwesomeCountForAnimation, setCachedAwesomeCountForAnimation] =
    useState(-1);
  const isEmptyStateDweet = dweet === null || dweet?.id === -1;
  useEffect(() => {
    setHasUserAwesomed(dweet?.has_user_awesomed || false);
    if (dweet && dweet.id !== 1) {
      setCachedAwesomeCountForAnimation((old) =>
        old === -1 ? dweet.awesome_count : old
      );
    }
  }, [dweet]);
  const animationParams = '0.3s cubic-bezier(0.680, -0.550, 0.265, 1.550)';
  return (
    <div className="border-radius d-flex">
      <div
        style={{
          width: 32,
          height: 32,
          background: hasUserAwesomed
            ? context.theme.primaryBackgroundTint
            : 'var(--secondaryBackgroundColor)',
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4,
          overflow: 'hidden',
          transition: `background ${animationParams}`,
        }}
      >
        {!isEmptyStateDweet && (
          <>
            <div
              style={{
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                transform: `translate3d(0px, ${
                  hasUserAwesomed ? 0 : -32
                }px, 0px)`,
                transition: `transform ${animationParams}`,
                color: context.theme.primaryTextTint,
              }}
            >
              {cachedAwesomeCountForAnimation + 1}
            </div>
            <div
              style={{
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                transform: `translate3d(0px, ${
                  hasUserAwesomed ? 0 : -32
                }px, 0px)`,
                transition: `transform ${animationParams}`,
              }}
            >
              {cachedAwesomeCountForAnimation}
            </div>
          </>
        )}
      </div>
      <button
        disabled={isAwesomeLoading || isEmptyStateDweet}
        className={hasUserAwesomed ? 'btn btn-primary' : 'btn btn-secondary'}
        style={{
          height: 32,
          padding: '0 8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          ...(isEmptyStateDweet ? { color: '#0000' } : {}),
        }}
        onClick={async (e) => {
          //@ts-ignore
          e.target.blur();
          e.preventDefault();
          if (!dweet) {
            return;
          }
          setIsAwesomeLoading(true);
          try {
            await context.requireLogin({
              reason: 'You need to log in in order to Awesome this dweet!',
              nextAction: 'click "Awesome!"',
            });
            setHasUserAwesomed((old) => {
              setLike(dweet.id, !dweet.has_user_awesomed).then(onUpdate);
              return !old;
            });
          } catch (e) {
            console.log(e);
            alert('Something went wrong. Please try again later.');
          } finally {
            setIsAwesomeLoading(false);
          }
        }}
      >
        Awesome!
      </button>
    </div>
  );
};
