'use client';

import { useState, type ReactNode } from 'react';

const ICONS: Record<string, string> = { Table: '▦', Bars: '▤', Dots: '⁘', Lines: '⟋', Value: '$', Spider: '✳' };

// Big, obvious segmented control. `views` keys are the button labels, in order.
export default function ViewSwitch({ label, views }: { label: string; views: Record<string, ReactNode> }) {
  const names = Object.keys(views);
  const [view, setView] = useState(names[0]);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">View as</span>
        <div role="tablist" aria-label={`${label}: choose a view`} className="inline-flex flex-wrap p-1 rounded-3xl bg-white/5 border border-white/15 shadow-lg shadow-purple-900/20">
          {names.map((n) => {
            const active = n === view;
            return (
              <button
                key={n}
                role="tab"
                aria-selected={active}
                onClick={() => setView(n)}
                className={`px-4 md:px-5 py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-cyan-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span aria-hidden className="mr-1.5">{ICONS[n] ?? '•'}</span>
                {n}
              </button>
            );
          })}
        </div>
      </div>
      <div role="tabpanel">{views[view]}</div>
    </div>
  );
}
