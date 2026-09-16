# Chia Qian — Cinematic Portfolio

An interactive portfolio for **Hong Chia Qian**, designed as a scroll-directed digital film rather than a conventional project gallery.

The camera travels through a continuous WebGL world while each project appears as its own scene, combining cinematic pacing, expressive typography and pastel light with real software-engineering work.

## Experience

- Scroll-controlled Three.js camera journey
- Five connected 3D scenes with fog, particles and reactive lighting
- Interactive pointer and click responses
- Film-inspired transitions, title cards, grain and letterboxing
- Responsive layouts and reduced-motion support
- Project case files with GitHub and live-demo links

## Featured work

- **CogniPlan** — intelligent study planning with spaced repetition and cognitive-load signals
- **Web Verification Lab** — automated browser testing, monitoring and visual evidence
- **Algorithm Atelier** — algorithm implementations and performance analysis
- **ShopEase System** — object-oriented software architecture study

## Built with

`React 19` · `TypeScript` · `Three.js` · `Vinext` · `Tailwind CSS`

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

Create a production build with:

```bash
npm run build
```

## Live portfolio

The production portfolio is hosted on Cloudflare Workers:

[chia-qian-portfolio.1211107977.workers.dev](https://chia-qian-portfolio.1211107977.workers.dev)

The original preview remains available on [ChatGPT Sites](https://serene-creative-developer.hongchiaqian.chatgpt.site), but the Cloudflare URL is the recommended link to share.

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
