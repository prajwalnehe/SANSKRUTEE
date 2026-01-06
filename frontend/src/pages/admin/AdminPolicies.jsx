import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

const POLICY_TYPES = [
  { value: 'privacy', label: 'Privacy Policy', route: '/privacy' },
  { value: 'terms', label: 'Terms of Service', route: '/terms' },
  { value: 'shipping', label: 'Shipping Policy', route: '/shipping' },
  { value: 'returns', label: 'Return Policy', route: '/returns' },
];

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [selectedType, setSelectedType] = useState('privacy');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPolicies();
  }, []);

  useEffect(() => {
    if (selectedType) {
      loadPolicy(selectedType);
    }
  }, [selectedType]);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getPolicies();
      setPolicies(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load policies:', e);
      setError('Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  const loadPolicy = async (type) => {
    try {
      setError('');
      const data = await api.admin.getPolicy(type);
      setTitle(data.title || '');
      setContent(data.content || '');
    } catch (e) {
      // If policy doesn't exist, use empty defaults
      const policyType = POLICY_TYPES.find(p => p.value === type);
      setTitle(policyType?.label || '');
      setContent('');
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await api.admin.updatePolicy(selectedType, { title, content });
      
      setSuccess('Policy saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reload policies list
      await loadPolicies();
    } catch (e) {
      setError(e.message || 'Failed to save policy');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    const policyType = POLICY_TYPES.find(p => p.value === selectedType);
    if (policyType) {
      window.open(policyType.route, '_blank');
    }
  };

  const selectedPolicy = policies.find(p => p.type === selectedType);

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
        <div className="px-4 py-3 border-b font-semibold">Manage Policies</div>
        
        <div className="p-4 space-y-4">
          {/* Policy Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Policy to Edit
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POLICY_TYPES.map((policy) => (
                <button
                  key={policy.value}
                  onClick={() => setSelectedType(policy.value)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedType === policy.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {policy.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="space-y-4">
              {/* Last Updated Info */}
              {selectedPolicy && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Last updated: {new Date(selectedPolicy.lastUpdated || selectedPolicy.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter policy title"
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Enter policy content (HTML supported)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can use HTML tags for formatting. For line breaks, use &lt;br&gt; or wrap content in &lt;p&gt; tags.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving || !title.trim() || !content.trim()}
                  className={`px-6 py-2 rounded-lg text-white font-medium ${
                    saving || !title.trim() || !content.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  {saving ? 'Saving...' : 'Save Policy'}
                </button>
                <button
                  onClick={handlePreview}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Preview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPolicies;









