import React, { Suspense } from 'react';
import { Link, useNavigate } from 'react-router';
import Banner from '../Component/Banner';
import Pacages from '../Component/Pacages';
import FAQSection from '../Component/ExtraPart/Faq2';

const pacagePromise = fetch('https://asset-verse-server-phi.vercel.app/pacages').then(r => r.json());

const Divider = () => <div className="border-t border-base-300 w-full" />;

/* ── Mock UI card shown inside feature panels ── */
const MockDashboard = () => (
  <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-2xl w-full max-w-sm">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-bold uppercase tracking-widest text-base-content/40">Asset Overview</span>
      <span className="badge badge-primary badge-sm">Live</span>
    </div>
    {[
      { label: 'Laptop',      qty: 10, pct: 70, color: 'bg-primary'   },
      { label: 'Headphones',  qty: 14, pct: 90, color: 'bg-secondary' },
      { label: 'Router',      qty: 7,  pct: 45, color: 'bg-success'   },
      { label: 'Office Chair',qty: 3,  pct: 20, color: 'bg-warning'   },
    ].map(({ label, qty, pct, color }) => (
      <div key={label} className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-base-content/70 font-medium">{label}</span>
          <span className="text-base-content/40">{qty} units</span>
        </div>
        <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    ))}
  </div>
);

const MockRequest = () => (
  <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-2xl w-full max-w-sm">
    <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4">Recent Requests</p>
    {[
      { name: 'Ahmad S.',  asset: 'Laptop',     status: 'Accepted', color: 'badge-success' },
      { name: 'Sara K.',   asset: 'Headphones', status: 'Pending',  color: 'badge-warning' },
      { name: 'James R.',  asset: 'Router',     status: 'Accepted', color: 'badge-success' },
      { name: 'Priya M.',  asset: 'Monitor',    status: 'Denied',   color: 'badge-error'   },
    ].map(({ name, asset, status, color }) => (
      <div key={name} className="flex items-center justify-between py-2.5 border-b border-base-300 last:border-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
            {name[0]}
          </div>
          <div>
            <p className="text-xs font-semibold">{name}</p>
            <p className="text-xs text-base-content/40">{asset}</p>
          </div>
        </div>
        <span className={`badge badge-xs ${color}`}>{status}</span>
      </div>
    ))}
  </div>
);

const MockAnalytics = () => (
  <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-2xl w-full max-w-sm">
    <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4">Analytics</p>
    <div className="flex items-end gap-2 h-24 mb-3">
      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-primary/20 hover:bg-primary/60 transition-colors"
          style={{ height: `${h}%` }} />
      ))}
    </div>
    <div className="flex justify-between text-xs text-base-content/30">
      {['M','T','W','T','F','S','S'].map(d => <span key={d}>{d}</span>)}
    </div>
    <div className="mt-4 flex gap-3">
      <div className="flex-1 bg-primary/10 rounded-xl p-3 text-center">
        <p className="text-lg font-black text-primary">24</p>
        <p className="text-xs text-base-content/40">Requests</p>
      </div>
      <div className="flex-1 bg-success/10 rounded-xl p-3 text-center">
        <p className="text-lg font-black text-success">18</p>
        <p className="text-xs text-base-content/40">Approved</p>
      </div>
    </div>
  </div>
);

/* ── Feature block — mode.com style two-column ── */
const FeatureBlock = ({ tag, title, desc, visual, accent, flip }) => (
  <div className={`rounded-3xl overflow-hidden grid md:grid-cols-2 min-h-[420px] text-base-content ${accent}`}>
    <div className={`flex flex-col justify-center p-10 md:p-14 ${flip ? 'md:order-2' : ''}`}>
      <p className="text-xs uppercase tracking-[0.3em] opacity-50 mb-4 font-semibold">{tag}</p>
      <h2 className="text-3xl md:text-4xl font-black leading-tight mb-5 whitespace-pre-line">{title}</h2>
      <p className="text-sm leading-relaxed opacity-60 max-w-xs">{desc}</p>
    </div>
    <div className={`flex items-center justify-center p-8 md:p-12 ${flip ? 'md:order-1' : ''}`}>
      {visual}
    </div>
  </div>
);

