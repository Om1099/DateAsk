/*
 * Fallback wording — you don't need to edit this file (edit romanticConfig.js).
 * If a field in romanticConfig.js is missing or left empty, the value here is used,
 * so the site keeps working even with an incomplete config. It deliberately avoids
 * specific dates and places, so a blank field never produces a half-finished sentence.
 */

export const defaults = {
  herName: '',
  herNickname: '',
  alternateNicknames: [],
  myName: '',
  myNickname: '',
  vibe: [],
  visualStyle: '',

  originalDate: null,
  originalDateStatus: '',
  originalDateStatusLabels: {
    cancelled_due_to_company_work: 'Cancelled due to company work',
  },
  workTravelContext: [],

  proposedDate: null,
  proposedDateLabel: '',
  dateMode: 'editable',
  venueMode: 'surprise',
  venue: '',
  timeMode: 'to_be_decided',
  time: '',
  photoMode: 'romantic placeholders',
  audioPath: '/audio/voice-note.mp3',
  signatureLine: '',
  rememberChoices: false,

  hero: {
    eyebrow: 'a little date invitation',
    headline: '{her}, I owe you a date… ❤️',
    supporting: 'Remember that little date I asked you about? Work had other plans, and ours had to take a rain check. 🥲',
    reveal: 'But I haven’t forgotten.',
    revealFollowUp: 'And this time, I’m asking you again… with a little more effort and a little more romance.',
    cta: 'Open your little surprise ♡',
    scrollHint: 'scroll',
  },

  intro: {
    memo: {
      toLabel: 'To',
      akaPrefix: 'a.k.a.',
      fromLabel: 'From',
      from: '{myName}, your overthinking boyfriend',
      reLabel: 'Re',
      re: 'a little date invitation',
    },
    headline: 'Round two, my favourite girl.',
    paragraphs: [
      'Our first plan didn’t work out because work had other plans for me.',
      'But one cancelled plan doesn’t mean I stopped wanting that time with you.',
      'So here’s me asking again — for a proper date, a little adventure, and time with my favourite person.',
    ],
    tag: 'outfit approval: pending',
    annotation: 'Made with a little extra love ♡',
  },

  gallery: {
    eyebrow: 'our little world',
    title: 'Our little *world*',
    subtitle: 'Not our photos (yet) — just a little mood board of moments I’d love to share with you.',
    backgroundWord: 'little world',
    hintPointer: 'hover to tilt · click to look closer',
    hintTouch: 'tap a photo to look closer',
    photos: [
      {
        src: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80',
        alt: 'A sunny café table by the window with coffee and a little plant',
        mood: 'coffee & conversation',
        caption: 'A little coffee, a little conversation.',
      },
      {
        src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
        alt: 'A quiet beach glowing in soft evening light',
        mood: 'a sunset walk',
        caption: 'Somewhere we can forget the time.',
      },
      {
        src: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80',
        alt: 'Warm, heart-shaped bokeh lights on a dreamy evening',
        mood: 'a dreamy evening',
        caption: 'A little time away from everything else.',
      },
    ],
  },

  tree: {
    eyebrow: 'little by little',
    headline: 'Little things can become something *beautiful.*',
    supporting: 'And sometimes, the nicest memories start with one simple question.',
    caption: 'it all starts with something small ♡',
  },

  letter: {
    eyebrow: 'a letter, just for you',
    label: 'There’s something I wanted to tell you…',
    openLabel: 'Open my letter',
    reopenLabel: 'Read it again ♡',
    closeLabel: 'Fold it back up',
    envelopeTo: 'for {her}',
    envelopeFrom: 'from {me}',
    backgroundWord: 'love letter',
    text: `Hey, {her},

I was thinking about how some of the nicest moments aren't necessarily the biggest ones.

I'd just love to make a little space for more memories with you.

Keep scrolling. I have one last question for you. ❤️

With love,

{me} ♡`,
  },

  voiceNote: {
    eyebrow: 'a little voice note',
    caption: 'A little message, just for you.',
    title: 'A little voice note for you',
    missingMessage: 'The voice note hasn’t been added yet — check back a little later ♡',
  },

  wardrobe: {
    headline: 'The official date investigation: Round Two 👗',
    subheading: '',
    body: 'Before the date can be approved, {her} must complete her outfit inspection.',
    caseLabel: 'Case file · reopened',
    caseFile: 'Re: The Second Official Date Invitation ❤️',
    reviewingLabel: 'reviewing',
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
      { id: 'overthinking', kind: 'meter', label: 'Boyfriend’s overthinking level', value: 'Back in business' },
      { id: 'venue', kind: 'classified', label: 'Venue', value: 'Classified until we decide what works' },
    ],
    stamp: ['Second attempt.', 'Extra effort.', 'Same girl. ❤️'],
    inspectLabel: 'Inspect my outfit options',
    continueLabel: 'Let the investigation continue',
    boardTitle: 'A few gentle suggestions from the committee',
    boardNote: 'Purely for fun — there are no rules here, and choosing is completely optional.',
    options: [
      { id: 'comfy', art: 'sweater', label: 'Cute and comfy', caption: 'soft knits & warm colours', swatches: ['#f6dce2', '#e9d6c5', '#fffaf3'] },
      { id: 'elegant', art: 'dress', label: 'Elegant and dressed up', caption: 'a little sparkle for a special evening', swatches: ['#703d4b', '#f3e6d5', '#2f2427'] },
      { id: 'casual', art: 'tee', label: 'Casual and effortless', caption: 'easy, breezy, effortlessly you', swatches: ['#c9d3dc', '#ffffff', '#e6d3b8'] },
      { id: 'unexpected', art: 'hanger', label: 'Something unexpected', caption: 'surprise me (and the committee)', swatches: ['#b88670', '#9aa48e', '#c98a9a'] },
      { id: 'whatever', art: 'mirror', label: 'I’ll wear whatever I feel like.', caption: 'Come exactly as you are.', swatches: ['#d99baa', '#b88670', '#703d4b'] },
    ],
    recordedMessage: 'Outfit decision recorded. The boyfriend remains impressed. ❤️',
    backgroundWord: 'round two',
  },

  invitation: {
    lead: 'So… I have one more question for you.',
    teases: ['Work stole our first plan…', 'But can I try again?'],
    question: '{her}, will you go on a date with me on {proposedDay}? ❤️',
    questionNoDate: '{her}, will you go on a date with me? ❤️',
    message: 'Just you and me, good food, good conversations, a little fun, and a memory that’s ours.',
    cardLabel: 'The second official date invitation',
    dateLine: '{proposedFullDate}',
    dateLineNoDate: 'Date: to be decided together',
    details: [
      { id: 'venue', label: 'Venue', value: 'A surprise, to be revealed when we plan it together.' },
      { id: 'time', label: 'Time', value: 'To be decided together.' },
      { id: 'dress', label: 'Dress code', value: 'Whatever makes you feel like yourself.' },
    ],
    yesLabel: 'YES! Let’s make it happen 💗',
    planFirstLabel: 'Tell me the plan first 👀',
    planFirstMessages: [
      'Fair enough. You deserve to know what you’re signing up for. ♡',
      'Let’s decide together. You choose the vibe, I’ll work on the surprise.',
    ],
    planTogetherLabel: 'Let’s plan it together',
    success: {
      headline: 'ROUND TWO APPROVED. ♡',
      message: 'You said yes! Now let’s make a lovely plan together.',
      kicker: '{proposedDate} — our little date, if the plan works for both of us.',
      kickerNoDate: 'Our little date — whenever works for both of us.',
      pickDateLabel: 'Let’s pick the details',
      replayLabel: 'Replay my little surprise',
    },
  },

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
    copyHint: 'Send it to me whenever you like ♡',
    editLabel: 'Edit',
    resetLabel: 'Reset my choices',
    doneLabel: 'Done',
    summaryLabel: 'Our plan:',
    options: [
      { id: 'cafe', icon: 'coffee', label: 'Café and conversation', description: 'Warm drinks, a cozy corner, and talking for hours.' },
      { id: 'dinner', icon: 'dinner', label: 'Dinner together', description: 'Good food, soft lighting, and a dessert to share.' },
      { id: 'sunset', icon: 'sunset', label: 'A sunset walk', description: 'Golden hour, no destination, just us.' },
      { id: 'surprise', icon: 'gift', label: 'A little surprise outing', description: 'You just show up — I’ll plan something sweet.' },
      { id: 'relaxed', icon: 'relaxed', label: 'A relaxed day together', description: 'No rush, no plans, just a slow and easy day.' },
      { id: 'you-choose', icon: 'sparkles', label: 'You choose for us', description: 'Leave it to me. I’ll pick something you’ll love.' },
    ],
    days: [
      { value: 'this-weekend', label: 'This weekend' },
      { value: 'next-weekend', label: 'Next weekend' },
      { value: 'weeknight', label: 'A cozy weeknight' },
      { value: 'any', label: 'Whenever suits you' },
    ],
  },

  footer: {
    line: 'Made with a little extra love ♡',
    credit: 'Made just for you.',
    replayLabel: 'Replay my little surprise',
    clearLabel: 'Clear saved answers',
    clearedLabel: 'All cleared ♡',
  },
}
