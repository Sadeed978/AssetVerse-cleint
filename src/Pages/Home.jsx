import React, { Suspense } from 'react';
import { Link, useNavigate } from 'react-router';
import Pacages from '../Component/Pacages';
import FAQSection from '../Component/ExtraPart/Faq2';
import { useNavigate as useNav } from 'react-router';

const pacagePromise = fetch('https://asset-verse-server-phi.vercel.app/pacages').then(r => r.json());

/* ── tiny reusable divider ── */
const Divider = () => <div className="border-t border-base-300 w-full" />;

/* ── stat item ── */
const Stat = ({ value, label }) => (
  <div className="flex flex-col gap-1">
    <span className="text-5xl md:text-6xl font-black tracking-tight text-base-content">{value}</span>
    <span className="text-sm text-base-content/40 uppercase tracking-widest">{label}</span>
  </div>
);

/* ── feature row ── */
const FeatureRow = ({ num, title, desc }) => (
  <div className="flex items-start gap-6 py-7 border-b border-base-300 group hover:bg-base-200/40 px-2 rounded-xl transition-colors duration-200">
    <span className="text-xs text-base-content/30 font-mono mt-1 w-6 shrink-0">{num}</span>
    <div className="flex-1">
      <h3 className="font-bold text-lg text-base-content mb-1">{title}</h3>
      <p className="text-base-content/50 text-sm leading-relaxed">{desc}</p>
    </div>
    <span className="text-base-content/20 group-hover:text-primary group-hover:translate-x-1 transition-all text-xl">→</span>
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

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 font-medium">
          Asset Management Platform
        </p>
        <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-8 text-base-content">
          Manage assets.<br />
          <span className="text-base-content/30">Smarter.</span>
        </h1>
        <p className="text-base-content/50 text-lg md:text-xl max-w-xl leading-relaxed mb-10">
          AssetVerse helps organizations track, allocate, and manage company
          assets — with full visibility for HR and employees.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/HRRegister')}
            className="btn btn-primary rounded-full px-8 text-base">
            Get Started →
          </button>
          <button onClick={() => navigate('/Login')}
            className="btn btn-ghost rounded-full px-8 text-base border border-base-300 hover:border-primary">
            Sign In
          </button>
        </div>
      </section>

      <Divider />

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          <Stat value="100+"   label="Companies trust us"          />
          <Stat value="99.9%"  label="System reliability"          />
          <Stat value="1,200+" label="Asset requests processed"     />
        </div>
      </section>

      <Divider />

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-2">
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/40">What we offer</p>
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tight">
          Everything you need<br />to run asset ops.
        </h2>
        <div>
          <FeatureRow num="01" title="Comprehensive Asset Tracking"
            desc="Monitor every asset from procurement to disposal with complete lifecycle visibility." />
          <FeatureRow num="02" title="Role-Based Access"
            desc="HR managers and employees each get a tailored dashboard with the right permissions." />
          <FeatureRow num="03" title="Request & Approval Workflows"
            desc="Employees request assets, HR approves — all tracked in real time with status updates." />
          <FeatureRow num="04" title="Real-time Analytics"
            desc="Instant charts on asset distribution, request trends, and team utilization." />
          <FeatureRow num="05" title="Secure & Scalable"
            desc="Role-based auth, encrypted data, built to scale from 5 to 5,000 employees." />
        </div>
      </section>

      <Divider />

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
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

      {/* ── PACKAGES ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-3">Pricing</p>
        <h2 className="text-3xl md:text-4xl font-black mb-10 tracking-tight">Simple plans,<br />no surprises.</h2>
        <Suspense fallback={
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        }>
          <Pacages pacagePromise={pacagePromise} />
        </Suspense>
      </section>

      <Divider />

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-3">Testimonials</p>
        <h2 className="text-3xl md:text-4xl font-black mb-10 tracking-tight">What people say.</h2>
        <div className="grid md:grid-cols-2 gap-6">
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

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <FAQSection />
      </section>

      <Divider />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-4">Get started today</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-base-content">
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
