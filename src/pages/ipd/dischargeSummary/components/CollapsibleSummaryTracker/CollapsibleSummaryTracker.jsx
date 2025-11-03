import React, { useMemo } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import defaultIcons from "../../../../../assets/images/indices";

export const assessmentIcons = {
  caretDown:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'><path d='M6 9l6 6 6-6' fill='none' stroke='%235f5f68' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>",
  caretUp:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'><path d='M18 15L12 9 6 15' fill='none' stroke='%235f5f68' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>",
};

const Chip = ({ kind, children }) => (
  <span className={`success-info-pill ${kind === "empty" ? "disabled" : ""}`}>
    {children}
  </span>
);

Chip.propTypes = {
  kind: PropTypes.oneOf(["added", "empty", "muted"]).isRequired,
  children: PropTypes.node.isRequired,
};

export default function CollapsibleSummaryTracker({
  section,
  openId,
  setOpenId,
}) {
  const isOpen = openId === section.id;

  const stats = useMemo(() => {
    const total = section?.children?.length ?? 0;
    const filled =
      section?.children?.filter((i) => i.isDataFilled)?.length ?? 0;
    return { total, filled };
  }, [section.children]);

  const handleToggle = () => {
    setOpenId(isOpen ? null : section.id);
  };

  return (
    <section
      className={`asc-card ${!isOpen ? "no-decor" : ""}`}
      aria-labelledby={`${section.id}-title`}
    >
      <button
        className="asc-card__header"
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={`${section.id}-panel`}
      >
        <div className="asc-card__leading">
          <div className="asc-card__icon-container-white">
          <div className="asc-card__icon-container">
            <img
              className="asc-card__icon"
              src={defaultIcons[`${section?.id}Outline`]}
              alt=""
              aria-hidden="true"
            />
          </div>
          </div>
          <div className="flex-column">
            <h3 id={`${section.id}-title`} className="asc-card__title">
              {section.heading || section.title}
            </h3>
            {String(stats.filled).padStart(2, "0") !== "00" ? (
              <Chip kind="added">
                {String(stats.filled).padStart(2, "0")}/
                {String(stats.total).padStart(2, "0")} Information Added
              </Chip>
            ): (
              <Chip kind="empty">Not Filled Yet</Chip>
            )}
          </div>
        </div>

        <div className="asc-card__trailing">
          <img
            className="asc-card__caret"
            src={isOpen ? assessmentIcons.caretUp : assessmentIcons.caretDown}
            alt=""
            aria-hidden="true"
          />
        </div>
      </button>

      <div
        id={`${section.id}-panel`}
        className={`asc-card__panel ${isOpen ? "is-open" : ""}`}
        role="region"
        aria-labelledby={`${section.id}-title`}
      >
        <ul className="asc-list" role="list">
          {section.children?.map((item) => (
            <li key={item.id} className="asc-list__row">
              <div className="asc-list__row-left">
                <img
                  className="asc-card__caret"
                  src={defaultIcons.trackArrow}
                  alt=""
                  aria-hidden="true"
                />
                <div className="asc-list__text">
                  <div className="asc-list__title">{item.title}</div>
                  {item.hint ? (
                    <div className="asc-list__hint">
                      <Chip kind="muted">{item.hint}</Chip>
                    </div>
                  ) : null}
                  <div className="asc-list__row-right">
                    {item.isDataFilled ? (
                      <Chip kind="added">Information Added</Chip>
                    ) : (
                      <Chip kind="empty">Not Filled Yet</Chip>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

CollapsibleSummaryTracker.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        hint: PropTypes.string,
        isDataFilled: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }).isRequired,
  openId: PropTypes.string,
  setOpenId: PropTypes.func.isRequired,
};
