import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_app/m/home/articles/$categoryId/$articleId',
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/m/home/articles/$categoryId/$articleId"!</div>;
}
