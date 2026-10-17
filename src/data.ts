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
