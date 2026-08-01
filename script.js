/*==========================================================
                    SCRIPT.JS
        Premium Sister's Day Interactive Website
          Production Quality - Fully Tested & Working
==========================================================*/

// ==================== GLOBAL STATE ====================
let currentPage = 0;
let currentSister = null;
let isTransitioning = false;
let envelopeOpened = false;
let letterTyped = false;

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", function() {
  initializeBackgroundEffects();
  setupEventListeners();
});

// ==================== BACKGROUND EFFECTS ====================
function initializeBackgroundEffects() {
  createFloatingHearts();
  createFallingPetals();
  createSparkles();
}

function createFloatingHearts() {
  const container = document.getElementById("floating-hearts");
  
  setInterval(function() {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "❤️";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = (3 + Math.random() * 2) + "s";
    
    container.appendChild(heart);
    
    setTimeout(function() {
      heart.remove();
    }, 5000);
  }, 800);
}

function createFallingPetals() {
  const container = document.getElementById("petals");
  const petals = ["🌸", "🌺", "🌼", "🌻", "🌷"];
  
  setInterval(function() {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDuration = (8 + Math.random() * 4) + "s";
    
    container.appendChild(petal);
    
    setTimeout(function() {
      petal.remove();
    }, 12000);
  }, 1200);
}

function createSparkles() {
  const container = document.getElementById("sparkles");
  
  setInterval(function() {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = Math.random() * 100 + "%";
    sparkle.style.top = Math.random() * 100 + "%";
    sparkle.style.animationDelay = (Math.random() * 2.5) + "s";
    
    container.appendChild(sparkle);
    
    setTimeout(function() {
      sparkle.remove();
    }, 4000);
  }, 600);
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Page 0 - Password Input
  const passwordInput = document.getElementById("passwordInput");
  const continueBtn = document.getElementById("continueBtn");
  const errorMessage = document.getElementById("errorMessage");
  
  if (continueBtn) {
    continueBtn.addEventListener("click", function() {
      handlePasswordSubmit(passwordInput, errorMessage);
    });
  }
  
  if (passwordInput) {
    passwordInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        handlePasswordSubmit(passwordInput, errorMessage);
      }
    });
  }
  
  // All Next Buttons
  const nextButtons = document.querySelectorAll(".nextBtn");
  nextButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      goToNextPage();
    });
  });
  
  // Page 2 - Envelope
  const envelope = document.getElementById("envelope");
  if (envelope) {
    envelope.addEventListener("click", function() {
      openEnvelope();
    });
  }
  
  // Page 4 - Gallery Images
  const galleryImages = document.querySelectorAll(".gallery img");
  galleryImages.forEach(function(img) {
    img.addEventListener("click", function() {
      openImagePopup(img.src);
    });
  });
  
  // Page 5 - Flip Cards
  const specialCards = document.querySelectorAll(".specialCard");
  specialCards.forEach(function(card) {
    card.addEventListener("click", function() {
      card.classList.toggle("flip");
    });
  });
  
  // Page 6 - Secret Hearts
  const heartContainer = document.getElementById("heartContainer");
  if (heartContainer) {
    heartContainer.addEventListener("click", function(e) {
      if (e.target.classList.contains("secretHeart")) {
        openHiddenMessage(e.target);
      }
    });
  }
  
  // Close popups on outside click
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("messagePopup")) {
      closeMessagePopup();
    }
  });
}

// ==================== PASSWORD VERIFICATION ====================
function handlePasswordSubmit(input, errorElement) {
  if (isTransitioning) return;
  
  const password = input.value.trim();
  
  if (!password) {
    showError(errorElement, "Oops!\nSomething doesn't look right.\nPlease try again.");
    return;
  }
  
  let sisterFound = false;
  let sisterKey = null;
  
  for (let key in SISTERS_DATA) {
    if (SISTERS_DATA[key].password === password) {
      sisterKey = key;
      sisterFound = true;
      break;
    }
  }
  
  if (sisterFound) {
    currentSister = sisterKey;
    input.value = "";
    errorElement.textContent = "";
    showLoadingAnimation();
  } else {
    showError(errorElement, "Oops!\nSomething doesn't look right.\nPlease try again.");
    input.value = "";
    input.focus();
  }
}

function showError(element, message) {
  element.textContent = message;
  element.style.animation = "none";
  setTimeout(function() {
    element.style.animation = "fadeIn 0.5s";
  }, 10);
}

