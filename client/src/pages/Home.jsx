import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map3D from '../components/Map3D';
import { motion } from 'framer-motion';
import { ChevronDown, Star, MapPin } from 'lucide-react';
import API_BASE_URL from '../api';

const Home = () => {
  const navigate = useNavigate();
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/locations`);
        const data = await response.json();
        setSpots(data);
      } catch (error) {
        console.error('Error fetching spots:', error);
      }
    };
    fetchSpots();
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100%',
      backgroundImage: 'linear-gradient(rgba(241, 245, 249, 0.7), rgba(241, 245, 249, 0.9)), url("/landscape.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      
      <main style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '4rem', 
        minHeight: 'calc(100vh - 100px)',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem'
      }}>
        {/* Left Column: Map */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Map3D />
        </motion.div>

        {/* Right Column: Text */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ textAlign: 'left' }}
        >
          <h1 className="hero-title" style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Discover <br/>Sri Lanka
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '500px', lineHeight: 1.8, marginBottom: '2rem' }}>
            Interact with our 3D map. Click on any district to explore its unique beauty, culture, and attractions.
          </p>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            Scroll down for popular spots
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </main>

      {/* Popular Spots Section */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Most Popular Spots in Sri Lanka
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Don't know where to start? Check out these world-renowned destinations that every traveler must experience.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {spots.map((spot, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10, scale: 1.02 }}
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
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 78, 59, 0.2) 100%)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${spot.thumbnail || spot.image || "/landscape.png"})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.9
                  }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.5rem 1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <Star size={16} fill="var(--accent)" color="var(--accent)" />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                      {spot.reviews && spot.reviews.length > 0 
                        ? (spot.reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / spot.reviews.length).toFixed(1)
                        : (spot.rating || '5.0')}
                    </span>
                  </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{spot.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} color="var(--accent)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{spot.district}</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, flex: 1 }}>
                  {spot.description}
                </p>

                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    Explore →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
