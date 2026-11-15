import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import ScoresBody from './body';
import { PicksProvider } from './picks';

export const metadata: Metadata = pageMeta('/scores', 'AI Model Comparison: 23 Models Tested | Caterpillar AI Consulting', 'We tested 23 AI models on small-business work: client emails, call summaries, legal reading, admin, images, video and code. See how each one scored.');

const datasetLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Caterpillar model lab: AI model comparison on small-business work',
  description:
    'Scores for 23 AI models on synthetic small-business tasks: client emails, call summaries, legal reading, admin with tools, office files, image and video prompts, and coding.',
  url: 'https://www.caterpillar-consulting.ai/scores',
  creator: { '@id': 'https://www.caterpillar-consulting.ai/#business' },
  dateModified: '2026-11-13',
  isAccessibleForFree: true,
  keywords: ['AI model comparison', 'best AI model for coding', 'LLM benchmark', 'small business AI'],
};

export default function Scores() {
  return (
    <PicksProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />
      <ScoresBody />
    </PicksProvider>
  );
}
