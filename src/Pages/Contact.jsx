import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6">
          Contact Us
        </h1>

        <p className="text-gray-600 text-center mb-10">
          Have questions, feedback, or need support?  
          We’d love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Get in Touch
            </h3>

            <p className="text-gray-600 mb-2">
              📧 Email: support@assetverse.com
            </p>
            <p className="text-gray-600 mb-2">
              📞 Phone: +880 18XXXXXXXX
            </p>
            <p className="text-gray-600">
              📍 Address: Dhaka, Bangladesh
            </p>
          </div>

          {/* Contact Form */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Contact;
