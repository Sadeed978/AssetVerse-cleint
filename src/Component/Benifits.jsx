import React from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const benefits = [
    {
        title: 'Modular Asset Categories',
        desc: 'Organize assets into customizable categories based on business needs.',
    },
    {
        title: 'Advanced Search & Filtering',
        desc: 'Quickly locate assets using filters like status, category, or assigned user.',
    },
    {
        title: 'Asset History & Activity Logs',
        desc: 'Maintain a complete audit trail of asset assignments and updates.',
    },
    {
        title: 'Notification & Status Alerts',
        desc: 'Get real-time alerts for asset requests, approvals, and changes.',
    },
];
const Benifits = () => {

    return (
        <div>
            <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                slidesPerView={1}
                spaceBetween={20}
                breakpoints={{
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    className: "max-w-6xl mx-auto my-12"
                }}
            >{benefits.map((benefit, index) => (
                <SwiperSlide key={index}>
                    <div className=''>
                        <div className="card w-96 bg-gray-200 card-xs shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title">{benefit.title}</h2>
                                <p>{benefit.desc}</p>
                                <div className="justify-end card-actions">
                                    
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

export default Benifits;