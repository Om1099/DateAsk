# Voice note

Put your recording in this folder as **`voice-note.mp3`**.
The path comes from `audioPath` in `src/data/romanticConfig.js`.

- **MP3 or M4A (AAC)** both play in every modern browser, including iPhone Safari. If you use M4A, set `audioPath: '/audio/voice-note.m4a'`.
- **Keep it light.** Under about 2 MB loads quickly on mobile data, which is roughly two minutes at 128 kbps.
- **It never autoplays.** It only plays when she taps the play button.
- **Until the file is here**, the player stays disabled and shows a friendly "not added yet" note. It never pretends to play.

Restart `npm run dev` (or rebuild) if the player doesn't pick up a newly added file.
