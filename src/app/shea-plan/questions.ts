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
        id: 'computer_type',
        label: 'What computer do you have?',
        hint: 'Today the setup needs a newer Mac: one with an Apple chip, 2020 or later. If you don’t have one, a Mac mini that stays on is the usual pick, and I’ll put it in the plan.',
        type: 'single',
        options: ['A Mac from 2020 or later', 'An older Mac', 'A Windows PC', 'I’d buy a Mac for this', NOT_SURE],
      },
      {
        id: 'always_on',
        label: 'Can it stay on and awake all day?',
        hint: 'Your agents stop working when the computer sleeps.',
        type: 'single',
        options: ['Yes', 'Most of the day', 'No, it travels with me', NOT_SURE],
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
        id: 'claude_plan',
        label: 'Do you have a Claude subscription?',
        hint: 'Claude is the AI that powers the agents. A subscription keeps the cost flat each month.',
        type: 'single',
        options: ['No', 'Yes, Pro', 'Yes, Max', NOT_SURE],
      },
      {
        id: 'monthly_budget',
        label: 'Monthly budget you’re comfortable with, all in?',
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
