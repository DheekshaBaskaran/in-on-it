import { useState, type ReactNode } from 'react'
import { BrandMark, LogoGlyph } from './Brand'
import { getLanguage, homeContent, levels, speechTag } from './data'
import { Onboarding, speak, type Profile } from './Onboarding'

type IconProps = {
  children: ReactNode
  size?: number
  className?: string
}

function Icon({ children, size = 20, className = '' }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  )
}

const HomeIcon = () => (
  <Icon>
    <path d="m3.5 10 8.5-7 8.5 7v9.5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5V10Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 21v-7h6v7" stroke="currentColor" strokeWidth="1.8" />
  </Icon>
)

const ListenIcon = () => (
  <Icon>
    <path d="M4 13v-2M8 17V7M12 20V4M16 17V7M20 13v-2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
  </Icon>
)

const LearnIcon = () => (
  <Icon>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
  </Icon>
)

const BookmarkIcon = () => (
  <Icon>
    <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.8L6 21V4.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
  </Icon>
)

const SettingsIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 8.96 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.6 8.96a1.7 1.7 0 0 0-.34-1.88l-.06-.06L7.03 4.2l.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 10 3.08V3h4v.08a1.7 1.7 0 0 0 1.04 1.52 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.92 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
  </Icon>
)

const SparkIcon = () => (
  <Icon size={22}>
    <path d="M12 2.5c.7 5.5 3.5 8.3 9 9-5.5.7-8.3 3.5-9 9-.7-5.5-3.5-8.3-9-9 5.5-.7 8.3-3.5 9-9Z" fill="currentColor" />
  </Icon>
)

const navItems = [
  { label: 'Today', icon: <HomeIcon /> },
  { label: 'Listen', icon: <ListenIcon /> },
  { label: 'Learn', icon: <LearnIcon /> },
  { label: 'Saved moments', icon: <BookmarkIcon /> },
]

const waves = [18, 28, 14, 35, 47, 24, 41, 54, 32, 19, 39, 48, 27, 17, 35, 43, 25, 32, 16]

const STORAGE_KEY = 'in-on-it:profile'

function loadProfile(): Profile | undefined {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Profile | null
    return saved && getLanguage(saved.lang) ? saved : undefined
  } catch {
    return undefined
  }
}

