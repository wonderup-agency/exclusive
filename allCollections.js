(async function allCollections() {
  const allDomains = await getDomains();

  console.log(allDomains[0]);

  // $100k+ domains
  const hundredKplusElement = document.querySelector("[data-collection='hundredK+']");
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
  const premiumAIElement = document.querySelector("[data-collection='premium .ai']");
  if (premiumAIElement) {
    const premiumAIDomains = allDomains.filter((domain) => {
      return extractTLD(domain.domain_name) === "ai";
    });
    premiumAIElement.querySelector("[data-collection='domains']").textContent = `${premiumAIDomains.length} domains`;
  }

  // Short word domains
  const shortWordElement = document.querySelector("[data-collection='short word']");
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
})();
