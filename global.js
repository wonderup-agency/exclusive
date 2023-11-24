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
        return jwtToken;
      }
      return false;
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
