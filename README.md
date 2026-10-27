# Shahnawaz Aadil · Personal portfolio

A personal portfolio with a black default theme, a single blue accent, and optional light mode. Plain HTML, CSS, and JavaScript; no build step or dependencies.

## Content and features

- Personal introduction and portrait, with rotating AI Engineer, Machine Learning Engineer, NLP Engineer, and Data Scientist text. Animation supports pause and reduced-motion preferences.
- Five filterable projects with illustrated cards, project details, and verified public source links.
- Grouped skill categories and local technology logos.
- About, education, certifications, and community leadership. No employment section.
- Six recent public GitHub repositories, refreshed from the public GitHub API as the section approaches the viewport. Forks and archived repositories are excluded. Data is cached locally for 30 minutes. A saved snapshot remains visible if the API is unavailable or rate limited.
- A curated LinkedIn profile overview linked to the real profile. It does not scrape LinkedIn, fetch posts, display a feed, or claim to sync live profile data.
- Original Formspree contact endpoint, copy-email button, direct email, and profile links.

## Preview and deployment

Open `index.html`, or run `python3 -m http.server 4173 --bind 127.0.0.1` and visit http://127.0.0.1:4173. Publish the repository root using the existing GitHub Pages configuration. No build required.

## Updating content

- `index.html`: visible content, project cards, education, profile overview, and contact form.
- `style.css`: visual design, themes, and responsive layouts.
- `script.js`: role animation, theme preference, project details and filters, contact form, and GitHub feed.
- `assets/documents/shahnawaz-aadil-resume.pdf`: current resume.
- `assets/data/github-repos.json`: saved repository snapshot; initial fallback cards also appear in the HTML.

The GitHub feed uses the [official public repositories endpoint](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user), without tokens or secrets. The contact form retains `https://formspree.io/f/xrbgajko`; delivery depends on the existing account configuration. Its real delivery should be confirmed on the deployed domain.

Font licenses and icon credits are stored beside the assets. Original portfolio adapted from Chetan Nadda's template. Brand names and logos belong to their respective owners.
