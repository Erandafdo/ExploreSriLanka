import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, ArrowRight, Map } from 'lucide-react';
import API_BASE_URL from '../api';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminAuthenticated', 'true');
        navigate('/admin');
      } else {
        setError('Incorrect password. Access denied.');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      padding: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="liquid-glass"
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          padding: '3rem 2rem', 
          borderRadius: '2.5rem',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <div style={{ 
          width: '70px', 
          height: '70px', 
          background: 'var(--accent)', 
          borderRadius: '2rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 15px 30px -10px rgba(16, 185, 129, 0.4)'
        }}>
          <ShieldCheck size={32} color="white" />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Admin Access</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontWeight: 600 }}>Enter your secure password to continue</p>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '1rem 1rem 1rem 3rem', 
                borderRadius: '1.25rem', 
                border: '2px solid rgba(0,0,0,0.05)', 
                background: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 700 }}
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '1.1rem', 
              borderRadius: '1.25rem', 
              border: 'none', 
              background: 'var(--accent)', 
              color: 'white', 
              fontWeight: 800, 
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.3)',
              transition: 'transform 0.2s'
            }}
          >
            {loading ? 'Verifying...' : 'Unlock Dashboard'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <button 
          onClick={() => navigate('/')}
          style={{ 
            marginTop: '2rem', 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            fontWeight: 700, 
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            margin: '2rem auto 0'
          }}
        >
          <Map size={16} /> Back to Public Map
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
