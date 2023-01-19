import React, { useContext, useState } from 'react';
import { Button, Callout, Card } from '@blueprintjs/core';
import { UserContext } from '../Context/UserContext';
import { cleanLocalStorage, getRefreshToken } from '../Services/authService';

const Welcome = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [error, setError] = useState('');

  const logoutHandler = () => {
    const refreshToken = getRefreshToken();
    fetch(process.env.REACT_APP_API_ENDPOINT + 'api/refreshToken', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).then(async (response) => {
      if (response.ok) {
        setError('');
        cleanLocalStorage();
        setUserContext((oldValues) => {
          return {
            ...oldValues,
            token: null,
            user: null,
          };
        });
      } else {
        setError('Error signing out');
      }
    });
  };

  return userContext.user === null ? (
    <p>'Error Loading User details'</p>
  ) : (
    <>
      {error && <Callout intent='danger'>{error}</Callout>}
      <Card elevation='1'>
        <div className='user-details'>
          <div>
            <p>
              Welcome&nbsp;
              <strong>{userContext?.user?.userName}</strong>!
            </p>
            <p>
              Your email <strong>{userContext?.user?.email}</strong>
            </p>
          </div>
          <div className='user-actions'>
            <Button text='Logout' onClick={logoutHandler} minimal />{' '}
          </div>
        </div>
      </Card>
    </>
  );
};

export default Welcome;
