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
    savedTheme = localStorage.getItem("portfolio-theme");
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
  applyTheme(savedTheme || (systemTheme?.matches ? "dark" : "light"));
  themeButton?.addEventListener("click", () => {
    savedTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(savedTheme);
    try {
      localStorage.setItem("portfolio-theme", savedTheme);
    } catch {
      /* Keep the in-session choice. */
    }
  });
  systemTheme?.addEventListener?.("change", (event) => {
    if (!savedTheme) applyTheme(event.matches ? "dark" : "light");
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

  const tabs = $$(".lab-tab[data-lab]");
  const selectTab = (tab, moveFocus = false) => {
    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(
        candidate.getAttribute("aria-controls") ||
          `lab-${candidate.dataset.lab}`,
      );
      if (panel) panel.hidden = !selected;
    });
    if (moveFocus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight" || event.key === "ArrowDown")
        next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
        next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[next], true);
    });
  });
  if (tabs.length)
    selectTab(
      tabs.find((tab) => tab.getAttribute("aria-selected") === "true") ||
        tabs[0],
    );

  // Local keyword search only; it does not call a model or a remote service.
  const knowledge = [
    {
      title: "Hearth — a local-first AI assistant",
      category: "Project",
      href: "#projects",
      keywords:
        "hearth local offline ollama llm llms model models assistant react typescript streaming rest chat profiles conversation history context",
      excerpt:
        "Ollama, React and TypeScript. Streamed responses, searchable history, editing, regeneration and per-chat context.",
    },
    {
      title: "AI Coding Assistant & Document Analysis",
      category: "Project",
      href: "#projects",
      keywords:
        "ai coding code assistant deepseek r1 1.5b rag retrieval augmented generation documents pdf question answering debugging completion llm llms model models",
      excerpt:
        "DeepSeek R1 1.5B for code completion and debugging, with RAG document question answering.",
    },
    {
      title: "Signify AI — hand-sign recognition",
      category: "Project",
      href: "#projects",
      keywords:
        "signify vision computer sign language hand recognition mediapipe neural networks images sih hackathon 2024 team",
      excerpt:
        "MediaPipe hand landmarks and dense neural networks. A six-person SIH 2024 project using 57,600 images.",
    },
    {
      title: "Skills & tools",
      category: "Skills",
      href: "#skills",
      keywords:
        "skills tools stack python sql machine learning ai artificial intelligence genai generative deep learning data science analysis visualization react typescript ollama deepseek mediapipe",
      excerpt:
        "Explore skills across generative AI, machine learning, data science and application development.",
    },
    {
      title: "Master of Artificial Intelligence at RMIT",
      category: "Education",
      href: "#education",
      keywords:
        "education university rmit melbourne australia master masters ai artificial intelligence study studying postgraduate graduation 2027",
      excerpt:
        "Master of Artificial Intelligence at RMIT University, with completion expected in December 2027.",
    },
    {
      title: "Computer Science degree — Data Science",
      category: "Education",
      href: "#education",
      keywords:
        "education degree bachelor bachelors engineering btech beng computer science data cgpa 9.23 june 2025 undergraduate",
      excerpt:
        "Bachelor of Engineering in Computer Science, specialising in Data Science. Completed June 2025 with a 9.23 CGPA.",
    },
    {
      title: "Software Development Intern at ADVI Group of Companies",
      category: "Experience",
      href: "#experience",
      keywords:
        "experience internship intern work software development advi group companies genai generative ai december 2024 june 2025 career",
      excerpt:
        "Software Development Intern at ADVI Group of Companies, December 2024 to June 2025, working on generative AI and applied machine learning.",
    },
    {
      title: "Phone Repair Technician at Supreme Fone Fix",
      category: "Experience",
      href: "#experience",
      keywords:
        "experience current now job work phone repair technician supreme fone fix supremefonefix february 2026 troubleshooting technical customer",
      excerpt:
        "Phone Repair Technician at Supreme Fone Fix, from February 2026. Hardware and software diagnosis, customer technical support and daily kiosk operations.",
    },
    {
      title: "Winning the Space Race",
      category: "Project",
      href: "#projects",
      keywords:
        "space spacex launch race prediction classification historical data science analysis",
      excerpt:
        "Historical launch data analysis and classification for launch outcome prediction.",
    },
    {
      title: "Weather Forecasting",
      category: "Project",
      href: "#projects",
      keywords:
        "weather forecast forecasting regression decision tree gradient boosting regressor feature engineering kaggle",
      excerpt:
        "Decision tree and gradient boosting regression, with feature engineering and data plots.",
    },
    {
      title: "Contact & profiles",
      category: "Contact",
      href: "#contact",
      keywords:
        "contact email hire hiring available collaborate collaboration github linkedin shahnawaz aadil",
      excerpt: `Get in touch at ${email}, or explore the professional profile links.`,
    },
  ];
  const resumeLink = $("[data-resume]");
  if (resumeLink?.getAttribute("href"))
    knowledge.push({
      title: "Download resume (.pdf)",
      category: "Resume",
      href: resumeLink.getAttribute("href"),
      download: true,
      keywords: "resume cv download pdf qualifications background",
      excerpt: "Download Shahnawaz Aadil’s current resume as a PDF.",
    });
  const searchDialog = $("#search-dialog");
  const searchInput = $("#portfolio-search");
  const results = $("#search-results");
  const stopWords = new Set(
    "a an and are as at be by can do does for from has have how i in is it me my of on or please tell that the their there these this to was were what when where which who will with would you your about show used uses using".split(
      " ",
    ),
  );
  const normalize = (text) =>
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9.]+/g, " ")
      .trim();
  const renderSearch = () => {
    if (!searchInput || !results) return;
    const query = normalize(searchInput.value);
    const tokens = [
      ...new Set(
        query.split(/\s+/).filter((token) => token && !stopWords.has(token)),
      ),
    ];
    let matches;
    if (!query) matches = knowledge.slice(0, 4);
    else if (!tokens.length) matches = [];
    else
      matches = knowledge
        .map((entry, index) => {
          const text = normalize(
            `${entry.title} ${entry.keywords} ${entry.excerpt}`,
          );
          const title = normalize(entry.title);
          const hits = tokens.filter((token) => text.includes(token));
          return {
            entry,
            index,
            score:
              hits.length * 4 +
              hits.filter((token) => title.includes(token)).length * 3 +
              (text.includes(query) ? 5 : 0),
          };
        })
        .filter((match) => match.score > 0)
        .sort((a, b) => b.score - a.score || a.index - b.index)
        .slice(0, 6)
        .map((match) => match.entry);
    results.replaceChildren();
    matches.forEach((entry) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.className = "search-result";
      link.href = entry.href;
      if (entry.download) link.setAttribute("download", "");
      const category = document.createElement("span");
      category.className = "search-result-category";
      category.textContent = entry.category;
      const title = document.createElement("strong");
      title.className = "search-result-title";
      title.textContent = entry.title;
      const excerpt = document.createElement("span");
      excerpt.className = "search-result-description";
      excerpt.textContent = entry.excerpt;
      link.append(category, title, excerpt);
      link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        if (entry.href === "#projects") filterProjects("all");
        if (entry.href.startsWith("#") && searchDialog) {
          const destination = document.getElementById(entry.href.slice(1));
          if (destination) {
            event.preventDefault();
            destinations.set(searchDialog, destination);
            if (location.hash !== entry.href)
              history.pushState(null, "", entry.href);
            setActiveLink(destination.id);
          }
        }
        searchDialog?.close();
      });
      item.append(link);
      results.append(item);
    });
    if (!matches.length) {
      const item = document.createElement("li");
      item.className = "search-empty";
      item.textContent =
        "No matching portfolio entries. Try “Ollama”, “RAG”, “Python” or “education”.";
      results.append(item);
    }
    setText(
      "#search-status",
      query
        ? `${matches.length} ${matches.length === 1 ? "result" : "results"} for “${searchInput.value.trim()}”.`
        : "Explore these portfolio highlights, or enter a keyword.",
    );
  };
  const openSearch = (opener) => {
    if (openDialog(searchDialog, opener)) {
      renderSearch();
      searchInput?.focus();
      searchInput?.select();
    }
  };
  $$("[data-open-search]").forEach((button) =>
    button.addEventListener("click", () => openSearch(button)),
  );
  searchInput?.addEventListener("input", renderSearch);
  $$("[data-query]").forEach((button) =>
    button.addEventListener("click", () => {
      if (!searchInput) return;
      searchInput.value = button.dataset.query;
      renderSearch();
      searchInput.focus();
    }),
  );
  document.addEventListener("keydown", (event) => {
    if (
      (event.metaKey || event.ctrlKey) &&
      event.key.toLowerCase() === "k" &&
      !event.altKey &&
      !$("dialog[open]")
    ) {
      event.preventDefault();
      openSearch(document.activeElement);
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
