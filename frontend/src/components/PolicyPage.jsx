import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { api } from '../utils/api';

const PolicyPage = ({ defaultTitle, defaultContent }) => {
  const { type } = useParams();
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        setLoading(true);
        const data = await api.getPolicy(type);
        if (data && data.title && data.content) {
          setTitle(data.title);
          setContent(data.content);
          setLastUpdated(data.lastUpdated || data.updatedAt);
        }
      } catch (e) {
        // Use default content if API fails
        console.log('Using default policy content');
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      loadPolicy();
    } else {
      setLoading(false);
    }
  }, [type]);

  // Render content as HTML if it contains HTML tags, otherwise as plain text
  const renderContent = () => {
    if (!content) return null;
    
    // Check if content contains HTML tags
    const hasHtml = /<[^>]+>/.test(content);
    
    if (hasHtml) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    } else {
      // Split by newlines and render as paragraphs
      return content.split('\n').map((paragraph, idx) => {
        if (!paragraph.trim()) return <br key={idx} />;
        return <p key={idx} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;









