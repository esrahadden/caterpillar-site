'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SECTIONS, type Question } from './questions';

type Value = string;
type Answers = Record<string, Value>;
type Stage = 'gate' | 'form' | 'done';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const PASS_KEY = 'shea-plan-passcode';
const MAIL = 'samer@caterpillar-consulting.ai';

async function call(body: Record<string, unknown>) {
  const res = await fetch('/api/shea-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return (await res.json().catch(() => ({ ok: false, error: 'server' }))) as {
    ok: boolean;
    error?: string;
    answers?: Answers;
    submitted_at?: string | null;
  };
}

function str(v: Value | undefined): string {
  return typeof v === 'string' ? v : '';
}
function hasAnswers(a: Answers) {
  return Object.keys(a).some((k) => str(a[k]).trim() !== '');
}

export default function Wizard() {
  const [stage, setStage] = useState<Stage>('gate');
  const [passcode, setPasscode] = useState('');
  const [gateError, setGateError] = useState('');
  const [busy, setBusy] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [returning, setReturning] = useState(false);
  const [save, setSave] = useState<SaveState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const heading = useRef<HTMLHeadingElement>(null);
  const pass = useRef('');
  const latest = useRef<Answers>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirty = useRef(false);

  const unlock = useCallback(async (code: string) => {
    setBusy(true);
    setGateError('');
    const out = await call({ action: 'load', passcode: code });
    setBusy(false);
    if (!out.ok) {
      try {
        sessionStorage.removeItem(PASS_KEY);
      } catch {}
      setGateError(
        out.error === 'locked'
          ? 'Too many tries. Wait 15 minutes and try again, or text Samer.'
          : out.error === 'denied'
            ? 'That passcode didn’t match. Check the message Samer sent you and try again.'
            : 'Something went wrong on our side. Try again in a minute.',
      );
      return;
    }
    pass.current = code;
    try {
      sessionStorage.setItem(PASS_KEY, code);
    } catch {}
    const loaded = out.answers ?? {};
    latest.current = loaded;
    setAnswers(loaded);
    setReturning(hasAnswers(loaded));
    setStage(out.submitted_at ? 'done' : 'form');
  }, []);

  // Same browser tab: skip the gate after a reload.
  useEffect(() => {
    let code = '';
    try {
      code = sessionStorage.getItem(PASS_KEY) ?? '';
    } catch {}
    if (!code) return;
    const t = setTimeout(() => void unlock(code), 0);
    return () => clearTimeout(t);
  }, [unlock]);

  const flush = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (!dirty.current) return;
    dirty.current = false;
    setSave('saving');
    const out = await call({ action: 'save', passcode: pass.current, answers: latest.current });
    if (!out.ok) dirty.current = true;
    setSave(out.ok ? 'saved' : 'error');
  }, []);

  const set = (id: string, value: Value) => {
    const next = { ...latest.current, [id]: value };
    latest.current = next;
    setAnswers(next);
    dirty.current = true;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), 900);
    if (errors[id]) setErrors((e) => ({ ...e, [id]: '' }));
  };

  // Move focus to the page heading so screen readers and keyboards start at the top.
  useEffect(() => {
    if (stage === 'gate') return;
    heading.current?.focus();
    window.scrollTo({ top: 0 });
  }, [stage]);

  const submit = async () => {
    const found: Record<string, string> = {};
    for (const q of SECTIONS.flatMap((s) => s.questions)) {
      if (q.required && str(answers[q.id]).trim() === '')
        found[q.id] = `Please add ${q.id === 'name' ? 'your name' : 'a way to reach you'} so I can reach you.`;
    }
    if (Object.keys(found).length) {
      setErrors(found);
      document.getElementById(`q-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    setSubmitError('');
    if (timer.current) clearTimeout(timer.current);
    const out = await call({ action: 'save', passcode: pass.current, answers: latest.current, submit: true });
    setBusy(false);
    if (!out.ok) {
      setSubmitError(`That didn’t send. Your answers are still here. Try again, or email ${MAIL}.`);
      return;
    }
    dirty.current = false;
    setStage('done');
  };

  const brand = (
    <div className="sp-brand">
      <Image src="/logos/caterpillar-logo.png" alt="" width={24} height={24} />
      Caterpillar AI Consulting
    </div>
  );

  if (stage === 'gate') {
    return (
      <main className="sp-main">
        {brand}
        <form
          className="sp-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (passcode.trim()) void unlock(passcode.trim());
          }}
        >
          <h1>Your setup plan</h1>
          <p className="sp-lead">This page is private. Enter the passcode Samer sent you.</p>
          <label className="sp-label" htmlFor="sp-pass">
            Passcode
          </label>
          <input
            id="sp-pass"
            className="sp-input"
            type="text"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            aria-describedby={gateError ? 'sp-pass-err' : undefined}
            aria-invalid={gateError ? true : undefined}
          />
          <p id="sp-pass-err" className="sp-error" role="alert">
            {gateError}
          </p>
          <button className="sp-btn primary" type="submit" disabled={busy || !passcode.trim()}>
            {busy ? 'Checking…' : 'Continue'}
          </button>
        </form>
      </main>
    );
  }

  if (stage === 'done') {
    return (
      <main className="sp-main">
        {brand}
        <div className="sp-card">
          <h1 ref={heading} tabIndex={-1}>
            Thanks{str(answers.name).trim() ? `, ${str(answers.name).trim().split(' ')[0]}` : ''}. I’ve got it.
          </h1>
          <p className="sp-lead">
            I’ll put together your setup plan and come back with a few follow-up questions. If you don’t have a GitHub account yet,
            create a free one at github.com before we talk. Here’s a copy of what you sent.
          </p>
          <div className="sp-actions-inline sp-noprint">
            <button type="button" className="sp-btn" onClick={() => window.print()}>
              Print or save a copy
            </button>
            <button type="button" className="sp-btn" onClick={() => setStage('form')}>
              Change an answer
            </button>
          </div>
          <dl className="sp-sum">
            {SECTIONS.flatMap((s) => s.questions).map((q) => {
              const text = str(answers[q.id]).trim();
              return (
                <div key={q.id}>
                  <dt>{q.label}</dt>
                  <dd className={text ? '' : 'empty'}>{text || 'Skipped'}</dd>
                </div>
              );
            })}
          </dl>
          <p className="sp-fine">— Samer · {MAIL}</p>
        </div>
      </main>
    );
  }

  const status =
    save === 'saving' ? 'Saving…' : save === 'saved' ? 'Saved' : save === 'error' ? 'Not saved. Check your connection.' : '';

  return (
    <main className="sp-main has-bar">
      {brand}
      <div className="sp-card">
        <h1 ref={heading} tabIndex={-1}>
          {returning ? 'Welcome back.' : 'Let’s plan your setup.'}
        </h1>
        <p className="sp-lead">
          Samer here. I’ll use this to plan a setup like mine for you: a small team of AI agents that keeps you organized and gets work
          done. One page, a few minutes. Answer as much or as little as you like and skip anything you’re unsure of. I’ll follow up on
          the rest. It saves as you go, so you can come back with the same link and passcode.
        </p>

        {SECTIONS.map((s) => (
          <div className="sp-section" role="group" aria-labelledby={`sec-${s.id}`} key={s.id}>
            <h2 id={`sec-${s.id}`} className="sp-h2">
              {s.title}
            </h2>
            {s.intro && <p className="sp-p">{s.intro}</p>}
            {s.questions.map((q) => (
              <Field key={q.id} q={q} answers={answers} set={set} error={errors[q.id]} />
            ))}
          </div>
        ))}

        <p className="sp-error" role="alert">
          {submitError}
        </p>
      </div>

      <div className="sp-bar">
        <div className="sp-bar-in">
          <span className={`sp-status ${save}`} role="status" aria-live="polite">
            {status}
          </span>
          <button type="button" className="sp-btn primary" onClick={() => void submit()} disabled={busy}>
            {busy ? 'Sending…' : 'Send to Samer'}
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({
  q,
  answers,
  set,
  error,
}: {
  q: Question;
  answers: Answers;
  set: (id: string, value: Value) => void;
  error?: string;
}) {
  const id = `q-${q.id}`;
  const hintId = q.hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined;

  if (q.type === 'text' || q.type === 'long') {
    return (
      <div className="sp-field">
        <label className="sp-label" htmlFor={id}>
          {q.label}
        </label>
        {q.hint && (
          <p className="sp-hint" id={hintId}>
            {q.hint}
          </p>
        )}
        {q.type === 'text' ? (
          <input
            id={id}
            className="sp-input"
            type="text"
            value={str(answers[q.id])}
            onChange={(e) => set(q.id, e.target.value)}
            maxLength={300}
            autoComplete={q.autoComplete ?? 'off'}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            aria-required={q.required || undefined}
          />
        ) : (
          <textarea
            id={id}
            className="sp-input"
            rows={q.id === 'context' ? 10 : 4}
            value={str(answers[q.id])}
            onChange={(e) => set(q.id, e.target.value)}
            maxLength={40000}
            aria-describedby={describedBy}
          />
        )}
        {error && (
          <p className="sp-error" id={errId} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  const picked = str(answers[q.id]);

  return (
    <fieldset className="sp-field" aria-describedby={hintId}>
      <legend className="sp-label">{q.label}</legend>
      {q.hint && (
        <p className="sp-hint" id={hintId}>
          {q.hint}
        </p>
      )}
      <div className="sp-chips">
        {(q.options ?? []).map((opt) => (
          <label key={opt} className="sp-chip">
            <input type="radio" name={id} checked={picked === opt} onChange={() => set(q.id, opt)} />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
