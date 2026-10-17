import { useEffect, useState } from 'react'
import { BrandMark } from './Brand'
import { getLanguage, speechTag, testWhisper } from './data'
import { speak, type Profile } from './Onboarding'

type Phase = 'intro' | 'searching' | 'connected'

const steps = [
  { title: 'Place it gently', body: 'Hook the open curve around the top of your ear.' },
  { title: 'Tap to wake', body: 'Press the coral dot until it softly pulses.' },
  { title: 'Keep it nearby', body: 'Make sure Bluetooth is on for this device.' },
]

export function EarIllustration({ phase }: { phase: Phase }) {
  return (
    <div className={`pair-visual phase-${phase}`}>
      <div className="pair-rings" aria-hidden="true"><i /><i /><i /></div>
      <svg className="pair-ear" viewBox="0 0 400 520" aria-hidden="true">
        <g fill="none" stroke="#dcbcab" strokeLinecap="round" strokeLinejoin="round" strokeWidth="34">
          <path d="M150 210c-6-80 42-140 112-140 74 0 112 64 104 138-7 66-52 98-84 142-24 33-30 66-20 120" />
          <path d="M196 250c-26-46-10-104 44-110 50-6 82 34 70 92-10 48-56 84-68 140" />
          <path d="M204 252c22 18 28 46 8 58-28 16-56-12-40-48" />
        </g>
        <path className="pair-device" d="M196 92c-56 44-82 118-62 200 10 40 34 70 70 88" fill="none" stroke="#203b2d" strokeLinecap="round" strokeWidth="22" />
        <circle className="pair-dot" cx="138" cy="250" r="20" fill="#ff7455" />
      </svg>
      <span className="pair-status" role="status">
        {phase === 'intro' ? 'Ready to pair' : phase === 'searching' ? 'Looking for your listener…' : 'Connected · 82% battery'}
      </span>
    </div>
  )
}

export function Pairing({ profile, onDone, onSkip }: { profile: Profile; onDone: () => void; onSkip: () => void }) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [played, setPlayed] = useState(false)
  const language = getLanguage(profile.lang)
  const whisper = testWhisper[profile.lang] ?? 'Hi! I’m your listener. Double-tap whenever you miss something.'

  useEffect(() => {
    if (phase !== 'searching') return
    const t = setTimeout(() => setPhase('connected'), 1800)
    return () => clearTimeout(t)
  }, [phase])

  const playTest = () => {
    speak(whisper, testWhisper[profile.lang] ? speechTag(language, profile.variant) : 'en-US')
    setPlayed(true)
  }

  return (
    <div className="pair">
      <section className="pair-copy">
        <BrandMark />
        {phase !== 'connected' ? (
          <div className="pair-body">
            <p className="overline accent">Meet your listener</p>
            <h1>Small enough to disappear. Smart enough to keep up.</h1>
            <p className="pair-lede">Place your In On It listener around your outer ear. It hears the conversation with you, without blocking the world out.</p>
            <ol className="pair-steps">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <span>{i + 1}</span>
                  <div><strong>{s.title}</strong><p>{s.body}</p></div>
                </li>
              ))}
            </ol>
            <div className="pair-actions">
              <button className="dark-cta" disabled={phase === 'searching'} onClick={() => setPhase('searching')} type="button">
                {phase === 'searching' ? 'Pairing…' : 'Pair my listener'} <span aria-hidden="true">→</span>
              </button>
              <button className="ghost" onClick={onSkip} type="button">Set up later</button>
            </div>
          </div>
        ) : (
          <div className="pair-body">
            <p className="overline accent">You’re connected</p>
            <h1>Try a double-tap.</h1>
            <p className="pair-lede">
              Double-tap the coral dot whenever you miss something. You’ll hear a short whisper in{' '}
              {profile.explainIn === 'native' ? `simple ${language.native}` : 'English'}. Hear what that sounds like:
            </p>
            <div className="test-whisper">
              <span className="overline">Test whisper</span>
              <p lang={speechTag(language, profile.variant)}>{whisper}</p>
              <button className="listen-btn" onClick={playTest} type="button">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d="M4 9v6h4l5 4V5L8 9H4Zm12.5 3a4 4 0 0 0-2-3.5v7a4 4 0 0 0 2-3.5Z" fill="currentColor" /></svg>
                {played ? 'Play again' : 'Play test whisper'}
              </button>
            </div>
            <ul className="gesture-list">
              <li><strong>Double-tap</strong> Explain what I just missed</li>
              <li><strong>Triple-tap</strong> Switch between Watch and Talk</li>
              <li><strong>Long-press</strong> Start or stop saving a recording</li>
            </ul>
            <div className="pair-actions">
              <button className="dark-cta" onClick={onDone} type="button">Finish setup <span aria-hidden="true">→</span></button>
            </div>
          </div>
        )}
      </section>
      <section className="pair-stage">
        <p className="overline stage-label">Device setup · {phase === 'connected' ? 2 : 1} of 2</p>
        <EarIllustration phase={phase} />
      </section>
    </div>
  )
}
