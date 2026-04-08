import React from 'react';
import MobileBottomNav from '../components/MobileBottomNav';
import HeroSlider from '../components/HeroSlider';

// Import new components you'd need to create for a full landing page
import BestSellers from '../components/BestSellers';
import MensSection from '../components/MensSection';
import WomenSection from '../components/WomenSection';
import CacheConsent from '../components/CacheConsent';

const Home = () => {
  const heroBanner =
    'https://res.cloudinary.com/duc9svg7w/image/upload/v1765299330/Bone_Pink_Luxury_Premium_Isolated_Parfum_Banner_Landscape_2048_x_594_px_jqytrt.png';


  return (
    // Added a container with padding for visual balance
    <div className="min-h-screen pt-0 pb-16 md:pb-0 mt-0 bg-gray-50">
      
      {/* 1. Hero Slider/Banner - Primary Visual & CTA */}
      <HeroSlider
        slides={[{ desktop: heroBanner, alt: 'Arova Perfume Banner' }]}
        mobileSrc={heroBanner}
      />

      <BestSellers />
      <MensSection />
      <WomenSection />
      
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <hr className="my-8 border-gray-200" />
      </main>

      {/* 5. Mobile Bottom Navigation - Kept at the bottom for mobile UX */}
      <MobileBottomNav />

      {/* Cache Consent Banner - Shows only once */}
      <CacheConsent />
    </div>
  );
};

export default Home;   