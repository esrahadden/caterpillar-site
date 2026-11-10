// Server-rendered SVG charts for the scores page, styled for the dark Caterpillar theme.

export const PURPLE = '#a78bfa';
export const CYAN = '#22d3ee';
export const GREEN = '#34d399';
export const GRAY = '#9ca3af';
const GRID = 'rgba(255,255,255,0.08)';

function Shell({ legend, children }: { legend?: { color: string; label: string }[]; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5 overflow-x-auto">
      {legend && (
        <div className="flex flex-wrap gap-5 mb-3 font-mono text-xs text-gray-300">
          {legend.map((l) => (
            <span key={l.label}>
              <span className="inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

export function niceTicks(min: number, max: number) {
  const step = [0.1, 0.2, 0.25, 0.5, 1, 2].find((s) => (max - min) / s <= 8) ?? 5;
  const out: number[] = [];
  for (let t = Math.ceil(min / step - 1e-9) * step; t <= max + 1e-9; t += step) out.push(Math.round(t * 100) / 100);
  return out;
}

export type Bar ={ label: string; value: number; color: string; text?: string; group?: string };

// Horizontal bars. Rows with a new `group` get a small header above them.
export function BarChart({ rows, min, max, legend, unit = '' }: { rows: Bar[]; min: number; max: number; legend?: { color: string; label: string }[]; unit?: string }) {
  const W = 900, L = 200, R = 150, rowH = 30, groupH = 26;
  let yCursor = 10;
  const laid = rows.map((r, i) => {
    const newGroup = r.group && r.group !== rows[i - 1]?.group;
    if (newGroup) yCursor += groupH;
    const y = yCursor;
    yCursor += rowH;
    return { ...r, y, newGroup };
  });
  const H = yCursor + 30;
  const x = (v: number) => L + ((Math.max(v, min) - min) / (max - min)) * (W - L - R);
  const ticks = Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4);
  return (
    <Shell legend={legend}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px] h-auto" role="img">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={4} y2={H - 26} stroke={GRID} />
            <text x={x(t)} y={H - 8} fontSize="12" fill={GRAY} textAnchor="middle" fontFamily="monospace">
              {unit === '$' ? `$${t.toFixed(2)}` : t.toFixed(max - min < 3 ? 1 : 0)}
              {unit && unit !== '$' ? unit : ''}
            </text>
          </g>
        ))}
        {laid.map((r) => (
          <g key={`${r.group ?? ''}-${r.label}`}>
            {r.newGroup && (
              <text x={0} y={r.y - 8} fontSize="12" fill={CYAN} fontFamily="monospace" letterSpacing="1">
                {r.group!.toUpperCase()}
              </text>
            )}
            <text x={L - 12} y={r.y + 15} fontSize="13" fill="#e5e7eb" textAnchor="end">{r.label}</text>
            <rect x={L} y={r.y + 3} width={Math.max(x(r.value) - L, 2)} height={20} rx={4} fill={r.color} opacity={0.85}>
              <title>{`${r.label}: ${r.text ?? r.value}`}</title>
            </rect>
            <text x={x(r.value) + 8} y={r.y + 18} fontSize="12" fill="#e5e7eb" fontFamily="monospace">{r.text ?? r.value.toFixed(2)}</text>
          </g>
        ))}
      </svg>
    </Shell>
  );
}

export type Point = { label: string; x: number; y: number; color: string };

// Score vs cost. Log x axis; labels alternate above/below to limit overlap.
export function ScatterChart({
  points, xLabel, yLabel, yMin, yMax, xTicks, legend, note = 'Top left = better for less money', yFormat = (v: number) => v.toFixed(1),
}: {
  points: Point[]; xLabel: string; yLabel: string; yMin: number; yMax: number; xTicks: number[];
  legend?: { color: string; label: string }[]; note?: string; yFormat?: (v: number) => string;
}) {
  const W = 900, L = 60, R = 140, T = 30, B = 56, H = 460;
  const lx = Math.log10;
  const xs = points.map((p) => p.x);
  const cmin = Math.min(...xs, ...xTicks) * 0.7, cmax = Math.max(...xs, ...xTicks) * 1.3;
  const x = (c: number) => L + ((lx(c) - lx(cmin)) / (lx(cmax) - lx(cmin))) * (W - L - R);
  const y = (v: number) => T + ((yMax - v) / (yMax - yMin)) * (H - T - B);
  const yTicks = niceTicks(yMin, yMax);
  const sorted = [...points].sort((a, b) => a.x - b.x);
  // Place each label at the first offset that doesn't collide with an earlier label.
  const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
  const labelY = sorted.map((p) => {
    const cx = x(p.x), cy = y(p.y), w = p.label.length * 7.4;
    for (const off of [-10, 20, -28, 38, -46, 56]) {
      const box = { x0: cx + 12, x1: cx + 12 + w, y0: cy + off - 12, y1: cy + off + 3 };
      if (!placed.some((b) => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0)) {
        placed.push(box);
        return cy + off;
      }
    }
    return cy - 10;
  });
  return (
    <Shell legend={legend ? [...legend] : undefined}>
      {note && <p className="font-mono text-xs text-gray-500 -mt-1 mb-2">{note}</p>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px] h-auto" role="img">
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke={GRID} />
            <text x={L - 12} y={y(t) + 4} fontSize="13" textAnchor="end" fill={GRAY} fontFamily="monospace">{yFormat(t)}</text>
          </g>
        ))}
        {xTicks.map((c) => (
          <text key={c} x={x(c)} y={H - B + 22} fontSize="13" textAnchor="middle" fill={GRAY} fontFamily="monospace">${c}</text>
        ))}
        <text x={(L + W - R) / 2} y={H - 8} fontSize="13" textAnchor="middle" fill={GRAY}>{xLabel}</text>
        <text x={14} y={(T + H - B) / 2} fontSize="13" textAnchor="middle" fill={GRAY} transform={`rotate(-90 14 ${(T + H - B) / 2})`}>{yLabel}</text>
        {sorted.map((p, i) => {
          const cx = x(p.x), cy = y(p.y);
          return (
            <g key={p.label}>
              <circle cx={cx} cy={cy} r="9" fill={p.color} stroke="#0a0a0a" strokeWidth="2">
                <title>{`${p.label}: ${yFormat(p.y)} for $${p.x}`}</title>
              </circle>
              <text x={cx + 12} y={labelY[i]} fontSize="13" fill="#e5e7eb">{p.label}</text>
            </g>
          );
        })}
      </svg>
    </Shell>
  );
}

