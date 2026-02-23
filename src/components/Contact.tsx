'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function Contact() {
  return (
    <section id="contact" className="section-premium bg-gradient-to-b from-surface-elevated to-surface-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight text-white">
            Let's{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Connect
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Ready to explore what AI can do for your business? Reach out — we'd love to hear from you.
          </p>
        </motion.div>

        {/* Contact Details */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-xl mx-auto glass rounded-3xl p-8 border border-surface-border"
        >
          <div className="space-y-6">
            <motion.div variants={staggerItem} className="flex items-start">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-white">Email</h4>
                <a href="mailto:samer@caterpillar-consulting.ai" className="text-gray-400 hover:text-purple-400 transition">samer@caterpillar-consulting.ai</a>
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="flex items-start">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-white">Phone</h4>
                <a href="tel:+14049390628" className="text-gray-400 hover:text-purple-400 transition">(404) 939-0628</a>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
