/*
 * ✏️  Everything you'd want to personalise lives in this one file:
 *     words, photos, promises, the voice note and the date details.
 *     Wrap words in *asterisks* inside titles to give them the italic rose-gold accent.
 */

const unsplash = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=1000&q=80`

export const content = {
  hero: {
    eyebrow: 'a little surprise',
    headline: ['someone made this,', 'just for you'],
    subtitle:
      'Take your time. Scroll slowly. Every petal, every word, every little detail on this page is here because of you.',
    scrollLabel: 'scroll down',
  },

  quote: {
    text: 'I wanted to give you something that couldn’t be bought in a store — so I made it, one little *heartbeat* at a time. Every word here is true, and every bit of it is *yours.*',
    signature: 'with all my love',
  },

  story: {
    eyebrow: '01 — how we grew',
    title: 'Every love story starts as a *tiny seed*',
    body: 'Ours was planted quietly — and look at how it has grown. Keep scrolling and watch it bloom.',
    counterLabel: 'reasons I fall for you again',
    milestones: [
      { label: 'Chapter one', title: 'The first hello', text: 'A conversation I didn’t want to end — and secretly never did.' },
      { label: 'Chapter two', title: 'The first date', text: 'Nervous laughter, cold coffee, and the warmest hand I’ve ever held.' },
      { label: 'Chapter three', title: 'Right now', text: 'Still growing, still blooming — and still, always, you.' },
    ],
  },

  photos: {
    eyebrow: '02 — little moments',
    title: 'The pictures I never want to *stop* looking at',
    subtitle: 'Small, ordinary, perfect moments. Hover to tilt them, tap to take a closer look.',
    backgroundWord: 'moments',
    hint: 'hover to tilt · tap to open',
    // Swap `src` for your own photos (a URL, or a file in /public like '/photos/us.jpg').
    items: [
      { src: unsplash('1518199266791-5375a83190b7'), caption: 'you light up everything', date: 'always', alt: 'Glowing heart-shaped bokeh lights' },
      { src: unsplash('1474552226712-ac0f0961a954'), caption: 'golden hour, with you', date: 'that summer', alt: 'Two people cycling hand in hand at sunset' },
      { src: unsplash('1501901609772-df0848060b33'), caption: 'that laugh of yours', date: 'every day', alt: 'A laughing couple, one carrying the other piggyback' },
      { src: unsplash('1516589178581-6cd7833ae3b2'), caption: 'my favourite view', date: 'sunset', alt: 'Hands forming a heart shape against the setting sun' },
      { src: unsplash('1522673607200-164d1b6ce486'), caption: 'forever & always', date: 'someday', alt: 'Two chairs decorated with flowers on a lawn' },
      { src: unsplash('1487530811176-3780de880c2d'), caption: 'flowers, just because', date: 'any tuesday', alt: 'A soft pastel bouquet of roses' },
    ],
  },

  letter: {
    eyebrow: '03 — a letter for you',
    title: 'Some things are better said *on paper*',
    subtitle: 'Sealed with a kiss (well — with wax). Open it whenever you’re ready.',
    hint: 'tap the seal to open',
    backgroundWord: 'love letter',
    foldBackLabel: 'fold it back up',
    greeting: 'My love,',
    paragraphs: [
      'I’ve started this letter a hundred times. Every version tried to fit how I feel into a few neat sentences, and every version failed — because you are not a few neat sentences. You are the whole story.',
      'You are the calm in my loud days, the laugh I hear in my head when something funny happens and you’re not there, the first person I want to tell everything to.',
      'So I made you this little corner of the internet. It isn’t much, but every petal and every heartbeat on it is here because of you.',
      'There’s one more thing I want to ask you — but first, keep scrolling.',
    ],
    signoff: 'Forever yours,',
    signature: 'Me ♡',
    voiceNote: {
      label: 'P.S. — press play',
      // Drop an audio file at /public/voice-note.mp3 (or point this anywhere).
      // If it can't be loaded, the player plays a soft music-box melody instead.
      src: '/voice-note.mp3',
      title: 'A little voice note for you',
      fallbackTitle: 'A little melody for you',
    },
  },

  promises: {
    eyebrow: '04 — our promises',
    title: 'A few things I *promise* you',
    subtitle: 'Seal each promise with a tap — then there’s just one little question left.',
    question: 'So… will you go on a date with me?',
    progressLabel: 'promises sealed',
    lockedHint: 'seal every promise to unlock your answer ♡',
    cta: 'Yes — make it official',
    saidLabel: 'It’s official ♡',
    items: [
      { title: 'To always save you the last bite', detail: 'Even when it’s dessert. Especially when it’s dessert.' },
      { title: 'To listen — really listen', detail: 'Phone down, eyes up, every single time.' },
      { title: 'To laugh at all your jokes', detail: 'Including the ones that aren’t funny. (They’re all funny.)' },
      { title: 'To be your safe place', detail: 'On the good days, the hard days and the ordinary ones in between.' },
      { title: 'To keep choosing you', detail: 'Today, tomorrow, and every day after that.' },
    ],
  },

  date: {
    subtitle: 'I can’t wait.',
    details: [
      { icon: 'calendar', label: 'When', value: 'Thursday, November 5' },
      { icon: 'clock', label: 'Time', value: '7:30 in the evening' },
      { icon: 'pin', label: 'Where', value: 'Somewhere with candlelight (it’s a surprise)' },
      { icon: 'sparkle', label: 'Dress code', value: 'Whatever makes you feel beautiful' },
    ],
    note: 'I’ll pick you up. Just bring that smile — I’ll take care of the rest.',
    calendar: {
      title: 'Our date ♡',
      start: '2026-11-05T19:30:00', // local time
      durationHours: 3,
      location: 'A surprise ♡',
      description: 'Bring that smile. I’ll take care of the rest.',
    },
  },

  footer: {
    line: 'made with all my love, just for you',
    small: 'every petal · every pixel · every word',
  },
}
