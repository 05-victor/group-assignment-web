// SOUND EFFECTS MANAGEMENT
class SoundManager {
  constructor() {
    this.sounds = {
      hover: document.getElementById("hoverSound"),
      click: document.getElementById("clickSound"),
      social: document.getElementById("socialSound"),
    };
    this.isMuted = false;
    this.volume = 0.1;
    this.init();
  }

  init() {
    // Set volume for all sounds
    Object.values(this.sounds).forEach((sound) => {
      if (sound) {
        sound.volume = this.volume;
      }
    });

    this.createMuteButton();
  }

  play(soundName) {
    if (this.isMuted || !this.sounds[soundName]) return;

    try {
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play().catch((e) => {
        console.log("Audio play failed:", e);
      });
    } catch (error) {
      console.log("Sound error:", error);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("soundMuted", this.isMuted);
    return this.isMuted;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(0.1, volume));
    Object.values(this.sounds).forEach((sound) => {
      if (sound) {
        sound.volume = this.volume;
      }
    });
  }

  createMuteButton() {
    const muteButton = document.createElement("button");
    muteButton.innerHTML = "🔊";
    muteButton.id = "muteToggle";
    muteButton.setAttribute("aria-label", "Toggle sound effects");

    const savedMuteState = localStorage.getItem("soundMuted");
    if (savedMuteState === "true") {
      this.isMuted = true;
      muteButton.innerHTML = "🔇";
    }

    muteButton.addEventListener("click", () => {
      const isMuted = this.toggleMute();
      muteButton.innerHTML = isMuted ? "🔇" : "🔊";
      muteButton.style.borderColor = isMuted
        ? "#ff6b6b"
        : "var(--accent-color)";

      if (!isMuted) {
        this.play("click");
      }
    });

    muteButton.addEventListener("mouseenter", () => {
      if (!this.isMuted) {
        this.play("hover");
      }
    });

    document.body.appendChild(muteButton);
  }
}

const soundManager = new SoundManager();

function initHoverSounds() {
  // Navigation links
  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      soundManager.play("hover");
    });

    link.addEventListener("click", () => {
      soundManager.play("click");
    });
  });

  const ctaButton = document.querySelector(".cta-button");
  if (ctaButton) {
    ctaButton.addEventListener("mouseenter", () => {
      soundManager.play("hover");
    });
    ctaButton.addEventListener("click", () => {
      soundManager.play("click");
    });
  }

  const socialIcons = document.querySelectorAll(".social-icon");
  socialIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", () => {
      soundManager.play("social");
    });
    icon.addEventListener("click", () => {
      soundManager.play("click");
    });
  });

  const contactItems = document.querySelectorAll(".contact-item");
  contactItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      soundManager.play("hover");
    });
    item.addEventListener("click", () => {
      soundManager.play("click");
    });
  });

  const avatar = document.querySelector(".avatar");
  if (avatar) {
    avatar.addEventListener("mouseenter", () => {
      soundManager.play("hover");
    });
    avatar.addEventListener("click", () => {
      soundManager.play("click");
    });
  }

  const profileAvatar = document.querySelector(".avatar--small");
  if (profileAvatar) {
    profileAvatar.addEventListener("mouseenter", () => {
      soundManager.play("hover");
    });
  }

  // Cards hover
  const cards = document.querySelectorAll(".about-me-box, .detail-box");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      soundManager.play("hover");
    });
  });
}

// Pupil tracking
const leftPupil = document.getElementById("leftPupil");
const rightPupil = document.getElementById("rightPupil");
const leftEye = document.getElementById("leftEye");
const rightEye = document.getElementById("rightEye");
const mouth = document.getElementById("mouth");
const avatar = document.getElementById("avatar");
const maxMove = 14;

// FETCH DATA FROM JSON FILE
function getMemberIndexFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const memberParam = urlParams.get("member");
  return memberParam !== null ? parseInt(memberParam) : 0;
}

const SELECTED_USER_INDEX = getMemberIndexFromURL();

