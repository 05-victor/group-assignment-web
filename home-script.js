// SOUND EFFECTS MANAGEMENT
class SoundManager {
  constructor() {
    this.sounds = {
      hover: document.getElementById("hoverSound"),
      click: document.getElementById("clickSound"),
      social: document.getElementById("socialSound"),
    };
    this.isMuted = false;
    this.volume = 0.3;
    this.audioEnabled = false;
    this.init();
  }

  init() {
    // Set volume for all sounds
    Object.values(this.sounds).forEach((sound) => {
      if (sound) {
        sound.volume = this.volume;
      }
    });

    // Enable audio on first user interaction
    this.enableAudioOnInteraction();

    // Create mute button
    this.createMuteButton();
  }

  enableAudioOnInteraction() {
    const enableAudio = async () => {
      if (this.audioEnabled) return;

      try {
        // Try to play and immediately pause a short silent audio to unlock audio context
        const promises = Object.values(this.sounds).map(async (sound) => {
          if (sound) {
            sound.volume = 0;
            await sound.play();
            sound.pause();
            sound.currentTime = 0;
            sound.volume = this.volume;
          }
        });

        await Promise.all(promises);
        this.audioEnabled = true;

        console.log("🔊 Audio enabled! Sound effects are now ready.");

        // Remove the listeners after first interaction
        document.removeEventListener("click", enableAudio);
        document.removeEventListener("keydown", enableAudio);
        document.removeEventListener("scroll", enableAudio);
        document.removeEventListener("mousemove", enableAudio);
      } catch (error) {
        console.log("Could not enable audio:", error);
      }
    };

    // Listen for various user interactions
    document.addEventListener("click", enableAudio, { once: true });
    document.addEventListener("keydown", enableAudio, { once: true });
    document.addEventListener("scroll", enableAudio, { once: true });
    document.addEventListener("mousemove", enableAudio, { once: true });
  }

  play(soundName) {
    if (this.isMuted || !this.sounds[soundName] || !this.audioEnabled) return;

    try {
      // Reset sound to start
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
    this.volume = Math.max(0, Math.min(0.3, volume));
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

    // Load mute state from localStorage
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

      // Play click sound when toggling mute
      if (!isMuted) {
        this.play("click");
      }
    });

    muteButton.addEventListener("mouseenter", () => {
      if (!this.isMuted && this.audioEnabled) {
        this.play("hover");
      }
    });

    document.body.appendChild(muteButton);

