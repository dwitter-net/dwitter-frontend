import React, { useEffect, useState, useRef, useContext, useCallback, useMemo } from 'react';
import { Dweet, setLike, addComment, postDweet, getDweet } from './api';
import { UserView, UserViewRight } from './UserView';
import { ReportButton } from './ReportButton';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import { Modal } from 'reactstrap';
import Linkify from 'react-linkify';
import { Context } from './Context';
import { Link, Redirect } from 'react-router-dom';
import hljs from 'highlight.js/lib/core';
import javascriptHLJS from 'highlight.js/lib/languages/javascript';
import Switch from 'react-switch';
import { getDweetLength } from './utils';

hljs.registerLanguage('js', javascriptHLJS);

interface Props {
  dweet: Dweet | null;
}

const compressionIncipit = 'eval(unescape(escape';
const compressionTail = '.replace(/u';

const isCodeCompressed = (code: string) =>
  code.lastIndexOf(compressionIncipit) !== -1 &&
  code.lastIndexOf(compressionTail) !== -1;

const getUncompressedCode = (code: string) =>
  code.slice(0, code.lastIndexOf(compressionIncipit)) +
  unescape(
    escape(
      code.slice(
        code.lastIndexOf(compressionIncipit) + 21,
        code.lastIndexOf(compressionTail) - 1
      )
    ).replace(/u../g, '')
  ) +
  code.slice(code.lastIndexOf(compressionTail) + 21, code.length);

interface HLJSNodeObject {
  kind: string;
  children: HLJSNode[];
}

type HLJSNode = HLJSNodeObject | string;

function renderHLJSNode(node: HLJSNode, i: number) {
  if (typeof node === 'string') {
    return <span key={i}>{node}</span>;
  }
  return (
    <span key={i} className={'hljs-' + node.kind}>
      {node.children.map((child, j) => renderHLJSNode(child, j))}
    </span>
  );
}

