export default function FeedLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-void-border bg-void-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-void-surface animate-pulse" />
              <div className="space-y-1.5 flex-1">
                <div className="w-28 h-3 bg-void-surface rounded animate-pulse" />
                <div className="w-20 h-2 bg-void-surface rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-void-surface rounded animate-pulse" />
              <div className="w-4/5 h-3 bg-void-surface rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
