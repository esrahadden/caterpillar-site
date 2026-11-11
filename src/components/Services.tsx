const services = [
  {
    id: 'service-ai-strategy',
    title: 'AI Strategy Consulting',
    text: "Most businesses don't have an AI problem. They have a clarity problem. We work with you to cut through the noise and build a strategy that fits your organization: which tools are worth your time, which ones aren't, and where AI will genuinely move the needle. The result is a clear roadmap you can act on, not a report that collects dust.",
  },
  {
    id: 'service-workflow-automation',
    title: 'Workflow Automation',
    text: "Repetitive tasks are the low-hanging fruit of AI adoption. We identify the manual processes eating up your team's time and build automations that handle them, freeing your people for work that actually requires a human.",
  },
  {
    id: 'service-training',
    title: 'AI Training & Workshops',
    text: "The best AI tools in the world don't help if your team doesn't use them. We run hands-on training for real people, not tech experts, tailored to how your team actually works. We also give seminars and talks for larger groups, associations and events.",
  },
  {
    id: 'service-custom-solutions',
    title: 'Custom-Built Solutions',
    text: "Sometimes off-the-shelf tools don't cut it. We design and build custom AI-powered solutions for specific business needs, from document processing and data pipelines to RAG tools and automated reporting.",
  },
  {
    id: 'service-tool-selection',
    title: 'AI Tool Selection',
    text: "The AI landscape is overwhelming and moves fast. We help you evaluate what's out there, avoid expensive mistakes, and choose tools that fit your budget, your workflow, and your team's actual capabilities.",
  },
  {
    id: 'service-ongoing-support',
    title: 'Ongoing AI Support',
    text: "AI isn't a one-time project. As your needs evolve and the technology changes, we stay in your corner for guidance, troubleshooting, and strategy as you grow.",
  },
];

export default function Services() {
  return (
    <section className="col" id="services">
      <div className="content">
        <div className="panel">
          <div className="kick">What we do</div>
          <h2>Practical AI for businesses that want real results</h2>
          <p>Not just a longer tech stack.</p>
          <div className="list">
            {services.map((s) => (
              <div key={s.id} id={s.id}>
                <h3>{s.title}</h3>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
