import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/m/library/')({
  component: MLibraryComponent,
})

function MLibraryComponent() {
  return <div>Hello "/_app/m/library/"!</div>
}
