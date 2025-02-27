import { Navigate, createFileRoute } from '@tanstack/react-router';

import useDeviceSize from '@/hooks/use-device-size';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  const { isMobile } = useDeviceSize();

  return isMobile ? <Navigate to="/m/home" /> : <Navigate to="/d/home" />;
}
