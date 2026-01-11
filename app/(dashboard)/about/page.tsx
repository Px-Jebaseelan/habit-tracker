'use client';

export default function AboutPage() {
  return (
    <div className="page-container">
      <div className="about-hero">
        <div className="about-content">
          <h1>About Zenith Habitz</h1>
          <p className="about-tagline">Build Better Habits, Transform Your Life</p>
        </div>
      </div>

      <div className="about-section">
        <div className="section-content">
          <h2>Our Mission</h2>
          <p>
            At Zenith Habitz, we believe that small, consistent actions lead to extraordinary results. 
            Our mission is to empower millions of people to build positive habits and achieve their goals 
            through intelligent tracking, meaningful analytics, and community support.
          </p>
        </div>
      </div>

      <div className="about-section alternate">
        <div className="section-content">
          <h2>Why Zenith Habitz?</h2>
          <div className="features-grid">
            <div className="feature-box">
              <span className="feature-icon">📊</span>
              <h3>Smart Tracking</h3>
              <p>Track unlimited habits with detailed analytics and insights.</p>
            </div>
            <div className="feature-box">
              <span className="feature-icon">🔥</span>
              <h3>Streak System</h3>
              <p>Build momentum with visual streak tracking and milestones.</p>
            </div>
            <div className="feature-box">
              <span className="feature-icon">🎯</span>
              <h3>Gamification</h3>
              <p>Earn points, level up, and unlock achievements.</p>
            </div>
            <div className="feature-box">
              <span className="feature-icon">👥</span>
              <h3>Community</h3>
              <p>Connect with others, share progress, and stay motivated.</p>
            </div>
            <div className="feature-box">
              <span className="feature-icon">📱</span>
              <h3>Accessible</h3>
              <p>Works seamlessly on all devices, anytime, anywhere.</p>
            </div>
            <div className="feature-box">
              <span className="feature-icon">🔒</span>
              <h3>Secure</h3>
              <p>Your data is encrypted and protected with enterprise security.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <div className="section-content">
          <h2>Our Values</h2>
          <div className="values-list">
            <div className="value-item">
              <h3>💡 Innovation</h3>
              <p>Constantly improving our product with the latest technology and user feedback.</p>
            </div>
            <div className="value-item">
              <h3>🤝 Transparency</h3>
              <p>Open and honest communication with our community about our plans and changes.</p>
            </div>
            <div className="value-item">
              <h3>🌟 Empowerment</h3>
              <p>Giving users the tools to take control of their lives and achieve their dreams.</p>
            </div>
            <div className="value-item">
              <h3>💚 Community</h3>
              <p>Building a supportive community where everyone can succeed together.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section alternate">
        <div className="section-content">
          <h2>The Numbers</h2>
          <div className="stats-grid">
            <div className="about-stat">
              <span className="stat-big">50K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="about-stat">
              <span className="stat-big">2M+</span>
              <span className="stat-label">Habits Tracked</span>
            </div>
            <div className="about-stat">
              <span className="stat-big">100M+</span>
              <span className="stat-label">Days Completed</span>
            </div>
            <div className="about-stat">
              <span className="stat-big">4.9★</span>
              <span className="stat-label">User Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <div className="section-content">
          <h2>Meet the Team</h2>
          <p>
            Zenith Habitz was founded by a team of passionate individuals who believe in the power of habits. 
            With backgrounds in psychology, software engineering, and product design, we're dedicated to 
            creating tools that actually help people change their lives.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💼</div>
              <h3>Alex Chen</h3>
              <p>Founder & CEO</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍💻</div>
              <h3>Sarah Williams</h3>
              <p>CTO & Lead Engineer</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍🎨</div>
              <h3>Mike Rodriguez</h3>
              <p>Head of Design</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍📊</div>
              <h3>Emma Johnson</h3>
              <p>Community Manager</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section alternate">
        <div className="section-content">
          <h2>Contact Us</h2>
          <p>Have questions or feedback? We'd love to hear from you!</p>
          <div className="contact-methods">
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <h4>Email</h4>
                <a href="mailto:hello@zenithhabitz.com">hello@zenithhabitz.com</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🐦</span>
              <div>
                <h4>Twitter</h4>
                <a href="https://twitter.com/zenithhabitz" target="_blank">@zenithhabitz</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h4>Location</h4>
                <p>San Francisco, CA, USA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
