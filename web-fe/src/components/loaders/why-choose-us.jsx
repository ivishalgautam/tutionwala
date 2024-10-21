export default function WhyChooseUsLoader() {
  return (
    <div className="relative h-[600px] animate-pulse">
      <div className="grid h-full bg-white/50 py-10 backdrop-blur-[200px] md:grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center gap-10 p-8 lg:relative">
          <div className="h-full w-full rounded-lg bg-gray-200"></div>
        </div>
        <div className="space-y-16 p-8">
          <div className="space-y-4">
            <div className="h-5 w-1/4 rounded bg-gray-200"></div>
            <div className="h-10 w-1/2 rounded bg-gray-200"></div>
            <div className="h-5 w-3/4 rounded bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, key) => (
              <div key={key} className="h-16 rounded bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
