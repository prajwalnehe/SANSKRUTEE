import React from 'react';
import MobileBottomNav from '../components/MobileBottomNav';
import HeroSlider from '../components/HeroSlider';
import ShopByGender from '../components/ShopByGender';
import BestSellers from '../components/BestSellers';
import TrendingNow from '../components/TrendingNow';

const Home = () => {
  return (
    <div className="min-h-screen pt-0 pb-16 md:pb-0">
      {/* Hero Slider */}
      <HeroSlider
        slides={[
          {
            desktop: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1763451403/Exclusive_Kurtas_Kurtis_Collection_Where_Tradition_Meets_Modern_Style_1080_x_400_px_2048_x_594_px_lepvuo.svg',
            alt: 'PARIDHAAN - Premium Kurtas & Kurtis',
          },
          {
            desktop: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1763451863/Elegance_Comfort_Style_2048_x_594_px_wqggd6.svg',
            alt: 'Festive Offers - PARIDHAAN',
          },
        ]}
        mobileSrc="https://res.cloudinary.com/duc9svg7w/image/upload/v1763383307/file_0000000032ac7209890b93ba8217ac10_1_nfz2u2.png"
      />

      {/* Best Sellers */}
      <BestSellers />

      {/* Shop By Gender */}
      <ShopByGender />

      {/* Trending Now */}
      <TrendingNow />

      {/* Why Choose Us */}
<section className="py-20 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-5xl font-light tracking-wide text-center mb-4 text-gray-800">
      WHY CHOOSE PARIDHAAN
    </h2>
    <p className="text-xl text-gray-600 text-center mb-16 font-light">
      Discover our exclusive collection of handpicked kurtas and kurtis
    </p>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {[
        { icon: '✨', title: 'Premium Quality', desc: 'Finest fabrics and craftsmanship for all-day comfort' },
        { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999 across India' },
        { icon: '🔄', title: 'Easy Returns', desc: '7-day hassle-free return policy' },
        { icon: '💎', title: '100% Authentic', desc: 'Original designs in kurtas and kurtis' },
      ].map((feature, index) => (
        <div
          key={index}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-amber-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative text-center p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-pink-300 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
            <h3 className="text-2xl font-light text-gray-800 mb-3 tracking-wide">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed font-light">{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Home;
