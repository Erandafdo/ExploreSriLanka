import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin } from 'lucide-react';
import API_BASE_URL from '../api';

const Category = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSpots();
  }, [type]);

  const fetchSpots = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/locations`);
      const data = await response.json();
      const filtered = data.filter(s => {
        const cat = (s.category || '').toLowerCase();
        const t = (type || '').toLowerCase();
        return cat === t || cat + 's' === t || t + 's' === cat || cat.includes(t) || t.includes(cat);
      });
      setSpots(filtered);
    } catch (error) {
      console.error('Error fetching spots:', error);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingBottom: '4rem',
      backgroundImage: 'linear-gradient(rgba(241, 245, 249, 0.7), rgba(241, 245, 249, 0.9)), url("/landscape.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          textDecoration: 'none', 
          color: 'var(--accent)', 
          fontWeight: 700,
          marginBottom: '2rem'
        }}>
          <ArrowLeft size={20} /> Back to Map
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem', textTransform: 'capitalize' }}>
            Top {type}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px' }}>
            Discover the most breathtaking {type?.toLowerCase()} across the island, each offering a unique experience.
          </p>

          <div className="spots-grid">
            {spots.map((spot, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/location/${encodeURIComponent(spot.name)}`)}
                className="liquid-glass"
                style={{ 
                  borderRadius: '1.5rem', 
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  width: 'calc(100% + 3rem)', 
                  height: '200px', 
                  margin: '-1.5rem -1.5rem 0.5rem -1.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${spot.thumbnail || spot.image || "/landscape.png"})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                  <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.4rem 0.8rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '0.3rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <Star size={14} fill="var(--accent)" color="var(--accent)" />
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                      {spot.reviews && spot.reviews.length > 0 
                        ? (spot.reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / spot.reviews.length).toFixed(1)
                        : (spot.rating || '5.0')}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{spot.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} color="var(--accent)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{spot.district}</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1 }}>
                  {spot.description}
                </p>

                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent)' }}>Explore →</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {spots.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>No locations found in this category.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Category;

