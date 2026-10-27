/*
 * Fallback wording — you don't need to edit this file (edit romanticConfig.js).
 * If a field in romanticConfig.js is missing or left empty, the value here is used,
 * so the site always works, even before anything is personalised.
 */

export const defaults = {
  herName: '',
  myName: '',

  hero: {
    eyebrow: 'psst… a little surprise',
    headline: 'Hey, {her}… ❤️',
    reveal: 'I made a little something for you.',
    supporting: 'No rush. Just take a little walk with me.',
    cta: 'Open your little surprise',
    scrollHint: 'scroll',
  },

  intro: {
    eyebrow: 'a little note',
    headline: 'Before you see anything else…',
    paragraphs: [
      'I wanted to do something a little different this time. Nothing too complicated, nothing over the top. Just a small way to make you smile and remind you that spending time with you is something I really look forward to.',
    ],
    annotation: 'made with a little extra love ♡',
  },

  gallery: {
    eyebrow: 'our little world',
    title: 'Our little *world*',
    subtitle: 'A little mood board of moments I’d love to share with you.',
    backgroundWord: 'little world',
    hintPointer: 'hover to tilt · click to look closer',
    hintTouch: 'tap a photo to look closer',
    photos: [
      {
        src: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80',
        alt: 'A sunny café table by the window with coffee and a little plant',
        mood: 'a cozy café',
        caption: 'A little coffee, a little conversation.',
      },
      {
        src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
        alt: 'A quiet beach glowing in the evening sun',
        mood: 'a sunset walk',
        caption: 'Somewhere we can forget the time.',
      },
      {
        src: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80',
        alt: 'Warm heart-shaped bokeh lights',
        mood: 'warm little lights',
        caption: 'One of those evenings we won’t want to end.',
      },
    ],
  },

  tree: {
    eyebrow: 'little by little',
    headline: 'Little things can become something *beautiful.*',
    supporting: 'And sometimes, the best plans start with one simple question.',
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
    showSignature: true,
    text: `Hey {her},

I was thinking about how some of the nicest moments aren't necessarily the biggest ones. Sometimes, they're simply sitting together, talking about absolutely anything, laughing at silly things, and forgetting to check the time.

I'd really like to make a little space for more moments like that with you.

No grand plan, no pressure, and no expectations for a perfect evening. Just good food, a little adventure, lots of conversation, and time together.

So, I have one little question for you…

Keep scrolling, okay? There's one last thing waiting for you.

With a smile,
Someone who's hoping you'll say yes ♡`,
  },

  voiceNote: {
    eyebrow: 'a little voice note',
    caption: 'A little message, just for you.',
    title: 'a voice note from {me}',
    src: '/audio/voice-note.mp3',
    missingMessage: 'Psst… my voice note is still on its way. Check back a little later ♡',
  },

  invitation: {
    lead: 'So… there’s one thing left.',
    tease: 'I have a little date idea…',
    question: 'Will you go on a date with me? ♡',
    message:
      'Just you and me. Good food, good conversations, and a little time together. We can make it our kind of evening.',
    yesLabel: 'YES! I’d love to 💗',
    planFirstLabel: 'Tell me the plan first 👀',
    planFirstMessage:
      'Fair enough! A little mystery is nice, but you deserve to know what you’re saying yes to. Let’s figure out the details together. ♡',
    planTogetherLabel: 'Let’s plan it together',
    success: {
      headline: 'YOU JUST MADE ME SMILE. ♡',
      message: 'It’s a date! Now all that’s left is to plan a lovely little day together.',
      kicker: 'Our little date starts here.',
      pickDateLabel: 'Let’s pick our date',
      replayLabel: 'Replay our little story',
    },
  },

  datePlanner: {
    title: 'Let’s plan our little date',
    subtitle: 'Pick whatever makes you smile — nothing’s set in stone ♡',
    whatLabel: 'What sounds lovely?',
    whenLabel: 'When works for you?',
    customDateLabel: 'or pick a date',
    noteLabel: 'Anything else? (optional)',
    notePlaceholder: 'Cravings, outfit hints, secret wishes… I’m all ears.',
    saveLabel: 'Save our plan',
    cancelLabel: 'Maybe later',
    emptyHint: 'Pick at least one little thing ♡',
    privacyNote: 'Your picks stay right here on this device — nothing gets sent anywhere.',
    savedTitle: 'Saved ♡',
    savedMessage: 'Here’s our little plan. It’s kept on this device only.',
    copyLabel: 'Copy our plan',
    copiedLabel: 'Copied!',
    copyFailedLabel: 'Couldn’t copy — a screenshot works too ♡',
    copyHint: 'Paste it to {me} whenever you like ♡',
    editLabel: 'Edit',
    doneLabel: 'Done',
    summaryLabel: 'Our plan:',
    options: [
      { id: 'cafe', icon: 'coffee', label: 'Café and conversation', description: 'Warm drinks, a cozy corner, and talking for hours.' },
      { id: 'dinner', icon: 'dinner', label: 'Dinner together', description: 'Good food, soft lighting, and a dessert to share.' },
      { id: 'sunset', icon: 'sunset', label: 'A sunset walk', description: 'Golden hour, no destination, just us.' },
      { id: 'surprise', icon: 'gift', label: 'A little surprise outing', description: 'You just show up — I’ll plan something sweet.' },
      { id: 'you-choose', icon: 'sparkles', label: 'You choose for us', description: 'Leave it to me. I’ll pick something you’ll love.' },
    ],
    days: [
      { value: 'this-weekend', label: 'This weekend' },
      { value: 'next-weekend', label: 'Next weekend' },
      { value: 'weeknight', label: 'A cozy weeknight' },
      { value: 'any', label: 'Whenever suits you' },
    ],
    allowCustomDate: true,
  },

  footer: {
    line: 'Made with a little extra love ♡',
    credit: 'for {her}, from {me}',
    replayLabel: 'Replay our little story',
    clearLabel: 'Clear saved answers',
    clearedLabel: 'All cleared ♡',
  },
}
