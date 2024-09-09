import { GeistSans } from "geist/font/sans";
import "./globals.css";
import QueryProvider from "@/components/QueryClientProvider";
import { Toaster } from "sonner";
import Context from "@/store/context";
import Layout from "@/components/layout";
import Image from "next/image";

export const metadata = {
  // metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${GeistSans.className}`}
        suppressHydrationWarning={true}
      >
        {process.env.NEXT_PUBLIC_COMING_SOON ? (
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
