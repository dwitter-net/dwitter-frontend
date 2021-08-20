import React, { useState } from 'react';
import './App.scss';

//@ts-ignore
import { linkify } from 'react-linkify';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Link,
  RouteComponentProps,
  useLocation,
} from 'react-router-dom';
import { Feed, FeedProps } from './Feed';
import { Login } from './Login';
import { UserView } from './UserView';
import { AppContext, Context, topBarMaxWidth, themes } from './Context';
import { About } from './About';
import { Dropdown, DropdownToggle, DropdownMenu, Modal } from 'reactstrap';
import { Create } from './Create';
import { SingleDweet } from './SingleDweet';
import { Settings } from './Settings';
import { LoginForm } from './LoginForm';
import { Helmet } from 'react-helmet';
import { Header } from './Header';

const NewFeed = (props: RouteComponentProps) => (
  <Feed name="New dweets" order_by="-posted" period="all" {...props} />
);

const RandomFeed = (props: RouteComponentProps) => (
  <Feed name="Random dweets" order_by="?" period="all" {...props} />
);

const TopFeed = (
  props: RouteComponentProps & { period: FeedProps['period'] }
) => <Feed name="Top dweets" order_by="-awesome_count" {...props} />;

const HotFeed = (props: RouteComponentProps) => (
  <Feed name="Hot dweets" order_by="-hotness" {...props} />
);

const NewHashtagFeed = (props: RouteComponentProps<{ hashtag: string }>) => (
  <Feed
    name={'New dweets for #' + props.match.params.hashtag}
    order_by="-posted"
    {...props}
  />
);

const TopHashtagFeed = (props: RouteComponentProps<{ hashtag: string }>) => (
  <Feed
    name={'Top dweets for #' + props.match.params.hashtag}
    order_by="-awesome_count"
    {...props}
  />
);

const HotHashtagFeed = (props: RouteComponentProps<{ hashtag: string }>) => (
  <Feed
    name={'Hot dweets for #' + props.match.params.hashtag}
    order_by="-hotness"
    {...props}
  />
);

const HotUserFeed = (props: RouteComponentProps<{ username: string }>) => (
  <Feed
    name={'Hot dweets for u/' + props.match.params.username}
    order_by="-hotness"
    {...props}
  />
);

const TopUserFeed = (props: RouteComponentProps<{ username: string }>) => (
  <Feed
    name={'Top dweets for u/' + props.match.params.username}
    order_by="-awesome_count"
    {...props}
  />
);

const NewUserFeed = (props: RouteComponentProps<{ username: string }>) => (
  <Feed
    name={'New dweets for u/' + props.match.params.username}
    order_by="-posted"
    {...props}
  />
);

for (const item of [
  {
    prefix: 'd/',
    regex: /[a-zA-Z0-9_]+/,
    normalize: (match: any) => (match.url = '/' + match.url),
  },
  {
    prefix: 'u/',
    regex: /[a-zA-Z0-9_]+/,
    normalize: (match: any) => (match.url = '/' + match.url),
  },
  {
    prefix: 'c/',
    regex: /[a-zA-Z0-9_]+/,
    normalize: (match: any) => (match.url = '/' + match.url),
  },
  {
    prefix: '#',
    regex: /[a-zA-Z_][a-zA-Z0-9_-]+/,
    normalize: (match: any) =>
      (match.url = '/h/' + match.url.slice(1) + '/top'),
  },
]) {
  linkify.add(item.prefix, {
    validate: (text: string, pos: number, self: any) => {
      const tail = text.slice(pos);
      if (item.regex.test(tail)) {
        const match = tail.match(item.regex);
        if (match) {
          return match[0].length;
        }
      }
      return 0;
    },
    normalize: item.normalize,
  });
}

interface LoginRequest {
  reason: string;
  nextAction: string;
  promise: Promise<any>;
  resolve: () => void;
  reject: () => void;
}

