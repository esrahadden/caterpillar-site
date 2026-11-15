import { SUPABASE_KEY, SUPABASE_URL } from '@/lib/supabase-server';

// Private intake questionnaire. The passcode is checked inside Postgres (security definer
// functions); the table itself has row level security with no public policies.
const SLUG = 'shea';

function fail(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}

async function rpc(fn: string, args: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`${fn} ${res.status} ${await res.text().catch(() => '')}`);
  return (await res.json()) as { ok: boolean; error?: string; [k: string]: unknown };
}

// Tells Samer the questionnaire was submitted. Carries no answers. Never fails the submit.
async function sendSubmitAlert() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Caterpillar Website <onboarding@resend.dev>',
        to: [process.env.LEAD_ALERT_TO || 'sam.sabbagh3@gmail.com'],
        subject: 'Shea submitted his setup questionnaire',
        text: 'Shea finished the setup questionnaire at /shea-plan. Ask Forge for the answers.',
      }),
      cache: 'no-store',
    });
    if (!res.ok) console.error('Submit alert failed', res.status, await res.text().catch(() => ''));
  } catch (err) {
    console.error('Submit alert error', err);
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail('invalid', 400);
  }
  if (!body || typeof body !== 'object') return fail('invalid', 400);

  const passcode = typeof body.passcode === 'string' ? body.passcode : '';
  if (passcode.length < 1 || passcode.length > 100) return fail('denied', 401);

  try {
    if (body.action === 'load') {
      const out = await rpc('intake_plan_load', { p_slug: SLUG, p_passcode: passcode });
      return Response.json(out, { status: out.ok ? 200 : out.error === 'locked' ? 429 : 401 });
    }
    if (body.action === 'save') {
      const answers = body.answers;
      if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return fail('invalid', 400);
      const submit = body.submit === true;
      const out = await rpc('intake_plan_save', {
        p_slug: SLUG,
        p_passcode: passcode,
        p_answers: answers,
        p_submit: submit,
      });
      if (out.ok && submit) await sendSubmitAlert();
      const status = out.ok ? 200 : out.error === 'locked' ? 429 : out.error === 'invalid' ? 400 : 401;
      return Response.json(out, { status });
    }
  } catch (err) {
    console.error('shea-plan error', err);
    return fail('server', 502);
  }
  return fail('invalid', 400);
}
