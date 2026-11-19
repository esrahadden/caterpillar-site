import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import '../glass.css';

export const metadata: Metadata = {
  title: 'Connect with Samer | Caterpillar AI Consulting',
  description: 'Book a quick call or save my contact. Caterpillar builds AI systems that take admin off small business owners’ plates.',
};

const CAL_LINK = 'https://cal.com/caterpillar.ai/quick-chat';

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export default function Connect() {
  return (
    <div className="gl gl-connect">
      <main className="card">
        <Link href="/" className="top">
          <Image src="/logos/caterpillar-logo.png" alt="" width={22} height={22} />
          Caterpillar AI Consulting
        </Link>
        <div className="ring">
          <div className="ring-inner">
            <Image src="/samer.jpg" alt="Samer Sabbagh" fill sizes="132px" priority />
          </div>
        </div>
        <div className="hi">Great to meet you</div>
        <h1>Samer Sabbagh</h1>
        <div className="role">Founder</div>
        <p className="blurb">
          I build AI systems that take estimates, intake, email and reporting off your plate, and I teach your team to use them so they stick.
        </p>
        <a className="btn" href={CAL_LINK} target="_blank" rel="noopener noreferrer">
          Book a quick call
        </a>
        <a className="btn glass" href="/card/samersabbagh.vcf" download>
          Save my contact
        </a>
        <div className="tiles">
          <a href="mailto:samer@caterpillar-consulting.ai">
            <svg {...iconProps}>
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="M4 7l8 6 8-6" />
            </svg>
            Email
          </a>
          <a href="tel:+14049390628">
            <svg {...iconProps}>
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
            </svg>
            Call / text
          </a>
          <Link href="/">
            <svg {...iconProps}>
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
            </svg>
            Website
          </Link>
        </div>
        <div className="social">
          <div className="social-label">Follow along · @samer.ai.guy</div>
          <div className="social-row">
            <a href="https://www.instagram.com/samer.ai.guy/" target="_blank" rel="noopener noreferrer" aria-label="Instagram, @samer.ai.guy">
              <svg {...iconProps}>
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
              </svg>
              Instagram
            </a>
            <a href="https://www.tiktok.com/@samer.ai.guy" target="_blank" rel="noopener noreferrer" aria-label="TikTok, @samer.ai.guy">
              <svg {...iconProps}>
                <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
                <path d="M14 3c.4 2.6 2.4 4.6 5 5" />
              </svg>
              TikTok
            </a>
          </div>
        </div>
        <p className="foot">© Caterpillar AI Consulting</p>
      </main>
    </div>
  );
}
