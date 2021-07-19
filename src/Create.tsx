import React, { useEffect, useState, useRef } from 'react';
import AceEditor from 'react-ace';
import { RouteComponentProps, NavLink } from 'react-router-dom';
import { postDweet } from './api';
import { getDweetLength } from './utils';

const defaultDweet = `c.width=1920 // clear the canvas
for(i=0;i<9;i++)
x.fillRect(400+i*100+S(t)*300,400,50,200) // draw 50x200 rects`;

export const Create: React.FC<RouteComponentProps> = (props) => {
  const [code, setCode] = useState(defaultDweet);
  const [comment, setComment] = useState('');
  return (
    <div className="container-fluid">
      <div className="row mt-3">
        <div className="col">
          <div className="card p-3">
            <div
              style={{
                padding: '0 0 56.25% 0',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <iframe
                  style={{ border: 0, width: '100%', height: '100%' }}
                  src={
                    process.env.REACT_APP_API_EMBED_BASE_URL +
                    'blank?autoplay=true&code=' +
                    encodeURIComponent(code)
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card p-3" style={{ background: '#272822' }}>
            <div
              style={{
                padding: '0 0 56.25% 0',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <AceEditor
                  value={code}
                  onChange={setCode}
                  mode="javascript"
                  theme="monokai"
                  style={{ width: '100%', height: '100%' }}
                  showPrintMargin={false}
                  focus={true}
                  enableSnippets={true}
                  tabSize={2}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div
          className="col"
          style={{ justifyContent: 'flex-end', display: 'flex' }}
        >
          <div className="card p-3" style={{ maxWidth: 400 }}>
            <form
              style={{ display: 'flex', alignItems: 'flex-end' }}
              onSubmit={async (e) => {
                e.preventDefault();
                const dweet = await postDweet(code, comment);
                props.history.push('/d/' + dweet.id);
              }}
            >
              {localStorage.getItem('user') ? (
                <>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="title">Title</label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      className="form-control"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary shadow-primary"
                    style={{ flexShrink: 0, marginLeft: 16 }}
                    disabled={getDweetLength(code) > 140}
                  >
                    Post dweet
                  </button>
                </>
              ) : (
                <p>
                  Please <NavLink to="/accounts/login">log in</NavLink> (or{' '}
                  <NavLink to="/accounts/register">register</NavLink>) to post a
                  dweet.
                  <br />
                  Copy-paste the code somewhere safe to save it meanwhile.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
