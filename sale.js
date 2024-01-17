(async function allCollections() {
  const domainsValues = document.querySelectorAll("[data-collection='domains']");
  gsap.set([...domainsValues], {
    opacity: 0,
    y: "1rem",
    ease: "power3.inOut",
  });
  const allDomains = await getDomains();
  window.allDomains = allDomains;
  /* ### Collections ### */
  // $100k+ domains
  const hundredKplusElement = document.querySelector("[data-collection='100k-plus']");
  if (hundredKplusElement) {
    const hundredKplusDomains = allDomains.filter((domain) => {
      if (domain.price === undefined || domain.price === null || domain.price === "") {
        return false;
      }
      const price = convertToFloat(domain.price);
      if (price === NaN) {
        return false;
      }
      return price >= 100000;
    });
    hundredKplusElement.querySelector("[data-collection='domains']").textContent = `${hundredKplusDomains.length} domains`;
  }
  // Premium.AI domains
  const premiumAIElement = document.querySelector("[data-collection='premium-ai']");
  if (premiumAIElement) {
    const premiumAIDomains = allDomains.filter((domain) => {
      return extractTLD(domain.domain_name) === "ai";
    });
    premiumAIElement.querySelector("[data-collection='domains']").textContent = `${premiumAIDomains.length} domains`;
  }
  // Short word domains
  const shortWordElement = document.querySelector("[data-collection='short-word']");
  if (shortWordElement) {
    const shortWordDomains = allDomains.filter((domain) => {
      return extractSLD(domain.domain_name).length <= 4;
    });
    shortWordElement.querySelector("[data-collection='domains']").textContent = `${shortWordDomains.length} domains`;
  }
  // Brandable domains
  const brandableElement = document.querySelector("[data-collection='brandable']");
  if (brandableElement) {
    const brandableDomains = allDomains.filter((domain) => {
      return domain.brandable === "yes";
    });
    brandableElement.querySelector("[data-collection='domains']").textContent = `${brandableDomains.length} domains`;
  }
  // Animated domains values
  gsap.to(domainsValues, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.inOut",
    stagger: 0.2,
  });

  /* ### Featured Inventory ### */
  const featuredElementTemplate = document.querySelector("[data-featured='template']");
  if (featuredElementTemplate) {
    const featuredDomainsNode = allDomains.filter((domain) => {
      return domain.featured === "yes";
    });
    const featuredDomains = [...featuredDomainsNode];
    featuredDomains.forEach((domain) => {
      const featuredElementCopy = featuredElementTemplate.cloneNode(true);
      gsap.set(featuredElementCopy, {
        opacity: 0,
        y: "1rem",
        ease: "power3.inOut",
      });
      const domainName = featuredElementCopy.querySelector("[data-featured='domain']");
      const domainPrice = featuredElementCopy.querySelector("[data-featured='price']");
      const domainIconBackground = featuredElementCopy.querySelector("[data-featured='icon-background']");
      const domainIcon = featuredElementCopy.querySelector("[data-featured='icon']");
      domainName.textContent = domain.domain_name.charAt(0).toUpperCase() + domain.domain_name.slice(1);
      domainPrice.textContent = formatPrice(domain.price);
      domainIconBackground.style.backgroundColor = createBgColor(domain.domain_name);
      if (domain.icon !== null && domain.icon !== undefined && domain.icon !== "") {
        domainIcon.src = domain.icon;
        const randomSignX = Math.random() < 0.5;
        const randomSignY = Math.random() < 0.5;
        const xValue = (randomSignX ? "-" : "") + "0.2rem";
        const yValue = (randomSignY ? "-" : "") + "0.2rem";
        domainIcon.style.translate = `${xValue} ${yValue}`;
      } else {
        domainIcon.remove();
      }
      featuredElementTemplate.parentNode.appendChild(featuredElementCopy);
    });
    featuredElementTemplate.remove();
    gsap.to("[data-featured='template']", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.inOut",
      stagger: 0.2,
    });

    const featuredWrapper = document.querySelector("[data-swiper='featured-slider']");
    const featuredSwiper = new Swiper(featuredWrapper, {
      slidesPerView: "auto",
      autoHeight: true,
      navigation: {
        nextEl: "[data-swiper='featured-nav-next']",
        prevEl: "[data-swiper='featured-nav-prev']",
      },
    });
  }

  /* ### All Domains ### */
  const paignatedDomains = await getDomains(querifyParams(requestParams));
  window.paignatedDomains = paignatedDomains;
  if (domainElementTemplate) {
    paignatedDomains.forEach((domain) => {
      instantiateDomain(domainElementTemplate, domain)
    });
    domainElementTemplate.style.display = "none";
    domainElementTemplate.style.visibility = "hidden";
  }
  domainsLoaded();
})();

function domainsLoaded() {
  // Inquire modal
  const inquireModal = document.querySelector("[data-inquire='component']");
  const inquireModalClose = [document.querySelector("[data-inquire='overlay']"), document.querySelector("[data-inquire='close']")];
  inquireModalClose.forEach((closeButton) => {
    closeButton.addEventListener("click", (e) => {
      inquireModal.classList.remove("is-active");
    });
  });
  const domainField = document.querySelector("[data-inquire='domain-field']");
  domainField.setAttribute("disabled", "");
  window.addEventListener("click", (e) => {
    const target = e.target;
    const domainClicked = target.closest("[data-domain='template']") || target.closest("[data-featured='template']");
    if (domainClicked) {
      const domainName = domainClicked.querySelector("[data-domain='domain']").textContent;
      inquireModal.classList.add("is-active");
      domainField.value = domainName;
    }
  });
}

// Collections slider
const collectionsWrapper = document.querySelector("[data-swiper='collections-slider']");
const collections = collectionsWrapper.firstChild.childNodes;
collections.forEach((collection) => {
  collection.classList.add("swiper-slide");
});
const collectionsSwiper = new Swiper(collectionsWrapper, {
  slidesPerView: "auto",
  autoHeight: true,
  navigation: {
    nextEl: "[data-swiper='collections-nav-next']",
    prevEl: "[data-swiper='collections-nav-prev']",
  },
});

// Library
function formatPrice(price) {
  if (price !== undefined && price !== null && price !== "") {
    let formatedPrice = numeral(price).format("$0.0a").toUpperCase();
    if (formatedPrice === "$0.0") {
      return "Ask";
    }
    return formatedPrice;
  } else {
    return "Ask";
  }
}
function createBgColor(domainName) {
  return new Color(domainToColor(domainName)).set({ "lch.l": 80 }).to("srgb").toString();
}