async function loadUserData() {
  try {
    const response = await fetch("./data/data_info.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();

    let userData;

    if (Array.isArray(jsonData)) {
      userData = jsonData.find((user) => user.index === SELECTED_USER_INDEX);

      if (!userData) {
        userData = jsonData[SELECTED_USER_INDEX];
      }

      if (!userData) {
        throw new Error(`User with index ${SELECTED_USER_INDEX} not found`);
      }

      console.log(
        `Loaded user profile at index ${SELECTED_USER_INDEX}:`,
        userData
      );
    } else {
      userData = jsonData;
      console.log("Loaded single user profile:", userData);
    }

    // Update hero section name
    const heroName = document.getElementById("hero-name");
    if (heroName) {
      heroName.textContent = userData.name;
    }

    const aboutText = document.getElementById("about-text");
    if (aboutText && userData.about) {
      aboutText.textContent = userData.about;
    }

    const profileAvatar = document.getElementById("profile-avatar");
    if (profileAvatar && userData.avatar) {
      profileAvatar.src = userData.avatar;
      profileAvatar.alt = `${userData.name}'s Avatar`;
    }

    // Update detail section
    const detailName = document.getElementById("detail-name");
    if (detailName) {
      detailName.textContent = userData.name;
    }

    const detailAge = document.getElementById("detail-age");
    if (detailAge) {
      detailAge.textContent = `${userData.age} years`;
    }

    const detailLocation = document.getElementById("detail-location");
    if (detailLocation && userData.location) {
      detailLocation.textContent = userData.location;
    }

    const detailUniversity = document.getElementById("detail-university");
    if (detailUniversity && userData.university) {
      detailUniversity.textContent = userData.university;
    }

    const detailPhone = document.getElementById("detail-phone");
    if (detailPhone) {
      detailPhone.textContent = userData.phone;
    }

    const detailEmail = document.getElementById("detail-email");
    if (detailEmail) {
      detailEmail.textContent = userData.email;
    }

    // Update footer section
    const footerPhone = document.getElementById("footer-phone");
    if (footerPhone) {
      footerPhone.textContent = userData.phone;
    }

    const footerEmail = document.getElementById("footer-email");
    if (footerEmail) {
      footerEmail.textContent = userData.email;
      footerEmail.href = `mailto:${userData.email}`;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    alert("Failed to load user data. Please check the console for details.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadUserData();
  initHoverSounds();
});

// PUPIL TRACKING
document.addEventListener("mousemove", function (e) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  updatePupil(leftPupil, mouseX, mouseY);
  updatePupil(rightPupil, mouseX, mouseY);
});

function updatePupil(pupil, mouseX, mouseY) {
  const eye = pupil.parentElement;
  const eyeRect = eye.getBoundingClientRect();
  const eyeCenterX = eyeRect.left + eyeRect.width / 2;
  const eyeCenterY = eyeRect.top + eyeRect.height / 2;
  const deltaX = mouseX - eyeCenterX;
  const deltaY = mouseY - eyeCenterY;
  const angle = Math.atan2(deltaY, deltaX);
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const moveDistance = Math.min(maxMove, distance / 12);
  const pupilX = Math.cos(angle) * moveDistance;
  const pupilY = Math.sin(angle) * moveDistance;
  pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
}

function blink() {
  leftEye.classList.add("blinking");
  rightEye.classList.add("blinking");
  setTimeout(() => {
    leftEye.classList.remove("blinking");
    rightEye.classList.remove("blinking");
  }, 150);
}

setInterval(blink, 4000);

avatar.addEventListener("mouseenter", () => {
  mouth.classList.add("smiling");
});

avatar.addEventListener("mouseleave", () => {
  mouth.classList.remove("smiling");
});

avatar.addEventListener("click", () => {
  avatar.classList.add("clicked");
  setTimeout(() => avatar.classList.remove("clicked"), 600);
});

// Scroll progress bar
const scrollContainer = document.getElementById("scrollContainer");
const scrollProgress = document.getElementById("scrollProgress");

scrollContainer.addEventListener("scroll", () => {
  const scrollTop = scrollContainer.scrollTop;
  const scrollHeight =
    scrollContainer.scrollHeight - scrollContainer.clientHeight;
  const scrollPercentage = (scrollTop / scrollHeight) * 100;
  scrollProgress.style.width = scrollPercentage + "%";
});

// Smooth scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.scrollIntoView({ behavior: "smooth" });
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showCopyNotification();
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
    });
}

function showCopyNotification() {
  const notification = document.getElementById("copyNotification");
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2500);
}

const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll(".about-me-box, .detail-box").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(50px)";
  el.style.transition = "all 0.8s ease-out";
  observer.observe(el);
});
