import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Caterpillar AI Consulting',
  description: 'How Caterpillar AI Consulting collects, uses and stores the information you send us through this website.',
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-heading font-bold text-white tracking-tight">{title}</h2>
      <div className="space-y-3 text-gray-300 leading-relaxed">{children}</div>
    </section>
  );
}

const EMAIL = 'samer@caterpillar-consulting.ai';

export default function Privacy() {
  return (
    <main className="relative min-h-screen bg-surface-primary noise-texture text-gray-200">
      <div className="absolute -top-24 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10 pointer-events-none" />

      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-black/40 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image src="/logos/caterpillar-logo.png" alt="Caterpillar AI Consulting" width={32} height={32} className="rounded-lg" />
            <span className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Caterpillar AI Consulting</span>
          </Link>
          <Link href="/" className="text-sm text-gray-300 hover:text-cyan-400 transition">
            Back to home
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <article className="glass rounded-3xl border border-surface-border p-8 md:p-12 space-y-10">
          <header className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">Draft</p>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-white">Privacy Policy</h1>
            <p className="text-sm text-gray-400">Last updated: November 11, 2026</p>
          </header>

          <Section title="Who we are">
            <p>
              Caterpillar AI Consulting LLC is a small AI consulting firm based in Atlanta, Georgia. This policy explains what
              information we collect through this website and what we do with it. Questions? Email{' '}
              <a href={`mailto:${EMAIL}`} className="text-cyan-400 hover:underline">{EMAIL}</a>.
            </p>
          </Section>

          <Section title="What we collect">
            <p>We only collect information you choose to give us:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Contact form:</strong> your name, email address, company (if you add it), what
                you need help with, your message, and the page of our site you sent it from.
              </li>
              <li>
                <strong className="text-white">Booking a call:</strong> when you book a call, scheduling is handled by Cal.com,
                which collects the details you enter there (such as your name, email and chosen time) and shares them with us.
              </li>
            </ul>
          </Section>

          <Section title="How we use it">
            <p>
              We use your information to reply to you, schedule and hold calls, and provide the services you ask for. We
              don&apos;t sell your personal information, and we don&apos;t add you to a mailing list without asking.
            </p>
          </Section>

          <Section title="Where it's stored">
            <p>
              Contact form submissions are stored in Supabase, a database provider. This website is hosted by Vercel. Call
              bookings are handled by Cal.com. These providers process data on our behalf to run these services.
            </p>
          </Section>

          <Section title="How long we keep it">
            <p>
              We keep your information until you ask us to delete it, or until we no longer need it to reply to you or work
              with you.
            </p>
          </Section>

          <Section title="Your choices">
            <p>
              You can ask to see the information we hold about you, correct it, or have it deleted. Just email{' '}
              <a href={`mailto:${EMAIL}`} className="text-cyan-400 hover:underline">{EMAIL}</a> and we&apos;ll take care of it.
            </p>
          </Section>

          <Section title="Age">
            <p>
              This site is for business professionals and isn&apos;t intended for anyone under 18. We don&apos;t knowingly
              collect information from anyone under 18. If we learn we have, we&apos;ll delete it. If you believe someone under 18
              has sent us information, email us and we will delete it.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this policy from time to time. When we do, we&apos;ll change the &quot;last updated&quot; date at
              the top of this page.
            </p>
          </Section>
        </article>

        <footer className="text-center text-xs text-gray-500 font-mono mt-10">© Caterpillar AI Consulting LLC · Atlanta, Georgia</footer>
      </div>
    </main>
  );
}
