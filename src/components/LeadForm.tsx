'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const INTERESTS = [
  { value: 'consulting', label: 'AI consulting for my business' },
  { value: 'team-training', label: 'Team training' },
  { value: 'seminar', label: 'Seminar or talk for a group' },
  { value: 'other', label: 'Something else' },
];

type Status = 'idle' | 'sending' | 'success' | 'error';

const inputClass =
  'w-full rounded-xl bg-black/30 border border-surface-border px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition';
const labelClass = 'block text-sm font-medium text-gray-300 mb-2';

export default function LeadForm({ compact = false, idPrefix = 'lead' }: { compact?: boolean; idPrefix?: string }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: bots fill this hidden field. Pretend success, don't submit.
    if (String(data.get('website') || '').length > 0) {
      setStatus('success');
      return;
    }

    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          interest: data.get('interest'),
          message: data.get('message'),
          source_page: (pathname || '/').slice(0, 200),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus('success');
        form.reset();
      } else {
        setError(json.error || 'Something went wrong. Please try again or email samer@caterpillar-consulting.ai.');
        setStatus('error');
      }
    } catch {
      setError('Could not send. Check your connection, or email samer@caterpillar-consulting.ai.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="glass rounded-3xl p-8 border border-surface-border text-center">
        <p className="text-xl font-heading font-bold text-white mb-2">Message sent</p>
        <p className="text-gray-300">Thanks — Samer will get back to you within one business day.</p>
      </div>
    );
  }

  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <form onSubmit={handleSubmit} className="relative glass rounded-3xl p-8 border border-surface-border space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={id('name')} className={labelClass}>
            Name <span className="text-cyan-400">*</span>
          </label>
          <input id={id('name')} name="name" type="text" required maxLength={120} autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor={id('email')} className={labelClass}>
            Email <span className="text-cyan-400">*</span>
          </label>
          <input id={id('email')} name="email" type="email" required minLength={3} maxLength={200} autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor={id('company')} className={labelClass}>
            Company <span className="text-gray-400">(optional)</span>
          </label>
          <input id={id('company')} name="company" type="text" maxLength={160} autoComplete="organization" className={inputClass} />
        </div>
        <div>
          <label htmlFor={id('interest')} className={labelClass}>
            What do you need?
          </label>
          <select id={id('interest')} name="interest" required defaultValue="consulting" className={inputClass}>
            {INTERESTS.map((o) => (
              <option key={o.value} value={o.value} className="bg-surface-primary">
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={id('message')} className={labelClass}>
          Message <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id={id('message')}
          name="message"
          rows={compact ? 3 : 5}
          maxLength={2000}
          className={inputClass}
          placeholder="What's taking up your team's time?"
        />
      </div>

      {/* Honeypot, hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor={id('website')}>Website</label>
        <input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-700 to-cyan-700 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p className="mt-3 text-xs text-gray-400">
          We&apos;ll only use this to reply to you. See our{' '}
          <Link href="/privacy" className="underline hover:text-cyan-400 transition">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