function App() {
  const [currentLoginRequest, setCurrentLoginRequest] =
    useState<LoginRequest | null>(null);

  let themeMode = localStorage.getItem('themeMode') || 'automatic';
  if (themeMode === 'automatic') {
    themeMode = window.matchMedia('(prefers-colors-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  const [context, setContext] = useState<AppContext>({
    theme: themes[themeMode],
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    requireLogin: async (options: { reason: string; nextAction: string }) => {
      if (localStorage.getItem('user')) {
        return;
      }
      if (currentLoginRequest) {
        return await currentLoginRequest.promise;
      }
      const loginPromise: Partial<LoginRequest> = { ...options };
      loginPromise.promise = new Promise((resolve, reject) => {
        loginPromise.resolve = resolve;
        loginPromise.reject = reject;
      });
      setCurrentLoginRequest(loginPromise as LoginRequest);
      try {
        await loginPromise.promise;
      } catch {
        setCurrentLoginRequest(null);
        throw new Error();
      }
      if (currentLoginRequest === loginPromise) {
        setCurrentLoginRequest(null);
      }
    },
  });

  const faviconFolder = '/favicon-' + context.theme.key + '/';

  return (
    <Context.Provider
      value={[context, (partial) => setContext({ ...context, ...partial })]}
    >
      <style>
        {`:root {${Object.entries(context.theme)
          .map(([key, value]) => '--' + key + ': ' + value)
          .join(';')}}`}
      </style>
      <Router>
        <div
          className="App"
          style={{
            background: context.theme.pageBackgroundColor,
            color: context.theme.mainTextColor,
          }}
        >
          <Helmet titleTemplate={'%s | Dwitter.net'}>
            <title>Dwitter.net - Javascript demos in 140 characters</title>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href={faviconFolder + 'apple-touch-icon.png'}
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href={faviconFolder + 'favicon-32x32.png'}
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href={faviconFolder + 'favicon-16x16.png'}
            />
          </Helmet>
          <Header />
          <Switch>
            <Route
              path="/accounts/login/"
              exact={true}
              component={Login}
            ></Route>
            <Route path="/create" exact={true} component={Create}></Route>
            {context.user && (
              <Route
                path={'/' + context.user.username + '/settings'}
                exact={true}
                component={Settings}
              />
            )}
            <Route path="/d/:id" exact={true} component={SingleDweet} />
            <Route path="/new" exact={true} component={NewFeed} />
            <Route
              path="/top/week"
              exact={true}
              component={(props: RouteComponentProps) => (
                <TopFeed period="week" {...props} />
              )}
            />
            <Route
              path="/top/month"
              exact={true}
              component={(props: RouteComponentProps) => (
                <TopFeed period="month" {...props} />
              )}
            />
            <Route
              path="/top/year"
              exact={true}
              component={(props: RouteComponentProps) => (
                <TopFeed period="year" {...props} />
              )}
            />
            <Route
              path="/top/all"
              exact={true}
              component={(props: RouteComponentProps) => (
                <TopFeed period="all" {...props} />
              )}
            />
            <Route path="/random" exact={true} component={RandomFeed} />
            <Route
              path="/h/:hashtag/top"
              exact={true}
              component={TopHashtagFeed}
            />
            <Route
              path="/h/:hashtag/hot"
              exact={true}
              component={HotHashtagFeed}
            />
            <Route path="/h/:hashtag" exact={true} component={HotHashtagFeed} />
            <Route
              path="/h/:hashtag/new"
              exact={true}
              component={NewHashtagFeed}
            />
            <Route
              path="/u/:username/top"
              exact={true}
              component={TopUserFeed}
            />
            <Route
              path="/u/:username/hot"
              exact={true}
              component={HotUserFeed}
            />
            <Route path="/u/:username" exact={true} component={HotUserFeed} />
            <Route
              path="/u/:username/new"
              exact={true}
              component={NewUserFeed}
            />
            <Route path="/about" exact={true} component={About} />

            <Route path="" exact={true} component={HotFeed} />
          </Switch>
        </div>
        <Modal
          isOpen={!!currentLoginRequest}
          keyboard={true}
          toggle={() => currentLoginRequest && currentLoginRequest.reject()}
        >
          <div className="p-3">
            <div className="d-flex justify-content-center align-items-center flex-column">
              <div className="d-flex justify-content-center align-items-stretch flex-column">
                <div
                  className="alert alert-info"
                  style={{
                    marginTop: 16,
                    marginBottom: 32,
                    maxWidth: 16 * 18,
                  }}
                >
                  {currentLoginRequest && currentLoginRequest.reason}
                </div>

                {currentLoginRequest && (
                  <LoginForm
                    nextAction={currentLoginRequest.nextAction}
                    onLogin={() => {
                      currentLoginRequest.resolve();
                      setCurrentLoginRequest(null);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </Modal>
      </Router>
    </Context.Provider>
  );
}

export default App;
