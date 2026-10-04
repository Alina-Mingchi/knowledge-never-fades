# Spoken agent dialogue

## What will change
- Add browser speech playback for the Capture agent using the currently selected language.
- Reveal each agent question progressively while it is being spoken, instead of showing the complete line at once.
- Keep the existing expert replies and event timing, and stop speech cleanly when the language changes or the page closes.
- Show a clear speaking/listening state and provide a replay control if browser autoplay blocks speech.

## Validation
- Verify speech is requested with the selected locale, dialogue text appears progressively, and cleanup cancels active speech.
- Check Capture on desktop and mobile and confirm the project remains error-free.

## Technical details
- Use the browser Speech Synthesis API, so no account or external voice service is required for this MVP.
- Keep the speech/timing behavior in a reusable client hook for future use in Map and Teach.
