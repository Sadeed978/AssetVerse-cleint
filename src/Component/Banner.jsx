import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

const CYCLING_WORDS = ['Smarter.', 'Faster.', 'Simpler.', 'Together.'];

const IMAGES = [
  'https://i.ibb.co.com/mFXKQNfw/premium-photo-1661772661721-b16346fe5b0f-fm-jpg-q-60-w-3000-ixlib-rb-4-1.jpg',
  'https://i.ibb.co.com/nhGBXCS/business-people-smart-city-network-interface-silhouettes-team-members-working-together-blurry-abstra.jpg',
  'https://i.ibb.co.com/hxzGqDj2/business-persons-on-meeting-in-the-office.jpg',
];

const Banner = () => {
  const navigate = useNavigate();
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % CYCLING_WORDS.length);
        setVisible(true);
      }, 400);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelect = (role) => {
    setShowModal(false);
    navigate(role === 'hr' ? '/HRRegister' : '/EmployeeRegister');
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden">

        {/* Background image slider */}
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          className="absolute inset-0 w-full h-full"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {IMAGES.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="w-full h-full min-h-screen"
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Dark overlay — deeper in dark mode, lighter in light */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* Subtle radial glow */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[140px]" />
        </div>

        {/* Dot grid */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Content */}
        <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 text-center">

          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-white/60 uppercase tracking-widest mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Asset Management Platform
          </div>

          {/* Headline line 1 */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.0] text-white mb-2 drop-shadow-lg">
            Manage Assets
          </h1>

          {/* Cycling word */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.0] mb-8 h-[1.1em] flex items-center justify-center">
            <span
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0px)' : 'translateY(14px)',
                display: 'inline-block',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                color: 'hsl(var(--p, 238 84% 67%))',
                filter: 'drop-shadow(0 0 30px hsl(var(--p, 238 84% 67%) / 0.5))',
              }}
            >
              {CYCLING_WORDS[wordIdx]}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/50 text-lg md:text-xl max-w-lg mx-auto leading-relaxed mb-12">
            The central hub for HR teams and employees to track, request,
            and manage company assets — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary rounded-full px-10 text-base h-12 min-h-0 shadow-lg shadow-primary/30"
            >
              Join AssetVerse →
            </button>
            <button
              onClick={() => navigate('/Login')}
              className="h-12 min-h-0 px-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white/70 hover:text-white hover:border-white/40 hover:bg-white/10 transition-all text-base font-medium"
            >
              Sign In
            </button>
          </div>

          {/* Social proof */}
          <p className="text-white/25 text-xs tracking-widest uppercase">
            Trusted by <span className="text-white/50 font-semibold">100+</span> companies worldwide
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/20">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </div>

        {/* Slide counter dots */}
        <div className="absolute bottom-8 right-8 z-20 flex gap-2">
          {IMAGES.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30" />
          ))}
        </div>
      </section>

      {/* ── ROLE MODAL ───────────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-base-100 border border-base-300 rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-black mb-1 tracking-tight">Choose your role</h2>
            <p className="text-base-content/40 text-sm mb-7">
              Select how you want to join AssetVerse
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleRoleSelect('hr')}
                className="flex items-center gap-4 p-4 rounded-2xl border border-base-300 hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">🏢</div>
                <div>
                  <p className="font-bold text-sm">HR Manager</p>
                  <p className="text-xs text-base-content/40">Manage assets, employees & requests</p>
                </div>
                <span className="ml-auto text-base-content/20 group-hover:text-primary transition-colors text-lg">→</span>
              </button>

              <button
                onClick={() => handleRoleSelect('employee')}
                className="flex items-center gap-4 p-4 rounded-2xl border border-base-300 hover:border-secondary hover:bg-secondary/5 transition-all text-left group"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center text-xl shrink-0">👤</div>
                <div>
                  <p className="font-bold text-sm">Employee</p>
                  <p className="text-xs text-base-content/40">Request and track your assets</p>
                </div>
                <span className="ml-auto text-base-content/20 group-hover:text-secondary transition-colors text-lg">→</span>
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="btn btn-ghost btn-sm w-full mt-4 text-base-content/30 hover:text-base-content"
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
