const { animate, stagger, splitText, scrambleText, onScroll, utils } = anime;


// Init audio setelah interaksi user
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

['click', 'touchstart', 'keydown'].forEach(event => {
    window.addEventListener(event, initAudio, {
        once: true
    });
});

// Scramble text effect with sound
let audioCtx = null;
let soundEnabled = true;
const tickSound = () => {
    if (!soundEnabled || !audioCtx) return;

    const t = audioCtx.currentTime;

    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    o.type = 'sine';
    o.frequency.setValueAtTime(
        4000 + Math.random() * 400,
        t
    );

    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(
        0.035,
        t + 0.001
    );

    g.gain.exponentialRampToValueAtTime(
        0.001,
        t + 0.003
    );

    o.connect(g);
    g.connect(audioCtx.destination);

    o.start(t);
    o.stop(t + 0.003);
};


// Typing effect
const roles = [
    "Laravel Developer",
    "Android Developer",
    "TIK Teacher"
];

// Simpan prefix saat ini untuk mencegah animasi ulang yang tidak perlu
let index = 0;
const typing = document.getElementById('typing');
const pretyping = document.getElementById('pretyping');
let currentPrefix = '';

function isElementVisible(el) {

    const rect =
        el.getBoundingClientRect();

    return (
        rect.top <
        window.innerHeight
        &&
        rect.bottom > 0
    );
}

// update sound state based on visibility and scroll
function updateSoundState() {

    soundEnabled =
        !document.hidden &&
        isElementVisible(typing);
}

// listen tab visibility
document.addEventListener(
    'visibilitychange',
    updateSoundState
);

// listen scroll
window.addEventListener(
    'scroll',
    updateSoundState
);

// listen resize
window.addEventListener(
    'resize',
    updateSoundState
);

// init pertama
updateSoundState();

function updatePrefix() {

    const newPrefix =
        roles[index].startsWith('Android')
            ? "I'm an "
            : "I'm a ";

    // Jangan animate kalau text sama
    if (currentPrefix === newPrefix) {
        return;
    }

    currentPrefix = newPrefix;

    animate(pretyping, {
        innerHTML: scrambleText({
            text: newPrefix,
            revealRate: 100,
            chars: 'braille',
            onChange:
                    () => {

                    // hanya play sound
                    // kalau visible
                    if (
                        soundEnabled
                    ) {
                        tickSound();
                    }
                }
        }),
        duration: 800,
        ease: 'linear'
    });
}

// Main scramble function untuk role text
function playScramble() {

    updatePrefix();

    animate(typing, {
        innerHTML: scrambleText({
            text: roles[index],
            revealRate: 100,
            chars: 'braille',
            autoplay: onScroll(),
            onChange: tickSound,
        }),

        duration: 1200,
        ease: 'linear',

        onComplete: () => {
            setTimeout(() => {

                index++;

                if (index >= roles.length) {
                    index = 0;
                }

                playScramble();

            }, 2000);
        }
    });
}

playScramble();

