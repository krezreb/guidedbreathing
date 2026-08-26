# Guided Breathing PWA — Product Specification

## 1. Overview

Develop a Progressive Web Application (PWA) designed to help users relax through simple, guided breathing exercises.

The application allows users to:

- Select a breathing profile.
- Select a session duration.
- Follow a visual breathing guide during the session.
- Pause, resume, or exit a session.
- Receive an audio notification when the session is complete.
- See a completion message.
- Access information about the benefits of breathing exercises and external resources.

The application should be simple, calm, and distraction-free, with the breathing exercise being the primary focus.

---

# 2. Breathing Profiles

The application provides four predefined breathing profiles.

| Profile | Inhale | Exhale | Description |
|---|---:|---:|---|
| **Strengthen** | 6 seconds | 6 seconds | Equal-duration breathing |
| **Chill** | 4 seconds | 8 seconds | Longer exhalation |
| **Balance** | 5 seconds | 5 seconds | Balanced breathing |
| **Beginner** | 3 seconds | 5 seconds | Shorter cycle for beginners |

Each breathing cycle consists of:

1. Inhale for the profile's configured duration.
2. Exhale for the profile's configured duration.
3. Repeat until the session duration has elapsed.

There is no intentional pause between inhalation and exhalation.

The breathing profile must not change during an active session.

---

# 3. Session Duration

The user selects a session duration from a fixed set of eight presets:

- 1 minute
- 2 minutes
- 3 minutes
- 5 minutes
- 8 minutes
- 10 minutes
- 15 minutes
- 20 minutes

The set is deliberately non-linear: fine-grained at the short end, coarser as
sessions get longer. It must be defined in one place (see the technical
specification) so that presets can be added or changed without touching UI code.

The selected duration determines the total length of the breathing session.

The duration timer begins when the session starts and stops when the session is paused.

---

# 4. Main Screen

The main screen is the session configuration screen.

## Layout

The interface should contain three primary areas.

### 4.1 Breathing Profile Selection

The available profiles are displayed as selectable options:

- Strengthen
- Chill
- Balance
- Beginner

The currently selected profile must be visually distinguishable.

Each profile should display its inhale/exhale timings so that the user understands what they are selecting.

### 4.2 Duration Selection

The user can select one of the eight preset durations.

The currently selected duration must be visually distinguishable.

### 4.3 Begin Button

A prominent **Begin** button starts the breathing session using the selected profile and duration.

A profile and a duration are always selected — defaults on first run, the
last-used values thereafter — so **Begin** is always enabled. It starts a session
using whatever is currently selected.

### 4.4 Menu

Below the **Begin** button the main screen offers a small menu:

- **About breathing exercises** — opens the informational section (§10).
- **Language** — opens the language screen (§11).

The menu is deliberately confined to the main screen. The session screen shows
only the breathing guide and its controls.

## Default Selection

On first open, before any preference has been persisted, the application
defaults to:

- Profile: **Beginner**
- Duration: **5 minutes**

---

# 5. Breathing Session Screen

After the user presses **Begin**, the application transitions to the breathing session screen.

The session screen should minimize distractions and focus the user's attention on the breathing animation.

## 5.1 Visual Breathing Guide

The screen contains a large rectangular visual area with a movable bubble.

The bubble moves vertically to represent the breathing cycle:

- **Bubble moving upward:** User should inhale.
- **Bubble moving downward:** User should exhale.

The animation timing must correspond exactly to the selected breathing profile.

For example, with the **Chill** profile:

```text
Move upward for 4 seconds → INHALE
Move downward for 8 seconds → EXHALE
Repeat
```

The animation continues until the session ends (see §7.1).

## 5.2 Breathing Phase Indicator

The current breathing phase should be clearly indicated to the user.

Possible labels:

- **Breathe in**
- **Breathe out**

The phase indicator should change in synchronization with the bubble animation.

## 5.3 Session Timer

