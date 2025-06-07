// shared/components/no-articles-found.tsx
import { Empty } from 'antd';

import useApp from '@/hooks/use-app';

const NoArticlesFound = () => {
  const { t } = useApp();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        width: '100vw',
        // background: '#fff',
      }}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={t('No articles found')}
        style={{
          margin: 0,
          width: '100%',
        }}
      />
    </div>
  );
};

export default NoArticlesFound;
