/*==========================================================
                    SCRIPT.JS
        Premium Sister's Day Interactive Website
              Production Quality Code
==========================================================*/

// ==================== STATE MANAGEMENT ====================
let currentPage = 0;
let currentSister = null;
let isTransitioning = false;
let envelopeOpened = false;
let letterTyped = false;
let messagePopupOpen = false;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  initializeBackgroundEffects();
  setupEventListeners();
}

// ==================== BACKGROUND EFFECTS ====================
function initializeBackgroundEffects() {
  createFloatingHearts();
  createFallingPetals();
  createSparkles();
}

function createFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  const heartEmoji = '❤️';
  
  setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = heartEmoji;
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (3 + Math.random() * 2) + 's';
    
    container.appendChild(heart);
    
    setTimeout(() => heart.remove(), 5000);
  }, 800);
}

function createFallingPetals() {
  const container = document.getElementById('petals');
  const petals = ['🌸', '🌺', '🌼', '🌻', '🌷'];
  
  setInterval(() => {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = (8 + Math.random() * 4) + 's';
    
    container.appendChild(petal);
    
    setTimeout(() => petal.remove(), 12000);
  }, 1200);
}

function createSparkles() {
  const container = document.getElementById('sparkles');
  
  setInterval(() => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = (Math.random() * 2.5) + 's';
    
    container.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 4000);
  }, 600);
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Page 0 - Password Input
  const passwordInput = document.getElementById('passwordInput');
  const continueBtn = document.getElementById('continueBtn');
  const errorMessage = document.getElementById('errorMessage');
  
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit(passwordInput, errorMessage);
    }
  });
  
  continueBtn.addEventListener('click', () => {
    handlePasswordSubmit(passwordInput, errorMessage);
  });
  
  // All Next Buttons
  const nextButtons = document.querySelectorAll('.nextBtn');
  nextButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => goToNextPage());
  });
  
  // Page 2 - Envelope
  const envelope = document.getElementById('envelope');
  if (envelope) {
    envelope.addEventListener('click', openEnvelope);
  }
  
  // Page 4 - Gallery Images
  const galleryImages = document.querySelectorAll('.gallery img');
  galleryImages.forEach(img => {
    img.addEventListener('click', (e) => openImagePopup(e.target.src));
  });
  
  // Page 5 - Flip Cards
  const specialCards = document.querySelectorAll('.specialCard');
  specialCards.forEach(card => {
    card.addEventListener('click', () => flipCard(card));
  });
  
  // Page 6 - Secret Hearts
  const heartContainer = document.getElementById('heartContainer');
  if (heartContainer) {
    heartContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('secretHeart')) {
        openHiddenMessage(e.target);
      }
    });
  }
  
  // Close popups on outside click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('messagePopup')) {
      closeMessagePopup();
    }
  });
}

// ==================== PASSWORD VERIFICATION ====================
function handlePasswordSubmit(input, errorElement) {
  if (isTransitioning) return;
  
  const password = input.value.trim();
  
  if (!password) {
    showError(errorElement, 'Oops!\nSomething doesn\'t look right.\nPlease try again.');
    return;
  }
  
  // Check against all sisters
  let sisterFound = false;
  
  for (let sisterKey in SISTERS_DATA) {
    if (SISTERS_DATA[sisterKey].password === password) {
      currentSister = parseInt(sisterKey);
      sisterFound = true;
      break;
    }
  }
  
  if (sisterFound) {
    input.value = '';
    errorElement.textContent = '';
    showLoadingAnimation();
  } else {
    showError(errorElement, 'Oops!\nSomething doesn\'t look right.\nPlease try again.');
    input.value = '';
    input.focus();
  }
}

function showError(element, message) {
  element.textContent = message;
  element.style.animation = 'none';
  setTimeout(() => {
    element.style.animation = 'fadeIn 0.5s';
  }, 10);
}

// ==================== LOADING ANIMATION ====================
function showLoadingAnimation() {
  isTransitioning = true;
  
  const page0 = document.getElementById('page0');
  page0.style.opacity = '0.5';
  
  // Soft loading transition
  setTimeout(() => {
    page0.classList.remove('active');
    loadSisterContent();
    goToNextPage();
  }, 1200);
}

// ==================== LOAD SISTER CONTENT ====================
function loadSisterContent() {
  const sister = SISTERS_DATA[currentSister];
  
  // Load welcome title with sister's name
  const welcomeTitle = document.getElementById('welcomeTitle');
  const welcomeSubtitle = document.getElementById('welcomeSubtitle');
  
  welcomeTitle.textContent = `Happy Sister's Day ❤️`;
  welcomeSubtitle.textContent = sister.name;
  
  // Load music
  loadBackgroundMusic(sister.musicFile);
  
  // Load gallery photos
  loadGalleryPhotos(sister.photoFiles);
  
  // Load special cards
  loadSpecialCards(sister.specialCards);
  
  // Load hidden messages
  loadHiddenMessages(sister.hiddenMessages);
  
  // Set up letter content for Page 3
  setupLetterContent(sister.mainLetter, sister.finalLetter);
}