The remaining session time must not be displayed while the session is running: a
visible clock invites the user to watch it instead of the breath.

It is shown only when the session is paused, and in the exit confirmation
dialog, where the user is deciding rather than breathing.

The timer represents the total remaining duration of the session, not the duration of the current breathing phase.

The timer must stop while the session is paused.

---

# 6. Session Controls

The breathing screen must provide controls allowing the user to:

- **Pause** the session.
- **Resume** a paused session.
- **Exit** the session.

The controls should remain accessible without interfering with the breathing animation.

---

## 6.1 Pause

When the user presses **Pause**:

- The breathing animation stops.
- The session timer stops.
- The current breathing phase is preserved.
- The exact animation position is preserved.
- No inhale/exhale transition occurs while paused.
- The session remains in memory.
- The **Pause** control changes to **Resume**.

For example, if the user pauses 2 seconds into a 6-second inhale, the application must remember that the user is 2 seconds into the inhale.

---

## 6.2 Resume

When the user presses **Resume**:

- The session continues from exactly where it was paused.
- The animation resumes from its current position.
- The session timer resumes.
- The current breathing phase continues for its remaining duration.

The current breathing phase must **not** restart from the beginning.

For example:

```text
6-second inhale
      ↓
2 seconds elapsed
      ↓
PAUSE
      ↓
RESUME
      ↓
Continue remaining 4 seconds
      ↓
8-second exhale
```

---

## 6.3 Exit

When the user presses **Exit**:

- The current session is terminated.
- Session progress is discarded.
- The user returns to the main screen.
- No completion sound is played.
- No completion message is displayed.

To prevent accidental exits, the application should display a confirmation dialog.

Example:

> **Exit session?**  
> Your current session will be lost.

Actions:

- **Cancel**
- **Exit**

Selecting **Cancel** returns the user to the paused/active session.

Selecting **Exit** terminates the session and returns to the main screen.

---

## 6.4 Automatic Pause

The session pauses itself whenever the application stops being visible to the
user — the tab is hidden or backgrounded, the app is switched away from, or the
device screen is locked.

This is treated as an ordinary pause: the state becomes `PAUSED`, the exact
breathing position and remaining session time are preserved, and paused time does
not count toward the session duration.

Rationale: a guided breathing session the user cannot see is not a session. Time
must not accumulate while the screen is off, and the session must never complete
in the background.

When the application becomes visible again the session remains paused. The user
resumes it deliberately with the **Resume** control; the application must not
resume on its own, because the user's attention has been elsewhere.

The paused state may indicate that the pause was automatic, for example:

> **Paused**
> Your session paused while you were away.

---

# 7. Session Completion

When the session reaches the selected duration:

1. Stop the breathing animation.
2. Stop the session timer.
3. Play a short, gentle completion sound.
4. Display a congratulatory message.
5. Provide an option to return to the main screen.

Example:

> **Well done!**  
> You've completed your breathing session.

The completion sound should be short, gentle, and non-intrusive.

The completion event must only occur when the full configured session duration has elapsed. Exiting a session must never trigger the completion state.

## 7.1 Overflow at the End of a Session

The configured duration is a **minimum** of active breathing time, not a hard cut.

Breathing phase durations are never truncated. Most profile/duration combinations
do not divide evenly — the Beginner profile has an 8-second cycle, so a 5-minute
session lands 4 seconds into a cycle, one second into an exhale — and cutting a
breath short is worse than running slightly long.

**A session always finishes on a completed exhale.**

When the configured duration elapses mid-cycle, the session continues at the
profile's normal timing until the current exhale finishes, and then completes. If
the duration elapses during an inhale, that inhale is completed and the following
exhale is run in full. Overflow is therefore always less than one breathing
cycle, and the session never ends at the top of a breath.

During the overflow the remaining-time display floors at `00:00`; it must never
show a negative value.

---

# 8. Session State

The application should maintain the following state during a session:

