(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const EASE_OUT = 'cubic-bezier(.2, .8, .2, 1)';
  const EASE_OUT_MIRROR = 'cubic-bezier(.8, 0, .8, .2)';

  /* ---------- Tema claro / oscuro ---------- */
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const themeMetas = document.querySelectorAll('meta[name="theme-color"]');

  const syncTheme = () => {
    const dark = root.dataset.theme === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
    themeMetas.forEach((m) => m.setAttribute('content', dark ? '#070C16' : '#F3F6FA'));
  };

  const applyTheme = (next) => {
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* almacenamiento no disponible */ }
    syncTheme();
  };

  themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || reduceMotion.matches) {
      applyTheme(next);
      return;
    }
    // El nuevo tema se revela en círculo desde el propio botón
    const r = themeBtn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => applyTheme(next));
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 620, easing: EASE_OUT, pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => {});
  });

  // Si nunca se ha elegido tema, seguimos al sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (err) { /* sin acceso */ }
    if (!saved) {
      root.dataset.theme = e.matches ? 'dark' : 'light';
      syncTheme();
    }
  });
  syncTheme();

  /* ---------- Navegación ---------- */
  const navPill = document.querySelector('.nav-pill');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = [...document.querySelectorAll('.nav-links a')];

  const setMenu = (open) => {
    navPill.toggleAttribute('data-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  navToggle.addEventListener('click', () => setMenu(!navPill.hasAttribute('data-open')));
  navLinks.forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('pointerdown', (e) => {
    if (navPill.hasAttribute('data-open') && !navPill.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navPill.hasAttribute('data-open')) {
      setMenu(false);
      navToggle.focus();
    }
  });

  // Marca en el menú la sección que se está leyendo
  const hero = document.querySelector('.hero');
  const spyTargets = [hero, ...navLinks.map((a) => document.querySelector(a.getAttribute('href')))].filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => {
        if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  spyTargets.forEach((s) => spy.observe(s));

  /* ---------- Vídeo de fondo de «Hablemos» ---------- */
  // Sin controles: se carga al acercarse a la sección y solo se detiene fuera de pantalla
  // (para no gastar batería) o si el sistema pide reducir el movimiento.
  const video = document.querySelector('.contact-video');
  const saveData = navigator.connection && navigator.connection.saveData;

  if (video && !saveData) {
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      video.addEventListener('loadeddata', () => video.classList.add('is-ready'), { once: true });
      video.src = video.dataset.src;
      if (reduceMotion.matches) {
        video.preload = 'auto';
        video.load();
      }
    };
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        load();
        if (!reduceMotion.matches) video.play().catch(() => {});
      } else if (loaded) {
        video.pause();
      }
    }, { rootMargin: '500px 0px' }).observe(video.closest('.contact'));
  }

  /* ---------- Bucle Microsoft 365 del hero ---------- */
  const flowSvg = hero && hero.querySelector('[data-flow]');
  if (flowSvg) initFlow(hero, flowSvg);

  function initFlow(section, svg) {
    const NS = 'http://www.w3.org/2000/svg';
    const nodes = [...section.querySelectorAll('.flow-node')];
    const wavesLayer = svg.querySelector('.flow-waves');
    const packetsLayer = svg.querySelector('.flow-packets');
    // Los cuatro colores del logotipo de Microsoft viajan como pulsos de luz
    const MS_COLORS = ['#f25022', '#7fba00', '#00a4ef', '#ffb900'];

    // Ondas relativas a la fila de apps: la principal pasa justo por los iconos
    const waves = [
      { dy: 0, amp: 1, len: .62, speed: .7, dir: 1, opacity: 1, packets: 8, pace: 115 },
      { dy: -40, amp: 1.5, len: .9, speed: .45, dir: -1, opacity: .45, packets: 4, pace: 70 },
      { dy: 36, amp: .8, len: 1.15, speed: .35, dir: 1, opacity: .28, packets: 3, pace: 55 },
    ];

    const el = (name, cls) => {
      const node = document.createElementNS(NS, name);
      node.setAttribute('class', cls);
      return node;
    };

    waves.forEach((w, wi) => {
      const g = el('g', 'flow-wave');
      g.style.opacity = w.opacity;
      w.glow = el('path', 'flow-glow');
      w.line = el('path', 'flow-line');
      g.append(w.glow, w.line);
      wavesLayer.append(g);

      const pg = el('g', 'flow-packet-group');
      pg.style.opacity = w.opacity;
      packetsLayer.append(pg);
      w.pk = Array.from({ length: w.packets }, (_, i) => {
        const color = MS_COLORS[(i + wi) % MS_COLORS.length];
        const halo = el('circle', 'flow-halo');
        const core = el('circle', 'flow-core');
        halo.setAttribute('r', '10');
        core.setAttribute('r', '3');
        halo.style.fill = color;
        core.style.fill = color;
        pg.append(halo, core);
        return { halo, core, color, offset: i / w.packets };
      });
    });

    let W = 1;
    let rowY = 0;
    let A = 12;
    let nodeX = [];
    const lastPulse = nodes.map(() => 0);

    const measure = () => {
      W = section.offsetWidth || 1;
      svg.setAttribute('viewBox', `0 0 ${W} ${section.offsetHeight}`);
      // Posiciones de maquetación (offset*), que ignoran transformaciones: ni la oscilación
      // ni la animación de entrada desplazan la fila en reposo
      const list = nodes[0].closest('.flow-nodes');
      const items = nodes.map((n) => n.parentElement);
      rowY = list.offsetTop + items[0].offsetTop + items[0].offsetHeight / 2;
      nodeX = items.map((li) => list.offsetLeft + li.offsetLeft + li.offsetWidth / 2);
      A = Math.max(6, Math.min(13, W / 110));
    };

    // Altura de la onda w en el punto x y el instante t (s); sube suavemente hacia la derecha
    const waveY = (w, x, t) => {
      const tilt = -Math.min(44, W * 0.03) * (x / W - 0.5);
      const k = (2 * Math.PI) / (W * w.len);
      return rowY + w.dy + tilt + A * w.amp * (
        Math.sin(k * x - t * w.speed * w.dir * 2.2) +
        0.35 * Math.sin(2 * k * x + t * w.speed * 1.7 + 1.3)
      );
    };

    const pulse = (i, color) => {
      const ring = nodes[i].querySelector('.flow-ring');
      ring.style.setProperty('--pulse', color);
      ring.animate(
        [{ opacity: .9, transform: 'scale(.86)' }, { opacity: 0, transform: 'scale(1.45)' }],
        { duration: 900, easing: EASE_OUT }
      );
    };

    const draw = (t, now) => {
      const span = W + 80;
      for (const w of waves) {
        let d = '';
        for (let x = -24; x <= W + 24; x += 12) {
          d += `${d ? 'L' : 'M'}${x.toFixed(1)} ${waveY(w, x, t).toFixed(1)}`;
        }
        w.glow.setAttribute('d', d);
        w.line.setAttribute('d', d);

        for (const p of w.pk) {
          let u = (p.offset + (t * w.pace * w.dir) / span) % 1;
          if (u < 0) u += 1;
          const x = u * span - 40;
          const y = waveY(w, x, t);
          p.halo.setAttribute('cx', x.toFixed(1));
          p.halo.setAttribute('cy', y.toFixed(1));
          p.core.setAttribute('cx', x.toFixed(1));
          p.core.setAttribute('cy', y.toFixed(1));
          // Cuando un pulso de la onda principal cruza una app, la app «late» con su color
          if (w === waves[0] && now) {
            for (let i = 0; i < nodeX.length; i++) {
              if (Math.abs(x - nodeX[i]) < 7 && now - lastPulse[i] > 700) {
                lastPulse[i] = now;
                pulse(i, p.color);
              }
            }
          }
        }
      }
      nodes.forEach((n, i) => {
        n.style.transform = `translateY(${(waveY(waves[0], nodeX[i], t) - rowY).toFixed(2)}px)`;
      });
    };

    let raf = 0;
    let visible = true;
    const start = performance.now();
    const frame = (now) => {
      draw((now - start) / 1000, now);
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      if (raf || reduceMotion.matches || !visible) return;
      raf = requestAnimationFrame(frame);
    };
    const halt = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    new ResizeObserver(() => {
      measure();
      if (!raf) draw(0, 0);   // con movimiento reducido queda un fotograma quieto
    }).observe(section);

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) run();
      else halt();
    }).observe(section);

    reduceMotion.addEventListener('change', () => {
      halt();
      if (reduceMotion.matches) draw(0, 0);
      else run();
    });

    measure();
    draw(0, 0);
    run();

    // Cada app del bucle abre su tarjeta en el carrusel
    nodes.forEach((n) => n.addEventListener('click', () => {
      const target = document.querySelector('[data-coverflow]');
      if (target) target.dispatchEvent(new CustomEvent('cf:goto', { detail: Number(n.dataset.app) }));
    }));
  }

  /* ---------- Carrusel 3D de Microsoft 365 ---------- */
  const coverflow = document.querySelector('[data-coverflow]');
  if (coverflow) initCoverflow(coverflow);

  function initCoverflow(el) {
    const slides = [...el.querySelectorAll('.cf-slide')];
    const n = slides.length;
    const caption = el.querySelector('.cf-caption span');
    const dots = [...document.querySelectorAll('.cf-dot')];
    const details = [...document.querySelectorAll('.cf-detail')];
    const live = document.createElement('p');
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'polite');
    el.append(live);

    let pos = Number(el.dataset.start) || 0; // posición continua, medida en tarjetas
    let vel = 0;                              // tarjetas por segundo
    let target = pos;
    let raf = 0;
    let cardW = 1;
    let step = 1;                             // px de arrastre para avanzar una tarjeta
    let active = -1;

    const mod = (a, m) => ((a % m) + m) % m;
    // Distancia firmada más corta entre la tarjeta i y la posición p, en un anillo de n tarjetas
    const offsetOf = (i, p) => mod(i - p + n / 2, n) - n / 2;

    slides.forEach((s, i) => {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'diapositiva');
      s.setAttribute('aria-label', `${s.dataset.name}, ${i + 1} de ${n}`);
    });

    const measure = () => {
      cardW = slides[0].offsetWidth || 1;
      step = cardW * 0.8;
    };

    const render = () => {
      for (let i = 0; i < n; i++) {
        const d = offsetOf(i, pos);
        const a = Math.abs(d);
        const s = Math.sign(d);
        const near = Math.min(a, 1);
        const mid = Math.max(0, Math.min(a - 1, 1));
        const far = Math.max(0, a - 2);
        const x = s * cardW * (0.8 * near + 0.5 * mid + 0.3 * far);
        const rotate = -s * (28 * near + 8 * mid);
        const scale = 1 - 0.14 * near - 0.12 * mid - 0.08 * far;
        const opacity = a <= 2.25 ? 1 : Math.max(0, 1 - (a - 2.25) / 0.55);
        const st = slides[i].style;
        st.transform = `translateX(${x.toFixed(2)}px) rotateY(${rotate.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        st.opacity = opacity.toFixed(3);
        st.zIndex = String(100 - Math.round(a * 10));
        st.visibility = opacity < 0.01 ? 'hidden' : 'visible';
        st.setProperty('--depth', (Math.min(a, 2.5) * 0.17).toFixed(3));
      }
      const idx = mod(Math.round(pos), n);
      if (idx !== active) setActive(idx);
    };

    function setActive(idx) {
      const prev = active;
      active = idx;
      caption.textContent = slides[idx].dataset.name;
      slides.forEach((s, i) => s.setAttribute('aria-hidden', String(i !== idx)));
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === idx)));
      details.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      if (prev === -1) return;

      live.textContent = `${slides[idx].dataset.name}, ${idx + 1} de ${n}`;
      if (reduceMotion.matches) return;
      caption.animate(
        [{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }],
        { duration: 260, easing: EASE_OUT }
      );
      // El texto entra desde el lado hacia el que se mueve el carrusel
      const dir = Math.sign(offsetOf(idx, prev)) || 1;
      details[idx].animate(
        [{ opacity: 0, transform: `translateX(${dir * 28}px)` }, { opacity: 1, transform: 'none' }],
        { duration: 460, easing: EASE_OUT }
      );
    }

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // Tras asentarse, se normaliza la posición para que no crezca sin límite
    const settle = () => {
      const shift = pos - mod(pos, n);
      pos -= shift;
      target -= shift;
      render();
    };

    // Muelle con los dos parámetros de Apple: amortiguación y respuesta (s).
    // Parte siempre del valor presente y conserva la velocidad: se puede agarrar en pleno vuelo.
    const animateTo = (to, { velocity = vel, damping = 1, response = 0.42 } = {}) => {
      target = to;
      vel = velocity;
      stop();
      if (reduceMotion.matches) {
        pos = target;
        vel = 0;
        settle();
        return;
      }
      const k = (2 * Math.PI / response) ** 2;
      const c = (4 * Math.PI * damping) / response;
      let last = performance.now();
      const tick = (now) => {
        let dt = Math.min((now - last) / 1000, 1 / 20);
        last = now;
        while (dt > 1e-6) {
          const h = Math.min(1 / 240, dt);
          vel += (-k * (pos - target) - c * vel) * h;
          pos += vel * h;
          dt -= h;
        }
        if (Math.abs(pos - target) < 1e-4 && Math.abs(vel) < 1e-3) {
          pos = target;
          vel = 0;
          raf = 0;
          settle();
          return;
        }
        render();
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const go = (dir) => animateTo(Math.round(target) + dir, { velocity: vel });
    const goTo = (i) => {
      const from = Math.round(target);
      animateTo(from + Math.round(offsetOf(i, from)), { velocity: vel });
    };

    // Proyección de inercia de Apple: dónde acabaría el gesto si siguiera decelerando
    const DECELERATION = 0.997;
    const project = (v) => (v / 1000) * DECELERATION / (1 - DECELERATION);

    /* Arrastre directo: sigue al puntero 1:1 desde donde se agarró */
    let pointer = null;

    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const wasMoving = raf !== 0;
      stop();
      pointer = {
        id: e.pointerId,
        x0: e.clientX,
        y0: e.clientY,
        pos0: pos,
        dragging: false,
        wasMoving,
        slide: e.target.closest('.cf-slide'),
        samples: [{ x: e.clientX, t: e.timeStamp }],
      };
    });

    el.addEventListener('pointermove', (e) => {
      if (!pointer || e.pointerId !== pointer.id) return;
      const dx = e.clientX - pointer.x0;
      const dy = e.clientY - pointer.y0;
      if (!pointer.dragging) {
        // Pequeña histéresis antes de decidir que es un arrastre horizontal
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          const resume = pointer.wasMoving;
          pointer = null;
          if (resume) animateTo(Math.round(target), { velocity: 0 });
          return;
        }
        if (Math.abs(dx) < 8) return;
        pointer.dragging = true;
        pointer.x0 = e.clientX;
        pointer.pos0 = pos;
        el.setPointerCapture(e.pointerId);
        el.classList.add('is-dragging');
      }
      pos = pointer.pos0 - (e.clientX - pointer.x0) / step;
      pointer.samples.push({ x: e.clientX, t: e.timeStamp });
      const cutoff = e.timeStamp - 100;
      while (pointer.samples.length > 2 && pointer.samples[0].t < cutoff) pointer.samples.shift();
      render();
    });

    const release = (e) => {
      if (!pointer || e.pointerId !== pointer.id) return;
      const p = pointer;
      pointer = null;
      el.classList.remove('is-dragging');

      if (p.dragging) {
        const first = p.samples[0];
        const lastSample = p.samples[p.samples.length - 1];
        const dt = (lastSample.t - first.t) / 1000;
        const recent = e.timeStamp - lastSample.t < 80;
        const vx = dt > 0 && recent ? (lastSample.x - first.x) / dt : 0;  // px/s
        const v = -vx / step;                                              // tarjetas/s
        const projected = pos + Math.max(-3, Math.min(3, project(v * step) / step));
        let to = Math.round(projected);
        // La dirección la decide el signo de la velocidad, no la posición
        if (v > 0.6) to = Math.max(to, Math.ceil(pos));
        if (v < -0.6) to = Math.min(to, Math.floor(pos));
        const flick = Math.abs(v) > 0.6;
        animateTo(to, { velocity: v, damping: flick ? 0.84 : 1, response: flick ? 0.46 : 0.4 });
        return;
      }

      // Toque sin arrastre: una tarjeta lateral pasa al centro.
      // Un pointercancel (el navegador se queda el gesto para hacer scroll) no cuenta como toque.
      if (p.slide && e.type === 'pointerup') {
        const i = slides.indexOf(p.slide);
        const from = Math.round(pos);
        const delta = Math.round(offsetOf(i, from));
        if (delta !== 0) {
          animateTo(from + delta, { velocity: 0 });
          return;
        }
      }
      if (p.wasMoving) animateTo(Math.round(pos), { velocity: 0 });
    };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('dragstart', (e) => e.preventDefault());

    // Gesto horizontal de trackpad
    let wheelTimer = 0;
    el.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      stop();
      pos += e.deltaX / step;
      render();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => animateTo(Math.round(pos), { velocity: 0 }), 90);
    }, { passive: false });

    el.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: () => go(1), ArrowLeft: () => go(-1), Home: () => goTo(0), End: () => goTo(n - 1) };
      if (keys[e.key]) {
        e.preventDefault();
        keys[e.key]();
      }
    });

    document.querySelector('[data-cf-prev]').addEventListener('click', () => go(-1));
    document.querySelector('[data-cf-next]').addEventListener('click', () => go(1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
    el.addEventListener('cf:goto', (e) => goTo(e.detail));

    new ResizeObserver(() => {
      measure();
      render();
    }).observe(el);

    measure();
    render();
  }

  /* ---------- Visor de diplomas ---------- */
  const viewer = document.querySelector('[data-viewer]');
  if (viewer) {
    const panel = viewer.querySelector('.viewer-panel');
    const img = viewer.querySelector('.viewer-img');
    const title = viewer.querySelector('#viewer-title');
    const meta = viewer.querySelector('.viewer-meta');
    let opener = null;
    let closing = false;

    const open = (btn) => {
      opener = btn;
      title.textContent = btn.dataset.title;
      meta.textContent = btn.dataset.meta || '';
      img.src = btn.dataset.diploma;
      img.alt = `Diploma: ${btn.dataset.title}`;
      viewer.showModal();
      if (reduceMotion.matches) return;
      // El visor nace del botón que lo abre
      const b = btn.getBoundingClientRect();
      const p = panel.getBoundingClientRect();
      panel.style.transformOrigin = `${b.left + b.width / 2 - p.left}px ${b.top + b.height / 2 - p.top}px`;
      panel.animate(
        [{ opacity: 0, transform: 'scale(.55)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
        { duration: 520, easing: EASE_OUT }
      );
    };

    const close = () => {
      if (!viewer.open || closing) return;
      if (reduceMotion.matches) {
        viewer.close();
        return;
      }
      closing = true;
      // Vuelve por el mismo camino, con la curva reflejada
      const anim = panel.animate(
        [{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'scale(.55)', filter: 'blur(10px)' }],
        { duration: 300, easing: EASE_OUT_MIRROR }
      );
      anim.onfinish = () => {
        closing = false;
        viewer.close();
      };
    };

    document.querySelectorAll('[data-diploma]').forEach((btn) => btn.addEventListener('click', () => open(btn)));
    viewer.querySelector('[data-viewer-close]').addEventListener('click', close);
    viewer.addEventListener('cancel', (e) => {
      e.preventDefault();
      close();
    });
    viewer.addEventListener('click', (e) => {
      if (e.target === viewer) close();
    });
    viewer.addEventListener('close', () => {
      if (opener) opener.focus();
    });
  }

  /* ---------- Copiar enlace ---------- */
  const toast = document.querySelector('[data-toast]');
  let toastTimer = 0;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        showToast('Enlace de LinkedIn copiado');
      } catch (e) {
        window.open(btn.dataset.copy, '_blank', 'noopener');
      }
    });
  });

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
})();
