function openEnvelope() {
    const envelope = document.querySelector('.envelope-outer');
    envelope.classList.add('open');

    setTimeout(() => {
        document.getElementById('envelope-section').classList.add('hidden');
        document.getElementById('cards-section').classList.remove('hidden');
        startCardSequence(1);
    }, 1500);

    createAtmosphere();
}

function startCardSequence(cardNumber) {
    const card = document.getElementById(`card-${cardNumber}`);
    const h2 = card.querySelector('.typewriter');
    const p = card.querySelector('.typewriter-body');
    const button = card.querySelector('.next-btn');

    // Reset visibility
    button.classList.add('hidden-btn');

    typeEffect(h2, h2.getAttribute('data-text'), 70, () => {
        typeEffect(p, p.getAttribute('data-text'), 30, () => {
            button.classList.remove('hidden-btn');
        });
    });
}

function typeEffect(element, text, speed, callback) {
    let i = 0;
    element.innerHTML = "";

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

function nextCard(current) {
    const currentCard = document.getElementById(`card-${current}`);
    const nextCard = document.getElementById(`card-${current + 1}`);

    currentCard.classList.add('hidden');

    if (nextCard) {
        nextCard.classList.remove('hidden');
        startCardSequence(current + 1);
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

// Floating Hearts & Petals (Using FontAwesome)
function createAtmosphere() {
    const heartContainer = document.getElementById('heart-container');
    const icons = ['fa-heart', 'fa-heart-pulse', 'fa-leaf']; // fa-leaf for petal feel

    setInterval(() => {
        const icon = document.createElement('i');
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];

        icon.className = `fas ${randomIcon} heart-float`;
        icon.style.left = Math.random() * 100 + 'vw';
        icon.style.fontSize = (Math.random() * 20 + 10) + 'px';
        icon.style.color = randomIcon === 'fa-leaf' ? '#ffccd5' : '#ff4d6d';
        icon.style.animationDuration = (Math.random() * 5 + 5) + 's';

        heartContainer.appendChild(icon);

        setTimeout(() => {
            icon.remove();
        }, 10000);
    }, 400);
}

function startConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd700', '#ffffff'];

    for (let i = 0; i < 200; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: Math.random() * 3 - 1.5,
            speedY: Math.random() * 3 + 2,
            opacity: Math.random()
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;

            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
}
