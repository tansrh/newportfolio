import React, { useState } from 'react';

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    className?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className }) => {
    const [currentSrc, setCurrentSrc] = useState(src);

    const handleError = () => {
        setCurrentSrc('/images/fallback.jpeg'); // Default fallback image path
    };

    return <img src={currentSrc} alt={alt} className={className} onError={handleError} />;
};

export default ImageWithFallback;