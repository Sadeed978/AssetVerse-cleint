import React from 'react';
import Banner from '../Component/Banner';
import AboutSection from '../Component/AboutSection';
import Pacages from '../Component/Pacages';
import Benifits from '../Component/Benifits';
const pacagePromise = fetch('http://localhost:3000/pacages')
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
            <div className='mb-12'>
                <Benifits></Benifits>
            </div>
        </div>
    );
};

export default Home;