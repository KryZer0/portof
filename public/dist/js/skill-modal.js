// Butuh anime.js v4.3.0+
// Kalau pakai npm/bundler: import { createLayout, animate } from 'animejs';
import { createLayout, animate } from 'https://cdn.jsdelivr.net/npm/animejs@4.3.0/+esm';

// Data dari PHP (window.SKILL_GALLERIES) diprioritaskan, kalau tidak ada pakai data di bawah
// Item gambar boleh punya "to": gambar kedua yang menggantikan gambar pertama (diagonal) saat gambar ditekan
const GALLERIES = window.SKILL_GALLERIES ?? {
  photoshop: {
    label: 'Photoshop',
    items: [
      { type: 'image', src: 'dist/imgs/projects/photoshop/project-1.png', to: 'dist/imgs/projects/photoshop/project-1.jpg', caption: 'Judul project 1' },
      { type: 'image', src: 'dist/imgs/projects/photoshop/project-2.jpg', caption: 'Judul project 2' },
    ],
  },
  vegas: {
    label: 'Vegas Pro',
    items: [
      { type: 'video', src: 'dist/videos/vegas/project-1.mp4', poster: 'dist/imgs/projects/vegas/project-1.jpg', caption: 'Judul video 1' },
    ],
  },
};

const cards = [...document.querySelectorAll('.skill-card[data-gallery]')];
if (cards.length) initSkillModal();

