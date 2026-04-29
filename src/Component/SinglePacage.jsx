import React, { useState, use } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import AuthContext from '../contexts/AuthContexts';

/* ── Payment Modal ─────────────────────────────────────────────────────── */
const PaymentModal = ({ plan, onClose }) => {
  const [step, setStep] = useState('method'); // 'method' | 'card' | 'bkash' | 'success'
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [bkash, setBkash] = useState({ number: '', pin: '' });
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}>
      <div className="bg-base-100 border border-base-300 rounded-3xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-base-300">
          <div>
            <h2 className="font-black text-lg">
              {step === 'success' ? '🎉 Payment Successful' : `Subscribe to ${plan.name}`}
            </h2>
            {step !== 'success' && (
              <p className="text-base-content/40 text-sm mt-0.5">
                {plan.price} BDT / month · Up to {plan.employeeLimit} employees
              </p>
            )}
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-base-200 hover:bg-base-300 flex items-center justify-center text-base-content/50 transition">
            ✕
          </button>
        </div>

        <div className="px-6 py-6">

          {/* ── Step: choose method ── */}
          {step === 'method' && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-base-content/50 mb-2">Choose payment method</p>

              <button onClick={() => setStep('card')}
                className="flex items-center gap-4 p-4 rounded-2xl border border-base-300 hover:border-primary hover:bg-primary/5 transition text-left group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">💳</div>
                <div>
                  <p className="font-bold text-sm">Credit / Debit Card</p>
                  <p className="text-xs text-base-content/40">Visa, Mastercard, AMEX</p>
                </div>
                <span className="ml-auto text-base-content/20 group-hover:text-primary transition">→</span>
              </button>

              <button onClick={() => setStep('bkash')}
                className="flex items-center gap-4 p-4 rounded-2xl border border-base-300 hover:border-pink-500 hover:bg-pink-500/5 transition text-left group">
                <div className="w-11 h-11 rounded-xl bg-pink-500/10 flex items-center justify-center text-xl shrink-0">📱</div>
                <div>
                  <p className="font-bold text-sm">bKash</p>
                  <p className="text-xs text-base-content/40">Mobile banking payment</p>
                </div>
                <span className="ml-auto text-base-content/20 group-hover:text-pink-500 transition">→</span>
              </button>

              <button onClick={() => setStep('bkash')}
                className="flex items-center gap-4 p-4 rounded-2xl border border-base-300 hover:border-orange-500 hover:bg-orange-500/5 transition text-left group">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center text-xl shrink-0">🏦</div>
                <div>
                  <p className="font-bold text-sm">Nagad</p>
                  <p className="text-xs text-base-content/40">Mobile banking payment</p>
                </div>
                <span className="ml-auto text-base-content/20 group-hover:text-orange-500 transition">→</span>
              </button>
            </div>
          )}

          {/* ── Step: card ── */}
          {step === 'card' && (
            <div className="flex flex-col gap-4">
              <button onClick={() => setStep('method')}
                className="text-xs text-base-content/40 hover:text-base-content flex items-center gap-1 mb-1 transition">
                ← Back
              </button>

              {/* Card preview */}
              <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-5 text-white mb-2 shadow-lg">
                <p className="text-xs opacity-60 mb-4 uppercase tracking-widest">AssetVerse Card</p>
                <p className="text-lg font-mono tracking-widest mb-4">
                  {card.number ? card.number.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between text-sm">
                  <span>{card.name || 'CARD HOLDER'}</span>
                  <span>{card.expiry || 'MM/YY'}</span>
                </div>
              </div>

              <div className="form-control">
                <label className="label pb-1"><span className="label-text text-xs font-semibold">Card Number</span></label>
                <input className="input input-bordered w-full" placeholder="1234 5678 9012 3456"
                  maxLength={16} value={card.number}
                  onChange={e => setCard(c => ({ ...c, number: e.target.value.replace(/\D/g, '') }))} />
              </div>
              <div className="form-control">
                <label className="label pb-1"><span className="label-text text-xs font-semibold">Cardholder Name</span></label>
                <input className="input input-bordered w-full" placeholder="John Doe"
                  value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label pb-1"><span className="label-text text-xs font-semibold">Expiry</span></label>
                  <input className="input input-bordered w-full" placeholder="MM/YY"
                    maxLength={5} value={card.expiry}
                    onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))} />
                </div>
                <div className="form-control">
                  <label className="label pb-1"><span className="label-text text-xs font-semibold">CVV</span></label>
                  <input className="input input-bordered w-full" placeholder="•••"
                    maxLength={3} type="password" value={card.cvv}
                    onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))} />
                </div>
              </div>

              <button onClick={handlePay} disabled={processing}
                className="btn btn-primary w-full rounded-xl mt-2">
                {processing
                  ? <><span className="loading loading-spinner loading-sm" /> Processing…</>
                  : `Pay ${plan.price} BDT`}
              </button>
            </div>
          )}

          {/* ── Step: bkash/nagad ── */}
          {step === 'bkash' && (
            <div className="flex flex-col gap-4">
              <button onClick={() => setStep('method')}
                className="text-xs text-base-content/40 hover:text-base-content flex items-center gap-1 mb-1 transition">
                ← Back
              </button>
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4 text-center mb-2">
                <p className="text-2xl mb-1">📱</p>
                <p className="font-bold text-sm">Mobile Banking</p>
                <p className="text-xs text-base-content/40">bKash / Nagad</p>
              </div>
              <div className="form-control">
                <label className="label pb-1"><span className="label-text text-xs font-semibold">Mobile Number</span></label>
                <input className="input input-bordered w-full" placeholder="01XXXXXXXXX"
                  maxLength={11} value={bkash.number}
                  onChange={e => setBkash(b => ({ ...b, number: e.target.value }))} />
              </div>
              <div className="form-control">
                <label className="label pb-1"><span className="label-text text-xs font-semibold">PIN</span></label>
                <input className="input input-bordered w-full" placeholder="••••••"
                  type="password" maxLength={6} value={bkash.pin}
                  onChange={e => setBkash(b => ({ ...b, pin: e.target.value }))} />
              </div>
              <button onClick={handlePay} disabled={processing}
                className="btn btn-primary w-full rounded-xl mt-2">
                {processing
                  ? <><span className="loading loading-spinner loading-sm" /> Processing…</>
                  : `Pay ${plan.price} BDT`}
              </button>
            </div>
          )}

          {/* ── Step: success ── */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
              <h3 className="font-black text-xl mb-2">You're subscribed!</h3>
              <p className="text-base-content/50 text-sm mb-6">
                Welcome to the <strong>{plan.name}</strong> plan. Your account has been upgraded.
              </p>
              <button onClick={onClose} className="btn btn-primary rounded-full px-10">
                Go to Dashboard →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

/* ── Single Package Card ───────────────────────────────────────────────── */
const SinglePacage = ({ pacage }) => {
  const { name, employeeLimit, price, features } = pacage;
  const { user } = use(AuthContext);
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);

  const isFree     = parseInt(price) === 0 || price === '0' || name?.toLowerCase().includes('basic');
  const isPopular  = name?.toLowerCase().includes('standard');
  const isPremium  = name?.toLowerCase().includes('premium');

  const handleClick = () => {
    if (isFree) return; // button is disabled / shows "Current Plan"
    if (!user) { navigate('/HRRegister'); return; }
    setShowPayment(true);
  };

  return (
    <>
      <div className={`relative border rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300
        ${isPopular
          ? 'border-primary/60 bg-primary/5 shadow-lg shadow-primary/10'
          : isPremium
          ? 'border-warning/40 bg-warning/5'
          : 'border-base-300 bg-base-100'}
        hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5`}>

        {isPopular && (
          <span className="absolute -top-3 left-6 bg-primary text-primary-content text-xs font-bold px-3 py-1 rounded-full shadow">
            Most Popular
          </span>
        )}
        {isPremium && (
          <span className="absolute -top-3 left-6 bg-warning text-warning-content text-xs font-bold px-3 py-1 rounded-full shadow">
            ⭐ Premium
          </span>
        )}

        <div>
          <p className="text-xs uppercase tracking-widest text-base-content/40 mb-2">{name}</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-base-content">
              {isFree ? 'Free' : price}
            </span>
            {!isFree && <span className="text-base-content/40 text-sm mb-1">BDT / month</span>}
          </div>
          <p className="text-sm text-base-content/50 mt-1">Up to {employeeLimit} employees</p>
        </div>

        <div className="border-t border-base-300" />

        <ul className="flex flex-col gap-2.5 flex-1">
          {features?.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-base-content/70">
              <span className="text-primary text-xs font-bold">✓</span>
              {f}
            </li>
          ))}
        </ul>

        {isFree ? (
          <div className="btn btn-outline rounded-full cursor-default opacity-60 pointer-events-none">
            ✅ You're already on this plan
          </div>
        ) : (
          <button onClick={handleClick}
            className={`btn rounded-full ${isPopular ? 'btn-primary' : 'btn-outline'}`}>
            Subscribe →
          </button>
        )}
      </div>

      {showPayment && (
        <PaymentModal
          plan={{ name, price, employeeLimit }}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
};

export default SinglePacage;
