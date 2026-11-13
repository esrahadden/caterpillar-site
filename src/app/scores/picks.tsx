'use client';

// Page-wide model picker (toggle / solo) and column sorting for the scores page.
import { Children, createContext, isValidElement, useContext, useState, type ReactElement, type ReactNode } from 'react';
import { BANK, CODING, HEATMAP, IMAGE_GEN, PROMPT_WRITERS, SWE, sel, type Filter } from './data';

const ALIAS: Record<string, string> = {
  'deepseek flash': 'deepseek v4.1 flash',
  gemini: 'gemini 4 argon',
  kimi: 'kimi k3.1 pro',
};

// One key per model, so "Claude Opus 5.5", "Opus 5.5" and "Opus 5.5 (via X)" match.
export function modelKey(name: string) {
  const k = name.toLowerCase().replace(/^claude /, '').replace(/\s*\(via [^)]*\)$/, '').trim();
  return ALIAS[k] ?? k;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nameOf = (r: any): string => (Array.isArray(r) ? r[0] : r.n);

function collect(rows: { [k: number]: unknown }[]) {
  const out = new Map<string, string>();
  for (const r of rows) {
    const n = nameOf(r);
    if (n.startsWith('No writer')) continue;
    const k = modelKey(n);
    if (!out.has(k)) out.set(k, n.replace(/\s*\(via [^)]*\)$/, ''));
  }
  return out;
}
const TEXT = collect([...HEATMAP, ...CODING, ...SWE, ...BANK, ...PROMPT_WRITERS]);
const IMAGES = collect(IMAGE_GEN);
for (const k of TEXT.keys()) IMAGES.delete(k);

type Picks = { picked: Set<string> | null; set: (p: Set<string> | null) => void };
const Ctx = createContext<Picks>({ picked: null, set: () => {} });

export function PicksProvider({ children }: { children: ReactNode }) {
  const [picked, set] = useState<Set<string> | null>(null);
  return <Ctx.Provider value={{ picked, set }}>{children}</Ctx.Provider>;
}

export const usePicks = () => useContext(Ctx);

// sel() plus the page-wide model picks. Control rows (the raw-brief baseline) always stay.
export function useSel<T>(arr: T[], f: Filter): T[] {
  const { picked } = useContext(Ctx);
  const rows = sel(arr, f);
  if (!picked) return rows;
  return rows.filter((r) => nameOf(r).startsWith('No writer') || picked.has(modelKey(nameOf(r))));
}

function Chip({ k, label, on, toggle, solo }: { k: string; label: string; on: boolean; toggle: (k: string) => void; solo: (k: string) => void }) {
  return (
    <span className={`inline-flex items-stretch rounded-full border text-sm ${on ? 'border-cyan-400/60 bg-cyan-400/10 text-white' : 'border-white/15 text-gray-400'}`}>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => toggle(k)}
        onDoubleClick={() => solo(k)}
        className="pl-3.5 pr-2 py-2 rounded-l-full cursor-pointer hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
      >
        <span aria-hidden className={`inline-block w-2 h-2 rounded-full mr-2 ${on ? 'bg-cyan-400' : 'bg-white/20'}`} />
        {label}
      </button>
      <button
        type="button"
        onClick={() => solo(k)}
        aria-label={`Show only ${label}`}
        className="px-2.5 py-2 rounded-r-full border-l border-white/10 font-mono text-[10px] uppercase tracking-wider text-gray-400 cursor-pointer hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
      >
        only
      </button>
    </span>
  );
}

