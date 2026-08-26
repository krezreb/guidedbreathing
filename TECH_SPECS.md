# Guided Breathing PWA — Technical Specification

## 1. Technical Overview

The application is a client-side Progressive Web Application for guided breathing exercises.

The application has **no backend** and must be deployable as a collection of static files.

### Technology Stack

- **Language:** JavaScript
- **UI framework:** Vue.js
- **Animation:** p5.js
- **Styling:** CSS
- **Persistence:** Browser `localStorage`
- **Application type:** Progressive Web Application (PWA)
- **Backend:** None
- **Build system:** Makefile
- **Deployment target:** Static web hosting, including AWS S3

The application must not require a server-side runtime.

---

# 2. Application Architecture

The application should be structured as a single-page application.

```text
Browser
│
├── Vue.js
│   ├── Main / Configuration Screen
│   ├── Breathing Session Screen
│   ├── Completion Screen / Message
│   └── Information Screen
│
├── p5.js
│   └── Breathing animation
│
├── localStorage
│   └── User preferences / application state
│
└── PWA Service Worker
    └── Offline application assets
```

There must be no API server or backend dependency.

The application should function entirely from static assets after deployment.

---

# 3. Frontend Framework

## 3.1 Vue.js

Vue.js is responsible for:

- Application structure.
- Screen/component rendering.
- User interaction.
- Breathing profile selection.
- Duration selection.
- Session state management.
- Pause/resume/exit controls.
- Session completion.
- Information pages.
- Persistent user preferences.

The application should use Vue's current recommended component-based architecture.

Components should be reasonably small and focused on a single responsibility.

Suggested structure:

```text
src/
├── components/
│   ├── BreathingProfileSelector.vue
│   ├── DurationSelector.vue
│   ├── BeginButton.vue
│   ├── BreathingCanvas.vue
│   ├── SessionControls.vue
│   ├── SessionTimer.vue
│   └── CompletionMessage.vue
│
├── views/
│   ├── HomeView.vue
│   ├── BreathingView.vue
│   └── InformationView.vue
│
├── data/
│   └── breathingProfiles.js
│
├── services/
│   ├── storage.js
│   ├── sessionTimer.js
│   └── screenWakeLock.js
│
├── styles/
│   └── main.css
│
├── App.vue
└── main.js
```

The exact structure may be adjusted during implementation, but application logic should remain separated from presentation and animation code.

---

# 4. p5.js Animation

p5.js must be used for the breathing visualization.

The p5.js canvas is responsible only for rendering the breathing animation.

Vue remains responsible for:

- Session state.
- Timing state.
- User interaction.
- Profile selection.
- Pause/resume/exit.
- Session completion.

The p5.js layer should not become the source of truth for session state.

## 4.1 Breathing Animation

The animation consists of a bubble moving vertically inside a rectangular area.

Conceptually:

```text
┌─────────────────────┐
│         ●           │
│         ↑           │
│       INHALE        │
│         ↑           │
│         │           │
│         │           │
│         ↓           │
│       EXHALE        │
│         ↓           │
│         ●           │
└─────────────────────┘
```

The bubble position must be calculated from actual session elapsed time rather than relying on frame count.

This ensures that timing remains correct if the browser temporarily drops animation frames.

## 4.2 Animation Timing

For a profile with:

```text
inhale = 6 seconds
exhale = 6 seconds
```

the animation cycle is:

```text
0s → 6s    Bubble moves upward
6s → 12s   Bubble moves downward
```

The animation repeats continuously until the session ends.

The p5.js animation should derive its position from the current breathing phase and elapsed time supplied by the Vue/session controller.

---

# 5. Session Timing Architecture

Timing must be based on elapsed time rather than counting JavaScript timer callbacks.

The implementation should use a monotonic/high-resolution time source such as:

```javascript
performance.now()
```

where appropriate.

This prevents timer drift caused by:

- Browser scheduling delays.
- CPU load.
- Background throttling.
- Variable animation frame rates.

The session controller should maintain:

```text
sessionStartTime
pausedAt
totalPausedDuration
sessionDuration
currentPhase
phaseStartTime
```

or an equivalent representation.

The exact implementation is flexible as long as the following behavior is guaranteed:

- Active time is measured accurately.
- Paused time is excluded.
- Resuming does not restart the current breathing phase.
- Animation and session timer remain synchronized.

---

# 6. Session State Machine

The application should use an explicit session state model.

