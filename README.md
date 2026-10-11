# Adrian Renato Pérez Galindo — Portfolio

Personal portfolio website for Adrian Renato Pérez Galindo, a senior Computer
Science student at Florida International University focused on cybersecurity,
software development, quantum computing, cloud computing, and IT.

Built as a lightweight static site (HTML, CSS, vanilla JavaScript) with no
runtime framework. Features include a light/dark theme, scroll animations, an
active-section indicator, SEO/Open Graph metadata, a rule-based portfolio
assistant, and optimized images.

## Project structure

```
index.html          Main page and all content sections
style.css           Styles, theme variables, responsive layout
script.js           Projects rendering, theme toggle, scroll reveal,
                    scroll spy, and the portfolio assistant
headshot.webp       Optimized portrait (modern format)
headshot-opt.jpg    Optimized portrait (fallback)
og-image.png        Social sharing preview image (1200x630)
generate-og-image.js  Dev script to regenerate og-image.png from headshot.jpg
```

## Local development

A static dev server is configured via `live-server`.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Regenerating the social preview image

The Open Graph image is generated from the full-resolution `headshot.jpg`
(not committed) using [sharp](https://sharp.pixelplumbing.com/):

```bash
node generate-og-image.js
```

## Deployment

This is a plain static site. The deployable files are `index.html`,
`style.css`, `script.js`, the optimized images, `og-image.png`, and the résumé
PDF. It can be hosted on GitHub Pages, Netlify, Vercel, or any static host.
