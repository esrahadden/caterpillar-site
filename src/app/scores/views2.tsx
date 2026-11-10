// Lines, Spider and Value (bang for buck) views for the scores page.
import { BarChart, LineChart, SpiderGrid, CYAN, GREEN, PURPLE, GRAY } from './charts';
import { CODING, HEATMAP, IMAGE_GEN, KIND_LABEL, PROMPT_WRITERS, ROUNDS, SWE_SCATTER, type Kind, sel, type Filter } from './data';

const KIND_HEX: Record<Kind, string> = { frontier: PURPLE, open: CYAN, local: GREEN, api: GRAY };
const KIND_LEGEND = (['frontier', 'open', 'local'] as Kind[]).map((k) => ({ color: KIND_HEX[k], label: KIND_LABEL[k] }));
const FO_LEGEND = [
  { color: PURPLE, label: 'Frontier' },
  { color: CYAN, label: 'Open weights' },
];
const money = (s: string) => Number(s.replace('$', ''));
const OPEN_IMAGE = new Set(['FLUX 3 Klein (open)', 'Qwen Image 3 Pro']);
const OPEN_WRITERS = new Set(['Kimi K3.1 Pro', 'GLM-5.3', 'DeepSeek V4.1 Flash', 'Qwen3.8 Flash', 'Qwen3.8 27B']);

export function HeatmapLines({ f = 'all' }: { f?: Filter }) {
  const lines = sel(HEATMAP, f).filter(([, , s]) => s.filter((v) => v != null).length >= 2).map(([n, k, s]) => ({ label: n, color: KIND_HEX[k], values: s }));
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Models that ran at least two rounds. Does a model hold up as the work gets harder, more legal, more hands-on?</p>
      <LineChart lines={lines} xLabels={ROUNDS.map((r) => `${r.id} ${r.name}`)} min={3.5} max={5} legend={KIND_LEGEND} />
    </div>
  );
}

export function HeatmapSpider({ f = 'all' }: { f?: Filter }) {
  const items = sel(HEATMAP, f).filter(([, , s]) => s.every((v) => v != null)).map(([n, k, s]) => ({ label: n, sub: KIND_LABEL[k], color: KIND_HEX[k], values: s as number[] }));
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Only the models that ran all four rounds.</p>
      <SpiderGrid items={items} axes={ROUNDS.map((r) => r.name)} min={4} max={5} />
    </div>
  );
}

export function CodingSpider({ f = 'all' }: { f?: Filter }) {
  const items = sel(CODING, f).map(([n, open, , hard, ag, one, poly]) => ({
    label: n,
    sub: open ? 'Open weights' : 'Frontier',
    color: open ? CYAN : PURPLE,
    values: [Number(hard), Number(ag), Number(one), Number(poly.split('/')[1].replace('%', '').trim()) / 20],
  }));
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Polyglot is the reworded-exercise pass rate, scaled to 0–5.</p>
      <SpiderGrid items={items} axes={['Hard agentic', 'Agentic', 'One-shot', 'Polyglot']} min={3.5} max={5} />
    </div>
  );
}

type V = { label: string; score: number; cost: number; color: string; scoreText: string; costText: string };
function valueRows(items: V[]) {
  const per = items.map((i) => ({ ...i, v: i.score / i.cost }));
  const best = Math.max(...per.map((p) => p.v));
  return per
    .map((p) => ({ label: p.label, value: (p.v / best) * 100, color: p.color, text: `${((p.v / best) * 100).toFixed(0)} · ${p.scoreText} for ${p.costText}` }))
    .sort((a, b) => b.value - a.value);
}

function ValueChart({ items, legend }: { items: V[]; legend: { color: string; label: string }[] }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Bang for buck: score per dollar, with the best value set to 100. High value doesn&rsquo;t mean high quality, so check the score next to it.</p>
      <BarChart rows={valueRows(items)} min={0} max={100} legend={legend} />
    </div>
  );
}

export function ImageValue({ f = 'all' }: { f?: Filter }) {
  const items = sel(IMAGE_GEN, f).map((r) => ({ label: r[0], score: r[1], cost: money(r[8] as string), color: OPEN_IMAGE.has(r[0]) ? CYAN : PURPLE, scoreText: r[1].toFixed(2), costText: `${r[8]}/image` }));
  return <ValueChart items={items} legend={[{ color: PURPLE, label: 'Closed' }, { color: CYAN, label: 'Open weights' }]} />;
}

export function WriterValue({ f = 'all' }: { f?: Filter }) {
  const items = sel(PROMPT_WRITERS, f).filter((r) => !r[0].startsWith('No writer')).map((r) => ({ label: r[0], score: r[1], cost: money(r[6]), color: OPEN_WRITERS.has(r[0]) ? CYAN : PURPLE, scoreText: r[1].toFixed(2), costText: `${r[6]}/prompt` }));
  return <ValueChart items={items} legend={FO_LEGEND} />;
}

export function CodingValue({ f = 'all' }: { f?: Filter }) {
  const items = sel(CODING, f).map(([n, open, s, , , , , cost]) => ({ label: n, score: s, cost: money(cost), color: open ? CYAN : PURPLE, scoreText: s.toFixed(2), costText: cost }));
  return <ValueChart items={items} legend={FO_LEGEND} />;
}

export function SweValue({ f = 'all' }: { f?: Filter }) {
  const items = sel(SWE_SCATTER, f).map((d) => ({ label: d.n, score: d.fixed, cost: d.cost, color: d.frontier ? PURPLE : CYAN, scoreText: `${d.fixed}/5 fixed`, costText: `$${d.cost.toFixed(2)}` }));
  return <ValueChart items={items} legend={FO_LEGEND} />;
}
