import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MobileBottomNav from '../components/MobileBottomNav';
import HeroSlider from '../components/HeroSlider';
import { api } from '../utils/api';

// Import new components you'd need to create for a full landing page
import FeaturedProducts from '../components/FeaturedProducts'; 
import CategoryShowcase from '../components/CategoryShowcase';
import TrendingNow from '../components/TrendingNow';
import CacheConsent from '../components/CacheConsent';

const Home = () => {
  const [heroSliderData, setHeroSliderData] = useState({
    slides: [
          {
            desktop: "https://res.cloudinary.com/duc9svg7w/image/upload/v1765299332/Blue_and_White_Modern_Fashion_Store_Banner_2048_x_594_px_ga4muy.png",
            alt: 'TickNTrack - Premium Shoes & Watches Collection',
          },
          {
            desktop: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1765299330/Bone_Pink_Luxury_Premium_Isolated_Parfum_Banner_Landscape_2048_x_594_px_jqytrt.png',
            alt: 'Festive Offer - TickNTrack',
          },
          {
            desktop: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1765299332/Brown_White_Modern_Fashion_Banner_2048_x_594_px_kfx9s8.png',
            alt: 'Festive Offer - TickNTrack',
          },
          {
            desktop: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1765304356/White_Fashion_Shoes_For_Men_Themes_Facebook_Cover_2048_x_594_px_ihwivu.png',
            alt: 'Festive Offer - TickNTrack',
          },
    ],
    mobileSrc: "https://res.cloudinary.com/duc9svg7w/image/upload/v1765299343/Brown_Minimalist_Lifestyle_Fashion_Instagram_Post_1080_x_1080_px_yi1bzg.png"
  });

  useEffect(() => {
    const loadHeroSlider = async () => {
      try {
        const data = await api.getHeroSlider();
        if (data && data.slides && data.slides.length > 0) {
          setHeroSliderData({
            slides: data.slides,
            mobileSrc: data.mobileSrc || data.slides[0]?.desktop || ''
          });
        }
      } catch (err) {
        console.error('Failed to load hero slider:', err);
        // Keep default banners on error
      }
    };
    loadHeroSlider();
  }, []);


  return (
    // Added a container with padding for visual balance
    <div className="min-h-screen pt-0 pb-16 md:pb-0 mt-0 bg-gray-50">
      
      {/* 1. Hero Slider/Banner - Primary Visual & CTA */}
      <HeroSlider
        slides={heroSliderData.slides}
        mobileSrc={heroSliderData.mobileSrc}
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
          <FeaturedProducts category="" layout="grid" /> 
        </section>

        {/* Banner Image */}
        <section className="py-8">
          <div className="w-full relative">
            <img 
              src="https://res.cloudinary.com/duc9svg7w/image/upload/v1765303741/Minimalist_Elegant_New_Perfume_Collection_Facebook_Ad_nqbrm8.png"
              alt="Special Offer Banner"
              className="w-full h-auto object-cover rounded-lg shadow-md"
              style={{ maxHeight: '350px', objectFit: 'cover' }}
            />
          </div>
        </section>

        {/* Perfumes Products Section */}
        <section className="py-6">
          <FeaturedProducts category="perfumes" layout="grid" /> 
          {/* Explore New Perfumes Button */}
          <div className="flex justify-center mt-8 mb-4">
            <Link
              to="/category/perfumes"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold text-sm md:text-base uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              EXPLORE NEW PERFUMES
            </Link>
          </div>
        </section>

        {/* New Perfumes Banner Section */}
        <section className="py-8">
          <div className="w-full relative">
            <img 
              src="https://res.cloudinary.com/duc9svg7w/image/upload/v1765304673/White_and_Black_Minimalist_Shoes_For_Men_Facebook_Cover_opdueo.png"
              alt="Perfumes Banner"
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
        </section>

        {/* Shoes Products Section */}
        <section className="py-6">
          <FeaturedProducts category="Shoes" layout="grid" /> 
          {/* Explore More Button */}
          <div className="flex justify-center mt-8 mb-4">
            <Link
              to="/category/shoes"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold text-sm md:text-base uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore more shoes
            </Link>
          </div>
        </section>

        {/* You could add more sections here like Testimonials, Instagram Feed, or Brand Story */}
        
      </main>

      {/* Trending Now Section */}
      <TrendingNow />

      {/* 5. Mobile Bottom Navigation - Kept at the bottom for mobile UX */}
      <MobileBottomNav />

      {/* Cache Consent Banner - Shows only once */}
      <CacheConsent />
    </div>
  );
};

export default Home;   