// Title animation
document.addEventListener('DOMContentLoaded', () => {
    const title =
        document.querySelector('#title');
    const text =
        title.textContent;

    title.innerHTML =
        text
        .split('')
        .map(char =>
            `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
        )
        .join('');

    const chars =
        document.querySelectorAll('.char');

    animate(chars, {

        y: [
            { to: '-2.75rem', ease: 'outExpo', duration: 550 },
            { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
        ],

        rotate: {
            from: '-1turn',
            delay: 0
        },

        delay: stagger(100),
        ease: 'inOutCirc',
        loopDelay: 100000,
        loop: true

    });
});

// Description animation
document.addEventListener('DOMContentLoaded', () => {

    const { chars } = splitText('.description', {
        chars: { wrap: 'clip' },
    });

    animate(chars, {
        y: [
            { to: ['100%', '0%'] },
            {
                to: '0%',
                delay: 50,
                ease: 'in(3)'
            }
        ],
        duration: 750,
        ease: 'out(3)',
        delay: stagger(50),
    });

});

// Scramble text on scroll
animate('.scramble-text', {
  innerHTML: scrambleText({
    revealRate: 100,
    chars: 'braille',
  }),
  loop: false,
  loopDelay: 1000,
  autoplay: onScroll()
});

// Navbar animation
animate('#navbar', {
    translateY: [-100, 0],
    opacity: [0, 1],
    duration: 1200,
    ease: 'outExpo'
});

// Hero text animation
animate('.hero-text > *', {
    translateY: [50, 0],
    opacity: [0, 1],
    delay: stagger(200),
    duration: 1400,
    ease: 'outExpo'
});

// Image appear animation
animate('.image-wrapper', {
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 1800,
    ease: 'outElastic(1, .7)'
});

// Floating image animation
animate('.image-wrapper', {
    translateY: [
        { to: -12, duration: 4500 },
        { to: 10, duration: 4500 }
    ],
    rotate: [
        { to: -1.2, duration: 4500 },
        { to: 1.2, duration: 4500 }
    ],
    scale: [
        { to: 1.015, duration: 4500 },
        { to: 1, duration: 4500 }
    ],
    ease: 'inOutQuad',
    alternate: true,
    loop: Infinity
});

// Scroll reveal animation
const observer =
new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            animate(entry.target, {
                opacity: [0, 1],
                translateY: [50, 0],
                duration: 1000,
                ease: 'outExpo'
            });

        }

    });

}, {
    threshold: 0.2
});

// Observe semua elemen dengan class .reveal dan .card
document
.querySelectorAll('.reveal, .card')
.forEach(el =>
    observer.observe(el)
);

// Project hover animation
document.querySelectorAll('.project-expand')
.forEach(card => {

    card.addEventListener('mouseenter', () => {

        animate(card, {
            scale: 1.03,
            duration: 500,
            ease: 'outExpo'
        });

    });

    card.addEventListener('mouseleave', () => {

        animate(card, {
            scale: 1,
            duration: 500,
            ease: 'outExpo'
        });

    });

});

// Contact card hover animation
document.querySelectorAll('.contact-card')
.forEach(card => {

    card.addEventListener('mouseenter', () => {

        animate(card, {
            scale: 1.03,
            duration: 300,
            ease: 'outExpo'
        });

    });

    card.addEventListener('mouseleave', () => {

        animate(card, {
            scale: 1,
            duration: 300,
            ease: 'outExpo'
        });

    });

});

const container =
    document.getElementById(
        'fireflies-container'
    );

const fireflies = [];
const TOTAL = 50;

const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

let interacting = false;
let idleAngle = 0;

let lastMoveTime =
    Date.now();

window.addEventListener(
    'mousemove',
    (e) => {

        mouse.x =
            e.clientX;

        mouse.y =
            e.clientY;

        interacting =
            true;
    }
);

// Mobile
window.addEventListener(
    'touchmove',
    (e) => {

        const touch =
            e.touches[0];

        mouse.x =
            touch.clientX;

        mouse.y =
            touch.clientY;

        interacting =
            true;
    },
    { passive: true }
);

// Saat user menyentuh layar
window.addEventListener(
    'touchstart',
    (e) => {

        const touch =
            e.touches[0];

        mouse.x =
            touch.clientX;

        mouse.y =
            touch.clientY;

        interacting =
            true;
    }
);

// Saat user berhenti menyentuh
window.addEventListener(
    'touchend',
    () => {

        interacting =
            false;
    }
);

// Create fireflies
for(let i = 0; i < TOTAL; i++){

    const dot =
        document.createElement(
            'div'
        );

    dot.className =
        'firefly';

    container.appendChild(
        dot
    );

    fireflies.push({

        el: dot,

        x:
            mouse.x +
            (Math.random() * 120 - 60),

        y:
            mouse.y +
            (Math.random() * 120 - 60),

        vx: 0,
        vy: 0,

        // lebih lambat follow
        speed:
            0.003 +
            Math.random() * 0.008,

        // random orbit
        angle:
            Math.random() *
            Math.PI * 2,

        orbitRadius:
            10 +
            Math.random() * 5,

        wanderSpeed:
            0.003 +
            Math.random() * 0.006
    });

}

// Glow blinking
fireflies.forEach(fly => {

    anime.animate(fly.el, {

        opacity: [
            0.25,
            1
        ],

        duration:
            800 +
            Math.random() * 1200,

        alternate: true,
        loop: true,
        ease: 'inOutSine'
    });

});

function update(){

    // Mouse dianggap diam
    if(Date.now() - lastMoveTime
        > 150){

        isMouseMoving =
            false;
    }

    fireflies.forEach(
        (fly) => {

        // random movement
        fly.angle +=
            fly.wanderSpeed;

        // swarm center
        const centerX =
            mouse.x;

        const centerY =
            mouse.y;

        // random orbit
        const wanderX =
            Math.cos(
                fly.angle
            ) *
            fly.orbitRadius;

        const wanderY =
            Math.sin(
                fly.angle
            ) *
            fly.orbitRadius;

        // target area
        const targetX =
            centerX +
            wanderX;

        const targetY =
            centerY +
            wanderY;

        // smoother + slower follow
        fly.vx +=
            (targetX - fly.x)
            * fly.speed;

        fly.vy +=
            (targetY - fly.y)
            * fly.speed;

        // stronger damping
        fly.vx *= 0.94 / 1.3;
        fly.vy *= 0.94 / 1.3;

        fly.x += fly.vx;
        fly.y += fly.vy;

        fly.el.style.transform =
            `translate(
                ${fly.x}px,
                ${fly.y}px
            )`;

    });

    requestAnimationFrame(
        update
    );
}

update();