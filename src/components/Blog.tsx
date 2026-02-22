'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function Blog() {
  const articles = [
    {
      title: '10 AI Tools Every Business Should Use in 2025',
      excerpt:
        'Discover the most impactful AI tools that are transforming how businesses operate, from automation to analytics.',
      category: 'Tools',
      readTime: '5 min read',
      date: 'Dec 15, 2024',
      image: '🤖',
    },
    {
      title: 'How to Build an AI-First Culture in Your Organization',
      excerpt:
        'Learn the strategies and best practices for fostering AI adoption across your entire team.',
      category: 'Strategy',
      readTime: '8 min read',
      date: 'Dec 10, 2024',
      image: '🏢',
    },
    {
      title: 'ChatGPT vs Claude vs Gemini: Which AI is Right for You?',
      excerpt:
        'A comprehensive comparison of the leading AI assistants to help you choose the best fit for your needs.',
      category: 'Comparison',
      readTime: '6 min read',
      date: 'Dec 5, 2024',
      image: '⚖️',
    },
    {
      title: 'Automating Your Workflow: A Step-by-Step Guide',
      excerpt:
        'Practical walkthrough for identifying automation opportunities and implementing them with AI tools.',
      category: 'Tutorial',
      readTime: '10 min read',
      date: 'Nov 28, 2024',
      image: '⚡',
    },
    {
      title: 'The ROI of AI: Measuring Success in Your Organization',
      excerpt:
        'Learn how to track and demonstrate the value of your AI investments with key metrics and frameworks.',
      category: 'Business',
      readTime: '7 min read',
      date: 'Nov 20, 2024',
      image: '📊',
    },
    {
      title: 'AI Ethics: Responsible Implementation Best Practices',
      excerpt:
        'Navigate the ethical considerations of AI adoption with our comprehensive guide to responsible AI use.',
      category: 'Ethics',
      readTime: '9 min read',
      date: 'Nov 15, 2024',
      image: '🛡️',
    },
  ];

  return (
    <section id="blog" className="section-premium bg-surface-elevated">
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
            Resources &{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Insights
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Stay informed with the latest AI trends, tips, and strategies from our expert team.
          </p>
        </motion.div>

        {/* Featured Article */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="flex items-center justify-center text-9xl">
              {articles[0].image}
            </div>
            <div className="flex flex-col justify-center text-white">
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-4 w-fit">
                Featured Article
              </div>
              <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4 tracking-tight">{articles[0].title}</h3>
              <p className="text-lg mb-6 opacity-90 leading-relaxed">{articles[0].excerpt}</p>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm opacity-75">{articles[0].date}</span>
                <span className="text-sm opacity-75">•</span>
                <span className="text-sm opacity-75">{articles[0].readTime}</span>
              </div>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition w-fit">
                Read Article
              </button>
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {articles.slice(1).map((article, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl border border-surface-border overflow-hidden group cursor-pointer glass-hover"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-purple-900/40 to-cyan-900/40 flex items-center justify-center text-7xl">
                {article.image}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-semibold">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>

                <h3 className="text-xl font-heading font-bold mb-3 tracking-tight text-white group-hover:text-purple-400 transition-colors">
                  {article.title}
                </h3>

                <p className="text-gray-400 mb-4 line-clamp-2">{article.excerpt}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{article.date}</span>
                  <button className="text-cyan-400 font-semibold text-sm flex items-center group-hover:text-purple-400 transition-colors">
                    Read More
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 glass rounded-3xl p-8 md:p-12 text-center border border-surface-border"
        >
          <h3 className="text-3xl font-heading font-bold mb-4 tracking-tight text-white">Stay Updated</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed">
            Get the latest AI insights, tips, and resources delivered to your inbox monthly.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your.email@company.com"
              className="flex-1 px-4 py-3 rounded-lg bg-surface-card border border-surface-border text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-shadow"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
