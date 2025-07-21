import React, { useState, useEffect } from 'react';
import { Button, Card, Empty, message } from 'antd';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import './RxTemplateManager.scss';

const RxTemplateManager = ({ onUploadClick, onTemplateSelect }) => {
  const [templates, setTemplates] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    try {
      const savedTemplates = JSON.parse(localStorage.getItem('rxTemplates') || '[]');
      const active = JSON.parse(localStorage.getItem('activeRxTemplate') || 'null');
      
      setTemplates(savedTemplates);
      setActiveTemplate(active);
    } catch (error) {
      // Ignore template loading errors in production
    }
  };

  const handleTemplateSelect = (template) => {
    setActiveTemplate(template);
    localStorage.setItem('activeRxTemplate', JSON.stringify(template));
    onTemplateSelect && onTemplateSelect(template);
    message.success(`Template "${template.name}" activated`);
  };

  const handleTemplateDelete = (templateId) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem('rxTemplates', JSON.stringify(updatedTemplates));
    
    if (activeTemplate?.id === templateId) {
      setActiveTemplate(null);
      localStorage.removeItem('activeRxTemplate');
      onTemplateSelect && onTemplateSelect(null);
    }
    
    message.success('Template deleted successfully');
  };

  const clearActiveTemplate = () => {
    setActiveTemplate(null);
    localStorage.removeItem('activeRxTemplate');
    onTemplateSelect && onTemplateSelect(null);
    message.success('Active template cleared');
  };

  return (
    <div className="rx-template-manager">
      <div className="manager-header">
        <h3>RX Templates</h3>
        <div className="header-actions">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onUploadClick}
            size="small"
          >
            Add Template
          </Button>
          {activeTemplate && (
            <Button 
              type="text" 
              danger
              onClick={clearActiveTemplate}
              size="small"
            >
              Clear Active
            </Button>
          )}
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="empty-state">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No RX templates uploaded"
          >
            <Button 
              type="primary" 
              onClick={onUploadClick}
              icon={<PlusOutlined />}
            >
              Upload Your First Template
            </Button>
          </Empty>
        </div>
      ) : (
        <div className="template-grid">
          <Card 
            className={`template-card ${!activeTemplate ? 'active' : ''}`}
            onClick={clearActiveTemplate}
          >
            <div className="template-preview default-preview">
              <span>Default</span>
            </div>
            <div className="template-info">
              <div className="template-name">No Template</div>
              <div className="template-meta">Standard prescription</div>
            </div>
          </Card>
          {templates.map((template) => (
            <Card 
              key={template.id}
              className={`template-card ${activeTemplate?.id === template.id ? 'active' : ''}`}
              actions={[
                <Button 
                  type="text" 
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateSelect(template);
                  }}
                >
                  {activeTemplate?.id === template.id ? 'Active' : 'Activate'}
                </Button>,
                <Button 
                  type="text" 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateDelete(template.id);
                  }}
                >
                  Delete
                </Button>
              ]}
            >
              <div className="template-preview">
                {template.croppedImage ? (
                  <img 
                    src={template.croppedImage} 
                    alt={template.name}
                    className="template-thumbnail"
                  />
                ) : (
                  <div className="template-placeholder">
                    <span>PDF</span>
                  </div>
                )}
              </div>
              <div className="template-info">
                <div className="template-name">{template.name}</div>
                <div className="template-meta">
                  {template.dimensions && (
                    <span>{Math.round(template.dimensions.originalWidth)} × {Math.round(template.dimensions.originalHeight)} pts</span>
                  )}
                  {template.createdAt && (
                    <span> • {new Date(template.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTemplate && (
        <div className="active-template-info">
          <strong>Active Template:</strong> {activeTemplate.name}
          {activeTemplate.dimensions && (
            <span> • {Math.round(activeTemplate.dimensions.originalWidth)} × {Math.round(activeTemplate.dimensions.originalHeight)} pts</span>
          )}
        </div>
      )}
    </div>
  );
};

export default RxTemplateManager; 