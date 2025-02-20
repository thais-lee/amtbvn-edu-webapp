import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/d/projects/$projectId/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/d/projects/$projectId/_layout"!</div>
}
