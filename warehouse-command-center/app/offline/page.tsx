export const metadata = { title: 'Offline' };

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-steel-50 p-6 text-center">
      <div className="card max-w-md p-8">
        <h1 className="text-xl font-bold text-steel-900">You are offline</h1>
        <p className="mt-2 text-sm text-steel-500">
          Cached screens remain available. Receiving inspections and material requests you save now are queued on
          this device and will sync automatically — without duplicating quantities — when you reconnect.
        </p>
      </div>
    </main>
  );
}
