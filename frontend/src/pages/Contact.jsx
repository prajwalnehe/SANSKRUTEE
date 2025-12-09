const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-light tracking-widest mb-6 text-gray-900">
            CONTACT US
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 italic">We'd love to hear from you</p>
        </div>

        {/* Contact Information */}
        <div className="max-w-2xl mx-auto">
          <div>
            <h2 className="text-3xl font-light tracking-wider mb-8 text-gray-900 text-center">
              GET IN TOUCH
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
              Have a question about our sarees or need assistance with your order? We're here to help! Reach out to us and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="flex items-start space-x-4 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl text-amber-600">📧</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-700">
                  <a href="mailto:info@paridhaan.com" className="hover:text-amber-600 transition-colors">
                    info@paridhaan.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <a href="mailto:support@paridhaan.com" className="hover:text-amber-600 transition-colors">
                    support@paridhaan.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl text-amber-600">📞</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-700">+91 98765 43210</p>
                <p className="text-gray-700">+91 98765 43211</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
