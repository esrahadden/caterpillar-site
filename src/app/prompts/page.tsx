import type { Metadata } from 'next';
import '../glass.css';
import './prompts.css';
import Navigation from '@/components/Navigation';
import { COLLECTIONS } from '@/data/prompts';
import CopyButton from './CopyButton';

export const metadata: Metadata = {
  title: 'Free AI Prompts | Caterpillar AI Consulting',
  description: 'Copy-and-paste prompts we use with clients. Free, no sign-up.',
};

const CAL_LINK = 'https://cal.com/caterpillar.ai/quick-chat';
const PLACEHOLDER = /^\[.+\]$/;

function PromptText({ text }: { text: string }) {
  return (
    <p className="ptext">
      {text.split('\n').map((line, i) => (
        <span key={i} className={PLACEHOLDER.test(line) ? 'ph' : undefined}>
          {line}
          {'\n'}
        </span>
      ))}
    </p>
  );
}

export default async function Prompts({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const col = COLLECTIONS.find((x) => x.slug === c) ?? COLLECTIONS[0];

  return (
    <div className="gl gl-prompts">
      <div className="haze dusk" aria-hidden="true" />
      <div className="wrap">
        <Navigation />
        <main className="col">
          <header className="p-hero">
            <div className="kick">Free prompts</div>
            <h1>Prompts</h1>
            <p className="lede">Copy-and-paste prompts we use with clients. Free, no sign-up.</p>
          </header>

          <nav className="pills" aria-label="Prompt collections">
            {COLLECTIONS.map((x) => (
              <a key={x.slug} href={`/prompts?c=${x.slug}`} aria-current={x.slug === col.slug ? 'page' : undefined}>
                {x.name}
              </a>
            ))}
          </nav>

          <section className="p-col" id={col.slug} aria-labelledby={`${col.slug}-h`}>
            <h2 id={`${col.slug}-h`}>{col.name}</h2>
            <p className="blurb">{col.blurb}</p>

            {col.steps.map((s, i) => (
              <div className="p-step" key={s.title}>
                <h3>
                  {i + 1}. {s.title}
                </h3>
                {s.sub && <p className="sub">{s.sub}</p>}
                <div className={s.prompts.length === 1 ? 'grid one' : 'grid'}>
                  {s.prompts.map((p) => (
                    <div className="panel pcard" key={p.label}>
                      <div className="plabel">{p.label}</div>
                      <CopyButton text={p.text} label={p.label} />
                      <PromptText text={p.text} />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="tips">
              <h3>Tips</h3>
              <ul>
                {col.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </section>

          <div className="p-cta">
            <p>Want help putting AI to work in your business?</p>
            <a className="btn" href={CAL_LINK} target="_blank" rel="noopener noreferrer">
              Book a quick call
            </a>
          </div>

          <p className="p-foot">© Caterpillar AI Consulting</p>
        </main>
      </div>
    </div>
  );
}
