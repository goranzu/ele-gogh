"use strict";

module.exports = {
  formatSlides(slides) {
    return slides
      .map((slide, index, arr) => {
        let className = "carousel__slide";
        if (index === 0) className = `${className} current`;
        if (index === 1) className = `${className} next`;
        if (index === arr.length - 1) className = `${className} previous`;
        return `<div class="${className}">
      <figure>
        <img src="${slide.src}" alt="${slide.title}" />
        <figcaption>${slide.title}</figcaption>
      </figure>
    </div>`;
      })
      .join("");
  },
};
