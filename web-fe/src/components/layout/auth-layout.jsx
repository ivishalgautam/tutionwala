import { LibraryBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <section className="relative bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <div className=" flex-col items-center justify-center bg-primary p-12 text-white lg:col-span-6 lg:flex lg:h-full lg:w-full lg:p-4 xl:col-span-6">
          <div className="mx-auto max-w-md">
            <Link href={"/"} className={`text-3xl`}>
              <figure className="">
                <Image
                  width={200}
                  height={200}
                  src="/logo.png"
                  alt="Online tutoring illustration"
                  className="rounded-lg"
                />
              </figure>
            </Link>
            <h2 className="mb-4 mt-4 text-3xl font-bold">
              Connect with Knowledge Leaders
            </h2>
            <p className="mb-6 text-lg">
              Access personalized learning experiences from expert tutors or
              share your expertise with eager students on our secure platform.
            </p>
            <div className="mb-8 flex space-x-4">
              <div className="flex-1 rounded-lg bg-secondary p-4">
                <h3 className="mb-2 font-bold">1,000+</h3>
                <p className="text-sm">Expert Tutors</p>
              </div>
              <div className="flex-1 rounded-lg bg-secondary p-4">
                <h3 className="mb-2 font-bold">10,000+</h3>
                <p className="text-sm">Students</p>
              </div>
              <div className="flex-1 rounded-lg bg-secondary p-4">
                <h3 className="mb-2 font-bold">95%</h3>
                <p className="text-sm">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-6 lg:p-4 xl:col-span-6">
          <div className="mt-10 max-w-xl lg:mt-0 lg:max-w-3xl">{children}</div>
        </main>
      </div>
    </section>
  );
}
