import React from 'react';
import { useNavigate } from 'react-router';

const SinglePacage = ({ pacage }) => {
  const { name, employeeLimit, price, features } = pacage;
  const navigate = useNavigate();
  const isPopular = name?.toLowerCase().includes('pro') || name?.toLowerCase().includes('standard');

  return (
    <div className={`relative border rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5
      ${isPopular ? 'border-primary/40 bg-primary/5' : 'border-base-300 bg-base-100'}`}>

      {isPopular && (
        <span className="absolute -top-3 left-6 bg-primary text-primary-content text-xs font-bold px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}

      <div>
        <p className="text-xs uppercase tracking-widest text-base-content/40 mb-2">{name}</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black text-base-content">{price}</span>
          <span className="text-base-content/40 text-sm mb-1">BDT / month</span>
        </div>
        <p className="text-sm text-base-content/50 mt-1">Up to {employeeLimit} employees</p>
      </div>

      <div className="border-t border-base-300" />

      <ul className="flex flex-col gap-2.5">
        {features?.map((f, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm text-base-content/70">
            <span className="text-primary text-xs">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate('/HRRegister')}
        className={`btn rounded-full mt-auto ${isPopular ? 'btn-primary' : 'btn-outline'}`}>
        Get started →
      </button>
    </div>
  );
};

export default SinglePacage;
