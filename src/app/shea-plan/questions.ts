export type Question = {
  id: string;
  label: string;
  hint?: string;
  type: 'text' | 'long' | 'single' | 'multi';
  options?: string[];
  required?: boolean;
  // Optional free-text follow-up shown under a choice question.
  more?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel';
};

export type Section = {
  id: string;
  title: string;
  intro: string;
  questions: Question[];
};

const NOT_SURE = 'Not sure';

export const SECTIONS: Section[] = [
  {
    id: 'you',
    title: 'About you',
    intro: 'The basics, so I know who I’m planning for.',
    questions: [
      { id: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
      {
        id: 'contact',
        label: 'Best way to reach you',
        hint: 'A phone number or an email is fine.',
        type: 'text',
        required: true,
      },
      {
        id: 'work',
        label: 'What do you do?',
        hint: 'Your business or work, and your role in it. Example: “I run a two-person landscaping company and do all the quoting myself.”',
        type: 'long',
      },
      {
        id: 'goals',
        label: 'What are your 1 to 3 main goals for the next 90 days?',
        hint: 'Example: “Answer every new customer the same day. Post twice a week. Stop doing invoices on Sunday nights.”',
        type: 'long',
      },
      {
        id: 'others',
        label: 'Will anyone else use this with you?',
        type: 'single',
        options: ['Just me', 'A partner or family member', 'An assistant or team', NOT_SURE],
        more: 'Who, and what would they use it for?',
      },
    ],
  },
  {
    id: 'day',
    title: 'Your day',
    intro: 'Tell me about your actual days. This is how I work out what to hand off.',
    questions: [
      {
        id: 'typical_day',
        label: 'Walk me through a typical day. What eats your time?',
        hint: 'As much detail as you like. Rambling is welcome here.',
        type: 'long',
      },
      {
        id: 'repetitive',
        label: 'What feels repetitive, or keeps slipping through the cracks?',
        hint: 'Example: “Following up on quotes. I forget until the customer has gone elsewhere.”',
        type: 'long',
      },
      {
        id: 'handoff',
        label: 'What would you hand off first?',
        hint: 'Pick as many as you like.',
        type: 'multi',
        options: [
          'Email inbox',
          'Scheduling',
          'Follow-ups',
          'Content and social media',
          'Research',
          'Bookkeeping and invoices',
          'Reminders and errands',
          'Building things (websites, forms, tools)',
          NOT_SURE,
        ],
        more: 'Anything else?',
      },
      {
        id: 'content',
        label: 'Do you post content or on social media?',
        hint: 'Which platforms, and how often? “No, and I don’t want to” is a fine answer.',
        type: 'long',
      },
    ],
  },
  {
    id: 'helpers',
    title: 'Your helpers',
    intro:
      'A setup like mine is a small team of AI helpers, called agents. Each one has a job, and they report to you. Which of these sound useful?',
    questions: [
      {
        id: 'agents',
        label: 'Which helpers would you want?',
        hint: 'Pick as many as you like. We’ll start with two or three and add more later.',
        type: 'multi',
        options: [
          'Personal assistant: home, errands, reminders, appointments',
          'Business assistant: email, calendar, customer follow-ups',
          'Researcher: looks things up and compares options',
          'Content creator: drafts posts, scripts and newsletters',
          'Builder: makes websites, forms and small tools',
          'Writer: documents, guides and proposals',
          'Coordinator: keeps the others on track and briefs you',
          NOT_SURE,
        ],
      },
      {
        id: 'agents_other',
        label: 'Anything you’d want a helper for that isn’t on the list?',
        type: 'long',
      },
      {
        id: 'never_touch',
        label: 'What should they never touch?',
        hint: 'Example: “My bank accounts. Anything to do with my kids’ school.”',
        type: 'long',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Your tools',
    intro: 'What you already use, so I know what your helpers need to connect to. You sign in to everything yourself. They never see your passwords.',
    questions: [
      {
        id: 'email',
        label: 'Which email do you use?',
        type: 'single',
        options: ['Gmail', 'Outlook', 'Apple iCloud', 'Something else', NOT_SURE],
      },
      {
        id: 'email_new',
        label: 'For this setup, use your existing email or a new one?',
        hint: 'A new address keeps everything separate from your personal mail. Your existing one means your helpers can work with the mail you already get.',
        type: 'single',
        options: ['My existing email', 'A brand-new email just for this', 'Both', NOT_SURE],
      },
      {
        id: 'email_accounts',
        label: 'How many inboxes matter to you?',
        hint: 'If you have more than one address, your helpers need to know about each, or they’ll miss things.',
        type: 'single',
        options: ['One', 'A business one and a personal one', 'Three or more', NOT_SURE],
      },
      {
        id: 'calendar_files',
        label: 'Where do your calendar and files live?',
        type: 'multi',
        options: ['Google (Calendar, Drive)', 'Microsoft (Outlook, OneDrive)', 'Apple (iCloud)', 'Dropbox', 'Paper or nowhere yet', NOT_SURE],
      },
      {
        id: 'records',
        label: 'Where do your customer or client records live today?',
        hint: 'A spreadsheet, a CRM, your inbox, a notebook, your head. All fine.',
        type: 'long',
      },
    ],
  },
  {
    id: 'apps',
    title: 'Your apps',
    intro: 'The other places your helpers might need to work.',
    questions: [
      {
        id: 'apps',
        label: 'Other apps your helpers should reach',
        hint: 'Pick any you use and would want them to work with.',
        type: 'multi',
        options: [
          'Notion',
          'Slack',
          'A customer list or CRM',
          'Instagram',
          'Facebook',
          'LinkedIn',
          'TikTok',
          'YouTube',
          'Stripe',
          'QuickBooks',
          NOT_SURE,
        ],
        more: 'Any others? Name them here.',
      },
      {
        id: 'app_access',
        label: 'In those apps, how much should they be allowed to do?',
        type: 'single',
        options: [
          'Look only',
          'Act, but ask me first',
          'Act on their own for small things',
          'It depends on the app',
          NOT_SURE,
        ],
        more: 'If it depends, tell me how.',
      },
      {
        id: 'website',
        label: 'Do you have a website or a domain name?',
        hint: 'If so, what’s the address, and do you know where it’s hosted (Squarespace, Wix, GoDaddy and so on)?',
        type: 'long',
      },
      {
        id: 'github',
        label: 'Do you have a GitHub account?',
        hint: 'GitHub is a free site that stores the work your builder makes. You’ll need an account before we start.',
        type: 'single',
        options: ['Yes, I have one', 'No, but I’ll create one', 'What’s GitHub?'],
      },
    ],
  },
  {
    id: 'computer',
    title: 'Your computer',
    intro: 'Your helpers run on a computer of yours, so I need to know what we’re working with.',
    questions: [
      {
        id: 'computer_type',
        label: 'Mac or PC?',
        type: 'single',
        options: ['Mac', 'Windows PC', 'I’d buy one for this', NOT_SURE],
      },
      {
        id: 'computer_model',
        label: 'Which model, and how much memory, if you know?',
        hint: 'On a Mac: Apple menu, then About This Mac. On Windows: Settings, System, About. A photo description like “2022 MacBook Air, 8 GB” is plenty.',
        type: 'text',
      },
      {
        id: 'always_on',
        label: 'Can it stay on and awake all day?',
        hint: 'Your helpers stop working when the computer sleeps.',
        type: 'single',
        options: ['Yes', 'Most of the day', 'No, I close it and take it with me', NOT_SURE],
      },
      {
        id: 'devices',
        label: 'What else do you work from?',
        type: 'multi',
        options: ['Mostly my phone', 'A second computer', 'A tablet', 'Just the one computer'],
      },
    ],
  },
  {
    id: 'budget',
    title: 'AI accounts and budget',
    intro: 'So the plan fits what you already pay for and what you’re comfortable spending.',
    questions: [
      {
        id: 'claude_plan',
        label: 'Do you have a Claude subscription?',
        hint: 'Claude is the AI that powers the helpers. A subscription keeps the cost flat each month.',
        type: 'single',
        options: ['No', 'Yes, Pro', 'Yes, Max', 'I have one but don’t know which', NOT_SURE],
      },
      {
        id: 'other_ai',
        label: 'Any other AI accounts?',
        type: 'multi',
        options: ['ChatGPT', 'Google Gemini', 'Microsoft Copilot', 'None', NOT_SURE],
        more: 'Any others?',
      },
      {
        id: 'monthly_budget',
        label: 'What monthly budget are you comfortable with, across everything?',
        type: 'single',
        options: ['Under $50', '$50 to $150', '$150 to $300', 'Over $300', NOT_SURE],
      },
      {
        id: 'extras',
        label: 'Are small pay-as-you-go extras OK?',
        hint: 'Things like generating images or video cost a little each time.',
        type: 'single',
        options: ['No, keep it flat', 'Yes, up to about $25 a month', 'Yes, up to about $100 a month', 'Ask me each time', NOT_SURE],
      },
    ],
  },
  {
    id: 'rules',
    title: 'How you want to work with them',
    intro: 'Your rules. They get written down on day one and your helpers follow them.',
    questions: [
      {
        id: 'ask_first',
        label: 'What must they always ask you about first?',
        hint: 'I’d suggest all four of the first ones.',
        type: 'multi',
        options: [
          'Sending anything to other people',
          'Spending money',
          'Deleting things',
          'Putting anything live or public',
          'Changing my calendar',
        ],
        more: 'Anything else they should always ask about?',
      },
      {
        id: 'free_to_do',
        label: 'What can they just do without asking?',
        type: 'multi',
        options: ['Write drafts', 'Research', 'Set reminders', 'Organize files and notes', 'Small fixes to their own work', NOT_SURE],
      },
      {
        id: 'updates',
        label: 'How do you want to hear from them?',
        type: 'multi',
        options: ['A chat app on my computer and phone', 'Telegram', 'A morning brief', 'An evening wrap-up', NOT_SURE],
      },
      {
        id: 'message_style',
        label: 'How do you like your updates?',
        type: 'single',
        options: ['Short and to the point', 'Detailed', 'Short, with detail when I ask'],
      },
      {
        id: 'quiet_hours',
        label: 'What time zone are you in, and when should they not message you?',
        hint: 'Include weekends, and whether it’s OK if they work overnight. Example: “Eastern. Nothing after 9pm, before 7am or on Sundays. Working overnight is fine as long as it’s quiet.”',
        type: 'long',
      },
    ],
  },
  {
    id: 'comfort',
    title: 'Your comfort level',
    intro: 'No wrong answers. This decides how much I set up for you and how much I walk you through.',
    questions: [
      {
        id: 'ai_use',
        label: 'How much do you use AI tools like ChatGPT or Claude today?',
        type: 'single',
        options: ['Never', 'Now and then', 'Most days', 'All day'],
      },
      {
        id: 'terminal',
        label: 'Have you ever used a terminal or command line?',
        hint: 'The window where you type commands instead of clicking.',
        type: 'single',
        options: ['Never', 'A little, with instructions', 'I’m comfortable', 'What’s that?'],
      },
      {
        id: 'style',
        label: 'Which sounds more like you?',
        type: 'single',
        options: ['Just make it work', 'Teach me as we go', 'A bit of both'],
      },
      {
        id: 'voice',
        label: 'Do you talk to your phone or computer instead of typing?',
        type: 'single',
        options: ['Yes, a lot', 'Sometimes', 'No'],
      },
    ],
  },
  {
    id: 'else',
    title: 'Anything else',
    intro: 'Last one.',
    questions: [
      {
        id: 'anything_else',
        label: 'Anything I should know that I didn’t ask?',
        hint: 'Ideas, worries, links, notes. The more you tell me, the better the plan.',
        type: 'long',
      },
    ],
  },
];
