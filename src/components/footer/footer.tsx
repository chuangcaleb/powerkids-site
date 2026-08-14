import { cx } from '@/lib/cx'
import { FooterContact } from './footer-contact/footer-contact'
import { FooterNav } from './footer-nav/footer-nav'
import styles from './footer.module.css'

export async function Footer() {
  return (
    <footer className={styles.footer}>
      <FooterContact />
      <FooterNav />
      <div className={styles.bottom}>
        <div className={cx('cluster', 'wrapper')}>
          <span>&copy; {new Date().getFullYear()} PowerKids Kindergarten</span>
          <span>
            {'Designed by '}
            <a href="https://chuangcaleb.com" target="_blank" rel="noopener noreferrer">
              Chuang Caleb
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
