// Marquee
const marqueeItems = document.querySelectorAll("[data-marquee-item]");
const marqueePlaceholder = document.querySelector("[data-marquee-placeholder]");
const marqueeTop = document.querySelector("[data-marquee='top']").firstChild;
const marqueeBottom = document.querySelector("[data-marquee='bottom']").firstChild;
const marqueeGap =
  parseFloat(getComputedStyle(marqueeTop).getPropertyValue("grid-column-gap")) / parseFloat(getComputedStyle(document.documentElement).fontSize);
for (let i = 0; i < marqueeItems.length; i++) {
  if (Math.floor(i < marqueeItems.length / 2)) {
    marqueeTop.appendChild(marqueeItems[i]);
  } else {
    marqueeBottom.appendChild(marqueeItems[i]);
  }
}
if (marqueeItems.length % 2 !== 0) {
  const duplicatedItem = marqueeItems[0].cloneNode(true);
  marqueeBottom.appendChild(duplicatedItem);
}
const marqueeTopDuplicate = marqueeTop.cloneNode(true);
marqueeTop.parentNode.insertBefore(marqueeTopDuplicate, marqueeTop.nextSibling);
const marqueeBottomDuplicate = marqueeBottom.cloneNode(true);
marqueeBottom.parentNode.insertBefore(marqueeBottomDuplicate, marqueeBottom.nextSibling);
document.documentElement.style.setProperty("--marqueeGap", `${marqueeGap}rem`);
document.documentElement.style.getPropertyValue("--marqueeGap");

// Company component
document.addEventListener("DOMContentLoaded", function () {
  // format multireference fields
  // const companyIndustries = document.querySelectorAll("[data-industries]");
  // companyIndustries.forEach((companyIndustry) => {
  //   companyIndustrySources = companyIndustry.parentElement.querySelectorAll("[data-industry-name]");
  //   companyIndustrySourcesArray = [];
  //   companyIndustrySources.forEach((industry) => {
  //     const industryValue = industry.getAttribute("data-industry-name");
  //     companyIndustrySourcesArray.push(industryValue);
  //   });
  //   companyIndustryFormated = companyIndustrySourcesArray.join(", ");
  //   companyIndustry.textContent = companyIndustryFormated;
  // });

  // make slider with Swiper js
  const companiesSlider = new Swiper('[data-swiper="companies-slider"]', {
    slidesPerView: "auto",
    spaceBetween: 16,
  });
});

// Services component
const servicesSwiper = document.querySelector('[data-swiper="services-slider"]');
function buildServicesSlider(swiperElement) {
  if (swiperElement.swiper) return;
  swiperElement.classList.add("swiper");
  const swiperWrapper = swiperElement.firstChild;
  const swiperSlides = [...swiperWrapper.children];
  swiperWrapper.classList.add("swiper-wrapper");
  for (let i = 0; i < swiperSlides.length; i++) {
    swiperSlides[i].classList.add("swiper-slide");
  }
  const servicesSlider = new Swiper(swiperElement, {
    slidesPerView: "auto",
    spaceBetween: 16,
  });

  let maxHeight = 0;
  swiperSlides.forEach((slide) => {
    const slideHeight = slide.offsetHeight;
    maxHeight = Math.max(maxHeight, slideHeight);
  });
  swiperSlides.forEach((slide) => {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const maxHeightInRem = maxHeight / rootFontSize;
    slide.style.height = `${maxHeightInRem}rem`;
  });
}
function destroyServicesSlider(swiperElement) {
  if (!swiperElement.swiper) return;
  swiperElement.classList.remove("swiper");
  const swiperWrapper = swiperElement.firstChild;
  const swiperSlides = swiperWrapper.children;
  swiperWrapper.classList.remove("swiper-wrapper");
  for (let i = 0; i < swiperSlides.length; i++) {
    swiperSlides[i].classList.remove("swiper-slide");
  }
  if (swiperElement.swiper) swiperElement.swiper.destroy();
}

// Testimonials component
document.addEventListener("DOMContentLoaded", function () {
  const testimonials = document.querySelector("[data-swiper='testimonials-slider']");
  const testimonialsSlider = new Swiper(testimonials, {
    slidesPerView: 1,
    spaceBetween: 100,
    loop: true,
    pagination: {
      el: ".testimonials_dots",
    },
    navigation: {
      nextEl: "[data-swiper='testimonials-nav-next']",
      prevEl: "[data-swiper='testimonials-nav-prev']",
    },
  });
  const testimonialsDots = document.querySelector("[data-swiper='testimonials-dots']");
  testimonials.appendChild(testimonialsDots);
});
