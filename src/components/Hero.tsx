'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-primary noise-texture">
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-cyan-900/40 animate-gradient"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center z-10"
      >
        {/* Main Heading */}
        <motion.div variants={fadeInUp} className="mb-8">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight tracking-tight text-white">
            AI Is Changing Everything.
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-gradient inline-block">
              We Help You Keep Up.
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          We help businesses and individuals cut through the hype, find the right tools, and actually put them to work — without the overwhelm.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.a
            href="#services"
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10">Explore Our Services</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-cyan-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.a>
          <motion.a
            href="#contact"
            className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-full font-semibold text-lg hover:bg-cyan-400/10 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Book a Free Consultation
          </motion.a>
        </motion.div>

        {/* Stats - commented out until business develops
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20"
        >
          {[
            { number: '500+', label: 'Businesses Trained' },
            { number: '50+', label: 'AI Tools Mastered' },
            { number: '95%', label: 'Client Satisfaction' },
            { number: '10x', label: 'Productivity Boost' },
          ].map((stat, index) => (
            <motion.div key={index} variants={staggerItem} className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
        */}

        {/* Floating Code Brackets */}
        <div className="absolute top-1/4 left-10 text-6xl text-cyan-500/20 font-mono animate-float">{'{'}</div>
        <div className="absolute top-1/3 right-10 text-6xl text-purple-500/20 font-mono animate-float" style={{ animationDelay: '0.5s' }}>{'}'}</div>
        <div className="absolute bottom-1/4 left-20 text-5xl text-teal-500/20 font-mono animate-float" style={{ animationDelay: '1s' }}>{'<>'}</div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
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
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
