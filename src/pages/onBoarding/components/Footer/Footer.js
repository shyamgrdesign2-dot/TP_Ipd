import React from 'react';
import { Row, Col } from 'antd';
import { FacebookOutlined, TwitterOutlined, LinkedinOutlined, YoutubeOutlined } from '@ant-design/icons';
import "./Footer.scss";
// import Logo from '../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* <Row gutter={[32, 32]}> */}
          {/* Company Info */}
          {/* <Col xs={24} sm={24} md={8} lg={8}> */}
            <div className="company-info">
              {/* <img src={Logo} alt="Tatvacare Logo" className="footer-logo" /> */}
              <p className="company-description">
                We are a full-spectrum technology solution that solves across various aspects of both patients' and doctors' needs and their interactions to significantly improve health positives.
              </p>
            </div>
          {/* </Col> */}

          {/* Quick Links */}
          {/* <Col xs={24} sm={12} md={5} lg={5}> */}
            {/* <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="/blog">Blog</a></li>
                <li><a href="/about-us">About Us</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/news-room">News Room</a></li>
              </ul>
            </div> */}
          {/* </Col> */}

          {/* Offices */}
          {/* <Col xs={24} sm={12} md={6} lg={6}> */}
            <div className="footer-section">
              <h3>Offices</h3>
              <div className="office-locations">
                <div className="office">
                  <h4>Bangalore</h4>
                  <p>Digicare Health Solutions Pvt. Ltd., 2nd Floor, 14th Main Rd, Sector 5, Agara Village, 1st Sector, HSR Layout, Bangalore, Karnataka - 560102</p>
                </div>
                <div className="office">
                  <h4>Ahmedabad</h4>
                  <p>Digicare Health Solutions Pvt. Ltd., 4th Floor, Plot No 115/5, TP Scheme No. 51, off Ambli-Bopal Road, Ahmedabad, Gujarat - 380058</p>
                </div>
              </div>
            </div>
          {/* </Col> */}

          {/* Contact Us */}
          {/* <Col xs={24} sm={12} md={5} lg={5}> */}
            <div className="footer-section">
              <h3>Contact Us</h3>
              <div className="contact-info">
                <p><a href="tel:+919974042363">+91 99740 42363</a></p>
                <p><a href="mailto:support@tatvacare.in">support@tatvacare.in</a></p>
              </div>
              <div className="social-links">
                <h4>Follow Us</h4>
                <div className="social-icons">
                  <a href="#facebook" aria-label="Facebook"><FacebookOutlined /></a>
                  <a href="#twitter" aria-label="Twitter"><TwitterOutlined /></a>
                  <a href="#linkedin" aria-label="LinkedIn"><LinkedinOutlined /></a>
                  <a href="#youtube" aria-label="YouTube"><YoutubeOutlined /></a>
                </div>
              </div>
            </div>
          {/* </Col> */}
        {/* </Row> */}
      </div>
    </footer>
  );
};

export default Footer;