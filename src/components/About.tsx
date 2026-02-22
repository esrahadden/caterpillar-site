'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function About() {
  return (
    <section id="about" className="section-premium bg-surface-elevated relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight text-white">
            About{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Caterpillar AI Consulting
            </span>
          </h2>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <motion.p variants={staggerItem} className="text-xl text-gray-300 mb-8 leading-relaxed">
            AI is transforming the way businesses operate — but knowing which tools to adopt, how to integrate them responsibly, and how to get your team to actually use them is where most organizations get stuck.
          </motion.p>

          <motion.p variants={staggerItem} className="text-lg text-gray-300 mb-8 leading-relaxed">
            At Caterpillar AI, our background is in enterprise technology consulting — including work with agencies like NASA, the Department of Defense, the Department of Homeland Security, and the Department of Labor through firms like KPMG and Accenture. That experience gave us a deep understanding of how complex organizations operate: their processes, their compliance requirements, and the very real friction that comes with introducing new technology at scale.
          </motion.p>

          <motion.p variants={staggerItem} className="text-lg text-gray-300 mb-8 leading-relaxed">
            When AI started to mature in 2023, we recognized immediately what it could do — and more importantly, what it would mean for organizations that got ahead of it early. Since then, we've been immersed in the space: taking courses, attending industry events, engaging with leaders in the field, and applying AI tools across real client engagements. We've built custom solutions for businesses of all sizes, advised enterprise teams on AI strategy, and helped individuals fundamentally change how they work.
          </motion.p>

          <motion.p variants={staggerItem} className="text-lg text-gray-300 leading-relaxed">
            What we bring to every engagement is enterprise-grade thinking combined with practical, hands-on implementation — without the overhead or bureaucracy of a large consulting firm.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
