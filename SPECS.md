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

The user must select a session duration before starting.

Available durations range from **3 to 20 minutes**, in one-minute increments:

- 3 minutes
- 4 minutes
- 5 minutes
- ...
- 20 minutes

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

The user can select a duration between 3 and 20 minutes.

The currently selected duration must be visually distinguishable.

### 4.3 Begin Button

A prominent **Begin** button starts the breathing session using the selected profile and duration.

The Begin button should be disabled or otherwise unavailable until valid profile and duration selections exist.

## Default Selection

The application should provide sensible defaults when first opened.

Suggested defaults:

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

The animation continues until the configured session duration has elapsed.

## 5.2 Breathing Phase Indicator

The current breathing phase should be clearly indicated to the user.

Possible labels:

- **Breathe in**
- **Breathe out**

The phase indicator should change in synchronization with the bubble animation.

## 5.3 Session Timer

The screen should display the remaining session time.

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
EXITED
```

## State transitions

```text
IDLE
  │
  │ Begin
  ▼
RUNNING
  │  │
  │  └── Exit ──→ EXITED → Main Screen
  │
  └── Pause
        ↓
      PAUSED
        │  │
        │  └── Exit ──→ EXITED → Main Screen
        │
        └── Resume
              ↓
           RUNNING
              │
              │ Duration elapsed
              ▼
          COMPLETED
              │
              ▼
         Main Screen
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
- The session ends when the configured active session time has elapsed.

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

---

# 11. PWA Requirements

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

# 12. Mobile and Responsive Design

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
│   Strengthen             5 minutes      │
│   Chill                  10 minutes     │
│   Balance                15 minutes     │
│   Beginner               20 minutes     │
│                                         │
│              [ BEGIN ]                  │
└─────────────────────────────────────────┘
```

On small screens, the layout may stack vertically while preserving the same functionality and logical ordering.

The breathing session itself should work in both portrait and landscape orientations.

---

# 13. Design Principles

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

# 14. Accessibility

The application should be usable by people with different levels of visual and motor ability.

The interface should:

- Use sufficiently large touch targets.
- Provide clear text labels for controls.
- Maintain sufficient text/background contrast.
- Not rely exclusively on color to communicate the breathing phase.
- Provide accessible labels for buttons and interactive controls.
- Ensure keyboard navigation works on desktop.
- Respect the user's reduced-motion preference where practical.

If reduced motion is enabled, the application should provide an alternative visual representation of the breathing state while maintaining the correct breathing timing.

---

# 15. Audio

A short sound must be played when a session is successfully completed.

The sound should:

- Be short.
- Be gentle and non-intrusive.
- Clearly indicate completion.
- Not play when the user exits a session.
- Not play when the session is paused.

The application should not require continuous audio during the breathing session unless this is added as a future feature.

---

# 16. User Flow

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

# 17. Functional Requirements

### FR-01 — Profile Selection
The user must be able to select one of four predefined breathing profiles.

### FR-02 — Profile Timing
Each profile must use its predefined inhale/exhale durations.

### FR-03 — Duration Selection
The user must be able to select a session duration from 3–20 minutes in one-minute increments.

### FR-04 — Session Start
Pressing **Begin** must start a session using the selected profile and duration.

### FR-05 — Visual Breathing Guide
The application must visually represent inhalation and exhalation through the vertical movement of a bubble.

### FR-06 — Timing Synchronization
Bubble movement and the breathing phase indicator must match the configured inhale/exhale durations.

### FR-07 — Session Timer
The application must display the remaining total active session time.

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
The session must automatically end when the selected active duration has elapsed.

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
The application must provide accessible controls, sufficient contrast, keyboard navigation where applicable, and should respect reduced-motion preferences.

---

# 18. Non-Functional Requirements

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

# 19. Future Extensibility

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
