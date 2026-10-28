# DateAsk — the second official date invitation

A private, scroll-driven date invitation from Om ("Mari Bakudi") to Janvi ("Jinudi"). The first plan, 9 October 2026, was cancelled when work sent Om to Pune and Hyderabad. This is round two: a fresh invitation for **Thursday, 5 November 2026**.

It's built with **React 19 + Vite**, **Tailwind CSS 4**, **Motion** (Framer Motion), **Lucide** icons and **canvas-confetti**.

```bash
npm install
npm run dev       # → http://localhost:5173
npm run build     # production build in /dist
npm run preview   # serve the production build locally
```

## The journey

*A cancelled plan → a playful comeback → a personal romantic surprise → a fresh invitation for 5 November.*

1. **Opening.** "Jinudi, I owe you a date… ❤️", the Pune and Hyderabad rain check, "But your boring boy hasn't forgotten.", then **Open your second little surprise ♡**.
2. **Round two, my favourite girl.** A paper memo (To / From / Re) with her nicknames. The note acknowledges the cancelled plan briefly and moves on to the new ask.
3. **Our little world.** Nine of your couple photos as overlapping polaroids with tilt, each cropped around your faces. Tapping one opens the whole, uncropped photo in a lightbox.
4. **The heart tree.** An original SVG. The trunk draws itself, branches follow, and heart leaves bloom into a heart-shaped canopy.
5. **The letter.** A wax-sealed envelope that opens and can be closed and reopened. It's signed "Mari Bakudi ♡".
6. **The voice note.** A custom player around a real `<audio>` element. It never autoplays.
7. **The official date investigation: Round Two 👗.** The case file shows:
   - previous date: struck through, *cancelled due to company work*
   - current proposal: 5 November, *awaiting Jinudi's decision*
   - wardrobe investigation: *probably still important*
   - overthinking: *back in business*
   - venue: *classified*

   Then **Exhibit A**: her solo photo, paper-clipped into the file ("Every outfit on record: approved. Finding: you look stunning in everything. ♡"). Next comes the "Second attempt. Extra effort. Same girl. ❤️" stamp and an optional outfit mood board. Picking an outfit never counts as a yes.
8. **The big question.** "So… I have one more question for you." → "Work stole our first plan…" → "But can I try again?" → **then → next**: your first-date photo beside an empty frame "saved for 5 November" → **"Jinudi, will you go on a date with me on 5th November? ❤️"**. After a yes, the empty frame gets an "Approved ♡" stamp. The ask also has an invitation card (Thursday, 5 November 2026 · venue · time · dress code). Then **YES! Let's make it happen 💗** ("ROUND TWO APPROVED. ♡") or **Tell me the plan first 👀** ("Fair enough, Madam…" plus an optional planner where she can suggest a different day).

## Make it yours (`src/data/romanticConfig.js`)

Everything personal lives in **one file**, and fields marked ✏️ are meant to be edited.

| Setting | What it does |
| --- | --- |
| `herName`, `herNickname`, `alternateNicknames` | Janvi / Jinudi / the "a.k.a." list in the note |
| `myName`, `myNickname` | Om / Mari Bakudi (envelope, letter signature, "Om's suggestion") |
| `originalDate`, `originalDateStatus`, `originalDateStatusLabels` | The first plan (9 October) and why it didn't happen ("Cancelled due to company work"). It's only ever mentioned in the past tense. |
| `workTravelContext` | `['Pune', 'Hyderabad']`, which fills `{cities}` ("Pune and Hyderabad") and `{cityList}` ("Pune, Hyderabad") |
| `proposedDate`, `proposedDateLabel` | The new date (`'2026-11-05'`) and how it's written in running text ("5th November 2026"). Set `null` to leave it undecided. |
| `dateMode` | `'editable'`: she can suggest another day · `'fixed'`: only the proposed date |
| `venueMode`, `venue` · `timeMode`, `time` | `'surprise'` / `'to_be_decided'` keep them open; `'revealed'` / `'set'` show `venue` / `time` |
| `audioPath`, `signatureLine`, `rememberChoices` | Voice note path, footer quote, persistence (see below) |
| `hero`, `intro`, `gallery`, `tree`, `letter`, `voiceNote`, `wardrobe`, `invitation`, `datePlanner`, `footer` | All the wording, section by section |

**Placeholders.** Write these inside any text and they're filled from the settings above. Change a date or a city once and every sentence follows.

| Placeholder | Filled with |
| --- | --- |
| `{her}`, `{herName}` | Jinudi, Janvi |
| `{me}`, `{myName}` | Mari Bakudi, Om |
| `{originalDate}`, `{originalDay}`, `{originalStatus}` | "9 October", "9th October", "Cancelled due to company work" |
| `{proposedDate}`, `{proposedDay}` | "5 November", "5th November" |
| `{proposedFullDate}`, `{proposedDateLabel}` | "Thursday, 5 November 2026", "5th November 2026" |
| `{cities}`, `{cityList}` | "Pune and Hyderabad", "Pune, Hyderabad" |

Dates are always written the British/Indian way, whatever language her phone uses.

**When 5 November has passed** (or `proposedDate` is `null`), the page switches by itself to the version without a date: "Jinudi, will you go on a date with me? ❤️", "Date: to be decided together", and no date suggestion in the planner. It never asks about a day that has already gone by.

