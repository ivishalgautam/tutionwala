export default function TutorsPageLoader() {
  return (
    <div className="bg-gray-100">
      <div className="container animate-pulse space-y-4 py-8">
        <div className="relative h-80 overflow-hidden rounded-lg bg-gray-200"></div>
        <div className="block h-10 w-full rounded bg-gray-200 lg:hidden"></div>
        <div className="h-10 w-1/4 rounded bg-gray-200 text-2xl"></div>
        <div className="items-center justify-start gap-2 space-y-2 divide-y rounded-lg md:flex md:space-y-0 md:divide-x md:divide-y-0 md:py-2">
          <div className="flex h-12 flex-1 items-center justify-start rounded bg-gray-200"></div>
          <div className="flex h-12 flex-1 items-center justify-start gap-1.5 rounded bg-gray-200 pt-2 md:pl-4 md:pt-0"></div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="hidden w-full space-y-2 lg:col-span-4 lg:block">
            {Array.from({ length: 6 }).map((_, key) => (
              <div key={key} className="h-12 w-full rounded bg-gray-200"></div>
            ))}
          </div>
          <div className="col-span-12 h-full rounded-md bg-gray-200 md:col-span-12 lg:col-span-8"></div>
        </div>
      </div>
    </div>
  );
}
