import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  Divider,
  Empty,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';

import categoryService from '../../categories/category.service';

const { Text, Title } = Typography;

interface LibraryMaterialChildTabProps {
  parentId: number;
  activeChildTab?: number;
  setActiveChildTab: (id: number) => void;
}

// Mock categories and series for each category
const mockCategories = [
  { id: 1, name: 'Kinh điển' },
  { id: 2, name: 'Giảng giải' },
  { id: 3, name: 'Pháp thoại' },
  { id: 4, name: 'Hỏi đáp' },
  { id: 5, name: 'Khác' },
];

const mockSeriesByCategory = {
  1: {
    title: 'Thái Thượng Cảm Ứng Thiên',
    episode: 50,
    totalEpisodes: 195,
    date: '1999.5.11',
    location:
      'Hiệp hội Tịnh Tông Singapore · Hiệp hội Tịnh Tông Úc · Hồng Kông',
    views: 25614,
    likes: 5206,
    episodes: [
      {
        id: 1,
        title: 'Tập 1: Rời xa phân biệt chấp trước, vạn pháp viên dung',
      },
      { id: 2, title: 'Tập 2: "Thái Thượng" là sự hiển lộ của tự tánh' },
      { id: 3, title: 'Tập 3: Phàm Thánh chỉ ở giữa mê và ngộ' },
      {
        id: 4,
        title: 'Tập 4: Lòng người không thiện, hoàn cảnh sẽ trở nên xấu đi',
      },
    ],
  },
  2: {
    title: 'Giảng giải Kinh Vô Lượng Thọ',
    episode: 12,
    totalEpisodes: 48,
    date: '2001.3.15',
    location: 'Chùa Hoằng Pháp, TP.HCM',
    views: 10234,
    likes: 2100,
    episodes: [
      { id: 1, title: 'Tập 1: Giới thiệu Kinh Vô Lượng Thọ' },
      { id: 2, title: 'Tập 2: Ý nghĩa của Vô Lượng Thọ' },
      { id: 3, title: 'Tập 3: Pháp môn Tịnh Độ' },
      { id: 4, title: 'Tập 4: Công đức niệm Phật' },
    ],
  },
  3: {
    title: 'Pháp thoại chủ đề Hiếu',
    episode: 5,
    totalEpisodes: 20,
    date: '2020.7.10',
    location: 'Chùa Giác Ngộ',
    views: 5432,
    likes: 800,
    episodes: [
      { id: 1, title: 'Tập 1: Hiếu kính cha mẹ' },
      { id: 2, title: 'Tập 2: Hiếu thuận trong gia đình' },
      { id: 3, title: 'Tập 3: Hiếu và xã hội' },
      { id: 4, title: 'Tập 4: Hiếu và Phật pháp' },
    ],
  },
  4: {
    title: 'Hỏi đáp Phật pháp',
    episode: 3,
    totalEpisodes: 10,
    date: '2022.11.5',
    location: 'Online',
    views: 1200,
    likes: 300,
    episodes: [
      { id: 1, title: 'Tập 1: Làm sao để an lạc?' },
      { id: 2, title: 'Tập 2: Vấn đáp về nhân quả' },
      { id: 3, title: 'Tập 3: Hỏi đáp về tu tập' },
      { id: 4, title: 'Tập 4: Thực hành thiền' },
    ],
  },
  5: {
    title: 'Chuyên đề khác',
    episode: 1,
    totalEpisodes: 5,
    date: '2023.1.1',
    location: 'Hội trường lớn',
    views: 500,
    likes: 100,
    episodes: [
      { id: 1, title: 'Tập 1: Khai mạc' },
      { id: 2, title: 'Tập 2: Giao lưu' },
      { id: 3, title: 'Tập 3: Tổng kết' },
      { id: 4, title: 'Tập 4: Bế mạc' },
    ],
  },
};

export default function LibraryMaterialChildTab({
  parentId,
  activeChildTab,
  setActiveChildTab,
}: LibraryMaterialChildTabProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories', parentId],
    queryFn: () =>
      categoryService.getAllCategories({
        parentId,
      }),
  });

  // Top bar state for main categories
  const [activeTopCategory, setActiveTopCategory] = useState(
    mockCategories[0].id,
  );

  // Always call hooks before any return!
  useEffect(() => {
    if (data?.data?.items?.length) {
      setActiveChildTab(data.data.items[0].id);
    }
  }, [data?.data?.items, setActiveChildTab]);

  if (isLoading) return <Spin className="block my-6" />;
  if (isError) return <Empty description="Không thể tải danh mục con" />;
  if (!data?.data?.items?.length)
    return <Empty description="Không có danh mục con nào" />;

  const series =
    mockSeriesByCategory[
      activeTopCategory as keyof typeof mockSeriesByCategory
    ];

  return (
    <>
      <div
        className="child-category-tags-scroll"
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 8,
          padding: '8px 0',
          whiteSpace: 'nowrap',
        }}
      >
        {data.data.items.map((child) => (
          <Tag
            key={child.id}
            style={{
              cursor: 'pointer',
              fontWeight: activeChildTab === child.id ? 600 : 400,
              fontSize: 16,
              marginBottom: 0,
              userSelect: 'none',
              borderRadius: 10,
              padding: '4px 12px',
              background: activeChildTab === child.id ? '#a15318' : '#f0f0f0',
              color: activeChildTab === child.id ? '#fff' : '#222',
            }}
            onClick={() => setActiveChildTab(child.id)}
          >
            {child.name}
          </Tag>
        ))}
      </div>
      {/* Mock video series card below tags */}
      <Card style={{ marginTop: 16 }}>
        <Title level={4} style={{ marginBottom: 8 }}>
          {series.title}
        </Title>
        <Text strong>Tập {series.episode}</Text>
        <Text style={{ marginLeft: 8 }}>
          {series.episodes[0].title.slice(6)}
        </Text>
        <div style={{ margin: '8px 0' }}>
          <Text type="secondary">
            Tổng cộng{' '}
            <span
              style={{
                background: '#f5e6d6',
                borderRadius: 8,
                padding: '2px 8px',
              }}
            >
              {series.totalEpisodes}
            </span>{' '}
            tập
          </Text>
        </div>
        <Text type="secondary">Địa điểm: {series.location}</Text>
        <div style={{ margin: '8px 0' }}>
          <Space size="large">
            <Text>
              Lượt xem:
              <span style={{ fontWeight: 600 }}>
                {series.views.toLocaleString()}
              </span>
            </Text>
            <Text type="danger">
              Lượt thích: {series.likes.toLocaleString()}
            </Text>
          </Space>
        </div>
        <Divider style={{ margin: '12px 0' }} />
        <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
          {['Văn bản', 'Trang 1', 'Trang 2', 'Trang 3', 'Trang 4'].map(
            (tab, idx) => (
              <Button
                key={tab}
                type={idx === 1 ? 'primary' : 'default'}
                size="small"
                style={{ borderRadius: 8 }}
              >
                {tab}
              </Button>
            ),
          )}
        </div>
        <div>
          {series.episodes.map((ep) => (
            <div
              key={ep.id}
              style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}
            >
              <Button
                shape="circle"
                icon={<span style={{ fontWeight: 700 }}>&#9654;</span>}
                size="small"
                style={{ marginRight: 8 }}
              />
              <Text>{ep.title}</Text>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
