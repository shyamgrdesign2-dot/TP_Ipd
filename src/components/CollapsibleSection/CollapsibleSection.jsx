import React, { useState } from 'react';
import { Collapse } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { provisionalDiagnosisPc } from '../../assets/images/assessmentIcons';
import './CollapsibleSection.scss';

const { Panel } = Collapse;

/**
 * CollapsibleSection Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.heading - Main section heading
 * @param {string} props.id - Unique identifier for the section
 * @param {string} props.icon - Icon URL/path for the section
 * @param {boolean} props.isDataFilled - Whether the section has data filled
 * @param {Array} props.children - Array of child items
 * @param {string} props.children[].heading - Child item heading
 * @param {string} props.children[].id - Child item unique identifier
 * @param {string} props.children[].icon - Child item icon URL/path
 * @param {boolean} props.children[].isDataFilled - Whether child item has data filled
 * @param {string} props.children[].status - Status text for child item (optional)
 * @param {React.ReactNode} props.children[].content - Additional content for child item (optional)
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onSectionToggle - Callback when section is toggled
 * @param {Function} props.onChildClick - Callback when child item is clicked
 */
const CollapsibleSection = ({
  heading,
  id,
  icon = provisionalDiagnosisPc,
  isDataFilled = false,
  children = [],
  className = '',
  onSectionToggle,
  onChildClick,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = (activeKey) => {
    const expanded = activeKey && activeKey.length > 0;
    setIsExpanded(expanded);
    if (onSectionToggle) {
      onSectionToggle(id, expanded);
    }
  };

  const handleChildClick = (childId, childData) => {
    if (onChildClick) {
      onChildClick(childId, childData);
    }
  };

  const getStatusBadge = (child) => {
    if (child.status) {
      return (
        <span className={`status-badge ${child.isDataFilled ? 'filled' : 'not-filled'}`}>
          {child.status}
        </span>
      );
    }
    return null;
  };

  const getDataFilledInfo = () => {
    const filledCount = children.filter(child => child.isDataFilled).length;
    const totalCount = children.length;
    
    if (totalCount === 0) {
      return isDataFilled ? 'Information Added' : 'Not Filled Yet';
    }
    
    return `${filledCount.toString().padStart(2, '0')}/${totalCount.toString().padStart(2, '0')} Information Added`;
  };

  const renderHeader = () => (
    <div className="collapsible-section-header">
      <div className="header-left">
        <div className="section-icon-wrapper">
          <img src={icon} alt={heading} className="section-icon" />
        </div>
        <div className="header-content">
          <h3 className="section-heading">{heading}</h3>
          <span className={`data-status ${isDataFilled || children.some(child => child.isDataFilled) ? 'filled' : 'not-filled'}`}>
            {getDataFilledInfo()}
          </span>
        </div>
      </div>
      <div className="header-right">
        {isExpanded ? (
          <CaretUpOutlined className="collapse-icon" />
        ) : (
          <CaretDownOutlined className="collapse-icon" />
        )}
      </div>
    </div>
  );

  const renderChildItem = (child, index) => (
    <div
      key={child.id || index}
      className={`child-item ${child.isDataFilled ? 'filled' : 'not-filled'}`}
      onClick={() => handleChildClick(child.id, child)}
    >
      <div className="child-content">
        <div className="child-left">
          <div className="child-icon-wrapper">
            <img 
              src={child.icon || provisionalDiagnosisPc} 
              alt={child.heading} 
              className="child-icon" 
            />
          </div>
          <span className="child-heading">{child.heading}</span>
        </div>
        <div className="child-right">
          {getStatusBadge(child)}
        </div>
      </div>
      {child.content && (
        <div className="child-additional-content">
          {child.content}
        </div>
      )}
    </div>
  );

  return (
    <div className={`collapsible-section ${className}`}>
      <Collapse
        activeKey={isExpanded ? [id] : []}
        onChange={handleToggle}
        ghost
        expandIcon={() => null}
        className="custom-collapse"
      >
        <Panel
          header={renderHeader()}
          key={id}
          className="custom-panel"
        >
          <div className="children-container">
            {children.map((child, index) => renderChildItem(child, index))}
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default CollapsibleSection;
