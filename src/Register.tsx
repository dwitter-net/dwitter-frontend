import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { pageMaxWidth } from './Context';
import { RegisterForm } from './RegisterForm';

export const Register: React.FC<RouteComponentProps> = (props) => {
  if (localStorage.getItem('user')) {
    return <Redirect to={'/'} />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div style={{ maxWidth: pageMaxWidth, flex: 1, padding: 16 }}>
        <div
          style={{
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'row',
          }}
          className="card p-3"
        >
          <RegisterForm
            onLogin={() => {
              props.history.push('/');
            }}
          />
        </div>
      </div>
    </div>
  );
};
