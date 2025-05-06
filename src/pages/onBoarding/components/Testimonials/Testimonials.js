import React, { useState } from 'react';
import './Testimonials.scss';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr.Shyam",
      qualification: "MBBS,MD",
      image: "/images/doctors/dr-shyam.png",
      rating: 4,
      hospitalLogo: "/images/hospitals/zydus.png",
      review: "TatvaPractice with Apex AI has transformed how I diagnose and manage patients. I now spend less time on admin work and more time on patient care."
    },
    {
      name: "Dr.Stella",
      qualification: "MBBS,MD",
      image: "/images/doctors/dr-stella.png",
      rating: 4,
      hospitalLogo: "/images/hospitals/max.png",
      review: "TatvaPractice with Apex AI has transformed how I diagnose and manage patients. I now spend less time on admin work and more time on patient care."
    },
    {
      name: "Dr.Leena",
      qualification: "MBBS,MD",
      image: "/images/doctors/dr-leena.png",
      rating: 4,
      hospitalLogo: "/images/hospitals/fortis.png",
      review: "TatvaPractice with Apex AI has transformed how I diagnose and manage patients. I now spend less time on admin work and more time on patient care."
    }
  ];

  return (
    <div className="testimonials-container">
      <h2 className="testimonials-title">
        Hear from<br />
        Healthcare Professionals <span className="crown">👑</span>
      </h2>
      
      <div className="testimonials-carousel">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="testimonial-header">
              <div className="doctor-info">
                <img src={testimonial.image} alt={testimonial.name} className="doctor-image" />
                <div>
                  <h3>{testimonial.name}</h3>
                  <p>{testimonial.qualification}</p>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < testimonial.rating ? 'star filled' : 'star'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <img src={testimonial.hospitalLogo} alt="Hospital" className="hospital-logo" />
            </div>
            <p className="testimonial-text">{testimonial.review}</p>
          </div>
        ))}
      </div>
      
      <div className="carousel-controls">
        <button className="prev">←</button>
        <button className="next">→</button>
      </div>
    </div>
  );
};

export default Testimonials; 