// ===================== LOADING SCREEN =====================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        loader.classList.add('fade-out');
        startPetals();
    }, 1500); // Give enough time for the beating heart to be seen
});

// ===================== MUSIC & SFX CONTROL =====================
let isMusicPlaying = false;
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
const sfxPop = document.getElementById('sfx-pop');
const sfxWhoosh = document.getElementById('sfx-whoosh');

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.className = 'fas fa-volume-mute';
    } else {
        bgMusic.play().catch(() => { });
        musicIcon.className = 'fas fa-volume-high';
    }
    isMusicPlaying = !isMusicPlaying;
}

function playSFX(type) {
    if (type === 'pop') {
        sfxPop.currentTime = 0;
        sfxPop.play().catch(() => { });
    } else if (type === 'whoosh') {
        sfxWhoosh.currentTime = 0;
        sfxWhoosh.play().catch(() => { });
    }
}

// ===================== ENVELOPE =====================
let envelopeOpened = false;
let sealTapCount = 0;

function handleSealTap() {
    sealTapCount++;
    playSFX('pop');

    // Easter Egg: Tap 3 times for a secret
    if (sealTapCount === 3 && !envelopeOpened) {
        document.getElementById('secret-message').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('secret-message').classList.add('hidden');
        }, 3000);
    }
}

function openEnvelope() {
    const envelope = document.getElementById('envelope');

    if (envelopeOpened) return;
    envelopeOpened = true;

    if (!isMusicPlaying) toggleMusic();
    playSFX('whoosh');

    document.getElementById('envelope-instruction').style.opacity = '0';
    envelope.classList.add('seal-breaking');
    createSealBurst();

    setTimeout(() => {
        envelope.classList.add('flap-open');
        playSFX('whoosh');
    }, 400);

    setTimeout(() => {
        envelope.classList.add('letter-out');
    }, 900);

    setTimeout(() => {
        document.getElementById('letter-btn').classList.remove('hidden');
    }, 1500);

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

        const angle = (i / 12) * 360;
        const distance = 40 + Math.random() * 30;
        const tx = Math.cos(angle * Math.PI / 180) * distance;
        const ty = Math.sin(angle * Math.PI / 180) * distance;

        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--ty', `${ty}px`);

        burstContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
}

function goToCards() {
    playSFX('whoosh');
    document.getElementById('envelope-section').classList.add('hidden');
    document.getElementById('cards-section').classList.remove('hidden');
    startCardSequence(1);
}

// ===================== TYPEWRITER EFFECT =====================
function typeEffect(element, text, speed, callback) {
    if (!text) return;
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
    const nextBtn = card.querySelector('.next-btn');

    // Update progress dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === cardNumber - 1);
    });

    if (h2 && p) {
        nextBtn.classList.add('hidden-btn');
        typeEffect(h2, h2.getAttribute('data-text'), 60, () => {
            typeEffect(p, p.getAttribute('data-text'), 25, () => {
                nextBtn.classList.remove('hidden-btn');
            });
        });
    }
}

function nextCard(current) {
    playSFX('whoosh');
    const currentCard = document.getElementById(`card-${current}`);
    const nextCardElement = document.getElementById(`card-${current + 1}`);

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
            document.getElementById('cards-section').classList.add('hidden');
            document.getElementById('proposal-section').classList.remove('hidden');
        }
    }, 300);
}

function prevCard(current) {
    playSFX('whoosh');
    const currentCard = document.getElementById(`card-${current}`);
    const prevCardElement = document.getElementById(`card-${current - 1}`);

    currentCard.style.opacity = '0';
    currentCard.style.transform = 'translateX(30px)';

    setTimeout(() => {
        currentCard.classList.add('hidden');
        currentCard.style.opacity = '';
        currentCard.style.transform = '';

        if (prevCardElement) {
            prevCardElement.classList.remove('hidden');
            // We don't re-run typewriter for back navigation
            const h2 = prevCardElement.querySelector('.typewriter');
            const p = prevCardElement.querySelector('.typewriter-body');
            const nextBtn = prevCardElement.querySelector('.next-btn');

            h2.textContent = h2.getAttribute('data-text');
            p.textContent = p.getAttribute('data-text');
            nextBtn.classList.remove('hidden-btn');

            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === current - 2);
            });
        }
    }, 300);
}

// ===================== NO BUTTON ESCAPE =====================
function moveNoButton() {
    const btn = document.getElementById('no-btn');
    const container = document.querySelector('.proposal-card');
    const containerRect = container.getBoundingClientRect();

    const maxX = containerRect.width - btn.offsetWidth - 20;
    const maxY = containerRect.height - btn.offsetHeight - 20;

    const newX = Math.max(10, Math.random() * maxX);
    const newY = Math.max(10, Math.random() * maxY);

    btn.style.position = 'absolute';
    btn.style.left = `${newX}px`;
    btn.style.top = `${newY}px`;
}

// ===================== CELEBRATION =====================
function celebrate() {
    playSFX('pop');
    document.getElementById('proposal-section').classList.add('hidden');
    document.getElementById('celebration-section').classList.remove('hidden');
    startConfetti();
    createHeartBurst();
}

function handleCertificateTap() {
    playSFX('pop');
    document.getElementById('hidden-love-msg').classList.toggle('hidden');
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

// ===================== ROSE PETALS =====================
function startPetals() {
    const container = document.getElementById('petal-container');
    setInterval(() => {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.width = `${Math.random() * 10 + 10}px`;
        petal.style.height = petal.style.width;
        petal.style.animationDuration = `${Math.random() * 5 + 5}s`;
        petal.style.opacity = Math.random() * 0.5 + 0.3;
        container.appendChild(petal);
        setTimeout(() => petal.remove(), 10000);
    }, 800);
}

// ===================== ATMOSPHERE =====================
function createAtmosphere() {
    const container = document.getElementById('heart-container');
    const icons = ['fa-heart', 'fa-star'];
    setInterval(() => {
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
}

// ===================== CONFETTI =====================
function startConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd700', '#ffffff', '#ff9ecd'];

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
            if (p.y > canvas.height + 10) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
