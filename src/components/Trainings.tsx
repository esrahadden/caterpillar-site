'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

function TeamIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M7 20h10" />
      <path d="M12 16v4" />
      <path d="M8 9h8" />
      <path d="M8 12h5" />
    </svg>
  );
}

function SeminarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6" />
      <rect x="8" y="2" width="8" height="6" rx="1" />
      <circle cx="5" cy="15" r="2" />
      <circle cx="12" cy="15" r="2" />
      <circle cx="19" cy="15" r="2" />
      <path d="M2 22a3 3 0 0 1 6 0" />
      <path d="M9 22a3 3 0 0 1 6 0" />
      <path d="M16 22a3 3 0 0 1 6 0" />
    </svg>
  );
}

function ProgramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M9 7h7" />
      <path d="M9 11h5" />
    </svg>
  );
}

const trainings = [
  {
    icon: TeamIcon,
    title: 'Team Workshops',
    description:
      'Hands-on sessions for your staff, using your own tasks. We cover how to write prompts that get usable answers, how to choose the right AI model for the job, and how to use AI safely with client data.',
  },
  {
    icon: SeminarIcon,
    title: 'Large-Group Seminars',
    description:
      'Talks and seminars for associations, firms and events. Each session is built around examples from your audience’s own industry, so people leave knowing what to try on Monday morning.',
  },
  {
    icon: ProgramIcon,
    title: 'AI Literacy Programs',
    description:
      'A multi-session program for teams that want AI to become part of daily work. Includes a prompt library, cheat sheets for each role, and follow-up office hours to answer questions as they come up.',
  },
];

export default function Trainings() {
  return (
    <section id="trainings" className="section-premium bg-surface-elevated relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight text-white">
            Trainings &amp; Seminars for{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Teams and Groups
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Practical AI training for small teams, whole companies and conference rooms. Plain language, real examples, and
            things people can use the same week.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-3 gap-8"
        >
          {trainings.map((t) => (
            <motion.div
              key={t.title}
              variants={staggerItem}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-8 glass glass-hover rounded-2xl shadow-lg border border-surface-border"
            >
              <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-surface-border flex items-center justify-center">
                <t.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3 tracking-tight text-white">{t.title}</h3>
              <p className="text-gray-300 leading-relaxed">{t.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a
            href="#contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Plan a training
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
