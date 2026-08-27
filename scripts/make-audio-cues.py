#!/usr/bin/env python3
"""Generate the breathing phase cue tones (src/assets/audio/inhale.wav, exhale.wav).

The cues are not recordings: they are two soft synthetic bells, kept here so the
timbre is reproducible and tunable rather than an opaque binary. Run only when
the sound design changes; the committed .wav files are what the build uses.
The end-of-session chime (complete.wav) is not regenerated here.

    python3 scripts/make-audio-cues.py

Design — the same family as the completion chime, which is a D5 -> G5 bell at
22050 Hz mono:

  * inhale cue (plays when an exhale ends) - D4, the bottom of the breath
  * exhale cue (plays when an inhale ends) - A4, the top of the breath

A fifth apart, both consonant with the completion chime, and an octave below it,
so a cue heard every few seconds never competes with the end-of-session sound.
Each is one short strike with a soft attack and an exponential decay; the
harmonics decay faster than the fundamental, which is what makes it read as a
bell rather than a beep.
"""

import math
import struct
import wave
from pathlib import Path

RATE = 22050  # Matches complete.wav. Plenty for tones under 1.5 kHz.
OUT = Path(__file__).resolve().parent.parent / 'src' / 'assets' / 'audio'

DURATION = 0.60  # Short: the cue is over well before the phase develops.
ATTACK = 0.012  # Soft enough to have no click, fast enough to mark the instant.
DECAY = 0.20  # Time constant of the fundamental's exponential decay.
PEAK = 0.28  # Fraction of full scale. Deliberately below the completion sound.
HARMONICS = ((1, 1.0), (2, 0.15), (3, 0.05))  # (multiple, relative amplitude)
TAIL = 0.01  # Final fade, so the buffer cannot end on a step.

CUES = {
    'inhale': 293.665,  # D4
    'exhale': 440.000,  # A4
}


def render(freq):
    frames = int(RATE * DURATION)
    scale = sum(amplitude for _, amplitude in HARMONICS)
    samples = []
    for index in range(frames):
        t = index / RATE
        # Linear attack into an exponential decay.
        envelope = min(1.0, t / ATTACK) if ATTACK else 1.0
        if DURATION - t < TAIL:
            envelope *= (DURATION - t) / TAIL
        value = 0.0
        for multiple, amplitude in HARMONICS:
            # Higher partials fade first, as they do in a struck bell.
            partial_decay = DECAY / multiple
            value += amplitude * math.exp(-t / partial_decay) * math.sin(
                2 * math.pi * freq * multiple * t
            )
        value = value * envelope / scale
        samples.append(int(max(-1.0, min(1.0, value * PEAK)) * 32767))
    return samples


def write(name, samples):
    path = OUT / f'{name}.wav'
    with wave.open(str(path), 'w') as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(RATE)
        out.writeframes(struct.pack(f'<{len(samples)}h', *samples))
    print(f'{path.name}  {len(samples) / RATE:.2f}s  {path.stat().st_size} bytes')


if __name__ == '__main__':
    for cue_name, frequency in CUES.items():
        write(cue_name, render(frequency))
