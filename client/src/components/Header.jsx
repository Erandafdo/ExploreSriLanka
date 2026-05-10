import React, { useState } from 'react';
import { Search, Map as MapIcon, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/district/${searchQuery.trim().toLowerCase()}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const navItems = ['Mountain', 'Beach', 'Waterfall', 'Heritage', 'Nature'];

  return (
    <header className="liquid-glass header-content" style={{ 
      position: 'sticky', 
      top: '1rem', 
      zIndex: 100, 
      margin: '1rem 2rem', 
      borderRadius: '1rem',
      padding: '0.75rem 2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <MapIcon size={32} color="#10b981" />
          <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>Explore<span style={{ color: '#10b981' }}>LK</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {navItems.map((item) => (
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
        
        {/* Search Bar (Hidden on very small screens, or we can make it better) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-end' }}>
          <form onSubmit={handleSearch} className="desktop-nav" style={{ display: 'flex', width: '100%', maxWidth: '250px', position: 'relative' }}>
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
            />
            <Search 
              size={16} 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
            />
          </form>

          {/* Mobile Menu Toggle */}
          <button className="mobile-nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', paddingTop: '1rem' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
              {navItems.map((item) => (
                <Link 
                  key={item} 
                  to={`/category/${item.toLowerCase()}`} 
                  onClick={() => setIsMenuOpen(false)}
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '1.1rem' }}
                >
                  {item}
                </Link>
              ))}
              <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', position: 'relative', marginTop: '0.5rem' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search districts..."
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 1rem 0.75rem 2.5rem', 
                    borderRadius: '1rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    fontSize: '1rem'
                  }}
                />
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