export function ModelPicker() {
  const { picked, set } = usePicks();
  const [open, setOpen] = useState(false);
  const all = [...TEXT.keys(), ...IMAGES.keys()];
  const isOn = (k: string) => !picked || picked.has(k);
  const toggle = (k: string) => {
    const next = new Set(picked ?? all);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    set(next.size === all.length ? null : next);
  };
  const solo = (k: string) => set(new Set([k]));
  const count = picked ? picked.size : all.length;
  const group = (title: string, m: Map<string, string>) => (
    <div className="space-y-2">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-400">{title}</p>
      <div className="flex flex-wrap gap-2">
        {[...m].map(([k, label]) => (
          <Chip key={k} k={k} label={label} on={isOn(k)} toggle={toggle} solo={solo} />
        ))}
      </div>
    </div>
  );
  return (
    <div className="glass rounded-2xl p-4 md:p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="model-picker"
          onClick={() => setOpen(!open)}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-700 to-cyan-700 text-white text-sm font-semibold cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
        >
          {open ? 'Hide model picker' : 'Pick models to compare'}
        </button>
        <span className="text-sm text-gray-300" aria-live="polite">
          Showing {picked ? `${count} of ${all.length}` : `all ${all.length}`} models in every table and chart
        </span>
        {picked && (
          <button type="button" onClick={() => set(null)} className="text-sm text-cyan-300 underline underline-offset-4 cursor-pointer">
            Show all
          </button>
        )}
      </div>
      {open && (
        <div id="model-picker" className="space-y-4">
          <p className="text-sm text-gray-400">
            Tap a model to hide or show it. Double-tap it, or tap <span className="font-mono text-xs uppercase">only</span>, to see just that one. Your picks apply to the whole page.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => set(null)} className="px-3 py-1.5 rounded-full border border-white/15 text-sm text-gray-200 cursor-pointer hover:bg-white/10">Select all</button>
            <button type="button" onClick={() => set(new Set())} className="px-3 py-1.5 rounded-full border border-white/15 text-sm text-gray-200 cursor-pointer hover:bg-white/10">Clear all</button>
          </div>
          {group('Text and code models', TEXT)}
          {group('Image generators', IMAGES)}
        </div>
      )}
    </div>
  );
}

// Short note shown above a section when picks hide rows.
export function PickNote() {
  const { picked, set } = usePicks();
  if (!picked) return null;
  return (
    <p className="text-sm text-gray-400">
      Showing only your picked models.{' '}
      <button type="button" onClick={() => set(null)} className="text-cyan-300 underline underline-offset-4 cursor-pointer">Show all</button>
    </p>
  );
}

export function EmptyPicks() {
  const { picked, set } = usePicks();
  return (
    <p className="glass rounded-2xl p-6 text-sm text-gray-400">
      {picked && picked.size === 0 ? 'No models picked.' : 'None of your picked models ran this test.'}{' '}
      <button type="button" onClick={() => set(null)} className="text-cyan-300 underline underline-offset-4 cursor-pointer">Show all models</button>
    </p>
  );
}

// ---- Column sorting ----
function textOf(n: ReactNode): string {
  if (n == null || typeof n === 'boolean') return '';
  if (typeof n === 'string' || typeof n === 'number') return String(n);
  if (Array.isArray(n)) return n.map(textOf).join(' ');
  if (isValidElement(n)) return textOf((n.props as { children?: ReactNode }).children);
  return '';
}
function sortVal(s: string): number | string {
  const m = s.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : s.trim().toLowerCase();
}

export function useSortedRows(children: ReactNode) {
  const [sort, setSort] = useState<{ col: number; dir: 1 | -1 } | null>(null);
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<{ children?: ReactNode }>[];
  let out = rows;
  if (sort) {
    const cellText = (r: ReactElement<{ children?: ReactNode }>) => {
      const cells = Children.toArray(r.props.children).flat();
      return textOf(cells[sort.col] as ReactNode);
    };
    out = [...rows].sort((a, b) => {
      const va = sortVal(cellText(a)), vb = sortVal(cellText(b));
      const na = typeof va === 'number', nb = typeof vb === 'number';
      if (na !== nb) return na ? -1 : 1; // "not run" and dashes go last
      const c = na ? (va as number) - (vb as number) : String(va).localeCompare(String(vb));
      return c * sort.dir;
    });
  }
  const header = (i: number) => {
    const active = sort?.col === i;
    return {
      active,
      dir: active ? sort!.dir : 0,
      onClick: () => setSort(active ? { col: i, dir: sort!.dir === -1 ? 1 : -1 } : { col: i, dir: i === 0 ? 1 : -1 }),
      ariaSort: (active ? (sort!.dir === 1 ? 'ascending' : 'descending') : undefined) as 'ascending' | 'descending' | undefined,
    };
  };
  return { rows: out, header };
}

export function SortButton({ label, h, right }: { label: ReactNode; h: ReturnType<ReturnType<typeof useSortedRows>['header']>; right?: boolean }) {
  return (
    <button
      type="button"
      onClick={h.onClick}
      className={`inline-flex items-center gap-1 min-h-[24px] py-1 uppercase tracking-wider cursor-pointer hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 rounded ${right ? 'flex-row-reverse text-right' : 'text-left'} ${h.active ? 'text-cyan-300' : ''}`}
    >
      <span>{label}</span>
      <span aria-hidden className="text-[10px]">{h.dir === 1 ? '▲' : h.dir === -1 ? '▼' : '↕'}</span>
    </button>
  );
}
