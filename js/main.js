// Header scroll effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Scroll animations (Intersection Observer)
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => observer.observe(el));

// ===== HERO PARTICLE CANVAS =====
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 40 : 80;
  const connectionDistance = isMobile ? 100 : 150;

  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
    });
  }

  function drawParticles() {
    if (prefersReducedMotion) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(129, 140, 248, 0.4)';
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  drawParticles();
}

// ===== HERO CODE TYPING EFFECT =====
const codeContent = document.getElementById('codeContent');
if (codeContent) {
  const codeLines = [
    { text: '// fluxiry.config', cls: 'code-comment' },
    { text: 'const ', cls: 'code-keyword', rest: [{ text: 'solution', cls: '' }, { text: ' = {', cls: '' }] },
    { text: '  stack: ', cls: '', rest: [{ text: '"modern"', cls: 'code-string' }, { text: ',', cls: '' }] },
    { text: '  scale: ', cls: '', rest: [{ text: '"infinite"', cls: 'code-string' }, { text: ',', cls: '' }] },
    { text: '  quality: ', cls: '', rest: [{ text: 'true', cls: 'code-keyword' }] },
    { text: '};', cls: '' },
    { text: '', cls: '' },
    { text: 'deploy', cls: 'code-func', rest: [{ text: '(solution);', cls: '' }] },
  ];

  // Build flat character list with class info
  const chars = [];
  codeLines.forEach((line, lineIdx) => {
    const segments = [{ text: line.text, cls: line.cls }];
    if (line.rest) segments.push(...line.rest);
    segments.forEach(seg => {
      for (const ch of seg.text) {
        chars.push({ ch, cls: seg.cls });
      }
    });
    if (lineIdx < codeLines.length - 1) {
      chars.push({ ch: '\n', cls: '' });
    }
  });

  let charIdx = 0;
  let currentSpan = null;
  let currentCls = null;

  function typeNext() {
    if (charIdx >= chars.length) return;

    const { ch, cls } = chars[charIdx];

    if (ch === '\n') {
      codeContent.appendChild(document.createElement('br'));
      currentSpan = null;
      currentCls = null;
    } else {
      if (cls !== currentCls || !currentSpan) {
        currentSpan = document.createElement('span');
        if (cls) currentSpan.className = cls;
        codeContent.appendChild(currentSpan);
        currentCls = cls;
      }
      currentSpan.textContent += ch;
    }

    charIdx++;
    const delay = ch === '\n' ? 200 : 35;
    setTimeout(typeNext, delay);
  }

  // Start typing after a short delay
  setTimeout(typeNext, 800);
}

// ===== STAT COUNTER ANIMATION =====
const statElements = document.querySelectorAll('.stat-item h3[data-target]');

if (statElements.length) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.closest('.stat-item').querySelector('p').textContent.includes('Satisfaction') ? '%' : '+';
        const duration = 2000;
        const startTime = performance.now();

        function updateCount(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          }
        }

        requestAnimationFrame(updateCount);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => statObserver.observe(el));
}

// ===== MOUSE-TRACKING GLOW ON SERVICE CARDS =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ===== CONTACT FORM HANDLER =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'MESSAGE SENT';
    btn.style.background = 'linear-gradient(135deg, #4f46e5, #06b6d4)';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'SEND MESSAGE';
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}
