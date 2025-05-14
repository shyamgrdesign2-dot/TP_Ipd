import React, { useState } from "react";
import "./Testimonials.scss";
import testimonialIcon from "../../../../assets/images/onboard-page-icons/LP-Testimonial-icon.svg";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr.Shyam",
      qualification: "MBBS,MD",
      image: "/images/doctors/dr-shyam.png",
      rating: 4,
      hospitalLogo: "/images/hospitals/zydus.png",
      review:
        "TatvaPractice with Apex AI has transformed how I diagnose and manage patients. I now spend less time on admin work and more time on patient care.",
    },
    {
      name: "Dr.Stella",
      qualification: "MBBS,MD",
      image: "/images/doctors/dr-stella.png",
      rating: 4,
      hospitalLogo: "/images/hospitals/max.png",
      review:
        "TatvaPractice with Apex AI has transformed how I diagnose and manage patients. I now spend less time on admin work and more time on patient care.",
    },
    {
      name: "Dr.Leena",
      qualification: "MBBS,MD",
      image: "/images/doctors/dr-leena.png",
      rating: 4,
      hospitalLogo: "/images/hospitals/fortis.png",
      review:
        "TatvaPractice with Apex AI has transformed how I diagnose and manage patients. I now spend less time on admin work and more time on patient care.",
    },
    {
      name: "Dr.Harish",
      qualification: "MBBS,MD",
      image: "/images/doctors/dr-shyam.png",
      rating: 4,
      hospitalLogo: "/images/hospitals/zydus.png",
      review:
        "TatvaPractice with Apex AI has transformed how I diagnose and manage patients. I now spend less time on admin work and more time on patient care.",
    },
    {
      name: "Dr.Sharath",
      qualification: "MBBS,MD",
      image: "/images/doctors/dr-stella.png",
      rating: 4,
      hospitalLogo: "/images/hospitals/max.png",
      review:
        "TatvaPractice with Apex AI has transformed how I diagnose and manage patients. I now spend less time on admin work and more time on patient care.",
    },
    {
      name: "Dr.Sheela",
      qualification: "MBBS,MD",
      image: "/images/doctors/dr-leena.png",
      rating: 4,
      hospitalLogo: "/images/hospitals/fortis.png",
      review:
        "TatvaPractice with Apex AI has transformed how I diagnose and manage patients. I now spend less time on admin work and more time on patient care.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsToShow = 3;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - cardsToShow;
      return newIndex < 0 ? testimonials.length - cardsToShow : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + cardsToShow;
      return newIndex >= testimonials.length ? 0 : newIndex;
    });
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + cardsToShow);

  return (
    <div className="testimonials-container">
      <h2 className="testimonials-title">
        Hear from<br />
        Healthcare Professionals 
        <img
          src={testimonialIcon}
          alt="feature-icon"
        />
      </h2>
      <div className="testimonials-carousel">
        <button className="prev" onClick={handlePrev}>←</button>
        <div className="testimonials-wrapper">
          {visibleTestimonials.map((testimonial, index) => (
            <div 
              key={currentIndex + index} 
              className="testimonial-card"
            >
              <div className="testimonial-header">
                <div className="doctor-info">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="doctor-image"
                  />
                  <div>
                    <h3>{testimonial.name}</h3>
                    <p>{testimonial.qualification}</p>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < testimonial.rating ? "star filled" : "star"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <img
                  src={testimonial.hospitalLogo}
                  alt="Hospital"
                  className="hospital-logo"
                />
              </div>
              <p className="testimonial-text">{testimonial.review}</p>
            </div>
          ))}
        </div>
        <button className="next" onClick={handleNext}>→</button>
      </div>
    </div>
  );
};

export default Testimonials;
