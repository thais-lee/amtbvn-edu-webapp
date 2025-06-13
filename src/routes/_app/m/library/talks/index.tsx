import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/m/library/talks/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/m/library/talks/"!</div>;
}
