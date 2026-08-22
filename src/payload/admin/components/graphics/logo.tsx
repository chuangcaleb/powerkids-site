import { Logo as Mascot } from '@/components/logo/logo'

/** Login/create-first-user screen graphic — reuses the site mascot mark. */
export const Logo: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.5em',
    }}
  >
    <Mascot
      role="img"
      aria-label="PowerKids"
      style={{
        width: '7rem',
        color: 'var(--theme-text)',
        backgroundColor: 'var(--theme-bg)',
      }}
    />
    <h2 style={{ fontSize: '5rem', fontWeight: 800 }}>
      <span style={{ color: 'var(--accent-red)' }}>Power</span>
      <span style={{ color: 'var(--accent-blue)' }}>Kids</span>
    </h2>
  </div>
)
