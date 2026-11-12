import { SUPABASE_KEY, SUPABASE_URL } from '@/lib/supabase-server';

const INTERESTS = ['consulting', 'team-training', 'seminar', 'other'] as const;

const INTEREST_LABEL: Record<string, string> = {
  consulting: 'AI consulting',
  'team-training': 'Team training',
  seminar: 'Seminar',
  other: 'Other',
};

// Emails Samer about a new lead. Never blocks or fails the form: the lead is already saved.
async function sendLeadAlert(lead: { name: string; email: string; company: string; interest: string; message: string; source_page: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const text = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company || '(none)'}`,
    `Needs: ${INTEREST_LABEL[lead.interest] ?? lead.interest}`,
    `Page: ${lead.source_page || '(unknown)'}`,
    '',
    lead.message || '(no message)',
  ].join('\n');
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Caterpillar Website <onboarding@resend.dev>',
        to: [process.env.LEAD_ALERT_TO || 'sam.sabbagh3@gmail.com'],
        reply_to: lead.email,
        subject: `New website lead: ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
        text,
      }),
      cache: 'no-store',
    });
    if (!res.ok) console.error('Lead alert failed', res.status, await res.text().catch(() => ''));
  } catch (err) {
    console.error('Lead alert error', err);
  }
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function fail(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail('Invalid request.', 400);
  }
  if (!body || typeof body !== 'object') return fail('Invalid request.', 400);

  const name = str(body.name);
  const email = str(body.email);
  const company = str(body.company);
  const interest = str(body.interest);
  const message = str(body.message);
  const source_page = str(body.source_page);

  if (name.length < 1 || name.length > 120) return fail('Please enter your name (up to 120 characters).', 400);
  if (email.length < 3 || email.length > 200 || !email.includes('@')) return fail('Please enter a valid email address.', 400);
  if (company.length > 160) return fail('Company name is too long (up to 160 characters).', 400);
  if (message.length > 2000) return fail('Message is too long (up to 2000 characters).', 400);
  if (!(INTERESTS as readonly string[]).includes(interest)) return fail('Please choose what you need.', 400);
  if (source_page.length > 200) return fail('Invalid request.', 400);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name,
        email,
        company,
        interest,
        message,
        source_page,
      }),
      cache: 'no-store',
    });
    if (res.status !== 201) {
      console.error('Lead insert failed', res.status, await res.text().catch(() => ''));
      return fail('Something went wrong saving your message. Please email samer@caterpillar-consulting.ai.', 502);
    }
  } catch (err) {
    console.error('Lead insert error', err);
    return fail('Something went wrong saving your message. Please email samer@caterpillar-consulting.ai.', 502);
  }

  await sendLeadAlert({ name, email, company, interest, message, source_page });

  return Response.json({ ok: true }, { status: 201 });
}
