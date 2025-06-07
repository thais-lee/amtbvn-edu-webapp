import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/m/home/articles/$categoryId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/m/home/articles/$categoryId/"!</div>;
}