    // Show audio activation hint
    this.showAudioHint();
  }

  showAudioHint() {
    if (this.audioEnabled) return;

    const hint = document.createElement("div");
    hint.innerHTML = `
      <i class="fas fa-volume-up"></i>
      <span>Click anywhere to enable sound effects</span>
    `;
    hint.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-size: 14px;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(102, 126, 234, 0.5);
      backdrop-filter: blur(10px);
      animation: fadeInDown 0.5s ease;
      pointer-events: none;
    `;

    document.body.appendChild(hint);

    // Remove hint when audio is enabled
    const checkAudioEnabled = () => {
      if (this.audioEnabled) {
        hint.style.animation = "fadeOutUp 0.5s ease";
        setTimeout(() => hint.remove(), 500);
      } else {
        setTimeout(checkAudioEnabled, 100);
      }
    };

    setTimeout(checkAudioEnabled, 100);
  }
}

// Initialize sound manager
let soundManager = null;

// Initialize hover sounds for all interactive elements
function initHoverSounds() {
  if (!soundManager) return;

  // Navigation links
  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => soundManager.play("hover"));
    link.addEventListener("click", () => soundManager.play("click"));
  });

  // Buttons
  const buttons = document.querySelectorAll(
    ".btn, .back-to-top, .profile-link"
  );
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => soundManager.play("hover"));
    button.addEventListener("click", () => soundManager.play("click"));
  });

  // Member cards
  const memberCards = document.querySelectorAll(".member-card");
  memberCards.forEach((card) => {
    card.addEventListener("mouseenter", () => soundManager.play("hover"));
    card.addEventListener("click", () => soundManager.play("click"));
  });

  // Social links
  const socialLinks = document.querySelectorAll(".social-links a");
  socialLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => soundManager.play("social"));
    link.addEventListener("click", () => soundManager.play("click"));
  });

  // Footer links
  const footerLinks = document.querySelectorAll(".footer-section a");
  footerLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => soundManager.play("hover"));
    link.addEventListener("click", () => soundManager.play("click"));
  });

  // About cards
  const aboutCards = document.querySelectorAll(".about-card");
  aboutCards.forEach((card) => {
    card.addEventListener("mouseenter", () => soundManager.play("hover"));
  });

  // Scroll indicator
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    scrollIndicator.addEventListener("mouseenter", () =>
      soundManager.play("hover")
    );
    scrollIndicator.addEventListener("click", () => soundManager.play("click"));
  }

  // Stat items
  const statItems = document.querySelectorAll(".stat-item");
  statItems.forEach((stat) => {
    stat.addEventListener("mouseenter", () => soundManager.play("hover"));
  });

  // Logo - Team Portal (with click to go to top)
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.addEventListener("mouseenter", () => soundManager.play("hover"));
    logo.addEventListener("click", () => {
      soundManager.play("click");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    logo.style.cursor = "pointer";
  }
}

// SCROLL PROGRESS INDICATOR
function updateScrollProgress() {
  const scrollProgress = document.getElementById("scrollProgress");
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / scrollableHeight) * 100;
  scrollProgress.style.width = scrolled + "%";
}

// HEADER SCROLL EFFECT

function handleHeaderScroll() {
  const header = document.querySelector(".header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

// SMOOTH SCROLL TO SECTION

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// ACTIVE NAVIGATION LINK

function updateActiveNav() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".main-nav a");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - 100) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

// ANIMATE STATS COUNTER

function animateStats() {
  const stats = document.querySelectorAll(".stat-number");
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
        entry.target.classList.add("counted");
        animateCounter(entry.target);
      }
    });
  }, observerOptions);

  stats.forEach((stat) => observer.observe(stat));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60 FPS
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// BACK TO TOP BUTTON

function setupBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// INTERSECTION OBSERVER FOR ANIMATIONS

function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".about-card, .member-card, .stat-item"
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// MEMBER CARD CLICK HANDLER

function setupMemberCards() {
  const memberCards = document.querySelectorAll(".member-card");

  memberCards.forEach((card) => {
    // Prevent default hover flip on mobile
    if (window.innerWidth <= 768) {
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".profile-link")) {
          card.classList.toggle("flipped");
        }
      });
    }
  });
}

// PARALLAX EFFECT FOR HERO SECTION

function setupParallax() {
  const heroImage = document.querySelector(".hero-image-container");

  window.addEventListener("scroll", () => {
    if (heroImage && window.scrollY < window.innerHeight) {
      const scrolled = window.scrollY;
      heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });
}

// DYNAMIC GRADIENT TEXT ANIMATION

function animateGradientText() {
  const gradientTexts = document.querySelectorAll(".gradient-text");

  gradientTexts.forEach((text) => {
    let hue = 0;
    setInterval(() => {
      hue = (hue + 1) % 360;
      text.style.backgroundImage = `linear-gradient(135deg, 
        hsl(${hue}, 70%, 60%) 0%, 
        hsl(${(hue + 60) % 360}, 70%, 60%) 100%)`;
    }, 50);
  });
}

// MOUSE CURSOR FOLLOWER (DESKTOP ONLY)

function setupCursorFollower() {
  if (window.innerWidth > 768) {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor-follower");
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--accent-purple);
      pointer-events: none;
      mix-blend-mode: difference;
      z-index: 9999;
      transition: transform 0.15s ease;
      opacity: 0;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = "0.5";
    });

    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });

    function animateCursor() {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;

      cursorX += dx * 0.1;
      cursorY += dy * 0.1;

      cursor.style.left = cursorX + "px";
      cursor.style.top = cursorY + "px";

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Scale cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, .member-card"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.transform = "scale(2)";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.transform = "scale(1)";
      });
    });
  }
}

// LOAD MEMBER DATA FROM JSON

async function loadMemberData() {
  try {
    const response = await fetch("./data/data_info.json");
    const members = await response.json();

    // Update member cards with actual data
    const memberCards = document.querySelectorAll(".member-card");

    memberCards.forEach((card, index) => {
      if (members[index]) {
        const member = members[index];

        // Update name
        const nameElement = card.querySelector(".member-name");
        if (nameElement) nameElement.textContent = member.name;

        // Update image
        const imgElement = card.querySelector(".member-image");
        if (imgElement) imgElement.src = member.avatar;

        // Update student ID
        const idElement = card.querySelector(".member-id");
        if (idElement) {
          idElement.innerHTML = `<i class="fas fa-id-card"></i> ${
            member.email.split("@")[0]
          }`;
        }

        // Update quote in card back
        const quoteElement = card.querySelector(".member-quote");
        if (quoteElement) quoteElement.textContent = member.about;

        // Update profile link
        const profileLink = card.querySelector(".profile-link");
        if (profileLink) {
          profileLink.href = `profile.html?member=${index}`;
        }
      }
    });
  } catch (error) {
    console.error("Error loading member data:", error);
  }
}

// KEYBOARD NAVIGATION

function setupKeyboardNav() {
  document.addEventListener("keydown", (e) => {
    // Arrow Down - Scroll to next section
    if (e.key === "ArrowDown" && e.ctrlKey) {
      e.preventDefault();
      const sections = document.querySelectorAll("section");
      const currentScroll = window.scrollY;

      for (let section of sections) {
        if (section.offsetTop > currentScroll + 100) {
          section.scrollIntoView({ behavior: "smooth" });
          break;
        }
      }
    }

    // Arrow Up - Scroll to previous section
    if (e.key === "ArrowUp" && e.ctrlKey) {
      e.preventDefault();
      const sections = Array.from(document.querySelectorAll("section"));
      const currentScroll = window.scrollY;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop < currentScroll - 100) {
          sections[i].scrollIntoView({ behavior: "smooth" });
          break;
        }
      }
    }

    // Home key - Scroll to top
    if (e.key === "Home" && e.ctrlKey) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // End key - Scroll to bottom
    if (e.key === "End" && e.ctrlKey) {
      e.preventDefault();
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  });
}

// LAZY LOAD IMAGES

function setupLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// EASTER EGG: KONAMI CODE

function setupEasterEgg() {
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let konamiIndex = 0;

  document.addEventListener("keydown", (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
}

function activateEasterEgg() {
  // Create confetti effect
  const colors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"];

  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: 50%;
        animation: fall ${2 + Math.random() * 3}s linear;
        pointer-events: none;
        z-index: 10000;
      `;

      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000);
    }, i * 30);
  }

  // Add fall animation if not exists
  if (!document.getElementById("confetti-style")) {
    const style = document.createElement("style");
    style.id = "confetti-style";
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Show message
  const message = document.createElement("div");
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--primary-gradient);
    padding: 30px 50px;
    border-radius: 20px;
    color: white;
    font-size: 24px;
    font-weight: bold;
    z-index: 10001;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    animation: fadeInUp 0.5s ease;
  `;
  message.textContent = "🎉 You found the Easter Egg! 🎉";
  document.body.appendChild(message);

  setTimeout(() => {
    message.style.animation = "fadeOut 0.5s ease";
    setTimeout(() => message.remove(), 500);
  }, 3000);
}

// PERFORMANCE OPTIMIZATION

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(() => {
  updateActiveNav();
}, 100);

// INITIALIZATION

document.addEventListener("DOMContentLoaded", () => {
  // Load member data first
  loadMemberData();

  // Setup all features
  setupBackToTop();
  animateStats();
  setupScrollAnimations();
  setupMemberCards();
  setupParallax();
  setupKeyboardNav();
  setupLazyLoading();
  setupEasterEgg();
  setupCursorFollower();

  // Initialize interactive team photo
  initInteractivePhoto();

  // Initialize sound manager and effects
  soundManager = new SoundManager();
  initHoverSounds();

  // Scroll event listeners
  window.addEventListener("scroll", () => {
    updateScrollProgress();
    handleHeaderScroll();
  });

  window.addEventListener("scroll", debouncedScrollHandler);

  // Initial calls
  updateScrollProgress();
  handleHeaderScroll();
  updateActiveNav();

  // Add smooth scroll to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      scrollToSection(targetId);
    });
  });

  // Log message for developers
  console.log(
    "%c🚀 Welcome to Our Team Portal!",
    "font-size: 20px; color: #667eea; font-weight: bold;"
  );
  console.log(
    "%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A",
    "font-size: 14px; color: #f5576c;"
  );
});

// Handle page visibility change
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Page is hidden, pause animations if needed
    document.body.style.animationPlayState = "paused";
  } else {
    // Page is visible, resume animations
    document.body.style.animationPlayState = "running";
  }
});

// Prevent context menu on long press (optional)
document.addEventListener("contextmenu", (e) => {
  // Uncomment to disable right-click
  // e.preventDefault();
});

// Add loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// Export functions for use in HTML onclick attributes
window.scrollToSection = scrollToSection;

// INTERACTIVE TEAM PHOTO - FACE CLICK DETECTION

let maskImageData = null;
let currentHoveredPerson = null;

// Member data mapping - corresponds to mask pixel values
const memberDataMap = {
  1: {
    name: "Võ Cao Tâm Chính",
    studentId: "23120194",
    role: "Cybersecurity Enthusiast",
    index: 0,
  },
  2: {
    name: "Nguyễn Hưng Thịnh",
    studentId: "23120200",
    role: "Software Engineer",
    index: 1,
  },
  3: {
    name: "Lê Thành Công",
    studentId: "23120222",
    role: "Data Scientist",
    index: 2,
  },
};

// Load mask from masks.txt
async function loadTeamPhotoMask() {
  const teamImage = document.getElementById("teamPhotoImage");
  const maskCanvas = document.getElementById("maskCanvas");
  const hoverCanvas = document.getElementById("hoverCanvas");

  if (!teamImage || !maskCanvas || !hoverCanvas) return;

  try {
    // Read the base64 mask data from masks.txt
    const response = await fetch("./image/masks.txt");
    if (!response.ok) {
      console.log("masks.txt not found, interactive photo disabled");
      return;
    }

    const base64Data = await response.text();

    // Decode base64 to blob
    const byteCharacters = atob(base64Data.trim());
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });

    // Create URL for the mask image
    const maskUrl = URL.createObjectURL(blob);

    // Load the mask image
    const maskImg = new Image();
    maskImg.onload = function () {
      initializeTeamPhotoMask(maskImg);
      console.log("✅ Interactive team photo enabled!");
    };
    maskImg.onerror = function () {
      console.log("Failed to load mask image");
    };
    maskImg.src = maskUrl;
  } catch (error) {
    console.log("Interactive photo feature disabled:", error.message);
  }
}

// Initialize mask canvas
function initializeTeamPhotoMask(maskImg) {
  const teamImage = document.getElementById("teamPhotoImage");
  const maskCanvas = document.getElementById("maskCanvas");
  const hoverCanvas = document.getElementById("hoverCanvas");

  if (!teamImage || !maskCanvas || !hoverCanvas) return;

  // Set canvas dimensions to match the displayed image size
  maskCanvas.width = teamImage.clientWidth;
  maskCanvas.height = teamImage.clientHeight;
  hoverCanvas.width = teamImage.clientWidth;
  hoverCanvas.height = teamImage.clientHeight;

  // Draw mask to canvas
  const ctx = maskCanvas.getContext("2d");
  ctx.drawImage(maskImg, 0, 0, maskCanvas.width, maskCanvas.height);

  // Get image data for pixel detection
  maskImageData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);

  // Enable hover detection
  enableTeamPhotoInteraction();
}

// Enable hover detection
function enableTeamPhotoInteraction() {
  const teamImage = document.getElementById("teamPhotoImage");
  const imageWrapper = document.getElementById("interactivePhotoWrapper");

  if (!teamImage || !imageWrapper) return;

  imageWrapper.addEventListener("mousemove", handleTeamPhotoMouseMove);
  imageWrapper.addEventListener("click", handleTeamPhotoClick);
  imageWrapper.addEventListener("mouseleave", handleTeamPhotoMouseLeave);
}

// Handle mouse move
function handleTeamPhotoMouseMove(e) {
  if (!maskImageData) return;

  const teamImage = document.getElementById("teamPhotoImage");
  const rect = teamImage.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);

  // Get pixel data from mask at cursor position
  const personId = getPersonAtPosition(x, y);

  if (personId && memberDataMap[personId]) {
    // Play hover sound when entering a new person area
    if (currentHoveredPerson !== personId && soundManager) {
      soundManager.play("hover");
    }
    currentHoveredPerson = personId;
    showHoverLabel(memberDataMap[personId]);
    highlightPersonOnPhoto(personId);
    teamImage.style.cursor = "pointer";
  } else {
    currentHoveredPerson = null;
    hideHoverLabel();
    clearPhotoHighlight();
    teamImage.style.cursor = "default";
  }
}

// Get person at position
function getPersonAtPosition(x, y) {
  if (!maskImageData) return null;

  const maskCanvas = document.getElementById("maskCanvas");
  if (!maskCanvas) return null;

  // Ensure coordinates are within bounds
  if (x < 0 || y < 0 || x >= maskCanvas.width || y >= maskCanvas.height) {
    return null;
  }

  // Calculate pixel index in the image data array
  const index = (y * maskCanvas.width + x) * 4;

  // Get RGB values
  const r = maskImageData.data[index];
  const a = maskImageData.data[index + 3];

  // Skip transparent pixels
  if (a === 0) return null;

  // The mask uses grayscale values where pixel value represents person ID
  const personId = r;

  // Only return valid person IDs (1, 2, 3)
  if (personId >= 1 && personId <= 3) {
    return personId;
  }

  return null;
}

// Show hover label
function showHoverLabel(member) {
  const hoverLabel = document.getElementById("hoverLabel");
  const hoverLabelText = document.getElementById("hoverLabelText");

  if (!hoverLabel || !hoverLabelText) return;

  hoverLabelText.textContent = `${member.name} - ${member.role}`;
  hoverLabel.style.display = "block";
}

// Hide hover label
function hideHoverLabel() {
  const hoverLabel = document.getElementById("hoverLabel");
  if (hoverLabel) {
    hoverLabel.style.display = "none";
  }
}

// Handle mouse leave
function handleTeamPhotoMouseLeave() {
  currentHoveredPerson = null;
  hideHoverLabel();
  clearPhotoHighlight();

  const teamImage = document.getElementById("teamPhotoImage");
  if (teamImage) {
    teamImage.style.cursor = "default";
  }
}

// Highlight person
function highlightPersonOnPhoto(personId) {
  if (!maskImageData) return;

  const hoverCanvas = document.getElementById("hoverCanvas");
  if (!hoverCanvas) return;

  const ctx = hoverCanvas.getContext("2d");
  ctx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);

  // Create a highlight overlay for the selected person
  const highlightData = ctx.createImageData(
    hoverCanvas.width,
    hoverCanvas.height
  );

  // Copy pixels where person is detected
  for (let i = 0; i < maskImageData.data.length; i += 4) {
    const r = maskImageData.data[i];

    if (r === personId) {
      // Highlight with semi-transparent purple
      highlightData.data[i] = 102; // R
      highlightData.data[i + 1] = 126; // G
      highlightData.data[i + 2] = 234; // B
      highlightData.data[i + 3] = 80; // A - semi-transparent
    }
  }

  ctx.putImageData(highlightData, 0, 0);
}

// Clear highlight
function clearPhotoHighlight() {
  const hoverCanvas = document.getElementById("hoverCanvas");
  if (!hoverCanvas) return;

  const ctx = hoverCanvas.getContext("2d");
  ctx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
}

// Handle click - Navigate to Profile
function handleTeamPhotoClick(e) {
  if (currentHoveredPerson && memberDataMap[currentHoveredPerson]) {
    const member = memberDataMap[currentHoveredPerson];

    // Add click animation
    const teamImage = document.getElementById("teamPhotoImage");
    if (teamImage) {
      teamImage.style.transform = "scale(0.98)";
      setTimeout(() => {
        teamImage.style.transform = "scale(1)";
      }, 100);
    }

    // Show loading message
    const hoverLabelText = document.getElementById("hoverLabelText");
    if (hoverLabelText) {
      hoverLabelText.textContent = `Loading ${member.name}'s profile...`;
    }

    // Navigate to member profile page after short delay
    setTimeout(() => {
      window.location.href = `profile.html?member=${member.index}`;
    }, 300);

    console.log(`🎯 Clicked on ${member.name} - Navigating to profile...`);
  }
}

// Initialize interactive photo when image loads
function initInteractivePhoto() {
  const teamImage = document.getElementById("teamPhotoImage");

  if (teamImage) {
    if (teamImage.complete) {
      // Image already loaded
      loadTeamPhotoMask();
    } else {
      // Wait for image to load
      teamImage.addEventListener("load", loadTeamPhotoMask);
    }
  }
}
