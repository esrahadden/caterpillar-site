import type { Metadata } from 'next';
import ScoresBody from './body';
import { PicksProvider } from './picks';

export const metadata: Metadata = {
  title: 'AI Model Comparison: 23 Models Tested | Caterpillar AI Consulting',
  description:
    'We tested 23 AI models on small-business work: client emails, call summaries, legal reading, admin, images, video and code. See how each one scored.',
};

export default function Scores() {
  return (
    <PicksProvider>
      <ScoresBody />
    </PicksProvider>
  );
}