- The whole letter is **one string** (`letter.text`), and a blank line starts a new paragraph. The block starting at "With love," becomes the sign-off, and its last short line is drawn as the handwritten signature.
- If you blank out a field, the neutral wording in `src/data/defaults.js` is used, so nothing breaks.
- Colours are CSS variables at the top of `src/index.css`. Section order is in `src/App.jsx`.

### Photos

Your photos live in `public/photos/` and are listed in `romanticConfig.js` as `'/photos/name.jpeg'`:

| Where | Config | Photo |
| --- | --- | --- |
| Our little world (gallery) | `gallery.photos` | `c1`–`c9`, the couple photos, in the order shown |
| Wardrobe case file, "Exhibit A" | `wardrobe.exhibit` | `s1`, her solo photo |
| The big question, "then → next" | `invitation.firstDate` | `d1`, your first date |

- **File names must match exactly, including upper/lower case.** Windows doesn't mind, but the live site does: `C1.jpeg` and `c1.jpeg` are different files there. All names are lowercase now.
- `focus` sets where each crop centres (`'50% 20%'` = middle, near the top), so faces stay in frame. The full photo is shown when she opens it.
- Each photo has a `caption`, a small `mood` label and `alt` text (read aloud by screen readers). Edit any of them freely.
- To hide Exhibit A or the then → next pair, delete that block. The rest of the page carries on as before.
- A photo that can't load shows a soft "photo coming soon ♡" card instead of a broken image.

### Voice note

Save your recording as **`public/audio/voice-note.mp3`** (more tips in `public/audio/README.md`). The player then shows the real duration and plays only when she presses play. Until the file exists, the button stays disabled and she sees: "The voice note hasn't been added yet — your boring boy is still practising what to say ♡".

## Her answers & privacy

- **No tracking, analytics, accounts or form submissions.** Nothing she clicks or types leaves her device, and the page never claims to have sent anything.
- **The new date is an invitation, not an assumption.** Neither answer is preselected. Choosing an outfit never counts as a yes, and the celebration says "if the plan works for both of us".
- **By default (`rememberChoices: false`)** her answer, outfit mood and date plan live only in the open page and are forgotten when she reloads.
- **With `rememberChoices: true`** they are kept in her browser's `localStorage` (keys `little-date:answer`, `little-date:outfit`, `little-date:plan`), and a **Clear saved answers** link appears in the footer. Switching back to `false` forgets anything stored earlier.
- In the planner she can **Edit** or **Reset my choices**, and suggest another day. **Copy our plan** puts a short summary on her clipboard, and she decides whether to send it.
- **Replay my little surprise** glides back to the top and asks again from the start. Her date plan is kept.
- Fonts and photos are bundled with the site, so the page makes no outside requests at all. It also asks search engines not to index it (`noindex`).

## Deploy & share privately

`npm run build` produces a static `dist/` folder that works on any static host. Asset paths are relative, so it also works in a sub-folder.

- **Netlify Drop (quickest):** drag the `dist/` folder onto <https://app.netlify.com/drop> to get a link in seconds.
- **Vercel / Netlify / Cloudflare Pages:** import the GitHub repo. These work with a **private** repo. Use build command `npm run build` and output folder `dist`.
- **GitHub Pages:** works too, but on free plans the repository must be **public**, which means the letter, both your names and your photos can be seen on GitHub by anyone.

To keep it between the two of you:

- Use an unguessable site name (e.g. `jinudi-7f3k.netlify.app`) and send the link directly. Don't post it anywhere.
- For real access control, put a password in front. Cloudflare Pages + Cloudflare Access has a free tier; Netlify and Vercel offer password protection on paid plans.
- If the GitHub repo is public, make it private (Settings → General → Danger Zone → Change visibility). The commit history already contains the names and the letter. Photos pushed to a public repo stay in its history even after they're deleted.
- Whatever the host, the photos on the live site can be opened by anyone who has the link.

## Project structure

```
src/
  data/romanticConfig.js   ← edit me: names, dates, cities, words, photos, audio, options
  data/defaults.js         ← neutral fallback wording (used when a field is empty)
  data/index.js            ← merges the two and fills the {placeholders}
  sections/                ← Hero, Intro, MemoryGallery, BloomingTree, LoveLetter, VoiceNote,
                             WardrobeInvestigation, DateInvitation, Footer
  components/              ← Heart3D, TiltCard, VoiceNotePlayer, DatePreferencePanel, OutfitArt, Modal, …
  hooks/                   ← reduced-motion preference, persisted state, focus trap, scroll lock
  lib/                     ← dates, plan formatting, confetti, scrolling, storage, helpers
public/
  audio/                   ← voice-note.mp3 goes here (see the README inside)
  photos/                  ← your own photos
```

## Accessibility & performance

- Semantic sections and headings, labelled controls, alt text, visible focus rings, and keyboard support (lightbox arrows/Escape, a seekable player, focus-trapped dialogs, radio groups for outfit moods and date ideas).
- `prefers-reduced-motion` is honoured: no parallax, petals, confetti or looping motion, and content appears without movement.
- Scroll effects use Motion values (no per-frame React renders) and animate only `transform`/`opacity`. Petals are few and pure CSS where possible, and there are no full-screen blurs.
- Hover-only effects (tilt, magnetic buttons, cursor glow) run only for mouse users. Touch devices get tap feedback instead.

## Troubleshooting

- npm may print an `allow-scripts` warning about **esbuild** during install. The build still works; run `npm approve-scripts esbuild` to silence it.
