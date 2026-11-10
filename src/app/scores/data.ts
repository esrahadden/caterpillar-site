// Results from the Caterpillar model lab run of Nov 9, 2026 (synthetic data only).
// Every number here comes from the lab report; edit them here, not in the page.

export type Kind = 'frontier' | 'open' | 'local' | 'api';

export const KIND_LABEL: Record<Kind, string> = {
  frontier: 'Frontier',
  open: 'Open weights',
  local: 'Open · runs on a Mac',
  api: 'API only',
};

export const ROUNDS = [
  { id: 'R1', name: 'Everyday work' },
  { id: 'R2', name: 'Harder versions' },
  { id: 'R3', name: 'Legal work' },
  { id: 'R4', name: 'Office + admin' },
];

// [model, kind, scores per round R1-R4; null = not run]
export const HEATMAP: [string, Kind, (number | null)[]][] = [
  ['Claude Opus 5.5', 'frontier', [null, 4.91, 4.83, 4.89]],
  ['Claude Fable 5.2', 'frontier', [null, null, 4.85, 4.86]],
  ['GPT-6 Sol', 'frontier', [4.73, 4.87, 4.86, 4.58]],
  ['Claude Sonnet 5.5', 'frontier', [4.53, 4.82, null, null]],
  ['Gemini 4 Argon', 'frontier', [4.35, 4.65, 4.47, 4.76]],
  ['Kimi K3.1 Pro', 'open', [null, null, 4.87, 4.58]],
  ['GLM-5.3 FlashX Legal', 'api', [null, null, 4.85, null]],
  ['GLM-5.3', 'open', [null, null, 4.78, 4.25]],
  ['DeepSeek V4.1 Flash', 'open', [null, null, 4.73, 4.57]],
  ['GLM-5.3 Flash', 'open', [null, null, 4.58, 4.56]],
  ['Qwen3.8 Flash', 'open', [4.68, 4.73, 4.59, 4.27]],
  ['Qwen3.8 27B', 'local', [4.46, 4.74, 4.41, 4.43]],
  ['Qwen3.8 2.4T', 'open', [4.62, null, null, null]],
  ['Qwen3.6-35B-A3B', 'local', [4.22, 4.54, null, null]],
  ['Gemma 4 31B', 'local', [4.2, 4.45, null, null]],
  ['DeepSeek V4 Pro', 'open', [null, null, 4.42, null]],
  ['Mistral Large 4', 'open', [null, null, 4.39, null]],
  ['LongCat 2.0', 'open', [null, null, 4.39, null]],
  ['MiniMax M3', 'open', [null, null, 4.37, null]],
  ['gpt-oss-120b', 'open', [3.53, 4.22, null, null]],
  ['Qwen3.5-122B', 'open', [3.99, null, null, null]],
  ['Nemotron-3 Super', 'open', [3.65, null, null, null]],
  ['Qwen3-Coder-Next', 'open', [2.4, null, null, null]],
];

export const GAP = [
  { round: 'R1 Everyday', frontier: ['GPT-6 Sol', 4.73], open: ['Qwen3.8 Flash', 4.68], local: ['Qwen3.8 27B', 4.46] },
  { round: 'R2 Harder', frontier: ['Opus 5.5', 4.91], open: ['Qwen3.8 27B', 4.74], local: ['Qwen3.8 27B', 4.74] },
  { round: 'R3 Legal', frontier: ['GPT-6 Sol', 4.86], open: ['Kimi K3.1 Pro', 4.87], local: ['Qwen3.8 27B', 4.41] },
  { round: 'R4 Office + admin', frontier: ['Opus 5.5', 4.89], open: ['Kimi / DeepSeek', 4.58], local: ['Qwen3.8 27B', 4.43] },
] as const;

