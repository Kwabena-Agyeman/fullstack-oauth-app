import { useCallback, useContext, useEffect, useState } from 'react';
import { Card, Tab, Tabs } from '@blueprintjs/core';
import { UserContext } from './Context/UserContext';
import IdleTimer from 'react-idle-timer';
import Loader from './Components/Loader';
import Login from './Components/Login';
import Register from './Components/Register';
import Welcome from './Components/Welcome';
import {
  getAccessToken,
  getRefreshToken,
  parseToken,
  saveAcessToken,
  saveRefreshToken,
} from './Services/authService';

function App() {
  const [currentTab, setCurrentTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);

  const verifyUser = () => {
    setLoading(true);
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      fetch(process.env.REACT_APP_API_ENDPOINT + 'api/refreshToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          const info = parseToken(data.accessToken);
          saveAcessToken(data.accessToken);
          setUserContext((oldValues) => {
            return {
              ...oldValues,
              token: data.accessToken,
              user: { userName: info.userName, email: info.email },
            };
          });
          setLoading(false);
        } else {
          setUserContext((oldValues) => {
            return { ...oldValues, token: null, user: null };
          });
          setLoading(false);
        }
      });
    }

    if (!refreshToken) {
      setUserContext((oldValues) => {
        return { ...oldValues, token: null, user: null };
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return userContext.token === null ? (
    <Card elevation='1'>
      <Tabs id='Tabs' onChange={setCurrentTab} selectedTabId={currentTab}>
        <Tab id='login' title='Login' panel={<Login />} />
        <Tab id='register' title='Register' panel={<Register />} />
        <Tabs.Expander />
      </Tabs>
    </Card>
  ) : (
    //The Idle-Timer calls the verifyUser every 5 minutes to renew the authentication token.
    <>
      <IdleTimer
        element={document}
        onIdle={verifyUser}
        debounce={250}
        timeout={300000} //Call verifyUser evey 5 min ( 300000 milliseconds)
      />
      <Welcome />
    </>
  );
}

export default App;
