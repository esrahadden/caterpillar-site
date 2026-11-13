'use client';

import { isValidElement, useState, type ReactNode } from 'react';
import { PickNote } from './picks';

const ICONS: Record<string, string> = { Table: '▦', Bars: '▤', Dots: '⁘', Lines: '⟋', Value: '$', Spider: '✳' };
const FILTERS = [
  { id: 'all', label: 'All models' },
  { id: 'frontier', label: 'Frontier only' },
  { id: 'open', label: 'Open weights only' },
] as const;
type FilterId = (typeof FILTERS)[number]['id'];
type Tri = Record<FilterId, ReactNode>;
type View = ReactNode | Tri;

const isTri = (v: View): v is Tri => !!v && typeof v === 'object' && !isValidElement(v) && 'all' in (v as object);

function Pills<T extends string>({ label, items, value, onChange, big }: { label: string; items: readonly { id: T; label: string; icon?: string }[]; value: T; onChange: (v: T) => void; big?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 w-16">{label}</span>
      <div role="tablist" className="inline-flex flex-wrap p-1 rounded-3xl bg-white/5 border border-white/15 shadow-lg shadow-purple-900/20">
        {items.map((it) => {
          const active = it.id === value;
          return (
            <button
              key={it.id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(it.id)}
              className={`${big ? 'px-4 md:px-5 py-2.5 text-sm md:text-base' : 'px-4 py-2 text-sm'} rounded-full font-semibold transition-all duration-200 cursor-pointer ${
                active
                  ? big
                    ? 'bg-gradient-to-r from-purple-700 to-cyan-700 text-white shadow-md shadow-cyan-500/30'
                    : 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {it.icon && <span aria-hidden className="mr-1.5">{it.icon}</span>}
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Big, obvious view switch plus a frontier / open-weights filter.
export default function ViewSwitch({ label, views }: { label: string; views: Record<string, View> }) {
  const names = Object.keys(views);
  const [view, setView] = useState(names[0]);
  const [filter, setFilter] = useState<FilterId>('all');
  const current = views[view];
  const hasFilter = names.some((n) => isTri(views[n]));
  return (
    <div className="space-y-4" aria-label={label}>
      <div className="space-y-3">
        <Pills label="View as" big items={names.map((n) => ({ id: n, label: n, icon: ICONS[n] ?? '•' }))} value={view} onChange={setView} />
        {hasFilter && <Pills label="Show" items={FILTERS} value={filter} onChange={setFilter} />}
        <PickNote />
      </div>
      <div role="tabpanel">{isTri(current) ? current[filter] : current}</div>
    </div>
  );
}
