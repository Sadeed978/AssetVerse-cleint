import React, { Suspense } from 'react';
import { Link, useNavigate } from 'react-router';
import Banner from '../Component/Banner';
import Pacages from '../Component/Pacages';
import FAQSection from '../Component/ExtraPart/Faq2';

const pacagePromise = fetch('https://asset-verse-server-phi.vercel.app/pacages').then(r => r.json());

const Divider = () => <div className="border-t border-base-300 w-full" />;

/* ── Premium stat card ── */
const StatCard = ({ value, label, icon, color }) => (
  <div className="glass-card rounded-2xl p-6 flex flex-col gap-3 hover:glow-primary transition-all duration-300">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-3xl font-black text-base-content">{value}</p>
      <p className="text-xs text-base-content/40 uppercase tracking-widest mt-1">{label}</p>
    </div>
  </div>
);

/* ── Mock dashboard widget ── */
const MockDashboard = () => (
  <div className="glass-card rounded-2xl p-5 w-full max-w-sm shadow-2xl">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-bold uppercase tracking-widest text-base-content/40">Asset Overview</span>
      <span className="flex items-center gap-1 text-xs text-success font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse inline-block" /> Live
      </span>
    </div>
    {[
      { label: 'Laptop',       qty: 10, pct: 70, color: 'bg-primary'   },
      { label: 'Headphones',   qty: 14, pct: 90, color: 'bg-secondary' },
      { label: 'Router',       qty: 7,  pct: 45, color: 'bg-accent'    },
      { label: 'Office Chair', qty: 3,  pct: 20, color: 'bg-warning'   },
    ].map(({ label, qty, pct, color }) => (
      <div key={label} className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
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
  <div className="glass-card rounded-2xl p-5 w-full max-w-sm shadow-2xl">
    <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4">Recent Requests</p>
    {[
      { name: 'Ahmad S.',  asset: 'Laptop',     status: 'Accepted', badge: 'badge-success' },
      { name: 'Sara K.',   asset: 'Headphones', status: 'Pending',  badge: 'badge-warning' },
      { name: 'James R.',  asset: 'Router',     status: 'Accepted', badge: 'badge-success' },
      { name: 'Priya M.',  asset: 'Monitor',    status: 'Denied',   badge: 'badge-error'   },
    ].map(({ name, asset, status, badge }) => (
      <div key={name} className="flex items-center justify-between py-2.5 border-b border-base-300/50 last:border-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{name[0]}</div>
          <div>
            <p className="text-xs font-semibold">{name}</p>
            <p className="text-xs text-base-content/40">{asset}</p>
          </div>
        </div>
        <span className={`badge badge-xs ${badge}`}>{status}</span>
      </div>
    ))}
  </div>
);

const MockAnalytics = () => (
  <div className="glass-card rounded-2xl p-5 w-full max-w-sm shadow-2xl">
    <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4">Weekly Analytics</p>
    <div className="flex items-end gap-1.5 h-20 mb-3">
      {[35,55,40,75,50,90,65].map((h,i) => (
        <div key={i} className="flex-1 rounded-t-md transition-all duration-300 hover:opacity-80"
          style={{ height:`${h}%`, background: i===5 ? 'var(--color-primary)' : 'var(--color-base-300)' }} />
      ))}
    </div>
    <div className="flex justify-between text-xs text-base-content/30 mb-4">
      {['M','T','W','T','F','S','S'].map((d,i) => <span key={i}>{d}</span>)}
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-primary/10 rounded-xl p-3 text-center">
        <p className="text-xl font-black text-primary">24</p>
        <p className="text-xs text-base-content/40">Requests</p>
      </div>
      <div className="bg-success/10 rounded-xl p-3 text-center">
        <p className="text-xl font-black text-success">18</p>
        <p className="text-xs text-base-content/40">Approved</p>
      </div>
    </div>
  </div>
);

/* ── Feature block ── */
const FeatureBlock = ({ tag, title, desc, visual, accent, flip }) => (
  <div className={`rounded-3xl overflow-hidden grid md:grid-cols-2 min-h-[400px] text-base-content border ${accent}`}>
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

/* ── Category pill ── */
const CatPill = ({ icon, label }) => (
  <Link to="/Dashboard/RequestAsset"
    className="flex items-center gap-3 px-5 py-3 rounded-full border border-base-300 glass-card hover:border-primary hover:text-primary transition-all duration-200 text-sm font-medium text-base-content/70 group">
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
  </Link>
);

/* ── Trusted by logos (placeholder initials) ── */
const TrustedBy = () => (
  <div className="flex flex-wrap items-center justify-center gap-8 opacity-30">
    {['TechCorp','NovaSys','BuildCo','DataFlow','AssetPro','CloudBase'].map(name => (
      <span key={name} className="text-sm font-bold uppercase tracking-widest">{name}</span>
    ))}
  </div>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-base-200 text-base-content">

      {/* ── HERO ── */}
      <Banner />

      {/* ── TRUSTED BY ── */}
      <section className="border-y border-base-300 bg-base-100 py-8 px-6">
        <p className="text-center text-xs uppercase tracking-widest text-base-content/30 mb-6">Trusted by leading companies</p>
        <TrustedBy />
      </section>

      {/* ── STATS ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="100+"   label="Companies"       icon="🏢" color="bg-primary/15 text-primary"   />
          <StatCard value="99.9%"  label="Uptime"          icon="⚡" color="bg-accent/15 text-accent"     />
          <StatCard value="1,200+" label="Requests"        icon="📋" color="bg-secondary/15 text-secondary"/>
          <StatCard value="50k+"   label="Assets Tracked"  icon="📦" color="bg-success/15 text-success"   />
        </div>
      </section>

      <Divider />

      {/* ── FEATURE BLOCKS ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-5">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-2">Platform</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Everything in <span className="gradient-text">one place.</span>
          </h2>
        </div>

        <FeatureBlock tag="Asset Tracking" title={"Built for\nyour HR team"}
          desc="Monitor every asset from procurement to disposal. Full lifecycle visibility with real-time stock levels and assignment history."
          accent="feat-1" visual={<MockDashboard />} />

        <FeatureBlock flip tag="Request Workflows" title={"And the teams\nyou work with"}
          desc="Employees request assets, HR approves — all tracked in real time. No emails, no follow-ups, no confusion."
          accent="feat-2" visual={<MockRequest />} />

        <FeatureBlock tag="Analytics" title={"Real-time\ninsights"}
          desc="Instant charts on asset distribution, request trends, and team utilization. Make data-driven decisions every day."
          accent="feat-3" visual={<MockAnalytics />} />
      </section>

      <Divider />

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-3">How it works</p>
        <h2 className="text-3xl md:text-4xl font-black mb-12 tracking-tight">Up and running<br />in 3 steps.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step:'01', icon:'🏢', title:'Register your company', desc:'HR signs up, sets up the company profile and invites employees to join.' },
            { step:'02', icon:'📦', title:'Add your assets',       desc:'Upload your asset inventory — laptops, furniture, tools, anything your team uses.' },
            { step:'03', icon:'✅', title:'Manage requests',       desc:'Employees request assets, HR approves or denies — all tracked in real time.' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="glass-card rounded-2xl p-7 border border-base-300 hover:border-primary/40 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{icon}</span>
                <span className="text-xs font-mono text-base-content/30">{step}</span>
              </div>
              <h3 className="font-black text-lg mb-2 group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-sm text-base-content/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── CATEGORIES ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
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
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-3">Pricing</p>
        <h2 className="text-3xl md:text-4xl font-black mb-10 tracking-tight">Simple plans,<br />no surprises.</h2>
        <Suspense fallback={<div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>}>
          <Pacages pacagePromise={pacagePromise} />
        </Suspense>
      </section>

      <Divider />

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-3">Testimonials</p>
        <h2 className="text-3xl md:text-4xl font-black mb-10 tracking-tight">What people say.</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { quote: '"AssetVerse reduced our asset tracking workload drastically. The dashboard gives us instant visibility and control."', name: 'HR Manager', role: 'Human Resources', init: 'HR', color: 'bg-primary/15 text-primary' },
            { quote: '"Requesting assets is now transparent and fast. I always know the status of my requests without following up."',       name: 'Employee',   role: 'Team Member',      init: 'EM', color: 'bg-success/15 text-success' },
          ].map(({ quote, name, role, init, color }) => (
            <div key={name} className="glass-card border border-base-300 rounded-2xl p-7 hover:border-primary/40 transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_,i) => <span key={i} className="text-warning text-sm">★</span>)}
              </div>
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
      <section className="max-w-6xl mx-auto px-6 py-16">
        <FAQSection />
      </section>

      <Divider />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-28 px-6 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-4">Get started today</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Ready to manage<br /><span className="gradient-text">assets smarter?</span>
          </h2>
          <p className="text-base-content/40 mb-10 max-w-md mx-auto">
            Join 100+ companies already using AssetVerse to streamline their operations.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => navigate('/HRRegister')}
              className="btn btn-primary rounded-full px-10 text-base glow-primary">
              Start as HR →
            </button>
            <button onClick={() => navigate('/EmployeeRegister')}
              className="btn btn-ghost rounded-full px-10 text-base border border-base-300 hover:border-primary">
              Join as Employee
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
