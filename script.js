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

  // Storage is optional, including in private or restricted browsing contexts.
  const themeButton = $("#theme-toggle");
  const systemTheme = window.matchMedia?.("(prefers-color-scheme: dark)");
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("portfolio-theme-v2");
  } catch {
    /* Optional preference. */
  }
  if (!["light", "dark"].includes(savedTheme)) savedTheme = null;
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    const label = `Switch to ${theme === "dark" ? "light" : "dark"} theme`;
    themeButton?.setAttribute("aria-label", label);
    themeButton?.setAttribute("title", label);
    themeButton?.setAttribute("aria-pressed", String(theme === "dark"));
  };
  applyTheme(savedTheme || "dark");
  themeButton?.addEventListener("click", () => {
    savedTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(savedTheme);
    try {
      localStorage.setItem("portfolio-theme-v2", savedTheme);
    } catch {
      /* Keep the in-session choice. */
    }
  });


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

  const cards = $$(".project-card[data-category]");
  const filters = $$(".filter-button[data-filter]");
  const filterProjects = (filter) => {
    let shown = 0;
    cards.forEach((card) => {
      const visible =
        filter === "all" ||
        card.dataset.category.split(/[\s,]+/).includes(filter);
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    filters.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === filter),
      ),
    );
    setText(
      "#project-count",
      `${shown} ${shown === 1 ? "project" : "projects"} shown`,
    );
  };
  filters.forEach((button) =>
    button.addEventListener("click", () =>
      filterProjects(button.dataset.filter),
    ),
  );
  if (cards.length) filterProjects("all");

  const projects = {
    hearth: {
      category: "Local AI · Personal project",
      title: "Hearth",
      description:
        "A local-first AI assistant built around Ollama, with a React and TypeScript interface and streamed REST responses.",
      stack: ["Ollama", "React", "TypeScript", "REST APIs", "Local AI"],
      details: [
        "Searchable conversation history with message editing and response regeneration.",
        "Switchable assistant profiles and context managed separately for each conversation.",
        "Offline controls designed around a local model workflow.",
      ],
      note: "The source code for Hearth is not currently published.",
    },
    coding: {
      category: "Generative AI · RAG",
      title: "AI Coding Assistant & Document Analysis",
      description:
        "An AI assistant using DeepSeek R1 1.5B for coding support, paired with retrieval-augmented question answering over documents.",
      stack: ["Python", "DeepSeek R1 1.5B", "RAG", "Document Q&A"],
      details: [
        "Supports code completion and debugging with a language model.",
        "Retrieves document context to support questions and answers.",
        "Brings coding assistance and document analysis into one project.",
      ],
      source:
        "https://github.com/shahnawazaadil7/End-to-End-AI-Coding-Assistant-Document-Analysis-System",
    },
    signify: {
      category: "Computer vision · SIH 2024",
      title: "Signify AI",
      description:
        "An interactive hand-sign recognition project using MediaPipe hand landmarks and dense neural networks, developed with a six-person team for Smart India Hackathon 2024.",
      stack: ["Python", "MediaPipe", "Neural Networks", "Computer Vision"],
      details: [
        "Uses hand landmarks as input for a dense neural network.",
        "Worked with a dataset of 57,600 images.",
        "Developed as part of a six-person Smart India Hackathon 2024 team.",
      ],
      source:
        "https://github.com/shahnawazaadil7/Signify-AI-Interactive-Hand-Sign-Recognition-Model",
    },
    space: {
      category: "Data science · Classification",
      title: "Winning the Space Race",
      description:
        "An exploration of historical SpaceX launch data, using data analysis and classification to investigate launch outcomes.",
      stack: ["Python", "Data Analysis", "Classification", "Visualization"],
      details: [
        "Explores historical launch records and the factors associated with outcomes.",
        "Applies classification methods to launch outcome prediction.",
        "Uses visual analysis to communicate findings from the data.",
      ],
      source:
        "https://github.com/shahnawazaadil7/Winning-Space-Race-with-Data-Science-Space-X-competitor",
    },
    weather: {
      category: "Machine learning · Regression",
      title: "Weather Forecasting",
      description:
        "A weather prediction notebook exploring decision tree and gradient boosting regression, supported by feature engineering and visual analysis.",
      stack: [
        "Python",
        "DecisionTreeRegressor",
        "GradientBoostingRegressor",
        "Feature Engineering",
      ],
      details: [
        "Explores weather data and prepares features for regression.",
        "Uses decision tree and gradient boosting regressors.",
        "Includes plots to inspect data and model predictions.",
      ],
      source:
        "https://www.kaggle.com/code/mohdshahnawazaadil/weather-forecasting-with-dtr-and-gbr",
    },
  };

  // Native dialogs contain focus. Search navigation focuses the selected section.
  const openers = new WeakMap();
  const destinations = new WeakMap();
  const openDialog = (dialog, opener) => {
    if (
      !dialog ||
      dialog.open ||
      typeof dialog.showModal !== "function" ||
      $("dialog[open]")
    )
      return false;
    destinations.delete(dialog);
    openers.set(dialog, opener || document.activeElement);
    dialog.showModal();
    closeMenu();
    return true;
  };
  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      const box = dialog.getBoundingClientRect();
      const outside =
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom;
      if (
        event.target.closest("[data-close-dialog]") ||
        (event.target === dialog && outside)
      )
        dialog.close();
    });
    dialog.addEventListener("close", () => {
      const destination = destinations.get(dialog);
      const opener = openers.get(dialog);
      destinations.delete(dialog);
      openers.delete(dialog);
      if (destination?.isConnected) {
        const hadTabIndex = destination.hasAttribute("tabindex");
        if (!hadTabIndex) {
          destination.setAttribute("tabindex", "-1");
          destination.addEventListener(
            "blur",
            () => destination.removeAttribute("tabindex"),
            { once: true },
          );
        }
        destination.scrollIntoView({
          behavior: reducedMotion() ? "auto" : "smooth",
          block: "start",
        });
        destination.focus({ preventScroll: true });
        return;
      }
      if (opener?.isConnected && !opener.closest("[hidden]"))
        opener.focus({ preventScroll: true });
    });
  });
  const projectDialog = $("#project-dialog");
  $$("[data-project]").forEach((button) =>
    button.addEventListener("click", () => {
      const project = projects[button.dataset.project];
      if (!project || !projectDialog) return;
      setText("#dialog-category", project.category);
      setText("#dialog-title", project.title);
      setText("#dialog-description", project.description);
      const stack = $("#dialog-stack");
      if (stack)
        stack.replaceChildren(
          ...project.stack.map((name) => {
            const tag = document.createElement("span");
            tag.className = "tag";
            tag.textContent = name;
            return tag;
          }),
        );
      const details = $("#dialog-details");
      if (details)
        details.replaceChildren(
          ...project.details.map((text) => {
            const item = document.createElement("li");
            item.textContent = text;
            return item;
          }),
        );
      const source = $("#dialog-source");
      if (source) {
        source.hidden = !project.source;
        if (project.source) source.href = project.source;
        else source.removeAttribute("href");
      }
      const note = $("#dialog-note");
      if (note) {
        note.textContent = project.note || "";
        note.hidden = !project.note;
      }
      openDialog(projectDialog, button);
    }),
  );

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

  const role = document.getElementById('typed-role');
  const toggle = document.getElementById('animation-toggle');
  const prefix = document.querySelector('.role-prefix');
  const roles = ['AI Engineer', 'Machine Learning Engineer', 'NLP Engineer', 'Data Scientist'];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let position = roles[0].length;
  let deleting = true;
  let paused = false;
  let timer;

  const tick = () => {
    if (!role || paused || motion.matches || document.hidden) return;
    const title = roles[index];
    position += deleting ? -1 : 1;
    role.textContent = title.slice(0, position);
    if (position === 0 && deleting) {
      index = (index + 1) % roles.length;
      deleting = false;
      if (prefix) prefix.textContent = roles[index].startsWith('AI') || roles[index].startsWith('NLP') ? "I'm an" : "I'm a";
      timer = setTimeout(tick, 250);
    } else if (position === title.length && !deleting) {
      deleting = true;
      timer = setTimeout(tick, 1800);
    } else {
      timer = setTimeout(tick, deleting ? 42 : 80);
    }
  };
  const restart = () => {
    clearTimeout(timer);
    if (toggle) toggle.hidden = motion.matches;
    if (!motion.matches && !paused && !document.hidden && role) timer = setTimeout(tick, 1800);
  };
  toggle?.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Resume role animation' : 'Pause role animation');
    toggle.title = paused ? 'Resume role animation' : 'Pause role animation';
    toggle.textContent = paused ? '▶' : 'Ⅱ';
    restart();
  });
  motion.addEventListener('change', () => {
    if (motion.matches && role) {
      index = 0;
      position = roles[0].length;
      deleting = true;
      role.textContent = roles[0];
      if (prefix) prefix.textContent = "I'm an";
    }
    restart();
  });
  document.addEventListener('visibilitychange', restart);
  restart();


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
  if (sections.length) setActiveLink(location.hash.slice(1) || sections[0].id);
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
  const cacheKey = 'portfolio-public-repos-v1';
  const maxAge = 30 * 60 * 1000;
  const fields = repository => ({
    name: String(repository.name || 'Repository'),
    description: String(repository.description || 'Explore the source code and project details on GitHub.').slice(0, 190),
    language: String(repository.language || 'Repository'),
    stars: Number(repository.stargazers_count) || 0,
    url: `https://github.com/${username}/${encodeURIComponent(repository.name)}`,
  });
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
      title.textContent = item.name;
      const description = document.createElement('p');
      description.textContent = item.description;
      const meta = document.createElement('div');
      meta.className = 'repo-meta';
      const language = document.createElement('span');
      language.textContent = item.language;
      const stars = document.createElement('span');
      stars.textContent = `☆ ${item.stars}`;
      stars.setAttribute('aria-label', `${item.stars} GitHub stars`);
      meta.append(language, stars);
      card.append(top, title, description, meta);
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
        name: repo.name, description: repo.description, language: repo.language, stargazers_count: repo.stargazers_count,
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
