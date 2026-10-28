# Portfolio design decisions

## Summary

A personal AI-engineering portfolio for recruiters and collaborators. The full-color portrait at the right edge and the introduction at the left are the signature. Projects, skills, and education remain factual and concise. This is a website: Apple's principles inform the visual design and accessibility; native app navigation conventions do not replace web navigation.

## Tokens

| Role | Color | Contrast against background |
| --- | --- | --- |
| Background | #090909 | — |
| Surface | #151515 | — |
| Primary text | #f5f5f7 | 18.29:1 |
| Secondary text | #a1a1a6 | 7.74:1 |
| Accent | #9bb8ff | 10.14:1 |
| Separator | #2b2b2f | — |

Contrast values are calculated from the solid sRGB tokens, not from the photograph. The image fades to the actual background; important copy sits in the opaque portion of that fade.

Type: Inter display and body, with the platform's system font for controls. Body 17px; supporting content 14–15px; metadata at least 11px. Headings use relative sizes and regular/medium/semibold weights. Spacing follows an 8px rhythm; content cards use an 18px radius; controls use a 12px radius and at least a 44px touch target.

Regular layout:

```text
Name                         Projects Skills About GitHub Contact Resume
Introduction + name          Full-color portrait, fading to the page
Rotating roles               Subject aligned toward the right edge
Projects / View resume

Projects: two columns
Skills: four domain groups
Education: two columns
Repositories + LinkedIn
Contact + form
```

Compact layout:

```text
Name                                                   Menu
Introduction + name          Portrait remains visible at right
Rotating roles
Study / actions / profile links

Projects: one column
Skills: two domain groups per row
Education / repositories / contact: one column
Resume: scrollable sheet with an obvious close action
```

## Motion

- One brief, staggered entrance for the introduction; the portrait stays still.
- Frame-aligned typing with a longer reading pause, a smaller prefix on the same baseline, and no play/pause control. Reduced motion shows a complete static role.
- Controls: 140–220ms feedback. Cards: a 2px lift only for a fine pointer.
- Resume: 300ms entrance, 160ms dismissal. Mobile navigation: 220ms fade and 6px displacement.
- No parallax, scroll-jacking, looping decorative movement, or hidden-on-scroll content.
- Reduced motion disables transitions and typing. Reduced transparency gives navigation and the resume backdrop opaque surfaces. Increased contrast strengthens separators and supporting text.

## Craft decisions

The site retains its existing black-and-blue identity, full-color portrait, project illustrations, GitHub feed, and resume popup. Removed section numbering because the sections are not sequential steps. Blur is confined to the navigation layer; cards remain opaque. These are design judgments applying the principles to this portfolio.

The portrait keeps its square aspect ratio without cropping the hair. Page-color blending finishes before the head at the left, covers only the first 3% at the top, and fades the podium at the bottom. The head has no vignette. Skills use a centered heading and evenly spaced, centered domain groups: four columns on wide screens, two on tablets and phones, and one on narrow phones. Domain distinctions and existing content remain intact.

## Guideline references

- [.design-rules/SKILL.md](.design-rules/SKILL.md), Design improvement mode.
- [motion.md](.design-rules/references/hig/motion.md), Providing feedback: “Aim for brevity and precision in feedback animations.”
- [materials.md](.design-rules/references/hig/materials.md), Liquid Glass: “Don’t use Liquid Glass in the content layer.”
- [typography.md](.design-rules/references/hig/typography.md), Ensuring legibility: “In general, avoid light font weights.”
- [accessibility.md](.design-rules/references/hig/accessibility.md), Mobility: “Offer sufficiently sized controls.”
- [design-principles.md](.design-rules/references/hig/design-principles.md), Simplicity: “Be clear and direct.”

The local instructions and code were reviewed for this implementation. Browser and device checks were skipped at the user's request; this document does not claim measured rendering or full HIG compliance.
