import Image from "next/image";
import Link from "next/link";

const Unauthorized = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="rounded-m flex flex-col items-center space-y-6 rounded-2xl bg-white p-8 shadow-md">
        {/* <Image width={100} height={100} src={"/images/logo.webp"} alt="logo" /> */}
        <h1 className="text-4xl font-bold">Unauthorized Access</h1>
        <p className="text-lg text-gray-700">
          Sorry, you are not authorized to access this page.
        </p>
        <div className="space-x-2">
          <Link
            href="/"
            className="rounded-full bg-primary px-6 py-2 text-white"
          >
            GO BACK HOME
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-primary px-6 py-2 text-white"
          >
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
