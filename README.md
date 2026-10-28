# Shahnawaz Aadil · Personal portfolio

A personal portfolio with a black background and a single blue accent. Plain HTML, CSS, and JavaScript; no build step or dependencies.

## Content and features

- Personal introduction with a subtle full-width portrait background, with rotating AI Engineer, Machine Learning Engineer, NLP Engineer, and Data Scientist text. Animation supports pause and reduced-motion preferences.
- Five projects in one unfiltered grid: illustration, title, short summary, tools, and direct public source links.
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
- `script.js`: role animation,  mobile navigation, contact form, and GitHub feed.
- `assets/documents/shahnawaz-aadil-resume.pdf`: current resume.
- `assets/data/github-repos.json`: saved repository snapshot; initial fallback cards also appear in the HTML.

The GitHub feed uses the [official public repositories endpoint](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user), without tokens or secrets. The contact form retains `https://formspree.io/f/xrbgajko`; delivery depends on the existing account configuration. Its real delivery should be confirmed on the deployed domain.

Typography uses self-hosted Inter. The hero uses the original full-color portrait, with the text on the left and photo positioned at the right edge.

Font licenses and icon credits are stored beside the assets. Original portfolio adapted from Chetan Nadda's template. Brand names and logos belong to their respective owners.

Mobile layouts use a single project column, larger touch targets, readable skills, and stacked contact fields.

Repository descriptions are maintained in `repositoryContext` in script.js. All six recent repository cards remain visible on phones.

## Design rules and motion

The requested Apple design skill is tracked as the `.design-rules` Git submodule. Initialize it on a fresh checkout with `git submodule update --init`. The portfolio applies its web-relevant principles: restrained motion, clear typography, consistent spacing, opaque content cards, and comfortable controls. It keeps the custom black-and-blue appearance and full-color portrait.

See `DESIGN.md` for tokens, calculated solid-color contrast, layout decisions, motion timing, and guideline references. Motion preferences are respected; typing pauses when the tab is hidden, and the pause control leaves a complete role visible.
