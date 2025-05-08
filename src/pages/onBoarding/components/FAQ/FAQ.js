import React, { useState } from 'react';
import './FAQ.scss';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "How secure is my data?",
      answer: "Your data is protected with enterprise-grade security measures including encryption and secure servers."
    },
    {
      question: "Is there an additional fee for this support program?",
      answer: "No, all support services are included in your standard subscription."
    },
    {
      question: "Who is eligible for this support program?",
      answer: "All registered healthcare professionals can access our support program."
    },
    {
      question: "What kind of support is available?",
      answer: "We offer 24/7 technical support, training, and dedicated account management."
    },
    {
      question: "How can I get started?",
      answer: "Simply sign up and our team will guide you through the onboarding process."
    },
    {
      question: "What features are included?",
      answer: "Our platform includes practice management, patient scheduling, and digital presence tools."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">
        FAQ <span className="sparkles">✨</span>
      </h2>
      
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            <div className="faq-question">
              <span>{item.question}</span>
              <span className="arrow">▼</span>
            </div>
            <div className="faq-answer">
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ; 