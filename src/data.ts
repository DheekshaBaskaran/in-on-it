export type LangCode = 'zh' | 'yue' | 'es' | 'ja' | 'ko' | 'vi' | 'tl' | 'hi' | 'ta' | 'ar' | 'fa' | 'pt'

export type Language = {
  code: LangCode
  english: string
  native: string
  badge: string
  aliases?: string[]
  variants?: string[]
  /** BCP-47 tag per variant (or one for all) so the browser can read prompts aloud. */
  speech?: Record<string, string> | string
}

export const languages: Language[] = [
  { code: 'zh', english: 'Mandarin', native: '中文', badge: '中', aliases: ['chinese', 'putonghua', 'guoyu', 'huayu'], variants: ['Taiwan', 'Mainland China', 'Singapore / Malaysia'], speech: { Taiwan: 'zh-TW', 'Mainland China': 'zh-CN', 'Singapore / Malaysia': 'zh-CN' } },
  { code: 'yue', english: 'Cantonese', native: '粵語', badge: '粵', aliases: ['chinese', 'guangdonghua'], variants: ['Hong Kong', 'Guangdong'], speech: 'zh-HK' },
  { code: 'es', english: 'Spanish', native: 'Español', badge: 'ES', aliases: ['castellano'], variants: ['Mexico', 'Central America', 'Caribbean', 'South America', 'Spain'], speech: { Spain: 'es-ES', default: 'es-MX' } },
  { code: 'ja', english: 'Japanese', native: '日本語', badge: '日', aliases: ['nihongo'], speech: 'ja-JP' },
  { code: 'ko', english: 'Korean', native: '한국어', badge: '한', aliases: ['hangul'], speech: 'ko-KR' },
  { code: 'vi', english: 'Vietnamese', native: 'Tiếng Việt', badge: 'VI', variants: ['Northern', 'Southern'], speech: 'vi-VN' },
  { code: 'tl', english: 'Tagalog', native: 'Tagalog', badge: 'TL', aliases: ['filipino', 'pilipino'], speech: 'fil-PH' },
  { code: 'hi', english: 'Hindi', native: 'हिन्दी', badge: 'हि', aliases: ['hindustani'], speech: 'hi-IN' },
  { code: 'ta', english: 'Tamil', native: 'தமிழ்', badge: 'த', speech: 'ta-IN' },
  { code: 'ar', english: 'Arabic', native: 'العربية', badge: 'ع', variants: ['Levantine', 'Egyptian', 'Gulf', 'Maghrebi'], speech: 'ar' },
  { code: 'fa', english: 'Persian', native: 'فارسی', badge: 'فا', aliases: ['farsi', 'dari'], speech: 'fa-IR' },
  { code: 'pt', english: 'Portuguese', native: 'Português', badge: 'PT', variants: ['Brazil', 'Portugal'], speech: { Portugal: 'pt-PT', default: 'pt-BR' } },
]

export const getLanguage = (code: LangCode) => languages.find((l) => l.code === code)!

export function speechTag(lang: Language, variant?: string) {
  if (typeof lang.speech === 'string') return lang.speech
  if (!lang.speech) return undefined
  return (variant && lang.speech[variant]) || lang.speech.default || Object.values(lang.speech)[0]
}

/** Accepts English names, native names and common aliases, ignoring case and accents. */
export function matchesLanguage(lang: Language, query: string) {
  const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
  const q = norm(query)
  if (!q) return true
  return [lang.english, lang.native, ...(lang.aliases ?? [])].some((name) => norm(name).includes(q))
}

export type QuizItem = {
  prompt: string
  romanization?: string
  context: string
  options: string[]
  answer: number
  explanation: string
}

export const selfRating = {
  question: 'When your family talks at dinner, how much do you follow?',
  options: ['Almost nothing', 'The topic, not the details', 'Most of it, but the jokes lose me', 'Nearly everything'],
}

