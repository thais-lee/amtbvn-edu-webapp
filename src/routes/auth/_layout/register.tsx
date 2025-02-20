import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/_layout/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/_layout/register"!</div>
}
