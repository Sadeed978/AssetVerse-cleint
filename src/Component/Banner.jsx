import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

const Banner = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const images = [
    'https://i.ibb.co.com/mFXKQNfw/premium-photo-1661772661721-b16346fe5b0f-fm-jpg-q-60-w-3000-ixlib-rb-4-1.jpg',
    'https://i.ibb.co.com/nhGBXCS/business-people-smart-city-network-interface-silhouettes-team-members-working-together-blurry-abstra.jpg',
    'https://i.ibb.co.com/hxzGqDj2/business-persons-on-meeting-in-the-office.jpg',
  ];

  const handleRoleSelect = (role) => {
    setShowModal(false);
    if (role === 'hr') {
      navigate('/HRRegister');
    } else {
      navigate('/EmployeeRegister');
    }
  };

  return (
    <>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="min-h-120"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              className="hero min-h-120"
              style={{ backgroundImage: `url(${img})` }}
            >
              <div className="hero-overlay bg-opacity-60"></div>
              <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">
                    AssetVerse – Smart Asset Management, Simplified
                  </h1>
                  <p className="mb-5">
                    Streamline your asset management with AssetVerse – the ultimate
                    solution for tracking, maintaining, and optimizing your valuable
                    resources.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                  >
                    Join As Your Desire Role
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Role selection modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-base-100 rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-center mb-2">Choose Your Role</h2>
            <p className="text-base-content/60 text-center mb-6 text-sm">
              Select how you want to join AssetVerse
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleRoleSelect('hr')}
                className="btn btn-primary btn-lg w-full"
              >
                <span className="text-xl mr-2">🏢</span>
                Join as HR Manager
              </button>
              <button
                onClick={() => handleRoleSelect('employee')}
                className="btn btn-outline btn-lg w-full"
              >
                <span className="text-xl mr-2">👤</span>
                Join as Employee
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="btn btn-ghost btn-sm w-full mt-4 text-base-content/50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
