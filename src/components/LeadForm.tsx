'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './lead-form.css';

const INTERESTS = [
  { value: 'consulting', label: 'AI consulting for my business' },
  { value: 'team-training', label: 'Team training' },
  { value: 'seminar', label: 'Seminar or talk for a group' },
  { value: 'other', label: 'Something else' },
];

type Status = 'idle' | 'sending' | 'success' | 'error';

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
      <div role="status" className="lead-form-done">
        <strong>Message sent</strong>
        Thanks — Samer will get back to you within one business day.
      </div>
    );
  }

  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <form onSubmit={handleSubmit} className="lead-form">
      <label htmlFor={id('name')}>
        Name *
        <input id={id('name')} name="name" type="text" required maxLength={120} autoComplete="name" />
      </label>
      <label htmlFor={id('email')}>
        Email *
        <input id={id('email')} name="email" type="email" required minLength={3} maxLength={200} autoComplete="email" />
      </label>
      <label htmlFor={id('company')}>
        <span>
          Company <em>(optional)</em>
        </span>
        <input id={id('company')} name="company" type="text" maxLength={160} autoComplete="organization" />
      </label>
      <label htmlFor={id('interest')}>
        What do you need?
        <select id={id('interest')} name="interest" required defaultValue="consulting">
          {INTERESTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor={id('message')} className="full">
        <span>
          Message <em>(optional)</em>
        </span>
        <textarea
          id={id('message')}
          name="message"
          rows={compact ? 3 : 5}
          maxLength={2000}
          placeholder="What's taking up your team's time?"
        />
      </label>

      {/* Honeypot, hidden from people and screen readers */}
      <div aria-hidden="true" className="hp">
        <label htmlFor={id('website')}>Website</label>
        <input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'error' && (
        <p role="alert" className="full form-error">
          {error}
        </p>
      )}

      <div className="full">
        <button type="submit" className="lf-submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p className="fine" style={{ marginTop: 12 }}>
          We&apos;ll only use this to reply to you. See our <Link href="/privacy">privacy policy</Link>.
        </p>
      </div>
    </form>
  );
}
