import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Connect with Samer | Caterpillar AI Consulting',
  description: 'Book a quick call or save my contact. Caterpillar builds AI systems that take admin off small business owners’ plates.',
};

const CAL_LINK = 'https://cal.com/caterpillar.ai/quick-chat';

export default function Connect() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-primary noise-texture">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-cyan-900/40 animate-gradient"></div>
      <div className="absolute -top-24 left-0 w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 flex flex-col min-h-screen">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logos/caterpillar-logo.png" alt="Caterpillar AI Consulting" width={36} height={36} className="rounded-lg" />
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">caterpillar</span>
          </Link>
          <Link href="/" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors font-medium">
            Home
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center text-center py-12">
          <p className="text-cyan-400 font-medium mb-3">Great to meet you 👋</p>
          <h1 className="text-4xl font-heading font-bold text-white leading-tight mb-4">
            Samer Sabbagh
          </h1>
          <p className="text-gray-400 mb-6">Founder, Caterpillar AI Consulting</p>
          <p className="text-lg text-gray-300 leading-relaxed mb-10">
            We build AI systems for small business owners that take estimates, intake, email and reporting off your plate, and we teach you to use them so they stick.
          </p>

          <div className="flex flex-col gap-4">
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-shadow duration-300"
            >
              Book a quick call
            </a>
            <a
              href="/card/samersabbagh.vcf"
              download
              className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-full font-semibold text-lg hover:bg-cyan-400/10 transition-all duration-300"
            >
              Save my contact
            </a>
          </div>

          <div className="flex justify-center gap-6 mt-8 text-sm">
            <a href="mailto:samer@caterpillar-consulting.ai" className="text-gray-400 hover:text-purple-400 transition">
              Email
            </a>
            <a href="tel:+14049390628" className="text-gray-400 hover:text-purple-400 transition">
              Call / text
            </a>
            <Link href="/" className="text-gray-400 hover:text-purple-400 transition">
              Full website
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">© Caterpillar AI Consulting</p>
      </div>
    </main>
  );
}
