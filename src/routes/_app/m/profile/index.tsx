import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/m/profile/')({
  component: MProfileComponent,
})

function MProfileComponent() {
  return <div>Hello "/_app/m/profile/"!</div>
}
