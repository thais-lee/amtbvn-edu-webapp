import { Link } from '@tanstack/react-router';
import { Layout } from 'antd/lib';
import { useState } from 'react';
import {
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlineSetting,
  AiOutlineUser,
} from 'react-icons/ai';
import { BiBook } from 'react-icons/bi';

import useApp from '@/hooks/use-app';

const BottomNavBar = () => {
  const [current, setCurrent] = useState('home');
  const { token } = useApp();

  const onClick = (e: string) => {
    setCurrent(e);
  };

  // if (!isMobile) return null;

  return (
    <Layout.Content
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        left: 0,
        right: 0,
        display: 'flex',
        zIndex: 1000,
        backgroundColor: '#fff',
        borderTop: '1px solid #f0f0f0',
      }}
    >
      <div className="navigation">
        <ul>
          <li
            className={current === 'home' ? 'list active' : 'list'}
            onClick={() => onClick('home')}
          >
            <Link to="/m/home">
              <span className="icon">
                <AiOutlineHome />
              </span>
              <span className="text">Home</span>
            </Link>
          </li>
          <li
            className={current === 'profile' ? 'list active' : 'list'}
            onClick={() => onClick('profile')}
          >
            <Link to="/profile">
              <span className="icon">
                <AiOutlineUser />
              </span>
              <span className="text">Profile</span>
            </Link>
          </li>
          <li
            className={current === 'messages' ? 'list active' : 'list'}
            onClick={() => onClick('messages')}
          >
            <Link to="/">
              <span className="icon">
                <AiOutlineMessage />
              </span>
              <span className="text">Messages</span>
            </Link>
          </li>
          <li
            className={current === 'photos' ? 'list active' : 'list'}
            onClick={() => onClick('photos')}
          >
            <Link to="/">
              <span className="icon">
                <BiBook />
              </span>
              <span className="text">Photos</span>
            </Link>
          </li>
          <li
            className={current === 'settings' ? 'list active' : 'list'}
            onClick={() => onClick('settings')}
          >
            <Link to="/m/settings">
              <span className="icon">
                <AiOutlineSetting />
              </span>
              <span className="text">Settings</span>
            </Link>
          </li>
          <div className="indicator"></div>
        </ul>
      </div>
    </Layout.Content>
  );
};

export default BottomNavBar;
