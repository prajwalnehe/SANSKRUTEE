const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-light tracking-widest mb-6 text-gray-900">
            ABOUT US
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 italic">Weaving Traditions, Draping Dreams</p>
        </div>

        {/* Our Story Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At SANSKRUTEE, we celebrate the timeless grace of Indian women through the nine yards of elegance — the saree. Our name reflects what we stand for — a world of sarees that unites the diverse weaves, colors, and stories of India under one roof.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From the looms of Banaras to the threads of Kanchipuram, from Bengal's soft cottons to Gujarat's vibrant Patolas — every saree in our collection carries a piece of tradition, culture, and craftsmanship. Each drape is not just a fabric, but a story woven with love, skill, and heritage.
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="max-w-3xl mx-auto mb-20 text-center bg-gradient-to-br from-amber-50 to-white border-2 border-amber-100 rounded-lg p-12 shadow-lg">
          <h2 className="text-3xl font-light tracking-wider mb-6 text-gray-900">
            OUR VISION
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            To revive, preserve, and promote India's rich handloom heritage while blending it with contemporary elegance. SANSKRUTEE strives to make traditional artistry accessible to every woman who believes in grace with authenticity.
          </p>
        </div>

        {/* What Makes Us Special */}
        <div className="mb-20">
          <h2 className="text-3xl font-light tracking-wider mb-12 text-gray-900 text-center">
            WHAT MAKES SANSKRUTEE SPECIAL?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="flex items-start space-x-4 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl text-amber-600">🧵</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentic Handloom Sarees</h3>
                <p className="text-gray-700 leading-relaxed">
                  We collaborate directly with skilled artisans and weavers across India to bring you genuine handwoven masterpieces.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl text-amber-600">✨</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Curated for Every Occasion</h3>
                <p className="text-gray-700 leading-relaxed">
                  Whether you're dressing up for a festive celebration, a wedding, or a simple workday, we have something crafted just for you.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl text-amber-600">🎨</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tradition Meets Modernity</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our designs combine classic patterns with modern aesthetics — perfect for today's confident, independent women.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl text-amber-600">🛍️</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Seamless Shopping Experience</h3>
                <p className="text-gray-700 leading-relaxed">
                  Explore a rich collection from the comfort of your home. With easy returns, secure payments, and reliable delivery — shopping made graceful.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Closing Message */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light tracking-wider mb-8 text-gray-900">
            CELEBRATE EVERY MOMENT WITH SANSKRUTEE
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Be it a Kanjivaram that shines at weddings, a soft linen saree for daytime charm, or a Banarasi that turns every occasion into a celebration — SANSKRUTEE brings you collections that make every woman feel special.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Our sarees aren't just garments — they're a tribute to Indian craftsmanship, a reflection of tradition, and a celebration of you.
          </p>
          <p className="text-xl font-light text-amber-700 italic tracking-wide">
            Discover your story. Drape your tradition. Only at SANSKRUTEE.
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;