- Selected breathing profile.
- Inhale duration.
- Exhale duration.
- Selected total session duration.
- Current breathing phase.
- Current animation position/progress.
- Remaining duration of the current breathing phase.
- Remaining total session time.
- Current session state.

Possible session states:

```text
IDLE
RUNNING
PAUSED
COMPLETED
```

`EXITED` is not a state. Exiting is a transition that returns the application
directly to `IDLE` and discards the session.

## State transitions

```text
IDLE
  │
  │ Begin
  ▼
RUNNING ──────────── Exit ──────────────→ IDLE (Main Screen)
  │  │
  │  └── Pause, or app hidden / screen locked
  │            ↓
  │          PAUSED ─────── Exit ────────→ IDLE (Main Screen)
  │            │
  │            └── Resume ──→ RUNNING
  │
  └── Duration elapsed (then current exhale finishes)
            ↓
        COMPLETED ──── Return ───────────→ IDLE (Main Screen)
```

---

# 9. Timing Requirements

Accurate timing is important to the core experience.

The application must ensure that:

- Inhale and exhale durations are respected.
- Pausing does not consume session time.
- Resuming does not restart the current breathing phase.
- The total session duration excludes time spent paused.
- The breathing animation and phase indicator remain synchronized.
- Completing a breathing phase transitions directly into the next phase.
- The session ends once the configured active session time has elapsed and the
  current exhale has finished (see §7.1).
- Time spent hidden, backgrounded, or with the screen locked is paused time and
  does not count toward the session duration.

The implementation should use a timing mechanism appropriate for reliable animation and elapsed-time tracking rather than relying solely on repeated UI timers.

---

# 10. Information / Benefits Section

The main screen should provide access to an informational section about breathing exercises.

This section should contain:

- A brief explanation of guided breathing exercises.
- General information about potential relaxation benefits.
- Instructions or tips for getting the most out of a breathing session.
- Links to reputable external resources for users who want to learn more.

The application should avoid making medical claims or presenting breathing exercises as a treatment for medical conditions.

External resources should open appropriately for the PWA environment without unnecessarily disrupting the application.

## 10.1 External Links — Stubbed for V1

The specific external resources have not been chosen yet. For this version the
links section is **stubbed**: the informational screen includes the section and
its layout, populated with clearly marked placeholder entries.

The link list must live in a single data structure so that real URLs can be
dropped in later without touching the informational screen's markup.

Placeholders must be obviously unfinished rather than looking like working links
— no invented URLs, and no external destination that has not been reviewed.

---

---

# 11. Language

The interface is available in six languages: English, Dutch, French, German,
Italian and Spanish.

## 11.1 Choosing a Language

The main screen's menu (§4.4) includes a **Language** item that opens the
language screen. The item shows the language currently in use, written in that
language's own name, so it stays recognisable whatever the interface is set to.

The language screen lists every available language, each written in its own
name — **never translated**. A language picker has to be readable by someone who
cannot read the current interface language, which is precisely the person most
likely to be looking for it.

Choosing a language applies immediately across every screen, and is remembered
on the device.

The screen offers two ways back to the main screen: the back link in the header,
and an **OK** button at the foot of the list, for the reader whose eye stays on
the list and never travels back up to the header.

## 11.2 Default Language

On first open the application uses the browser's preferred language when that is
one of the supported languages, and English otherwise. A regional tag matches
its language: `fr-CA` selects French.

A merely detected language is **not** persisted. Only an explicit choice is
remembered, so until the user overrides it the application keeps following the
device's language setting.

## 11.3 Scope of Translation

All user-visible text is translated, including:

- Breathing profile names and descriptions.
- The breathing phase indicator.
- Session controls, the exit dialog and the completion message.
- The whole informational section.
- Accessible labels that are never shown on screen.

No user-visible text may be embedded in application logic, component markup or
data modules.

Three things are deliberately **not** translated:

