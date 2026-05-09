import React, { useState } from 'react';
import { Search, Map as MapIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/district/${searchQuery.trim().toLowerCase()}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="liquid-glass" style={{ 
      position: 'sticky', 
      top: '1rem', 
      zIndex: 50, 
      margin: '1rem 2rem', 
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 2rem'
    }}>
      <Link to="/" className="flex items-center gap-2 text-2xl font-black transition-opacity" style={{ textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <MapIcon size={32} color="#10b981" />
        <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>Explore<span style={{ color: '#10b981' }}>LK</span></span>
      </Link>

      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', margin: '0 2rem' }}>
        {['Mountain', 'Beach', 'Waterfall', 'Heritage', 'Nature'].map((item) => (
          <Link 
            key={item} 
            to={`/category/${item.toLowerCase()}`} 
            style={{ 
              textDecoration: 'none', 
              color: 'var(--text-secondary)', 
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--accent)'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            {item}
          </Link>
        ))}
      </nav>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', maxWidth: '300px', position: 'relative' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          style={{ 
            width: '100%', 
            padding: '0.6rem 1rem 0.6rem 2.5rem', 
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent)';
            e.target.style.background = 'rgba(255, 255, 255, 0.8)';
            e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            e.target.style.background = 'rgba(255, 255, 255, 0.5)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <Search 
          size={16} 
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
        />
      </form>
    </header>
  );
};

export default Header;
