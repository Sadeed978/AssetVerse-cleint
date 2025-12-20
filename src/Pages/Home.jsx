import React from 'react';
import Banner from '../Component/Banner';
import AboutSection from '../Component/AboutSection';
import Pacages from '../Component/Pacages';
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
            <div>
              <Pacages pacagePromise={pacagePromise}></Pacages>                             

            </div>
        </div>
    );
};

export default Home;