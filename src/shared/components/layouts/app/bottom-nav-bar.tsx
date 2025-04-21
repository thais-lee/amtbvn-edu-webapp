import { Link } from '@tanstack/react-router';
import { Layout } from 'antd/lib';
import { useState } from 'react';
import {
  AiOutlineHome,
  AiOutlineUser,
} from 'react-icons/ai';
import { IoBook, IoBookOutline, IoLibraryOutline, IoNotifications, IoNotificationsOutline } from 'react-icons/io5';

import useApp from '@/hooks/use-app';

const BottomNavBar = () => {
  const [current, setCurrent] = useState('home');
  const { token, t } = useApp();

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
              <span className="text">{t('BottomNavBar.Home')}</span>
            </Link>
          </li>
          <li
            className={current === 'profile' ? 'list active' : 'list'}
            onClick={() => onClick('profile')}
          >
            <Link to="/m/library">
              <span className="icon">
                <IoLibraryOutline />
              </span>
              <span className="text">{t('BottomNavBar.Library')}</span>
            </Link>
          </li>
          <li
            className={current === 'messages' ? 'list active' : 'list'}
            onClick={() => onClick('messages')}
          >
            <Link to="/m/lecture-hall">
              <span className="icon">
                <IoBookOutline />
              </span>
              <span className="text">{t('BottomNavBar.LectureHall')}</span>
            </Link>
          </li>
          <li
            className={current === 'photos' ? 'list active' : 'list'}
            onClick={() => onClick('photos')}
          >
            <Link to="/m/notifications">
              <span className="icon">
                <IoNotificationsOutline />
              </span>
              <span className="text">{t('BottomNavBar.Notification')}</span>
            </Link>
          </li>
          <li
            className={current === 'settings' ? 'list active' : 'list'}
            onClick={() => onClick('settings')}
          >
            <Link to="/m/profile">
              <span className="icon">
                <AiOutlineUser />
              </span>
              <span className="text">{t('BottomNavBar.Profile')}</span>
            </Link>
          </li>
          <div className="indicator"></div>
        </ul>
      </div>
    </Layout.Content>
  );
};

export default BottomNavBar;
