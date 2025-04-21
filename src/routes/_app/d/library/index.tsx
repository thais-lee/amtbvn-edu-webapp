import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/d/library/')({
  component: DLibraryComponent,
});

function DLibraryComponent() {
  return (
    <div>
      <h1>Desktop Library</h1>
      <p>Welcome to the library! This is where you can access all your books.</p>
    </div>
  );
}
