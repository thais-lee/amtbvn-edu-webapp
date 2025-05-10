import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { Typography } from 'antd';
import { IoArrowBack } from 'react-icons/io5';

import './screen-header.css';

const { Title } = Typography;

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  className?: string;
}

export default function ScreenHeader({
  title,
  showBackButton = false,
  className = '',
}: ScreenHeaderProps) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const handleBack = () => {
    if (canGoBack) {
      router.history.back();
    } else {
      router.navigate({ to: '/m/lecture-hall' });
    }
  };

  return (
    <div className={`screen-header ${className}`}>
      <div className="screen-header-content">
        {showBackButton && (
          <button className="back-button" onClick={handleBack}>
            <IoArrowBack />
          </button>
        )}
        <Title level={4} className="screen-title">
          {title}
        </Title>
      </div>
    </div>
  );
}