```text
IDLE
 │
 │ Begin
 ▼
RUNNING
 │  │
 │  └── Pause
 │        ↓
 │      PAUSED
 │        │
 │        ├── Resume → RUNNING
 │        │
 │        └── Exit → IDLE
 │
 ├── Exit → IDLE
 │
 └── Duration elapsed
          ↓
       COMPLETED
          ↓
         IDLE
```

The session state must not be inferred solely from UI visibility.

---

# 7. Local Storage

There is no backend.

Persistent application preferences must be stored using browser `localStorage`.

## 7.1 Persisted Data

At minimum, the application should persist:

- Last selected breathing profile.
- Last selected session duration.
- Any user-configurable application preferences introduced later.

Suggested storage namespace:

```text
guided-breathing.*
```

For example:

```text
guided-breathing.preferences
```

## 7.2 Active Session

An active breathing session does **not** need to survive a page reload.

If the browser is refreshed, closed, or the application is terminated, the active session may be discarded.

Persistent preferences should survive reloads.

No sensitive or personally identifiable information should be stored.

---

# 8. PWA

The application must be delivered as a complete Progressive Web Application.

## 8.1 PWA Components

The build must generate:

- `index.html`
- JavaScript bundles
- CSS bundles
- Images/assets
- Web app manifest
- Service worker
- PWA icons
- Any required fonts/audio/assets

The generated application must be self-contained.

## 8.2 Mobile Optimization

The primary target is **mobile phones in portrait orientation**.

The UI must therefore be designed mobile-first.

The application should:

- Optimize the main interface for portrait screens.
- Use large touch-friendly controls.
- Avoid hover-dependent interactions.
- Avoid requiring precise taps.
- Adapt to different phone aspect ratios.
- Work correctly with browser address/navigation bars.
- Respect safe areas on devices with notches or rounded corners.

The viewport should be configured appropriately for mobile devices.

## 8.3 Orientation

Portrait orientation is the primary supported orientation.

The application should remain functional in landscape, but the UI and animation should be optimized for portrait.

If technically and practically appropriate, the application may request portrait orientation when running as an installed PWA. This must not prevent normal browser usage on platforms that do not support orientation locking.

---

# 9. Screen Wake Lock

The application should attempt to prevent the device from turning off the screen during an active breathing session.

Use the browser **Screen Wake Lock API** when available.

## Behavior

When a breathing session starts:

```text
Request screen wake lock
        ↓
Session running
        ↓
Keep screen awake
```

When the session:

- completes,
- is exited,
- or otherwise stops,

the wake lock should be released.

## Browser Support

The Wake Lock API is not universally available.

Therefore:

- Feature detection must be used.
- The application must never fail if wake lock is unavailable.
- The breathing session must continue normally without it.
- The application should not display an error merely because wake lock is unsupported.

If a wake lock is released by the operating system or browser while the session is still active, the application should attempt to reacquire it when appropriate, subject to browser permissions and lifecycle restrictions.

No special permission should be requested if the browser's Wake Lock API does not require one.

---

# 10. Visual Design

The visual design should be centered around a **deep, calm, blue-dominated color palette**.

The application should feel:

- Calm.
- Relaxing.
- Minimal.
- Modern.
- Uncluttered.
- Focused.

## 10.1 Color Direction

The palette should primarily use deep blues and related dark/cool tones.

For example:

```text
Background:
Very dark navy / blue

Primary:
Deep blue

Secondary:
Muted blue

Accent:
Soft blue / cyan

Text:
Light blue-white / off-white
```

Exact colors should be defined centrally using CSS variables.

Example:

```css
:root {
    --color-background: ...;
    --color-surface: ...;
    --color-primary: ...;
    --color-secondary: ...;
    --color-accent: ...;
    --color-text: ...;
    --color-text-muted: ...;
}
```

No colors should be scattered throughout component-specific CSS.

---

# 11. Portrait Session UI

The breathing session is the primary mobile experience.

On a portrait phone, the screen should approximately follow this hierarchy:

```text
┌───────────────────────┐
│                       │
│     05:32 remaining   │
│                       │
│   ┌───────────────┐   │
│   │       ●       │   │
│   │       ↑       │   │
│   │               │   │
│   │   BREATHE IN  │   │
│   │               │   │
│   │       ↓       │   │
│   │               │   │
│   └───────────────┘   │
│                       │
│      [ PAUSE ]        │
│                       │
│        Exit           │
│                       │
└───────────────────────┘
```

The actual layout is flexible, but the breathing animation should occupy the majority of the screen.

Controls should remain accessible without visually competing with the breathing guide.

---

# 12. Audio Assets

The completion sound should be bundled into the application.

It must not be fetched from an external server.

