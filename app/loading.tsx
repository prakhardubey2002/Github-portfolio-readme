export default function Loading() {
  return (
    <div className="dashboard-bg flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-lime-400" />
        <p className="text-white/70">Loading npm stats…</p>
      </div>
    </div>
  );
}
