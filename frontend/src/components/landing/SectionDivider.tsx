export function SectionDivider() {
  return (
    <div className="relative h-12 overflow-hidden text-secondary/60" aria-hidden>
      <svg viewBox="0 0 1440 48" fill="currentColor" className="absolute bottom-0 w-full" preserveAspectRatio="none">
        <path d="M0,24 C240,48 480,0 720,24 C960,48 1200,0 1440,24 L1440,48 L0,48 Z" />
      </svg>
    </div>
  )
}
