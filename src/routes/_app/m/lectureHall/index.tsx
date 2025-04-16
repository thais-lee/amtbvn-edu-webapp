import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/m/lectureHall/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/m/lectureHall/"!</div>
}
