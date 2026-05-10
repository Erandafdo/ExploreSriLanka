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

  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const fetchWeather = async (locName, district) => {
    try {
      const cleanName = locName.split('(')[0].trim();
      let geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanName)}&count=1&language=en&format=json`);
      let geoData = await geoRes.json();
      
      if (!geoData.results && district) {
        geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(district)}&count=1&language=en&format=json`);
        geoData = await geoRes.json();
      }

      if (geoData.results && geoData.results.length > 0) {
        const { latitude, longitude } = geoData.results[0];
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
      <div className="container" style={{ padding: '8rem 0', textAlign: 'center', minHeight: '100vh' }}>
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
      <div className="container" style={{ padding: 'var(--spacing-md) 0' }}>
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
          <div className="details-hero" style={{ height: 'clamp(250px, 40vh, 450px)', position: 'relative', overflow: 'hidden' }}>
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
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))' 
            }} />
            <div style={{ position: 'absolute', bottom: 'var(--spacing-md)', left: 'var(--spacing-md)', right: 'var(--spacing-md)' }}>
              <span style={{ background: 'var(--accent)', color: 'white', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', display: 'inline-block' }}>
                {location.category || 'Must Visit'}
              </span>
              <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)', lineHeight: 1.1 }}>
                {location.name}
              </h1>
            </div>
          </div>

          <div style={{ padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
            {/* Header Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 3vw, 2rem)', flexWrap: 'wrap' }}>
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

            {/* Main Content Grid */}
            <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', marginBottom: '3rem' }}>
              <div className="details-main">
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
                  <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', padding: 0, listStyle: 'none' }}>
                    {(location.highlights || []).map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }}></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quick Info Sidebar */}
              <div className="details-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '1.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} color="var(--accent)" /> Best Time
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{location.bestTime || 'Year-round'}</p>
                  </div>
                  <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '1.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} color="var(--accent)" /> Duration
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{location.duration || '2-4 hours'}</p>
                  </div>
                </div>

                <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ImageIcon size={20} color="var(--accent)" />
                    <span style={{ fontWeight: 700 }}>Photo Gallery</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700 }}>View Photos</span>
                </div>

                <button style={{ padding: '1.25rem', borderRadius: '1.25rem', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)' }}>
                  <Heart size={20} fill="white" /> Add to Favorites
                </button>
              </div>
            </div>

            <style>{`
              @media (min-width: 850px) {
                .details-grid { grid-template-columns: 1.6fr 1fr !important; }
              }
            `}</style>

            {/* Map & Weather */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="liquid-glass" style={{ padding: '2rem', borderRadius: '2rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin size={24} color="var(--accent)" /> Location Map
                </h3>
                <div style={{ flex: 1, borderRadius: '1.5rem', overflow: 'hidden', position: 'relative' }}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    src={location.mapCode?.includes('http') ? location.mapCode : `https://maps.google.com/maps?q=${encodeURIComponent(location.mapCode || location.name + ' Sri Lanka')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    style={{ filter: 'grayscale(0.1)' }}
                  ></iframe>
                </div>
              </div>

              <div className="liquid-glass" style={{ padding: '2rem', borderRadius: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CloudSun size={24} color="var(--accent)" /> Weather
                </h3>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.4)', borderRadius: '1.5rem' }}>
                    <div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Current</p>
                      <p style={{ fontSize: '2.5rem', fontWeight: 900 }}>{weather.temp}</p>
                      <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)' }}>{weather.condition}</p>
                    </div>
                    <CloudSun size={50} color="var(--accent)" />
                  </div>
                  
                  <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.4)', borderRadius: '1.5rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '1rem' }}>Outlook</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', overflowX: 'auto', paddingBottom: '0.5rem', gap: '1rem' }}>
                      {(weather.forecast.length > 0 ? weather.forecast : [...Array(5)]).slice(0, 5).map((item, i) => (
                        <div key={i} style={{ textAlign: 'center', minWidth: '45px' }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>{item?.day || '-'}</p>
                          {item?.code <= 3 ? <CloudSun size={18} color="var(--accent)" /> : <CloudRain size={18} color="var(--accent)" />}
                          <p style={{ fontSize: '0.8rem', fontWeight: 800, marginTop: '0.4rem' }}>{item?.temp ? item.temp + '°' : '--'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div style={{ paddingTop: '4rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Star size={28} color="var(--accent)" /> Reviews
                </h2>
                <div className="liquid-glass" style={{ padding: '0.5rem 1.25rem', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                  {location.views || 0} Views
                </div>
              </div>

              <div style={{ display: 'grid', gap: '2rem' }}>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const user = e.target.user.value;
                    const comment = e.target.comment.value;
                    try {
                      const response = await fetch(`${API_BASE_URL}/api/locations/${location.id}/reviews`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user, rating: selectedRating, comment })
                      });
                      if (response.ok) {
                        alert('Review posted!');
                        setSelectedRating(5);
                        fetchLocationDetails();
                        e.target.reset();
                      }
                    } catch (error) { console.error(error); }
                  }}
                  className="liquid-glass" 
                  style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)', borderRadius: '2rem' }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem' }}>Leave a Review</h3>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={28} 
                          onClick={() => setSelectedRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          fill={(hoverRating || selectedRating) >= star ? "var(--accent)" : "none"}
                          color={(hoverRating || selectedRating) >= star ? "var(--accent)" : "rgba(0,0,0,0.2)"}
                          style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                    <input name="user" required placeholder="Your Name" style={{ width: '100%', padding: '0.8rem 1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(255,255,255,0.5)', outline: 'none' }} />
                    <textarea name="comment" required placeholder="Share your experience..." style={{ width: '100%', minHeight: '100px', padding: '0.8rem 1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(255,255,255,0.5)', outline: 'none' }} />
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '1rem', borderRadius: '9999px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 800, cursor: 'pointer' }}>Post Review</button>
                </form>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {(location.reviews || []).map((review, idx) => (
                    <motion.div 
                      key={idx}
                      className="liquid-glass" 
                      style={{ padding: '1.5rem', borderRadius: '1.5rem' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h4 style={{ fontWeight: 800 }}>{review.user}</h4>
                        <div style={{ display: 'flex' }}>
                          {[...Array(review.rating || 5)].map((_, i) => <Star key={i} size={14} fill="var(--accent)" color="var(--accent)" />)}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LocationDetails;

