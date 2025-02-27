import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';

export const Route = createFileRoute('/_app/d/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/_app/d/home/"!
      <Button type="primary">Primary</Button>
    </div>
  );
}
