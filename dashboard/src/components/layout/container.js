export default function Container({ children }) {
  return (
    <div className="border-input container mx-auto rounded-xl bg-white p-8 shadow">
      {children}
    </div>
  );
}
