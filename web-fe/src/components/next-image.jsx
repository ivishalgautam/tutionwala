import { FileImage } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_IMAGE_DOMAIN;
export default function NextImage({ width, height, alt, src, className }) {
  const [isImageError, setIsImageError] = useState(false);
  return (
    <Image
      src={isImageError ? "/images/not-found.jpg" : `${baseUrl}/${src}`}
      width={width}
      height={height}
      alt={alt}
      className={className}
      onError={() => setIsImageError(true)}
    />
  );
}
