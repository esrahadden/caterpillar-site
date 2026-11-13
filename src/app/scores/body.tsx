'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';
import ViewSwitch from './ViewSwitch';
import JobPicker from './JobPicker';
import LeadForm from '@/components/LeadForm';
import { EmptyPicks, ModelPicker, PickNote, SortButton, useColumns, useRowSwitches, useSortedRows } from './picks';
import { CodingSpider, CodingValue, HeatmapLines, HeatmapSpider, ImageValue, SweValue, WriterValue } from './views2';
import {
  CodingBars, CodingDots, GapBars, GapDots, GapTable, HeatmapBars, HeatmapDots, ImageBars, ImageDots,
  SweBars, SweDots, WriterBars, WriterDots,
} from './views';
import {
  CALL_LABEL,
  CODING,
  HEATMAP,
  IMAGE_GEN,
  JOBS,
  BANK,
  BANK_NOTES,
  KIND_LABEL,
  PRIVACY_STATS,
  PROMPT_WRITERS,
  ROUNDS,
  SWE,
  TAKEAWAYS,
  type Call,
  type Filter,
  type Kind,
  sel,
} from './data';


type Viewable = (p: { f?: Filter }) => ReactNode;
const tri = (C: Viewable) => ({ all: <C f="all" />, frontier: <C f="frontier" />, open: <C f="open" /> });

const CAL_LINK = 'https://cal.com/caterpillar.ai/quick-chat';

const KIND_COLOR: Record<Kind, string> = {
  frontier: 'text-purple-300',
  open: 'text-cyan-300',
  local: 'text-emerald-300',
  api: 'text-gray-400',
};

const CALL_STYLE: Record<Call, string> = {
  go: 'border-emerald-400/60 text-emerald-300',
  stay: 'border-purple-400/60 text-purple-300',
  any: 'border-gray-500 text-gray-300',
  cheap: 'border-cyan-400/60 text-cyan-300',
};

// Score -> cell shade (cyan ramp on the dark surface)
const BINS = [4.0, 4.3, 4.5, 4.7, 4.8];
const ALPHA = [0.08, 0.18, 0.3, 0.45, 0.62, 0.82];
function shade(v: number) {
  let i = 0;
  while (i < BINS.length && v >= BINS[i]) i++;
  return { background: `rgba(6, 182, 212, ${ALPHA[i]})`, color: i >= 4 ? '#04121a' : '#e5e7eb', fontWeight: i >= 4 ? 600 : 400 };
}