export const TAKEAWAYS = [
  { k: 'Default model', h: 'GPT-6 Sol for writing and legal', p: 'Top tier in rounds 1–3 (4.73–4.87) at $5–10 per 1,000 tasks, and the fastest frontier model. It slipped in round 4 by deleting a calendar event it was told to protect.' },
  { k: 'Agents and office work', h: 'Opus 5.5 is the safest pair of hands', p: '4.98 on tool-using admin with zero rule-breaking moves, and 4.89 combined in round 4. Use it for anything that sends, deletes or edits.' },
  { k: 'Open models caught up on text', h: 'Kimi K3.1 Pro topped the legal round', p: '4.87 on the hard legal tests. DeepSeek V4.1 Flash scored 4.73 at $2.31 per 1,000 tasks, about a quarter of GPT-6 Sol’s cost.' },
  { k: 'Runs on a Mac', h: 'Qwen3.8 27B: 4.41–4.74 every round', p: 'Needs about 17–30 GB of memory. Matches frontier on emails, summaries, extraction and admin. Weak on contract review (3.23) and on the look of slides and graphics.' },
  { k: 'Premium tier', h: 'Fable 5.2: best quality, 6–10× the price', p: 'Best contract reviewer (4.63) and best slide decks, but $102 per 1,000 tasks. Worth it for contracts and client-facing visuals.' },
  { k: 'Still needs a human', h: 'Scripts, contracts, cleanup actions', p: 'Scripts ran long and slipped in invented figures. Contract review still separates models. Four models deleted a meeting they were told to protect.' },
  { k: 'Watch out', h: 'Gemini invents details in copy', p: '4 of 10 rule-bound writing tasks were flagged for made-up facts, such as an office or a free consultation that didn’t exist. Good at visuals and GIFs, though.' },
  { k: 'Thinking matters', h: 'No-think is 10× faster, 0.5–0.9 worse', p: 'Fine for pulling data out of documents. Keep thinking on for summaries, scripts, code and anything legal.' },
  { k: 'Images and video', h: 'Let a model write the prompt', p: 'Gemini and Kimi wrote the best prompts for FLUX 3 and Kling, and raised the share of results you could post as-is from about half to 75–100%. FLUX 3 was the best image generator.' },
  { k: 'Coding', h: 'Opus is perfect; cheap agents are close', p: 'Opus 5.5 scored 5.00 on every coding test. Cheap open models working as agents are close: DeepSeek V4.1 Flash fixed 5 of 5 real GitHub issues for 5 cents.' },
];

export type Call = 'go' | 'stay' | 'any' | 'cheap';
export const CALL_LABEL: Record<Call, string> = {
  go: 'Go local',
  stay: 'Frontier',
  any: 'Solved',
  cheap: 'Cheap API',
};

