import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Navigation, Mountain, Waves, Droplets, Landmark, CloudSun, Star } from 'lucide-react';
import API_BASE_URL from '../api';
import sriLankaMap from '@svg-maps/sri-lanka';

const District = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [locations, setLocations] = useState([]);

  const districtData = sriLankaMap.locations.find(
    loc => loc.id.toLowerCase() === id.toLowerCase() || loc.name.toLowerCase() === id.toLowerCase()
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLocations();
  }, [id]);

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/locations`);
      const data = await response.json();
      const filtered = data.filter(loc => 
        loc.district.toLowerCase() === (districtData?.name || id).toLowerCase()
      );
      setLocations(filtered);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const categories = [
    { name: 'All', icon: <Navigation size={18} /> },
    { name: 'Mountain', icon: <Mountain size={18} /> },
    { name: 'Beach', icon: <Waves size={18} /> },
    { name: 'Waterfall', icon: <Droplets size={18} /> },
    { name: 'Heritage', icon: <Landmark size={18} /> }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingBottom: '4rem',
      backgroundImage: 'linear-gradient(rgba(241, 245, 249, 0.8), rgba(241, 245, 249, 0.95)), url("/landscape.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header / Hero Section */}
      <div style={{ background: 'var(--accent)', color: 'white', padding: 'clamp(4rem, 10vw, 6rem) 0 4rem' }}>
        <div className="container">
          <button 
            onClick={() => navigate('/')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'none',
              border: 'none',
              color: 'white', 
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '2rem',
              opacity: 0.8
            }}
          >
            <ArrowLeft size={20} /> Back to Map
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1 }}>{districtData?.name || 'District'}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', opacity: 0.9 }}>
                <MapPin size={20} />
                <span>Sri Lanka, {districtData?.name || id}</span>
              </div>
            </div>

            <div className="liquid-glass" style={{ padding: '1.25rem 1.75rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.2)' }}>
              <CloudSun size={40} />
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>Current Weather</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 900 }}>24°C</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Partly Cloudy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container" style={{ marginTop: '-2rem' }}>
        {/* Category Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          overflowX: 'auto', 
          padding: '1rem 0',
          marginBottom: '2.5rem',
          scrollbarWidth: 'none'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveFilter(cat.name)}
              className="liquid-glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                border: 'none',
                background: activeFilter === cat.name ? 'white' : 'rgba(255,255,255,0.6)',
                color: activeFilter === cat.name ? 'var(--accent)' : 'var(--text-primary)',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
                boxShadow: activeFilter === cat.name ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)' }}>Top Spots</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600 }}>Discover the best attractions in {districtData?.name}.</p>
          </div>

          <div className="spots-grid">
            {locations
            .filter(loc => activeFilter === 'All' || loc.type === activeFilter || loc.category === activeFilter)
            .map((loc) => (
              <motion.div 
                key={loc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/location/${encodeURIComponent(loc.name)}`)}
                className="liquid-glass" 
                style={{ 
                  padding: '1.25rem', 
                  borderRadius: '1.5rem', 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  width: 'calc(100% + 2.5rem)', 
                  height: '180px', 
                  margin: '-1.25rem -1.25rem 0.25rem -1.25rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${loc.thumbnail || loc.image || "/landscape.png"})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                  <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.5rem 1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <Star size={16} fill="var(--accent)" color="var(--accent)" />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                      {loc.reviews && loc.reviews.length > 0 
                        ? (loc.reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / loc.reviews.length).toFixed(1)
                        : (loc.rating || '5.0')}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
                    <span style={{ background: 'rgba(0,0,0,0.5)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                      {loc.type}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{loc.name}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {loc.description}
                  </p>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>Explore →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default District;

