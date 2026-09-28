# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` is the maintained source of truth for architecture, subsystems, conventions, and common tasks, and it's imported below. `.github/copilot-instructions.md` just points to it. Read `REVIEW.md` before reviewing or opening a PR. It has the review priorities, the CI workflows, and the PR checklist.

@AGENTS.md

## Commands

```bash
npm install                       # Node >=22 (.nvmrc pins 22; CI uses 24)
npm run dev                       # Vite dev server, opens applications/browser-examples/demo.html
npm test                          # vitest run (jsdom, tests/**/*.test.js)
npx vitest run tests/util/BinaryReader.test.js   # single file
npx vitest run -t "<test name>"                   # single test by name
npm run lint && npm run format:check             # = npm run ci; matches the PR lint/format workflows
npm run build:online              # production build of Online.js → dist/Web/ (CI runs `npm run build`)
npm run build:all
node wsproxy.js -p 5999 [-r host:port=target:port,...]   # local WebSocket→TCP proxy
```

## Things that span several files

- **There are two module resolvers.** `vite.config.js` serves dev and Vitest. `applications/tools/builder-web.mjs` does the production build and has its own alias table and CLI flags (`-O` Online, `-V`/`-G`/`-M`/`-S`/`-E` viewers, `-T` ThreadEventHandler worker, `-H` html, `--all`, `--m` minify, `--PWA`). If tests pass but the build fails, or the reverse, check that the two alias tables still match.
- **App entry points** are in `src/App/` (Online, MapViewer, GrfViewer, ModelViewer, StrViewer, EffectViewer, GrannyModelViewer, PreLoader). Pages embed them through `applications/api/api.js` (`new ROBrowser(ROConfig)`). `applications/browser-examples/*.html` shows frame and popup embeds.
- **ROConfig** is a plain object defined by the host HTML page. For an example, see `applications/browser-examples/demo.html`, which lists local rAthena servers on 6900. Each `servers[]` entry can set its own `packetver` and `remoteClient`, and this overrides the PACKETVER auto-detected from the executable. `src/Core/Configs.js` reads it at runtime.
- **The web worker** (`src/Core/ThreadEventHandler.js`) runs GRF decompression and pathfinding off the main thread, and it's built as a separate bundle. Worker code can't see main-thread globals, so audit worker consumers before you remove a global.
- **Versioned UI:** many components exist in several per-PACKETVER variants, such as `BasicInfo/BasicInfoV0…V5`. `UIVersionManager` picks one using a `versionInfo` mapping. Component `name` strings and `Preferences` keys are load-bearing, so don't rename them.
- **Tests** mirror `src/` under `tests/` (db, loaders, network, renderer, ui, util). Fixtures must be synthetic `ArrayBuffer`/`DataView` data. Tests that touch `Texture.js` or a 2D context need a Canvas mock.
- The `lintandformat.yml` workflow auto-commits lint and format fixes to `master` after a merge. Expect `code-quality: auto lint + format` commits when you rebase.
