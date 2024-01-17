var requestParams = {
  page: 1,
  limit: 16,
  maxLength: 100,
};
// if(document.querySelector("[data-domain-type]")) {
//   requestParams.type = document.querySelector("[data-domain-type]").getAttribute("data-domain-type");
// }

const domainElementTemplate = document.querySelector("[data-domain='template']");
const domainsGrid = document.querySelector("[data-domain='grid']");

const formFilters = document.querySelector("[data-domain='form-filters']");
const formFiltersWrapper = formFilters.parentElement;
const filterState = document.querySelector("[data-domain='filter-state']");
const filterIcon = document.querySelector("[data-domain='filter-icon']");
var maxLengthInput;
var tldRadiosGroup;

// toggle dropdown
const filtersTrigger = document.querySelector("[data-domain='filters-trigger']");
const filtersChevron = document.querySelector("[data-domain='filters-chevron']");
gsap.set(formFiltersWrapper, { display: "none", opacity: 0, bottom: 0 });
filtersTrigger.addEventListener("click", toggleDropdown);
function toggleDropdown() {
  if (formFiltersWrapper.classList.contains("is-active")) {
    closeFilters();
  } else {
    openFilters();
  }
}

function filtersLoaded() {
  // Load more
  const loadMoreButton = document.querySelector("[data-domain='load-more']");
  var cooldown = false;
  loadMoreButton.addEventListener("click", async (e) => {
    if (cooldown) {
      return;
    }
    cooldown = true;
    loadMoreButton.textContent = "Loading...";
    loadMoreButton.setAttribute("disabled", "");
    loadMoreButton.style.opacity = "0.5";
    requestParams = {
      ...requestParams,
      page: requestParams.page + 1,
    };
    queryString = querifyParams(requestParams);
    const paignatedDomains = await getDomains(queryString);
    cooldown = false;
    if (paignatedDomains.length == 0) {
      loadMoreButton.textContent = "No more domains";
    } else if (paignatedDomains.length == 1) {
      loadMoreButton.textContent = "No more domains";
    } else {
      loadMoreButton.textContent = "Load More";
      paignatedDomains.forEach((domain) => {
        instantiateDomain(domainElementTemplate, domain);
      });
    }
    loadMoreButton.removeAttribute("disabled");
    loadMoreButton.style.opacity = "1";
  });

  // Max length
  maxLengthInput.addEventListener("change", async (e) => {
    requestParams = {
      ...requestParams,
      maxLength: e.target.value,
      page: 1,
    };
    filterDomains();
  });
  // TLD Radios
  tldRadiosGroup.forEach(async (radio) => {
    radio.addEventListener("change", async (e) => {
      requestParams = {
        ...requestParams,
        page: 1,
        tld: e.target.value,
      };
      filterDomains();
    });
  });
}

// Populate TLD radio buttons
(async () => {
  const tlds = await getTlds();
  const radioTemplate = document.querySelector('[data-domains-filter="radio-template"]');
  tlds.forEach((tld) => {
    const radioTemplateCopy = radioTemplate.cloneNode(true);
    radioTemplateCopy.querySelector('[data-domains-filter="radio-color"]').style.backgroundColor = domainToColor(tld + "12");
    radioTemplateCopy.querySelector("span").textContent = `.${tld}`;
    radioTemplateCopy.querySelector("input").value = `${tld}`;
    radioTemplate.parentNode.appendChild(radioTemplateCopy);
  });
  radioTemplate.remove();

  const radios = document.querySelectorAll("[name='tld']");
  radios[0].parentElement.style.backgroundColor = "#FFF1CB";
  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      radios.forEach((radio) => {
        radio.parentElement.style.backgroundColor = "white";
      });
      e.target.parentElement.style.backgroundColor = "#FFF1CB";
    });
  });
  maxLengthInput = formFilters.querySelector("[data-domain='max-length']");
  tldRadiosGroup = formFilters.querySelectorAll("input[name='tld']");
  tldRadiosGroup[0].checked = true;

  filtersLoaded();
})();

// close dropdown on click outside
body.addEventListener("click", (e) => {
  const target = e.target;
  if ((!target === formFiltersWrapper || !target.closest("[data-domain='form-filters']")) && target != filtersTrigger) {
    closeFilters();
  }
});

function openFilters() {
  filtersTrigger.setAttribute("aria-expanded", true);
  formFiltersWrapper.setAttribute("aria-hidden", false);
  formFiltersWrapper.classList.add("is-active");
  gsap.to(filtersChevron, {
    rotate: 180,
    duration: 0.5,
    ease: "power3.inOut",
  });
  gsap.to(formFiltersWrapper, {
    display: "block",
    opacity: 1,
    bottom: "-1rem",
    duration: 0.5,
    ease: "power3.inOut",
  });
}
function closeFilters() {
  formFiltersWrapper.classList.remove("is-active");
  filtersTrigger.setAttribute("aria-expanded", false);
  formFiltersWrapper.setAttribute("aria-hidden", true);
  gsap.to(filtersChevron, {
    rotate: 0,
    duration: 0.5,
    ease: "power3.inOut",
  });
  gsap.to(formFiltersWrapper, {
    display: "none",
    opacity: 0,
    bottom: 0,
    duration: 0.5,
    ease: "power3.inOut",
  });
}

async function filterDomains() {
  document.querySelector("[data-domain='load-more']").textContent = "Load more";
  if (maxLengthInput.value != 25 || !tldRadiosGroup[0].checked) {
    filterState.textContent = "ON";
    filterIcon.style.color = "#02981F";
  } else {
    filterState.textContent = "OFF";
    filterIcon.style.color = "black";
  }
  gsap.to(domainsGrid, { opacity: 0.5, duration: 0.3 });
  const paignatedDomains = await getDomains(querifyParams(requestParams));
  removePreviousDomains();
  paignatedDomains.forEach((domain) => {
    instantiateDomain(domainElementTemplate, domain);
  });
  gsap.to(domainsGrid, { opacity: 1, duration: 0.3 });
}
