'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

const steps = [
  {
    letter: 'L',
    title: 'Listen',
    description:
      'We sit down with you and learn where your day really goes: what eats your time, what frustrates you, and what you would do with those hours back.',
  },
  {
    letter: 'I',
    title: 'Identify',
    description:
      'We map your workflows, find the bottlenecks costing you the most, and rank them. We start with the fixes you can make yourself, for free.',
  },
  {
    letter: 'F',
    title: 'Forge',
    description:
      'We build the one system that will matter most, around how your business actually runs. First version in days, not months.',
  },
  {
    letter: 'T',
    title: 'Train',
    description:
      'We install it with you, live, and work through it together until it clicks. You leave understanding how AI fits your business, not just how to press buttons.',
  },
  {
    letter: 'S',
    title: 'Sustain',
    description:
      'We keep it running, fix what breaks, and improve it as your business grows. You never get stuck with a tool nobody maintains.',
  },
];

export default function Method() {
  return (
    <section id="method" className="section-premium bg-surface-elevated relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight text-white">
            The{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Metamorphosis Method
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            How we <span className="font-semibold text-white">LIFT</span> the load off your plate, from crawling through admin to running a business that works for you.
          </p>
        </motion.div>

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {steps.map((step) => (
            <motion.li
              key={step.letter}
              variants={staggerItem}
              className="relative p-6 glass rounded-2xl border border-surface-border"
            >
              <div className="text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {step.letter}
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 tracking-tight text-white">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed text-sm">{step.description}</p>
            </motion.li>
          ))}
        </motion.ol>

        <motion.figure
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-20 text-center"
        >
          <blockquote className="text-2xl md:text-3xl font-heading text-white leading-snug">
            &ldquo;It&rsquo;s not just about the app that was built. It&rsquo;s about the mindset shift and understanding how AI can help my business run. At this point, I can&rsquo;t live without it.&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-gray-400">
            Restoration company owner
          </figcaption>
        </motion.figure>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a
            href="https://cal.com/caterpillar.ai/quick-chat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-shadow duration-300"
          >
            Book a Free Discovery Call
          </a>
        </motion.div>
      </div>
    </section>
  );
}
