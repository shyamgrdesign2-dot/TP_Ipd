import React, { useState } from "react";
import "./FAQ.scss";
import testimonialIcon from "../../../../assets/images/onboard-page-icons/LP-Faq-icon.svg";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question:
        "What is the purpose of the government ID proof validation process?",
      answer:
        "The government ID proof validation process is essential for ensuring the authenticity and legitimacy of the doctors onboarded onto our platform. It helps maintain compliance with regulatory requirements and ensures the security of our services.",
    },
    {
      question: "How long is my account valid after onboarding?",
      answer:
        "Your account is valid for 30 days after onboarding. During this period, you'll need to complete certain milestones, such as uploading your MCI certificate, to continue accessing certain features.",
    },
    {
      question: "What happens after the 30-day validity period?",
      answer:
        "After the 30-day validity period, your account will undergo changes in access privileges. It's important to complete the required milestones within this period to avoid any disruptions in service.",
    },
    {
      question: "How do I upload my MCI certificate?",
      answer:
        "You can upload your MCI certificate within 7 days of account creation. Simply navigate to the designated section on the platform's landing page by going to my profile and upload from there.",
    },
    {
      question: "What if I miss the deadline for uploading my MCI certificate?",
      answer:
        "Missing the deadline may result in restrictions on certain features, such as prescription writing. It's crucial to adhere to the specified timelines to ensure uninterrupted access to all platform functionalities.",
    },
    {
      question: "Can I switch between different devices?",
      answer:
        "The application is supported on IPADs, any tablet that has the OS of Android and IOS. For the desktop and laptop, the web version is there. Use tatvapractice.tatvacare.in and login into your account.",
    },
    {
      question:
        "What support options are available if I encounter difficulties during the onboarding process?",
      answer:
        "If you encounter any difficulties during the onboarding process or require assistance with any platform-related issues, you can reach out to our dedicated support team or your assigned Key Account Manager for assistance. Please call on 9974042363 or mail to support@tatvacare.in",
    },
    {
      question: "What happens if I become a converted user?",
      answer:
        "Becoming a converted user entails gaining access to extended account validity (one year) and unlocking additional features. This status is achieved upon completing specific milestones and agreements, such as payment, data usage agreement, or fulfilment agreement and providing qualitative prescriptions.",
    },
    {
      question: "Do I need internet connection to function on this app?",
      answer:
        "Yes, a reliable and continued support of the network is required and having one would help you in provide a real time prescription to the users.",
    },
    {
      question: "I want to provide feedback.",
      answer:
        "You can send mail to us at support@tatvacare.in or comment on the update posts that you find as a notification in your homepage.",
    },
    {
      question: "How will I get my payment invoice?",
      answer:
        "One can see their invoices in their my profile section when once they logged in. For every purchase that was made, that transaction is documented the invoice shall be generated.",
    },
    {
      question: "Which all payment method are acceptable?",
      answer:
        "Payment can be done through UPI, Card, and online banking channels.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">
        <img src={testimonialIcon} alt="feature-icon" />
        FAQ
        <img src={testimonialIcon} alt="feature-icon" />
      </h2>

      <div className="faq-list">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleAccordion(index)}
          >
            <div className="faq-question">
              <span>{item.question}</span>
              <i
                className="icon-right"
                style={{
                  display: "block",
                  transform: activeIndex === index ? "rotate(90deg)" : "rotate(270deg)",
                  color: "#8077B7",
                }}
              />
            </div>
            <div className="faq-answer">{item.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
