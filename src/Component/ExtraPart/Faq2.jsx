import { useState } from "react";

const faqs = [
  { q: "What is AssetVerse?",       a: "AssetVerse is a smart asset management platform that helps organizations track, allocate, and manage company assets efficiently." },
  { q: "Who can use this platform?", a: "HR managers, employees, and administrators — each with a tailored dashboard and role-based permissions." },
  { q: "Is my data secure?",         a: "Yes. We use secure authentication and role-based access controls to ensure your data stays protected." },
  { q: "How does the request flow work?", a: "Employees browse available assets and submit a request. HR reviews and approves or denies — all tracked in real time." },
];

const FAQSection = () => {
  const [open, setOpen] = useState(null);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-base-content/40 mb-3">FAQ</p>
      <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tight">
        Common questions.
      </h2>
      <div className="flex flex-col">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-base-300">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left group"
            >
              <span className="font-semibold text-base text-base-content group-hover:text-primary transition-colors">
                {faq.q}
              </span>
              <span className={`text-base-content/30 text-xl transition-transform duration-300 shrink-0 ml-4 ${open === i ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-40 pb-5' : 'max-h-0'}`}>
              <p className="text-base-content/50 text-sm leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
