import { Logo as Mascot } from '@/components/logo/logo'

/** Collapsed-nav mark — same mascot, sized for the small nav slot. */
export const Icon: React.FC = () => (
  <Mascot
    role="img"
    aria-label="PowerKids"
    style={{
      width: '1.5rem',
      color: 'var(--theme-text)',
      backgroundColor: 'var(--theme-bg)',
    }}
  />
)
