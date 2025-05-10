import { Link, useLocation } from '@tanstack/react-router';
import { Layout } from 'antd/lib';
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import {
  IoBookOutline,
  IoLibraryOutline,
  IoNotificationsOutline,
} from 'react-icons/io5';

import useApp from '@/hooks/use-app';

type TabTranslationKey =
  | 'BottomNavBar.Home'
  | 'BottomNavBar.Library'
  | 'BottomNavBar.LectureHall'
  | 'BottomNavBar.Notification'
  | 'BottomNavBar.Profile';

interface Tab {
  id: string;
  icon: React.ComponentType;
  path: string;
  translationKey: TabTranslationKey;
}

const tabs: Tab[] = [
  {
    id: 'home',
    icon: AiOutlineHome,
    path: '/m/home',
    translationKey: 'BottomNavBar.Home',
  },
  {
    id: 'library',
    icon: IoLibraryOutline,
    path: '/m/library',
    translationKey: 'BottomNavBar.Library',
  },
  {
    id: 'lecture',
    icon: IoBookOutline,
    path: '/m/lecture-hall',
    translationKey: 'BottomNavBar.LectureHall',
  },
  {
    id: 'notifications',
    icon: IoNotificationsOutline,
    path: '/m/notifications',
    translationKey: 'BottomNavBar.Notification',
  },
  {
    id: 'profile',
    icon: AiOutlineUser,
    path: '/m/profile',
    translationKey: 'BottomNavBar.Profile',
  },
];

const BottomNavBar = () => {
  const { t } = useApp();
  const location = useLocation();
  const currentPath = location.pathname;

  const getActiveTab = (path: string) => {
    return tabs.find((tab) => path.startsWith(tab.path))?.id || 'home';
  };

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
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = getActiveTab(currentPath) === tab.id;

            return (
              <li key={tab.id} className={isActive ? 'list active' : 'list'}>
                <Link to={tab.path}>
                  <span className="icon">
                    <Icon />
                  </span>
                  <span className="text">{t(tab.translationKey)}</span>
                </Link>
              </li>
            );
          })}
          <div className="indicator"></div>
        </ul>
      </div>
    </Layout.Content>
  );
};

export default BottomNavBar;
