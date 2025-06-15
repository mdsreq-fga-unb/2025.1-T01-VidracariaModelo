import React from "react";
import Slider from "react-slick";

export default function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Adiciona autoplay
    autoplaySpeed: 3000, // Muda a cada 3 segundos
    arrows: true, // Mostra setas de navegação
    fade: false, // Efeito fade (opcional)
  };

  const slides = [1, 2, 3, 4, 5, 6].map((num) => (
    <div key={num}>
      <h3>{num}</h3>
    </div>
  ));

  return (
    <div>
      <Slider {...settings}>
        {slides}
      </Slider>
    </div>
  );
}