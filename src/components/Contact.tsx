import LeadForm from './LeadForm';

export default function Contact() {
  return (
    <section className="col" id="contact">
      <div className="content">
        <div className="panel">
          <div className="kick">Free discovery call</div>
          <h2>Book your free discovery call</h2>
          <p>
            Tell us what&apos;s eating your day. In one conversation we&apos;ll find where AI can give you time back, with no pressure and no jargon.
          </p>
          <div className="contact-grid">
            <LeadForm idPrefix="contact" />
            <div className="reach">
              <div>
                <small>Email</small>
                <a href="mailto:samer@caterpillar-consulting.ai">samer@caterpillar-consulting.ai</a>
              </div>
              <div>
                <small>Phone</small>
                <a href="tel:+14049390628">(404) 939-0628</a>
              </div>
              <div>
                <small>Or grab a time</small>
                <a className="mint" href="https://cal.com/caterpillar.ai/quick-chat" target="_blank" rel="noopener noreferrer">
                  Book a quick call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