- The language names in the picker, for the reason given in §11.1.
- The remaining-time display, which is digits and a colon.
- The installed application's name, for the reason given in §11.4.

## 11.4 Known Limitation: the Installed Name

The web app manifest is generated once at build time, so the name and
description of the *installed* application are English on every device, whatever
language is chosen inside the app. Localising them would require a separate
build and manifest per language. That is out of scope for this version, and the
application's own interface is unaffected.

## 11.5 Language and the Session

The language can be changed at any time from the main screen, but not during a
session: the session screen carries no menu, as the design principles require.

---
# 12. PWA Requirements

The application must be implemented as a Progressive Web Application.

## Core PWA functionality

The application should:

- Be installable on supported browsers.
- Work in standalone/PWA display mode.
- Provide a responsive interface.
- Start quickly.
- Cache application assets for offline use.
- Allow the core breathing exercise to function without an internet connection once the application has been loaded or installed.

---

# 13. Mobile and Responsive Design

The application must work well on:

- Desktop browsers.
- Tablets.
- Android phones.
- iPhones/iOS devices.

The interface should adapt to different screen sizes.

On larger screens, the main configuration screen should use the intended two-column layout:

```text
┌─────────────────────────────────────────┐
│                                         │
│   BREATHING PROFILES    DURATION        │
│                                         │
│   Strengthen            1   2   3       │
│   Chill                 5   8   10      │
│   Balance               15  20          │
│   Beginner                              │
│                                         │
│              [ BEGIN ]                  │
└─────────────────────────────────────────┘
```

On small screens, the layout may stack vertically while preserving the same functionality and logical ordering.

The breathing session itself should work in both portrait and landscape orientations.

---

# 14. Design Principles

The visual design should reinforce relaxation and simplicity.

The application should:

- Have a clean, minimal interface.
- Avoid unnecessary controls.
- Use calm, unobtrusive visual transitions.
- Make the breathing animation immediately understandable.
- Clearly indicate the current breathing phase.
- Provide easily accessible pause/resume/exit controls.
- Avoid distracting animations or notifications.
- Be accessible and usable without requiring precise tapping.
- Keep the breathing session focused on the visual guide.

The breathing session should be the central experience rather than a feature-heavy interface.

---

# 15. Accessibility

The application should be usable by people with different levels of visual and motor ability.

The interface should:

- Use sufficiently large touch targets.
- Provide clear text labels for controls.
- Maintain sufficient text/background contrast.
- Not rely exclusively on color to communicate the breathing phase.
- Provide accessible labels for buttons and interactive controls.
- Ensure keyboard navigation works on desktop, including `Space` to pause and
  resume and `Escape` to exit while a session is running.

A reduced-motion alternative to the breathing animation is **out of scope** for
this version. The moving bubble is the core of the experience and a smooth,
slow, single-axis motion is itself calming rather than agitating; a static
substitute would not represent the exercise. The phase is always also conveyed
in text, so the animation is never the sole channel for the breathing state.

---

# 16. Audio

A short sound must be played when a session is successfully completed.

The sound should:

- Be short.
- Be gentle and non-intrusive.
- Clearly indicate completion.
- Not play when the user exits a session.
- Not play when the session is paused.
- Not play while the application is hidden or the device is locked. Because the
  session auto-pauses in those cases (§6.4), completion cannot occur while the
  user is away, so the sound only ever plays to a user who is looking at or
  listening to an unlocked device.

The application should not require continuous audio during the breathing session unless this is added as a future feature.

---

# 17. User Flow

## Standard flow

```text
Open application
       ↓
Main Screen
       ↓
Select breathing profile
       ↓
Select duration
       ↓
Press "Begin"
       ↓
Breathing Session
       ↓
Inhale / Exhale cycle repeats
       ↓
Session reaches configured duration
       ↓
Completion sound
       ↓
Congratulations message
       ↓
Return to Main Screen
```

## Pause/resume flow

```text
Breathing Session
       ↓
     Pause
       ↓
     Paused
       ↓
    Resume
       ↓
Breathing Session
```

