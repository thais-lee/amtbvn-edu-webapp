import { createFileRoute } from '@tanstack/react-router';

import BottomNavBar from '@/shared/components/layouts/app/bottom-nav-bar';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      Hello from About!
      <BottomNavBar />
    </div>
  );
}
