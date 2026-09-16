# Chia Qian — Cinematic Portfolio

An employer-facing interactive portfolio for **Hong Chia Qian**, designed as a scroll-directed digital film rather than a conventional project gallery.

The camera travels through a continuous WebGL world while each project appears as its own scene, combining cinematic pacing, expressive typography and pastel light with real software-engineering work.

## Experience

- Scroll-controlled Three.js camera journey
- Five connected 3D scenes with fog, particles and reactive lighting
- Interactive pointer and click responses
- Film-inspired transitions, title cards, grain and letterboxing
- Responsive layouts and reduced-motion support
- Project case files with GitHub and live-demo links

## Featured work

CogniPlan is presented as the lead professional case study, followed by work demonstrating automation, algorithms, and software architecture.

- **CogniPlan** — intelligent study planning with spaced repetition and cognitive-load signals
- **Web Verification Lab** — automated browser testing, monitoring and visual evidence
- **Algorithm Atelier** — algorithm implementations and performance analysis
- **ShopEase System** — object-oriented software architecture study

## Built with

`React 19` · `TypeScript` · `Three.js` · `Vinext` · `Tailwind CSS`

## Live portfolio

The production portfolio is hosted on Cloudflare Workers:

[chia-qian-portfolio.1211107977.workers.dev](https://chia-qian-portfolio.1211107977.workers.dev)

## Technical skills

- **Languages:** TypeScript, JavaScript, Python, Java, SQL
- **Frontend:** React, Next.js, Vinext, Tailwind CSS, responsive UI
- **Creative development:** Three.js, WebGL, motion design, interactive storytelling
- **Engineering:** testing automation, Selenium, algorithms, object-oriented design
- **Platforms and tools:** Cloudflare Workers, Firebase, Git, GitHub

## Deploy to Cloudflare

Build the Vinext app, then deploy the generated Worker bundle:

```bash
npm ci
npm run build
npx wrangler deploy --config dist/server/wrangler.json --name chia-qian-portfolio --keep-vars
```

Wrangler uses your authenticated Cloudflare account. A `workers.dev` subdomain (or a custom domain/route) must be enabled in Cloudflare before the first public deployment.

## Security

The app is intentionally a small, public portfolio with no application database or authenticated API. It ships browser security headers including Content Security Policy, clickjacking protection, MIME-sniffing protection, a strict referrer policy, and a restrictive Permissions Policy. Keep secrets out of the repository and use Wrangler secrets if server-side integrations are added later.

## Author

**Hong Chia Qian** — developer, artist and curious human.

- GitHub: [@ChaChaChaqiannnnn](https://github.com/ChaChaChaqiannnnn)
- CogniPlan: [Live demo](https://cogniplan-f615f.web.app)

---

Built with code, light and a little chaos.
