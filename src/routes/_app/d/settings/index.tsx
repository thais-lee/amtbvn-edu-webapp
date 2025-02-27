import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/d/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/d/settings/"!</div>
}
