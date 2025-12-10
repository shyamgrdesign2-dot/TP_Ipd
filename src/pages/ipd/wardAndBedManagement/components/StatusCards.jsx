import React from "react";
import "./StatusCards.scss";
import { useSelector } from "react-redux";

const StatusCards = () => {
  const { stats } = useSelector((state) => state.wardAndBedManagement);

  const cards = [
    {
      id: 1,
      title: "Total Wards",
      value: stats?.totalWards || 0,
      gradientFrom: "rgba(164, 97, 216, 0.1)",
      gradientTo: "rgba(164, 97, 216, 0)",
      textColor: "#A461D8",
    },
    {
      id: 2,
      title: "Total Available Beds",
      value: stats?.availableBeds || 0,
      gradientFrom: "rgba(61, 140, 64, 0.2)",
      gradientTo: "rgba(61, 140, 64, 0)",
      textColor: "#3D8C40",
    },
    {
      id: 3,
      title: "Total Occupied Beds",
      value: stats?.occupiedBeds || 0,
      gradientFrom: "rgba(237, 138, 0, 0.1)",
      gradientTo: "rgba(237, 138, 0, 0)",
      textColor: "#ED8A00",
    },
    {
      id: 4,
      title: "Total Blocked Beds",
      value: stats?.blockedBeds || 0,
      gradientFrom: "rgba(252, 90, 90, 0.1)",
      gradientTo: "rgba(252, 90, 90, 0)",
      textColor: "#FC5A5A",
    },
  ];

  return (
    <div className="status-cards-container">
      {cards.map((card) => (
        <div key={card.id} className="status-card">
          <div
            className="status-card-header"
            style={{
              background: `linear-gradient(180deg, ${card.gradientFrom} 0%, ${card.gradientTo} 100%)`,
            }}
          >
            <p className="status-card-title" style={{ color: card.textColor }}>
              {card.title}
            </p>
          </div>
          <p className="status-card-value">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default React.memo(StatusCards);