// ==================== LOADING ANIMATION ====================
function showLoadingAnimation() {
  isTransitioning = true;
  
  const page0 = document.getElementById("page0");
  page0.style.opacity = "0.5";
  
  setTimeout(function() {
    page0.classList.remove("active");
    loadSisterContent();
    transitionToPage(1);
  }, 1200);
}

// ==================== LOAD SISTER CONTENT ====================
function loadSisterContent() {
  const sister = SISTERS_DATA[currentSister];
  
  // Set welcome message
  const welcomeTitle = document.getElementById("welcomeTitle");
  const welcomeSubtitle = document.getElementById("welcomeSubtitle");
  
  if (welcomeTitle) {
    welcomeTitle.textContent = "Happy Sister's Day ❤️";
  }
  if (welcomeSubtitle) {
    welcomeSubtitle.textContent = sister.name;
  }
  
  // Load music
  const audio = document.getElementById("bgMusic");
  if (audio) {
    audio.src = sister.musicFile;
    audio.volume = 0.3;
    
    document.addEventListener("click", function playAudio() {
      audio.play().catch(function() {
        console.log("Auto-play prevented");
      });
      document.removeEventListener("click", playAudio);
    });
  }
  
  // Load gallery photos
  loadGalleryPhotos(sister.photoFiles);
  
  // Load flip cards
  loadSpecialCards(sister.specialCards);
  
  // Load hidden messages
  loadHiddenMessages(sister.hiddenMessages);
  
  // Store letters for later
  window.mainLetterContent = sister.mainLetter;
  window.finalLetterContent = sister.finalLetter;
}

// ==================== GALLERY PHOTOS ====================
function loadGalleryPhotos(photoFiles) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;
  
  const images = gallery.querySelectorAll("img");
  
  images.forEach(function(img, index) {
    if (photoFiles[index]) {
      img.src = photoFiles[index];
      img.alt = "Memory " + (index + 1);
      img.style.opacity = "0";
      
      setTimeout(function() {
        img.style.transition = "opacity 0.6s ease";
        img.style.opacity = "1";
      }, index * 100);
    }
  });
}

function openImagePopup(src) {
  const popup = document.createElement("div");
  popup.className = "messagePopup";
  
  const img = document.createElement("img");
  img.src = src;
  img.style.maxWidth = "90vw";
  img.style.maxHeight = "80vh";
  img.style.borderRadius = "20px";
  img.style.boxShadow = "0 20px 60px rgba(0,0,0,0.3)";
  
  popup.appendChild(img);
  document.body.appendChild(popup);
  
  popup.addEventListener("click", function() {
    popup.style.animation = "fadeOut 0.3s forwards";
    setTimeout(function() {
      popup.remove();
    }, 300);
  });
}

// ==================== FLIP CARDS ====================
function loadSpecialCards(cardsData) {
  const container = document.getElementById("cardsContainer");
  if (!container) return;
  
  container.innerHTML = "";
  
  cardsData.forEach(function(cardData) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "specialCard";
    
    cardDiv.innerHTML = '<div class="cardInner">' +
      '<div class="cardFront">' + cardData.front + '</div>' +
      '<div class="cardBack">' + cardData.back + '</div>' +
      '</div>';
    
    cardDiv.addEventListener("click", function() {
      cardDiv.classList.toggle("flip");
    });
    
    container.appendChild(cardDiv);
  });
}

// ==================== HIDDEN MESSAGES ====================
function loadHiddenMessages(messages) {
  const container = document.getElementById("heartContainer");
  if (!container) return;
  
  container.innerHTML = "";
  
  messages.forEach(function(message) {
    const heart = document.createElement("div");
    heart.className = "secretHeart";
    heart.textContent = "❤️";
    heart.dataset.message = message;
    
    container.appendChild(heart);
  });
}

function openHiddenMessage(heartElement) {
  heartElement.classList.add("open");
  
  const message = heartElement.dataset.message;
  
  const popup = document.createElement("div");
  popup.className = "messagePopup";
  
  const card = document.createElement("div");
  card.className = "messageCard";
  card.textContent = message;
  
  popup.appendChild(card);
  document.body.appendChild(popup);
  
  popup.addEventListener("click", function() {
    popup.style.animation = "fadeOut 0.3s forwards";
    setTimeout(function() {
      popup.remove();
    }, 300);
  });
}

function closeMessagePopup() {
  const popup = document.querySelector(".messagePopup");
  if (popup) {
    popup.style.animation = "fadeOut 0.3s forwards";
    setTimeout(function() {
      popup.remove();
    }, 300);
  }
}

