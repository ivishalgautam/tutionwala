import { LibraryBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <section className="relative bg-white">
      <div className="absolute left-4 top-4 z-10">
        <Link href={"/"} className={`text-3xl`}>
          <figure className="aspect-video w-24">
            <Image
              src={"/images/logo.png"}
              width={200}
              height={200}
              alt="logo"
              className="rounded-lg"
            />
          </figure>
        </Link>
      </div>

      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gradient-to-tr from-gradient-from to-gradient-to lg:col-span-7 lg:h-full lg:p-4 xl:col-span-8">
          <figure className="absolute inset-0 h-full w-full object-contain object-center mix-blend-normal lg:p-20">
            <Image
              src={"/images/educator.svg"}
              width={300}
              height={300}
              quality={100}
              alt="Educator"
              className="h-full w-full"
            />
          </figure>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-5 lg:p-6 xl:col-span-4">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <Link
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="#"
              >
                <span className="sr-only">Home</span>
                <LibraryBig size={40} className="text-primary" />
              </Link>
            </div>

            <div className="mt-10 lg:mt-0">{children}</div>
          </div>
        </main>
      </div>
    </section>
  );
}
