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
  const companies = document.querySelector('[data-swiper="companies-slider"]');
  companies.addEventListener("click", (e) => {
    const target = e.target;
    const companyClicked = target.closest("[data-company]");
    if (!companyClicked) return;
    // clicked company values
    const companyClickedLogo = companyClicked.querySelector("[data-company-logo]").getAttribute("data-company-logo");
    const companyClickedBg = companyClicked.querySelector("[data-company-bg]").getAttribute("data-company-bg");
    const companyClickedName = companyClicked.querySelector("[data-company-name]").getAttribute("data-company-name");
    const companyClickedDescription = companyClicked.querySelector("[data-company-description]").getAttribute("data-company-description");
    const companyClickedDomainUrl = companyClicked.querySelector("[data-company-domain-url]").getAttribute("data-company-domain-url");
    const companyClickedRootDomain = companyClicked.querySelector("[data-company-root-domain]").getAttribute("data-company-root-domain");
    const companyClickedService = companyClicked.querySelector("[data-company-service]").getAttribute("data-company-service");
    const companyClickedStage = companyClicked.querySelector("[data-company-stage]").getAttribute("data-company-stage");
    const companyClickedIndustriesRaw = companyClicked.querySelectorAll("[data-company-industry]");
    const companyClickedIndustries = [];
    companyClickedIndustriesRaw.forEach((companyIndustry) => {
      const industry = companyIndustry.getAttribute("data-company-industry");
      companyClickedIndustries.push(industry);
    });
    // company modal elements
    const companyModalLogo = document.querySelector("[data-company-modal-logo]");
    const companyModalBg = document.querySelector("[data-company-modal-bg]");
    const companyModalName = document.querySelector("[data-company-modal-name]");
    const companyModalDescription = document.querySelector("[data-company-modal-description]");
    const companyModalDomainUrl = document.querySelector("[data-company-modal-domain-url]");
    const companyModalRootDomain = document.querySelector("[data-company-modal-root-domain]");
    const companyModalService = document.querySelector("[data-company-modal-service]");
    const companyModalStage = document.querySelector("[data-company-modal-stage]");
    const companyModalIndustries = document.querySelector("[data-company-modal-industries]");
    // set company modal values
    companyModalLogo.setAttribute("src", companyClickedLogo);
    companyModalBg.style.backgroundImage = `url(${companyClickedBg})`;
    companyModalName.textContent = companyClickedName;
    companyModalDescription.textContent = companyClickedDescription;
    companyModalDomainUrl.href = companyClickedDomainUrl;
    companyModalRootDomain.textContent = companyClickedRootDomain;
    companyModalService.textContent = companyClickedService;
    companyModalStage.textContent = companyClickedStage;
    companyModalIndustries.textContent = companyClickedIndustries.join(", ");
  });
  // swiper
  const companiesSlider = new Swiper(companies, {
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
    grabCursor: true,
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