function greetingFor(date: Date) {
  const h = date.getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

type Mode = 'watch' | 'talk'

export default function App() {
  const [profile, setProfile] = useState<Profile | undefined>(loadProfile)
  const [editing, setEditing] = useState(false)
  const [listening, setListening] = useState(false)
  const [mode, setMode] = useState<Mode>('watch')
  const [recording, setRecording] = useState(false)
  const [activeNav, setActiveNav] = useState('Today')

  const saveProfile = (p: Profile) => {
    setProfile(p)
    setEditing(false)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)) } catch { /* storage unavailable: keep in memory */ }
  }

  if (!profile || editing) {
    return <Onboarding initial={profile} onCancel={profile ? () => setEditing(false) : undefined} onDone={saveProfile} />
  }

  const language = getLanguage(profile.lang)
  const content = homeContent[profile.lang]
  const speech = speechTag(language, profile.variant)
  const explainLabel = profile.explainIn === 'native' ? `simple ${language.native}` : 'English'
  const now = new Date()
  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).replace(',', ' ·')

  const listenCopy = mode === 'watch'
    ? {
        idleTitle: 'Tune into the show',
        idleBody: `Double-tap your earbud when you miss a joke. You’ll hear the context in ${explainLabel}, right away.`,
        liveTitle: 'Following along…',
        liveBody: 'Double-tap or ask out loud whenever you miss something.',
      }
    : {
        idleTitle: 'Join the conversation',
        idleBody: `Ask quietly when something goes over your head. You’ll hear the context in ${explainLabel} during the next pause.`,
        liveTitle: 'Listening to the room…',
        liveBody: 'I’ll wait for a pause so I never talk over anyone.',
      }

  const savedItems = [
    ...profile.unknown.map((q) => ({ phrase: q.prompt, meaning: `${q.options[q.answer]} · From your level check`, time: '' })),
    ...(content?.saved ?? []),
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <BrandMark />
        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              aria-current={activeNav === item.label ? 'page' : undefined}
              className={activeNav === item.label ? 'nav-item active' : 'nav-item'}
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              type="button"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="streak-card">
            <div className="streak-top">
              <span className="streak-flame">7</span>
              <span>day streak</span>
            </div>
            <p>Keep showing up. You’re building real-world confidence.</p>
            <div className="week-row" aria-label="Seven day learning streak">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <span className={index < 6 ? 'done' : ''} key={`${day}-${index}`}>{day}</span>
              ))}
            </div>
          </div>
          <button className="profile" type="button">
            <span className="avatar">MK</span>
            <span className="profile-copy">
              <strong>Maya Kim</strong>
              <small>Settings</small>
            </span>
            <SettingsIcon />
          </button>
        </div>
      </aside>

      <main className="dashboard">
        <header className="topbar">
          <div className="mobile-brand"><BrandMark compact /></div>
          <button className="language-pill" onClick={() => setEditing(true)} type="button" aria-label={`Family language: ${language.english}. Change`}>
            <span className="flag">{language.badge}</span>
            <span>
              <small>Family language</small>
              {language.native}{profile.variant ? ` · ${profile.variant}` : ''}
            </span>
            <span className="chevron">Change</span>
          </button>
          <button className="notification" aria-label="Notifications" type="button">
            <span />
            <Icon>
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM14 21h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </Icon>
          </button>
        </header>

        <div className="content">
          <section className="greeting">
            <div>
              <p className="overline">{dateLabel}</p>
              <h1>{greetingFor(now)}, Maya.</h1>
              <p className="subhead">Let’s get you in on the conversation.</p>
            </div>
            <div className="confidence">
              <div>
                <strong>{levels[profile.level].label}</strong>
              </div>
              <p>Your {language.english} level</p>
              <button className="trend" onClick={() => setEditing(true)} type="button">Retake level check</button>
            </div>
          </section>

          <section className={listening ? 'listen-card is-listening' : 'listen-card'}>
            <div className="listen-copy">
              <div className="mode-switch" role="radiogroup" aria-label="Listening mode">
                {(['watch', 'talk'] as Mode[]).map((m) => (
                  <button aria-checked={mode === m} className={mode === m ? 'on' : ''} key={m} onClick={() => setMode(m)} role="radio" type="button">
                    {m === 'watch' ? 'Watch a show' : 'Talk with family'}
                  </button>
                ))}
              </div>
              <span className="live-label"><i /> {listening ? 'Listening now' : 'Ready when you are'}</span>
              <h2>{listening ? listenCopy.liveTitle : listenCopy.idleTitle}</h2>
              <p>{listening ? listenCopy.liveBody : listenCopy.idleBody}</p>
              <div className="listen-actions">
                <button className="primary-action" onClick={() => setListening(!listening)} type="button">
                  <span className="action-icon">{listening ? '■' : <ListenIcon />}</span>
                  {listening ? 'Stop listening' : 'Start listening'}
                </button>
                <button
                  aria-checked={recording}
                  className={recording ? 'rec-toggle on' : 'rec-toggle'}
                  onClick={() => setRecording(!recording)}
                  role="switch"
                  type="button"
                >
                  <span className="rec-track"><i /></span>
                  Save recording {recording ? 'on' : 'off'}
                </button>
              </div>
              {recording && (
                <p className="rec-note">
                  {mode === 'talk'
                    ? 'Ask everyone first. Recordings stay on your phone and delete after 30 days unless you star them.'
                    : 'Saves the timestamps of your moments, not the show’s audio.'}
                </p>
              )}
            </div>
            <div className="sound-orbit" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="ear-core"><LogoGlyph /></div>
              {listening && (
                <div className="mini-wave">
                  {waves.map((height, index) => <i key={index} style={{ height }} />)}
                </div>
              )}
            </div>
          </section>

          <section className="tool-grid">
            <article className="tool-card simplify">
              <div className="tool-head">
                <span className="tool-icon"><SparkIcon /></span>
                <span className="tool-tag">Quick tool</span>
              </div>
              <h3>Make it simpler</h3>
              <p>Turn a phrase into {language.english} that matches your level.</p>
              {content ? (
                <div className="phrase-demo">
                  <div>
                    <span>Original</span>
                    <p lang={speech}>{content.simpler.original}</p>
                  </div>
                  <div className="phrase-arrow">↓</div>
                  <div>
                    <span>Simpler</span>
                    <p lang={speech}>{content.simpler.simpler}</p>
                  </div>
                </div>
              ) : (
                <div className="phrase-demo empty-demo"><p>Say or paste a {language.english} phrase to see it in simpler words.</p></div>
              )}
              <button className="text-action" type="button">Try a phrase <span>→</span></button>
            </article>

            <article className="tool-card culture">
              <div className="tool-head">
                <span className="tool-icon">
                  <Icon size={22}>
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M8 9h.01M16 9h.01M8.5 14.5c2.3 2 4.7 2 7 0" stroke="currentColor" strokeLinecap="round" strokeWidth="2.1" />
                  </Icon>
                </span>
                <span className="tool-tag">Culture cue</span>
              </div>
              <h3>Read the room</h3>
              <p>Understand the feeling underneath everyday expressions.</p>
              {content ? (
                <div className="culture-quote">
                  <span>Today’s cue</span>
                  <strong lang={speech}>“{content.cue.word}”</strong>
                  <p>{content.cue.meaning}</p>
                </div>
              ) : (
                <div className="culture-quote empty-demo"><p>Your first culture cue shows up after your first listening session.</p></div>
              )}
              <button className="text-action" type="button">Explore culture cues <span>→</span></button>
            </article>
          </section>

          <section className="lower-grid">
            <article className="progress-card">
              <div className="section-head">
                <div>
                  <p className="overline">Your sensitivity</p>
                  <h2>More than the words</h2>
                </div>
                <button type="button">View insights</button>
              </div>
              <div className="meter-row">
                <div className="meter-visual">
                  <svg viewBox="0 0 180 100">
                    <path d="M18 86a72 72 0 0 1 144 0" fill="none" pathLength="100" stroke="#e8e5dd" strokeLinecap="round" strokeWidth="17" />
                    <path d="M18 86a72 72 0 0 1 144 0" fill="none" pathLength="100" stroke="#ff7455" strokeDasharray="72 100" strokeLinecap="round" strokeWidth="17" />
                  </svg>
                  <div><strong>72</strong><span>Attuned</span></div>
                </div>
                <div className="meter-copy">
                  <p>You’re picking up on tone and context more consistently.</p>
                  <div className="skill-line"><span>Context</span><i><b style={{ width: '82%' }} /></i><strong>Strong</strong></div>
                  <div className="skill-line"><span>Tone</span><i><b style={{ width: '68%' }} /></i><strong>Growing</strong></div>
                  <div className="skill-line"><span>Idioms</span><i><b style={{ width: '54%' }} /></i><strong>Explore</strong></div>
                </div>
              </div>
            </article>

            <article className="recent-card">
              <div className="section-head">
                <div>
                  <p className="overline">Saved moments</p>
                  <h2>Worth remembering</h2>
                </div>
                <button type="button">See all</button>
              </div>
              <div className="saved-list">
                {savedItems.length ? (
                  savedItems.slice(0, 4).map((item) => (
                    <div className="saved-item" key={item.phrase}>
                      <button className="play" onClick={() => speak(item.phrase, speech)} type="button" aria-label={`Play ${item.phrase}`}>▶</button>
                      <div>
                        <strong lang={speech}>“{item.phrase}”</strong>
                        <p>{item.meaning}</p>
                      </div>
                      <time>{item.time}</time>
                    </div>
                  ))
                ) : (
                  <p className="saved-empty">Double-tap your earbud during a show or a conversation. The moment shows up here.</p>
                )}
              </div>
            </article>
          </section>
        </div>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button className={activeNav === item.label ? 'active' : ''} key={item.label} onClick={() => setActiveNav(item.label)} type="button">
            {item.icon}
            <span>{item.label === 'Saved moments' ? 'Saved' : item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
