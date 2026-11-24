# devloop website

The site at https://devloop.onekash.org: the landing page for
[devloop](https://github.com/OneKashLabs/devloop), a test-driven development loop for Claude Code and
Codex. Built with Docusaurus and published to GitHub Pages by `.github/workflows/deploy.yml` on every
push to `main`.

```bash
npm ci
npm start          # local preview with live reload
npm run build      # static site in build/
npm run serve      # serve build/
```
