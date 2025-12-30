import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

const AdminHeroSlider = () => {
  const [slides, setSlides] = useState([
    { desktop: '', alt: '' }
  ]);
  const [mobileSrc, setMobileSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadHeroSlider();
  }, []);

  const loadHeroSlider = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.admin.getHeroSlider();
      setSlides(data.slides || [{ desktop: '', alt: '' }]);
      setMobileSrc(data.mobileSrc || '');
    } catch (e) {
      console.error('Failed to load hero slider:', e);
      setError('Failed to load hero slider settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlide = () => {
    setSlides([...slides, { desktop: '', alt: '' }]);
  };

  const handleRemoveSlide = (index) => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, i) => i !== index);
      setSlides(newSlides);
    } else {
      setError('At least one slide is required');
    }
  };

  const handleSlideChange = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleSave = async () => {
    // Validate slides
    const validSlides = slides.filter(s => s.desktop.trim());
    if (validSlides.length === 0) {
      setError('At least one slide with a desktop URL is required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await api.admin.updateHeroSlider({ 
        slides: validSlides, 
        mobileSrc: mobileSrc.trim() || validSlides[0]?.desktop || '' 
      });
      
      setSuccess('Hero slider updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reload to get the saved data
      await loadHeroSlider();
    } catch (e) {
      setError(e.message || 'Failed to update hero slider');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white border rounded-xl shadow-sm">
        <div className="px-4 py-3 border-b font-semibold">Manage Hero Slider Banners</div>
        
        <div className="p-4 space-y-6">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <>
              {/* Slides Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Desktop Slides ({slides.length})
                  </label>
                  <button
                    onClick={handleAddSlide}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + Add Slide
                  </button>
                </div>
                
                <div className="space-y-4">
                  {slides.map((slide, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-700">Slide {index + 1}</h3>
                        {slides.length > 1 && (
                          <button
                            onClick={() => handleRemoveSlide(index)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Desktop Image URL
                          </label>
                          <input
                            type="text"
                            value={slide.desktop}
                            onChange={(e) => handleSlideChange(index, 'desktop', e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter desktop banner URL (e.g., Cloudinary URL)"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Alt Text (for accessibility)
                          </label>
                          <input
                            type="text"
                            value={slide.alt}
                            onChange={(e) => handleSlideChange(index, 'alt', e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter alt text for this banner"
                          />
                        </div>
                        
                        {slide.desktop && (
                          <div className="bg-white p-3 rounded-lg border">
                            <p className="text-xs font-medium text-gray-700 mb-2">Preview:</p>
                            <div className="flex items-center gap-4">
                              <img 
                                src={slide.desktop} 
                                alt="Slide Preview" 
                                className="h-32 max-w-md object-contain border rounded bg-white p-2"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const errorDiv = e.target.nextSibling;
                                  if (errorDiv) errorDiv.style.display = 'block';
                                }}
                              />
                              <div className="hidden text-red-500 text-xs">Failed to load image</div>
                              <button
                                onClick={() => handlePreview(slide.desktop)}
                                className="px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Open in New Tab
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Source Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Banner Image URL
                  </label>
                  <input
                    type="text"
                    value={mobileSrc}
                    onChange={(e) => setMobileSrc(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter mobile banner URL (optional - will use first slide if not provided)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This image is shown on mobile devices. If left empty, the first desktop slide will be used.
                  </p>
                </div>
                
                {mobileSrc && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm font-medium text-gray-700 mb-2">Mobile Preview:</p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={mobileSrc} 
                        alt="Mobile Banner Preview" 
                        className="h-32 max-w-xs object-contain border rounded bg-white p-2"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const errorDiv = e.target.nextSibling;
                          if (errorDiv) errorDiv.style.display = 'block';
                        }}
                      />
                      <div className="hidden text-red-500 text-sm">Failed to load image</div>
                      <button
                        onClick={() => handlePreview(mobileSrc)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Open in New Tab
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <button
                  onClick={handleSave}
                  disabled={saving || slides.filter(s => s.desktop.trim()).length === 0}
                  className={`px-6 py-2 rounded-lg text-white font-medium ${
                    saving || slides.filter(s => s.desktop.trim()).length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  {saving ? 'Saving...' : 'Save Hero Slider'}
                </button>
                <button
                  onClick={loadHeroSlider}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeroSlider;





