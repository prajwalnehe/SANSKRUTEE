import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const headerWrapRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (headerWrapRef.current) {
        setHeaderHeight(headerWrapRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="flex flex-col min-h-screen" style={{ '--app-header-height': `${headerHeight}px` }}>
      {/* Navbar and Header - Fixed at top */}
      <div ref={headerWrapRef} className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div>
          <Navbar />
        </div>
        <div className="h-px bg-black/10" aria-hidden="true" />
        <Header />
      </div>

      {/* Spacer equal to header height to avoid overlap */}
      <div aria-hidden="true" style={{ height: headerHeight }} className="bg-white border-b border-gray-300" />

      {/* Main Content Area with responsive padding */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
