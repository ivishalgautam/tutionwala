export default function Title({ text }) {
  return (
    <div className="flex items-center gap-x-2">
      <div className="h-6 w-[2px] bg-primary"></div>
      <h2 className="font-mulish text-lg font-semibold uppercase">{text}</h2>
    </div>
  );
}
