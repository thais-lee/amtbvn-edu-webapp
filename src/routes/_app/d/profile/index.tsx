import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/d/profile/')({
  component: DProfileComponent,
});

function DProfileComponent() {
  return (
    <div>
      <h1>Desktop Profile</h1>
      <p>
        Welcome to the profile! This is where you can access all your profile
        information.
      </p>
    </div>
  );
}
