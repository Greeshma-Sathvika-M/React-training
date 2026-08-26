import React, { useState } from 'react';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <div style={{ fontSize: '4rem' }}>📨</div>
        <h1>Message Sent!</h1>
        <p className="muted">Thanks for reaching out, <strong>{form.name}</strong>! We'll get back to you within 24 hours.</p>
        <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => setSent(false)}>
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>📬 Contact Us</h1>
        <p className="muted">Have a question? We'd love to hear from you.</p>
      </div>

      <div className="contact-layout">
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <div className="info-item">📍 <span>123 Paw Street, Pet City, CA 90210</span></div>
          <div className="info-item">📞 <span>(800) 555-PAWS</span></div>
          <div className="info-item">✉️ <span>hello@pawmart.com</span></div>
          <div className="info-item">🕐 <span>Mon–Sat, 9am – 6pm PST</span></div>

          <div className="faq-box">
            <h4>Common Questions</h4>
            <p><strong>Do you ship pets?</strong><br />Yes, with certified animal transport partners.</p>
            <p><strong>Return policy?</strong><br />30-day health guarantee on all pets.</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
            </div>
          </div>
          <div className="form-group">
            <label>Subject</label>
            <select name="subject" value={form.subject} onChange={handleChange} required>
              <option value="">Select a topic...</option>
              <option value="adoption">Pet Adoption</option>
              <option value="order">Order Issue</option>
              <option value="health">Pet Health</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us how we can help..." required />
          </div>
          <button type="submit" className="btn btn-primary w-full">Send Message →</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
