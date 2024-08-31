import React from 'react';
import Image from 'next/image';

const logos = [
    { src: 'https://clous.s3.eu-west-3.amazonaws.com/icons/AccentureLogo.webp', alt: 'Company 1 helped Clous' },
    { src: 'https://clous.s3.eu-west-3.amazonaws.com/icons/Bigbuylogo.webp', alt: 'Company 2 helped Clous' },
    { src: 'https://clous.s3.eu-west-3.amazonaws.com/icons/Acerl8Logo.webp', alt: 'Company 3 helped Clous' },
    { src: 'https://clous.s3.eu-west-3.amazonaws.com/icons/CapchaseLogo.webp', alt: 'Company 4 helped Clous' },
    { src: 'https://clous.s3.eu-west-3.amazonaws.com/icons/Arboluslogo.webp', alt: 'Company 5 helped Clous' },
    { src: 'https://clous.s3.eu-west-3.amazonaws.com/icons/DiviloLogo.webp', alt: 'Company 6 helped Clous' },
    { src: 'https://clous.s3.eu-west-3.amazonaws.com/icons/BsportLogo.webp', alt: 'Company 7 helped Clous' },
    { src: 'https://clous.s3.eu-west-3.amazonaws.com/icons/DeclarandoLogo.webp', alt: 'Company 8 helped Clous' },
    { src: 'https://clous.s3.eu-west-3.amazonaws.com/icons/CargooneLogo.webp', alt: 'Company 9 helped Clous' },
    { src: 'https://clous.s3.eu-west-3.amazonaws.com/icons/ProductboardLogo.webp', alt: 'Company 10 helped Clous' },
    { src: 'https://clous.s3.eu-west-3.amazonaws.com/icons/GuruwalkLogo.webp', alt: 'Company 11 helped Clous' },

];

const InfiniteLogoCarousel = () => {
  return (
    <div className="w-full overflow-hidden pt-12">
      <h3 className="text-center text-[#A1A1A1] text-sm mb-6">
        Built with the help of 10+ hiring professionals
      </h3>
      <div className="relative">
        <div className="flex items-center animate-marquee">
          {logos.concat(logos).map((logo, index) => (
            <div key={index} className="flex-shrink-0 mx-4 items-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={50}
                className="object-contain max-h-12"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteLogoCarousel;