import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="col">
      <div>
        <Link href="/" className="brand">
          <Image src="/logos/caterpillar-logo.png" alt="" width={26} height={26} />
          Caterpillar AI Consulting
        </Link>
        AI systems and training for small businesses in Atlanta.
      </div>
      <div>
        <h2>Explore</h2>
        <a href="#method">Method</a>
        <a href="#services">Services</a>
        <a href="#trainings">Trainings</a>
        <a href="#about">About</a>
        <Link href="/scores">Model Scores</Link>
      </div>
      <div>
        <h2>Services</h2>
        <a href="#service-ai-strategy">AI Strategy</a>
        <a href="#service-workflow-automation">Workflow Automation</a>
        <a href="#service-training">Training</a>
        <a href="#service-custom-solutions">Custom Builds</a>
      </div>
      <div>
        <h2>Get in touch</h2>
        <a href="mailto:samer@caterpillar-consulting.ai">samer@caterpillar-consulting.ai</a>
        <a href="tel:+14049390628">(404) 939-0628</a>
      </div>
      <div className="legal">
        <span>&copy; {currentYear} Caterpillar AI Consulting</span>
        <span>
          <Link href="/privacy">Privacy Policy</Link>
        </span>
      </div>
    </footer>
  );
}
