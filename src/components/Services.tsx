'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity={0.2} stroke="none" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function AutomationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function WorkshopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BuildIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  );
}

function SupportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <path d="M12 2v2" />
    </svg>
  );
}

export default function Services() {
  const services = [
    {
      id: 'service-ai-strategy',
      icon: CompassIcon,
      title: 'AI Strategy Consulting',
      description:
        "Most businesses don't have an AI problem — they have a clarity problem. We work with you to cut through the noise and build a strategy that actually fits your organization: which tools are worth your time, which ones aren't, where AI will genuinely move the needle, and where it won't. The result is a clear roadmap you can act on — not a report that collects dust.",
    },
    {
      id: 'service-workflow-automation',
      icon: AutomationIcon,
      title: 'Workflow Automation',
      description:
        "Repetitive tasks are the low-hanging fruit of AI adoption. We identify the manual processes eating up your team's time and build automations that handle them — freeing your people up for work that actually requires a human.",
    },
    {
      id: 'service-training',
      icon: WorkshopIcon,
      title: 'AI Training & Workshops',
      description:
        "The best AI tools in the world don't help if your team doesn't use them. We run hands-on training sessions designed for real people, not tech experts — practical, approachable, and tailored to how your team actually works.",
    },
    {
      id: 'service-custom-solutions',
      icon: BuildIcon,
      title: 'Custom Built Solutions',
      description:
        "Sometimes off-the-shelf tools don't cut it. We design and build custom AI-powered solutions for specific business needs — from document processing and data pipelines to RAG tools and automated reporting workflows.",
    },
    {
      id: 'service-tool-selection',
      icon: SearchIcon,
      title: 'AI Tool Selection',
      description:
        "The AI landscape is overwhelming and moves fast. We help you evaluate what's out there, avoid expensive mistakes, and choose tools that fit your budget, your workflow, and your team's actual capabilities.",
    },
    {
      id: 'service-ongoing-support',
      icon: SupportIcon,
      title: 'Ongoing AI Support',
      description:
        "AI isn't a one-time project. As your needs evolve and the technology changes, we stay in your corner — available for guidance, troubleshooting, and strategy as you grow.",
    },
  ];

  return (
    <section id="services" className="section-premium bg-gradient-to-b from-surface-primary to-surface-elevated relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

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
            What We{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Do
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Practical AI solutions for businesses that want real results, not just a longer tech stack.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              id={service.id}
              variants={staggerItem}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-8 glass glass-hover rounded-2xl shadow-lg border border-surface-border"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-surface-border flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-cyan-400" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-heading font-bold mb-3 tracking-tight text-white">{service.title}</h3>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
