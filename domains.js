(async function allCollections() {
  const paignatedDomains = await getDomains(querifyParams(requestParams));
  window.paignatedDomains = paignatedDomains;
  if (domainElementTemplate) {
    paignatedDomains.forEach((domain) => {
      instantiateDomain(domainElementTemplate, domain);
    });
    domainElementTemplate.style.display = "none";
    domainElementTemplate.style.visibility = "hidden";
  }
  domainsLoaded();
})();

function domainsLoaded() {
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
    const domainClicked = target.closest("[data-domain='template']");
    if (domainClicked) {
      const domainName = domainClicked.querySelector("[data-domain='domain']").textContent;
      inquireModal.classList.add("is-active");
      domainField.value = domainName;
    }
  });
}

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

//input[type="radio"]:checked