/* ── category pill ── */
const CatPill = ({ icon, label }) => (
  <Link to="/Dashboard/RequestAsset"
    className="flex items-center gap-3 px-5 py-3 rounded-full border border-base-300 bg-base-100 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 text-sm font-medium text-base-content/70 group">
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
  </Link>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-base-100 text-base-content">

      {/* ── HERO ── */}
      <Banner />

      {/* ── STATS ── */}
      <section className="border-b border-base-300">
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-3 gap-10">
          {[
            { value: '100+',   label: 'Companies trust us'       },
            { value: '99.9%',  label: 'System reliability'       },
            { value: '1,200+', label: 'Asset requests processed' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-5xl md:text-6xl font-black tracking-tight text-base-content">{value}</span>
              <span className="text-xs text-base-content/40 uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURE BLOCKS — mode.com style ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-5">

        <FeatureBlock
          tag="Asset Tracking"
          title={"Built for\nyour HR team"}
          desc="Monitor every asset from procurement to disposal. Full lifecycle visibility with real-time stock levels and assignment history."
          accent="feat-1 border"
          visual={<MockDashboard />}
        />

        <FeatureBlock
          flip
          tag="Request Workflows"
          title={"And the teams\nyou work with"}
          desc="Employees request assets, HR approves — all tracked in real time. No emails, no follow-ups, no confusion."
          accent="feat-2 border"
          visual={<MockRequest />}
        />

        <FeatureBlock
          tag="Analytics"
          title={"Real-time\ninsights"}
          desc="Instant charts on asset distribution, request trends, and team utilization. Make data-driven decisions every day."
          accent="feat-3 border"
          visual={<MockAnalytics />}
        />

      </section>

      <Divider />

      {/* ── CATEGORIES ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-3">Browse by category</p>
        <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tight">Asset categories</h2>
        <div className="flex flex-wrap gap-3">
          <CatPill icon="💻" label="Electronics"  />
          <CatPill icon="🪑" label="Furniture"    />
          <CatPill icon="🖨️" label="Office Tools" />
          <CatPill icon="📺" label="Television"   />
          <CatPill icon="📦" label="Resources"    />
        </div>
      </section>

      <Divider />

      {/* ── PACKAGES ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-3">Pricing</p>
        <h2 className="text-3xl md:text-4xl font-black mb-10 tracking-tight">Simple plans,<br />no surprises.</h2>
        <Suspense fallback={<div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>}>
          <Pacages pacagePromise={pacagePromise} />
        </Suspense>
      </section>

      <Divider />

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-3">Testimonials</p>
        <h2 className="text-3xl md:text-4xl font-black mb-10 tracking-tight">What people say.</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { quote: '"AssetVerse reduced our asset tracking workload drastically. The dashboard gives us instant visibility and control."', name: 'HR Manager', role: 'Human Resources', init: 'HR', color: 'bg-primary/15 text-primary' },
            { quote: '"Requesting assets is now transparent and fast. I always know the status of my requests without following up."',       name: 'Employee',   role: 'Team Member',      init: 'EM', color: 'bg-success/15 text-success' },
          ].map(({ quote, name, role, init, color }) => (
            <div key={name} className="border border-base-300 rounded-2xl p-7 hover:border-primary/40 transition-colors duration-300">
              <p className="text-base-content/60 text-base leading-relaxed mb-6 italic">{quote}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center font-bold text-sm`}>{init}</div>
                <div>
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-base-content/40">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── FAQ ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <FAQSection />
      </section>

      <Divider />

      {/* ── CTA ── */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-4">Get started today</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Ready to manage<br />assets smarter?
        </h2>
        <p className="text-base-content/40 mb-10 max-w-md mx-auto">
          Join 100+ companies already using AssetVerse to streamline their operations.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => navigate('/HRRegister')}
            className="btn btn-primary rounded-full px-10 text-base">
            Start as HR →
          </button>
          <button onClick={() => navigate('/EmployeeRegister')}
            className="btn btn-ghost rounded-full px-10 text-base border border-base-300 hover:border-primary">
            Join as Employee
          </button>
        </div>
      </section>

    </div>
  );
};

export default Home;