export const quizzes: Partial<Record<LangCode, QuizItem[]>> = {
  zh: [
    {
      prompt: '你吃饭了吗？',
      romanization: 'Nǐ chīfàn le ma?',
      context: 'Grandma says this as soon as you walk in. What does she mostly mean?',
      options: ['She wants to know exactly what you ate', 'A warm hello, like “how are you?”', 'Dinner is going to be late'],
      answer: 1,
      explanation: 'It literally asks “have you eaten?”, but it works as a caring greeting.',
    },
    {
      prompt: '加油！',
      romanization: 'Jiāyóu!',
      context: 'Your aunt says this the night before your exam.',
      options: ['You can do it!', 'Go fill up the car', 'Eat more'],
      answer: 0,
      explanation: 'Literally “add oil.” It’s how people cheer someone on.',
    },
    {
      prompt: '马马虎虎',
      romanization: 'mǎmǎhūhū',
      context: 'Uncle asks how work is going and your cousin answers with this.',
      options: ['Really busy', 'So-so', 'Going great'],
      answer: 1,
      explanation: 'Literally “horse horse tiger tiger.” It means so-so, just okay.',
    },
    {
      prompt: '她在吃醋。',
      romanization: 'Tā zài chīcù.',
      context: 'Mom says this about your cousin after the new baby arrives.',
      options: ['She’s craving sour food', 'She’s feeling sick', 'She’s jealous'],
      answer: 2,
      explanation: 'Literally “eating vinegar.” It means feeling jealous.',
    },
  ],
  es: [
    {
      prompt: 'No pasa nada.',
      context: 'You spill a drink and your tía says this.',
      options: ['Nothing is happening here', 'It’s okay, no big deal', 'Don’t move'],
      answer: 1,
      explanation: 'A gentle way to say it’s fine, don’t worry.',
    },
    {
      prompt: '¡Qué buena onda!',
      context: 'Your cousin says this about your new friend.',
      options: ['What a cool person', 'What a good wave', 'How tasty'],
      answer: 0,
      explanation: '“Buena onda” means good vibes. Someone or something is cool.',
    },
    {
      prompt: 'Estás en las nubes.',
      context: 'Abuela says this when you don’t answer her question.',
      options: ['You look very happy', 'You’re daydreaming', 'You’re flying soon'],
      answer: 1,
      explanation: 'Literally “you’re in the clouds”: not paying attention.',
    },
    {
      prompt: 'Me cae bien.',
      context: 'Your dad says this after meeting your partner.',
      options: ['They fell on me', 'It fits me well', 'I like them'],
      answer: 2,
      explanation: 'Literally “they fall well on me”: I like this person.',
    },
  ],
}

export const levels = [
  { label: 'Just starting', blurb: 'We’ll keep explanations very short and offer English sooner.' },
  { label: 'Getting there', blurb: 'We’ll use everyday words and explain one new word at a time.' },
  { label: 'Conversational', blurb: 'You follow the talk. We’ll focus on jokes, idioms and references.' },
  { label: 'Almost fluent', blurb: 'We’ll stay quiet unless something is truly cultural or regional.' },
]

export type HomeContent = {
  simpler: { original: string; simpler: string }
  cue: { word: string; meaning: string }
  saved: { phrase: string; meaning: string; time: string }[]
}

export const homeContent: Partial<Record<LangCode, HomeContent>> = {
  zh: {
    simpler: { original: '这件事你别操心了，船到桥头自然直。', simpler: '别担心，到时候会有办法的。' },
    cue: { word: '年年有余', meaning: 'Leave some fish on the plate: “fish” (鱼) sounds like “surplus” (余), so it wishes the family plenty every year.' },
    saved: [
      { phrase: '福到了', meaning: 'Luck has arrived · Lunar New Year gala', time: '0:12' },
      { phrase: '吃醋', meaning: 'Jealous · Dinner with 阿姨', time: '0:08' },
      { phrase: '马马虎虎', meaning: 'So-so · Call with 阿公', time: '0:16' },
    ],
  },
  es: {
    simpler: { original: '¿Te apetece que vayamos picando algo?', simpler: '¿Quieres comer algo juntos?' },
    cue: { word: 'Sobremesa', meaning: 'The time spent talking together after a meal. No need to rush off.' },
    saved: [
      { phrase: 'No pasa nada', meaning: 'It’s okay · Café conversation', time: '0:12' },
      { phrase: 'Qué buena onda', meaning: 'Great vibe · With Lucía', time: '0:08' },
      { phrase: 'Me viene genial', meaning: 'Works perfectly for me · Planning', time: '0:16' },
    ],
  },
}

