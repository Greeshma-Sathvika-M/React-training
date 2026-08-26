import React from 'react';

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>🐾 About PawMart</h1>
        <p className="hero-sub">Connecting loving families with healthy, happy pets since 2015.</p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <span className="about-icon">🏡</span>
          <h3>Trusted Home</h3>
          <p>We partner only with certified, ethical breeders and rescue shelters who prioritize animal welfare above all else.</p>
        </div>
        <div className="about-card">
          <span className="about-icon">💉</span>
          <h3>Health Certified</h3>
          <p>Every pet is vet-checked, vaccinated and dewormed before joining our platform. Your pet's health is our promise.</p>
        </div>
        <div className="about-card">
          <span className="about-icon">🤝</span>
          <h3>Lifetime Support</h3>
          <p>Our team of pet experts is available 24/7 to help you through every stage of your pet's life.</p>
        </div>
        <div className="about-card">
          <span className="about-icon">🌱</span>
          <h3>Eco Friendly</h3>
          <p>We donate 1% of every sale to animal shelters and use sustainable packaging for all accessories shipped.</p>
        </div>
      </div>

      <div className="about-story">
        <h2>Our Story</h2>
        <p>
          PawMart started in a small apartment with one golden retriever named Biscuit and a dream — to make pet adoption
          easier, safer and more joyful for everyone. What began as a weekend project grew into a community of over 10,000
          pet owners across the country.
        </p>
        <p>
          Today we carry dogs, cats, birds, fish and accessories — all carefully curated to meet the highest standards of
          animal care. We believe every pet deserves a loving home, and every family deserves the joy of a healthy companion.
        </p>
      </div>

      <div className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          {[
            { name: 'Sarah Mitchell', role: 'Founder & CEO', emoji: '👩‍💼' },
            { name: 'James Lee', role: 'Head Veterinarian', emoji: '👨‍⚕️' },
            { name: 'Priya Sharma', role: 'Animal Welfare Lead', emoji: '👩‍🔬' },
            { name: 'Carlos Rivera', role: 'Customer Experience', emoji: '👨‍💻' },
          ].map(m => (
            <div key={m.name} className="team-card">
              <span className="team-emoji">{m.emoji}</span>
              <h4>{m.name}</h4>
              <p className="muted">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
