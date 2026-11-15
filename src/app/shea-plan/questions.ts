export type Question = {
  id: string;
  label: string;
  hint?: string;
  type: 'text' | 'long' | 'single';
  options?: string[];
  required?: boolean;
  autoComplete?: string;
};

export type Section = {
  id: string;
  title: string;
  intro?: string;
  questions: Question[];
};

const NOT_SURE = 'Not sure';

export const SECTIONS: Section[] = [
  {
    id: 'you',
    title: 'You',
    questions: [
      { id: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
      {
        id: 'contact',
        label: 'Best way to reach you',
        hint: 'A phone number or an email.',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'picture',
    title: 'The big picture',
    questions: [
      {
        id: 'context',
        label: 'Tell me what you’re after',
        hint: 'What you want to build, what you want off your plate, what a good setup looks like to you. Paste your write-up here, dictate it, or leave this empty and send it to me separately. As much or as little as you like.',
        type: 'long',
      },
    ],
  },
  {
    id: 'basics',
    title: 'The basics',
    intro: 'Quick taps. These are the things people don’t think to mention, and they shape the plan.',
    questions: [
      {
        id: 'computer_budget',
        label: 'What are you willing to spend on a new computer for this?',
        hint: 'Your agents run on a computer that stays on all day. I’ll recommend a Mac mini with plenty of memory, around 64 GB.',
        type: 'single',
        options: ['Under $1,500', '$1,500 to $2,500', '$2,500 to $4,000', 'Whatever it takes', NOT_SURE],
      },
      {
        id: 'ecosystem',
        label: 'Where do your email and calendar live?',
        type: 'single',
        options: ['Google', 'Microsoft', 'Apple', 'A mix', NOT_SURE],
      },
      {
        id: 'fresh_start',
        label: 'Existing accounts or a fresh start?',
        hint: 'A new email keeps the setup separate from anything tied to an employer.',
        type: 'single',
        options: ['Use my existing personal accounts', 'New email, fresh start', NOT_SURE],
      },
      {
        id: 'github',
        label: 'Do you have a GitHub account?',
        hint: 'It’s free, and it’s where your agents’ work gets stored. You’ll need one before we start.',
        type: 'single',
        options: ['Yes', 'No, but I’ll create one', 'What’s GitHub?'],
      },
      {
        id: 'monthly_budget',
        label: 'Monthly budget you’re comfortable with for subscriptions and tools?',
        type: 'single',
        options: ['Under $100', '$100 to $250', '$250 to $500', 'Whatever it takes', NOT_SURE],
      },
      {
        id: 'terminal',
        label: 'Have you ever used a terminal or command line?',
        type: 'single',
        options: ['Never', 'A little, with instructions', 'I’m comfortable'],
      },
      {
        id: 'style',
        label: 'Which sounds more like you?',
        type: 'single',
        options: ['Just make it work', 'Teach me as we go', 'A bit of both'],
      },
    ],
  },
];
