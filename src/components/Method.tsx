const steps = [
  { letter: 'L', title: 'Listen', text: "Where your day really goes, and what you'd do with the hours back." },
  { letter: 'I', title: 'Identify', text: 'The bottlenecks costing you most, ranked.' },
  { letter: 'F', title: 'Forge', text: 'The one system that matters most. First version in days, not months.' },
  { letter: 'T', title: 'Train', text: 'Installed with you, live, until it clicks.' },
  { letter: 'S', title: 'Sustain', text: 'Kept running and improved as you grow.' },
];

export default function Method() {
  return (
    <section className="col" id="method">
      <div className="content">
        <div className="panel">
          <div className="kick">The method</div>
          <h2>How we lift the load off your plate</h2>
          <p>From crawling through admin to running a business that works for you.</p>
          <div className="steps">
            {steps.map((s) => (
              <div className="step" key={s.title}>
                <b aria-hidden="true">{s.letter}</b>
                <div>
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
