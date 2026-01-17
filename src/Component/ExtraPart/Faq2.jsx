import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is AssetVerse?",
      answer:
        "AssetVerse is a smart asset management platform that helps organizations track, allocate, and manage company assets efficiently.",
    },
    {
      question: "Who can use this platform?",
      answer:
        "AssetVerse can be used by HR managers, employees, and administrators for streamlined asset handling.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes. We use secure authentication and role-based access to ensure your data remains protected.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16">
      <h2 className="text-3xl font-bold text-center mb-10">
        Frequently Asked Questions
      </h2>

      <div className="max-w-4xl mx-auto px-4 space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-xl overflow-hidden shadow-sm"
          >
            {/* Question */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="font-semibold text-left">
                {faq.question}
              </span>
              {activeIndex === index ? (
                <FiMinus className="text-xl" />
              ) : (
                <FiPlus className="text-xl" />
              )}
            </button>

            {/* Answer (Slide Animation) */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                activeIndex === index
                  ? "max-h-40 p-5 opacity-100"
                  : "max-h-0 p-0 opacity-0"
              } overflow-hidden bg-white text-gray-600`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
