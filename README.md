# Shahnawaz Aadil · Portfolio

An accessible, responsive portfolio for AI, data science, and software development. Built with HTML, CSS, and plain JavaScript; no dependencies or build step. Compatible with the existing GitHub Pages repository.

## Preview locally

From this directory, run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Stop the server with Ctrl+C.

## Features

- Five filterable projects with details and verified public source links.
- Interactive, keyboard-accessible local AI, RAG, and computer vision explainers.
- Local portfolio search (button or Command/Ctrl+K). This is keyword search; no model calls, API keys, or user queries sent to a server.
- Light and dark themes that follow the system preference until a visitor chooses one.
- Current resume, experience, education, and professional profiles.
- Formspree contact form with native validation, delivery feedback, and direct email fallback.
- Self-hosted fonts and skill logos, reduced-motion support, mobile navigation, print styles, and social metadata.

## Update content

- `index.html`: visible copy, cards, skills, timeline, profile links, and contact form.
- `script.js`: project detail and search data, plus interactions. Keep project/search descriptions aligned with the HTML.
- `style.css`: themes, layouts, and responsive styling.
- `assets/documents/shahnawaz-aadil-resume.pdf`: resume download; replace with the latest PDF using the same filename.
- `assets/fonts/` and `assets/icons/`: local assets, licenses, and source credits.

Hearth's source is not public yet; its details intentionally show no source button. Add its verified repository to `projects.hearth.source` in `script.js` when published.

The form keeps the original Formspree endpoint, `https://formspree.io/f/xrbgajko`. Its delivery depends on that account remaining active and configured. Verify a real submission from the live domain after deployment.

## Publish

Publish the repository root with the repository's existing GitHub Pages configuration. No generated directory or package installation is required. Keep the PDF and `assets` directory with the HTML, CSS, and JavaScript. If the domain changes, update the canonical and Open Graph URLs in `index.html`, `robots.txt`, and `sitemap.xml`.

## Credits

Original portfolio adapted from Chetan Nadda's template; redesigned around current projects and resume content. Brand icon sources and font licenses are included beside the assets. Brand names and logos belong to their respective owners.
