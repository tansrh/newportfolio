import Image from 'next/image';
import React from 'react';

interface CommonImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function CommonImage({ src, alt, width = '100%', height = '40%', className, style }: CommonImageProps) {
  // For next/image, width and height must be numbers (pixels), but we allow string for flexibility
  // If string, use style prop for width/height; if number, pass to next/image
  const isPx = typeof width === 'number' && typeof height === 'number';
  if (isPx) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width as number}
        height={height as number}
        className={className}
        style={style}
      />
    );
  }
  return (
    <div style={{ width, height, position: 'relative', ...style }} className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}