export const JOBS: { group: string; rows: { job: string; best: string; value: string; local: string; call: Call; callText?: string; why: string }[] }[] = [
  {
    group: 'Everyday client work',
    rows: [
      { job: 'Client emails', best: 'Any frontier', value: 'Qwen3.8 Flash, DeepSeek V4.1 Flash', local: 'Qwen3.8 27B', call: 'go', why: 'Every good model scored 4.6–4.9. Watch for invented details like call lengths.' },
      { job: 'Call summaries', best: 'Opus 5.5, GPT-6 Sol', value: 'Qwen3.8 Flash', local: 'Qwen3.8 27B (4.65)', call: 'go', why: 'Main trap is treating a suggestion as a decision. Thinking must be on.' },
      { job: 'Video scripts', best: 'GPT-6 Sol, Opus 5.5', value: 'Qwen3.8 Flash', local: 'Qwen3.8 27B with a harness', call: 'stay', callText: 'Frontier + fact check', why: 'Most ran long and added small invented numbers.' },
      { job: 'Code fixes', best: 'Any thinking model', value: 'DeepSeek V4.1 Flash', local: 'Qwen3.8 27B', call: 'any', why: 'All fixed every bug with thinking on, decoys included.' },
      { job: 'Data extraction', best: 'Any', value: 'Any, no-think is fine', local: 'Qwen3.8 27B', call: 'go', why: '4.6–5.0 across the board, even with conflicting documents.' },
    ],
  },
  {
    group: 'Legal work',
    rows: [
      { job: 'Long documents, deadlines', best: 'Any', value: 'GLM-5.3 Flash', local: 'Qwen3.8 27B (5.0 / 4.5)', call: 'go', why: 'Nearly solved. Nobody invented an answer to an unanswerable question.' },
      { job: 'Contract review', best: 'Fable 5.2, Kimi, GPT-6 Sol', value: 'GLM-5.3 FlashX Legal', local: 'Not yet (3.23)', call: 'stay', why: 'The one legal test that still separates models: decoy clauses and over-broad releases.' },
      { job: 'Client copy with rules', best: 'Opus 5.5, Kimi, Fable', value: 'DeepSeek V4.1 Flash', local: 'Qwen3.8 27B (4.31)', call: 'stay', why: 'Avoid Gemini here: invented facts.' },
    ],
  },
  {
    group: 'Office work',
    rows: [
      { job: 'Inbox, calendar, CRM', best: 'Opus 5.5', value: 'GLM-5.3 Flash (4.5)', local: 'Qwen3.8 27B (4.53)', call: 'go', callText: 'Local, drafts only', why: 'Nobody fell for phishing or sent when told to draft. Block deletes.' },
      { job: 'Spreadsheets, charts', best: 'Any', value: 'Any', local: 'Qwen3.8 27B', call: 'any', why: 'Real formulas and correct numbers from almost every model.' },
      { job: 'Slide decks', best: 'Fable 5.2', value: 'DeepSeek V4.1 Flash, GLM-5.3 Flash', local: 'Qwen3.8 27B + design pass', call: 'cheap', why: 'Content is fine everywhere. Looks separate the models.' },
      { job: 'GIFs and code graphics', best: 'Gemini 4 Argon, Kimi', value: 'None reliable', local: 'None reliable', call: 'stay', why: 'Open models crashed on some animations.' },
    ],
  },
  {
    group: 'Privacy',
    rows: [
      { job: 'Masking client details', best: 'Runs locally only, by design', value: '—', local: 'Presidio + GLiNER + Qwen3 4B', call: 'go', callText: 'Local', why: '99.3% of critical details caught, about 35 s a page. Keep dates unmasked or deadline answers break.' },
    ],
  },
];

export const PRIVACY_STATS = [
  { v: '99.3%', l: 'critical client details caught by the layered setup' },
  { v: '21 / 24', l: 'documents with no critical leak' },
  { v: '~35 s', l: 'per page on 4 CPU threads, a stand-in for an office PC' },
  { v: '4.31 vs 4.33', l: 'answer quality, masked (dates kept) vs original' },
];

// generator, overall (3 common briefs), thumbnail, quote card, logo, infographic, photo header, post as-is, $/image
export const IMAGE_GEN: [string, number, ...(string)[]][] = [
  ['FLUX 3', 4.59, '4.56', '4.67', '4.56', '4.56', '3.89', '100%', '$0.048'],
  ['GPT Image 2.6', 4.44, '4.50', '4.50', '4.33', '—', '3.67', '100%', '$0.034'],
  ['Nano Banana 2.1', 4.39, '4.67', '4.67', '3.83', '5.00', '3.50', '50%', '$0.036'],
  ['FLUX 3 Klein (open)', 4.37, '4.33', '4.67', '4.11', '4.44', '3.22', '100%', '$0.009'],
  ['MAI-Image 2.6', 4.33, '4.44', '4.67', '3.89', '4.44', '—', '89%', '$0.036'],
  ['Seedream 5 Pro', 4.33, '4.56', '4.33', '4.11', '4.00', '—', '89%', '$0.090'],
  ['Recraft 4.1 Pro', 4.19, '4.33', '4.33', '3.89', '3.78', '3.78', '78%', '$0.210'],
  ['Qwen Image 3 Pro', 4.0, '4.33', '3.22', '4.44', '—', '—', '67%', '$0.040'],
];

