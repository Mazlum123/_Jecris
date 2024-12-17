import { useState, useEffect } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const OptimizedImage = ({ src, alt, className }: ImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`image-container ${loaded ? 'loaded' : ''}`}>
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};