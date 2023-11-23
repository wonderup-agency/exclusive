// Auth
const authScreen = document.querySelector("[data-auth]");
const pageWrapper = document.querySelector("[data-page-wrapper]");

const exclusiveLogo = document.querySelector("[data-exclusive='logo']");
const exclusiveContainer = document.querySelector("[data-exclusive='container']");

const passcodePane = document.querySelector("[data-passcode='pane']");
const passcodeForm = document.querySelector("[data-passcode='form']");
const passcodePasscode = document.querySelector("[data-passcode='passcode']");
const passcodeError = document.querySelector("[data-passcode='error']");
const passcodeSubmit = document.querySelector("[data-passcode='submit']");
const passcodeSubmitIcon = document.querySelector("[data-passcode='submit-icon']");
const passcodeRequest = document.querySelectorAll("[data-passcode='request']");

const requestPane = document.querySelector("[data-request='pane']");
const requestForm = document.querySelector("[data-request='form']");
const requestSubmit = document.querySelector("[data-request='submit']");
const requestRealSubmit = document.querySelector("[data-request='real-submit']");
const requestSubmitIcon = document.querySelector("[data-request='submit-icon']");
const requestSubmiting = document.querySelector("[data-request='submiting']");
const requestBack = document.querySelectorAll("[data-request='back']");

if (!isAuth()) {
  gsap.set(authScreen, { display: "block" });
  gsap.set(body, { overflow: "hidden" });
  gsap.set(pageWrapper, { opacity: 0, display: "none", pointerEvents: "none" });

  // Exclusive logo animation
  const logoState = Flip.getState(exclusiveLogo);
  setTimeout(() => {
    exclusiveContainer.appendChild(exclusiveLogo);
    Flip.from(logoState, {
      duration: 2,
      ease: "power3.inOut",
      absolute: true,
      onComplete: () => {
        showPasscodeScreen();
      },
    });
  }, 1000);

  // append icon to button for passcode and request forms
  passcodeSubmit.appendChild(passcodeSubmitIcon);
  passcodeSubmit.setAttribute("type", "submit");
  requestSubmit.appendChild(requestSubmitIcon);
  requestSubmit.setAttribute("type", "submit");

  // forms submits
  passcodeForm.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      passcodeSubmit.click();
    }
  });
  passcodeSubmit.addEventListener("click", passcodeHandler);
  requestSubmit.addEventListener("click", (e) => {
    requestRealSubmit.click();
  });

  // go to request access pane
  passcodeRequest.forEach((button) => {
    button.addEventListener("click", () => {
      hidePasscodeScreen();
      setTimeout(showRequestScreen, 1000);
    });
  });

  // go to passcode pane
  requestBack.forEach((button) => {
    button.addEventListener("click", () => {
      hideRequestScreen();
      setTimeout(showPasscodeScreen, 1000);
    });
  });
} else {
  gsap.set(authScreen, { display: "none" });
  gsap.set(body, { overflow: "auto" });
  gsap.set(pageWrapper, { opacity: 1, display: "block", pointerEvents: "auto" });
}

async function passcodeHandler(e) {
  e.preventDefault();
  e.stopPropagation();
  let passcode = passcodePasscode.value;
  const response = await submitPasscode(passcode);
  gsap.to(passcodeForm, {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: "power3.inOut",
    pointerEvents: "auto",
  });
  if (response.statusCode !== 200) {
    passcodeError.querySelector("p").textContent = response.data.message;
    gsap.to(passcodeError, { display: "flex" });
  } else {
    console.log("200");
    const token = response.headers.get("X-Auth-Token");
    console.log(token);
    if (!token) {
      passcodeError.querySelector("p").textContent = "Couldn't read auth token";
      return;
    }
    setJWT(token);
    hideAuthScreen();
  }
}
async function submitPasscode(passcode) {
  gsap.to(passcodeError, {
    display: "none",
    duration: 0,
  });
  gsap.to(passcodeForm, {
    opacity: 0.5,
    scale: 0.95,
    duration: 0.5,
    ease: "power3.inOut",
    pointerEvents: "none",
  });

  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let bodyContent = JSON.stringify({
    passcode: passcode,
  });

  let response = await fetch("https://exclusive-dev.vercel.app/api/passcode", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  let headers = response.headers;
  let data = await response.json();
  let statusCode = response.status;
  return { data, statusCode, headers };
}

function showPasscodeScreen() {
  gsap.fromTo(
    passcodePane,
    {
      display: "none",
      opacity: 0,
      x: "-2rem",
      y: 0,
    },
    {
      display: "block",
      opacity: 1,
      x: 0,
      y: 0,
      duration: 1,
      ease: "power3.inOut",
    }
  );
}
function hidePasscodeScreen() {
  gsap.fromTo(
    passcodePane,
    {
      display: "block",
      opacity: 1,
      x: 0,
      y: 0,
    },
    {
      display: "none",
      opacity: 0,
      x: "-2rem",
      y: 0,
      ease: "power3.inOut",
      duration: 1,
    }
  );
}
function showRequestScreen() {
  gsap.fromTo(
    requestPane,
    {
      display: "none",
      opacity: 0,
      x: "2rem",
      y: 0,
    },
    {
      display: "block",
      opacity: 1,
      x: 0,
      y: 0,
      duration: 1,
      ease: "power3.inOut",
    }
  );
}
function hideRequestScreen() {
  gsap.fromTo(
    requestPane,
    {
      display: "block",
      opacity: 1,
      x: 0,
      y: 0,
    },
    {
      display: "none",
      opacity: 0,
      x: "2rem",
      y: 0,
      ease: "power3.inOut",
      duration: 1,
    }
  );
}
function hideAuthScreen() {
  const timeline = gsap.timeline();
  timeline.fromTo(
    passcodePane,
    {
      display: "block",
      opacity: 1,
      y: 0,
      ease: "power3.inOut",
    },
    {
      duration: 0.5,
      display: "none",
      opacity: 0,
      y: "2rem",
    }
  );
  timeline.fromTo(
    authScreen,
    {
      opacity: 1,
      scale: 1,
      ease: "power3.inOut",
    },
    {
      duration: 2,
      display: "none",
      opacity: 0,
      scale: 1.2,
    }
  );
  gsap.set(body, { overflow: "auto" });
  gsap.set(pageWrapper, { opacity: 1, display: "block", pointerEvents: "auto" });
}
