import { Flex, Menu, MenuProps, Space, Typography } from 'antd';
import { Layout } from 'antd/lib';
import { useState } from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { BiBook } from 'react-icons/bi';
import { SiYoutubemusic } from 'react-icons/si';

import useApp from '@/hooks/use-app';

type TabbarProps = Required<MenuProps>['items'][number];
const items: TabbarProps[] = [
  {
    label: (
      <div>
        <Flex
          align="center"
          vertical
          gap={8}
          style={{ backgroundColor: 'green' }}
        >
          <AiOutlineHome size={20} />
          <Typography.Text>Home</Typography.Text>
        </Flex>
      </div>
    ),
    key: 'home',
  },

  {
    label: (
      <div>
        <Flex
          align="center"
          vertical
          gap={8}
          style={{ backgroundColor: 'green' }}
        >
          <BiBook size={20} />
          <Typography.Text>School</Typography.Text>
        </Flex>
      </div>
    ),
    key: 'school',
  },

  {
    label: (
      <div>
        <Flex
          align="center"
          vertical
          gap={8}
          style={{ backgroundColor: 'green' }}
        >
          <SiYoutubemusic size={20} />
          <Typography.Text>Music</Typography.Text>
        </Flex>
      </div>
    ),
    key: 'music',
  },
];

const BottomNavBar = () => {
  const [current, setCurrent] = useState('home');
  const { token } = useApp();
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      style={{
        borderBottom: 'none',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        // backgroundColor: 'blueviolet',
        justifyContent: 'space-evenly',
        flex: 1,
      }}
    >
      <Flex align="center" vertical gap={8}>
        <Menu.Item key="home">
          <Flex
            align="center"
            vertical
            gap={8}
            // style={{ backgroundColor: 'green' }}
          >
            <AiOutlineHome size={20} />
            <Typography.Text>Home</Typography.Text>
          </Flex>
        </Menu.Item>
        <Menu.Item key="school">
          <Flex
            align="center"
            vertical
            gap={8}
            // style={{ backgroundColor: 'green' }}
          >
            <BiBook size={20} />
            <Typography.Text>School</Typography.Text>
          </Flex>
        </Menu.Item>
        <Menu.Item key="music">
          <Flex
            align="center"
            vertical
            gap={8}
            // style={{ backgroundColor: 'green' }}
          >
            <SiYoutubemusic size={20} />
            <Typography.Text>Music</Typography.Text>
          </Flex>
        </Menu.Item>
      </Flex>
    </Menu>
  );
};

export default BottomNavBar;
