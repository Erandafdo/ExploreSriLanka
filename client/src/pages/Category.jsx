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
      // Filter by category (case-insensitive)
      const filtered = data.filter(s => {
        const cat = s.category.toLowerCase();
        const t = type.toLowerCase();
        // Match if names are identical OR if one is the plural/singular of the other
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
      padding: '2rem',
      backgroundImage: 'linear-gradient(rgba(241, 245, 249, 0.7), rgba(241, 245, 249, 0.9)), url("/landscape.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', textTransform: 'capitalize' }}>
            Top {type}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px' }}>
            Discover the most breathtaking {type.toLowerCase()} across the island, each offering a unique experience.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
            {spots.map((spot, idx) => (
              <motion.div 
                key={idx}
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
                {/* Image Placeholder */}
                <div style={{ 
                  width: 'calc(100% + 3rem)', 
                  height: '180px', 
                  margin: '-1.5rem -1.5rem 0.5rem -1.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${spot.thumbnail || spot.image || "/landscape.png"})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.8
                  }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,255,255,0.95)', padding: '0.4rem 0.75rem', borderRadius: '9999px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                      <Star size={14} color="var(--accent)" fill="var(--accent)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{spot.rating}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{spot.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} color="var(--accent)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{spot.district}</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, flex: 1 }}>
                  {spot.description}
                </p>

                <Link to={`/location/${encodeURIComponent(spot.name)}`} style={{ 
                  marginTop: '1rem',
                  textDecoration: 'none',
                  color: 'var(--accent)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textAlign: 'right'
                }}>
                  Explore Location →
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Category;
