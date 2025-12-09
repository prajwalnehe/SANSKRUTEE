import React from 'react';
import { Link } from 'react-router-dom';
import MobileBottomNav from '../components/MobileBottomNav';
import HeroSlider from '../components/HeroSlider';

// Import new components you'd need to create for a full landing page
import FeaturedProducts from '../components/FeaturedProducts'; 
import CategoryShowcase from '../components/CategoryShowcase';

const Home = () => {
  return (
    // Added a container with padding for visual balance
    <div className="min-h-screen pt-0 pb-16 md:pb-0 mt-0 bg-gray-50">
      
      {/* 1. Hero Slider/Banner - Primary Visual & CTA */}
      <HeroSlider
        slides={[
          {
            desktop: "https://res.cloudinary.com/duc9svg7w/image/upload/v1765128846/pants_gm97ca.svg",
            alt: 'TickNTrack - Premium Shoes & Watches Collection',
          },
          {
            desktop: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1765128866/White_Black_Sneakers_Landscape_Banner_2048_x_594_px_kn5az8.svg',
            alt: 'Festive Offer - TickNTrack',
          },
        ]}
        mobileSrc="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765129835/a705c12f-57b9-4b1f-95ef-219c47ab2653_vrzdjh.png"
      />
      
      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* 2. Category Showcase - Quick navigation to key product lines */}
        <section className="py-12">
          {/* This component would show icons or small images for Shoes, Watches, Apparel, etc. */}
          <CategoryShowcase /> 
        </section>

        <hr className="my-8 border-gray-200" />
        
        {/* 3. Featured Products - Show best-sellers or new arrivals */}
        {/* Heading with Background Image */}
        <section className="relative overflow-hidden min-h-[200px] flex items-center justify-center mb-8">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765278454/d7f7bc7e40cb08bd48d793ad252e7bd4_ylj7po.jpg)'
            }}
          />
          
          {/* Heading with relative positioning */}
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Top Picks & New Arrivals</h2>
            <Link
              to="/shop"
              className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              EXPLORE ALL LOOKS
            </Link>
          </div>
        </section>
        
        {/* Products Section without background */}
        <section className="py-6">
          <FeaturedProducts category="shirts" /> 
        </section>

        {/* Banner Image */}
        <section className="py-8">
          <div className="w-full relative">
            <img 
              src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765280382/unnamed_x1e9mo.jpg"
              alt="Special Offer Banner"
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
            {/* Overlay Content - Left Aligned */}
            <div className="absolute left-8 md:left-50 top-1/2 -translate-y-1/2 z-10">
              <p className="text-lg md:text-xl text-white mb-2">
                Don't Miss Out!
              </p>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 uppercase">
                PERFUMES
              </h3>
              <p className="text-lg md:text-xl text-white mb-6">
                at cost price
              </p>
              <Link
                to="/category/accessories"
                className="inline-block bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-sm md:text-base uppercase tracking-wide hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        </section>

        {/* Perfumes Products Section */}
        <section className="py-6">
          <FeaturedProducts category="accessories" /> 
        </section>

        {/* You could add more sections here like Testimonials, Instagram Feed, or Brand Story */}
        
      </main>

      {/* 5. Mobile Bottom Navigation - Kept at the bottom for mobile UX */}
      <MobileBottomNav />
    </div>
  );
};

export default Home;   