// ==================== MUSIC MANAGEMENT ====================
function loadBackgroundMusic(musicFile) {
  const audio = document.getElementById('bgMusic');
  audio.src = musicFile;
  audio.volume = 0.3; // Set volume to 30% for background music
  
  // Try to play after user interaction
  const playMusic = () => {
    audio.play().catch(err => {
      console.log('Auto-play prevented. Music will play on user interaction.');
    });
    document.removeEventListener('click', playMusic);
  };
  
  document.addEventListener('click', playMusic);
}

// ==================== GALLERY PHOTOS ====================
function loadGalleryPhotos(photoFiles) {
  const gallery = document.querySelector('.gallery');
  
  photoFiles.forEach((photoFile, index) => {
    const img = gallery.children[index];
    if (img) {
      img.src = photoFile;
      img.alt = `Memory ${index + 1}`;
      img.style.opacity = '0';
      setTimeout(() => {
        img.style.transition = 'opacity 0.6s ease';
        img.style.opacity = '1';
      }, index * 100);
    }
  });
}

function openImagePopup(src) {
  if (messagePopupOpen) return;
  
  messagePopupOpen = true;
  
  const popup = document.createElement('div');
  popup.className = 'messagePopup';
  popup.innerHTML = `
    <img src="${src}" 
         style="max-width: 90vw; max-height: 80vh; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);"
         alt="Full size photo">
  `;
  
  document.body.appendChild(popup);
  
  popup.addEventListener('click', () => {
    popup.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => {
      popup.remove();
      messagePopupOpen = false;
    }, 300);
  });
}

// ==================== SPECIAL CARDS (FLIP CARDS) ====================
function loadSpecialCards(cardsData) {
  const container = document.getElementById('cardsContainer');
  container.innerHTML = '';
  
  cardsData.forEach((cardData, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'specialCard';
    
    cardDiv.innerHTML = `
      <div class="cardInner">
        <div class="cardFront">${cardData.front}</div>
        <div class="cardBack">${cardData.back}</div>
      </div>
    `;
    
    cardDiv.addEventListener('click', () => flipCard(cardDiv));
    container.appendChild(cardDiv);
  });
}

function flipCard(card) {
  card.classList.toggle('flip');
}

// ==================== HIDDEN MESSAGES (HEARTS) ====================
function loadHiddenMessages(messages) {
  const container = document.getElementById('heartContainer');
  container.innerHTML = '';
  
  messages.forEach((message, index) => {
    const heart = document.createElement('div');
    heart.className = 'secretHeart';
    heart.textContent = '❤️';
    heart.dataset.message = message;
    
    container.appendChild(heart);
  });
}

function openHiddenMessage(heartElement) {
  if (messagePopupOpen) return;
  
  messagePopupOpen = true;
  heartElement.classList.add('open');
  
  const message = heartElement.dataset.message;
  
  const popup = document.createElement('div');
  popup.className = 'messagePopup';
  
  const card = document.createElement('div');
  card.className = 'messageCard';
  card.textContent = message;
  
  popup.appendChild(card);
  document.body.appendChild(popup);
  
  popup.addEventListener('click', () => {
    popup.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => {
      popup.remove();
      messagePopupOpen = false;
    }, 300);
  });
}

function closeMessagePopup() {
  const popup = document.querySelector('.messagePopup');
  if (popup) {
    popup.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => {
      popup.remove();
      messagePopupOpen = false;
    }, 300);
  }
}

