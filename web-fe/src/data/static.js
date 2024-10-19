import config from "@/config";
import { FacebookLogo, InstagramLogo, LinkedinLogo } from "phosphor-react";

let iconSize = 25;

export const socialLinks = [
  {
    icon: <LinkedinLogo size={iconSize} />,
    href: config.linkedin_url,
  },
  {
    icon: <InstagramLogo size={iconSize} />,
    href: config.instagram_url,
  },
  {
    icon: <FacebookLogo size={iconSize} />,
    href: config.facebook_url,
  },
];
