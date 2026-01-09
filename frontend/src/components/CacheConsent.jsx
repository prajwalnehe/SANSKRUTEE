import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaDatabase } from 'react-icons/fa';
import { shouldShowPermissionDialog, setCachePermission } from '../utils/cache';

const CacheConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we should show the banner
    if (shouldShowPermissionDialog()) {
      // Show after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCachePermission('accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    setCachePermission('rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl animate-slide-up">
      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Icon and Content */}
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaDatabase className="text-blue-600 text-lg" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                Enable Cache for Faster Loading?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We can store product data locally to make your browsing experience faster. 
                Your data stays on your device and helps reduce server load.
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleAccept}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 shadow-sm min-w-[120px]"
            >
              <FaCheck className="text-sm" />
              <span>Accept</span>
            </button>
            <button
              onClick={handleReject}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 min-w-[120px]"
            >
              <FaTimes className="text-sm" />
              <span>Reject</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CacheConsent;
