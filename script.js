/* Dependency-free enhancements; the portfolio remains readable without JavaScript. */
(() => {
  "use strict";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));
  const email = "shahnawazaadil7@gmail.com";
  const setText = (selector, value) => {
    const node = $(selector);
    if (node) node.textContent = value;
  };
  const reducedMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.dataset.theme = "dark";

  const menuButton = $("#menu-toggle");
  const navigation = $("#primary-nav");
  const closeMenu = () => {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation?.classList.remove("is-open");
  };
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    navigation?.classList.toggle("is-open", open);
  });
  navigation?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (
      !navigation?.contains(event.target) &&
      !menuButton?.contains(event.target)
    )
      closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton?.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menuButton.focus();
    }
  });

  const copyButton = $("#copy-email");
  copyButton?.addEventListener("click", async () => {
    const status = $("#copy-status");
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(email);
      copyButton.setAttribute("aria-label", "Email address copied");
      const label = Array.from(copyButton.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
      );
      if (label) label.textContent = "Copied ";
      if (status) status.textContent = "Email address copied.";
    } catch {
      if (status) {
        status.textContent = "Select and copy this email address: ";
        const fallback = document.createElement("input");
        fallback.type = "text";
        fallback.readOnly = true;
        fallback.value = email;
        fallback.className = "email-copy-fallback";
        fallback.setAttribute("aria-label", "Email address to copy");
        status.append(fallback);
        fallback.focus();
        fallback.select();
      }
    }
  });

  // Keep the native Formspree action as the fallback when JavaScript is unavailable.
  const form = $("#contact-form");
  if (form && typeof window.fetch === "function")
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.dataset.sending === "true") return;
      const submit = $('[type="submit"]', form);
      const status = $("#form-status");
      const originalLabel =
        submit?.tagName === "INPUT" ? submit.value : submit?.textContent;
      const originalChildren =
        submit?.tagName === "INPUT"
          ? null
          : submit && Array.from(submit.childNodes);
      const setLabel = (label) => {
        if (submit) {
          if (submit.tagName === "INPUT") submit.value = label;
          else submit.textContent = label;
        }
      };
      form.dataset.sending = "true";
      form.setAttribute("aria-busy", "true");
      if (submit) submit.disabled = true;
      setLabel("Sending…");
      if (status) status.textContent = "Sending your message…";
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Message was not accepted");
        form.reset();
        if (status) status.textContent = "Thanks — your message has been sent.";
      } catch {
        if (status) {
          status.textContent =
            "Your message could not be sent. Please try again or ";
          const fallback = document.createElement("a");
          fallback.href = `mailto:${email}`;
          fallback.textContent = "email me directly";
          status.append(fallback, ".");
        }
      } finally {
        delete form.dataset.sending;
        form.removeAttribute("aria-busy");
        if (submit) submit.disabled = false;
        if (submit && originalChildren)
          submit.replaceChildren(...originalChildren);
        else setLabel(originalLabel || "Send message");
      }
    });

  // Align character updates with paint; let the completed role rest before rewriting.
  const role = document.getElementById('typed-role');
  const prefix = document.querySelector('.role-prefix');
  const roles = ['AI Engineer', 'Machine Learning Engineer', 'NLP Engineer', 'Data Scientist'];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let roleIndex = 0;
  let character = roles[0].length;
  let phase = 'hold';
  let typingTimer = 0;
  let typingFrame = 0;

  const stopTyping = () => {
    clearTimeout(typingTimer);
    cancelAnimationFrame(typingFrame);
    typingTimer = 0;
    typingFrame = 0;
  };
  const updatePrefix = () => {
    if (prefix) prefix.textContent = /^(AI|NLP)/.test(roles[roleIndex]) ? "I'm an" : "I'm a";
  };
  const showCompleteRole = () => {
    character = roles[roleIndex].length;
    phase = 'hold';
    if (role) role.textContent = roles[roleIndex];
    updatePrefix();
  };
  const scheduleTyping = delay => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      typingTimer = 0;
      typingFrame = requestAnimationFrame(typeFrame);
    }, delay);
  };
  function typeFrame() {
    typingFrame = 0;
    if (!role || motion.matches || document.hidden) return;
    if (phase === 'hold') phase = 'erase';
    if (phase === 'erase') {
      character = Math.max(0, character - 1);
      role.textContent = roles[roleIndex].slice(0, character);
      if (character === 0) {
        roleIndex = (roleIndex + 1) % roles.length;
        updatePrefix();
        phase = 'type';
        scheduleTyping(180);
      } else scheduleTyping(28);
      return;
    }
    character = Math.min(roles[roleIndex].length, character + 1);
    role.textContent = roles[roleIndex].slice(0, character);
    if (character === roles[roleIndex].length) {
      phase = 'hold';
      scheduleTyping(2500);
    } else scheduleTyping(58);
  }
  const resumeTyping = () => {
    stopTyping();
    if (motion.matches) { showCompleteRole(); return; }
    if (role && !document.hidden) scheduleTyping(phase === 'hold' ? 2500 : 80);
  };
  motion.addEventListener('change', resumeTyping);
  document.addEventListener('visibilitychange', resumeTyping);
  window.addEventListener('pagehide', stopTyping);
  window.addEventListener('pageshow', resumeTyping);
  resumeTyping();

  setText("#year", String(new Date().getFullYear()));
  const navLinks = $$('.nav-link[href^="#"]');
  const setActiveLink = (id) =>
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${id}`)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  const sections = navLinks
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);
  if (sections.length) setActiveLink(location.hash.slice(1) || "home");
  if ("IntersectionObserver" in window) {
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        const closest = [...visible].sort(
          (a, b) =>
            Math.abs(a.getBoundingClientRect().top - 140) -
            Math.abs(b.getBoundingClientRect().top - 140),
        )[0];
        if (closest) setActiveLink(closest.id);
        else if (window.scrollY < 250) setActiveLink("home");
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
  }
  window.addEventListener("hashchange", () => {
    if (location.hash) setActiveLink(location.hash.slice(1));
  });
  const backToTop = $("#back-to-top");
  if (backToTop) {
    const update = () => {
      backToTop.hidden = window.scrollY <= 700;
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: reducedMotion() ? "auto" : "smooth",
      });
    });
  }
})();

// Recent public work, refreshed when the repository section comes into view.
(() => {
  const grid = document.getElementById('repo-grid');
  const status = document.getElementById('repo-status');
  if (!grid) return;
  const username = 'shahnawazaadil7';
  const cacheKey = 'portfolio-public-repos-v2';
  const maxAge = 30 * 60 * 1000;
  const repositoryContext = {
  "shahnawazaadil7.github.io": {
    "title": "Portfolio website",
    "description": "Source code for this personal portfolio, including the resume viewer and project cards."
  },
  "shahnawazaadil7": {
    "title": "GitHub profile",
    "description": "Developer profile, skills, and an overview of my projects."
  },
  "datasets": {
    "title": "Datasets",
    "description": "Shared datasets collected for analysis and experimentation."
  },
  "ADVI": {
    "title": "ADVI notebooks",
    "description": "Jupyter notebooks and development experiments."
  },
  "Signify-AI-Interactive-Hand-Sign-Recognition-Model": {
    "title": "Signify AI",
    "description": "Indian Sign Language recognition using MediaPipe hand landmarks and neural networks."
  },
  "Generating-Synthetic-Images-using-CNN-RNN": {
    "title": "Text-to-image generation",
    "description": "A text-to-image prototype using CNNs, BiLSTM layers, and a Tkinter interface."
  },
  "End-to-End-AI-Coding-Assistant-Document-Analysis-System": {
    "title": "AI Coding & Document Assistant",
    "description": "DeepSeek-powered coding assistance and retrieval-augmented document Q&A."
  }
};
  const fields = repository => {
    const name = String(repository.name || 'Repository');
    const context = repositoryContext[name];
    const topics = Array.isArray(repository.topics) ? repository.topics.slice(0, 3).join(' · ') : '';
    return {
      name,
      title: context?.title || name.replace(/[-_]+/g, ' '),
      description: String(context?.description || repository.description || topics || (repository.language ? `${repository.language} source code.` : 'Public project source and documentation.')).slice(0, 190),
      language: String(repository.language || ''),
      stars: Number(repository.stargazers_count) || 0,
      url: `https://github.com/${username}/${encodeURIComponent(name)}`,
    };
  };
  const render = repositories => {
    const cards = repositories.slice(0, 6).map(repository => {
      const item = fields(repository);
      const card = document.createElement('a');
      card.className = 'repo-card';
      card.href = item.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      const top = document.createElement('div');
      top.className = 'repo-top';
      const icon = document.createElement('span');
      icon.className = 'repo-symbol';
      icon.textContent = '⌘';
      icon.setAttribute('aria-hidden', 'true');
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      top.append(icon, arrow);
      const title = document.createElement('h3');
      title.textContent = item.title;
      title.title = item.name;
      const description = document.createElement('p');
      description.textContent = item.description;
      const meta = document.createElement('div');
      meta.className = 'repo-meta';
      const language = document.createElement('span');
      language.textContent = item.language;
      const stars = document.createElement('span');
      stars.textContent = `☆ ${item.stars}`;
      stars.setAttribute('aria-label', `${item.stars} GitHub stars`);
      if (item.language) meta.append(language);
      if (item.stars > 0) meta.append(stars);
      card.append(top, title);
      if (item.description) card.append(description);
      if (meta.childElementCount) card.append(meta);
      return card;
    });
    if (cards.length) grid.replaceChildren(...cards);
  };
  const load = async () => {
    let cached;
    try { cached = JSON.parse(localStorage.getItem(cacheKey) || 'null'); } catch {}
    if (Array.isArray(cached?.repos) && cached.repos.length) {
      render(cached.repos);
      if (status) status.textContent = 'Recently cached from GitHub';
      if (Date.now() - cached.savedAt < maxAge) return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=30&type=owner`, {
        signal: controller.signal,
        headers: { Accept: 'application/vnd.github+json' },
        credentials: 'omit',
      });
      if (!response.ok) throw new Error('GitHub unavailable');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected GitHub response');
      const repos = data.filter(repo => !repo.fork && !repo.archived && !repo.private && typeof repo.name === 'string').slice(0, 6).map(repo => ({
        name: repo.name, description: repo.description, language: repo.language, stargazers_count: repo.stargazers_count, topics: repo.topics,
      }));
      if (!repos.length) throw new Error('No repositories returned');
      render(repos);
      if (status) status.textContent = 'Updated from GitHub';
      try { localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), repos })); } catch {}
    } catch {
      if (status) status.textContent = cached?.repos?.length ? 'Showing cached repositories' : 'Showing saved repositories';
    } finally { clearTimeout(timeout); }
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); load(); }
    }, { rootMargin: '200px' });
    observer.observe(grid);
  } else { load(); }
})();

// Native modal with an embedded PDF; phones use a scrollable page preview.
(() => {
  const dialog = document.getElementById('resume-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const close = document.getElementById('resume-close');
  const frame = document.getElementById('resume-native-pdf');
  const preview = document.getElementById('resume-preview-image');
  const page = document.getElementById('resume-page');
  const scroll = document.getElementById('resume-mobile-scroll');
  const zoomLevel = document.getElementById('resume-zoom-level');
  const zoomIn = document.getElementById('resume-zoom-in');
  const zoomOut = document.getElementById('resume-zoom-out');
  const mobile = window.matchMedia('(max-width: 700px)');
  let opener;
  let zoom = 100;
  const applyZoom = value => {
    zoom = Math.max(100, Math.min(250, value));
    if (page) page.style.setProperty('--resume-width', `${zoom}%`);
    if (zoomLevel) zoomLevel.textContent = `${zoom}%`;
    if (zoomOut) zoomOut.disabled = zoom <= 100;
    if (zoomIn) zoomIn.disabled = zoom >= 250;
  };
  const loadViewer = () => {
    if (mobile.matches) {
      if (preview && !preview.getAttribute('src')) preview.src = preview.dataset.src;
    } else if (frame && !frame.getAttribute('src')) {
      frame.src = frame.dataset.src;
    }
  };
  document.querySelectorAll('[data-open-resume]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      if (dialog.open) return;
      opener = link;
      applyZoom(100);
      loadViewer();
      document.getElementById('primary-nav')?.classList.remove('is-open');
      document.getElementById('menu-toggle')?.setAttribute('aria-expanded', 'false');
      dialog.showModal();
      document.body.classList.add('resume-open');
      if (scroll) { scroll.scrollTop = 0; scroll.scrollLeft = 0; }
      close?.focus({ preventScroll: true });
    });
  });
  const resumeMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let dismissing = false;
  const dismissResume = () => {
    if (!dialog.open || dismissing) return;
    if (resumeMotion.matches || typeof dialog.animate !== 'function') { dialog.close(); return; }
    dismissing = true;
    const animation = dialog.animate([
      { opacity: 1, transform: 'translateY(0) scale(1)' },
      { opacity: 0, transform: 'translateY(8px) scale(.99)' },
    ], { duration: 160, easing: 'cubic-bezier(.4, 0, 1, 1)' });
    animation.finished.catch(() => {}).finally(() => {
      if (dialog.open) dialog.close();
      animation.cancel();
      dismissing = false;
    });
  };
  close?.addEventListener('click', dismissResume);
  dialog.addEventListener('cancel', event => { event.preventDefault(); dismissResume(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dismissResume();
  });
  dialog.addEventListener('close', () => {
    dismissing = false;
    document.body.classList.remove('resume-open');
    opener?.focus({ preventScroll: true });
  });
  zoomIn?.addEventListener('click', () => applyZoom(zoom + 25));
  zoomOut?.addEventListener('click', () => applyZoom(zoom - 25));
  document.getElementById('resume-fit')?.addEventListener('click', () => {
    applyZoom(100);
    if (scroll) scroll.scrollLeft = 0;
  });
  mobile.addEventListener('change', () => { if (dialog.open) loadViewer(); });
})();
