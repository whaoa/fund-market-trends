import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: App });

function App() {
  return (
    <main className="p-5">
      <h1 className="font-bold text-2xl text-center">
        Hello World
      </h1>
    </main>
  );
}