function initSkillModal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = reduceMotion ? 0 : 600;        // buka/tutup modal
  const MORPH_DURATION = reduceMotion ? 0 : 2000; // transisi diagonal gambar 1 <-> 2

  // Tampilan video di galeri:
  //   'fit' = mengikuti rasio asli video (tidak ada bar hitam berlebih)
  //   'box' = layout sebelumnya (kotak 16:10 dengan latar hitam)
  const VIDEO_FIT = 'fit';

  // Bentuk potongan diagonal (clip-path) dari kiri atas ke kanan bawah.
  // c = 0 -> belum terlihat, c = 2 -> terlihat penuh
  const clipFor = (c) => {
    const a = Math.min(c, 1) * 100;
    const b = Math.max(c - 1, 0) * 100;
    return `polygon(0% 0%, ${a}% 0%, ${a}% ${b}%, ${b}% ${a}%, 0% ${a}%)`;
  };

  // Layout id otomatis supaya kartu, ikon, dan judul "terbang" mulus ke modal
  cards.forEach((card) => {
    const key = card.dataset.gallery;
    card.dataset.layoutId = `skill-${key}`;
    card.querySelector('img')?.setAttribute('data-layout-id', `skill-${key}-icon`);
    card.querySelector('h3')?.setAttribute('data-layout-id', `skill-${key}-title`);
  });

  const $dialog = document.createElement('dialog');
  $dialog.id = 'skill-dialog';
  $dialog.setAttribute('aria-label', 'Galeri project');
  $dialog.dataset.videoFit = VIDEO_FIT;
  document.body.appendChild($dialog);

  const modalLayout = createLayout($dialog, {
    children: ['.skill-card', '.photoshop-icon', 'h3', '.modal-close', '.modal-body'],
    properties: ['--overlay-alpha'],
    duration: DURATION,
  });

  let activeCard = null;
  let readyTimer = null;

  /* ------------------------------------------------------------------ */
  /* Video streaming adaptif (HLS)                                       */
  /* ------------------------------------------------------------------ */
  // hls.js dimuat hanya saat ada video HLS yang dibuka
  const HLS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/+esm';
  let hlsLoader = null;
  const loadHls = () => (hlsLoader ??= import(HLS_URL).then((m) => m.default));
  let hlsInstances = [];

  function destroyHls() {
    hlsInstances.forEach((h) => h.destroy());
    hlsInstances = [];
  }

  // Ubah ke false kalau sudah tidak perlu melihat log HLS di Console browser (F12)
  const DEBUG_HLS = true;
  const hlsLog = (...args) => { if (DEBUG_HLS) console.log('[HLS]', ...args); };

  function attachVideoSource(media, item) {
    const fallback = (why) => {
      hlsLog('fallback ke mp4 karena:', why, '| src =', item.src ?? '(tidak ada)');
      if (item.src) media.src = item.src;
    };

    if (!item.hls) { fallback('item tidak punya hls'); return; }

    const useNative = () => {
      if (!media.canPlayType('application/vnd.apple.mpegurl')) return false;
      hlsLog('memakai HLS native browser');
      media.src = item.hls;
      return true;
    };

    media.addEventListener('error', () => {
      hlsLog('error pada elemen video:', media.error?.code, media.error?.message);
    });

    loadHls()
      .then((Hls) => {
        // hls.js diprioritaskan: tidak semua browser yang mengaku bisa HLS benar-benar lancar
        if (!Hls?.isSupported()) {
          if (!useNative()) fallback('browser tidak mendukung hls.js maupun HLS native');
          return;
        }
        hlsLog('memakai hls.js', Hls.version, '->', item.hls);

        // autoStartLoad:false -> hanya manifest yang diunduh; segmen video baru
        // diunduh saat pengguna menekan play atau menggeser timeline
        const hls = new Hls({ autoStartLoad: false, capLevelToPlayerSize: true });
        hlsInstances.push(hls);

        let parsed = false;
        let wantStart = false;
        const tryStart = () => {
          if (parsed && wantStart) {
            wantStart = false;
            hlsLog('mulai mengunduh segmen video');
            hls.startLoad();
          }
        };

        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          hlsLog('manifest terbaca, kualitas:', data.levels.map((l) => `${l.width}x${l.height}`).join(', '));
          const lv = data.levels.find((l) => l.width && l.height);
          if (lv) media.style.setProperty('--video-ratio', `${lv.width} / ${lv.height}`);
          parsed = true;
          tryStart(); // pengguna mungkin sudah menekan play sebelum manifest selesai
        });
        hls.on(Hls.Events.ERROR, (_, err) => {
          console.warn('[HLS] error:', err.type, err.details, err.fatal ? '(FATAL)' : '', err.response?.code ?? '', err.url ?? '');
          if (err.fatal) { hls.destroy(); fallback(`${err.type} / ${err.details}`); }
        });

        const onUser = () => { wantStart = true; tryStart(); };
        media.addEventListener('play', onUser, { once: true });
        media.addEventListener('seeking', onUser, { once: true });

        hls.loadSource(item.hls);
        hls.attachMedia(media);
      })
      .catch((e) => {
        hlsLog('hls.js gagal dimuat dari CDN:', e);
        if (!useNative()) fallback('hls.js gagal dimuat');
      });
  }

  /* ------------------------------------------------------------------ */
  /* Transisi diagonal di tempat (tanpa zoom, rasio gambar tetap)        */
  /* ------------------------------------------------------------------ */
  // state per gambar: { showing: 'a' | 'b', busy: boolean, anim }
  const morphStates = new WeakMap();

  function toggleMorph(wrap) {
    let st = morphStates.get(wrap);
    if (!st) {
      st = { showing: 'a', busy: false, anim: null };
      morphStates.set(wrap, st);
    }
    if (st.busy) return; // tunggu transisi yang sedang berjalan selesai
    st.busy = true;

    const base = wrap.querySelector('.modal-morph-base');
    const top = wrap.querySelector('.modal-morph-top');
    const nextKey = st.showing === 'a' ? 'b' : 'a';
    const nextSrc = wrap.dataset[nextKey === 'a' ? 'srcA' : 'srcB'];

    const done = () => {
      base.src = nextSrc;
      const reset = () => {
        top.style.clipPath = clipFor(0);
        st.showing = nextKey;
        st.busy = false;
      };
      // tunggu gambar dasar siap supaya tidak berkedip
      if (base.decode) base.decode().catch(() => {}).finally(reset);
      else reset();
    };

    top.src = nextSrc;
    top.style.clipPath = clipFor(0);

    const start = () => {
      if (MORPH_DURATION === 0) {
        done();
        return;
      }
      const state = { c: 0 };
      st.anim = animate(state, {
        c: [0, 2],
        duration: MORPH_DURATION,
        ease: 'inOutSine',
        onUpdate: () => { top.style.clipPath = clipFor(state.c); },
        onComplete: done,
      });
    };
    if (top.decode) top.decode().catch(() => {}).finally(start);
    else start();
  }

  /* ------------------------------------------------------------------ */
  /* Isi galeri                                                          */
  /* ------------------------------------------------------------------ */
  function buildBody(key) {
    const data = GALLERIES[key];
    const body = document.createElement('div');
    body.className = 'modal-body';

    if (!data || !data.items.length) {
      body.innerHTML = '<p class="modal-empty">Belum ada project.</p>';
      return body;
    }

    const grid = document.createElement('div');
    grid.className = 'modal-grid';

    data.items.forEach((item) => {
      const figure = document.createElement('figure');
      figure.className = 'modal-item';

      let media;
      if (item.type === 'video') {
        media = document.createElement('video');
        media.controls = true;
        media.preload = 'metadata';
        media.playsInline = true;
        if (item.poster) media.poster = item.poster;
        attachVideoSource(media, item); // HLS kalau ada item.hls, kalau tidak pakai item.src
        // Simpan rasio asli video supaya mode 'fit' tidak melompat saat metadata termuat
        media.addEventListener('loadedmetadata', () => {
          if (media.videoWidth && media.videoHeight) {
            media.style.setProperty('--video-ratio', `${media.videoWidth} / ${media.videoHeight}`);
          }
        });
      } else {
        const alt = item.caption || `${data.label} project`;

        if (item.to) {
          // Dua gambar ditumpuk: dasar (terlihat) + atas (disingkap diagonal saat ditekan)
          media = document.createElement('div');
          media.className = 'modal-morph';
          media.dataset.srcA = item.src;
          media.dataset.srcB = item.to;
          media.tabIndex = 0;
          media.setAttribute('role', 'button');
          media.setAttribute('aria-label', `${alt} (tekan untuk berganti gambar)`);

          const base = document.createElement('img');
          base.className = 'modal-morph-base';
          base.src = item.src;
          base.alt = alt;

          const top = document.createElement('img');
          top.className = 'modal-morph-top';
          top.alt = '';
          top.setAttribute('aria-hidden', 'true');
          top.style.clipPath = clipFor(0);

          media.append(base, top);
          new Image().src = item.to; // preload gambar kedua
        } else {
          media = document.createElement('img');
          media.src = item.src;
          media.alt = alt;
          media.loading = 'lazy';
        }
      }
      figure.appendChild(media);

      if (item.caption) {
        const cap = document.createElement('figcaption');
        cap.textContent = item.caption;
        figure.appendChild(cap);
      }
      grid.appendChild(figure);
    });

    body.appendChild(grid);
    return body;
  }

  /* ------------------------------------------------------------------ */
  /* Buka / tutup modal                                                  */
  /* ------------------------------------------------------------------ */
  function openModal(card) {
    if ($dialog.open) return;
    activeCard = card;

    const $clone = card.cloneNode(true);
    $clone.removeAttribute('data-gallery');
    $clone.removeAttribute('tabindex');
    $clone.removeAttribute('role');
    $clone.classList.remove('skill-card-clickable');

    const $close = document.createElement('button');
    $close.type = 'button';
    $close.className = 'modal-close';
    $close.setAttribute('aria-label', 'Tutup galeri');
    $close.innerHTML = '&times;';

    $clone.prepend($close);
    $clone.appendChild(buildBody(card.dataset.gallery));

    destroyHls(); // buang instance HLS dari modal sebelumnya
    $dialog.innerHTML = '';
    $dialog.appendChild($clone);

    modalLayout.update(() => {
      $dialog.showModal();
      card.classList.add('is-open');
      document.documentElement.classList.add('skill-modal-open');
    });

    // Scroll di dalam panel baru aktif setelah animasi buka selesai
    clearTimeout(readyTimer);
    readyTimer = setTimeout(() => {
      if ($dialog.open) $dialog.classList.add('is-ready');
    }, DURATION + 50);
  }

  function closeModal() {
    if (!$dialog.open || !activeCard) return;
    const card = activeCard;

    clearTimeout(readyTimer);
    $dialog.classList.remove('is-ready');
    $dialog.querySelectorAll('video').forEach((v) => v.pause());
    destroyHls(); // hentikan unduhan segmen saat modal ditutup

    modalLayout.update(() => {
      $dialog.close();
      card.classList.remove('is-open');
      document.documentElement.classList.remove('skill-modal-open');
      card.focus();
    });
    activeCard = null;
  }

  /* ------------------------------------------------------------------ */
  /* Event                                                               */
  /* ------------------------------------------------------------------ */
  cards.forEach((card) => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  // Satu handler klik saja (jangan dobel)
  $dialog.addEventListener('click', (e) => {
    // Klik gambar bertransisi: ganti ke gambar lainnya secara diagonal
    const morph = e.target.closest('.modal-morph');
    if (morph) {
      toggleMorph(morph);
      return;
    }
    // Klik di luar panel atau tombol X: tutup modal
    const insidePanel = e.target.closest('.skill-card');
    const isCloseBtn = e.target.closest('.modal-close');
    if (!insidePanel || isCloseBtn) closeModal();
  });

  // Enter / Spasi pada gambar bertransisi (keyboard)
  $dialog.addEventListener('keydown', (e) => {
    const morph = e.target.closest?.('.modal-morph');
    if (morph && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleMorph(morph);
    }
  });

  $dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeModal();
  });
}