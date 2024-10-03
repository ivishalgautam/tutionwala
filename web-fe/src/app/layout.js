import { GeistSans } from "geist/font/sans";
import { Montserrat } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryClientProvider";
import { Toaster } from "sonner";
import Context from "@/store/context";
import Layout from "@/components/layout";
import Image from "next/image";
import next from "next";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata = {
  // metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL)
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className}`}
        suppressHydrationWarning={true}
      >
        {process.env.NEXT_PUBLIC_COMING_SOON == 1 ? (
          <div className="flex h-screen items-center justify-center">
            <Image
              src={"/images/coming-soon.jpeg"}
              width={500}
              height={500}
              alt="coming soon"
            />
          </div>
        ) : (
          <Context>
            <Toaster richColors />
            <QueryProvider>
              <Layout>{children}</Layout>
            </QueryProvider>
          </Context>
        )}
      </body>
    </html>
  );
}
