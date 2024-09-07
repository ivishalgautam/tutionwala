import { dotWave } from "ldrs";

dotWave.register();

// Default values shown
export default function Loader() {
  return (
    <div className="flex w-full items-center justify-center p-10">
      <l-dot-wave size="47" speed="1" color="black"></l-dot-wave>
    </div>
  );
}
