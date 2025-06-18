import Slider from "react-slick";
import React, { useState, useRef } from "react"; // Adicione useRef
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface SimpleSliderProps {
  images: string[];
  altText?: string;
}

export default function SimpleSlider({
  images,
  altText = "Slide image",
}: SimpleSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null); 

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000, 
    arrows: true,
    fade: true,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    customPaging: (i: number) => (
      <button 
        onClick={() => sliderRef.current?.slickGoTo(i)} 
        style={{ /*estiliza as barras de navegaçao */
          width: "30px",
          height: "8px",
          borderRadius: "4px",
          background: i === currentSlide ? "#ff5722" : "#cccccc",
          transition: "all 0.3s ease",
          cursor: "pointer",
          border: "none",
          padding: 0,
        }}
      />
    ),
    appendDots: (dots: React.ReactNode) => ( /*estiliza conteiner das barras de navegacai */
      <div style={{ 
        position: "absolute",
        bottom: "25px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}>
        <ul style={{ 
          margin: 0,
          display: "flex",
          gap: "15px",
          alignItems: "center",
          padding: "10px 10px",
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: "10px",
        }}>{dots}</ul>
      </div>
    ),
  };

  const slides = images.map((img, index) => (
    <div key={index}>
      <img 
        src={img} 
        alt={`${altText} ${index + 1}`} 
        style={{  /*estiliza as imagens */
          width: "100%",
          height: "auto",
          maxHeight: "700px",
          objectFit: "cover",
          opacity: 1,
        }}
      />
    </div>
  ));

  return (
    <div className="slider-container" style={{ position: "relative" }}>
      <Slider ref={sliderRef} {...settings}> 
        {slides}
      </Slider>
    </div>
  );
}