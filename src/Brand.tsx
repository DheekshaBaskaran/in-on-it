/** "In On It" mark: an ear in a black disc, with a coral dot for the moment you get it. */
export function LogoGlyph({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 64 64">
      <circle cx="31" cy="33" r="28" fill="#1a1c19" />
      <path
        d="M20.5 33.5c0-9.6 5.3-15.8 12.6-15.8 7.1 0 11.9 5.4 11.9 12.4 0 5.9-2.9 8.9-6.3 11.5-2.6 2-4 4.1-4 7.4v1.3c0 2.3-1.7 3.9-3.8 3.9-1.5 0-2.8-.8-3.5-2"
        fill="none"
        stroke="#fbfaf6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5.2"
      />
      <path
        d="M28.6 32.6c0-3.6 2-5.9 4.7-5.9 2.6 0 4.4 2 4.4 4.6 0 2.4-1.3 3.7-3.4 5"
        fill="none"
        stroke="#fbfaf6"
        strokeLinecap="round"
        strokeWidth="3.8"
      />
      <circle cx="51" cy="13" r="7" fill="#ff6b4e" />
    </svg>
  )
}

export function BrandMark({ compact = false, size = 'md' }: { compact?: boolean; size?: 'md' | 'xl' }) {
  return (
    <div className={`brand brand-${size} ${compact ? 'brand-compact' : ''}`}>
      <LogoGlyph />
      {!compact && <span>In On It</span>}
    </div>
  )
}
