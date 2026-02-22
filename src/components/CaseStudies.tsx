'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function CaseStudies() {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  const caseStudies = [
    {
      company: 'TechStart Inc.',
      industry: 'SaaS',
      challenge: 'Scaling customer support without increasing headcount',
      solution:
        'Implemented AI-powered chatbot and automated ticket routing system with custom training',
      results: ['70% reduction in response time', '40% cost savings', '95% customer satisfaction'],
      metric: '70%',
      metricLabel: 'Faster Response',
      color: 'from-purple-500 to-blue-500',
    },
    {
      company: 'Global Marketing Co.',
      industry: 'Marketing',
      challenge: 'Content creation bottleneck limiting campaign velocity',
      solution:
        'Trained team on AI writing tools and built custom workflow automation for content production',
      results: ['5x content output', '60% time saved', '2x campaign frequency'],
      metric: '5x',
      metricLabel: 'Content Output',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      company: 'HealthCare Plus',
      industry: 'Healthcare',
      challenge: 'Manual data entry consuming 20+ hours weekly',
      solution:
        'Deployed AI document processing and automated data extraction system',
      results: ['95% reduction in manual entry', '$50k annual savings', 'Zero errors'],
      metric: '95%',
      metricLabel: 'Time Saved',
      color: 'from-cyan-500 to-teal-500',
    },
    {
      company: 'Finance Advisors LLC',
      industry: 'Financial Services',
      challenge: 'Complex financial analysis taking days per client',
      solution:
        'Integrated AI analysis tools and created custom financial modeling workflows',
      results: ['10x faster analysis', 'Better insights', '3x client capacity'],
      metric: '10x',
      metricLabel: 'Faster Analysis',
      color: 'from-purple-500 to-cyan-500',
    },
    {
      company: 'EduLearn Academy',
      industry: 'Education',
      challenge: 'Personalized learning difficult to scale',
      solution:
        'Implemented AI-powered adaptive learning platform and trained educators on AI teaching tools',
      results: ['3x engagement', 'Personalized paths', '40% better outcomes'],
      metric: '40%',
      metricLabel: 'Better Outcomes',
      color: 'from-blue-500 to-purple-500',
    },
    {
      company: 'Retail Solutions Inc.',
      industry: 'Retail',
      challenge: 'Inventory forecasting causing stockouts and overstock',
      solution:
        'Deployed AI-powered demand forecasting and automated inventory management',
      results: ['85% forecast accuracy', '30% less waste', '$120k saved'],
      metric: '85%',
      metricLabel: 'Accuracy',
      color: 'from-teal-500 to-blue-500',
    },
  ];

  return (
    <section id="case-studies" className="section-premium bg-gradient-to-b from-surface-primary to-surface-elevated relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>

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
            Success{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real transformations from real businesses. See how our AI consulting drives measurable
            results.
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedCase(selectedCase === index ? null : index)}
              className="group cursor-pointer glass glass-hover rounded-2xl shadow-lg overflow-hidden border border-surface-border"
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${study.color}`}></div>

              <div className="p-6">
                {/* Company Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-heading font-bold tracking-tight text-white mb-1">{study.company}</h3>
                  <p className="text-sm text-cyan-400 font-semibold">{study.industry}</p>
                </div>

                {/* Metric Highlight */}
                <div className="mb-6 text-center py-6 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-xl border border-surface-border">
                  <div
                    className={`text-4xl font-heading font-bold tracking-tight bg-gradient-to-r ${study.color} bg-clip-text text-transparent mb-2`}
                  >
                    {study.metric}
                  </div>
                  <div className="text-sm text-gray-300">{study.metricLabel}</div>
                </div>

                {/* Challenge */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-200 mb-2">Challenge</h4>
                  <p className="text-sm text-gray-300">{study.challenge}</p>
                </div>

                {/* Expandable Content */}
                <AnimatePresence>
                  {selectedCase === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-surface-border pt-4 mt-4">
                        <h4 className="text-sm font-bold text-gray-200 mb-2">Solution</h4>
                        <p className="text-sm text-gray-300 mb-4">{study.solution}</p>

                        <h4 className="text-sm font-bold text-gray-200 mb-2">Results</h4>
                        <ul className="space-y-2">
                          {study.results.map((result, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-300">
                              <svg
                                className="w-4 h-4 mr-2 text-cyan-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {result}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand Button */}
                <button className="mt-4 text-cyan-400 font-semibold text-sm flex items-center group-hover:text-purple-400 transition-colors">
                  {selectedCase === index ? 'Show Less' : 'Read More'}
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform ${
                      selectedCase === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-lg text-gray-300 mb-6">
            Ready to write your own success story?
          </p>
          <motion.a
            href="#contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-cyan-500/50 transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Start Your Transformation
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
