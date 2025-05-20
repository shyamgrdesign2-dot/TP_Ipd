import React, { useState, useRef, useEffect } from "react";
import "./Testimonials.scss";
import testimonialIcon from "../../../../assets/images/onboard-page-icons/LP-Testimonial-icon.svg";
import profile from "../../../../assets/images/default-profile.svg";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr Nisheet Dave",
      qualification: "Orthopaedic",
      image: "",
      rating: 5,
      hospitalLogo: "/images/hospitals/zydus.png",
      review:
        "TatvaPractice with Apex AI has transformed how I diagnose and manage patients. I now spend less time on admin work and more time on patient care.",
    },
    {
      name: "Dr. Ashish Patel",
      qualification: "Emergency physician & Intensivist",
      image: "",
      rating: 5,
      hospitalLogo: "",
      review:
        "TatvaPractice with Apex AI has transformed how I diagnose and manage patients. I now spend less time on admin work and more time on patient care.",
    },
    {
      name: "Dr Nisheet Dave",
      qualification: "Orthopaedic",
      image: "",
      rating: 5,
      hospitalLogo: "/images/hospitals/zydus.png",
      review:
        "TatvaPractice with Apex AI has transformed how I diagnose and manage patients. I now spend less time on admin work and more time on patient care.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const wrapperRef = useRef(null);
  const isScrolling = useRef(false);

  const handleScroll = () => {
    if (!isScrolling.current && wrapperRef.current) {
      const scrollPosition = wrapperRef.current.scrollLeft;
      const cardWidth = wrapperRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('scroll', handleScroll);
      return () => wrapper.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToIndex = (index) => {
    if (wrapperRef.current && !isScrolling.current) {
      isScrolling.current = true;
      const cardWidth = wrapperRef.current.offsetWidth;
      wrapperRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      
      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrolling.current = false;
        setCurrentIndex(index);
      }, 500); // Match this with your transition duration
    }
  };

  const handlePrev = () => {
    if (wrapperRef.current) {
      const scrollAmount = wrapperRef.current.offsetWidth;
      wrapperRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleNext = () => {
    if (wrapperRef.current) {
      const scrollAmount = wrapperRef.current.offsetWidth;
      wrapperRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

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
        <div 
          className="testimonials-wrapper"
          ref={wrapperRef}
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="testimonial-card"
            >
              <div className="testimonial-header">
                <div className="doctor-info">
                  <img
                    src={testimonial.image ? testimonial.image : profile}
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
                {/* <img
                  src={testimonial.hospitalLogo}
                  alt="Hospital"
                  className="hospital-logo"
                /> */}
              </div>
              <p className="testimonial-text">{testimonial.review}</p>
            </div>
          ))}
        </div>
        <button className="next" onClick={handleNext}>→</button>
      </div>
      <div className="mobile-dots">
        <button
          className={`dot ${currentIndex === 0 ? 'active' : ''}`}
          onClick={() => scrollToIndex(0)}
        />
        <div className="slider-dash" />
        <button
          className={`dot ${currentIndex === 1 ? 'active' : ''}`}
          onClick={() => scrollToIndex(1)}
        />
      </div>
    </div>
  );
};

export default Testimonials;
