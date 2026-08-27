import React, { useState } from 'react';
import './Contact.css';

const INFO = [
  { icon: '📍', label: 'Address', value: '123 Commerce Street, New York, NY 10001' },
  { icon: '📞', label: 'Phone', value: '+1 (624) 423 26 72' },
  { icon: '✉️', label: 'Email', value: 'support@logo.com' },
  { icon: '🕐', label: 'Hours', value: 'Mon – Fri: 9am – 6pm EST' },
];

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-inner">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Have a question or need help? We'd love to hear from you.</p>
        </div>

        <div className="contact-layout">
          {/* Info column */}
          <div className="contact-info-col">
            <h2>Get in Touch</h2>
            <p className="contact-info-sub">Fill out the form and our team will get back to you within 24 hours.</p>
            <div className="contact-info-list">
              {INFO.map(item => (
                <div key={item.label} className="contact-info-item">
                  <span className="contact-info-icon">{item.icon}</span>
                  <div>
                    <p className="contact-info-label">{item.label}</p>
                    <p className="contact-info-val">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-socials">
              {['Twitter', 'Instagram', 'LinkedIn', 'Facebook'].map(s => (
                <button key={s} className="contact-social-btn">{s}</button>
              ))}
            </div>
          </div>

          {/* Form column */}
          <div className="contact-form-col">
            {sent ? (
              <div className="contact-success">
                <div className="contact-success-icon">✓</div>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button className="contact-reset-btn" onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setSent(false); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
                  </div>
                  <div className="contact-field">
                    <label>Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
                  </div>
                </div>
                <div className="contact-field">
                  <label>Subject *</label>
                  <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" required />
                </div>
                <div className="contact-field">
                  <label>Message *</label>
                  <textarea name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Write your message here..." required />
                </div>
                <button type="submit" className="contact-submit-btn">Send Message →</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
