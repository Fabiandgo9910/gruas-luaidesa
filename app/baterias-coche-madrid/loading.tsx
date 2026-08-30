export default function CargandoTienda() {
  return (
    <main>
      <section className="pt-32 pb-16 bg-sand-100">
        <div className="max-w-container mx-auto px-5">
          <div className="h-3 w-32 rounded bg-ink-900/10 mb-4" />
          <div className="h-12 w-3/4 sm:w-2/3 rounded-xl bg-ink-900/10 mb-4" />
          <div className="h-4 w-full max-w-xl rounded bg-ink-900/10" />
        </div>
      </section>
      <section className="py-14 sm:py-16 bg-ink-900 min-h-[50vh]">
        <div className="max-w-container mx-auto px-5">
          <div className="flex flex-wrap gap-3 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-11 w-32 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-sand-100/10">
                <div className="skeleton aspect-square" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-3 w-16 rounded" />
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-11 w-full rounded-xl mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
