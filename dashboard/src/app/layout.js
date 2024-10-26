import { GeistSans } from "geist/font/sans";
import { Space_Grotesk } from "next/font/google";
import { Poppins } from "next/font/google";

import "./globals.css";
import Layout from "@/components/layout";

export const metadata = {
  title: {
    template: "%s | Tutionwala Dashboard",
    default: "Tutionwala Dashboard",
  },
};

const SpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-gray-200`}
        suppressHydrationWarning={true}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
