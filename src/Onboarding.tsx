import { useMemo, useState } from 'react'
import { BrandMark } from './Brand'
import { getLanguage, languages, levels, matchesLanguage, quizzes, selfRating, speechTag, type LangCode, type QuizItem } from './data'

export type Profile = {
  lang: LangCode
  variant?: string
  level: number
  explainIn: 'native' | 'english'
  unknown: QuizItem[]
}

type Step = 'welcome' | 'language' | 'quiz' | 'result'
type Answer = number | 'idk'

const STEPS = ['Language', 'Level check', 'Ready'] as const

export function speak(text: string, lang?: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  if (lang) utterance.lang = lang
  utterance.rate = 0.85
  window.speechSynthesis.speak(utterance)
}

export function Onboarding({ initial, onDone, onCancel }: { initial?: Profile; onDone: (p: Profile) => void; onCancel?: () => void }) {
  const [step, setStep] = useState<Step>(initial ? 'language' : 'welcome')
  const [lang, setLang] = useState<LangCode | undefined>(initial?.lang)
  const [variant, setVariant] = useState<string | undefined>(initial?.variant)
  const [query, setQuery] = useState('')
  // undefined = not answered yet, null = "Not sure"
  const [self, setSelf] = useState<number | null | undefined>(undefined)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [pending, setPending] = useState<Answer | undefined>(undefined)
  const [skipped, setSkipped] = useState(false)
  const [explainIn, setExplainIn] = useState<Profile['explainIn']>(initial?.explainIn ?? 'native')

  const language = lang ? getLanguage(lang) : undefined
  const bank = (lang && quizzes[lang]) || []
  const filtered = useMemo(() => languages.filter((l) => matchesLanguage(l, query)), [query])
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

  const chooseLanguage = (code: LangCode) => {
    if (code !== lang) setVariant(undefined)
    setLang(code)
  }

  const startQuiz = () => {
    setSelf(undefined)
    setAnswers([])
    setPending(undefined)
    setSkipped(false)
    setStep('quiz')
  }

  const result = useMemo(() => {
    const signals: number[] = []
    if (typeof self === 'number') signals.push(self / 3)
    if (answers.length) signals.push(answers.filter((a, i) => a === bank[i]?.answer).length / answers.length)
    const level = signals.length ? Math.round((signals.reduce((a, b) => a + b, 0) / signals.length) * 3) : 1
    const unknown = bank.filter((q, i) => answers[i] !== undefined && answers[i] !== q.answer)
    return { level, unknown, known: answers.length - unknown.length, guessed: !signals.length }
  }, [self, answers, bank])

  const finish = () => {
    if (!lang) return
    onDone({ lang, variant, level: result.level, explainIn, unknown: result.unknown })
  }

  const stepIndex = step === 'language' ? 0 : step === 'quiz' ? 1 : 2
  // Quiz position: self-rating is question 0, then the language bank.
  const qIndex = self === undefined ? 0 : 1 + answers.length
  const qTotal = 1 + bank.length
  const progress = step === 'language' ? (lang ? 0.3 : 0.12) : step === 'quiz' ? 0.34 + (qIndex / qTotal) * 0.33 : 1

  if (step === 'welcome') {
    return (
      <div className="onboard welcome">
        <div className="welcome-inner">
          <BrandMark size="xl" />
          <h1>Get the joke.<br />Join the conversation.</h1>
          <p>Cultural context for the shows you watch and the talks you have with family, explained in the language you grew up hearing.</p>
          <button className="cta" onClick={() => setStep('language')} type="button">Get started</button>
          <small>Two quick steps · about a minute</small>
        </div>
      </div>
    )
  }

  return (
    <div className="onboard">
      <header className="onboard-top">
        <BrandMark />
        <ol className="stepper" aria-label="Setup progress">
          {STEPS.map((label, i) => (
            <li className={i < stepIndex ? 'done' : i === stepIndex ? 'current' : ''} key={label} aria-current={i === stepIndex ? 'step' : undefined}>
              {label}
            </li>
          ))}
        </ol>
        {onCancel ? (
          <button className="ghost" onClick={onCancel} type="button">Cancel</button>
        ) : (
          <span className="stepper-spacer" />
        )}
        <div className="progress" aria-hidden="true"><i style={{ width: `${progress * 100}%` }} /></div>
      </header>

      {step === 'language' && (
        <main className="onboard-body">
          <p className="overline">Step 1 of 2</p>
          <h1>Which language does your family speak?</h1>
          <p className="onboard-sub">We’ll explain things in this language, at your level. You can change it any time.</p>
          <label className="search">
            <span className="sr-only">Search languages</span>
            <input
              autoComplete="off"
              id="lang-search"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search, e.g. Mandarin or 中文"
              type="search"
              value={query}
            />
          </label>
          <div className="lang-grid" role="radiogroup" aria-label="Family language">
            {filtered.map((l) => (
              <button
                aria-checked={lang === l.code}
                className={lang === l.code ? 'lang-option selected' : 'lang-option'}
                key={l.code}
                onClick={() => chooseLanguage(l.code)}
                role="radio"
                type="button"
              >
                <span className="flag">{l.badge}</span>
                <span className="lang-names">
                  <strong>{l.native}</strong>
                  <small>{l.english}</small>
                </span>
              </button>
            ))}
            {!filtered.length && <p className="empty">No match for “{query}”. Try the English or native name.</p>}
          </div>

          {language?.variants && (
            <div className="variants">
              <p>Where is your family from? <span>Optional. It helps with accents and slang.</span></p>
              <div className="chips">
                {language.variants.map((v) => (
                  <button aria-pressed={variant === v} className={variant === v ? 'chip on' : 'chip'} key={v} onClick={() => setVariant(variant === v ? undefined : v)} type="button">
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="onboard-actions">
            <button className="cta" disabled={!lang} onClick={startQuiz} type="button">
              {language ? `Continue with ${language.english}` : 'Choose a language'}
            </button>
          </div>
        </main>
      )}

      {step === 'quiz' && language && (
        <main className="onboard-body">
          <div className="quiz-meta">
            <p className="overline">Step 2 of 2 · Question {Math.min(qIndex + 1, qTotal)} of {qTotal}</p>
            <button className="ghost" onClick={() => { setSkipped(true); setStep('result') }} type="button">Skip, learn my level as I go</button>
          </div>

          {self === undefined ? (
            <>
              <h1>{selfRating.question}</h1>
              <p className="onboard-sub">There’s no wrong answer. This sets where we start.</p>
              <div className="answers">
                {selfRating.options.map((o, i) => (
                  <button className="answer" key={o} onClick={() => (bank.length ? setSelf(i) : (setSelf(i), setStep('result')))} type="button">
                    <span className="answer-key">{i + 1}</span>{o}
                  </button>
                ))}
                <button className="answer idk" onClick={() => (bank.length ? setSelf(null) : (setSelf(null), setStep('result')))} type="button">
                  <span className="answer-key">?</span>Not sure
                </button>
              </div>
            </>
          ) : (
            (() => {
              const i = answers.length
              const q = bank[i]
              if (!q) return null
              const lock = pending !== undefined
              const next = () => {
                const nextAnswers = [...answers, pending!]
                setAnswers(nextAnswers)
                setPending(undefined)
                if (nextAnswers.length >= bank.length) setStep('result')
              }
              return (
                <>
                  <p className="quiz-context">{q.context}</p>
                  <div className="quiz-prompt">
                    <div>
                      <h1 lang={speechTag(language, variant)}>{q.prompt}</h1>
                      {q.romanization && <p>{q.romanization}</p>}
                    </div>
                    {canSpeak && (
                      <button className="listen-btn" onClick={() => speak(q.prompt, speechTag(language, variant))} type="button" aria-label="Play it out loud">
                        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path d="M4 9v6h4l5 4V5L8 9H4Zm12.5 3a4 4 0 0 0-2-3.5v7a4 4 0 0 0 2-3.5Zm-2-8v2a7 7 0 0 1 0 12v2a9 9 0 0 0 0-16Z" fill="currentColor" /></svg>
                        Play
                      </button>
                    )}
                  </div>
                  <div className="answers">
                    {q.options.map((o, oi) => {
                      const state = !lock ? '' : oi === q.answer ? 'right' : oi === pending ? 'wrong' : 'dim'
                      return (
                        <button className={`answer ${state}`} disabled={lock} key={o} onClick={() => setPending(oi)} type="button">
                          <span className="answer-key">{String.fromCharCode(65 + oi)}</span>{o}
                        </button>
                      )
                    })}
                    <button className={`answer idk ${lock && pending === 'idk' ? 'chosen' : lock ? 'dim' : ''}`} disabled={lock} onClick={() => setPending('idk')} type="button">
                      <span className="answer-key">?</span>I don’t know
                    </button>
                  </div>
                  {lock && (
                    <div className="feedback" role="status">
                      <p>
                        <strong>{pending === q.answer ? 'You got it.' : pending === 'idk' ? 'No problem. We saved it for you.' : 'Close. We saved it for you.'}</strong>{' '}
                        {q.explanation}
                      </p>
                      <button className="cta small" onClick={next} type="button" autoFocus>
                        {i + 1 >= bank.length ? 'See my level' : 'Next'}
                      </button>
                    </div>
                  )}
                </>
              )
            })()
          )}
        </main>
      )}

      {step === 'result' && language && (
        <main className="onboard-body result">
          <p className="overline">You’re all set</p>
          <h1>
            {skipped || result.guessed ? 'We’ll learn your level as you go' : <>You’re <em>{levels[result.level].label.toLowerCase()}</em> in {language.native}</>}
          </h1>
          <p className="onboard-sub">{levels[skipped || result.guessed ? 1 : result.level].blurb}</p>

          {!skipped && answers.length > 0 && (
            <div className="result-stats">
              <div><strong>{result.known}</strong><span>you knew</span></div>
              <div><strong>{result.unknown.length}</strong><span>saved to learn</span></div>
            </div>
          )}

          <div className="explain-choice">
            <p>Explain things to me in</p>
            <div className="segmented" role="radiogroup" aria-label="Explanation language">
              <button aria-checked={explainIn === 'native'} className={explainIn === 'native' ? 'on' : ''} onClick={() => setExplainIn('native')} role="radio" type="button">
                Simple {language.native}
              </button>
              <button aria-checked={explainIn === 'english'} className={explainIn === 'english' ? 'on' : ''} onClick={() => setExplainIn('english')} role="radio" type="button">
                English
              </button>
            </div>
            <small>{explainIn === 'native' ? 'Say “English please” any time for a quick translation.' : 'You can switch to simple ' + language.english + ' later in Settings.'}</small>
          </div>

          <div className="onboard-actions">
            <button className="ghost" onClick={startQuiz} type="button">Retake</button>
            <button className="cta" onClick={finish} type="button">Go to my home</button>
          </div>
        </main>
      )}
    </div>
  )
}
