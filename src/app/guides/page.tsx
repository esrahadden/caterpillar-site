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
  meta: string;
  href: string;
};

const guides: Guide[] = [
  {
    title: 'Run local AI on your own computer',
    text: 'A plain-language, four-step setup for running an AI model privately on your own machine with LM Studio — no cloud, no subscription, your data stays with you.',
    meta: '2 pages · PDF',
    href: '/downloads/caterpillar-local-ai-setup-guide.pdf',
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
                <h2>Free guides</h2>
                <p className="lede">
                  Short, practical guides you can act on the same week. Download them free — no sign-up.
                </p>
                <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
                  {guides.map((g) => (
                    <div className="mini" key={g.href}>
                      <h3>{g.title}</h3>
                      <span>{g.text}</span>
                      <div className="row" style={{ marginTop: 16 }}>
                        <a className="btn glass sm" href={g.href} target="_blank" rel="noopener">
                          Download ({g.meta})
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