## Exit flow

```text
Breathing Session
       ↓
      Exit
       ↓
Confirmation
    ↙       ↘
Cancel      Exit
  ↓           ↓
Session     Main Screen
```

---

# 18. Functional Requirements

### FR-01 — Profile Selection
The user must be able to select one of four predefined breathing profiles.

### FR-02 — Profile Timing
Each profile must use its predefined inhale/exhale durations.

### FR-03 — Duration Selection
The user must be able to select a session duration from the eight presets: 1, 2, 3, 5, 8, 10, 15 and 20 minutes.

### FR-04 — Session Start
Pressing **Begin** must start a session using the selected profile and duration.

### FR-05 — Visual Breathing Guide
The application must visually represent inhalation and exhalation through the vertical movement of a bubble.

### FR-06 — Timing Synchronization
Bubble movement and the breathing phase indicator must match the configured inhale/exhale durations.

### FR-07 — Session Timer
The application must track the remaining total active session time, and display
it only while the session is paused and in the exit confirmation dialog — never
during active breathing.

### FR-08 — Pause
The user must be able to pause an active session.

### FR-09 — Pause State Preservation
Pausing must preserve the exact session state, including total session progress and position within the current breathing phase.

### FR-10 — Resume
The user must be able to resume a paused session from exactly where it was paused.

### FR-11 — Pause Timing
Time spent while paused must not count toward the configured session duration.

### FR-12 — Exit
The user must be able to terminate the current session and return to the main screen.

### FR-13 — Exit Confirmation
The application should ask for confirmation before terminating an active or paused session.

### FR-14 — Exit Behavior
Exiting a session must discard the current session and must not trigger the completion state.

### FR-15 — Session Completion
The session must automatically end once the selected active duration has elapsed and the current exhale has finished, without truncating any breathing phase.

### FR-16 — Completion Notification
The application must play a short completion sound when the session finishes successfully.

### FR-17 — Completion Message
The application must display a congratulatory message after successful completion.

### FR-18 — Information
The application must provide information about breathing exercises and links to external resources.

### FR-19 — Responsive UI
The application must adapt to desktop, tablet, and mobile screen sizes.

### FR-20 — PWA
The application must be installable and usable as a PWA on supported browsers.

### FR-21 — Offline Operation
The core breathing functionality should remain usable without an active internet connection after the application has been initially loaded or installed.

### FR-22 — Accessibility
The application must provide accessible controls, sufficient contrast, and keyboard navigation where applicable.

### FR-23 — Automatic Pause
The application must pause the session automatically when it becomes hidden or the device screen is locked, and must not resume without an explicit user action.

### FR-24 — Language Selection
The user must be able to choose the interface language from the main screen. The choice must apply immediately across every screen and be remembered on the device.

### FR-25 — Translated Interface
All user-visible text, including accessible labels, must come from message catalogues rather than being embedded in application logic, component markup or data modules.

---

# 19. Non-Functional Requirements

### Performance

- The breathing animation should remain smooth throughout a session.
- The animation must remain synchronized with the actual elapsed time.
- The application should start quickly.
- The application should avoid unnecessary network requests during a breathing session.

### Reliability

The breathing timer and animation must remain synchronized even if the browser experiences minor rendering delays.

The implementation should base session timing on actual elapsed time rather than assuming that animation frames or timer callbacks execute at perfectly regular intervals.

### Privacy

The application does not require user accounts or personal data.

No user data should be collected unless explicitly required by a future feature.

---

# 20. Future Extensibility

The initial implementation should keep the breathing profiles and durations easy to extend.

Future versions may add features such as:

- Additional breathing profiles.
- Custom inhale/exhale timings.
- Optional audio guidance.
- Background sounds.
- Session history.
- Statistics.
- Themes.
- More sophisticated breathing animations.

These features are **out of scope for the initial version** and should not complicate the core implementation.
