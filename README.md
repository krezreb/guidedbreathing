# Guided Breathing

A calm, offline-capable Progressive Web App for guided breathing exercises.
Pick a breathing profile and a duration, follow the bubble up as you breathe in
and down as you breathe out.

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
├── data/                    profiles, duration presets, resource links
├── services/
│   ├── sessionController.js the state machine and all timing arithmetic
│   ├── useSession.js        browser wiring: rAF loop, visibility, wake lock
│   ├── storage.js           localStorage preferences, degrades to memory
│   ├── screenWakeLock.js    best-effort wake lock
│   └── completionSound.js   iOS-safe audio unlock and playback
├── components/              selectors, canvas, controls, timer, dialogs
├── views/                   Home, Breathing, Information
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

**Sessions pause themselves when you look away.** Hiding the tab or locking the
phone pauses the session, so no time accrues and the session can never complete
in the background. Resuming is always a deliberate user action. This is also
what makes the wake lock simple: there is never a running session without one.

## Testing

```bash
make test
```

The suite covers phase derivation for every profile, pause/resume position
preservation, exclusion of paused time, end-of-session overflow, timer
formatting, auto-pause on hidden documents, and that exiting never reaches the
completed state. Animation smoothness and layout are checked by hand on a real
device.

## Browser support notes

The app degrades rather than fails:

- **No Wake Lock API** — the session runs normally; the screen may sleep.
- **Audio blocked or muted** (including the iOS ringer switch) — the session
  still completes and shows its message.
- **No localStorage** — the app works, but selections do not persist.
- **No service worker** — the app works as an ordinary web page, without
  offline support.
