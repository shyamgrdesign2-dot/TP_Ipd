import React from "react";
import SMS from "../../../assets/images/sms.svg";

function ContactSupport({ refs }) {
  return (
    <div
      id="contactSupport"
      className="my-5"
      ref={(el) => refs && (refs.current.contactSupport = el)}
    >
      <span className="fs-12-1 fw-medium text-primary">Contact Support</span>
      <div className="fw-semibold fs-20 text-black mb-2">
        Need More Help? Reach Out to Our Support Team
      </div>
      <div
        className="d-inline-flex align-items-center rounded-4 p-4"
        style={{ background: "#4B4AD514" }}
      >
        <i className="icon-phone fs-18"></i>
        <a className="text-main fw-medium fs-16" href="tel:+91-9974042363">
          +91-9974042363
        </a>{" "}
        <div className="mx-2">|</div>
        <img width={19} height={19} src={SMS} />
        <a
          className="text-main fw-medium fs-16"
          href="mailto:support@tatvacare.in"
        >
          Support@tatvacare.in
        </a>
      </div>
    </div>
  );
}

export default React.memo(ContactSupport);