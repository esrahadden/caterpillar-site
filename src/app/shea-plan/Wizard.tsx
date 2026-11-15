'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SECTIONS, type Question } from './questions';

type Value = string | string[];
type Answers = Record<string, Value>;
type Stage = 'gate' | 'form' | 'done';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const REVIEW = SECTIONS.length + 1; // step 0 is the welcome screen
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
function list(v: Value | undefined): string[] {
  return Array.isArray(v) ? v : [];
}
function shown(q: Question, a: Answers): string {
  const main = q.type === 'multi' ? list(a[q.id]).join(', ') : str(a[q.id]).trim();
  const more = str(a[`${q.id}_more`]).trim();
  return [main, more].filter(Boolean).join(' · ');
}
function hasAnswers(a: Answers) {
  return Object.keys(a).some((k) => k !== '_step' && (Array.isArray(a[k]) ? a[k].length > 0 : str(a[k]).trim() !== ''));
}

export default function Wizard() {
  const [stage, setStage] = useState<Stage>('gate');
  const [passcode, setPasscode] = useState('');
  const [gateError, setGateError] = useState('');
  const [busy, setBusy] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [returning, setReturning] = useState(false);
  const [resume, setResume] = useState(1);
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
    if (out.submitted_at) {
      setStage('done');
      return;
    }
    const saved = Number(str(loaded._step));
    setReturning(hasAnswers(loaded));
    setResume(Number.isInteger(saved) && saved >= 1 && saved <= REVIEW ? saved : 1);
    setStep(0);
    setStage('form');
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
    if (!dirty.current) return true;
    dirty.current = false;
    setSave('saving');
    const out = await call({ action: 'save', passcode: pass.current, answers: latest.current });
    if (!out.ok) dirty.current = true;
    setSave(out.ok ? 'saved' : 'error');
    return out.ok;
  }, []);

  const queue = useCallback(
    (next: Answers) => {
      latest.current = next;
      dirty.current = true;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), 900);
    },
    [flush],
  );

  const set = (id: string, value: Value) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      queue(next);
      return next;
    });
    if (errors[id]) setErrors((e) => ({ ...e, [id]: '' }));
  };

  const go = (to: number) => {
    setErrors({});
    setSubmitError('');
    setReturning(false);
    setStep(to);
    const next = { ...latest.current, _step: String(to) };
    setAnswers(next);
    latest.current = next;
    dirty.current = true;
    void flush();
  };

  // Move focus to the step heading so screen readers and keyboards start at the top.
  useEffect(() => {
    if (stage === 'gate') return;
    heading.current?.focus();
    window.scrollTo({ top: 0 });
    document.querySelector('.sp-progress [aria-current]')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [step, stage]);

  const missing = (sectionIndex: number) => {
    const found: Record<string, string> = {};
    for (const q of SECTIONS[sectionIndex].questions) {
      if (q.required && str(answers[q.id]).trim() === '') found[q.id] = `Please add ${q.id === "name" ? "your name" : "a way to reach you"} so I can reach you.`;
    }
    return found;
  };

  const next = () => {
    if (step >= 1 && step <= SECTIONS.length) {
      const found = missing(step - 1);
      if (Object.keys(found).length) {
        setErrors(found);
        document.getElementById(`q-${Object.keys(found)[0]}`)?.focus();
        return;
      }
    }
    go(step === 0 && returning ? resume : step + 1);
  };

  const submit = async () => {
    const found = missing(0);
    if (Object.keys(found).length) {
      go(1);
      setErrors(found);
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

  const summary = (editable: boolean) =>
    SECTIONS.map((s, i) => (
      <div role="group" className="sp-sum" key={s.id} aria-labelledby={`sum-${s.id}`}>
        <div className="sp-sum-head">
          <h2 id={`sum-${s.id}`}>{s.title}</h2>
          {editable && (
            <button type="button" className="sp-link" onClick={() => go(i + 1)}>
              Edit<span className="sp-vh"> {s.title}</span>
            </button>
          )}
        </div>
        <dl>
          {s.questions.map((q) => {
            const text = shown(q, answers);
            return (
              <div key={q.id}>
                <dt>{q.label}</dt>
                <dd className={text ? '' : 'empty'}>{text || 'Skipped'}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    ));

  if (stage === 'done') {
    return (
      <main className="sp-main">
        {brand}
        <div className="sp-card">
          <h1 ref={heading} tabIndex={-1}>
            Thanks{str(answers.name).trim() ? `, ${str(answers.name).trim().split(' ')[0]}` : ''}. I’ve got it.
          </h1>
          <p className="sp-lead">
            I’ll read through your answers, put together your setup plan and reach out. If you can, create a free GitHub account at
            github.com before we talk. Here’s a copy of what you sent.
          </p>
          <div className="sp-actions-inline sp-noprint">
            <button type="button" className="sp-btn" onClick={() => window.print()}>
              Print or save a copy
            </button>
            <button type="button" className="sp-btn" onClick={() => { setStage('form'); setStep(REVIEW); }}>
              Change an answer
            </button>
          </div>
          {summary(false)}
          <p className="sp-fine">— Samer · {MAIL}</p>
        </div>
      </main>
    );
  }

  const section = step >= 1 && step <= SECTIONS.length ? SECTIONS[step - 1] : null;
  const status =
    save === 'saving' ? 'Saving…' : save === 'saved' ? 'Saved' : save === 'error' ? 'Not saved. Check your connection.' : '';

  return (
    <main className="sp-main has-bar">
      {brand}

      {step > 0 && (
        <nav className="sp-progress" aria-label="Sections">
          <p className="sp-step">
            {step === REVIEW ? 'Last step: review' : `Step ${step} of ${SECTIONS.length}`}
            <span className={`sp-status ${save}`} role="status" aria-live="polite">
              {status}
            </span>
          </p>
          <ol>
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={i + 1 === step ? 'current' : i + 1 < step ? 'past' : ''}
                  aria-current={i + 1 === step ? 'step' : undefined}
                  onClick={() => go(i + 1)}
                >
                  {s.title}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className={step === REVIEW ? 'current' : ''}
                aria-current={step === REVIEW ? 'step' : undefined}
                onClick={() => go(REVIEW)}
              >
                Review
              </button>
            </li>
          </ol>
        </nav>
      )}

      <div className="sp-card">
        {step === 0 && (
          <>
            <h1 ref={heading} tabIndex={-1}>
              {returning ? 'Welcome back.' : 'Let’s plan your setup.'}
            </h1>
            <p className="sp-lead">
              Samer here. You said you want what I have: a small team of AI helpers that handle the busywork and report to you. I’ll use
              your answers to plan yours.
            </p>
            <ul className="sp-list">
              <li>
                <strong>Answer as much or as little as you like.</strong> Almost everything is optional and most of it is tap-to-pick.
                Skip whatever you want. I’ll follow up on the rest when we talk.
              </li>
              <li>
                <strong>It saves as you go.</strong> Close it whenever you like. Come back with the same link and passcode.
              </li>
              <li>
                <strong>About 15 minutes.</strong> {SECTIONS.length} short sections. If you feel like sharing more, type or dictate away in the
                open questions. It all helps.
              </li>
              <li>
                <strong>Your answers stay private.</strong> Only I and the team building your setup see them.
              </li>
            </ul>
            <h2 className="sp-h2">Two things you’ll need before we build</h2>
            <p className="sp-p">You don’t need them to fill this out.</p>
            <ul className="sp-list">
              <li>
                <strong>An email address for the setup.</strong> A new one or the one you have. There’s a question about it inside.
              </li>
              <li>
                <strong>A free GitHub account.</strong> It’s where your builder’s work gets stored. You can sign up at github.com in a
                couple of minutes.
              </li>
            </ul>
          </>
        )}

        {section && (
          <>
            <h1 ref={heading} tabIndex={-1}>
              {section.title}
            </h1>
            <p className="sp-lead">{section.intro}</p>
            {section.questions.map((q) => (
              <Field key={q.id} q={q} answers={answers} set={set} error={errors[q.id]} />
            ))}
          </>
        )}

        {step === REVIEW && (
          <>
            <h1 ref={heading} tabIndex={-1}>
              Check your answers
            </h1>
            <p className="sp-lead">Change anything you like, then send it to me. Skipped questions are fine.</p>
            {summary(true)}
            <p className="sp-error" role="alert">
              {submitError}
            </p>
          </>
        )}
      </div>

      <div className="sp-bar">
        <div className="sp-bar-in">
          {step > 0 ? (
            <button type="button" className="sp-btn" onClick={() => go(step - 1)}>
              Back
            </button>
          ) : (
            <span />
          )}
          {step === REVIEW ? (
            <button type="button" className="sp-btn primary" onClick={() => void submit()} disabled={busy}>
              {busy ? 'Sending…' : 'Send to Samer'}
            </button>
          ) : (
            <button type="button" className="sp-btn primary" onClick={next}>
              {step === 0 ? (returning ? 'Pick up where I left off' : 'Start') : step === SECTIONS.length ? 'Review' : 'Continue'}
            </button>
          )}
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
  const optional = !q.required && <span className="sp-opt"> (optional)</span>;

  if (q.type === 'text' || q.type === 'long') {
    return (
      <div className="sp-field">
        <label className="sp-label" htmlFor={id}>
          {q.label}
          {optional}
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
            inputMode={q.inputMode}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            aria-required={q.required || undefined}
          />
        ) : (
          <textarea
            id={id}
            className="sp-input"
            rows={4}
            value={str(answers[q.id])}
            onChange={(e) => set(q.id, e.target.value)}
            maxLength={6000}
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

  const multi = q.type === 'multi';
  const picked = multi ? list(answers[q.id]) : [str(answers[q.id])];
  const toggle = (opt: string) => {
    if (!multi) return set(q.id, opt);
    set(q.id, picked.includes(opt) ? picked.filter((o) => o !== opt) : [...picked, opt]);
  };

  return (
    <fieldset className="sp-field" aria-describedby={hintId}>
      <legend className="sp-label">
        {q.label}
        {optional}
      </legend>
      {q.hint && (
        <p className="sp-hint" id={hintId}>
          {q.hint}
        </p>
      )}
      <div className="sp-chips">
        {(q.options ?? []).map((opt) => (
          <label key={opt} className="sp-chip">
            <input
              type={multi ? 'checkbox' : 'radio'}
              name={id}
              checked={picked.includes(opt)}
              onChange={() => toggle(opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      {q.more && (
        <div className="sp-more">
          <label className="sp-hint" htmlFor={`${id}-more`}>
            {q.more}
          </label>
          <input
            id={`${id}-more`}
            className="sp-input"
            type="text"
            value={str(answers[`${q.id}_more`])}
            onChange={(e) => set(`${q.id}_more`, e.target.value)}
            maxLength={1000}
            autoComplete="off"
          />
        </div>
      )}
    </fieldset>
  );
}
