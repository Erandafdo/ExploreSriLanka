import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Edit, Trash2, Save, X, MapPin, Star, Upload, LogOut } from 'lucide-react';
import API_BASE_URL from '../api';

const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", 
  "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", 
  "Mannar", "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya", 
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

const Admin = () => {
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLoc, setEditingLoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    district: 'Colombo',
    category: 'Heritage',
    rating: '5.0',
    description: '',
    image: '/landscape.png',
    thumbnail: '/landscape.png',
    bestTime: '',
    duration: '',
    highlights: '',
    mapCode: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/locations`);
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setUploading(true);
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: uploadData
      });
      const data = await response.json();
      if (data.url) {
        setFormData({ ...formData, [type]: data.url });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleOpenModal = (loc = null) => {
    if (loc) {
      setEditingLoc(loc);
      setFormData({
        ...loc,
        highlights: Array.isArray(loc.highlights) ? loc.highlights.join(', ') : (loc.highlights || '')
      });
    } else {
      setEditingLoc(null);
      setFormData({
        name: '',
        district: 'Colombo',
        category: 'Heritage',
        rating: '5.0',
        description: '',
        image: '/landscape.png',
        thumbnail: '/landscape.png',
        bestTime: '',
        duration: '',
        highlights: '',
        mapCode: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { reviews, ...otherData } = formData;
    const payload = {
      ...otherData,
      highlights: formData.highlights.split(',').map(h => h.trim()).filter(h => h !== '')
    };

    try {
      const url = editingLoc 
        ? `${API_BASE_URL}/api/locations/${editingLoc.id}`
        : `${API_BASE_URL}/api/locations`;
      
      const method = editingLoc ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Success! Location data has been published to MongoDB Atlas.');
        setShowModal(false);
        fetchLocations();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to save location'}`);
      }
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Connection error. Please check your backend.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/locations/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchLocations();
        }
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: 'clamp(5rem, 10vw, 8rem) 0 4rem', background: '#f8fafc' }}>
      <div className="container">
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Settings size={32} color="var(--accent)" /> Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Manage your destinations and reviews</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: 'max-content' }}>
            <button 
              onClick={() => {
                localStorage.removeItem('adminAuthenticated');
                window.location.href = '/login';
              }}
              className="liquid-glass" 
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '1rem', background: 'white', color: 'var(--text-secondary)', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              <LogOut size={18} /> <span className="hide-mobile">Logout</span>
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="liquid-glass" 
              style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '1rem', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)' }}
            >
              <Plus size={20} /> Add <span className="hide-mobile">Location</span>
            </button>
          </div>
        </div>

        {/* Content Section: Table for Desktop, Cards for Mobile */}
        <div className="admin-content-view">
          {/* Desktop Table View */}
          <div className="desktop-only-table liquid-glass" style={{ borderRadius: '1.5rem', overflow: 'hidden', background: 'white' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(16, 185, 129, 0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <th style={{ padding: '1.25rem', fontWeight: 800 }}>Preview</th>
                  <th style={{ padding: '1.25rem', fontWeight: 800 }}>Name</th>
                  <th style={{ padding: '1.25rem', fontWeight: 800 }}>District</th>
                  <th style={{ padding: '1.25rem', fontWeight: 800 }}>Category</th>
                  <th style={{ padding: '1.25rem', fontWeight: 800, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ width: '50px', height: '35px', borderRadius: '0.4rem', backgroundImage: `url(${loc.thumbnail || loc.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <span style={{ fontWeight: 700 }}>{loc.name}</span>
                    </td>
                    <td style={{ padding: '1.25rem' }}>{loc.district}</td>
                    <td style={{ padding: '1.25rem' }}>
                      <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
                        {loc.category}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleOpenModal(loc)} style={{ background: 'rgba(16, 185, 129, 0.1)', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
                          <Edit size={18} color="var(--accent)" />
                        </button>
                        <button onClick={() => handleDelete(loc.id)} style={{ background: 'rgba(239, 68, 68, 0.05)', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
                          <Trash2 size={18} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-only-cards" style={{ gap: '1rem' }}>
            {locations.map((loc) => (
              <div key={loc.id} className="liquid-glass" style={{ background: 'white', padding: '1.25rem', borderRadius: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '60px', borderRadius: '0.75rem', backgroundImage: `url(${loc.thumbnail || loc.image})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }}></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{loc.district} • {loc.category}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenModal(loc)} style={{ background: 'rgba(16, 185, 129, 0.1)', border: 'none', padding: '0.6rem', borderRadius: '0.75rem' }}>
                    <Edit size={18} color="var(--accent)" />
                  </button>
                  <button onClick={() => handleDelete(loc.id)} style={{ background: 'rgba(239, 68, 68, 0.05)', border: 'none', padding: '0.6rem', borderRadius: '0.75rem' }}>
                    <Trash2 size={18} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              className="liquid-glass admin-modal"
              style={{ 
                width: '100%', 
                maxWidth: '800px', 
                maxHeight: '92vh', 
                overflowY: 'auto', 
                padding: '1.5rem', 
                background: 'white', 
                borderTopLeftRadius: '2.5rem', 
                borderTopRightRadius: '2.5rem', 
                position: 'relative' 
              }}
            >
              <div style={{ width: '40px', height: '5px', background: '#e2e8f0', borderRadius: '99px', margin: '0 auto 1.5rem' }}></div>
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.05)', border: 'none', padding: '0.5rem', borderRadius: '9999px', cursor: 'pointer' }}>
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>{editingLoc ? 'Edit Destination' : 'New Destination'}</h2>

              <form onSubmit={handleSave} className="admin-form" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                <div>
                  <label className="admin-label">NAME</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="admin-input" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label className="admin-label">DISTRICT</label>
                    <select value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="admin-input">
                      {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">CATEGORY</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="admin-input">
                      <option value="Heritage">Heritage</option>
                      <option value="Beach">Beach</option>
                      <option value="Mountain">Mountain</option>
                      <option value="Waterfall">Waterfall</option>
                      <option value="Nature">Nature</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="admin-label">DESCRIPTION</label>
                  <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="admin-input" style={{ minHeight: '100px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '1.25rem' }}>
                    <label className="admin-label">MAIN IMAGE</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '45px', borderRadius: '0.5rem', backgroundImage: `url(${formData.image})`, backgroundSize: 'cover', border: '1px solid white' }}></div>
                      <label className="admin-upload-btn">
                        <Upload size={14} /> Upload
                        <input type="file" hidden onChange={(e) => handleFileUpload(e, 'image')} />
                      </label>
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '1.25rem' }}>
                    <label className="admin-label">THUMBNAIL</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '45px', borderRadius: '0.5rem', backgroundImage: `url(${formData.thumbnail})`, backgroundSize: 'cover', border: '1px solid white' }}></div>
                      <label className="admin-upload-btn">
                        <Upload size={14} /> Upload
                        <input type="file" hidden onChange={(e) => handleFileUpload(e, 'thumbnail')} />
                      </label>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label className="admin-label">BEST TIME</label>
                    <input value={formData.bestTime} onChange={(e) => setFormData({...formData, bestTime: e.target.value})} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">DURATION</label>
                    <input value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="admin-input" />
                  </div>
                </div>

                <div>
                  <label className="admin-label">MAP SRC / SEARCH</label>
                  <input value={formData.mapCode} onChange={(e) => setFormData({...formData, mapCode: e.target.value})} className="admin-input" />
                </div>

                <div>
                  <label className="admin-label">HIGHLIGHTS</label>
                  <input placeholder="Comma separated..." value={formData.highlights} onChange={(e) => setFormData({...formData, highlights: e.target.value})} className="admin-input" />
                </div>

                {editingLoc && (
                  <div style={{ marginTop: '0.5rem', padding: '1.25rem', background: '#fff5f5', borderRadius: '1.25rem', border: '1px solid #fed7d7' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: '1rem', color: '#c53030', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Star size={16} /> User Reviews ({editingLoc.reviews?.length || 0})
                    </h3>
                    <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '150px', overflowY: 'auto' }}>
                      {editingLoc.reviews?.map((rev) => (
                        <div key={rev._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '0.75rem', borderRadius: '0.75rem' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 800, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rev.user}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rev.comment}</p>
                          </div>
                          <button 
                            type="button"
                            onClick={async () => {
                              if (window.confirm('Delete this review?')) {
                                const res = await fetch(`${API_BASE_URL}/api/locations/${editingLoc.id}/reviews/${rev._id}`, { method: 'DELETE' });
                                if (res.ok) {
                                  const updated = await res.json();
                                  setEditingLoc(updated);
                                  fetchLocations();
                                }
                              }
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c53030', padding: '0.5rem' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" disabled={uploading} style={{ padding: '1.1rem', borderRadius: '1.25rem', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem', marginBottom: '2rem' }}>
                  {uploading ? 'Processing...' : (editingLoc ? 'Update Destination' : 'Publish Destination')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .admin-label { display: block; fontWeight: 800; marginBottom: 0.5rem; fontSize: 0.75rem; color: var(--text-secondary); letterSpacing: 0.05em; }
        .admin-input { width: 100%; padding: 0.9rem 1rem; borderRadius: 0.9rem; border: 1px solid #e2e8f0; outline: none; fontSize: 1rem; background: white; }
        .admin-upload-btn { flex: 1; padding: 0.6rem; background: white; border: 1px dashed #cbd5e1; borderRadius: 0.75rem; cursor: pointer; textAlign: center; fontSize: 0.75rem; fontWeight: 700; display: flex; alignItems: center; justifyContent: center; gap: 0.3rem; }
        
        .desktop-only-table { display: block; }
        .mobile-only-cards { display: none; }
        .hide-mobile { display: inline; }

        @media (max-width: 768px) {
          .desktop-only-table { display: none; }
          .mobile-only-cards { display: grid; }
          .hide-mobile { display: none; }
          .admin-modal { border-radius: 2rem 2rem 0 0 !important; }
        }

        @media (min-width: 650px) {
          .admin-form { grid-template-columns: 1fr 1fr !important; }
          .admin-modal { border-radius: 2rem !important; margin: 2rem !important; align-self: center !important; }
        }
      `}</style>
    </div>
  );

};

export default Admin;

