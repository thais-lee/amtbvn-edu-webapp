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

  return (
    <Layout.Content
      style={{
        bottom: 0,
        width: window.innerWidth,
        left: 0,
        right: 0,
        display: 'flex',
      }}
    >
      <div className="navigation">
        <ul>
          <li
            className={current === 'home' ? 'list active' : 'list'}
            onClick={() => onClick('home')}
          >
            <Link to="/m/home">
              <a>
                <span className="icon">
                  <AiOutlineHome />
                </span>
                <span className="text">Home</span>
              </a>
            </Link>
          </li>
          <li
            className={current === 'profile' ? 'list active' : 'list'}
            onClick={() => onClick('profile')}
          >
            <Link to="/profile">
              <a>
                <span className="icon">
                  <AiOutlineUser />
                </span>
                <span className="text">Profile</span>
              </a>
            </Link>
          </li>
          <li
            className={current === 'messages' ? 'list active' : 'list'}
            onClick={() => onClick('messages')}
          >
            <Link to="/">
              <a>
                <span className="icon">
                  <AiOutlineMessage />
                </span>
                <span className="text">Messages</span>
              </a>
            </Link>
          </li>
          <li
            className={current === 'photos' ? 'list active' : 'list'}
            onClick={() => onClick('photos')}
          >
            <Link to="/">
              <a>
                <span className="icon">
                  <BiBook />
                </span>
                <span className="text">Photos</span>
              </a>
            </Link>
          </li>
          <li
            className={current === 'settings' ? 'list active' : 'list'}
            onClick={() => onClick('settings')}
          >
            <Link to="/m/settings">
              <a>
                <span className="icon">
                  <AiOutlineSetting />
                </span>
                <span className="text">Settings</span>
              </a>
            </Link>
          </li>
          <div className="indicator"></div>
        </ul>
      </div>
    </Layout.Content>
  );
};

export default BottomNavBar;
