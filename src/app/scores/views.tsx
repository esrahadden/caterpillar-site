// Bars and Dots views for each data section of the scores page.
import { BarChart, DotRows, ScatterChart, CYAN, GREEN, PURPLE, GRAY } from './charts';
import { CODING, GAP, HEATMAP, IMAGE_GEN, KIND_LABEL, PROMPT_WRITERS, ROUNDS, SWE, SWE_SCATTER, type Kind } from './data';

const KIND_HEX: Record<Kind, string> = { frontier: PURPLE, open: CYAN, local: GREEN, api: GRAY };
const KIND_LEGEND = (['frontier', 'open', 'local'] as Kind[]).map((k) => ({ color: KIND_HEX[k], label: KIND_LABEL[k] }));
const FO_LEGEND = [
  { color: PURPLE, label: 'Frontier' },
  { color: CYAN, label: 'Open weights' },
];
const money = (s: string) => Number(s.replace('$', ''));
const OPEN_IMAGE = new Set(['FLUX 3 Klein (open)', 'Qwen Image 3 Pro']);
const OPEN_WRITERS = new Set(['Kimi K3.1 Pro', 'GLM-5.3', 'DeepSeek V4.1 Flash', 'Qwen3.8 Flash', 'Qwen3.8 27B']);

// ---- Every model, every round ----
function avg(s: (number | null)[]) {
  const v = s.filter((x): x is number => x != null);
  return v.reduce((a, b) => a + b, 0) / v.length;
}
export function HeatmapBars() {
  const rows = [...HEATMAP]
    .map(([n, k, s]) => ({ n, k, a: avg(s), runs: s.filter((x) => x != null).length }))
    .sort((a, b) => b.a - a.a)
    .map((r) => ({ label: r.n, value: r.a, color: KIND_HEX[r.k], text: `${r.a.toFixed(2)} (${r.runs} round${r.runs > 1 ? 's' : ''})` }));
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Average across the rounds each model ran. Models that only ran the easier rounds can look better than they are.</p>
      <BarChart rows={rows} min={2} max={5} legend={KIND_LEGEND} />
    </div>
  );
}
const ROUND_COLORS = ['#f472b6', '#facc15', PURPLE, CYAN];
export function HeatmapDots() {
  const rows = HEATMAP.map(([n, k, s]) => ({
    label: n,
    sub: KIND_LABEL[k],
    subColor: KIND_HEX[k],
    points: s.flatMap((v, j) => (v == null ? [] : [{ v, color: ROUND_COLORS[j], name: ROUNDS[j].name }])),
  }));
  return <DotRows rows={rows} min={3.5} max={5} labelW={210} legend={ROUNDS.map((r, j) => ({ color: ROUND_COLORS[j], label: `${r.id} ${r.name}` }))} />;
}

