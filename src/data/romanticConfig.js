/*
 * ✏️  romanticConfig.js — everything personal lives in this one file.
 *
 *  • Values marked ✏️ are meant to be changed.
 *  • Placeholders you can use inside any text (filled in automatically):
 *        {her}  her nickname (Jinudi)            {herName}  her name (Janvi)
 *        {me}   your nickname (Mari Bakudi)      {myName}   your name (Om)
 *        {originalDate}  "9 October"      {originalDay}  "9th October"     {originalStatus}  "Cancelled due to company work"
 *        {proposedDate}  "5 November"     {proposedDay}  "5th November"    {proposedFullDate}  "Thursday, 5 November 2026"
 *        {proposedDateLabel}  "5th November 2026"     {cities}  "Pune and Hyderabad"     {cityList}  "Pune, Hyderabad"
 *    Change a date or a city once below and every sentence follows.
 *  • Wrap words in *asterisks* inside titles to give them the italic accent.
 *  • Blank out any text ('') and the wording from defaults.js is used instead.
 */

/*
 * 📷 Photos live in public/photos and are written here as '/photos/name.jpeg'.
 *    The names must match the files exactly — upper/lower case included (the live site is case-sensitive).
 *    `focus` is where each crop centres ('50% 20%' = middle, near the top) so faces stay in frame;
 *    the full, uncropped photo is shown when she opens it.
 */

