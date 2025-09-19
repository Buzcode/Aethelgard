import React from 'react';
//import './index.css'; // Make sure to import your CSS file

const ContactPage = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p className="tagline">
        Got a question, an idea, or just a thought about history? We'd love to hear
        from you--
      </p>
      <div className="divider"></div>
      <div className="contact-info">
        <p>Reach out to us on:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:aethelgard@gmail.com">aethelgard@gmail.com</a></li>
          <li><strong>Phone:</strong> 017245678910</li>
        </ul>
      </div>
      <div className="divider"></div>
      <p className="bottom-tagline">
        Reach out, because history is better when shared.
      </p>
    </div>
  );
};

export default ContactPage;