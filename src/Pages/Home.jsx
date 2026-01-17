import React from 'react';
import Banner from '../Component/Banner';
import AboutSection from '../Component/AboutSection';
import Pacages from '../Component/Pacages';
import Benifits from '../Component/Benifits';
import Contact from '../Component/ExtraPart/Contact';
import AboutUs from './Aboutus';
import FAQSection from '../Component/ExtraPart/Faq2';
const pacagePromise = fetch('https://asset-verse-server-phi.vercel.app/pacages')
    .then(res => res.json())
const Home = () => {

    return (
        <div>
            <div>
                <Banner></Banner>
            </div>
            <div>
                <AboutSection></AboutSection>
            </div>
            <div >
                <Pacages pacagePromise={pacagePromise}></Pacages>
            </div>
            <div className='my-12 px-4 gap-4 text-center bg-blue-50 py-12'>
                <div className="stats stats-vertical lg:stats-horizontal shadow">
                    <div className="stat">
                        <div className="text-2xl text-blue-400 stat-title">Trust AssetVerse</div>
                        <div className="stat-value">100+</div>
                        <div className="text-2xl stat-desc">Companies </div>
                    </div>

                    <div className="stat">
                        <div className="stat-title text-2xl text-blue-400">Data Accuracy & System Reliability</div>
                        <div className="stat-value text-3xl">99.9%</div>

                    </div>

                    <div className="stat">
                        <div className="stat-title text-2xl text-blue-400">Asset Requests Processed</div>
                        <div className="stat-value text-3xl">1,200+</div>
                        <div className="stat-desc text-2xl">↘︎ 90 (14%)</div>
                    </div>
                </div>
            </div>

            <div className='px-4 my-12'>
                <Contact></Contact>
            </div>
            <div>
                <AboutUs></AboutUs>
            </div>
            <div className='p-4'>
                <section className="py-16 max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Asset Categories</h2>
                    <div className="grid md:grid-cols-5 gap-4">
                        {["Electronics", "Furniture", "Office Tools", "TELIVISION", "Resources"].map(
                            (cat, i) => (
                                <div key={i} className="bg-white p-4 rounded shadow text-center">
                                    {cat}
                                </div>
                            )
                        )}
                    </div>
                </section>
                <section className="bg-blue-50 py-16">
                    <h2 className="text-3xl font-bold text-center mb-10">
                        Why Choose AssetVerse
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                        {[
                            "Simple & Intuitive UI",
                            "Real-time Insights",
                            "Scalable System",
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow">
                                <h3 className="font-semibold mb-2">{item}</h3>
                                <p className="text-gray-600">
                                    Designed for modern organizations and teams.
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                {/* 9️⃣ FAQ */}
                <section className="bg-white py-16">
                    <FAQSection></FAQSection>
                </section>
                {/* 7️⃣ Testimonials */}
                <section className="bg-gray-50 py-20">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        What People Say About Us
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">

                        {/* Testimonial Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border-t-4 border-blue-500">
                            <p className="text-gray-600 italic mb-6">
                                “AssetVerse reduced our asset tracking workload drastically. The dashboard
                                gives us instant visibility and control.”
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                    HR
                                </div>
                                <div>
                                    <p className="font-semibold">HR Manager</p>
                                    <span className="text-sm text-gray-500 bg-blue-50 px-2 py-0.5 rounded">
                                        Human Resources
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border-t-4 border-green-500">
                            <p className="text-gray-600 italic mb-6">
                                “Requesting assets is now transparent and fast. I always know the status
                                of my requests without following up.”
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                                    EM
                                </div>
                                <div>
                                    <p className="font-semibold">Employee</p>
                                    <span className="text-sm text-gray-500 bg-green-50 px-2 py-0.5 rounded">
                                        Team Member
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
            <div className='mb-12'>
                <Benifits></Benifits>
            </div>
            <div>




                {/* 1️⃣1️⃣ Call to Action */}
                <section className="py-16 text-center bg-gray-900 text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Manage Assets Smarter?
                    </h2>
                    <button className="bg-blue-600 px-6 py-2 rounded-lg font-semibold">
                        Start Now
                    </button>
                </section>

            </div>

        </div>
    );
};

export default Home;