export type DotRow = { label: string; sub?: string; subColor?: string; points: { v: number; color: string; name: string }[] };

// One row per item, a dot per series on a shared axis, joined by a line.
export function DotRows({ rows, min, max, legend, labelW = 200 }: { rows: DotRow[]; min: number; max: number; legend?: { color: string; label: string }[]; labelW?: number }) {
  const W = 900, L = labelW, R = 40, T = 16, rowH = 40;
  const H = T + rows.length * rowH + 30;
  const x = (v: number) => L + ((Math.max(v, min) - min) / (max - min)) * (W - L - R);
  const ticks = Array.from({ length: Math.round((max - min) / 0.1) + 1 }, (_, i) => min + i * 0.1).filter((_, i, a) => a.length <= 9 || i % 2 === 0);
  return (
    <Shell legend={legend}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[600px] h-auto" role="img">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={T - 8} y2={H - 26} stroke={GRID} />
            <text x={x(t)} y={H - 8} fontSize="12" fill={GRAY} textAnchor="middle" fontFamily="monospace">{t.toFixed(1)}</text>
          </g>
        ))}
        {rows.map((r, i) => {
          const y = T + i * rowH + rowH / 2;
          const vs = r.points.map((p) => p.v);
          return (
            <g key={r.label}>
              <text x={0} y={y + (r.sub ? 0 : 4)} fontSize="14" fill="#e5e7eb">{r.label}</text>
              {r.sub && <text x={0} y={y + 14} fontSize="10" fill={r.subColor ?? GRAY} fontFamily="monospace" letterSpacing="0.5">{r.sub.toUpperCase()}</text>}
              {vs.length > 1 && <line x1={x(Math.min(...vs))} x2={x(Math.max(...vs))} y1={y} y2={y} stroke="#6b7280" strokeWidth="2" />}
              {r.points.map((p) => (
                <circle key={p.name} cx={x(p.v)} cy={y} r="8" fill={p.color} stroke="#0a0a0a" strokeWidth="2">
                  <title>{`${r.label}, ${p.name}: ${p.v.toFixed(2)}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
    </Shell>
  );
}

export type Line = { label: string; color: string; values: (number | null)[] };

// Score across categories (x), one line per item, labels at the right end.
export function LineChart({ lines, xLabels, min, max, legend }: { lines: Line[]; xLabels: string[]; min: number; max: number; legend?: { color: string; label: string }[] }) {
  const W = 900, L = 90, R = 200, T = 20, B = 50, H = 520;
  const x = (i: number) => L + (i / (xLabels.length - 1)) * (W - L - R);
  const y = (v: number) => T + ((max - Math.max(v, min)) / (max - min)) * (H - T - B);
  const ends = lines
    .map((l) => {
      const last = l.values.map((v, i) => [v, i] as const).filter(([v]) => v != null).pop()!;
      return { l, py: y(last[0]!), y: y(last[0]!), i: last[1] };
    })
    .sort((a, b) => a.i - b.i || a.y - b.y);
  // Stack labels that end in the same column; centre each stack on its points.
  for (const col of new Set(ends.map((e) => e.i))) {
    const grp = ends.filter((e) => e.i === col);
    for (let k = 1; k < grp.length; k++) if (grp[k].y - grp[k - 1].y < 15) grp[k].y = grp[k - 1].y + 15;
    const shift = (grp.reduce((a, e) => a + e.py, 0) - grp.reduce((a, e) => a + e.y, 0)) / grp.length;
    grp.forEach((e) => (e.y += Math.min(0, shift)));
  }
  return (
    <Shell legend={legend}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[600px] h-auto" role="img">
        {niceTicks(min, max).map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke={GRID} />
            <text x={L - 10} y={y(t) + 4} fontSize="12" textAnchor="end" fill={GRAY} fontFamily="monospace">{t.toFixed(1)}</text>
          </g>
        ))}
        {xLabels.map((lab, i) => (
          <text key={lab} x={x(i)} y={H - 18} fontSize="13" textAnchor="middle" fill={GRAY}>{lab}</text>
        ))}
        {lines.map((l) => {
          const pts = l.values.map((v, i) => (v == null ? null : [x(i), y(v)])).filter(Boolean) as number[][];
          return (
            <g key={l.label}>
              <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={l.color} strokeWidth="2.5" opacity="0.85" />
              {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r="4.5" fill={l.color} stroke="#0a0a0a" strokeWidth="1.5">
                  <title>{l.label}</title>
                </circle>
              ))}
            </g>
          );
        })}
        {ends.map((e) => (
          <g key={e.l.label}>
            {Math.abs(e.y - e.py) > 4 && <line x1={x(e.i) + 5} y1={e.py} x2={x(e.i) + 18} y2={e.y} stroke={e.l.color} strokeWidth="1" opacity="0.6" />}
            <text x={x(e.i) + 22} y={e.y + 4} fontSize="12" fill={e.l.color}>{e.l.label}</text>
          </g>
        ))}
      </svg>
    </Shell>
  );
}

export type Spider = { label: string; sub?: string; color: string; values: number[] };

// Small multiples: one radar per item so shapes stay readable.
export function SpiderGrid({ items, axes, min, max, legend }: { items: Spider[]; axes: string[]; min: number; max: number; legend?: { color: string; label: string }[] }) {
  const S = 270, c = S / 2, r = 72;
  const pt = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i / axes.length) * 2 * Math.PI;
    const k = (Math.max(v, min) - min) / (max - min);
    return [c + Math.cos(a) * r * k, c + Math.sin(a) * r * k];
  };
  const rings = [0.25, 0.5, 0.75, 1];
  return (
    <Shell legend={legend}>
      <p className="font-mono text-xs text-gray-500 -mt-1 mb-3">Center = {min}, outer ring = {max}. Bigger shape = stronger across the board.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-xl bg-white/[0.03] border border-white/5 p-2 text-center">
            <p className="text-sm font-semibold text-white mt-1">{it.label}</p>
            {it.sub && <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: it.color }}>{it.sub}</p>}
            <svg viewBox={`0 0 ${S} ${S}`} className="w-full h-auto" role="img" aria-label={`${it.label} profile`}>
              {rings.map((k) => (
                <polygon key={k} points={axes.map((_, i) => pt(i, min + k * (max - min)).join(',')).join(' ')} fill="none" stroke={GRID} />
              ))}
              {axes.map((a, i) => {
                const [ex, ey] = pt(i, max);
                const [lx, ly] = [c + (ex - c) * 1.32, c + (ey - c) * 1.32];
                return (
                  <g key={a}>
                    <line x1={c} y1={c} x2={ex} y2={ey} stroke={GRID} />
                    <text x={lx} y={ly + 4} fontSize="11" textAnchor="middle" fill={GRAY}>{a}</text>
                  </g>
                );
              })}
              <polygon points={it.values.map((v, i) => pt(i, v).join(',')).join(' ')} fill={it.color} fillOpacity="0.3" stroke={it.color} strokeWidth="2">
                <title>{axes.map((a, i) => `${a}: ${it.values[i].toFixed(2)}`).join(', ')}</title>
              </polygon>
            </svg>
          </div>
        ))}
      </div>
    </Shell>
  );
}
