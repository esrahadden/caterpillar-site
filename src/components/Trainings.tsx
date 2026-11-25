const offerings = [
  {
    title: 'Team Workshops',
    text: 'Hands-on sessions for your staff, using your own tasks. How to write prompts that get usable answers, how to choose the right AI model for the job, and how to use AI safely with client data.',
  },
  {
    title: 'Large-Group Seminars',
    text: "Talks and seminars for associations, firms and events, built around examples from your audience's own industry, so people leave knowing what to try on Monday morning.",
  },
  {
    title: 'AI Literacy Programs',
    text: 'A multi-session program for teams that want AI in daily work. Includes a prompt library, cheat sheets for each role, and follow-up office hours.',
  },
];

export default function Trainings() {
  return (
    <section className="col" id="trainings">
      <div className="content">
        <div className="panel">
          <div className="kick">Trainings &amp; seminars</div>
          <h2>For teams and groups</h2>
          <p>
            Practical AI training for small teams, whole companies and conference rooms. Plain language, real examples, and things people can use the same week.
          </p>
          <div className="cards3">
            {offerings.map((o) => (
              <div className="mini" key={o.title}>
                <h3>{o.title}</h3>
                <span>{o.text}</span>
              </div>
            ))}
          </div>
          <div className="row" style={{ marginTop: 24 }}>
            <a className="btn" href="#contact">
              Plan a training
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
