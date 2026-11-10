'use client';

import { useState } from 'react';
import { CALL_LABEL, JOBS, type Call } from './data';

const CALL_STYLE: Record<Call, string> = {
  go: 'border-emerald-400/60 text-emerald-300',
  stay: 'border-purple-400/60 text-purple-300',
  any: 'border-gray-500 text-gray-300',
  cheap: 'border-cyan-400/60 text-cyan-300',
};

export default function JobPicker() {
  const all = JOBS.flatMap((g) => g.rows);
  const [pick, setPick] = useState(all[0].job);
  const job = all.find((j) => j.job === pick)!;
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {JOBS.map((g) => (
          <div key={g.group} className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 w-full sm:w-44 shrink-0">{g.group}</span>
            {g.rows.map((r) => {
              const active = r.job === pick;
              return (
                <button
                  key={r.job}
                  onClick={() => setPick(r.job)}
                  aria-pressed={active}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white border-transparent shadow-md shadow-cyan-500/30'
                      : 'border-white/15 text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {r.job}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6 md:p-8 border border-purple-500/20 space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-heading font-bold text-white">{job.job}</h3>
          <span className={`font-mono text-xs px-2.5 py-1 rounded-full border ${CALL_STYLE[job.call]}`}>{job.callText ?? CALL_LABEL[job.call]}</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            ['Best quality', job.best],
            ['Best value (API)', job.value],
            ['Runs locally', job.local],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-white/[0.04] border border-white/5 p-4">
              <p className="font-mono text-xs uppercase tracking-wider text-gray-400">{k}</p>
              <p className="text-lg font-semibold text-white mt-1">{v}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-300">{job.why}</p>
      </div>
    </div>
  );
}
