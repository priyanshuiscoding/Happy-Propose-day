// Music Control - Fixed Version
let musicStarted = false;
let musicPlaying = false;
let music, musicBtn;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Get audio element and button
  music = document.getElementById('bgMusic');
  musicBtn = document.getElementById('musicBtn');
  
  if (!music) {
    console.error('Audio element not found!');
    if (musicBtn) {
      musicBtn.innerHTML = '⚠️ Audio Error';
      musicBtn.style.background = 'rgba(255, 0, 0, 0.7)';
    }
    return;
  }
  
  if (!musicBtn) {
    console.error('Music button not found!');
    return;
  }
  
  // Set volume to 70%
  music.volume = 0.7;
  
  // Add click handler to button
  musicBtn.addEventListener('click', toggleMusic);
  
  // Handle audio events
  music.addEventListener('loadeddata', () => {
    console.log('Audio file loaded successfully');
  });
  
  music.addEventListener('canplay', () => {
    console.log('Audio can start playing');
  });
  
  music.addEventListener('play', () => {
    console.log('Music is now playing');
    musicPlaying = true;
    musicStarted = true;
    updateMusicButton();
  });
  
  music.addEventListener('pause', () => {
    console.log('Music is paused');
    musicPlaying = false;
    updateMusicButton();
  });
  
  music.addEventListener('ended', () => {
    console.log('Music ended (should loop)');
  });
  
  music.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    console.error('Error code:', music.error ? music.error.code : 'unknown');
    if (music.error) {
      switch(music.error.code) {
        case music.error.MEDIA_ERR_ABORTED:
          console.error('Audio loading aborted');
          break;
        case music.error.MEDIA_ERR_NETWORK:
          console.error('Network error loading audio');
          break;
        case music.error.MEDIA_ERR_DECODE:
          console.error('Audio decoding error');
          break;
        case music.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          console.error('Audio format not supported or file not found');
          break;
      }
    }
    musicBtn.innerHTML = '⚠️ Music Error';
    musicBtn.style.background = 'rgba(255, 0, 0, 0.7)';
    musicBtn.onclick = function() {
      alert('Music file not found or cannot be played.\n\nPlease check:\n1. music.mp3 exists in the same folder\n2. File name matches exactly (case-sensitive)\n3. File is not corrupted');
    };
  });
  
  // Try to load the audio
  music.load();
  
  console.log('Music element initialized');
  console.log('Audio source:', music.src || music.currentSrc);
});

function updateMusicButton() {
  if (!musicBtn) return;
  
  if (musicPlaying) {
    musicBtn.innerHTML = '🔇 Pause Music';
    musicBtn.style.background = 'rgba(255, 75, 125, 1)';
  } else {
    musicBtn.innerHTML = '🎵 Play Music';
    musicBtn.style.background = 'rgba(255, 75, 125, 0.9)';
  }
}

function toggleMusic() {
  if (!music) {
    alert('Audio element not found. Please refresh the page.');
    return;
  }
  
  console.log('Toggle music clicked');
  console.log('Music paused?', music.paused);
  console.log('Music readyState:', music.readyState);
  
  if (music.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
}

function playMusic() {
  if (!music) {
    console.error('Cannot play: music element not found');
    return;
  }
  
  console.log('Attempting to play music...');
  console.log('Current src:', music.src || music.currentSrc);
  console.log('Ready state:', music.readyState);
  
  // Ensure volume is set
  music.volume = 0.7;
  
  // Try to play
  const playPromise = music.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log('✅ Music started playing successfully!');
        musicPlaying = true;
        musicStarted = true;
        updateMusicButton();
      })
      .catch(error => {
        console.error('❌ Playback failed:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        // Try to get more info
        if (music.error) {
          console.error('Media error code:', music.error.code);
        }
        
        musicBtn.innerHTML = '🎵 Click to Play';
        musicBtn.style.background = 'rgba(255, 200, 0, 0.9)';
        
        // Show user-friendly message
        alert('Music cannot play automatically.\n\nPlease click the play button to start music.\n\nIf it still doesn\'t work, check:\n1. music.mp3 file exists\n2. File is not corrupted\n3. Browser allows audio playback');
      });
  } else {
    // Fallback for older browsers
    music.play();
    musicPlaying = true;
    musicStarted = true;
    updateMusicButton();
  }
}

function pauseMusic() {
  if (!music) return;
  
  console.log('Pausing music...');
  music.pause();
  musicPlaying = false;
  updateMusicButton();
}

// Auto-play music on first user interaction (anywhere on page)
let interactionHandled = false;

function handleFirstInteraction() {
  if (!interactionHandled && music && !musicStarted) {
    interactionHandled = true;
    console.log('First user interaction detected, trying to play music...');
    if (music.paused) {
      playMusic();
    }
  }
}

// Listen for various user interactions
document.addEventListener('click', handleFirstInteraction, { once: true });
document.addEventListener('touchstart', handleFirstInteraction, { once: true });
document.addEventListener('keydown', handleFirstInteraction, { once: true });

// Scroll to section
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  
  // Try to start music when user starts scrolling
  if (music && !musicStarted && music.paused) {
    playMusic();
  }
}

// Yes button clicked
function yesClicked() {
  const celebration = document.getElementById("celebration");
  celebration.classList.remove("hidden");
  celebration.style.display = "flex";
  
  // Create hearts animation
  createHearts();
  
  // Create continuous hearts
  setInterval(() => {
    createFloatingHeart();
  }, 300);
  
  // Ensure music is playing
  if (music && music.paused) {
    playMusic();
  }
}

// Create hearts explosion
function createHearts() {
  const hearts = ['❤️', '💖', '💕', '💗', '💝', '💞', '💓', '💘'];
  
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.position = "fixed";
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.top = Math.random() * 100 + "vh";
      heart.style.fontSize = Math.random() * 30 + 20 + "px";
      heart.style.zIndex = "10000";
      heart.style.pointerEvents = "none";
      heart.style.animation = `heartFloatUp ${2 + Math.random() * 2}s ease-out forwards`;
      document.body.appendChild(heart);

      setTimeout(() => heart.remove(), 4000);
    }, i * 20);
  }
}

// Create single floating heart
function createFloatingHeart() {
  const hearts = ['❤️', '💖', '💕', '💗'];
  const heart = document.createElement("div");
  heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.position = "fixed";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.top = "100vh";
  heart.style.fontSize = Math.random() * 20 + 15 + "px";
  heart.style.zIndex = "10000";
  heart.style.pointerEvents = "none";
  heart.style.animation = `heartFloatUp ${3 + Math.random() * 2}s ease-out forwards`;
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 5000);
}

// Add CSS animation for floating hearts
const style = document.createElement('style');
style.textContent = `
  @keyframes heartFloatUp {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all sections for scroll animations
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });
});
