'use client'

// Client component: rendered inside the Lexical toolbar (see feature.client).

/**
 * Toolbar icon — a wavy double underline, hinting at the hand-drawn mark
 * this feature applies. Named for the mark it draws (not just "icon") since
 * more emphasis variants (single underline, circle, sunburst — see
 * proto/panel3.html's `.em` shapes) may each need their own SVG here later.
 */
export function EmphasisSvg() {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      focusable="false"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 4V10.5C5.5 12.5 7 14 10 14C13 14 14.5 12.5 14.5 10.5V4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3 16c3-1.4 4-1.4 7-0.4s4 1 7-0.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <path
        d="M3 18.4c3-1.4 4-1.4 7-0.4s4 1 7-0.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  )
}