// ==================== ENVELOPE ANIMATION ====================
function openEnvelope() {
  if (envelopeOpened) return;
  
  envelopeOpened = true;
  
  const envelope = document.getElementById('envelope');
  const cover = envelope.querySelector('.cover');
  const letter = envelope.querySelector('.letter');
  
  // Animate cover flipping up
  cover.style.animation = 'flap 0.8s ease forwards';
  
  // Slide letter up
  setTimeout(() => {
    letter.style.animation = 'slideUp 0.8s ease forwards';
    letter.textContent = 'Tap to Read ❤️';
  }, 400);
  
  // Add animation styles if not in CSS
  if (!document.querySelector('style[data-envelope]')) {
    const style = document.createElement('style');
    style.setAttribute('data-envelope', '1');
    style.textContent = `
      @keyframes flap {
        from {
          transform: rotateX(0deg);
        }
        to {
          transform: rotateX(-160deg);
          opacity: 0;
        }
      }
      
      @keyframes slideUp {
        from {
          transform: translateY(0);
        }
        to {
          transform: translateY(-100px);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ==================== LETTER CONTENT & TYPEWRITER ====================
function setupLetterContent(mainLetter, finalLetter) {
  const letterTextDiv = document.getElementById('letterText');
  const finalLetterDiv = document.getElementById('finalLetter');
  
  // Store for later use
  window.mainLetterContent = mainLetter;
  window.finalLetterContent = finalLetter;
}

function typewriterEffect(element, text, speed = 30, callback = null) {
  element.textContent = '';
  let index = 0;
  let typedText = '';
  
  // Add blinking cursor
  const cursor = document.createElement('span');
  cursor.style.cssText = `
    animation: blink 0.7s infinite;
    margin-left: 2px;
  `;
  cursor.textContent = '|';
  
  // Add cursor animation if not exists
  if (!document.querySelector('style[data-cursor]')) {
    const style = document.createElement('style');
    style.setAttribute('data-cursor', '1');
    style.textContent = `
      @keyframes blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  element.appendChild(cursor);
  
  function typeNextCharacter() {
    if (index < text.length) {
      const char = text[index];
      typedText += char;
      element.textContent = typedText;
      element.appendChild(cursor);
      
      // Add natural pauses at punctuation
      let nextSpeed = speed;
      if (char === '.' || char === '!' || char === '?') {
        nextSpeed = speed * 6; // Long pause
      } else if (char === ',') {
        nextSpeed = speed * 3; // Medium pause
      } else if (char === '\n') {
        nextSpeed = speed * 2; // Slight pause
      }
      
      index++;
      setTimeout(typeNextCharacter, nextSpeed);
    } else {
      // Remove cursor at the end
      cursor.remove();
      if (callback) callback();
    }
  }
  
  typeNextCharacter();
}

// ==================== PAGE TRANSITIONS ====================
function goToNextPage() {
  if (isTransitioning) return;
  isTransitioning = true;
  
  const currentPageElement = document.querySelector('.page.active');
  currentPageElement.classList.remove('active');
  
  currentPage++;
  
  // Special handling for Page 3 (Typewriter Letter)
  if (currentPage === 3 && !letterTyped) {
    letterTyped = true;
    setTimeout(() => {
      const letterTextDiv = document.getElementById('letterText');
      typewriterEffect(letterTextDiv, window.mainLetterContent, 25, () => {
        isTransitioning = false;
      });
    }, 500);
  } else if (currentPage === 7) {
    // Page 7 - Final Letter with Confetti
    setTimeout(() => {
      const finalLetterDiv = document.getElementById('finalLetter');
      startConfetti();
      typewriterEffect(finalLetterDiv, window.finalLetterContent, 30);
      isTransitioning = false;
    }, 500);
  } else {
    const nextPageElement = document.getElementById(`page${currentPage}`);
    nextPageElement.classList.add('active');
    isTransitioning = false;
  }
}

// ==================== CONFETTI ANIMATION ====================
function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 100;
  const colors = ['#ff5f9a', '#ffc3d9', '#ffd9e8', '#ff8fb7', '#FFD700', '#FF69B4'];
  
  // Create particles
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
  
  let animationFrame = 0;
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    
    let activeParticles = 0;
    
    particles.forEach(p => {
      if (p.y < canvas.height) {
        activeParticles++;
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        p.rotation += p.rotationSpeed;
        
        // Fade out at bottom
        if (p.y > canvas.height - 100) {
          ctx.globalAlpha = (canvas.height - p.y) / 100;
        }
        
        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });
    
    if (activeParticles > 0) {
      animationFrame = requestAnimationFrame(animate);
    }
  }
  
  animate();
  
  // Stop confetti after 5 seconds
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 5000);
}

// ==================== RESPONSIVE BEHAVIOR ====================
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

// ==================== PREVENT MULTIPLE CLICKS ====================
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON' && isTransitioning) {
    e.preventDefault();
    return false;
  }
});

// ==================== OPTIMIZE PERFORMANCE ====================
// Reduce animation frame rate on low-end devices
let isLowEndDevice = false;
if (navigator.deviceMemory && navigator.deviceMemory < 4) {
  isLowEndDevice = true;
  document.documentElement.style.setProperty('--transition', '0.4s');
}

// ==================== ERROR HANDLING ====================
window.addEventListener('error', (e) => {
  console.error('Error occurred:', e.error);
});

// ==================== ACCESSIBILITY ====================
// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (currentPage > 0 && e.key === 'Enter' && !isTransitioning) {
    const nextBtn = document.querySelector('.page.active .nextBtn');
    if (nextBtn) {
      nextBtn.click();
    }
  }
});

// ==================== END OF SCRIPT ❤️ ====================
