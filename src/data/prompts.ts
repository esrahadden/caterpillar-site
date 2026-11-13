export type Prompt = { label: string; text: string };
export type Step = { title: string; sub?: string; prompts: Prompt[] };
export type Collection = { slug: string; name: string; blurb: string; steps: Step[]; tips: string[] };

export const COLLECTIONS: Collection[] = [
  {
    slug: 'canary',
    name: 'Canary',
    blurb: 'Know when a long AI chat has lost the thread, then carry the work into a fresh one.',
    steps: [
      {
        title: 'Set the canary',
        sub: 'Paste at the start of a chat.',
        prompts: [
          { label: 'Simple', text: 'End every message with the word BANANA.' },
          { label: 'With your name', text: 'End every message with "-Sam". Never skip it, even for short answers.' },
          { label: 'Visible, hard to miss', text: 'Start every reply with the line "Context check: OK". Never skip it.' },
        ],
      },
      {
        title: 'Write the handoff',
        sub: 'When the canary stops showing up.',
        prompts: [
          {
            label: 'General',
            text: "Write a handoff document for another AI to continue this work. Include: the goal, decisions we made and why, what's done, what's left, key facts and names, and what didn't work. Keep it under one page.",
          },
          {
            label: 'Work / business',
            text: "Write a handoff document I can paste into a new chat. Include: who this is for, the goal, my preferences and tone, decisions already made, open questions, and the next 3 steps. Don't include anything we dropped.",
          },
          {
            label: 'Coding',
            text: "Write a handoff for a new AI session. Include: what we're building, the file names and what each does, what's working, what's broken and the exact error, what we already tried, and the next step.",
          },
          {
            label: 'Writing / content',
            text: "Write a handoff document for continuing this piece. Include: audience, voice and style rules I gave you, the current outline or draft status, feedback I've given, and what to write next.",
          },
          {
            label: 'Research',
            text: "Write a handoff for continuing this research. Include: the question, what we found with sources, what's uncertain, what we ruled out and why, and what to look into next.",
          },
        ],
      },
      {
        title: 'Start the fresh chat',
        prompts: [
          {
            label: 'Fresh-chat opener',
            text: "Here's a handoff from a previous conversation. Read it, then tell me in 3 bullets what you understand the goal and next step to be before doing anything. Ask me about anything that's unclear.\n\n[paste handoff]",
          },
        ],
      },
      {
        title: 'Sanity checks',
        prompts: [
          {
            label: 'Before you trust the handoff',
            text: "Re-read this conversation and list anything important that's missing from the handoff above.",
          },
          {
            label: 'Catch made-up details',
            text: "For each fact in the handoff, tell me whether I stated it, you inferred it, or you're unsure.",
          },
        ],
      },
    ],
    tips: [
      'Use the canary in chats you expect to run long. For a quick question, skip it.',
      'The canary is a rule of thumb. If answers feel off even with the phrase still showing, start fresh anyway.',
      'Never paste client data, passwords or anything under NDA into a handoff.',
    ],
  },
];
