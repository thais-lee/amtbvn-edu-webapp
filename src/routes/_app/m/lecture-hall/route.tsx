import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/m/lecture-hall')({
  component: LectureHallLayout,
});

function LectureHallLayout() {
  return <Outlet />;
} 