The build must include the audio asset in the generated static distribution.

The application should use a web-compatible audio format supported by the target browsers.

---

# 13. External Information Links

The informational section may contain links to external resources.

These links are the only expected runtime network dependencies outside the application's own static assets.

The core application must remain functional when those external websites are unavailable.

---

# 14. Build System

The project must include a **Makefile** providing standardized development and deployment commands.

The Makefile should abstract the underlying Node/npm tooling so that common operations can be performed without remembering individual commands.

Suggested targets:

```text
make install
make dev
make build
make docker
make deploy
make clean
```

---

# 15. Local Development

The project must provide a local development mode with:

- Development server.
- Fast rebuilds.
- Hot module replacement where supported.
- Source maps.
- Unminified development output where appropriate.

Example:

```bash
make dev
```

The development server should bind appropriately for local development and, where useful, allow access from another device on the local network for testing the mobile UI.

---

# 16. Production Build

The production build must:

- Bundle JavaScript.
- Bundle CSS.
- Minify JavaScript.
- Minify CSS.
- Optimize assets.
- Include all required application assets.
- Generate the PWA manifest.
- Generate the service worker.
- Generate required icons.
- Produce a self-contained static distribution directory.

Example:

```text
dist/
├── index.html
├── assets/
│   ├── *.js
│   ├── *.css
│   ├── *.svg
│   ├── *.png
│   └── *.audio
├── manifest.webmanifest
├── sw.js
└── icons/
```

The production build must not depend on CDN-hosted JavaScript, CSS, fonts, p5.js, or Vue.js.

All runtime dependencies must be bundled into the application.

---

# 17. Docker Build

The project must provide a Docker image containing the built application.

The container should serve the static files using a lightweight static web server.

A multi-stage Docker build should be preferred:

```text
Node build image
      ↓
npm install
      ↓
production build
      ↓
Static distribution
      ↓
Minimal web server image
      ↓
Docker image
```

The final image should contain only what is required to serve the production application.

Example:

```bash
make docker
```

The resulting image should be suitable for running behind a reverse proxy or directly exposing the static web server.

---

# 18. AWS S3 Deployment

The application must support deployment as static files to an AWS S3 bucket.

Example:

```bash
make deploy
```

The deployment process should:

1. Build the production application.
2. Upload the contents of `dist/` to the configured S3 bucket.
3. Preserve the correct content types.
4. Upload the PWA manifest correctly.
5. Upload JavaScript/CSS/assets correctly.
6. Upload the service worker correctly.
7. Make the static application available through the configured S3 hosting setup.

AWS credentials and bucket configuration must not be hard-coded.

They should be supplied through environment variables or the standard AWS CLI credential mechanism.

Suggested variables:

```text
AWS_PROFILE
AWS_REGION
S3_BUCKET
S3_PREFIX
```

The exact variable names may be adjusted during implementation.

---

# 19. Static Hosting Requirements

The application must work correctly when served from:

- A local development server.
- A Docker static web server.
- AWS S3.
- An HTTPS static hosting service.

Because PWA functionality, particularly service workers and Wake Lock, generally requires a secure context, production deployment should use **HTTPS**.

Local development may use the development server's supported local HTTP/HTTPS behavior.

---

# 20. Asset Bundling

All application assets must be bundled with the production build.

This includes:

- Vue.js.
- p5.js.
- CSS.
- JavaScript.
- Audio.
- Images.
- PWA icons.
- Manifest.
- Service worker.
- Any fonts used by the application.

The application must not rely on external CDNs at runtime.

This is particularly important for offline operation.

---

# 21. Caching / Offline Behavior

The PWA service worker should cache the application's static resources.

At minimum, the application shell must be available offline:

- HTML.
- JavaScript.
- CSS.
- p5.js.
- Vue.js.
- Images.
- Audio.
- Manifest.
- Icons.

The breathing exercise must remain usable without network connectivity.

External informational websites obviously cannot be guaranteed to work offline.

---

# 22. Error Handling

The application should fail gracefully.

Examples:

### Wake Lock unavailable

Continue the session normally.

### Audio unavailable

The session should still complete and display the completion message.

### localStorage unavailable

The application should continue to function using in-memory state, although preferences may not persist.

### Browser does not support PWA features

The application should remain usable as a normal web application.

### Browser does not support required animation features

The application should provide the best available fallback without preventing the user from completing the session.

---

# 23. Security

The application has no backend and therefore has no application-specific authentication or API security requirements.

Nevertheless:

