import React from 'react';
import { Link, useNavigate } from 'react-router';
import Banner from '../Component/Banner';
import AboutSection from '../Component/AboutSection';
import Pacages from '../Component/Pacages';
import Benifits from '../Component/Benifits';
import Contact from '../Component/ExtraPart/Contact';
import AboutUs from './Aboutus';
import FAQSection from '../Component/ExtraPart/Faq2';

const pacagePromise = fetch('https://asset-verse-server-phi.vercel.app/pacages')
    .then(res => res.json());

const CATEGORY_ROUTES = {
    Electronics: '/Dashboard/RequestAsset',
    Furniture: '/Dashboard/RequestAsset',
    'Office Tools': '/Dashboard/RequestAsset',
    TELIVISION: '/Dashboard/RequestAsset',
    Resources: '/Dashboard/RequestAsset',
};

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-base-100">
            {/* Banner */}
            <Banner />

            {/* About / Key Features */}
            <div className="bg-base-100">
                <AboutSection />
            </div>

            {/* Packages */}
            <div className="bg-base-200">
                <Pacages pacagePromise={pacagePromise} />
            </div>

            {/* Stats */}
            <div className="bg-base-200 py-12 px-4 text-center">
                <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 w-full max-w-4xl mx-auto">
                    <div className="stat">
                        <div className="stat-title text-xl text-primary">Trust AssetVerse</div>
                        <div className="stat-value">100+</div>
                        <div className="stat-desc text-lg">Companies</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title text-xl text-primary">Data Accuracy & System Reliability</div>
                        <div className="stat-value">99.9%</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title text-xl text-primary">Asset Requests Processed</div>
                        <div className="stat-value">1,200+</div>
                        <div className="stat-desc text-lg">↘︎ 90 (14%)</div>
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-base-100 px-4 my-12">
                <Contact />
            </div>

            {/* About Us */}
            <div className="bg-base-200">
                <AboutUs />
            </div>

            {/* Asset Categories */}
            <section className="bg-base-100 py-16 max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10">Asset Categories</h2>
                <div className="grid md:grid-cols-5 gap-4">
                    {["Electronics", "Furniture", "Office Tools", "TELIVISION", "Resources"].map(
                        (cat, i) => (
                            <Link
                                key={i}
                                to={CATEGORY_ROUTES[cat]}
                                className="bg-base-200 p-4 rounded shadow text-center hover:bg-base-300 hover:shadow-md transition duration-200 cursor-pointer font-medium text-base-content"
                            >
                                {cat}
                            </Link>
                        )
                    )}
                </div>
            </section>

            {/* Why Choose AssetVerse */}
            <section className="bg-base-200 py-16">
                <h2 className="text-3xl font-bold text-center mb-10">
                    Why Choose AssetVerse
                </h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                    {[
                        "Simple & Intuitive UI",
                        "Real-time Insights",
                        "Scalable System",
                    ].map((item, i) => (
                        <div key={i} className="bg-base-100 p-6 rounded-xl shadow">
                            <h3 className="font-semibold mb-2">{item}</h3>
                            <p className="text-base-content/60">
                                Designed for modern organizations and teams.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-base-100 py-4">
                <FAQSection />
            </section>

            {/* Testimonials */}
            <section className="bg-base-200 py-20">
                <h2 className="text-4xl font-bold text-center mb-12">
                    What People Say About Us
                </h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">

                    <div className="bg-base-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border-t-4 border-blue-500">
                        <p className="text-base-content/70 italic mb-6">
                            "AssetVerse reduced our asset tracking workload drastically. The dashboard
                            gives us instant visibility and control."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                HR
                            </div>
                            <div>
                                <p className="font-semibold">HR Manager</p>
                                <span className="text-sm text-base-content/50 bg-base-200 px-2 py-0.5 rounded">
                                    Human Resources
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-base-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border-t-4 border-green-500">
                        <p className="text-base-content/70 italic mb-6">
                            "Requesting assets is now transparent and fast. I always know the status
                            of my requests without following up."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center font-bold text-success">
                                EM
                            </div>
                            <div>
                                <p className="font-semibold">Employee</p>
                                <span className="text-sm text-base-content/50 bg-base-200 px-2 py-0.5 rounded">
                                    Team Member
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Benefits slider */}
            <div className="bg-base-100 py-12 px-4">
                <Benifits />
            </div>

            {/* Call to Action */}
            <section className="py-16 text-center bg-neutral text-neutral-content">
                <h2 className="text-3xl font-bold mb-4">
                    Ready to Manage Assets Smarter?
                </h2>
                <button
                    onClick={() => navigate('/HRRegister')}
                    className="bg-primary hover:bg-primary/80 active:scale-95 transition duration-200 px-6 py-2 rounded-lg font-semibold text-primary-content"
                >
                    Start Now
                </button>
            </section>
        </div>
    );
};

export default Home;
