# npm README Glass Dashboard

A glassmorphic Next.js dashboard that shows your **GitHub profile** (bio, avatar, social links) plus **official npm registry stats**, embeddable in your GitHub README as a wide preview image.

## Features

- **Profile section** — tagline, bio, avatar (from GitHub API), social links, Sans Forgetica styling (matches your README aesthetic)
- **npm stats** — total packages, lifetime downloads (since Jan 2015), weekly/monthly averages, period totals
- **All packages** — full list with weekly, monthly, and lifetime downloads per package
- Bar and line charts for all packages
- README embed via PNG image (`/api/embed`) with profile + npm summary

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3000/?user=prakhar_dubey](http://localhost:3000/?user=prakhar_dubey).

## Environment variables

| Variable | Description |
|----------|-------------|
| `NPM_USERNAME` | Default npm username (default: `prakhar_dubey`) |
| `NEXT_PUBLIC_APP_URL` | Optional — your Vercel URL for docs |

## Deploy on Vercel

1. Push this repo to GitHub
2. [Import on Vercel](https://vercel.com/new) (Next.js auto-detected)
3. Add environment variable: `NPM_USERNAME=prakhar_dubey`
4. Deploy and copy your production URL

## Paste in your GitHub README

Replace `YOUR_APP` with your Vercel URL (e.g. `readme-dashboard.vercel.app`):

```markdown
## npm packages

<p align="center">
  <a href="https://YOUR_APP.vercel.app/?user=prakhar_dubey">
    <img
      src="https://YOUR_APP.vercel.app/api/embed?user=prakhar_dubey"
      alt="npm package statistics for prakhar_dubey"
      width="100%"
    />
  </a>
</p>
```

**Cache busting:** GitHub caches images. After redeploying, append `&v=2` to the image URL to force a refresh.



## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/stats?user=username` | JSON stats (cached 1 hour) |
| `GET /api/embed?user=username` | PNG image for README embed |

## Data sources

- Package list: `registry.npmjs.org/-/v1/search?text=maintainer:{user}`
- Downloads: `api.npmjs.org/downloads/point` and `/range`

Lifetime totals sum 365-day chunks from January 10, 2015 (npm API limit).
