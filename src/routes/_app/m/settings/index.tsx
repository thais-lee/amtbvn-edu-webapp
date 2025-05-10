import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/m/settings/')({
  component: MSettingsComponent,
});

function MSettingsComponent() {
  return <div>Hello "/_app/settings/"!</div>;
}