export type Line = { who: string; text: string; romanization?: string; cue?: boolean }

export type Scene = {
  source: string
  lines: Line[]
  whisper: { text: string; romanization?: string; english: string }
  reply?: { text: string; romanization?: string; english: string }
  saved: { phrase: string; meaning: string }
}

/** Example moments from the user-journey framework, one per mode. */
export const scenes: Partial<Record<LangCode, Record<'watch' | 'talk', Scene>>> = {
  zh: {
    watch: {
      source: 'Lunar New Year gala · YouTube',
      lines: [
        { who: 'Host', text: '新年快乐！大家看，我们家的福……', romanization: 'Xīnnián kuàilè! Dàjiā kàn, wǒmen jiā de fú…' },
        { who: 'Host', text: '[flips the 福 banner upside down]' },
        { who: 'Audience', text: '[laughter]' },
        { who: 'Dad', text: '哈哈，福到了！', romanization: 'Hāhā, fú dào le!', cue: true },
      ],
      whisper: {
        text: '福倒过来贴，因为“倒”和“到”听起来一样。意思是：福到了！',
        romanization: 'Fú dào guòlái tiē, yīnwèi “dào” hé “dào” tīng qǐlái yíyàng. Yìsi shì: fú dào le!',
        english: 'It’s hung upside down because “upside down” sounds like “arrived.” It means: luck has arrived!',
      },
      saved: { phrase: '福到了', meaning: 'Luck has arrived' },
    },
    talk: {
      source: 'New Year dinner · 大伯’s house',
      lines: [
        { who: '阿嬤', text: '来来来，多吃一点。', romanization: 'Lái lái lái, duō chī yìdiǎn.' },
        { who: 'You', text: '[reach for the last piece of fish]' },
        { who: '大伯', text: '别吃完！年年有余！', romanization: 'Bié chī wán! Nián nián yǒu yú!', cue: true },
        { who: 'Everyone', text: '[laughter]' },
      ],
      whisper: {
        text: '“鱼”和“余”听起来一样。年年有余，就是每年都有多的。所以鱼不要吃完。',
        romanization: '“Yú” hé “yú” tīng qǐlái yíyàng. Nián nián yǒu yú, jiùshì měi nián dōu yǒu duō de. Suǒyǐ yú bú yào chī wán.',
        english: '“Fish” sounds like “surplus.” “Surplus every year” means always having extra, so you leave some fish.',
      },
      reply: { text: '好，年年有余！', romanization: 'Hǎo, nián nián yǒu yú!', english: 'Okay, surplus every year!' },
      saved: { phrase: '年年有余', meaning: 'Leave some fish, for plenty every year' },
    },
  },
  es: {
    watch: {
      source: 'Comedy special · YouTube',
      lines: [
        { who: 'Comedian', text: 'Y mi mamá me dice: “¿Otra vez sin suéter?”' },
        { who: 'Comedian', text: '¡No manches, hace treinta grados!', cue: true },
        { who: 'Audience', text: '[laughter]' },
      ],
      whisper: {
        text: '“No manches” quiere decir “¡no puede ser!”. Es muy mexicano. Se usa con amigos y familia.',
        english: '“No manches” means “no way!” It’s very Mexican and used with friends and family.',
      },
      saved: { phrase: 'No manches', meaning: 'No way! (Mexican, casual)' },
    },
    talk: {
      source: 'Sunday dinner · Abuela’s house',
      lines: [
        { who: 'Abuela', text: '¿Y tu primo? ¿Ya se fue?' },
        { who: 'Tío', text: '¡Ese ya se acostó con las gallinas!', cue: true },
        { who: 'Everyone', text: '[laughter]' },
      ],
      whisper: {
        text: '“Acostarse con las gallinas” es irse a dormir muy temprano, como las gallinas.',
        english: '“Going to bed with the chickens” means going to bed really early.',
      },
      reply: { text: '¡Yo también me acuesto con las gallinas!', english: 'I go to bed with the chickens too!' },
      saved: { phrase: 'Acostarse con las gallinas', meaning: 'Going to bed very early' },
    },
  },
}

