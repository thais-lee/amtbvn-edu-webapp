import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Card, List, Space, Tag, Typography } from 'antd';

import useApp from '@/hooks/use-app';

import { TActivity } from '../activity.model';

const { Text } = Typography;

interface IActivityListProps {
  activities: TActivity[];
  routePrefix: string;
}

function ActivityList({ activities, routePrefix }: IActivityListProps) {
  const { t } = useApp();
  const navigate = useNavigate();

  const renderActivity = (activity: TActivity) => {
    return (
      <Card
        size="small"
        style={{ marginBottom: 8 }}
        onClick={() => {
          navigate({
            to: `/${routePrefix}/lecture-hall/course/activity/$activityId`,
            params: { activityId: activity.id.toString() },
          });
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>{activity.title}</Text>
          <Space>
            <Tag color="blue">{activity.type}</Tag>
            {activity.dueDate && (
              <Tag color="orange">
                Hạn: {new Date(activity.dueDate).toLocaleDateString()}
              </Tag>
            )}
          </Space>
        </Space>
      </Card>
    );
  };

  return (
    <List
      dataSource={activities}
      renderItem={renderActivity}
      size="small"
      style={{ marginBottom: 8 }}
    />
  );
}

export default ActivityList;
