import { useState } from 'react'
import { getLanguage, lessons, speechTag } from './data'
import type { Profile } from './Onboarding'

type Answer = number | 'idk'

export function Learn({ profile }: { profile: Profile }) {
  const language = getLanguage(profile.lang)
  const lesson = lessons[profile.lang]
  const tag = speechTag(language, profile.variant)
  const [slide, setSlide] = useState(-1)
  const [answer, setAnswer] = useState<Answer | undefined>(undefined)

  const head = (
    <header className="page-head">
      <div>
        <p className="overline">Tailored to your {language.english}</p>
        <h1>Learn from real moments.</h1>
        <p className="subhead">Short lessons built around the language and context you’re likely to hear.</p>
      </div>
      <div className="streak-tile"><strong>7</strong><span>Day<br />streak</span></div>
    </header>
  )

  if (!lesson) {
    return (
      <div className="page">
        {head}
        <div className="scene-empty">
          <h2>Your first {language.english} lesson is on its way</h2>
          <p>Lessons are built from the moments you save. Listen to a show or a family conversation, and double-tap when you miss something.</p>
        </div>
      </div>
    )
  }

  const total = lesson.slides.length
  const done = slide >= total
  const progress = slide < 0 ? 0.4 : Math.min((slide + 1) / total, 1)
  const q = lesson.check
  const locked = answer !== undefined

  return (
    <div className="page">
      {head}
      <div className="learn-grid">
        <article className="lesson-card">
          <div className="lesson-top">
            <span>{lesson.meta}</span>
            <span>{lesson.tag}</span>
          </div>
          {slide < 0 || done ? (
            <>
              <div className="glyph" lang={tag}>{lesson.glyph}</div>
              <p className="lesson-kicker">{done ? 'Lesson complete' : lesson.kicker}</p>
              <h2>{done ? 'Nice work. Try it at the next family dinner.' : lesson.title}</h2>
              <p className="lesson-blurb">{done ? 'This lesson is saved in your moments, so you can come back to it any time.' : lesson.blurb}</p>
            </>
          ) : (
            <div className="lesson-slide" key={slide}>
              <p className="lesson-kicker">Part {slide + 1} of {total}</p>
              <h2 lang={tag}>{lesson.slides[slide].heading}</h2>
              <p className="lesson-blurb">{lesson.slides[slide].body}</p>
            </div>
          )}
          <div className="lesson-foot">
            <div className="lesson-progress" aria-hidden="true"><i style={{ width: `${(done ? 1 : progress) * 100}%` }} /></div>
            <button className="lesson-cta" onClick={() => setSlide(done ? -1 : slide + 1)} type="button">
              {done ? 'Review lesson' : slide < 0 ? 'Continue lesson' : slide + 1 >= total ? 'Finish lesson' : 'Next'}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>

        <div className="learn-side">
          <article className="check-card">
            <div className="lesson-top muted">
              <span>Quick check</span>
              <span>+10 sensitivity</span>
            </div>
            <h2>Someone asks “<span lang={tag}>{q.prompt}</span>”</h2>
            {q.romanization && <p className="check-roman">{q.romanization}</p>}
            <p className="check-context">{q.context}</p>
            <div className="answers">
              {q.options.map((o, i) => {
                const state = !locked ? '' : i === q.answer ? 'right' : i === answer ? 'wrong' : 'dim'
                return (
                  <button className={`answer ${state}`} disabled={locked} key={o} onClick={() => setAnswer(i)} type="button">
                    <span className="answer-key">{String.fromCharCode(65 + i)}</span>{o}
                  </button>
                )
              })}
              <button className={`answer idk ${locked && answer === 'idk' ? 'chosen' : locked ? 'dim' : ''}`} disabled={locked} onClick={() => setAnswer('idk')} type="button">
                <span className="answer-key">?</span>I don’t know
              </button>
            </div>
            {locked && (
              <div className="feedback" role="status">
                <p><strong>{answer === q.answer ? 'You got it. +10' : 'Good to know.'}</strong> {q.explanation}</p>
                <button className="ghost" onClick={() => setAnswer(undefined)} type="button">Try again</button>
              </div>
            )}
          </article>

          <article className="up-next">
            {lesson.upNext.slice(0, 2).map((item, i) => (
              <div className="up-item" key={item.title}>
                <span className="up-badge">{i === 0 ? 'Up next' : String(i + 1).padStart(2, '0')}</span>
                <div><strong>{item.title}</strong><small>{item.meta}</small></div>
              </div>
            ))}
          </article>
        </div>
      </div>
    </div>
  )
}
