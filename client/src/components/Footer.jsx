import React from 'react';
import { Heart, Map as MapIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="liquid-glass container" style={{ 
      margin: '2rem auto 1rem', 
      borderRadius: '1rem',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.25rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
        <MapIcon size={24} color="var(--accent)" />
        <span>Explore<span style={{ color: 'var(--accent)' }}>LK</span></span>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', textAlign: 'center', fontSize: '0.95rem' }}>
        Made with <Heart size={16} fill="var(--accent)" color="var(--accent)" /> for Sri Lanka Tourism
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.85rem' }}>
        <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a>
        <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms</a>
        <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact</a>
        <a href="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 700 }}>Admin</a>
      </div>
      
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
        © {new Date().getFullYear()} ExploreLK. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

