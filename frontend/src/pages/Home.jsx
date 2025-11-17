import React from 'react';
import Collections from '../components/Collections';
import MobileBottomNav from '../components/MobileBottomNav';
import HeroSlider from '../components/HeroSlider';
import ShopByGender from '../components/ShopByGender';

const Home = () => {
  return (
    <div className="min-h-screen pt-0 pb-16 md:pb-0">
      {/* Hero Slider */}
      <HeroSlider
        slides={[
          {
            desktop: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761978463/Effortlessly_smoothen_every_fabric_20251101_014257_0000_pmkwyh.png',
            alt: 'SareeSansaar - Premium Saree Collection',
          },
          {
            desktop: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1762255943/Green_and_Gold_Traditional_Fashion_Sale_Presentation_20251101_013751_0000_jy3n3g.png',
            alt: 'Festive Offer - SareeSansaar',
          },
        ]}
        mobileSrc="https://res.cloudinary.com/duc9svg7w/image/upload/v1763383307/file_0000000032ac7209890b93ba8217ac10_1_nfz2u2.png"
      />

      {/* Shop By Gender */}
      <ShopByGender />

      {/* Featured Collections */}
      <Collections />

      {/* Why Choose Us */}
<section className="py-20 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-5xl font-light tracking-wide text-center mb-4 text-gray-800">
      WHY CHOOSE SAREESANSAAR
    </h2>
    <p className="text-xl text-gray-600 text-center mb-16 font-light">
      Discover our exclusive collection of handpicked sarees
    </p>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {[
        { icon: '✨', title: 'Premium Quality', desc: 'Handpicked finest fabrics from master weavers' },
        { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999 across India' },
        { icon: '🔄', title: 'Easy Returns', desc: '7-day hassle-free return policy' },
        { icon: '💎', title: '100% Authentic', desc: 'Certified genuine handloom products' },
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