export const romanticConfig = {
  // ── Who this is for ────────────────────────────────────────────────────
  herName: 'Janvi', // ✏️
  herNickname: 'Jinudi', // ✏️ the name used most of the time
  alternateNicknames: ['Mari Janvi', 'Maru Galudiyu', 'Mari Bakudi'], // ✏️ shown in the "a.k.a." line of the note
  myName: 'Om', // ✏️
  myNickname: 'Mari Bakudi', // ✏️ used on the envelope and to sign the letter

  vibe: ['cute', 'playful', 'flirty', 'romantic'], // notes for future edits
  visualStyle: 'premium romantic editorial',

  // ── The first plan (in the past — only ever mentioned as cancelled) ────
  originalDate: '2026-10-09', // ✏️
  originalDateStatus: 'cancelled_due_to_company_work', // ✏️ key into the labels below
  originalDateStatusLabels: {
    cancelled_due_to_company_work: 'Cancelled due to company work',
  },
  workTravelContext: ['Pune', 'Hyderabad'], // ✏️ where work sent you

  // ── The new invitation ─────────────────────────────────────────────────
  // ✏️ YYYY-MM-DD — or null to leave the date undecided. Once this day has passed,
  //    the page switches to its "date to be decided together" wording on its own.
  proposedDate: '2026-11-05',
  proposedDateLabel: '5th November 2026', // ✏️ how the date is written in running text
  dateMode: 'editable', // ✏️ 'editable': she can suggest another day · 'fixed': only proposedDate is offered
  venueMode: 'surprise', // ✏️ 'surprise' keeps the venue a secret · 'revealed' shows `venue`
  venue: '', // ✏️ only used when venueMode is 'revealed'
  timeMode: 'to_be_decided', // ✏️ 'to_be_decided' · 'set' shows `time`
  time: '', // ✏️ e.g. '7:30 pm' — only used when timeMode is 'set'

  photoMode: 'our own photos', // notes for future edits — the gallery shows the photos listed below
  audioPath: '/audio/voice-note.mp3', // ✏️ see public/audio/README.md
  signatureLine: 'Every moment with you is my new favourite memory.', // ✏️ shown in the footer

  // ✏️ false (default): her answers live only in the open page and are forgotten on reload.
  //    true: her answer, outfit mood and date plan are remembered in her browser (localStorage).
  rememberChoices: false,

  // ── A · The opening ────────────────────────────────────────────────────
  hero: {
    eyebrow: 'the second official date invitation',
    headline: '{her}, I owe you a date… ❤️', // ✏️
    supporting:
      'Remember that little date I asked you about? Work decided to send me to {cities}, and our plan had to take a rain check. 🥲',
    reveal: 'But your boring boy hasn’t forgotten.',
    revealFollowUp:
      'And this time, I’m asking you again… with a little more effort, a little more romance, and hopefully a little less overthinking.',
    cta: 'Open your second little surprise ♡',
    scrollHint: 'scroll',
  },

  // ── B · The note: round two ────────────────────────────────────────────
  intro: {
    memo: {
      toLabel: 'To',
      akaPrefix: 'a.k.a.',
      fromLabel: 'From',
      from: '{myName}, your overthinking boyfriend',
      reLabel: 'Re',
      re: 'the second official date invitation',
    },
    headline: 'Round two, my favourite girl.', // ✏️
    // ✏️ One string per paragraph — each fades in gently as she reaches it.
    paragraphs: [
      'Our {originalDay} plan didn’t work out because work had other plans for me. {cityList}, responsibilities… you know how it goes.',
      'But one cancelled plan doesn’t mean I stopped wanting that time with you.',
      'So, {her}, here’s me asking again. No office meetings, no work interruptions if I can help it, and no ordinary ‘let’s just meet for a little while.’',
      'Just a proper date, a little adventure, some good conversations, and time with my favourite person.',
      'And yes… I remember that your wardrobe needs to approve the plan first. 😂❤️',
    ],
    tag: 'outfit approval: still pending', // the little swinging clothes tag
    annotation: 'Made with a little extra love ♡', // ✏️ the handwritten note
  },

  // ── C · Our little world — the two of you ──────────────────────────────
  gallery: {
    eyebrow: 'us, so far',
    title: 'Our little *world*',
    subtitle: 'A few of my favourite frames of us — and all the proof I need that we deserve many more.',
    backgroundWord: 'little world',
    hintPointer: 'hover to tilt · click to look closer',
    hintTouch: 'tap a photo to look closer',
    // ✏️ Your couple photos, in the order they're shown: one column on phones, rows of three on a laptop.
    //    The order tells a little story — playful → festive → the hug at the heart (5th, centre of the grid)
    //    → everyday & tender → your best-smiles photo as the finale. Edit the words freely.
    photos: [
      {
        src: '/photos/c5.jpeg',
        focus: '50% 65%',
        alt: 'A sunny selfie: {myName} grinning while {herName} pouts at the camera',
        mood: 'the famous pout',
        caption: 'That pout wins every argument. 😙',
      },
      {
        src: '/photos/c4.jpeg',
        focus: '50% 50%',
        alt: '{herName} striking a pose, one hand in her hair, while {myName} laughs beside her at a garba night',
        mood: 'garba night',
        caption: 'You posed. I couldn’t stop smiling at you.',
      },
      {
        src: '/photos/C1.jpeg',
        focus: '50% 20%',
        alt: '{myName} and {herName} under red party lights, with a lamp behind his head that looks just like a crown',
        mood: 'party mode',
        caption: 'Royalty, apparently. 👑',
      },
      {
        src: '/photos/c3.jpeg',
        focus: '50% 55%',
        alt: 'A soft, blurry mirror photo of {herName} in a black lehenga, with {myName} just behind her',
        mood: 'slightly blurry',
        caption: 'A little blurry, still a favourite. ♡',
      },
      {
        src: '/photos/c7.jpeg',
        focus: '50% 15%',
        alt: '{herName} smiling at the camera while {myName} hugs her close',
        mood: 'warm hugs',
        caption: 'You feel like home. ♡',
      },
      {
        src: '/photos/c9.jpeg',
        focus: '50% 22%',
        alt: 'A selfie of {myName} and {herName} at a table, captioned “8,162nd Day of my life”',
        mood: 'just another day',
        caption: 'Ordinary days are better with you.',
      },
      {
        src: '/photos/c6.jpeg',
        focus: '50% 55%',
        alt: '{myName} leaning his head against {herName}’s as she laughs, by a railing under the city lights',
        mood: 'city lights',
        caption: 'Making you laugh is my favourite hobby.',
      },
      {
        src: '/photos/c8.jpeg',
        focus: '50% 20%',
        alt: '{herName}, eyes closed and smiling, cheek to cheek with {myName}',
        mood: 'cheek to cheek',
        caption: 'My favourite place: right next to you.',
      },
      {
        src: '/photos/C2.jpeg',
        focus: '35% 50%',
        alt: '{myName} in an olive kurta and {herName} in a white dupatta, both smiling in front of glowing blue lights',
        mood: 'all dressed up',
        caption: 'You, me, and our best smiles.',
      },
    ],
  },

  // ── D · The blooming heart tree ────────────────────────────────────────
  tree: {
    eyebrow: 'little by little',
    headline: 'Little things can become something *beautiful.*', // ✏️
    supporting: 'And sometimes, the nicest memories start with one simple question.', // ✏️
    caption: 'it all starts with something small ♡',
  },

  // ── E · A letter, just for you ─────────────────────────────────────────
  letter: {
    eyebrow: 'a letter, just for you',
    label: 'There’s something I wanted to tell you…', // ✏️
    openLabel: 'Open my letter',
    reopenLabel: 'Read it again ♡',
    closeLabel: 'Fold it back up',
    envelopeTo: 'for {her}',
    envelopeFrom: 'from {me}',
    backgroundWord: 'love letter',
    // ✏️ The whole letter, in your own words. A blank line starts a new paragraph.
    //    The first short line becomes the greeting; everything from "With love," on is the sign-off,
    //    and its last short line is written as your handwritten signature.
    text: `Hey, {her},

I was thinking about how some of the nicest moments aren't necessarily the biggest ones.

Sometimes, they're simply sitting together, talking about absolutely anything, laughing at silly things, and forgetting to check the time.

I don't need everything to be perfectly planned. I don't need a grand evening or a movie-like moment.

I'd just love to make a little space for more memories with you.

And yes, I know your wardrobe has a very important role in deciding whether this date can happen. I respect the process. 😂

But whatever you wear, and whatever we decide to do, what matters most to me is getting to spend a little time with my favourite person.

No pressure, no perfect expectations. Just us, some good conversations, a little fun, and hopefully a memory we'll smile about later.

So, my {her}…

Keep scrolling. I have one last question for you. ❤️

With love,

Your boring, non-talkative, overthinking boyfriend,

{me} ♡`,
  },

  // ── F · A little voice note ────────────────────────────────────────────
  voiceNote: {
    eyebrow: 'a little voice note',
    caption: 'A little message, just for you.', // ✏️
    title: '{her}, this one’s for you.',
    missingMessage: 'The voice note hasn’t been added yet — your boring boy is still practising what to say ♡',
  },

  // ── G · The official date investigation: round two ─────────────────────
  wardrobe: {
    headline: 'The official date investigation: Round Two 👗',
    subheading: '',
    body: 'Before the date can be approved, {her} must complete her outfit inspection.',
    caseLabel: 'Case file no. 2 · reopened',
    caseFile: 'Re: The Second Official Date Invitation ❤️',
    reviewingLabel: 'reviewing',
    // `kind` picks the little visual next to each value: cancelled · proposal · progress · meter · classified
    status: [
      { id: 'previous', kind: 'cancelled', label: 'Previous date', value: '{originalDate}', note: '{originalStatus}' },
      {
        id: 'proposal',
        kind: 'proposal',
        label: 'Current proposal',
        value: '{proposedDate}',
        valueNoDate: 'To be decided together',
        note: 'Awaiting {her}’s decision',
      },
      {
        id: 'wardrobe',
        kind: 'progress',
        label: 'Wardrobe investigation',
        value: 'Probably still important',
        concludedValue: 'Concluded',
        concludedNote: 'verdict: {outfit}',
      },
      {
        id: 'overthinking',
        kind: 'meter',
        label: 'Boyfriend’s overthinking level',
        value: 'Back in business',
        note: 'cause: my favourite overthinking problem',
      },
      { id: 'venue', kind: 'classified', label: 'Venue', value: 'Classified until we decide what works' },
    ],
    stamp: ['Second attempt.', 'Extra effort.', 'Same girl. ❤️'], // ✏️ the little rubber stamp, one line each
    // ✏️ "Exhibit A": her photo, clipped into the case file once it has been reviewed. Delete this block to hide it.
    exhibit: {
      photo: '/photos/s1.jpeg',
      focus: '50% 40%',
      alt: '{herName} smiling over her shoulder in a festive outfit, with warm lights glowing behind her',
      tag: 'Exhibit A',
      label: 'Evidence on file',
      title: 'Every outfit on record: approved.',
      finding: 'Finding: you look stunning in everything. ♡',
    },
    inspectLabel: 'Inspect my outfit options',
    continueLabel: 'Let the investigation continue',
    boardTitle: 'A few gentle suggestions from the committee',
    boardNote: 'Purely for fun — there are no rules here, and choosing is completely optional.',
    // ✏️ Outfit moods. `art` is one of: sweater, dress, tee, hanger, mirror.
    options: [
      { id: 'comfy', art: 'sweater', label: 'Cute and comfy', caption: 'soft knits & warm colours', swatches: ['#f6dce2', '#e9d6c5', '#fffaf3'] },
      { id: 'elegant', art: 'dress', label: 'Elegant and dressed up', caption: 'a little sparkle for a special evening', swatches: ['#703d4b', '#f3e6d5', '#2f2427'] },
      { id: 'casual', art: 'tee', label: 'Casual and effortless', caption: 'easy, breezy, effortlessly you', swatches: ['#c9d3dc', '#ffffff', '#e6d3b8'] },
      { id: 'unexpected', art: 'hanger', label: 'Something unexpected', caption: 'surprise me (and the committee)', swatches: ['#b88670', '#9aa48e', '#c98a9a'] },
      { id: 'whatever', art: 'mirror', label: 'I’ll wear whatever I feel like.', caption: 'Come as my {herName}.', swatches: ['#d99baa', '#b88670', '#703d4b'] },
    ],
    recordedMessage: 'Outfit decision recorded. The boyfriend remains impressed. ❤️',
    backgroundWord: 'round two',
  },

  // ── H · The big question ───────────────────────────────────────────────
  invitation: {
    lead: 'So… I have one more question for you.',
    teases: ['Work stole our first plan…', 'But can I try again?'],
    // ✏️ "then → next": your first-date photo beside an empty frame saved for the new date.
    //    After her yes, the empty frame gets an "approved" stamp. Delete this block to hide it.
    firstDate: {
      photo: '/photos/d1.jpeg',
      focus: '50% 56%',
      alt: '{herName} in the car with a big bouquet of roses in her arms, the photo stamped “Monday 20:53”',
      label: 'then',
      caption: 'Our very first date ♡',
      nextLabel: 'next',
      reservedLabel: 'saved for',
      reservedNoDate: 'our next date', // used once {proposedDate} has passed
      nextCaption: 'Our next one?',
      nextCaptionYes: 'Our next one ♡',
      stamp: 'Approved ♡',
    },
    question: '{her}, will you go on a date with me on {proposedDay}? ❤️', // ✏️
    questionNoDate: '{her}, will you go on a date with me? ❤️', // used if proposedDate is empty or has passed
    message:
      'No office rush, no random little meeting. Just you and me, good food, good conversations, a little fun, and a memory that’s ours.',
    cardLabel: 'The second official date invitation',
    dateLine: '{proposedFullDate}',
    dateLineNoDate: 'Date: to be decided together',
    details: [
      { id: 'venue', label: 'Venue', value: 'A surprise, to be revealed when we plan it together.' },
      { id: 'time', label: 'Time', value: 'To be decided together.' },
      {
        id: 'dress',
        label: 'Dress code',
        value: 'Whatever makes you feel like yourself. Your wardrobe is welcome to submit its final report. 😂❤️',
      },
    ],
    yesLabel: 'YES! Let’s make it happen 💗',
    planFirstLabel: 'Tell me the plan first 👀',
    planFirstMessages: [
      'Fair enough, Madam. After the first plan got interrupted by company work, you deserve to know what you’re signing up for. 😂❤️',
      'Let’s decide together. You choose the vibe, I’ll work on the surprise.',
    ],
    planTogetherLabel: 'Let’s plan it together',
    success: {
      headline: 'ROUND TWO APPROVED. ♡',
      message: '{her} said yes! Now let’s make a lovely plan together.',
      kicker: '{proposedDate} — our little date, if the plan works for both of us.',
      kickerNoDate: 'Our little date — whenever works for both of us.',
      pickDateLabel: 'Let’s pick the details',
      replayLabel: 'Replay my little surprise',
    },
  },

  // ── Date-preference panel (optional; nothing is ever sent anywhere) ─────
  datePlanner: {
    title: 'Let’s plan our little date',
    subtitle: 'Everything here is optional — pick whatever sounds lovely ♡',
    whatLabel: 'What sounds lovely?',
    whenLabel: 'When works for you?',
    whenHint: 'If {proposedDateLabel} doesn’t work, just suggest another day ♡',
    proposedNote: '{myName}’s suggestion ♡',
    undecidedLabel: 'To be decided together',
    customDateLabel: 'or suggest another day',
    noteLabel: 'Anything else? (optional)',
    notePlaceholder: 'Cravings, outfit hints, secret wishes… I’m all ears.',
    saveLabel: 'Save our plan',
    cancelLabel: 'Maybe later',
    emptyHint: 'Pick at least one little thing to save ♡',
    privacyNote: 'Nothing gets sent anywhere — your picks stay right here on this page.',
    privacyNoteRemembered: 'Nothing gets sent anywhere — your picks are kept only in this browser.',
    savedTitle: 'Noted ♡',
    savedMessage: 'Here’s our little plan. Nothing has been sent anywhere — copy it if you’d like to send it to me.',
    copyLabel: 'Copy our plan',
    copiedLabel: 'Copied!',
    copyFailedLabel: 'Couldn’t copy — a screenshot works too ♡',
    copyHint: 'Send it to your boring boy whenever you like ♡',
    editLabel: 'Edit',
    resetLabel: 'Reset my choices',
    doneLabel: 'Done',
    summaryLabel: 'Our plan:',
    // ✏️ Date ideas. `icon` is one of: coffee, dinner, sunset, gift, relaxed, sparkles, heart.
    options: [
      { id: 'cafe', icon: 'coffee', label: 'Café and conversation', description: 'Warm drinks, a cozy corner, and talking for hours.' },
      { id: 'dinner', icon: 'dinner', label: 'Dinner together', description: 'Good food, soft lighting, and a dessert to share.' },
      { id: 'sunset', icon: 'sunset', label: 'A sunset walk', description: 'Golden hour, no destination, just us.' },
      { id: 'surprise', icon: 'gift', label: 'A little surprise outing', description: 'You just show up — I’ll plan something sweet.' },
      { id: 'relaxed', icon: 'relaxed', label: 'A relaxed day together', description: 'No rush, no plans, just a slow and easy day.' },
      { id: 'you-choose', icon: 'sparkles', label: 'You choose for us', description: 'Leave it to me. I’ll pick something you’ll love.' },
    ],
    // ✏️ Extra day choices (proposedDate is added first automatically while it's upcoming).
    days: [
      { value: 'this-weekend', label: 'This weekend' },
      { value: 'next-weekend', label: 'Next weekend' },
      { value: 'weeknight', label: 'A cozy weeknight' },
      { value: 'any', label: 'Whenever suits you' },
    ],
  },

  footer: {
    line: 'Made with a little extra love ♡',
    credit: 'Your boring boy made this just for you.',
    replayLabel: 'Replay my little surprise',
    clearLabel: 'Clear saved answers',
    clearedLabel: 'All cleared ♡',
  },
}