// ---- Open vs frontier ----
export function GapTable() {
  return (
    <div className="overflow-x-auto glass rounded-2xl">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="border-b border-white/10 font-mono text-xs uppercase tracking-wider text-gray-400">
            <th className="px-4 py-3 text-left font-normal">Round</th>
            <th className="px-4 py-3 text-left font-normal">Best frontier</th>
            <th className="px-4 py-3 text-left font-normal">Best open weights</th>
            <th className="px-4 py-3 text-left font-normal">Runs on a Mac</th>
          </tr>
        </thead>
        <tbody>
          {GAP.map((g) => (
            <tr key={g.round} className="border-t border-white/5">
              <td className="px-4 py-3 font-semibold text-white">{g.round}</td>
              {(['frontier', 'open', 'local'] as const).map((k) => (
                <td key={k} className="px-4 py-3 text-gray-300">
                  {g[k][0]} <span className="font-mono text-cyan-300 ml-1">{g[k][1].toFixed(2)}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function GapBars() {
  const rows = GAP.flatMap((g) => [
    { group: g.round, label: `Frontier: ${g.frontier[0]}`, value: g.frontier[1], color: PURPLE },
    { group: g.round, label: `Open: ${g.open[0]}`, value: g.open[1], color: CYAN },
    { group: g.round, label: `Mac: ${g.local[0]}`, value: g.local[1], color: GREEN },
  ]);
  return <BarChart rows={rows} min={4} max={5} legend={[...FO_LEGEND, { color: GREEN, label: 'Runs on a Mac' }]} />;
}
export function GapDots() {
  const rows = GAP.map((g) => ({
    label: g.round,
    points: [
      { v: g.local[1], color: GREEN, name: `Mac: ${g.local[0]}` },
      { v: g.open[1], color: CYAN, name: `Open: ${g.open[0]}` },
      { v: g.frontier[1], color: PURPLE, name: `Frontier: ${g.frontier[0]}` },
    ],
  }));
  return <DotRows rows={rows} min={4.3} max={5} legend={[{ color: PURPLE, label: 'Best frontier' }, { color: CYAN, label: 'Best open weights' }, { color: GREEN, label: 'Qwen3.8 27B (runs on a Mac)' }]} />;
}

// ---- Image generators ----
export function ImageBars() {
  const rows = IMAGE_GEN.map(([n, s]) => ({ label: n, value: s, color: OPEN_IMAGE.has(n) ? CYAN : PURPLE }));
  return <BarChart rows={rows} min={3.5} max={5} legend={[{ color: PURPLE, label: 'Closed' }, { color: CYAN, label: 'Open weights' }]} />;
}
export function ImageDots() {
  const pts = IMAGE_GEN.map((r) => ({ label: `${r[0]} · ${r[8]}`, x: money(r[8] as string), y: r[1], color: OPEN_IMAGE.has(r[0]) ? CYAN : PURPLE }));
  return <ScatterChart points={pts} xLabel="Cost per image (log scale)" yLabel="Score" yMin={3.9} yMax={4.7} xTicks={[0.01, 0.03, 0.1, 0.2]} legend={[{ color: PURPLE, label: 'Closed' }, { color: CYAN, label: 'Open weights' }]} yFormat={(v) => v.toFixed(2)} />;
}

// ---- Prompt writers ----
export function WriterBars() {
  const rows = PROMPT_WRITERS.map(([n, s]) => ({ label: n, value: s, color: n.startsWith('No writer') ? GRAY : OPEN_WRITERS.has(n) ? CYAN : PURPLE }));
  return <BarChart rows={rows} min={3.5} max={4.5} legend={[...FO_LEGEND, { color: GRAY, label: 'No writer (raw brief)' }]} />;
}
export function WriterDots() {
  const pts = PROMPT_WRITERS.filter((r) => !r[0].startsWith('No writer')).map((r) => ({
    label: `${r[0]} · ${r[6]}`, x: money(r[6]), y: r[1], color: OPEN_WRITERS.has(r[0]) ? CYAN : PURPLE,
  }));
  return <ScatterChart points={pts} xLabel="Cost per prompt (log scale)" yLabel="Score" yMin={3.6} yMax={4.5} xTicks={[0.0002, 0.001, 0.005, 0.02]} legend={FO_LEGEND} note="Top left = better for less money. The raw brief (no writer) scored 3.99." yFormat={(v) => v.toFixed(2)} />;
}

// ---- Coding ----
export function CodingBars() {
  const rows = CODING.map(([n, open, s]) => ({ label: n, value: s, color: open ? CYAN : PURPLE }));
  return <BarChart rows={rows} min={4} max={5} legend={FO_LEGEND} />;
}
export function CodingDots() {
  const pts = CODING.map(([n, open, s, , , , , cost]) => ({ label: `${n} · ${cost}`, x: money(cost), y: s, color: open ? CYAN : PURPLE }));
  return <ScatterChart points={pts} xLabel="Cost for the whole coding round (log scale)" yLabel="Overall score" yMin={4.4} yMax={5.05} xTicks={[0.2, 0.5, 1, 2, 5, 10]} legend={FO_LEGEND} yFormat={(v) => v.toFixed(2)} />;
}

// ---- SWE-bench ----
export function SweBars() {
  const rows = SWE.map(([n, open, fixed, , , cost]) => ({ label: n, value: Number(fixed[0]), color: open ? CYAN : PURPLE, text: `${fixed} · ${cost}` }));
  return <BarChart rows={rows} min={0} max={5} legend={FO_LEGEND} />;
}
export function SweDots() {
  const pts = SWE_SCATTER.map((d) => ({ label: `${d.n} · $${d.cost.toFixed(2)}`, x: d.cost, y: d.fixed, color: d.frontier ? PURPLE : CYAN }));
  return <ScatterChart points={pts} xLabel="Cost to attempt all 5 issues (log scale)" yLabel="Issues fixed" yMin={0} yMax={5} xTicks={[0.05, 0.1, 0.5, 1, 5]} legend={FO_LEGEND} note="Top left = more fixed for less money" yFormat={(v) => v.toFixed(0)} />;
}
