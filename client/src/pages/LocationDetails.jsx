import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Calendar, Clock, Info, Navigation, Share2, Heart, CloudSun, CloudRain, Image as ImageIcon } from 'lucide-react';
import API_BASE_URL from '../api';

const LocationDetails = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  // Robust decoding
  let decodedName = "";
  try {
    decodedName = name ? decodeURIComponent(name) : 'Location';
  } catch (e) {
    decodedName = name || 'Location';
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLocationDetails();
  }, [decodedName]);

  const [weather, setWeather] = useState({ 
    temp: '--', 
    condition: 'Loading...', 
    forecast: [] 
  });

  const fetchWeather = async (locName, district) => {
    try {
      const cleanName = locName.split('(')[0].trim();
      
      // 1. Geocoding
      let geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanName)}&count=1&language=en&format=json`);
      let geoData = await geoRes.json();
      
      if (!geoData.results && district) {
        geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(district)}&count=1&language=en&format=json`);
        geoData = await geoRes.json();
      }

      if (geoData.results && geoData.results.length > 0) {
        const { latitude, longitude } = geoData.results[0];
        
        // 2. Fetch Weather & Daily Forecast
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max&timezone=auto`);
        const weatherData = await weatherRes.json();
        
        if (weatherData.current_weather && weatherData.daily) {
          const temp = Math.round(weatherData.current_weather.temperature);
          const code = weatherData.current_weather.weathercode;
          
          const conditions = {
            0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
            45: 'Foggy', 48: 'Foggy', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
            61: 'Rainy', 63: 'Rainy', 65: 'Heavy Rain', 95: 'Thunderstorm'
          };
          
          // Map 7-day forecast
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const forecast = weatherData.daily.time.map((date, i) => {
            const dayObj = new Date(date);
            return {
              day: days[dayObj.getDay()],
              temp: Math.round(weatherData.daily.temperature_2m_max[i]),
              code: weatherData.daily.weathercode[i]
            };
          });
          
          setWeather({
            temp: `${temp}°C`,
            condition: conditions[code] || 'Cloudy',
            forecast: forecast
          });
        }
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
    }
  };

  const fetchLocationDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/locations/${encodeURIComponent(decodedName)}`);
      if (response.ok) {
        const data = await response.json();
        setLocation(data);
        if (data.name) fetchWeather(data.name, data.district);
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Safety check for rendering
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <CloudSun size={48} color="var(--accent)" />
        </motion.div>
      </div>
    );
  }

  if (!location) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '100vh', background: '#f8fafc' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Location Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sorry, we couldn't find the details for "{decodedName}".</p>
        <button onClick={() => navigate('/')} style={{ background: 'var(--accent)', color: 'white', padding: '1rem 2rem', borderRadius: '9999px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingBottom: '4rem',
      backgroundImage: `linear-gradient(rgba(241, 245, 249, 0.8), rgba(241, 245, 249, 0.95)), url(${location.image || "/landscape.png"})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            fontWeight: 700, 
            cursor: 'pointer',
            padding: '1rem 0',
            marginBottom: '1rem'
          }}
        >
          <ArrowLeft size={20} /> Back
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass"
          style={{ 
            borderRadius: '2rem',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Hero Image Section */}
          <div style={{ height: '400px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              backgroundImage: `url(${location.image || "/landscape.png"})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }} />
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))' 
            }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2.5rem', right: '2.5rem' }}>
              <span style={{ background: 'var(--accent)', color: 'white', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', display: 'inline-block' }}>
                {location.category || 'Must Visit'}
              </span>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                {location.name}
              </h1>
            </div>
          </div>

          <div style={{ padding: '3rem' }}>
            {/* Header Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star fill="var(--accent)" color="var(--accent)" size={20} />
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    {location.reviews && location.reviews.length > 0 
                      ? (location.reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / location.reviews.length).toFixed(1)
                      : (location.rating || '5.0')}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                    ({location.reviews ? location.reviews.length : 0} Reviews)
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600 }}>
                  <MapPin size={20} color="var(--accent)" />
                  {location.district}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ padding: '0.75rem', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.1)', background: 'white', cursor: 'pointer' }}><Share2 size={20} /></button>
                <button style={{ padding: '0.75rem', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.1)', background: 'white', cursor: 'pointer' }}><Heart size={20} /></button>
              </div>
            </div>

            {/* Main Content Grid (About & Sidebar) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
              {/* Left: About & Highlights */}
              <div style={{ flex: '1.6' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Info size={24} color="var(--accent)" /> About {location.name}
                  </h2>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    {location.description}
                  </p>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>Key Highlights</h3>
                  <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', padding: 0, listStyle: 'none' }}>
                    {(location.highlights || []).map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }}></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Quick Info Cards */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.4)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} color="var(--accent)" /> Best Time
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{location.bestTime || 'Year-round'}</p>
                  </div>
                  <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.4)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} color="var(--accent)" /> Duration
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{location.duration || '2-4 hours'}</p>
                  </div>
                </div>

                <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ImageIcon size={20} color="var(--accent)" />
                    <span style={{ fontWeight: 700 }}>Photo Gallery</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700 }}>12+ Photos</span>
                </div>

                <button style={{ padding: '1.25rem', borderRadius: '1.25rem', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)' }}>
                  <Heart size={20} fill="white" /> Add to Favorites
                </button>
              </div>
            </div>

            {/* Map & Weather (Side-by-Side) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="liquid-glass" style={{ padding: '2rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.5)', minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin size={24} color="var(--accent)" /> Location Map
                </h3>
                    <div style={{ flex: 1, borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', position: 'relative' }}>
                      <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        src={(() => {
                          const code = location.mapCode;
                          if (!code) return `https://maps.google.com/maps?q=${encodeURIComponent(location.name + ' Sri Lanka')}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
                          if (code.includes('http')) return code;
                          return `https://maps.google.com/maps?q=${encodeURIComponent(code)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
                        })()}
                        style={{ filter: 'grayscale(0.2) contrast(1.1)' }}
                      ></iframe>
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapCode || location.name + ' Sri Lanka')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                      <Navigation size={16} /> Open in Google Maps
                    </a>
              </div>

              <div className="liquid-glass" style={{ padding: '2rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.5)', minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CloudSun size={24} color="var(--accent)" /> Weather Forecast
                </h3>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.4)', borderRadius: '1.5rem' }}>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current</p>
                      <p style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-primary)' }}>{weather.temp}</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>{weather.condition}</p>
                    </div>
                    <CloudSun size={64} color="var(--accent)" />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.4)', borderRadius: '1.25rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Elevation</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>1,200m</p>
                    </div>
                    <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.4)', borderRadius: '1.25rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>High / Low</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>31° / 24°</p>
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.4)', borderRadius: '1.5rem', flex: 1 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>7-Day Outlook</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {(weather.forecast.length > 0 ? weather.forecast : [...Array(7)]).map((item, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>{item?.day || '-'}</p>
                          {item?.code <= 3 ? <CloudSun size={20} color="var(--accent)" /> : <CloudRain size={20} color="var(--accent)" />}
                          <p style={{ fontSize: '0.8rem', fontWeight: 800, marginTop: '0.5rem' }}>{item?.temp ? item.temp + '°' : '--'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section (Full Width at Bottom) */}
            <div style={{ paddingTop: '4rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Star size={32} color="var(--accent)" /> Reviews & Community
                </h2>
                <div className="liquid-glass" style={{ padding: '0.6rem 1.5rem', borderRadius: '9999px', fontSize: '1rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                  {location.views || 0} Total Views
                </div>
              </div>

              <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Write a Review Form */}
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const user = e.target.user.value;
                    const comment = e.target.comment.value;
                    const rating = 5; // Static for now, can be expanded
                    
                    try {
                      const response = await fetch(`${API_BASE_URL}/api/locations/${location.id}/reviews`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user, rating, comment })
                      });
                      if (response.ok) {
                        alert('Review posted successfully!');
                        fetchLocationDetails(); // Refresh data
                        e.target.reset();
                      }
                    } catch (error) {
                      console.error('Error posting review:', error);
                    }
                  }}
                  className="liquid-glass" 
                  style={{ padding: '3rem', borderRadius: '2rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.6)' }}
                >
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Share your journey</h3>
                  <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem' }}>YOUR NAME</label>
                      <input name="user" required placeholder="Enter your name" style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(255,255,255,0.5)', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem' }}>YOUR EXPERIENCE</label>
                      <textarea name="comment" required placeholder="Tell other travelers about your visit..." style={{ width: '100%', minHeight: '120px', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(255,255,255,0.5)', outline: 'none', resize: 'vertical' }} />
                    </div>
                  </div>
                  <button type="submit" style={{ padding: '1rem 3rem', borderRadius: '9999px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}>Post Review</button>
                </form>

                {(!location.reviews || location.reviews.length === 0) ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No reviews yet. Be the first to share your experience!</p>
                ) : (
                  location.reviews.map((review, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="liquid-glass" 
                      style={{ padding: '2.5rem', borderRadius: '2rem' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 900 }}>{review.user}</h4>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.2rem' }}>
                          {[...Array(review.rating || 5)].map((_, i) => <Star key={i} size={16} fill="var(--accent)" color="var(--accent)" />)}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>"{review.comment}"</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LocationDetails;