function LearnMoreButton({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-block px-6 py-3 bg-gradient-to-r from-purple-700 to-cyan-700 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-shadow duration-300 ${className}`}
    >
      Learn more about Caterpillar AI Consulting →
    </Link>
  );
}

function Section({ title, sub, children }: { title: string; sub?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl space-y-3">
        <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-white">{title}</h2>
        {sub && <p className="text-gray-400 leading-relaxed">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function Table({ head, children, alignRightFrom = 1, sortable = true }: { head: string[]; children: ReactNode; alignRightFrom?: number; sortable?: boolean }) {
  const { rows, header } = useSortedRows(children);
  const cols = useColumns(head);
  const sw = useRowSwitches();
  if (rows.length === 0) return <EmptyPicks />;
  return (
    <div className="space-y-3">
      {sortable && cols.bar}
      <div className="overflow-x-auto glass rounded-2xl">
        <table className="w-full text-sm tabular-nums">
          <thead>
            <tr className="border-b border-white/10">
              {head.map((h, i) => {
                if (!cols.show(i)) return null;
                const hp = header(i);
                return (
                  <th
                    key={i}
                    aria-sort={sortable ? hp.ariaSort : undefined}
                    className={`px-4 py-3 font-mono text-xs uppercase tracking-wider text-gray-400 font-normal whitespace-nowrap ${i >= alignRightFrom ? 'text-right' : 'text-left'}`}
                  >
                    {sortable ? <SortButton label={h} h={hp} right={i >= alignRightFrom} /> : h}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{sortable ? rows.map((r) => cols.filterRow(sw(r))) : children}</tbody>
        </table>
      </div>
    </div>
  );
}

function HeatmapTable({ f = 'all' }: { f?: Filter }) {
  const { rows, header } = useSortedRows(
    sel(HEATMAP, f).map(([name, kind, scores]) => (
                  <tr key={name}>
                    <th className="text-left font-medium text-white pr-4 py-0.5 whitespace-nowrap">
                      {name}
                      <span className={`block font-mono text-[10px] uppercase tracking-wider font-normal ${KIND_COLOR[kind]}`}>{KIND_LABEL[kind]}</span>
                    </th>
                    {scores.map((v, j) => (
                      <td key={j} className="p-0.5">
                        {v == null ? (
                          <div className="h-10 min-w-[84px] rounded flex items-center justify-center font-mono text-xs text-gray-600 border border-dashed border-white/10">not run</div>
                        ) : (
                          <div className="h-10 min-w-[84px] rounded flex items-center justify-center font-mono text-sm" style={shade(v)} title={`${name}, ${ROUNDS[j].name}: ${v.toFixed(2)}`}>
                            {v.toFixed(2)}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
  );
  const sw = useRowSwitches();
  const cols = useColumns(['Model', ...ROUNDS.map((r) => `${r.id} ${r.name}`)]);
  if (rows.length === 0) return <EmptyPicks />;
  return (
    <div className="space-y-4">
      {cols.bar}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-gray-400">
            {(['frontier', 'open', 'local'] as Kind[]).map((k) => (
              <span key={k} className={KIND_COLOR[k]}>● {KIND_LABEL[k]}</span>
            ))}
            <span className="flex items-center gap-1">
              Score
              {ALPHA.map((a) => (
                <i key={a} className="inline-block w-5 h-3 rounded-sm" style={{ background: `rgba(6,182,212,${a})` }} />
              ))}
              under 4.0 → 4.8+
            </span>
          </div>
          <div className="overflow-x-auto glass rounded-2xl p-4">
            <table className="w-full tabular-nums">
              <thead>
                <tr>
                  <th aria-sort={header(0).ariaSort} className="text-left font-mono text-xs uppercase tracking-wider text-gray-400 font-normal pb-3 pr-4"><SortButton label="Model" h={header(0)} /></th>
                  {ROUNDS.map((r, j) => cols.show(j + 1) && (
                    <th key={r.id} aria-sort={header(j + 1).ariaSort} className="font-mono text-xs uppercase tracking-wider text-gray-400 font-normal pb-3 px-1 text-center whitespace-nowrap">
                      <SortButton label={<>{r.id}<span className="block normal-case tracking-normal text-gray-500">{r.name}</span></>} h={header(j + 1)} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => cols.filterRow(sw(r)))}
              </tbody>
            </table>
          </div>
    </div>
  );
}

function ImageTable({ f = 'all' }: { f?: Filter }) {
  return (
    <div className="space-y-4">
      <Table head={['Generator', 'Score (3 common)', 'YouTube thumbnail', 'LinkedIn quote card', 'Law-firm logo', 'Infographic', 'Photo header', 'Post as-is', '$ / image']}>
            {sel(IMAGE_GEN, f).map(([n, score, ...rest]) => (
              <tr key={n} className="border-t border-white/5">
                <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{n}</td>
                <td className="px-4 py-3 text-right font-mono text-cyan-300 font-semibold">{score.toFixed(2)}</td>
                {rest.map((c, i) => (
                  <td key={i} className="px-4 py-3 text-right font-mono text-gray-300">{c}</td>
                ))}
              </tr>
            ))}
          </Table>
    </div>
  );
}

function WriterTable({ f = 'all' }: { f?: Filter }) {
  return (
    <div className="space-y-4">
      <Table head={['Prompt writer', 'Overall', 'Images (6)', 'Post as-is', 'Video (2)', 'Post as-is', '$ / prompt']}>
            {sel(PROMPT_WRITERS, f).map(([n, score, ...rest]) => (
              <tr key={n} className={`border-t border-white/5 ${n.startsWith('No writer') ? 'opacity-60' : ''}`}>
                <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{n}</td>
                <td className="px-4 py-3 text-right font-mono text-cyan-300 font-semibold">{score.toFixed(2)}</td>
                {rest.map((c, i) => (
                  <td key={i} className="px-4 py-3 text-right font-mono text-gray-300">{c}</td>
                ))}
              </tr>
            ))}
          </Table>
    </div>
  );
}

function CodingTable({ f = 'all' }: { f?: Filter }) {
  return (
    <div className="space-y-4">
      <Table head={['Model', 'Overall', 'Hard agentic (5)', 'Agentic coding (6)', 'One-shot (12)', 'Polyglot orig / reworded', '$ for the round']}>
            {sel(CODING, f).map(([n, open, score, ...rest]) => (
              <tr key={n} className="border-t border-white/5">
                <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                  {n} {open && <span className="font-mono text-[10px] uppercase text-cyan-300 ml-1">open</span>}
                </td>
                <td className="px-4 py-3 text-right font-mono text-cyan-300 font-semibold">{score.toFixed(2)}</td>
                {rest.map((c, i) => (
                  <td key={i} className="px-4 py-3 text-right font-mono text-gray-300">{c}</td>
                ))}
              </tr>
            ))}
          </Table>
    </div>
  );
}

function SweTable({ f = 'all' }: { f?: Filter }) {
  return (
    <div className="space-y-4">
      <Table head={['Model', 'Issues fixed', 'Avg steps', 'Hit step limit', 'Cost (5 issues)']}>
            {sel(SWE, f).map(([n, open, ...rest]) => (
              <tr key={n} className="border-t border-white/5">
                <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                  {n} {open && <span className="font-mono text-[10px] uppercase text-cyan-300 ml-1">open</span>}
                </td>
                {rest.map((c, i) => (
                  <td key={i} className={`px-4 py-3 text-right font-mono ${i === 0 ? 'text-cyan-300 font-semibold' : 'text-gray-300'}`}>{c}</td>
                ))}
              </tr>
            ))}
          </Table>
    </div>
  );
}

export default function ScoresBody() {
  return (
    <main className="relative min-h-screen bg-surface-primary noise-texture text-gray-200">
      <div className="absolute inset-x-0 top-0 h-[900px] bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-cyan-900/30 pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent)' }} />
      <div className="absolute -top-24 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10 pointer-events-none" />

      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-black/40 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image src="/logos/caterpillar-logo.png" alt="Caterpillar AI Consulting" width={32} height={32} className="rounded-lg" />
            <span className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Caterpillar AI Consulting</span>
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-gradient-to-r from-purple-700 to-cyan-700 text-white rounded-full text-sm font-semibold whitespace-nowrap hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow"
          >
            Learn more<span className="hidden sm:inline"> about Caterpillar AI Consulting</span>
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-24">
        {/* Hero */}
        <header className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">Caterpillar model lab · full scores</p>
          <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight max-w-4xl">
            We tested 23 AI models on{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">real business work</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            Made-up versions of the work small businesses actually do: client emails, call summaries, video scripts, code fixes,
            legal reading and deadlines, office files and tool-using admin. Plus a local privacy layer for law firms, eight image
            generators, AI models as prompt writers for images and video, and a coding round with real agent tasks.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm text-gray-400">
            <span>Run <b className="text-white">Nov 9, 2026</b></span>
            <span>Data <b className="text-white">100% synthetic</b></span>
            <span>Scale <b className="text-white">0–5</b></span>
          </div>
        </header>

        <ModelPicker />

        {/* Conclusion */}
        <div className="glass rounded-2xl p-6 md:p-8 border-l-4 border-l-cyan-400 space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400">The short version</p>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
            Frontier models are tied, and open models are close behind. Choose by job and price.
          </h2>
          <p className="text-gray-300 leading-relaxed max-w-4xl">
            On writing, summaries, extraction, long documents and deadlines, the best open models (Kimi, DeepSeek V4.1 Flash,
            Qwen3.8) match frontier models within noise for a fraction of the cost. The gap remains on judgment-heavy work
            (contract review), on agent actions that touch real data, and on how slides and graphics look. Qwen3.8 27B is the
            standout model that runs well on a Mac: it handles everyday client work, and needs a frontier model or a human
            behind it for contracts and polished visuals.
          </p>
        </div>

        <Section title="Key takeaways">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TAKEAWAYS.map((t) => (
              <div key={t.h} className="glass glass-hover rounded-2xl p-5 space-y-2">
                <p className="font-mono text-xs uppercase tracking-wider text-cyan-400">{t.k}</p>
                <h3 className="text-lg font-heading font-bold text-white">{t.h}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t.p}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Pick your job"
          sub="Tap the kind of work you want AI to do and see which model we would use: best quality, best value, and what runs on your own computer."
        >
          <JobPicker />
        </Section>

        <Section
          title="Every model, every round"
          sub="Overall score per round. Each round used different tests and judges, so compare across a row with care. Round 1 is everyday work, round 2 the same jobs made harder, round 3 legal work, round 4 office files and admin with tools."
        >
          <ViewSwitch label="Every model, every round" views={{ Table: tri(HeatmapTable), Bars: tri(HeatmapBars), Dots: tri(HeatmapDots), Lines: tri(HeatmapLines), Spider: tri(HeatmapSpider) }} />
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            Added Nov 13: Qwen 4 Max Preview, still a preview model, run on a Qwen Cloud plan. It came within 0.01 of the top
            score on the harder round, but lost points on round 1 client emails for adding details that weren't in the notes.
            In round 4, 3 of its 6 slide-deck scripts crashed on small bugs.
          </p>
        </Section>

        <Section
          title="How close is open to frontier?"
          sub="Best frontier score, best open-weight score and the best Mac-friendly model in each round. On text work the gap closed by the legal round. Office files and agents opened it again."
        >
          <ViewSwitch label="Open vs frontier" views={{ Table: <GapTable />, Bars: <GapBars />, Dots: <GapDots /> }} />
        </Section>

        {/* Mid-page CTA */}
        <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-purple-500/20">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl font-heading font-bold text-white">Not sure which model fits your business?</h3>
            <p className="text-gray-400">That’s what we do. Caterpillar picks, sets up and trains your team on the right AI for each job, so you’re not guessing.</p>
          </div>
          <LearnMoreButton className="shrink-0 text-center" />
        </div>

        <Section title="Which model for which job">
          <Table head={['Job', 'Best', 'Value (API)', 'Runs locally', 'Call', 'Why']} alignRightFrom={99} sortable={false}>
            {JOBS.map((g) => (
              <Fragment key={g.group}>
                <tr>
                  <td colSpan={6} className="px-4 pt-6 pb-2 font-mono text-xs uppercase tracking-wider text-cyan-400">{g.group}</td>
                </tr>
                {g.rows.map((r) => (
                  <tr key={r.job} className="border-t border-white/5 align-top">
                    <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{r.job}</td>
                    <td className="px-4 py-3 text-gray-300">{r.best}</td>
                    <td className="px-4 py-3 text-gray-300">{r.value}</td>
                    <td className="px-4 py-3 text-gray-300">{r.local}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block font-mono text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${CALL_STYLE[r.call]}`}>{r.callText ?? CALL_LABEL[r.call]}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 min-w-[220px]">{r.why}</td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </Table>
        </Section>

        <Section
          title="A privacy layer for law firms"
          sub="24 made-up legal documents with 944 hand-marked sensitive details, masked locally before anything reaches an AI model. Run on a CPU limited to four threads, a stand-in for an ordinary office PC."
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PRIVACY_STATS.map((s) => (
              <div key={s.l} className="glass rounded-2xl p-5">
                <p className="text-3xl font-heading font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">{s.v}</p>
                <p className="text-sm text-gray-400 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            A faster setup (rules plus a small detector) caught 97.9% in under a second a page. Masking dates dropped answer
            quality to 3.36, because deadline questions need them, so dates stay unmasked or get shifted.
          </p>
        </Section>

        <Section
          title="Image generators"
          sub="Eight generators drew the same five briefs. The test stopped early at 35 of 48 images, so the ranking uses the three briefs every generator finished. Score = average of text accuracy, following the brief and visual quality, from two judges per image (never one from the generator’s own company)."
        >
          <ViewSwitch label="Image generators" views={{ Table: tri(ImageTable), Bars: tri(ImageBars), Dots: tri(ImageDots), Value: tri(ImageValue) }} />
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            Every generator spelled the short headline correctly. FLUX 3 was the most consistent. The open-weight FLUX 3 Klein
            scored 4.37 at about a cent an image. Nano Banana made the best infographic but put people in the “no people” photo.
            Recraft cost the most ($0.21) and did not score better.
          </p>
        </Section>

        <Section
          title="AI models as prompt writers"
          sub="Each language model got the same casual, one-line brief and wrote the prompt. Every prompt went to the same generator: FLUX 3 for 6 images, Kling v3.0 for two 5-second clips. The control sends the brief unchanged. Judges saw only the brief and the result, never the prompt or who wrote it."
        >
          <ViewSwitch label="Prompt writers" views={{ Table: tri(WriterTable), Bars: tri(WriterBars), Dots: tri(WriterDots), Value: tri(WriterValue) }} />
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            Added Nov 13: Qwen 4 Max Preview came 2nd, and both of its video clips were rated ready to post. It runs on a Qwen
            Cloud plan with no per-prompt cost, so it is left out of the cost charts.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ['Does a writer help?', 'Yes, mostly on the re-roll rate. The best writers beat the raw brief by 0.3–0.4 points, and raised the share of postable results from 67% of images and 50% of clips to 75–100%.'],
              ['Why prompts fail', 'Extra detail turns into garbled text. Weak prompts asked for chat screens or documents in the background, and the generator filled them with fake writing. Good prompts keep the scene simple and quote the exact words.'],
            ].map(([h, p]) => (
              <div key={h} className="glass rounded-2xl p-5 space-y-2">
                <h3 className="text-lg font-heading font-bold text-white">{h}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Coding"
          sub="Hard agentic: 5 multi-file jobs done with tools in a sandboxed repo. Agentic coding: the 6 hardest coding tasks, with tools. One-shot: 12 tasks answered in one reply. Polyglot: 8 exercises from the Aider Polyglot benchmark, original and reworded so a memorized answer would fail. Every result is scored by hidden tests."
        >
          <ViewSwitch label="Coding" views={{ Table: tri(CodingTable), Bars: tri(CodingBars), Dots: tri(CodingDots), Value: tri(CodingValue), Spider: tri(CodingSpider) }} />
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            Letting a model run the tests matters more than the model. In one reply Qwen3.8 27B scored 4.55; with tools on the
            same tasks it reached 4.95, because it ran the tests and fixed its own mistakes. On the reworded Polyglot exercises
            every model scored the same or better, so there was no sign of memorized answers.
          </p>
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            Added Nov 13: Qwen 4 Max Preview, still a preview model, took every coding test. It runs on a Qwen Cloud plan with no
            per-run cost, so it is left out of the cost charts. On a larger 20-exercise Polyglot set it passed 90% original and
            95% reworded.
          </p>

          <h3 className="text-2xl font-heading font-bold text-white pt-4">SWE-bench Verified: real GitHub issues</h3>
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            Five real issues from sphinx, sympy, pytest, django and scikit-learn, worked in each project’s own environment with a
            bash-only agent capped at 75 steps, with the internet blocked, and graded by the official SWE-bench tests.
          </p>
          <ViewSwitch label="SWE-bench" views={{ Table: tri(SweTable), Bars: tri(SweBars), Dots: tri(SweDots), Value: tri(SweValue) }} />
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            One run per model on 5 issues, so treat a one-issue difference as noise. The Docker containers had internet by
            default, and some open models downloaded the real fix from GitHub. With the internet blocked, DeepSeek V4.1 Flash
            fell from 5 to 3 and Qwen Flash from 4 to 2. These are the internet-blocked results. Opus 5.5 needed the fewest steps. These issues are public, and models may have seen the fixes during training.
          </p>
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            Added Nov 13: Qwen 4 Max Preview ran these issues through Qwen Code (75 steps, internet blocked), not the bash-only
            agent the others used, so compare it with care. Average steps cover 4 of the 5 runs. On 5 newer issues it
            fixed 3.
          </p>
        </Section>

        <Section
          title="Bookkeeping: bank statements"
          sub="A made-up year for a solo marketing consultant filing a US Schedule C: 12 monthly statements for a checking account and a credit card, 523 transactions in all. Each model read one month at a time, with the previous month for comparison, and had to categorize every line, pick out the business write-offs, send unclear items to review, flag anything odd and total the month. The traps: card payments and savings transfers, Venmo to a friend, refunds, duplicate charges, a $1 test charge followed by $489 of fraud, subscription price rises, business and family trips, half-deductible meals and phone, and gray items like home internet, health premiums and Amazon orders. Scored automatically against a planted answer key."
        >
          <Table head={['Model', 'Score', 'Categories right', 'Write-offs found / correct', 'Gray items to review', 'Problems caught', '$ for 12 months']}>
            {sel(BANK, 'all').map(([m, open, ...c]) => (
              <tr key={m} className="border-t border-white/5">
                <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                  {m}
                  {open && <span className="ml-2 font-mono text-xs text-cyan-300">open</span>}
                </td>
                {c.map((v, i) => (
                  <td key={i} className={`px-4 py-3 text-right whitespace-nowrap ${i === 0 ? 'font-semibold text-white' : 'text-gray-300'}`}>{v}</td>
                ))}
              </tr>
            ))}
          </Table>
          <div className="grid sm:grid-cols-2 gap-4">
            {BANK_NOTES.map((t) => (
              <div key={t.h} className="glass rounded-2xl p-5 space-y-2">
                <p className="font-mono text-xs uppercase tracking-wider text-cyan-400">{t.k}</p>
                <h3 className="text-lg font-heading font-bold text-white">{t.h}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t.p}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 max-w-3xl leading-relaxed">
            One run per model. Statements were clean text tables, not PDFs; a real setup needs a PDF-to-text step first. Busier
            accounts should still have totals computed by code. A pilot run of Qwen3.8 27B scored 4.06 before two prompt fixes:
            price-rise flags apply only to fixed subscriptions, and a short note says which trips were business.
          </p>
        </Section>

        <Section title="How it was scored">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['Checks first, judges second', 'Automatic checks wherever possible (formulas, dates, quotes, the end state of a mock inbox), and two or three AI judges otherwise. No judge graded its own company’s model in the later rounds.'],
              ['Checked by hand', 'Where an automatic checker wrongly failed a correct answer, it was fixed and rescored before reporting.'],
              ['Noise', '5 to 12 cases per test. Treat gaps under about 0.2 as a tie.'],
              ['Safety', 'Synthetic data only. Model-written code ran in a sandbox with no network and no access to real files.'],
            ].map(([h, p]) => (
              <div key={h} className="glass rounded-2xl p-5 space-y-2">
                <h3 className="font-heading font-bold text-white">{h}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Lead form */}
        <section id="contact" className="max-w-3xl mx-auto w-full space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">Questions about these results?</h2>
            <p className="text-gray-400">Send a note and we&apos;ll help you pick the right model for your work.</p>
          </div>
          <LeadForm compact idPrefix="scores" />
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center bg-gradient-to-br from-purple-900/60 via-blue-900/40 to-cyan-900/50 border border-white/10">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl opacity-20" />
          <div className="relative space-y-6">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight">Want this working in your business?</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Caterpillar builds AI systems that take estimates, intake, email and reporting off your plate, using the right model
              for each job, and trains your team so it sticks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <LearnMoreButton className="text-lg px-8 py-4" />
              <a
                href={CAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-full font-semibold text-lg hover:bg-cyan-400/10 transition-all duration-300"
              >
                Book a free call
              </a>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-500 font-mono">© Caterpillar AI Consulting · Model lab run Nov 9, 2026</footer>
      </div>
    </main>
  );
}
