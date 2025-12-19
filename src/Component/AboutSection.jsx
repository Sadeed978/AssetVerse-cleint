import React from 'react';
import KeyFeatures from './KeyFeatures';

const AboutSection = () => {
    return (
        <div className='pt-3'>
            <h1 className='text-2xl text-center text-shadow-black'>About <span className='text-blue-500'>AssertVerse</span></h1>
            <p className='text-center text-gray-400'>AssetVerse is a centralized asset management platform designed to help <br/> organizations efficiently track, manage, and control their physical and digital assets. <br/> workflows while ensuring transparency across all organizational roles.</p>

            <div className='p-4'>
               <KeyFeatures></KeyFeatures>
            </div>
            
        </div>
    );
};

export default AboutSection;