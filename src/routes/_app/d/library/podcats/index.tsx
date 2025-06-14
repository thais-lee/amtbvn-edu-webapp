import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/d/library/podcats/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/d/library/podcats/"!</div>;
}
