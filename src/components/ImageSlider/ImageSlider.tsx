import { useEffect, useState } from 'react';
import './ImageSlider.css';

const images = [
  '/wallpeper/1.jpg',
  '/wallpeper/2.jpg',
  '/wallpeper/3.jpg',
  '/wallpeper/4.jpg',
  '/wallpeper/5.jpg',
  '/wallpeper/6.jpg',
  '/wallpeper/7.jpg',
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Slide ${index}`}
          className={`slide-image ${index === currentIndex ? 'active' : ''}`}
        />
      ))}
    </div>
  );
};

export default ImageSlider;
