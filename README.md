# Guided Breathing

A calm, offline-capable Progressive Web App for guided breathing exercises.
Pick a breathing profile and a duration, follow the bubble up as you breathe in
and down as you breathe out.

Available in English, Dutch, French, German, Italian and Spanish.

No backend, no accounts, no tracking. The app is a set of static files.

- **Product specification:** [SPECS.md](SPECS.md)
- **Technical specification:** [TECH_SPECS.md](TECH_SPECS.md)

## Quick start

```bash
make install
make dev
```

The dev server binds on all interfaces, so the mobile UI can be tested from a
phone on the same network — open `http://<your-machine-ip>:5173`.

## Make targets

| Target | Purpose |
|---|---|
| `make help` | List the targets (the default when you run `make`) |
| `make install` | Install development dependencies |
| `make dev` | Start the development server with HMR and source maps |
| `make build` | Create the optimised production build in `dist/` |
| `make preview` | Build, then serve `dist/` locally |
| `make test` | Run the unit test suite |
| `make docker` | Build the production Docker image |
| `make docker-run` | Build and run the image, serving on `$(PORT)` |
| `make deploy` | Build and deploy `dist/` to an S3 bucket |
| `make clean` | Remove build artefacts (`dist/`, `dev-dist/`, Vite cache) |

### Variables

Override any of these on the command line (`make dev DEV_PORT=3000`) or via the
environment.

| Variable | Default | Used by | Purpose |
|---|---|---|---|
| `DEV_PORT` | `5173` | `dev` | Development server port |
| `PORT` | `8080` | `preview`, `docker-run` | Local port for serving the build |
| `IMAGE` | `guided-breathing` | `docker`, `docker-run` | Docker image name |
| `TAG` | `latest` | `docker`, `docker-run` | Docker image tag |
| `S3_BUCKET` | *(none — required)* | `deploy` | Target bucket |
| `S3_PREFIX` | *(none)* | `deploy` | Optional key prefix within the bucket |
| `AWS_PROFILE` | *(none)* | `deploy` | AWS CLI profile |
| `AWS_REGION` | *(none)* | `deploy` | AWS region |

No credentials live in this repository. `make deploy` uses the standard AWS CLI
credential chain — a profile, environment variables, or an instance role.

## Deploying

```bash
make deploy S3_BUCKET=my-bucket AWS_PROFILE=my-profile AWS_REGION=eu-west-1
```

`deploy` uploads in a deliberate order: content-hashed assets first with a long
immutable cache, then the entry points (`index.html`, `sw.js`,
`manifest.webmanifest`) with `no-cache`. That ordering means a freshly fetched
`index.html` never references an asset that has not landed yet, and the
`no-cache` entry points keep clients from pinning themselves to a stale build.

Serve the result over **HTTPS**: service workers and the Wake Lock API both
require a secure context.

## Running the container

```bash
make docker-run          # http://localhost:8080
```

A multi-stage build compiles with Node and ships only `dist/` behind nginx
(~50 MB). The nginx config sets the same cache policy as the S3 deployment and
falls back to `index.html` for unknown paths.

## How it works

```
src/
├── data/                    profiles, duration presets, resource links (no text)
├── i18n/                    one message catalogue per language
├── services/
│   ├── sessionController.js the state machine and all timing arithmetic
│   ├── useSession.js        browser wiring: rAF loop, visibility, wake lock
│   ├── i18n.js              locale state, lookup, interpolation, plurals
│   ├── storage.js           localStorage preferences, degrades to memory
│   ├── screenWakeLock.js    best-effort wake lock
│   └── completionSound.js   iOS-safe audio unlock and playback
├── components/              selectors, canvas, controls, timer, dialogs
├── views/                   Home, Breathing, Information, Language
└── styles/main.css          the entire colour palette, as CSS variables
```

Three things are worth knowing before changing the code.

**Timing lives in one number.** `sessionController.js` keeps a single
accumulator of *active* elapsed time. The breathing phase, the bubble position
and the remaining time are all derived from it, never stored. That is why
pausing and resuming cannot drift: there is no second copy of progress to fall
out of step with. The controller touches no DOM, no Vue and no p5, so all of its
behaviour is tested headlessly with a fake clock.

**p5 renders; it does not decide.** Every frame the sketch asks the controller
where the bubble should be. Dropped frames therefore cannot desynchronise the
animation from the timer — a late frame simply draws the correct current
position.

**Every string lives in a catalogue.** `src/i18n/en.js` is the source and the
fallback; the other five mirror it. The data modules deliberately hold no text —
`breathingProfiles.js` has timings and ids, and the names and descriptions are
looked up as `profile.<id>`. `t()` reads a reactive `locale` ref, which is the
whole trick behind switching language with no reload and no i18n dependency.

**Sessions pause themselves when you look away.** Hiding the tab or locking the
phone pauses the session, so no time accrues and the session can never complete
in the background. Resuming is always a deliberate user action. This is also
what makes the wake lock simple: there is never a running session without one.

## Adding a language

1. Copy `src/i18n/en.js` to `src/i18n/<code>.js` and translate the values.
2. Import it in `src/i18n/index.js`, add it to `MESSAGES`, and add a row to
   `LOCALES` with the language's name **in that language** — never translated,
   because the picker has to be readable by someone who cannot read the current
   interface language.
3. Run `make test`. The suite compares every catalogue against English for
   identical keys and value shapes, and renders every parameterised string to
   check no placeholder is left unfilled, so an incomplete translation fails
   the build rather than shipping a half-translated screen.

If the new language does not share the `n === 1` singular rule, extend `tp()` in
`src/services/i18n.js`. Its callers do not change.

One known limitation: the PWA manifest is generated at build time, so the
*installed* app's name is English on every device regardless of the language
chosen inside it. Localising that needs a build and manifest per language.

## Testing

```bash
make test
```

The suite covers phase derivation for every profile, pause/resume position
preservation, exclusion of paused time, end-of-session overflow, timer
formatting, auto-pause on hidden documents, that exiting never reaches the
completed state, and translation coverage across all six languages. Animation smoothness and layout are checked by hand on a real
device.

## Browser support notes

The app degrades rather than fails:

- **No Wake Lock API** — the session runs normally; the screen may sleep.
- **Audio blocked or muted** (including the iOS ringer switch) — the session
  still completes and shows its message.
- **No localStorage** — the app works, but selections do not persist.
- **No service worker** — the app works as an ordinary web page, without
  offline support.