export const DweetCard: React.FC<Props> = (props) => {
  const [iframeContainer, setIframeContainer] = useState<HTMLDivElement | null>(
    null
  );
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [shouldExpandComments, setShouldExpandComments] = useState(false);
  const [isAwesomeLoading, setIsAwesomeLoading] = useState(false);
  const [updatedDweet, setUpdatedDweet] = useState<Dweet | null>(null);
  const [replyText, setReplyText] = useState('');
  const [originalShouldShowIframe, setShouldShowIframe] = useState(false);

  const [remixText, setRemixText] = useState('');
  const [hasDweetChanged, setHasDweetChanged] = useState(false);
  const [hasCodeBeenFocused, setHasCodeBeenFocused] = useState(false);

  const [newDweetRedirect, setNewDweetRedirect] = useState<string | null>(null);

  const [context, _] = useContext(Context);

  const isEmptyStateDweet = props.dweet === null;
  const shouldShowIframe = originalShouldShowIframe && !isEmptyStateDweet;

  useEffect(() => {
    if (!iframeContainer) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (shouldShowIframe !== entry.isIntersecting) {
          setShouldShowIframe(entry.isIntersecting);
        }
      });
    });
    observer.observe(iframeContainer);
  }, [iframeContainer, shouldShowIframe]);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showRemixListModal, setShowRemixListModal] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const dweet: Dweet = (updatedDweet ? updatedDweet : props.dweet) || {
    id: -1,
    code: '',
    awesome_count: 0,
    author: {
      id: -1,
      username: '',
      avatar: '',
    },
    posted: '',
    link: '',
    has_user_awesomed: false,
    comments: [],
    remix_of: null,
    remixes: [],
  };

  const [code, setCode] = useState(dweet?.code || '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const originalCode = useMemo(() => dweet?.code || '', []);
  const isOriginalCodeCompressed = useMemo(() => isCodeCompressed(originalCode), [originalCode]);

  const shouldStickyFirstComment =
    dweet.comments.length > 0 &&
    dweet.comments[0].author.id === dweet.author.id;

  const shouldCollapseComments =
    dweet.comments.length > 6 && !shouldExpandComments;
  const comments = shouldCollapseComments
    ? dweet.comments.slice(dweet.comments.length - 5)
    : dweet.comments;

  
  const getCompressedCode = useCallback(() => {
    if (isOriginalCodeCompressed && !hasDweetChanged) {
      // if the dweet has not been edited, recover original compressed code
      return originalCode;
    }

    let r = '';
    for (let i = 0; i < code.length; i += 2)
      r += String.fromCharCode(
        0xd800 + code.charCodeAt(i),
        0xdc00 + (code.charCodeAt(i + 1) || 10)
      );
    return 'eval(unescape(escape`' + r + "`.replace(/u../g,'')))";
  }, [code, originalCode, hasDweetChanged, isOriginalCodeCompressed]);

  return (
    <div className="card p-3 mb-3">
      <div
        style={{
          padding: '0 0 56.25%',
          position: 'relative',
          height: 0,
          width: '100%',
          marginBottom: 16,
        }}
      >
        <div
          ref={setIframeContainer}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {shouldShowIframe && (
            <iframe
              ref={setIframe}
              title={'dweet_' + dweet.id}
              src={
                process.env.REACT_APP_API_EMBED_BASE_URL +
                'id/' +
                dweet.id +
                '?autoplay=true&code=' +
                encodeURIComponent(code)
              }
              sandbox="allow-same-origin allow-scripts"
              style={{
                width: '100%',
                height: '100%',
                border: 0,
                borderRadius: 2,
              }}
            />
          )}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
            }}
          >
            <div className="border-radius d-flex">
              <div
                style={{
                  width: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  background: context.theme.pageBackgroundColor,
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 4,
                }}
              >
                {!isEmptyStateDweet && dweet.awesome_count}
              </div>
              <button
                disabled={isAwesomeLoading || isEmptyStateDweet}
                className={
                  dweet.has_user_awesomed
                    ? 'btn btn-primary'
                    : 'btn btn-secondary'
                }
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
                  setIsAwesomeLoading(true);
                  try {
                    await context.requireLogin({
                      reason:
                        'You need to log in in order to Awesome this dweet!',
                      nextAction: 'click "Awesome!"',
                    });
                    const newDweet = await setLike(
                      dweet.id,
                      !dweet.has_user_awesomed
                    );
                    setUpdatedDweet(newDweet);
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
          </div>
        </div>
        <ReportButton
          dweetId={dweet.id}
          isEmptyStateDweet={isEmptyStateDweet}
        />
        <a
          href="#"
          style={{
            marginLeft: 16,
            ...(isEmptyStateDweet
              ? { background: 'var(--blue)', borderRadius: 4, opacity: 0.33 }
              : {}),
          }}
          onClick={(e) => {
            e.preventDefault();
            if (isEmptyStateDweet) {
              return;
            }
            setShowShareModal(true);
          }}
        >
          Share
        </a>
        {dweet.remixes.length > 0 && (
          <a
            href="#"
            style={{
              marginLeft: 16,
              ...(isEmptyStateDweet
                ? { background: 'var(--blue)', borderRadius: 4, opacity: 0.33 }
                : {}),
            }}
            onClick={(e) => {
              e.preventDefault();
              if (isEmptyStateDweet) {
                return;
              }
              setShowRemixListModal(true);
            }}
          >
            {dweet.remixes.length} remixes
          </a>
        )}
        <a
          href="#"
          style={{
            marginLeft: 16,
            ...(isEmptyStateDweet
              ? { background: 'var(--blue)', borderRadius: 4, opacity: 0.33 }
              : {}),
          }}
          onClick={(e) => {
            e.preventDefault();
            if (isEmptyStateDweet) {
              return;
            }
            iframeContainer?.requestFullscreen();
          }}
        >
          Fullscreen
        </a>
      </div>
      <div className="d-flex align-items-center mb-3">
        <UserView user={dweet.author} />
        <div style={{ flex: 1 }} />
        {dweet.remix_of && (
          <>
            <span>Remix of </span>
            <Link to={'/d/' + dweet.remix_of.id} className="no-link-color mx-2">
              <span
                style={{
                  opacity: '0.5',
                }}
              >
                d/
              </span>
              {dweet.remix_of.id}
            </Link>
            <span className="mr-2"> by </span>
            <UserViewRight user={dweet.remix_of.author} />
          </>
        )}
      </div>
      <div
        style={{
          background: context.theme.codeEditorBackgroundColor,
          marginLeft: -16,
          marginRight: -16,
          padding: 16,
          color: 'gray',
          fontFamily: 'monospace',
          ...(isEmptyStateDweet ? { color: '#0000' } : {}),
        }}
      >
        function u(t){' {'}
        {dweet.id !== -1 &&
          (isEmptyStateDweet ||
            isCodeCompressed(originalCode) ||
            hasCodeBeenFocused) && (
            <label
              style={{ float: 'right', margin: 0, cursor: 'pointer' }}
              className="d-flex align-items-center"
            >
              <span className="mr-3">Compressed</span>
              <Switch
                onColor={context.theme.primary}
                offColor={context.theme.switchOffBackgroundColor}
                height={16}
                width={40}
                checkedIcon={<span />}
                uncheckedIcon={<span />}
                checked={isCodeCompressed(code)}
                onChange={() =>
                  setCode((old) =>
                    isCodeCompressed(old)
                      ? getUncompressedCode(old)
                      : getCompressedCode()
                  )
                }
              />
            </label>
          )}
        <div
          className="d-flex flex-column"
          style={{ height: 64 + 16, marginBottom: 16, marginTop: 8 }}
        >
          {!isEmptyStateDweet && (
            <AceEditor
              showGutter={false}
              wrapEnabled={true}
              showPrintMargin={false}
              highlightActiveLine={false}
              fontSize={14}
              value={code}
              mode="javascript"
              theme="monokai"
              onFocus={() => {
                setHasCodeBeenFocused(true);
              }}
              onChange={(code) => {
                setCode(code);
                setHasDweetChanged(code !== originalCode);
              }}
              style={{
                width: '100%',
                flex: 1,
                border: 0,
                background: 'transparent',
                color: 'white',
              }}
            />
          )}
        </div>
        {'} //'}{' '}
        <span
          style={{
            color: getDweetLength(code) > 140 ? 'red' : 'inherit',
          }}
        >
          {getDweetLength(code)}/140
        </span>
        <div style={{ float: 'right' }}>
          <a
            className="no-link-styling"
            href={'https://dwitter.net/d/' + dweet.id}
          >
            {new Date(dweet.posted).toLocaleString()}
          </a>
        </div>
        <div>
          <form
            style={{ marginTop: 32 }}
            onSubmit={async (e) => {
              e.preventDefault();

              try {
                await context.requireLogin({
                  reason:
                    'You need to be logged in to post dweets. Please log in now and your remix will immediately publish.',
                  nextAction: 'post remix',
                });
                const new_dweet = await postDweet(code, remixText, dweet.id);
                setNewDweetRedirect('/d/' + new_dweet.id);
              } catch {
                console.log('Failed to post remix');
              }
            }}
          >
            {newDweetRedirect && <Redirect to={newDweetRedirect} />}
            <div
              className={remixText ? 'shadow-primary border-radius' : ''}
              style={{
                position: 'relative',
                display: hasCodeBeenFocused ? 'block' : 'none',
              }}
            >
              <input
                type="text"
                disabled={isEmptyStateDweet}
                ref={inputRef}
                style={{
                  paddingRight: 64,
                  background: 'transparent',
                  color: 'white',
                  borderColor: 'gray',
                  border: '1px solid',
                }}
                placeholder={
                  hasDweetChanged
                    ? 'Add a caption here...'
                    : 'Change the code...'
                }
                className="form-control"
                value={remixText}
                onChange={(e) => setRemixText(e.target.value)}
              />
              <div
                style={{ position: 'absolute', right: 0, top: 0, bottom: 0 }}
              >
                <button
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    ...(isEmptyStateDweet ? { color: '#0000' } : {}),
                  }}
                  className={
                    'btn ' + (hasDweetChanged ? 'btn-primary' : 'btn-secondary')
                  }
                  disabled={
                    !hasDweetChanged ||
                    isEmptyStateDweet ||
                    getDweetLength(code) > 140
                  }
                >
                  Post as Remix
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {shouldStickyFirstComment && (
        <div
          style={{
            padding: 16,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            borderBottom:
              dweet.comments.length > 1
                ? `1px solid ${context.theme.secondaryBorderColor}`
                : 'none',
          }}
        >
          <Linkify>{dweet.comments[0].text}</Linkify>
        </div>
      )}
      {shouldCollapseComments && (
        <div style={{ padding: 16, textAlign: 'center' }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShouldExpandComments(true);
            }}
          >
            Show more comments...
          </a>
        </div>
      )}
      {comments.slice(shouldStickyFirstComment ? 1 : 0).map((comment) => {
        let originalText = comment.text;
        let parts: { text: string; type: 'text' | 'code' }[] = [
          { text: '', type: 'text' },
        ];
        let isInsideBacktickPair = false;
        let j = 0;
        while (j < originalText.length) {
          const letter = originalText[j];
          if (letter === '\\' && isInsideBacktickPair) {
            if (originalText[j + 1] === '`') {
              parts[parts.length - 1].text += '`';
              j += 2;
              continue;
            }
          }
          if (letter === '`') {
            if (!isInsideBacktickPair) {
              isInsideBacktickPair = true;
              j++;
              parts.push({ text: '', type: 'code' });
              continue;
            } else {
              isInsideBacktickPair = false;
              j++;
              parts.push({ text: '', type: 'text' });
              continue;
            }
          }

          parts[parts.length - 1].text += letter;
          j++;
        }

        return (
          <div key={comment.id} style={{ marginTop: 16 }}>
            <UserView user={comment.author} />
            <div style={{ marginLeft: 32 + 16 }}>
              {parts.map((part, partKey) =>
                part.type === 'code' ? (
                  <code
                    key={partKey}
                    style={{
                      display: 'inline-flex',
                      background: 'hsl(0, 0%, 92.5%)',
                      borderRadius: 4,
                      padding: '2px 4px',
                      fontSize: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    {hljs
                      .highlight('js', part.text)
                      .emitter.rootNode.children.map(
                        (child: HLJSNode, i: number) => renderHLJSNode(child, i)
                      )}
                  </code>
                ) : (
                  <Linkify
                    key={partKey}
                    componentDecorator={(href, text, key) => (
                      <Link key={key} to={href}>
                        {text}
                      </Link>
                    )}
                  >
                    {part.text}
                  </Linkify>
                )
              )}
            </div>
          </div>
        );
      })}
      <form
        style={{ marginTop: 32 }}
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await context.requireLogin({
              reason:
                'You need to log in in order to post this comment! Log in now, and this comment will be posted: ' +
                replyText,
              nextAction: 'post comment',
            });
          } catch {
            return;
          }
          try {
            setUpdatedDweet(await addComment(dweet.id, replyText));
            setReplyText('');
            inputRef.current?.blur();
          } catch (e) {
            alert(JSON.stringify(e));
          }
        }}
      >
        <div
          className={replyText ? 'shadow-primary border-radius' : ''}
          style={{ position: 'relative' }}
        >
          <input
            type="text"
            disabled={isEmptyStateDweet}
            ref={inputRef}
            style={{ paddingRight: 64 }}
            className="form-control"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0 }}>
            <button
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                ...(isEmptyStateDweet ? { color: '#0000' } : {}),
              }}
              className={
                'btn ' +
                (replyText.length === 0 ? 'btn-secondary' : 'btn-primary')
              }
              disabled={replyText.length === 0 || isEmptyStateDweet}
            >
              Comment
            </button>
          </div>
        </div>
      </form>

      <Modal
        isOpen={showRemixListModal}
        toggle={() => setShowRemixListModal(!showRemixListModal)}
      >
        <div className="p-3">
          <div
            className="mb-3"
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <a
              href="#"
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                fontWeight: 'normal',
              }}
              onClick={(e) => {
                e.preventDefault();
                setShowRemixListModal(false);
              }}
            >
              close
            </a>
            Remixes of d/{dweet.id}
          </div>

          <DweetList dweet_ids={dweet.remixes} />
        </div>
      </Modal>

      <Modal
        isOpen={showShareModal}
        keyboard={true}
        toggle={() => setShowShareModal(!showShareModal)}
      >
        <div className="p-3">
          <div
            className="mb-3"
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <a
              href="#"
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                fontWeight: 'normal',
              }}
              onClick={(e) => {
                e.preventDefault();
                setShowShareModal(false);
              }}
            >
              close
            </a>
            Share d/{dweet.id}
          </div>
          <label>Permalink</label>
          <input
            className="form-control mb-3"
            type="text"
            readOnly={true}
            value={'https://dwitter.net/d/' + dweet.id}
          />

          <label>Iframe embed</label>
          <input
            className="form-control"
            type="text"
            readOnly={true}
            value={`<iframe width=500 height=570 frameBorder="0" src="https://www.dwitter.net/e/${dweet.id}" allowFullScreen="true"></iframe>`}
          />
        </div>
      </Modal>
    </div>
  );
};

const DweetList: React.FC<{ dweet_ids: number[] }> = ({ dweet_ids }) => {
  return (
    <>
      {dweet_ids.map((dweet_id, key) => (
        <DweetElement key={key} dweet_id={dweet_id} />
      ))}
    </>
  );
};

const DweetElement: React.FC<{ dweet_id: number }> = ({ dweet_id }) => {
  const [dweet, setDweet] = useState<Dweet | null>(null);

  useEffect(() => {
    getDweet(dweet_id).then((dweet) => {
      setDweet(dweet);
    });
  }, [dweet_id]); // Only run when dweet_id changes

  return (
    <>
      <Link to={'/d/' + dweet_id} className="no-link-color mx-2">
        <span
          style={{
            opacity: '0.5',
          }}
        >
          d/
        </span>
        {dweet_id}
      </Link>
      <span className="mr-2"> by </span>
      {dweet && <UserViewRight user={dweet.author} />}
      {!dweet && <span>...</span>}
      <br />
    </>
  );
};
