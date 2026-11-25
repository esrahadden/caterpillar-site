import type { Metadata } from 'next';
import '../glass.css';
import GlassBackdrop from '@/components/GlassBackdrop';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Guides | Caterpillar AI Consulting',
  description:
    'Free, practical AI guides from Caterpillar AI Consulting. Start with how to run local AI on your own computer.',
};

type Guide = {
  title: string;
  text: string;
  href: string;
  pages: number;
  sizeLabel: string;
};

const guides: Guide[] = [
  {
    title: 'Run local AI on your own computer',
    text: 'A four-step setup for running an AI model on your own computer with LM Studio. Once it’s set up, it works offline.',
    href: '/downloads/caterpillar-local-ai-setup-guide.pdf',
    pages: 2,
    sizeLabel: '529 KB',
  },
];

export default function Guides() {
  return (
    <div className="gl">
      <GlassBackdrop />
      <div className="wrap">
        <Navigation />
        <main>
          <section className="col" id="guides">
            <div className="content">
              <div className="panel">
                <div className="kick">Guides</div>
                <h1>Free guides</h1>
                <p className="lede">
                  Short, practical guides you can act on the same week. Download them free &mdash; no sign-up.
                </p>
                <ul className="guide-list">
                  {guides.map((g) => (
                    <li className="guide-item" key={g.href}>
                      <h2>{g.title}</h2>
                      <p>{g.text}</p>
                      <div className="row" style={{ marginTop: 16 }}>
                        <a
                          className="btn"
                          href={g.href}
                          download
                          aria-label={`Download ${g.title} — PDF, ${g.pages} pages, ${g.sizeLabel}`}
                        >
                          Download (PDF &middot; {g.pages} pages &middot; {g.sizeLabel})
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
