import { useEffect, useState } from 'react'
import { getLanguage, scenes, speechTag } from './data'
import { speak, type Profile } from './Onboarding'

export type Mode = 'watch' | 'talk'
type Whisper = 'idle' | 'thinking' | 'shown'

type Props = {
  profile: Profile
  mode: Mode
  setMode: (m: Mode) => void
  recording: boolean
  setRecording: (r: boolean) => void
  paired: boolean
  onPair: () => void
  onSave: (m: { phrase: string; meaning: string; source: string }) => void
  isSaved: (phrase: string) => boolean
}

export function Listen({ profile, mode, setMode, recording, setRecording, paired, onPair, onSave, isSaved }: Props) {
  const language = getLanguage(profile.lang)
  const scene = scenes[profile.lang]?.[mode]
  const tag = speechTag(language, profile.variant)
  const [shown, setShown] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [whisper, setWhisper] = useState<Whisper>('idle')
  const [english, setEnglish] = useState(profile.explainIn === 'english')

  // Reset the scene whenever the mode or language changes.
  useEffect(() => {
    setShown(0)
    setPlaying(false)
    setWhisper('idle')
    setEnglish(profile.explainIn === 'english')
  }, [mode, profile.lang, profile.explainIn])

  // Reveal one line at a time, like a live transcript.
  useEffect(() => {
    if (!playing || !scene) return
    if (shown >= scene.lines.length) { setPlaying(false); return }
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 250 : 1300)
    return () => clearTimeout(t)
  }, [playing, shown, scene])

  const cueIndex = scene ? scene.lines.findIndex((l) => l.cue) : -1
  const canAsk = !!scene && shown > cueIndex

  const ask = () => {
    if (!scene) return
    setWhisper('thinking')
    setTimeout(() => {
      setWhisper('shown')
      if (english) speak(scene.whisper.english, 'en-US')
      else speak(scene.whisper.text, tag)
    }, 700)
  }

  const play = () => {
    setShown(0)
    setWhisper('idle')
    setPlaying(true)
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="overline">Listen · {mode === 'watch' ? 'shows & videos' : 'live with family'}</p>
          <h1>Hear what’s really being said.</h1>
          <p className="subhead">Miss a joke? Double-tap your listener and get the context in a whisper.</p>
        </div>
        <button className={paired ? 'device-chip on' : 'device-chip'} onClick={paired ? undefined : onPair} type="button" disabled={paired}>
          <i />
          <span>{paired ? <>Listener connected<small>82% battery</small></> : <>Listener not paired<small>Pair now</small></>}</span>
        </button>
      </header>

      <div className="listen-controls">
        <div className="segmented" role="radiogroup" aria-label="Listening mode">
          {(['watch', 'talk'] as Mode[]).map((m) => (
            <button aria-checked={mode === m} className={mode === m ? 'on' : ''} key={m} onClick={() => setMode(m)} role="radio" type="button">
              {m === 'watch' ? 'Watch a show' : 'Talk with family'}
            </button>
          ))}
        </div>
        <button aria-checked={recording} className={recording ? 'rec-toggle light on' : 'rec-toggle light'} onClick={() => setRecording(!recording)} role="switch" type="button">
          <span className="rec-track"><i /></span>
          Save recording {recording ? 'on' : 'off'}
        </button>
      </div>
      {recording && (
        <p className="rec-note light">
          {mode === 'talk'
            ? 'Ask everyone first. Recordings stay on your phone and delete after 30 days unless you star them.'
            : 'Saves the timestamps of your moments, not the show’s audio.'}
        </p>
      )}

      {!scene ? (
        <div className="scene-empty">
          <h2>Example scenes are ready for Mandarin and Spanish</h2>
          <p>Live listening works in {language.english}. Start a show or a conversation and double-tap when you miss something.</p>
        </div>
      ) : (
        <div className="listen-grid">
          <section className="scene" aria-label="Example scene">
            <div className="scene-top">
              <span className="overline">Example · {scene.source}</span>
              <button className="scene-play" onClick={play} type="button">{shown ? 'Replay scene' : 'Play scene'}</button>
            </div>
            <ol className="transcript" aria-live="polite">
              {scene.lines.slice(0, shown).map((line, i) => (
                <li className={line.cue && whisper !== 'idle' ? 'cue' : ''} key={i}>
                  <span className="who">{line.who}</span>
                  <span className="said">
                    <span lang={line.text.startsWith('[') ? undefined : tag}>{line.text}</span>
                    {line.romanization && <small>{line.romanization}</small>}
                  </span>
                </li>
              ))}
              {shown === 0 && <li className="transcript-empty">Press “Play scene” to hear the moment from the user journey.</li>}
            </ol>
            <button className={canAsk && whisper === 'idle' ? 'missed pulse' : 'missed'} disabled={!canAsk || whisper !== 'idle'} onClick={ask} type="button">
              <span className="missed-dot" aria-hidden="true" />
              {whisper === 'idle' ? 'I missed that' : whisper === 'thinking' ? 'Got it…' : 'Whisper sent'}
              <small>Same as a double-tap on your listener</small>
            </button>
          </section>

          <section className={`whisper-card ${whisper}`} aria-live="polite">
            <div className="tool-head">
              <span className="overline">Whispered to you</span>
              <span className="tool-tag">{english ? 'English' : `Simple ${language.native}`}</span>
            </div>
            {whisper === 'shown' ? (
              <>
                <p className="whisper-text" lang={english ? 'en' : tag}>{english ? scene.whisper.english : scene.whisper.text}</p>
                {!english && scene.whisper.romanization && <p className="whisper-roman">{scene.whisper.romanization}</p>}
                <div className="whisper-actions">
                  <button className="chip" onClick={() => (english ? speak(scene.whisper.english, 'en-US') : speak(scene.whisper.text, tag))} type="button">▶ Hear again</button>
                  <button className="chip" onClick={() => setEnglish(!english)} type="button">{english ? `Back to ${language.native}` : 'English please'}</button>
                </div>
                {mode === 'talk' && scene.reply && (
                  <div className="reply-hint">
                    <span className="overline">You could say</span>
                    <p lang={tag}>{scene.reply.text}</p>
                    {scene.reply.romanization && <small>{scene.reply.romanization}</small>}
                    <small className="muted">{scene.reply.english}</small>
                  </div>
                )}
                <button
                  className="text-action"
                  disabled={isSaved(scene.saved.phrase)}
                  onClick={() => onSave({ ...scene.saved, source: scene.source })}
                  type="button"
                >
                  {isSaved(scene.saved.phrase) ? 'Saved to your moments' : 'Save this moment'} <span>{isSaved(scene.saved.phrase) ? '✓' : '→'}</span>
                </button>
              </>
            ) : (
              <div className="whisper-wait">
                {whisper === 'thinking' ? <div className="dots" aria-label="Thinking"><i /><i /><i /></div> : null}
                <p>{whisper === 'thinking' ? 'Finding the moment…' : 'When you miss something, the explanation shows up here and plays in your ear.'}</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