export type Lesson = {
  glyph: string
  kicker: string
  title: string
  blurb: string
  meta: string
  tag: string
  slides: { heading: string; body: string }[]
  check: QuizItem
  upNext: { title: string; meta: string }[]
}

export const lessons: Partial<Record<LangCode, Lesson>> = {
  zh: {
    glyph: '吃',
    kicker: 'Everyday connection',
    title: 'When “Have you eaten?” isn’t about food',
    blurb: 'Learn how a practical question became a familiar way to show care.',
    meta: 'Today · 5 minutes',
    tag: 'Culture + tone',
    slides: [
      { heading: '你吃饭了吗？', body: 'Literally “Have you eaten?” You’ll hear it at the door, on the phone, and at the start of almost every visit.' },
      { heading: 'Why food?', body: 'For generations, having enough to eat was a real worry. Asking about food became a way of asking “Are you okay?”' },
      { heading: 'How to answer', body: 'Keep it short: 吃了 (chī le, “I ate”) or 还没 (hái méi, “not yet”). Nobody expects the menu.' },
      { heading: 'Try it this week', body: 'When 阿嬤 asks, answer “吃了！你呢？” (“I ate! And you?”). Asking back shows you care too.' },
    ],
    check: {
      prompt: '你吃了吗？',
      romanization: 'Nǐ chī le ma?',
      context: 'In a casual encounter, what are they most likely communicating?',
      options: ['They want a detailed answer about my meal', 'They’re showing care and making friendly conversation', 'They’re inviting me to a restaurant'],
      answer: 1,
      explanation: 'It’s a caring hello. A short “吃了” is the perfect answer.',
    },
    upNext: [
      { title: 'Softening requests with 一下', meta: 'Language · 4 min' },
      { title: 'Reading “客气” in context', meta: 'Culture · 6 min' },
      { title: 'Why the fish never gets finished', meta: 'Culture · 3 min' },
    ],
  },
  es: {
    glyph: '¿',
    kicker: 'Everyday connection',
    title: 'Why nobody leaves the table',
    blurb: 'Sobremesa, and why the talk after dinner matters as much as the food.',
    meta: 'Today · 5 minutes',
    tag: 'Culture + tone',
    slides: [
      { heading: 'Sobremesa', body: 'The time spent talking at the table after a meal. There’s no English word for it.' },
      { heading: 'Why it matters', body: 'Getting up right away can feel rude. Staying says “I’m happy to be here with you.”' },
      { heading: 'What people say', body: '“¿Un cafecito?” is often an invitation to stay longer, not just an offer of coffee.' },
      { heading: 'Try it this week', body: 'Stay ten minutes after dinner and ask Abuela a question. That’s sobremesa.' },
    ],
    check: {
      prompt: '¿Mande?',
      context: 'Your grandmother says this after you call her name. What does she mean?',
      options: ['Send it to me', 'Yes? What did you say?', 'Who is in charge here?'],
      answer: 1,
      explanation: 'A polite Mexican “yes?” or “pardon?” when someone calls you.',
    },
    upNext: [
      { title: 'Softening requests with “¿me pasas…?”', meta: 'Language · 4 min' },
      { title: 'Why everything is -ito', meta: 'Culture · 5 min' },
    ],
  },
}

export const testWhisper: Partial<Record<LangCode, string>> = {
  zh: '你好！我是你的小帮手。听不懂的时候，点两下就好。',
  es: '¡Hola! Soy tu ayudante. Cuando no entiendas algo, toca dos veces.',
}
