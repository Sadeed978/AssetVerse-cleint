import React from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const benefits = [
    {
      badge: 'Core Feature',
      title: 'Asset Categorization',
      tag: 'Management',
      features: [
        'Custom asset categories',
        'Department-wise grouping',
        'Tag-based classification',
        'Asset type configuration',
      ],
    },
    {
      badge: 'Smart Tool',
      title: 'Advanced Search',
      tag: 'Discovery',
      features: [
        'Filter by status & owner',
        'Category-based search',
        'Date & activity filters',
        'Instant result loading',
      ],
    },
    {
      badge: 'Tracking',
      title: 'Activity Logs',
      tag: 'Monitoring',
      features: [
        'Complete asset history',
        'Assignment tracking',
        'Status change logs',
        'User action records',
      ],
    },
    {
      badge: 'Automation',
      title: 'Notifications',
      tag: 'Alerts',
      features: [
        'Request notifications',
        'Approval status alerts',
        'Return reminders',
        'System activity updates',
      ],
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
                    <div className="card bg-base-100 shadow-xl border border-gray-200 p-6">
                        <div className="badge badge-secondary mb-4">{benefit.badge}</div>
                        <h2 className="card-title text-2xl mb-2">{benefit.title}</h2>
                        <div className="badge badge-outline mb-4">{benefit.tag}</div>
                        <ul className="list-disc list-inside space-y-2">
                            {benefit.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                </SwiperSlide>
            ))}
            </Swiper>

        </div>
    );
};

export default Benifits;