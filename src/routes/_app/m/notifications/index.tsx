import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/m/notifications/')({
  component: MNotificationsComponent,
})

function MNotificationsComponent() {
  return <div>Hello "/_app/m/notifications/"!</div>
}
