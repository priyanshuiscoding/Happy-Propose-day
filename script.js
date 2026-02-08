// ========== FLYING HEARTS BACKGROUND ==========
function createFlyingHearts() {
  const container = document.getElementById('flyingHearts');
  if (!container) return;

  const hearts = ['💕', '💗', '💖', '💝', '❤️', '💓', '🌸'];
  const count = 15;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'heart-float';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDuration = (8 + Math.random() * 10) + 's';
    el.style.animationDelay = Math.random() * 5 + 's';
    el.style.fontSize = (16 + Math.random() * 16) + 'px';
    container.appendChild(el);
  }
}

createFlyingHearts();

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
  const cards = document.querySelectorAll('.section-card, .gallery-item, .photo-box, .door-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = (i % 3) * 0.1 + 's';
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  cards.forEach(card => {
    card.style.animation = 'cardReveal 0.8s ease both';
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

// ========== MUSIC ==========
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicStatus = document.getElementById('musicStatus');
const tapOverlay = document.getElementById('tapToPlay');
const tapPlayBtn = document.getElementById('tapPlayBtn');

function setMusicStatus(text, timeout = 3000) {
  if (!musicStatus) return;
  musicStatus.textContent = text;
  if (timeout > 0) setTimeout(() => (musicStatus.textContent = ''), timeout);
}

async function tryPlay() {
  if (!music) return Promise.reject(new Error('No audio element'));
  try {
    await music.play();
    musicBtn.innerText = '🔇 Pause Music';
    setMusicStatus('Playing');
    return true;
  } catch (err) {
    console.warn('Playback error:', err);
    setMusicStatus('Playback blocked');
    return Promise.reject(err);
  }
}

if (musicBtn) {
  musicBtn.onclick = async () => {
    if (!music) return;
    if (music.paused) {
      try {
        await tryPlay();
      } catch (e) {
        if (tapOverlay) tapOverlay.style.display = 'flex';
      }
    } else {
      music.pause();
      musicBtn.innerText = '🎵 Play Music';
      setMusicStatus('Paused');
    }
  };
}

function unlockAudioOnGesture() {
  const handler = async () => {
    document.removeEventListener('click', handler);
    document.removeEventListener('touchstart', handler);
    try {
      await tryPlay();
      if (tapOverlay) tapOverlay.style.display = 'none';
    } catch (e) {
      if (tapOverlay) tapOverlay.style.display = 'flex';
    }
  };
  document.addEventListener('click', handler);
  document.addEventListener('touchstart', handler);
}

if (window.Promise) unlockAudioOnGesture();

if (tapPlayBtn) {
  tapPlayBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      await tryPlay();
      if (tapOverlay) tapOverlay.style.display = 'none';
    } catch (err) {
      console.warn('tap play failed', err);
    }
  });
}

if (music) {
  music.addEventListener('canplaythrough', () => setMusicStatus('Ready to play'));
  music.addEventListener('error', () => setMusicStatus('Audio file not found or blocked'));
}

// ========== SMOOTH SCROLL ==========
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ========== YES CLICKED - CELEBRATION PAGE ==========
function yesClicked() {
  spawnConfetti(40);
  tryPlay().catch(() => {});
  setTimeout(() => {
    window.location.href = 'celebration.html';
  }, 800);
}

function spawnConfetti(amount = 40) {
  const container = document.getElementById('confetti');
  if (!container) return;
  const emojis = ['🎉', '💖', '✨', '💫', '💕', '😍', '🎊', '💗', '💝', '❤️', '💓', '🌸'];
  for (let i = 0; i < amount; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + '%';
    el.style.top = Math.random() * -20 + '%';
    el.style.fontSize = 14 + Math.random() * 20 + 'px';
    el.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.animationDuration = 2 + Math.random() * 2 + 's';
    el.style.animationDelay = Math.random() * 0.5 + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  }
}
