import type { Metadata } from 'next';
import '../glass.css';
import './shea-plan.css';
import Wizard from './Wizard';

export const metadata: Metadata = {
  title: 'Your setup plan | Caterpillar AI Consulting',
  description: 'A private questionnaire.',
  robots: { index: false, follow: false },
  openGraph: { title: 'Your setup plan', description: 'A private questionnaire.', url: '/shea-plan' },
};

export default function SheaPlan() {
  return (
    <div className="gl sp">
      <div className="haze dusk" aria-hidden="true" />
      <Wizard />
    </div>
  );
}
