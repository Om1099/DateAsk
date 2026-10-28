# Audio

Everything in this folder is served as-is. File names must match `src/data/romanticConfig.js` **exactly**, upper/lower case included. Windows doesn't mind if they differ, but the live site does.

| File | Used for | Config |
| --- | --- | --- |
| `hangover.mp3` | Song card 01 · Hangover | `songs.clips[0].src` |
| `itniSiBaat.mp3` | Song card 02 · Itni Si Baat | `songs.clips[1].src` |
| `beIntehan.mp3` | Song card 03 · Be Intehaan | `songs.clips[2].src` |
| `medley_web_192k.mp3` | Background music under the whole page | `music.src` |

- **Nothing autoplays.** Song clips play only when she taps their button. The background music starts only after she taps "Open your second little surprise ♡" or the ♫ button.
- **To swap a clip,** replace the file, keeping the name, or point `src` at a new name. A missing or unplayable file shows "This little clip is still on its way ♡" on its card; nothing breaks.
- **MP3 or M4A (AAC)** both play in every modern browser, including iPhone Safari.
- **Keep files light for mobile data.** The current clips are 320 kbps (2.3–3.9 MB each). 160–192 kbps would roughly halve them with no audible difference on phone speakers or earphones.
- **Loudness:** each clip's `gain` in the config evens out how loud the three sound. If you replace a clip, re-check that number.

Restart `npm run dev` (or rebuild) if a newly added file doesn't show up.
