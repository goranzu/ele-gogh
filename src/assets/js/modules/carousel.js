class Carousel {
  constructor(carouselEl) {
    if (!(carouselEl instanceof Element)) {
      throw new Error("Invalid HTML Element");
    }
    this.carousel = carouselEl;
    this.carouselTrack = this.carousel.querySelector(".carousel__track");
    this.indicators = Array.from(
      this.carousel.querySelectorAll(".carousel__indicator"),
    );
    this.slides = Array.from(
      this.carouselTrack.querySelectorAll(".carousel__slide"),
    );
    this.index = 0;
    this.interval = null;

    this.nextButton = this.carousel.querySelector(".controls__next");
    this.previousButton = this.carousel.querySelector(".controls__previous");

    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleIndicatorClick = this.handleIndicatorClick.bind(this);
  }

  init({ autoPlay = true, interval = 4000 } = {}) {
    this.previous =
      this.carousel.querySelector(".previous") ||
      this.carouselTrack.lastElementChild;
    this.current =
      this.carousel.querySelector(".current") ||
      this.carouselTrack.firstElementChild;
    this.next =
      this.carousel.querySelector(".next") || this.current.nextElementSibling;

    this.previousButton.addEventListener("click", this.handlePreviousClick);
    this.nextButton.addEventListener("click", this.handleNextClick);
    this.indicators.forEach((i) =>
      i.addEventListener("click", this.handleIndicatorClick),
    );

    this.applyClasses();

    if (autoPlay) {
      this.interval = setInterval(this.handleNextClick, interval);
    } else {
      clearInterval(this.interval);
    }
  }

  handleIndicatorClick(e) {
    this.removeClasses();
    this.index = Number(e.currentTarget.dataset.index);
    this.switchSlides();
    this.applyClasses();
  }

  removeClasses() {
    [this.previous, this.current, this.next].forEach((el) =>
      el.classList.remove(...["previous", "current", "next"]),
    );
    this.indicators.forEach((i) => i.classList.remove("active"));
  }

  applyClasses() {
    this.previous.classList.add("previous");
    this.current.classList.add("current");
    this.next.classList.add("next");
    this.indicators[this.index].classList.add("active");
  }

  handleNextClick() {
    this.removeClasses();
    // this.index = this.index >= this.slides.length - 1 ? 0 : (this.index += 1);
    this.index = (this.index + 1) % this.slides.length;
    this.switchSlides();
    this.applyClasses();
  }

  switchSlides() {
    [this.previous, this.current, this.next] = [
      this.slides[this.index].previousElementSibling ||
        this.carouselTrack.lastElementChild,
      this.slides[this.index],
      this.slides[this.index].nextElementSibling ||
        this.carouselTrack.firstElementChild,
    ];
  }

  handlePreviousClick() {
    this.removeClasses();
    // this.index = this.index <= 0 ? this.slides.length - 1 : (this.index -= 1);
    this.index = (this.index - 1 + this.slides.length) % this.slides.length;
    this.switchSlides();
    this.applyClasses();
  }
}

export default Carousel;
