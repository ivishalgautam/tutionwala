import { Link } from "lucide-react";
import { Lobster } from "next/font/google";
const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });

export default function Logo() {
  return (
    <Link href={"/"} className={`${lobster.className} text-3xl`}>
      TutionWala
    </Link>
  );
}