- Do not embed credentials in the source code.
- Do not embed AWS credentials in the application.
- Do not store secrets in `localStorage`.
- Do not include unnecessary third-party scripts.
- External links should use appropriate security attributes where relevant.
- Production deployment should use HTTPS.

---

# 24. Suggested Project Structure

A possible project structure is:

```text
guided-breathing/
│
├── public/
│   ├── icons/
│   ├── audio/
│   └── ...
│
├── src/
│   ├── components/
│   │   ├── BreathingProfileSelector.vue
│   │   ├── DurationSelector.vue
│   │   ├── BreathingCanvas.vue
│   │   ├── SessionControls.vue
│   │   ├── SessionTimer.vue
│   │   └── CompletionMessage.vue
│   │
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── BreathingView.vue
│   │   └── InformationView.vue
│   │
│   ├── data/
│   │   └── breathingProfiles.js
│   │
│   ├── services/
│   │   ├── storage.js
│   │   ├── sessionTimer.js
│   │   └── screenWakeLock.js
│   │
│   ├── styles/
│   │   └── main.css
│   │
│   ├── App.vue
│   └── main.js
│
├── Dockerfile
├── Makefile
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

The exact structure may be changed if there is a strong technical reason, but the separation of concerns should be maintained.

---

# 25. Dependencies

The application should keep dependencies to a minimum.

Required core dependencies:

- Vue.js
- p5.js
- A modern JavaScript build tool suitable for Vue, such as Vite.
- PWA/service-worker tooling appropriate for the chosen build system.

No UI framework is required unless it provides a clear benefit.

The interface should primarily use custom CSS to maintain the lightweight, calm visual design.

---

# 26. Build Targets

The Makefile must expose at least the following workflows:

| Target | Purpose |
|---|---|
| `make install` | Install development dependencies |
| `make dev` | Start local development server |
| `make build` | Create optimized production build |
| `make docker` | Build production Docker image |
| `make deploy` | Build and deploy static files to AWS S3 |
| `make clean` | Remove generated build artifacts |

Additional targets may be added as useful.

The README must document all Makefile targets and their required environment variables.

---

# 27. Acceptance Criteria

The implementation is considered complete when:

### Application

- [ ] The application runs entirely client-side.
- [ ] No backend is required.
- [ ] Four breathing profiles are available.
- [ ] Durations from 3–20 minutes are available.
- [ ] Profile selection works.
- [ ] Duration selection works.
- [ ] A session can be started.
- [ ] The p5.js breathing animation correctly represents inhale/exhale.
- [ ] Animation timing matches the selected profile.
- [ ] Remaining session time is displayed.
- [ ] A session can be paused.
- [ ] Pausing preserves the exact breathing position.
- [ ] A session can be resumed.
- [ ] Resuming does not restart the current breathing phase.
- [ ] A session can be exited.
- [ ] Exiting does not trigger completion.
- [ ] Session completion triggers a sound.
- [ ] Session completion displays a congratulatory message.
- [ ] The information section is available.

### Persistence

- [ ] Profile selection is persisted in localStorage.
- [ ] Duration selection is persisted in localStorage.
- [ ] The application continues to work if localStorage is unavailable.

### PWA

- [ ] The application is installable as a PWA.
- [ ] The UI is optimized for mobile portrait use.
- [ ] Touch targets are appropriate for phones.
- [ ] Application assets are cached for offline use.
- [ ] The core breathing exercise works offline.
- [ ] PWA icons and manifest are included.

### Screen Wake Lock

- [ ] The application attempts to acquire a screen wake lock when a session starts.
- [ ] Wake lock is released when the session ends or exits.
- [ ] Wake lock failure does not prevent the session from running.
- [ ] The application attempts to reacquire the wake lock when appropriate after it is unexpectedly released.

### Build

- [ ] `make dev` starts local development.
- [ ] `make build` creates a production build.
- [ ] Production JavaScript is minified.
- [ ] Production CSS is minified.
- [ ] All runtime assets are bundled.
- [ ] No Vue/p5.js/CDN dependency exists at runtime.
- [ ] `make docker` produces a working static web server image.
- [ ] `make deploy` builds and deploys the application to S3.
- [ ] AWS credentials are not embedded in the application.
- [ ] The Docker image contains only the required production artifacts.

---

# 28. Out of Scope

The initial implementation does not include:

- User accounts.
- Backend services.
- Databases.
- Cloud synchronization.
- Analytics.
- User tracking.
- Social features.
- Session history.
- User-generated breathing profiles.
- Custom breathing timings.
- Continuous guided voice/audio.
- Push notifications.

These may be considered for future versions but should not influence the architecture of the initial release.
