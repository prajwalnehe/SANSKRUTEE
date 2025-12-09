import React from 'react';

const CallToActionBanner = () => {
  return (
    <section className="relative py-20 md:py-24 text-white overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016042?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-purple-900/70 to-black/80" />
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge/Offer Tag */}
          <div className="inline-block mb-4 px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-full shadow-lg">
            🎉 LIMITED TIME OFFER
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 drop-shadow-lg leading-tight">
            Get 20% Off Your First Order!
          </h2>
          <p className="text-lg md:text-xl opacity-95 leading-relaxed mb-10 max-w-2xl mx-auto">
            Subscribe to our newsletter and get exclusive deals, style tips, and more delivered straight to your inbox.
          </p>

          <form 
            className="flex flex-col sm:flex-row gap-3 items-stretch justify-center max-w-xl mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission here
            }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-1 rounded-lg px-5 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent text-base shadow-lg"
            />
            <button
              type="submit"
              className="rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 font-bold text-base transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Subscribe Now
            </button>
          </form>

          <span className="block mt-6 opacity-90 text-sm">
            🔒 We respect your privacy. Unsubscribe at any time.
          </span>
        </div>
      </div>
    </section>
  );
};

export default CallToActionBanner;
