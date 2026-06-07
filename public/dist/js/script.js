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