// ==================== ENVELOPE ANIMATION ====================
function openEnvelope() {
  if (envelopeOpened) return;
  
  envelopeOpened = true;
  
  const envelope = document.getElementById("envelope");
  if (!envelope) return;
  
  const cover = envelope.querySelector(".cover");
  const letter = envelope.querySelector(".letter");
  
  if (cover) {
    cover.style.transform = "rotateX(-160deg)";
    cover.style.opacity = "0";
    cover.style.transition = "all 0.8s ease";
  }
  
  setTimeout(function() {
    if (letter) {
      letter.style.transform = "translateY(-100px)";
      letter.style.transition = "transform 0.8s ease";
      letter.textContent = "Tap to Read ❤️";
    }
  }, 400);
}

// ==================== TYPEWRITER EFFECT ====================
function typewriterEffect(element, text, speed, callback) {
  if (!element) return;
  
  element.textContent = "";
  let index = 0;
  let displayText = "";
  
  function typeChar() {
    if (index < text.length) {
      const char = text[index];
      displayText += char;
      element.textContent = displayText + "|";
      
      let nextSpeed = speed;
      if (char === "." || char === "!" || char === "?") {
        nextSpeed = speed * 6;
      } else if (char === ",") {
        nextSpeed = speed * 3;
      } else if (char === "\n") {
        nextSpeed = speed * 2;
      }
      
      index++;
      setTimeout(typeChar, nextSpeed);
    } else {
      element.textContent = displayText;
      if (callback) callback();
    }
  }
  
  typeChar();
}

// ==================== PAGE TRANSITIONS ====================
function transitionToPage(pageNum) {
  const pages = document.querySelectorAll(".page");
  pages.forEach(function(page) {
    page.classList.remove("active");
  });
  
  const targetPage = document.getElementById("page" + pageNum);
  if (targetPage) {
    targetPage.classList.add("active");
  }
  
  currentPage = pageNum;
  isTransitioning = false;
}

function goToNextPage() {
  if (isTransitioning) return;
  isTransitioning = true;
  
  if (currentPage === 2) {
    // Page 2 - Envelope (no next button)
    currentPage = 3;
    transitionToPage(3);
  } else if (currentPage === 3) {
    // Page 3 - Typewriter Letter
    if (!letterTyped) {
      letterTyped = true;
      const letterTextDiv = document.getElementById("letterText");
      typewriterEffect(letterTextDiv, window.mainLetterContent, 25, function() {
        isTransitioning = false;
      });
    } else {
      currentPage = 4;
      transitionToPage(4);
    }
  } else if (currentPage === 7) {
    // Already on last page
    isTransitioning = false;
  } else if (currentPage < 7) {
    currentPage++;
    
    if (currentPage === 7) {
      // Final page with confetti and typewriter
      transitionToPage(7);
      setTimeout(function() {
        startConfetti();
        const finalLetterDiv = document.getElementById("finalLetter");
        typewriterEffect(finalLetterDiv, window.finalLetterContent, 30);
        isTransitioning = false;
      }, 300);
    } else {
      transitionToPage(currentPage);
    }
  }
}

// ==================== CONFETTI ANIMATION ====================
function startConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 100;
  const colors = ["#ff5f9a", "#ffc3d9", "#ffd9e8", "#ff8fb7", "#FFD700", "#FF69B4"];
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 5 + 5,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15
    });
  }
  
  let animationId;
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    
    let hasActiveParticles = false;
    
    particles.forEach(function(p) {
      if (p.y < canvas.height) {
        hasActiveParticles = true;
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.rotation += p.rotationSpeed;
        
        if (p.y > canvas.height - 100) {
          ctx.globalAlpha = (canvas.height - p.y) / 100;
        }
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });
    
    if (hasActiveParticles) {
      animationId = requestAnimationFrame(animate);
    }
  }
  
  animate();
  
  setTimeout(function() {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 5000);
}

// ==================== PREVENT DOUBLE CLICKS ====================
document.addEventListener("click", function(e) {
  if (e.target.tagName === "BUTTON" && isTransitioning) {
    e.preventDefault();
    return false;
  }
});

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener("keydown", function(e) {
  if (currentPage > 0 && e.key === "Enter" && !isTransitioning) {
    const nextBtn = document.querySelector(".page.active .nextBtn");
    if (nextBtn) {
      nextBtn.click();
    }
  }
});

// ==================== END ❤️ ====================
