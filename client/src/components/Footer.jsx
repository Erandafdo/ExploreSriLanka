import React from 'react';
import { Heart, Map as MapIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="liquid-glass" style={{ 
      margin: '2rem 2rem 1rem 2rem', 
      borderRadius: '1rem',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
        <MapIcon size={24} color="var(--accent)" />
        <span>Explore<span style={{ color: 'var(--accent)' }}>LK</span></span>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        Made with <Heart size={16} fill="var(--accent)" color="var(--accent)" /> for Sri Lanka Tourism
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
        <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Privacy Policy</a>
        <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Terms of Service</a>
        <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Contact Us</a>
      </div>
    </footer>
  );
};

export default Footer;
