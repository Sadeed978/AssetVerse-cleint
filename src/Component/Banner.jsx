import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';

import { Autoplay } from 'swiper/modules';

const Banner = () => {
  const images = [
    'https://i.ibb.co.com/mFXKQNfw/premium-photo-1661772661721-b16346fe5b0f-fm-jpg-q-60-w-3000-ixlib-rb-4-1.jpg',
    'https://i.ibb.co.com/nhGBXCS/business-people-smart-city-network-interface-silhouettes-team-members-working-together-blurry-abstra.jpg',
    'https://i.ibb.co.com/hxzGqDj2/business-persons-on-meeting-in-the-office.jpg',
  ];

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      className="min-h-screen"
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <div
            className="hero min-h-screen"
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="hero-overlay bg-opacity-60"></div>

            <div className="hero-content text-neutral-content text-center">
              <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold">AssetVerse – Smart Asset Management, Simplified</h1>
                <p className="mb-5">
                  Streamline your asset management with AssetVerse – the ultimate solution for tracking, maintaining, and optimizing your valuable resources.
                </p>
                <button className="btn btn-primary">Join AS Your Desire Role</button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;
