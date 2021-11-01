import { Link } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { Context } from './Context';
import { login, getLoggedInUser } from './api';

interface Props {
  onLogin: () => void;
  nextAction?: string;
}

export const LoginForm = (props: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setContext] = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    username?: string[];
    password?: string[];
    non_field_errors: string[];
  } | null>(null);

  return (
    <form
      noValidate={true}
      className={
        isLoading || (error && !error.non_field_errors?.length)
          ? 'was-validated'
          : 'needs-validation'
      }
      style={{
        maxWidth: 16 * 18,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
          const data = await login(username, password);
          localStorage.setItem('token', data.token);
          const user = await getLoggedInUser();
          setContext({ user });
          localStorage.setItem('user', JSON.stringify(user));
          setUsername('');
          setPassword('');
          props.onLogin();
        } catch (e) {
          setError(e);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <label htmlFor="username">Username</label>
      <input
        autoFocus
        id="username"
        name="username"
        type="text"
        className="form-control mb-3"
        value={username}
        disabled={isLoading}
        required={true}
        onChange={(e) => setUsername(e.target.value)}
      />
      {error && (
        <div
          className="invalid-feedback"
          style={{ marginTop: -8, marginBottom: 8 }}
        >
          {error.username}
        </div>
      )}
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        className="form-control mb-3"
        value={password}
        disabled={isLoading}
        required={true}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <div
          className="invalid-feedback"
          style={{ marginTop: -8, marginBottom: 8 }}
        >
          {error.password}
        </div>
      )}

      {error && error.non_field_errors && (
        <div className="alert alert-danger">{error.non_field_errors}</div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link className="mb-3 mt-3 mr-3" to="/accounts/register">
          Register
        </Link>
        <button
          className="btn btn-primary mb-3 mt-3 shadow-primary"
          disabled={isLoading}
        >
          Log in
          {props.nextAction && ' and ' + props.nextAction}
        </button>
      </div>
    </form>
  );
};
