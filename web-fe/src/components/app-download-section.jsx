import Image from "next/image";
import { Download, Smartphone } from "lucide-react";

export default function AppDownloadSection() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Download Our Apps
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Get the Tutionwala experience on your mobile device. Available for
            both learners and tutors.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {/* Learners App Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Image
                  src={"/icons/app-icon.png"}
                  alt="Tutionwala"
                  width={100}
                  height={100}
                />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                For Learners
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find the perfect tutor and enhance your learning journey
              </p>
            </div>

            <div className="space-y-4 lg:flex lg:items-center lg:justify-center lg:gap-4 lg:space-y-0">
              <a
                href="https://play.google.com/store/apps/details?id=com.tutionwala.learners&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 rounded-lg bg-gray-900 px-6 py-3 text-white transition-colors duration-200 hover:bg-gray-800"
              >
                <Image
                  src="/icons/play-store.png"
                  alt="Google Play Store"
                  width={35}
                  height={35}
                />
                <div className="text-left">
                  <div className="text-xs text-gray-300">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>

              <a
                href="https://apps.apple.com/in/app/tutionwala-for-learners/id6746632922"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 rounded-lg bg-gray-900 px-6 py-3 text-white transition-colors duration-200 hover:bg-gray-800"
              >
                <Image
                  src="/icons/app-store.png"
                  alt="Apple App Store"
                  width={35}
                  height={35}
                />
                <div className="text-left">
                  <div className="text-xs text-gray-300">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
            </div>
          </div>

          {/* Tutors App Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Image
                  src={"/icons/app-icon-tutors.png"}
                  alt="Tutionwala"
                  width={100}
                  height={100}
                />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                For Tutors
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with students and grow your tutoring business
              </p>
            </div>

            <div className="space-y-4 lg:flex lg:items-center lg:justify-center lg:gap-4 lg:space-y-0">
              <a
                href="https://play.google.com/store/apps/details?id=com.tutionwala.for_tutors&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 rounded-lg bg-gray-900 px-6 py-3 text-white transition-colors duration-200 hover:bg-gray-800"
              >
                <Image
                  src="/icons/play-store.png"
                  alt="Google Play Store"
                  width={35}
                  height={35}
                />
                <div className="text-left">
                  <div className="text-xs text-gray-300">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>

              <a
                href="https://apps.apple.com/in/app/tutionwala-for-tutors/id6746753597"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 rounded-lg bg-gray-900 px-6 py-3 text-white transition-colors duration-200 hover:bg-gray-800"
              >
                <Image
                  src="/icons/app-store.png"
                  alt="Apple App Store"
                  width={35}
                  height={35}
                />
                <div className="text-left">
                  <div className="text-xs text-gray-300">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-200">
            Available on iOS and Android • Free to download
          </p>
        </div>
      </div>
    </div>
  );
}
