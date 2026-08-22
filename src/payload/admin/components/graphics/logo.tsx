import { Logo as Mascot } from '@/components/logo/logo'

/** Login/create-first-user screen graphic — reuses the site mascot mark. */
export const Logo: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1em',
    }}
  >
    <Mascot
      role="img"
      aria-label="PowerKids"
      style={{
        width: '3rem',
        color: 'var(--theme-text)',
        backgroundColor: 'var(--theme-bg)',
      }}
    />
    <h2 style={{ fontSize: '3rem' }}>PowerKids Kindergarten</h2>
  </div>
)
