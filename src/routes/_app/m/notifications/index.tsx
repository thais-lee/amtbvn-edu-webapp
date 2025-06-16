import { BellOutlined, DeleteOutlined, LeftOutlined } from '@ant-design/icons';
import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { Badge, Button, Typography, message } from 'antd';
import React, { useState } from 'react';

const initialNotifications = [
  {
    id: 1,
    title: 'Thông báo mới',
    message: 'Bạn có một thông báo mới, vui lòng kiểm tra.',
    time: '10:30',
    unread: true,
  },
  {
    id: 2,
    title: 'Lời nhắc',
    message: 'Hôm nay 7 giờ có buổi hội thảo trực tuyến, vui lòng tham gia.',
    time: '09:15',
    unread: false,
  },
  {
    id: 3,
    title: 'Thông báo cập nhật',
    message:
      'Ứng dụng đã được cập nhật đến phiên bản mới nhất, trải nghiệm tốt hơn.',
    time: 'Hôm qua',
    unread: true,
  },
];

export const Route = createFileRoute('/_app/m/notifications/')({
  component: MNotificationsComponent,
});

function MNotificationsComponent() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [swipeId, setSwipeId] = useState<number | null>(null);

  const handleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    message.success('Đã xóa thông báo');
  };

  const handleTouchStart = (_: React.TouchEvent, id: number) => {
    setSwipeId(id);
  };
  const handleTouchEnd = (_: React.TouchEvent, __: number) => {
    setTimeout(() => setSwipeId(null), 500);
  };

  return (
    <div
      style={{
        background: '#f8f5ef',
        minHeight: '100vh',
        paddingBottom: 16,
        width: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'relative',
          background: '#f8f5ef',
          padding: '16px 0',
          marginBottom: 16,
        }}
      >
        <Button
          type="text"
          icon={<LeftOutlined style={{ fontSize: 22 }} />}
          onClick={() => navigate({ to: '/m/home' })}
          style={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#222',
            zIndex: 1,
          }}
        />
        <div
          style={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 2,
            color: '#222',
          }}
        >
          Thông báo
        </div>
      </div>
      {/* Notification Cards */}
      <div style={{ padding: '0 8px' }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              borderRadius: 12,
              marginBottom: 16,
              boxShadow: '0 2px 8px #0001',
              padding: 12,
              minHeight: 70,
              borderLeft: n.unread
                ? '4px solid #b89a5a'
                : '4px solid transparent',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background 0.2s',
              opacity: swipeId === n.id ? 0.7 : 1,
            }}
            onClick={() => handleRead(n.id)}
            onTouchStart={(e) => handleTouchStart(e, n.id)}
            onTouchEnd={(e) => handleTouchEnd(e, n.id)}
          >
            <Badge dot={n.unread} offset={[-2, 2]}>
              <BellOutlined
                style={{ fontSize: 28, color: '#b89a5a', marginRight: 16 }}
              />
            </Badge>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography.Title
                level={5}
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: n.unread ? '#b89a5a' : '#222',
                  fontSize: 16,
                  lineHeight: 1.2,
                }}
              >
                {n.title}
              </Typography.Title>
              <Typography.Paragraph
                style={{
                  margin: 0,
                  color: '#888',
                  fontSize: 14,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {n.message}
              </Typography.Paragraph>
            </div>
            <div
              style={{
                color: '#b89a5a',
                fontSize: 12,
                marginLeft: 12,
                minWidth: 40,
                textAlign: 'right',
              }}
            >
              {n.time}
            </div>
            {/* Swipe to delete button (appears on swipe) */}
            {swipeId === n.id && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(n.id);
                }}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  boxShadow: '0 2px 8px #0002',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
