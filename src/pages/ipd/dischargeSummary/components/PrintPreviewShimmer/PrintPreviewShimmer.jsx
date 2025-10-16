import React from "react";
import "./styles.scss";

const Line = ({ w = "100%", h = 14, className = "" }) => (
  <div className={`ds-skel__line ${className}`} style={{ width: w, height: h }} />
);

const Badge = ({ w = 120 }) => <div className="ds-skel__badge" style={{ width: w }} />;

export default function PrintPreviewShimmer({ className = "" }) {
  return (
    <div className={`ds-skel ${className}`} role="status" aria-busy="true" aria-live="polite">
      {/* Card container */}
      <div className="ds-skel__card">
        {/* Header: Logo + Title */}
        <div className="ds-skel__header">
          <div className="ds-skel__logo" />
          <div className="ds-skel__title-wrap">
            <Line w="52%" h={28} className="ds-skel__title" />
            <Line w="28%" h={10} className="ds-skel__title-sub" />
          </div>
        </div>

        <div className="ds-skel__divider" />

        {/* Patient info two-column grid */}
        <div className="ds-skel__grid">
          {/* Left column */}
          <div className="ds-skel__grid-col">
            <div className="ds-skel__kv">
              <Badge w={140} />
              <Line w="70%" />
            </div>
            <div className="ds-skel__kv">
              <Badge w={120} />
              <Line w="45%" />
            </div>
            <div className="ds-skel__kv">
              <Badge w={110} />
              <Line w="60%" />
            </div>
            <div className="ds-skel__kv">
              <Badge w={110} />
              <Line w="50%" />
            </div>
            <div className="ds-skel__kv ds-skel__kv--multiline">
              <Badge w={90} />
              <div className="ds-skel__stack">
                <Line w="95%" />
                <Line w="85%" />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="ds-skel__grid-col">
            <div className="ds-skel__kv">
              <Badge w={110} />
              <Line w="55%" />
            </div>
            <div className="ds-skel__kv">
              <Badge w={120} />
              <Line w="62%" />
            </div>
            <div className="ds-skel__kv">
              <Badge w={120} />
              <Line w="40%" />
            </div>
            <div className="ds-skel__kv">
              <Badge w={140} />
              <Line w="70%" />
            </div>
            <div className="ds-skel__kv">
              <Badge w={150} />
              <Line w="50%" />
            </div>
          </div>
        </div>

        {/* Section: Admitting Consultant */}
        <div className="ds-skel__section">
          <div className="ds-skel__section-title">
            <Line w="28%" h={16} />
          </div>
          <div className="ds-skel__section-body">
            <Line w="40%" />
          </div>
        </div>

        {/* Section: Diagnosis & Surgery */}
        <div className="ds-skel__section">
          <div className="ds-skel__section-title">
            <Line w="36%" h={16} />
          </div>

          <div className="ds-skel__subheading">
            <Line w="18%" h={12} />
          </div>
          <ul className="ds-skel__list">
            <li><Line w="78%" /></li>
            <li><Line w="70%" /></li>
          </ul>

          <div className="ds-skel__subheading">
            <Line w="22%" h={12} />
          </div>
          <ul className="ds-skel__list">
            <li><Line w="82%" /></li>
          </ul>

          <div className="ds-skel__subheading">
            <Line w="23%" h={12} />
          </div>
          <ul className="ds-skel__list">
            <li><Line w="75%" /></li>
            <li><Line w="64%" /></li>
          </ul>
        </div>

        {/* Section: Patient History */}
        <div className="ds-skel__section">
          <div className="ds-skel__section-title">
            <Line w="26%" h={16} />
          </div>

          <div className="ds-skel__subheading">
            <Line w="22%" h={12} />
          </div>
          <ul className="ds-skel__list">
            <li><Line w="92%" /></li>
            <li><Line w="88%" /></li>
            <li><Line w="90%" /></li>
            <li><Line w="60%" /></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
