import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

const AdminLogoSettings = () => {
  const [navbarLogo, setNavbarLogo] = useState('');
  const [footerLogo, setFooterLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.admin.getLogo();
      setNavbarLogo(data.navbarLogo || '');
      setFooterLogo(data.footerLogo || '');
    } catch (e) {
      console.error('Failed to load logos:', e);
      setError('Failed to load logo settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!navbarLogo.trim() && !footerLogo.trim()) {
      setError('At least one logo URL is required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await api.admin.updateLogo({ navbarLogo, footerLogo });
      
      setSuccess('Logos updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.message || 'Failed to update logos');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = (type) => {
    const url = type === 'navbar' ? navbarLogo : footerLogo;
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
        <div className="px-4 py-3 border-b font-semibold">Manage Logos</div>
        
        <div className="p-4 space-y-6">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <>
              {/* Navbar Logo Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Navbar Logo URL
                  </label>
                  <input
                    type="text"
                    value={navbarLogo}
                    onChange={(e) => setNavbarLogo(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter navbar logo URL (e.g., Cloudinary URL)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This logo appears in the navigation bar at the top of the website.
                  </p>
                </div>
                
                {navbarLogo && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={navbarLogo} 
                        alt="Navbar Logo Preview" 
                        className="h-16 max-w-xs object-contain border rounded bg-white p-2"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div className="hidden text-red-500 text-sm">Failed to load image</div>
                      <button
                        onClick={() => handlePreview('navbar')}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Open in New Tab
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Logo Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Logo URL
                  </label>
                  <input
                    type="text"
                    value={footerLogo}
                    onChange={(e) => setFooterLogo(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter footer logo URL (e.g., Cloudinary URL)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This logo appears in the footer at the bottom of the website.
                  </p>
                </div>
                
                {footerLogo && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={footerLogo} 
                        alt="Footer Logo Preview" 
                        className="h-24 max-w-xs object-contain border rounded bg-white p-2"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div className="hidden text-red-500 text-sm">Failed to load image</div>
                      <button
                        onClick={() => handlePreview('footer')}
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
                  disabled={saving || (!navbarLogo.trim() && !footerLogo.trim())}
                  className={`px-6 py-2 rounded-lg text-white font-medium ${
                    saving || (!navbarLogo.trim() && !footerLogo.trim())
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  {saving ? 'Saving...' : 'Save Logos'}
                </button>
                <button
                  onClick={loadLogos}
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

export default AdminLogoSettings;





