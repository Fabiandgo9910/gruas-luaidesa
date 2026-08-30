export default function CargandoPanel() {
  return (
    <div>
      <div className="skeleton h-8 w-40 rounded mb-2" />
      <div className="skeleton h-4 w-72 rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-ink-800 border border-gold/15 rounded-2xl p-6">
            <div className="skeleton h-3 w-24 rounded mb-3" />
            <div className="skeleton h-9 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
