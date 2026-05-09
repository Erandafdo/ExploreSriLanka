import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Edit, Trash2, Save, X, Image as ImageIcon, MapPin, Clock, Calendar, Info, Star, Upload } from 'lucide-react';
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
        alert(`Error: ${errorData.message || 'Failed to save location'}. ${errorData.error || ''}`);
      }
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Connection error. Please make sure the server is running.');
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
    <div style={{ minHeight: '100vh', padding: '8rem 2rem 4rem', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Settings size={32} color="var(--accent)" /> Admin Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Enhanced CMS: Dropdowns, Uploads & Map Codes</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="liquid-glass" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            <Plus size={20} /> Add New Location
          </button>
        </div>

        <div className="liquid-glass" style={{ borderRadius: '1.5rem', overflow: 'hidden', background: 'white' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(16, 185, 129, 0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <th style={{ padding: '1.5rem', fontWeight: 800 }}>Preview</th>
                <th style={{ padding: '1.5rem', fontWeight: 800 }}>Location Name</th>
                <th style={{ padding: '1.5rem', fontWeight: 800 }}>District</th>
                <th style={{ padding: '1.5rem', fontWeight: 800 }}>Category</th>
                <th style={{ padding: '1.5rem', fontWeight: 800, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ width: '60px', height: '40px', borderRadius: '0.5rem', backgroundImage: `url(${loc.thumbnail || loc.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{ fontWeight: 700 }}>{loc.name}</span>
                  </td>
                  <td style={{ padding: '1.5rem' }}>{loc.district}</td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
                      {loc.category}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
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
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="liquid-glass" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '3rem', background: 'white', borderRadius: '2rem', position: 'relative' }}>
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>

              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2.5rem' }}>{editingLoc ? 'Update Location' : 'New Destination'}</h2>

              <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>LOCATION NAME</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>DISTRICT</label>
                  <select value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none', background: 'white', fontSize: '1rem' }}>
                    {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>CATEGORY</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none', background: 'white', fontSize: '1rem' }}>
                    <option value="Heritage">Heritage</option>
                    <option value="Beach">Beach</option>
                    <option value="Mountain">Mountain</option>
                    <option value="Waterfall">Waterfall</option>
                    <option value="Nature">Nature</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>ABOUT DETAILS</label>
                  <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', minHeight: '120px', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem' }} />
                </div>

                {/* Image Uploads */}
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>MAIN IMAGE</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '60px', borderRadius: '0.75rem', backgroundImage: `url(${formData.image})`, backgroundSize: 'cover', border: '2px solid white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}></div>
                    <label style={{ flex: 1, padding: '0.75rem', background: 'white', border: '2px dashed #cbd5e1', borderRadius: '1rem', cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Upload size={16} /> Upload Image
                      <input type="file" hidden onChange={(e) => handleFileUpload(e, 'image')} />
                    </label>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>THUMBNAIL IMAGE</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '60px', borderRadius: '0.75rem', backgroundImage: `url(${formData.thumbnail})`, backgroundSize: 'cover', border: '2px solid white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}></div>
                    <label style={{ flex: 1, padding: '0.75rem', background: 'white', border: '2px dashed #cbd5e1', borderRadius: '1rem', cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Upload size={16} /> Upload Thumb
                      <input type="file" hidden onChange={(e) => handleFileUpload(e, 'thumbnail')} />
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>BEST TIME</label>
                  <input value={formData.bestTime} onChange={(e) => setFormData({...formData, bestTime: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>DURATION</label>
                  <input value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>MAP CODE (PASTE IFRAME OR SEARCH TERM)</label>
                  <input placeholder="Example: <iframe... src='...'> or just 'Sigiriya Rock'" value={formData.mapCode} onChange={(e) => setFormData({...formData, mapCode: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>HIGHLIGHTS (COMMA SEPARATED)</label>
                  <input placeholder="Ancient Ruins, Panoramic Views, Hiking" value={formData.highlights} onChange={(e) => setFormData({...formData, highlights: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                </div>

                {/* Manage Reviews Section */}
                {editingLoc && (
                  <div style={{ gridColumn: 'span 2', marginTop: '2rem', padding: '2rem', background: '#fff5f5', borderRadius: '1.5rem', border: '1px solid #fed7d7' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem', color: '#c53030', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Star size={20} /> Manage User Reviews
                    </h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {editingLoc.reviews && editingLoc.reviews.length > 0 ? (
                        editingLoc.reviews.map((rev) => (
                          <div key={rev._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <div>
                              <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{rev.user} <span style={{ fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>{new Date(rev.date).toLocaleDateString()}</span></p>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>"{rev.comment}"</p>
                            </div>
                            <button 
                              type="button"
                              onClick={async () => {
                                if (window.confirm('Delete this review?')) {
                                  const res = await fetch(`${API_BASE_URL}/api/locations/${editingLoc.id}/reviews/${rev._id}`, { method: 'DELETE' });
                                  if (res.ok) {
                                    alert('Review removed');
                                    const updated = await res.json();
                                    setEditingLoc(updated);
                                    fetchLocations();
                                  }
                                }
                              }}
                              style={{ background: '#fff5f5', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', color: '#c53030' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No reviews yet.</p>
                      )}
                    </div>
                  </div>
                )}

                <button type="submit" disabled={uploading} style={{ gridColumn: 'span 2', padding: '1.25rem', borderRadius: '1.25rem', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', opacity: uploading ? 0.7 : 1 }}>
                  {uploading ? 'UPLOADING...' : <Save size={22} />}
                  {uploading ? 'Processing Files...' : (editingLoc ? 'UPDATE LOCATION' : 'PUBLISH DESTINATION')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
