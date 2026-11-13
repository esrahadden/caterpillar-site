'use client';

// Page-wide model picker (toggle / solo) and column sorting for the scores page.
import { Children, cloneElement, createContext, isValidElement, useContext, useState, type ReactElement, type ReactNode } from 'react';
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

export function Switch({ on, onChange, label, children }: { on: boolean; onChange: () => void; label: string; children?: ReactNode }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={children ? undefined : label}
      onClick={onChange}
      className={`inline-flex items-center gap-2 min-h-[32px] pl-1.5 pr-3 rounded-full text-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 ${on ? 'text-white' : 'text-gray-400'}`}
    >
      <span aria-hidden className={`relative inline-block w-8 h-[18px] rounded-full transition-colors ${on ? 'bg-cyan-500' : 'bg-white/15'}`}>
        <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${on ? 'left-[16px]' : 'left-[2px]'}`} />
      </span>
      {children ?? label}
    </button>
  );
}

export function AllOnOff({ onAll, offAll }: { onAll: () => void; offAll: () => void }) {
  const cls = 'px-3 py-1.5 min-h-[32px] rounded-full border border-white/15 text-sm text-gray-200 cursor-pointer hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400';
  return (
    <span className="inline-flex gap-2">
      <button type="button" onClick={onAll} className={cls}>All on</button>
      <button type="button" onClick={offAll} className={cls}>All off</button>
    </span>
  );
}

function Chip({ k, label, on, toggle, solo }: { k: string; label: string; on: boolean; toggle: (k: string) => void; solo: (k: string) => void }) {
  return (
    <span onDoubleClick={() => solo(k)} className={`inline-flex items-center rounded-full border ${on ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-white/15'}`}>
      <Switch on={on} onChange={() => toggle(k)} label={label} />
      <button
        type="button"
        onClick={() => solo(k)}
        aria-label={`Show only ${label}`}
        className="self-stretch px-2.5 rounded-r-full border-l border-white/10 font-mono text-[10px] uppercase tracking-wider text-gray-400 cursor-pointer hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
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
            Switch a model on or off. Tap <span className="font-mono text-xs uppercase">only</span>, or double-tap it, to see just that one. Your picks apply to the whole page. Each table also has its own metric switches.
          </p>
          <AllOnOff onAll={() => set(null)} offAll={() => set(new Set())} />
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
      {picked && picked.size === 0 ? 'All models are switched off.' : 'None of your picked models ran this test.'}{' '}
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

// ---- Metric (column) switches, per table. Column 0 (the model) always shows. ----
export function useColumns(head: ReactNode[]) {
  const [off, setOff] = useState<Set<number>>(new Set());
  const show = (i: number) => i === 0 || !off.has(i);
  const toggle = (i: number) =>
    setOff((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  const filterRow = (r: ReactElement<{ children?: ReactNode }>) => {
    if (off.size === 0) return r;
    const cells = Children.toArray(r.props.children).filter((_, i) => show(i));
    return cloneElement(r, undefined, ...cells);
  };
  const bar = head.length > 2 && (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
      <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 mr-2">Metrics</span>
      {head.slice(1).map((h, j) => (
        <Switch key={j} on={show(j + 1)} onChange={() => toggle(j + 1)} label={textOf(h)} />
      ))}
      <AllOnOff onAll={() => setOff(new Set())} offAll={() => setOff(new Set(head.map((_, i) => i).slice(1)))} />
    </div>
  );
  return { show, filterRow, bar };
}
