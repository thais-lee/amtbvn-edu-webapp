import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Empty, List } from 'antd';
import dayjs from 'dayjs';

import articleService from '@/modules/app/articles/article.service';

import ArticleItem from '../components/articleItem';

interface CommonTabProps {
  title: string;
  categoryId?: string;
}

const CommonTab = ({ categoryId }: CommonTabProps) => {
  const navigate = useNavigate();

  const { data: articles } = useQuery({
    queryKey: ['articles', categoryId],
    queryFn: () =>
      articleService.getArticles({ categoryId: parseInt(categoryId || '0') }),
  });

  return (
    <div>
      <div
        style={{
          marginTop: 16,
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 10,
        }}
      >
        <List
          itemLayout="vertical"
          size="default"
          dataSource={articles?.data.items || []}
          renderItem={(item) => (
            <List.Item>
              <ArticleItem
                title={item.title}
                date={dayjs(item.createdAt).format('DD/MM/YYYY')}
                category={item.categoryId.toString()}
                image={item.thumbnailUrl || ''}
                onClick={() => {
                  navigate({
                    to: '/m/home/articles/$categoryId/$articleId',
                    params: {
                      categoryId: categoryId || '',
                      articleId: item.id.toString(),
                    },
                  });
                }}
              />
            </List.Item>
          )}
          locale={{
            emptyText: (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%',
                }}
              >
                <Empty
                  description="Không có bài viết"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: '100%',
                    margin: 0,
                  }}
                />
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default CommonTab;
