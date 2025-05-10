import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/d/notifications/')({
  component: NotificationsComponent,
});

function NotificationsComponent() {
  return (
    <div>
      <h1>Desktop Notifications</h1>
      <p>
        Welcome to the notifications! This is where you can access all your
        notifications.
      </p>
    </div>
  );
}
