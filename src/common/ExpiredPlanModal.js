import React from "react";
import { Modal, Button } from "antd";
import styles from "./ExpiredPlanModal.module.scss";
import tagImg from "../assets/images/tag.png";
import checkIcon from "../assets/images/check-icon.svg";
import sandClockIcon from "../assets/images/sand-clock.png";
import { useSelector } from "react-redux";

const ExpiredPlanModal = () => {
  const { planDetails } = useSelector((state) => state.subscription);
  const { planStatus, expiresIn } = planDetails || {};

  return (
    <Modal
      open={planStatus === "EXPIRED"}
      footer={null}
      closable={false}
      centered
      maskClosable={false}
      className={styles.expiredPlanModal}
      width={"929px"}
      height={"640px"}
    >
      <div className={styles.modalContent}>
        {/* Left Section */}
        {/* {planStatus === "TRIAL" && (
          <div className={styles.leftSection}>
            <h2>Your Free Trial has Expired!</h2>
            <p>
              Your <strong>free trial</strong> has expired{" "}
              <strong>{Math.abs(expiresIn)} days</strong> ago. Upgrade now to continue a hassle-free
              access!
            </p>

            <div
              className={styles.offerBox}
              style={{ backgroundImage: `url(${tagImg})` }}
            >
              <div className={styles.offerText}>
                <span className={styles.discount}>10% off</span>
                <span>Exclusive, just for you!</span>
              </div>
              <span className={styles.validity}>Valid until 23 Aug 2024</span>
            </div>
          </div>
        )} */}

        {/* {planStatus === "EXPIRED" && ( */}
        <div className={styles.leftSection}>
          <h2>Your Plan has Expired!</h2>
          <p>
            Your <strong>Pro plan</strong> has expired{" "}
            <strong>{Math.abs(expiresIn)} days</strong> ago. Renew your plan now
            to continue a hassle free experience!
          </p>
          <img src={sandClockIcon} alt="" className={styles.sandClockIcon} />{" "}
        </div>
        {/* )} */}

        {/* Right Section */}
        <div className={styles.rightSection}>
          <h2>Don't Lose Your Digital Advantage!</h2>
          <p>Upgrade your plan to continue</p>

          <ul className={styles.benefitsList}>
            <li>
              <img src={checkIcon} alt="" className={styles.checkIcon} />{" "}
              Seamless clinic management all in one place
            </li>
            <li>
              <img src={checkIcon} alt="" className={styles.checkIcon} /> Secure
              & instant access to patient records
            </li>
            <li>
              <img src={checkIcon} alt="" className={styles.checkIcon} />{" "}
              Effortless e-prescriptions with less paperwork
            </li>
            <li>
              <img src={checkIcon} alt="" className={styles.checkIcon} />{" "}
              Advanced analytics for better patient care
            </li>
          </ul>

          <p className={styles.upgradeText}>
            Keep your clinic smart & efficient with TatvaCare.{" "}
            {planStatus === "TRIAL" &&
              "Upgrade now and get an exclusive <strong>10% off</strong>."}
            {planStatus === "EXPIRED" &&
              "Continue benefiting from these features by renewing now!"}
          </p>

          <Button type="primary" className={styles.contactButton}>
            Contact Support
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExpiredPlanModal;
