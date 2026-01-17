import React from 'react';

const AboutUs = () => {
  return (
    <div className=" bg-gray-100 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6">
          About AssetVerse
        </h1>

        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
          AssetVerse is a smart asset management platform designed to simplify
          how companies manage assets, employees, and requests in one unified system.
        </p>

        {/* Sections */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To help organizations track, manage, and optimize asset usage
              with transparency and efficiency.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">What We Do</h3>
            <p className="text-gray-600">
              We provide a digital platform where HRs and employees can manage
              assets, requests, approvals, and analytics seamlessly.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Why AssetVerse</h3>
            <p className="text-gray-600">
              Simple UI, real-time data, role-based dashboards, and scalable
              architecture built for modern organizations.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AboutUs;
