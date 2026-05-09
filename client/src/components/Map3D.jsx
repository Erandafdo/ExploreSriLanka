import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sriLankaMap from '@svg-maps/sri-lanka';
import { motion, AnimatePresence } from 'framer-motion';



const Map3D = () => {
  const navigate = useNavigate();
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const handleDistrictClick = (districtId) => {
    navigate(`/district/${districtId}`);
  };

  return (
    <div className="map-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Title placeholder at the top */}
      <div style={{ height: '50px', marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          {hoveredDistrict ? (
            <motion.div
              key={hoveredDistrict}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="liquid-glass"
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: 'var(--text-primary)',
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)'
              }}
            >
              {hoveredDistrict}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              style={{
                padding: '0.75rem 2rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}
            >
              Hover over a district
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={sriLankaMap.viewBox}
        className="map-svg"
      >
        {/* District Paths */}
        {sriLankaMap.locations.map((location) => {
          const isHovered = hoveredDistrict === location.name;

          return (
            <motion.g 
              key={location.id} 
              className="district-group"
              onClick={() => handleDistrictClick(location.id)}
              onMouseEnter={() => setHoveredDistrict(location.name)}
              onMouseLeave={() => setHoveredDistrict(null)}
              whileHover={{ scale: 1.02 }}
            >
              <path
                id={location.id}
                name={location.name}
                d={location.path}
                className="district-path"
                style={{
                  fill: isHovered ? 'var(--map-hover)' : 'var(--map-fill)',
                  stroke: isHovered ? '#fff' : 'var(--map-stroke)',
                  strokeWidth: isHovered ? 3 : 1.5,
                  transition: 'fill 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease'
                }}
              />
            </motion.g>
          );
        })}


      </svg>
    </div>
  );
};

export default Map3D;
