const dropdownTrigger = document.querySelector("[data-filters-dropdown-trigger]");
const dropdown = document.querySelector("[data-filters-dropdown='dropdown']");
const dropdownIcon = document.querySelector("[data-filters-dropdown='icon']");
const dropdownStatus = document.querySelector("[data-filters-dropdown='status']");
const dropdownChevron = document.querySelector("[data-filters-dropdown='chevron']");
const tagsContainers = document.querySelectorAll("[data-filters-menu='tags-container']");
const resetButtons = document.querySelectorAll("[data-filters-menu='reset-button']");

// append "All" button with other tags
resetButtons.forEach((button) => {
  const tagsContainer = button.parentElement.querySelector("[data-filters-menu='tags-container']");
  tagsContainer.insertBefore(button, tagsContainer.firstChild);
});

// toggle "is-active" class on reset button
tagsContainers.forEach((container) => {
  container.addEventListener("click", (e) => {
    const target = e.target;
    if (target.hasAttribute("fs-cmsfilter-clear")) {
      target.classList.add("is-active");
    } else if (target.parentElement.querySelector("span") && target != container) {
      container.querySelector("[fs-cmsfilter-clear]").classList.remove("is-active");
    } else {
      return;
    }
    // check if any tag is checked
    setTimeout(() => {
      const checked = dropdown.querySelectorAll("input:checked");
      if (checked.length > 0) {
        gsap.set(dropdownIcon, { color: "#02981F" });
        gsap.set(dropdownStatus, { textContent: "ON" });
      } else {
        gsap.set(dropdownIcon, { color: "#000000" });
        gsap.set(dropdownStatus, { textContent: "OFF" });
      }
    }, 100);
  });
});

// toggle dropdown
gsap.set(dropdown, { display: "none", opacity: 0, bottom: 0 });
dropdownTrigger.addEventListener("click", toggleDropdown);
function toggleDropdown() {
  if (dropdown.classList.contains("is-active")) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

// close dropdown on click outside
body.addEventListener("click", (e) => {
  const target = e.target;
  if ((!target === dropdown || !target.closest("[data-filters-dropdown]")) && target != dropdownTrigger) {
    closeDropdown();
  }
});

// Companies modal
const companies = document.querySelector('[fs-cmsfilter-element="list"]');
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

function openDropdown() {
  dropdownTrigger.setAttribute("aria-expanded", true);
  dropdown.setAttribute("aria-hidden", false);
  dropdown.classList.add("is-active");
  gsap.to(dropdownChevron, {
    rotate: 180,
    duration: 0.5,
    ease: "power3.inOut",
  });
  gsap.to(dropdown, {
    display: "block",
    opacity: 1,
    bottom: "-2rem",
    duration: 0.5,
    ease: "power3.inOut",
  });
}
function closeDropdown() {
  dropdown.classList.remove("is-active");
  dropdownTrigger.setAttribute("aria-expanded", false);
  dropdown.setAttribute("aria-hidden", true);
  gsap.to(dropdownChevron, {
    rotate: 0,
    duration: 0.5,
    ease: "power3.inOut",
  });
  gsap.to(dropdown, {
    display: "none",
    opacity: 0,
    bottom: 0,
    duration: 0.5,
    ease: "power3.inOut",
  });
}
