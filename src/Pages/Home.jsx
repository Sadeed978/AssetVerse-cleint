import React from 'react';
import Banner from '../Component/Banner';
import AboutSection from '../Component/AboutSection';

const Home = () => {
    return (
        <div>
            <div>
                <Banner></Banner> 
            </div>
            <div>
                <AboutSection></AboutSection>
            </div>
            
        </div>
    );
};

export default Home;