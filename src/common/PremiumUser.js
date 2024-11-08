import profileBg from "../assets/images/profile-bg.svg";
import goldCrown from "../assets/images/gold-crown.svg";
import { makeDefaultLogo } from "../utils/utils";
import { useSelector } from "react-redux";

export default function PremiumUser() {
  const { profile } = useSelector((state) => state.doctors);

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${profileBg})`,
        backgroundSize: "contain",
        width: "35px",
        height: "35px",
        position: "relative", // Make the outer div a relative container
      }}
    >
      <div
        style={{
          background: "linear-gradient(0deg, #FD5900 0%, #FFDE00 100%)",
          fontSize: "12px",
          fontWeight: 700,
          lineHeight: "18px",
          textAlign: "center",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
          display: "inline-block",
        }}
      >
        {makeDefaultLogo(profile?.um_name)}
      </div>
      <img
        loading="lazy"
        src={goldCrown}
        className="rounded-circle badge-icon"
        alt=""
        style={{
          width: "20px",
          height: "20px",
          position: "absolute", // Position the crown absolutely
          top: 0, // Align to the top of the outer div
          right: 0, // Align to the right of the outer div
          transform: "translate(30%, -35%)", // Adjust position slightly
        }}
      />
    </div>
  );
}