// writer, overall, images, post as-is, video, post as-is, $/prompt
export const PROMPT_WRITERS: [string, number, ...string[]][] = [
  ['Gemini 4 Argon', 4.39, '4.36', '75%', '4.42', '75%', '$0.0022'],
  ['Kimi K3.1 Pro', 4.28, '4.28', '78%', '4.28', '100%', '$0.0113'],
  ['Opus 5.5', 4.24, '4.31', '83%', '4.17', '100%', '$0.0123'],
  ['Fable 5.2', 4.24, '4.22', '83%', '4.25', '100%', '$0.0409'],
  ['GLM-5.3', 4.12, '4.41', '94%', '3.83', '50%', '$0.0023'],
  ['DeepSeek V4.1 Flash', 4.09, '4.24', '83%', '3.94', '67%', '$0.0002'],
  ['No writer (raw brief)', 3.99, '4.04', '67%', '3.94', '50%', '—'],
  ['Qwen3.8 Flash', 3.88, '4.09', '89%', '3.67', '50%', '$0.0004'],
  ['Qwen3.8 27B', 3.85, '3.59', '56%', '4.11', '100%', '$0.0014'],
  ['GPT-6 Sol', 3.76, '3.86', '92%', '3.67', '75%', '$0.0036'],
];

// model, open?, overall, hard agentic, agentic coding, one-shot, polyglot orig/reworded, $ round
export const CODING: [string, boolean, number, string, string, string, string, string][] = [
  ['Claude Opus 5.5', false, 5.0, '5.00', '5.00', '5.00', '100% / 100%', '$4.65'],
  ['Gemini 4 Argon', false, 4.99, '4.93', '5.00', '5.00', '100% / 100%', '$2.40'],
  ['GPT-6 Sol', false, 4.98, '4.93', '5.00', '4.97', '88% / 100%', '$1.75'],
  ['Kimi K3.1 Pro', true, 4.91, '4.90', '4.81', '4.90', '88% / 88%', '$2.00'],
  ['Qwen3.8 Flash', true, 4.89, '4.93', '5.00', '4.53', '75% / 88%', '$0.31'],
  ['DeepSeek V4.1 Flash', true, 4.87, '4.87', '4.94', '4.58', '75% / 88%', '$0.46'],
  ['Claude Opus 5', false, 4.87, '5.00', '5.00', '4.58', '100% / 95%', '$9.34'],
  ['Qwen3.8 27B', true, 4.78, '4.48', '4.95', '4.55', '75% / 75%', '$0.91'],
  ['GLM-5.3 Flash', true, 4.7, '4.43', '4.86', '4.98', '50% / 50%', '$0.16'],
  ['GLM-5.3', true, 4.69, '5.00', '4.71', '3.81', '62% / 75%', '$0.56'],
  ['Claude Opus 4.6', false, 4.52, '3.68', '4.95', '4.58', '85% / 85%', '$10.24'],
];

// model, open?, fixed, avg steps, hit limit, cost
export const SWE: [string, boolean, string, string, string, string][] = [
  ['DeepSeek V4.1 Flash', true, '5 / 5', '20', '0', '$0.05'],
  ['Qwen3.8 Flash', true, '4 / 5', '56', '1', '$0.25'],
  ['Claude Opus 5.5', false, '4 / 5', '8', '0', '$0.57'],
  ['Kimi K3.1 Pro', true, '4 / 5', '20', '0', '$1.99'],
  ['GPT-6 Sol', false, '3 / 5', '15', '0', '$0.57'],
  ['GLM-5.3', true, '3 / 5', '41', '1', '$0.66'],
  ['Gemini 4 Argon', false, '3 / 5', '54', '2', '$5.72'],
  ['GLM-5.3 Flash', true, '2 / 5', '49', '2', '$0.35'],
  ['Qwen3.8 27B', true, '2 / 5', '61', '2', '$0.94'],
];
