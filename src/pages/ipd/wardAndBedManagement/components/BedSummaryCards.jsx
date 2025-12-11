import React from "react";
import "./BedSummaryCards.scss";

const BedSummaryCards = ({ summary }) => {
  const cards = [
    {
      id: 1,
      title: "Total Beds",
      value: summary?.totalBeds || 0,
      bgColor: "rgba(164, 97, 216, 0.1)",
      textColor: "purple-text",
    },
    {
      id: 2,
      title: "Available Beds",
      value: summary?.availableBeds || 0,
      bgColor: "rgba(61, 140, 64, 0.1)",
      textColor: "green",
    },
    {
      id: 3,
      title: "Occupied Bed",
      value: summary?.occupiedBeds || 0,
      bgColor: "rgba(237, 138, 0, 0.1)",
      textColor: "orange",
    },
    {
      id: 4,
      title: "Blocked Bed",
      value: summary?.blockedBeds || 0,
      bgColor: "rgba(252, 90, 90, 0.1)",
      textColor: "red",
    },
  ];

  return (
    <div className="bed-summary-cards-container">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bed-summary-card"
          style={{ backgroundColor: card.bgColor }}
        >
          <p className={`bed-summary-card-title ${card.textColor}`}>
            {card.title}
          </p>
          <p className={`bed-summary-card-value ${card.textColor}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default React.memo(BedSummaryCards);
