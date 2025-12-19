import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
const features = [
    {
        title: 'Comprehensive Asset Tracking',
        desc: 'Monitor asset lifecycle from procurement to disposal with complete visibility.',
    },
    {
        title: 'User Role Management',
        desc: 'Define roles such as Admin, Manager, and Employee with specific permissions.',
    },
    {
        title: 'Real-time Reporting',
        desc: 'Generate detailed reports on asset status, usage, and maintenance instantly.',
    },
    {
        title: 'Request & Approval Workflows',
        desc: 'Streamline asset requests with automated approval processes.',
    },
    {
        title: 'Secure Data Handling',
        desc: 'Ensure data integrity and security with role-based access controls.',
    },
];
const KeyFeatures = () => {
    return (
        <div>
            <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                loop={true}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >{features.map((feature, index) => (
                <SwiperSlide key={index}>
                    <div className=''>
                        <div className="card bg-primary text-primary-content w-96">
                            <div className="card-body">
                                <h2 className="card-title">{feature.title}</h2>
                                <p>{feature.desc}</p>
                                <div className="card-actions justify-end">
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
    );
};

export default KeyFeatures;