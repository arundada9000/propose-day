function openEnvelope() {
    const envelopeSection = document.getElementById('envelope-section');
    const cardsSection = document.getElementById('cards-section');

    envelopeSection.classList.add('hidden');
    cardsSection.classList.remove('hidden');
    createHearts();
}

function nextCard(current) {
    const currentCard = document.getElementById(`card-${current}`);
    const nextCard = document.getElementById(`card-${current + 1}`);

    currentCard.classList.add('hidden');

    if (nextCard) {
        nextCard.classList.remove('hidden');
    } else {
        document.getElementById('cards-section').classList.add('hidden');
        document.getElementById('proposal-section').classList.remove('hidden');
    }
}

function moveNoButton() {
    const btn = document.getElementById('no-btn');
    const x = Math.random() * (window.innerWidth - btn.offsetWidth);
    const y = Math.random() * (window.innerHeight - btn.offsetHeight);

    btn.style.position = 'fixed';
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
}

function celebrate() {
    document.getElementById('proposal-section').classList.add('hidden');
    document.getElementById('celebration-section').classList.remove('hidden');
    startConfetti();
}

// Floating Hearts Effect
function createHearts() {
    const container = document.getElementById('heart-container');
    const heartSymbols = ['❤️', '💖', '💝', '💗', '💓'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
        heart.style.opacity = Math.random();
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';

        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000);
    }, 300);
}

// Simple Canvas Confetti (Alternative to external library to keep it lightweight)
function startConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#FF7F50', '#FF1493', '#FFE4E1', '#FFF0F5', '#FFD700'];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 5 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 360
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.speed;
            p.angle += 1;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (p.y > canvas.height) p.y = -10;
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// Initial hearts for atmosphere
window.onload = () => {
    // Optional: Start a slow heart float even at the start
};
