// Global variables
const body = document.querySelector("body");
const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
const path = window.location.pathname;

// Auth
function isAuth() {
  const jwtToken = localStorage.getItem("exclusiveJWT");
  if (jwtToken) {
    try {
      const decodedToken = jwtDecode(jwtToken);
      const expirationTime = decodedToken.exp;
      const currentTime = Date.now() / 1000;
      if (expirationTime > currentTime) {
        const expiresIn = expirationTime - currentTime;
        return jwtToken;
      }
      if (path != "/") {
        window.location.href = "/";
      }
    } catch (error) {
      return false;
    }
  } else {
    if (path === "/") {
      return false;
    } else {
      window.location.href = "/";
    }
  }
}
function setJWT(jwtToken) {
  localStorage.setItem("exclusiveJWT", jwtToken);
}

// Cal embed
if(isAuth()) {
  loadGlobalCal();
}
function loadGlobalCal() {
  (function (C, A, L) {
    let p = function (a, ar) {
      a.q.push(ar);
    };
    let d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () {
            p(api, arguments);
          };
          const namespace = ar[1];
          api.q = api.q || [];
          typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar);
          return;
        }
        p(cal, ar);
      };
  })(window, "https://app.cal.com/embed/embed.js", "init");
  Cal("init", { origin: "https://app.cal.com" });
  Cal("inline", {
    elementOrSelector: "[data-cal='global-embed']",
    calLink: "exclusive",
  });
}

// Domains
async function getDomains() {
  const type = document.querySelector("[data-domain-type]");
  let typeParam = ''
  if(type) {
    typeParam = `type=${type.getAttribute("data-domain-type")}`
  }
  
  const queryParams = typeParam

  try {
    let headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.getItem("exclusiveJWT")}`,
    };
    let response = await fetch(`https://exclusive-dev.vercel.app/api/domains?${queryParams}`, {
      method: "GET",
      headers: headersList,
    });

    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
function convertToFloat(currencyString) {
  let numericString = currencyString.replace(/[$,]/g, '');
  return parseFloat(numericString);
}
function extractTLD(domain) {
  try {
    if (typeof domain !== 'string' || domain.trim() === '') {
      return;
    }
    domain = domain.toLowerCase().trim();
    let parts = domain.split('.');
    if (parts.length < 2) {
      return;
    }
    return parts[parts.length - 1];
  } catch (error) {
    console.error(error.message);
    return null;
  }
}
function extractSLD(domain) {
  try {
    if (typeof domain !== 'string' || domain.trim() === '') {
      return;
    }

    let parts = domain.split('.');
    if (parts.length > 2) {
      return;
    }
    return parts[parts.length - 2];
  } catch (error) {
    console.error(error.message);
    return null;
  }
}
function domainToColor(domain) {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
      hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

// Responsive breakpoints
function Desktop() {}
function Tablet() {
  if (path === "/") {
    destroyServicesSlider(servicesSwiper);
  }
}
function Landscape() {
  if (path === "/") {
    buildServicesSlider(servicesSwiper);
  }
}
function Portrait() {
  if (path === "/") {
    buildServicesSlider(servicesSwiper);
  }
}
let currentCategory = null;
function getScreenSizeCategory() {
  const width = window.innerWidth;
  if (width >= 992) {
    return "Desktop";
  } else if (width >= 768) {
    return "Tablet";
  } else if (width >= 480) {
    return "Landscape";
  } else {
    return "Portrait";
  }
}
function checkForScreenSizeChange() {
  const newCategory = getScreenSizeCategory();
  if (newCategory !== currentCategory) {
    switch (newCategory) {
      case "Desktop":
        Desktop();
        break;
      case "Tablet":
        Tablet();
        break;
      case "Landscape":
        Landscape();
        break;
      case "Portrait":
        Portrait();
        break;
    }
    currentCategory = newCategory;
  }
}
window.addEventListener("resize", checkForScreenSizeChange);
document.addEventListener("DOMContentLoaded", function () {
  currentCategory = getScreenSizeCategory();
  window[currentCategory]();
});
