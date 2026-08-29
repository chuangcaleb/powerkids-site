import { cx } from '@/lib/cx'
import { SITE_CREDIT, SITE_NAME } from '@/lib/site'
import { FaqSection } from '@/components/faq-section/faq-section'
import { RegistrationSection } from '@/components/registration-section/registration-section'
import { SectionSeam } from '@/components/section-seam/section-seam'
import { Sticker } from '@/components/sticker/sticker'
import { getCta } from '@/payload/globals/get-cta'
import { FooterContact } from './footer-contact/footer-contact'
import { FooterNav } from './footer-nav/footer-nav'
import styles from './footer.module.css'

export async function Footer() {
  const cta = await getCta()

  return (
    <footer id="footer">
      <FaqSection id="faq" />

      <div className={styles.closingWrap}>
        <SectionSeam
          shape="pinking"
          width={13.125}
          depth={1.375}
          above="var(--page-trailing-bg, var(--bg-surface))"
          below="var(--seam-cream-closing)"
        >
          {cta.footerSticker && <Sticker>{cta.footerSticker}</Sticker>}
        </SectionSeam>

        <div className={styles.closing}>
          <RegistrationSection className={styles.cta} />
          <FooterContact className={styles.contact} />
        </div>

        <SectionSeam
          shape="torn"
          width={1.5}
          depth={0.3}
          seed="closing-nav"
          above="var(--seam-closing-nav)"
          below="var(--bg-inverse)"
        />
      </div>

      <FooterNav />
      <div className={styles.bottom}>
        <div className={cx('cluster', 'wrapper')}>
          <span>
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </span>
          <span>
            {'Designed by '}
            <a href={SITE_CREDIT.url} target="_blank" rel="noopener noreferrer">
              {SITE_CREDIT.label}
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
