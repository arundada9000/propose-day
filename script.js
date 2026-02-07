// ===================== MUSIC CONTROL =====================
let isMusicPlaying = false;
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.className = 'fas fa-volume-mute';
    } else {
        bgMusic.play().catch(() => {
            // Autoplay blocked, user will need to tap again
        });
        musicIcon.className = 'fas fa-volume-high';
    }
    isMusicPlaying = !isMusicPlaying;
}

// ===================== ENVELOPE =====================
let envelopeOpened = false;

function openEnvelope() {
    const envelope = document.getElementById('envelope');

    // Prevent multiple clicks
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Try to start music on first interaction
    if (!isMusicPlaying) {
        toggleMusic();
    }

    // Hide instruction
    document.getElementById('envelope-instruction').style.opacity = '0';

    // Stage 1: Seal pops with burst effect (0ms)
    envelope.classList.add('seal-breaking');
    createSealBurst();

    // Stage 2: Flap opens (400ms after seal)
    setTimeout(() => {
        envelope.classList.add('flap-open');
    }, 400);

    // Stage 3: Letter slides out (900ms after seal)
    setTimeout(() => {
        envelope.classList.add('letter-out');
    }, 900);

    // Stage 4: Show continue button (1500ms after seal)
    setTimeout(() => {
        document.getElementById('letter-btn').classList.remove('hidden');
    }, 1500);

    // Start atmosphere
    createAtmosphere();
}

function createSealBurst() {
    const burstContainer = document.getElementById('seal-burst');
    const hearts = ['❤️', '💕', '💗', '✨', '💖'];

    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('span');
        heart.className = 'seal-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.fontSize = `${Math.random() * 12 + 10}px`;

        // Random direction
        const angle = (i / 12) * 360;
        const distance = 40 + Math.random() * 30;
        const tx = Math.cos(angle * Math.PI / 180) * distance;
        const ty = Math.sin(angle * Math.PI / 180) * distance;

        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--ty', `${ty}px`);

        burstContainer.appendChild(heart);

        // Remove after animation
        setTimeout(() => heart.remove(), 1000);
    }
}

function goToCards() {
    document.getElementById('envelope-section').classList.add('hidden');
    document.getElementById('cards-section').classList.remove('hidden');
    startCardSequence(1);
}


// ===================== TYPEWRITER EFFECT =====================
function typeEffect(element, text, speed, callback) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

// ===================== CARD NAVIGATION =====================
function startCardSequence(cardNumber) {
    const card = document.getElementById(`card-${cardNumber}`);
    if (!card) return;

    const h2 = card.querySelector('.typewriter');
    const p = card.querySelector('.typewriter-body');
    const button = card.querySelector('.next-btn');

    // Update progress dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index < cardNumber);
    });

    // Reset button visibility
    button.classList.add('hidden-btn');

    // Start typewriter sequence
    typeEffect(h2, h2.getAttribute('data-text'), 60, () => {
        typeEffect(p, p.getAttribute('data-text'), 25, () => {
            button.classList.remove('hidden-btn');
        });
    });
}

function nextCard(current) {
    const currentCard = document.getElementById(`card-${current}`);
    const nextCardElement = document.getElementById(`card-${current + 1}`);

    // Fade out current card
    currentCard.style.opacity = '0';
    currentCard.style.transform = 'translateX(-30px)';

    setTimeout(() => {
        currentCard.classList.add('hidden');
        currentCard.style.opacity = '';
        currentCard.style.transform = '';

        if (nextCardElement) {
            nextCardElement.classList.remove('hidden');
            startCardSequence(current + 1);
        } else {
            // Move to proposal
            document.getElementById('cards-section').classList.add('hidden');
            document.getElementById('proposal-section').classList.remove('hidden');
        }
    }, 300);
}

// ===================== NO BUTTON ESCAPE =====================
function moveNoButton() {
    const btn = document.getElementById('no-btn');
    const container = document.querySelector('.proposal-card');
    const containerRect = container.getBoundingClientRect();

    // Calculate safe bounds within the proposal card
    const maxX = containerRect.width - btn.offsetWidth - 20;
    const maxY = containerRect.height - btn.offsetHeight - 20;

    const newX = Math.max(10, Math.random() * maxX);
    const newY = Math.max(10, Math.random() * maxY);

    btn.style.position = 'absolute';
    btn.style.left = `${newX}px`;
    btn.style.top = `${newY}px`;
    btn.style.transition = 'all 0.2s ease-out';
}

// ===================== CELEBRATION =====================
function celebrate() {
    document.getElementById('proposal-section').classList.add('hidden');
    document.getElementById('celebration-section').classList.remove('hidden');

    startConfetti();
    createHeartBurst();
}

function createHeartBurst() {
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const heart = document.createElement('i');
            heart.className = 'fas fa-heart heart-float';
            heart.style.left = `${40 + Math.random() * 20}vw`;
            heart.style.fontSize = `${Math.random() * 20 + 15}px`;
            heart.style.color = Math.random() > 0.5 ? '#ff4d6d' : '#ffd700';
            heart.style.animationDuration = `${Math.random() * 2 + 2}s`;
            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 4000);
        }, i * 100);
    }
}

// ===================== ATMOSPHERE =====================
function createAtmosphere() {
    const container = document.getElementById('heart-container');
    const icons = ['fa-heart', 'fa-star'];

    const interval = setInterval(() => {
        const icon = document.createElement('i');
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];

        icon.className = `fas ${randomIcon} heart-float`;
        icon.style.left = `${Math.random() * 100}vw`;
        icon.style.fontSize = `${Math.random() * 15 + 10}px`;
        icon.style.color = randomIcon === 'fa-star' ? '#ffd700' : '#ff4d6d';
        icon.style.animationDuration = `${Math.random() * 4 + 5}s`;

        container.appendChild(icon);

        setTimeout(() => icon.remove(), 9000);
    }, 600);

    // Store interval to potentially clear later
    window.atmosphereInterval = interval;
}

// ===================== CONFETTI =====================
function startConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd700', '#ffffff', '#ff9ecd'];

    // Create particles
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();

            // Reset particle when it falls off screen
            if (p.y > canvas.height + 10) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
