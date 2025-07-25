import React from 'react';
import { Button, Select, Typography, Radio } from 'antd';
import './RxTemplateManager.scss';

const { Option } = Select;
const { Text } = Typography;

const CustomCanvasSelector = ({ templates, selectedTemplateId, onTemplateSelect, onAddEditCanvas, onUploadNew }) => {
  console.log('🎨 CustomCanvasSelector rendered with:', { 
    templatesCount: templates?.length, 
    selectedTemplateId,
    templates: templates?.map(t => ({ id: t.id, title: t.title }))
  });

  // SCENARIO 1: NO TEMPLATES - Show simple "Add custom Rx Canvas" UI
  if (!templates || templates.length === 0) {
    console.log('📋 No templates found - showing simple UI');
    console.log('📋 Rendering: "Add custom Rx Canvas" with Know more and New badge');
    return (
      <div className="prescription-box-sm p-14 mb-14" style={{ width: "720px" }}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <i className="icon-template me-2" style={{ 
              fontSize: "16px", 
              color: "#6c757d" 
            }}></i>
            <span className="me-2" style={{ 
              color: "#374151",
              fontWeight: "400",
              fontSize: "14px"
            }}>
              Add custom Rx Canvas
            </span>
            <button 
              className="btn-link text-primary me-2 p-0"
              style={{ 
                fontSize: "16px",
                fontWeight: "600",
                textDecoration: "underline",
                border: "none",
                background: "none"
              }}
            >
              Know more
            </button>
            <span 
              className="text-white"
              style={{ 
                fontSize: "12px", 
                fontWeight: "600",
                width: "40px",
                height: "16px",
                borderRadius: "4px",
                background: "linear-gradient(101.91deg, #A461D8 9.72%, #B85DFF 47.18%, #7700D4 100%)",
                paddingTop: "4px",
                paddingRight: "6px",
                paddingBottom: "4px",
                paddingLeft: "6px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1"
              }}
            >
              New
            </span>
          </div>
          <button 
            className="btn d-flex align-items-center"
            style={{
              background: "white",
              border: "1px solid var(--P-CTA-100, #4B4AD5)",
              fontSize: "14px",
              gap: "4px",
              color: "#4B4AD5"
            }}
            onClick={onUploadNew}
          >
            <i className="icon-Add"></i>
            Add Rx Canvas
          </button>
        </div>
      </div>
    );
  }

  // SCENARIO 2: TEMPLATES EXIST - Show advanced dropdown selection UI
  console.log('🎯 Templates found - showing dropdown UI');
  
  // Find selected template to show page info
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const pageCount = selectedTemplate?.uploaded_files?.length || 0;

  return (
    <div className="prescription-box-sm p-14 mb-14" style={{ width: "720px" }}>
      {/* Header Row */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <i className="icon-template me-2" style={{ 
            fontSize: "16px", 
            color: "#6c757d" 
          }}></i>
          <span className="me-2" style={{ 
            color: "#374151",
            fontWeight: "400",
            fontSize: "14px"
          }}>
            Custom Canvas
          </span>
          <button 
            className="btn-link text-primary me-2 p-0"
            style={{ 
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "underline",
              border: "none",
              background: "none"
            }}
          >
            Know more
          </button>
        </div>
        
        {/* Template Selection Dropdown on the RIGHT */}
        <div style={{ minWidth: "200px" }}>
          <Select
            value={selectedTemplateId || undefined}
            placeholder="Select a template"
            style={{ 
              width: "100%"
            }}
            onChange={(value) => {
              if (value === 'add_edit') {
                onAddEditCanvas();
              } else {
                onTemplateSelect(value);
              }
            }}
            size="middle"
            dropdownStyle={{
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "8px"
            }}
            dropdownRender={(menu) => (
              <div>
                <div style={{ padding: "8px 0" }}>
                  <div style={{ 
                    fontSize: "12px", 
                    fontWeight: "600", 
                    color: "#6b7280", 
                    marginBottom: "8px",
                    paddingLeft: "12px"
                  }}>
                    Select Custom Canvas
                  </div>
                  <Radio.Group
                    value={selectedTemplateId || 'none'}
                    onChange={(e) => onTemplateSelect(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <Radio 
                        value="none" 
                        style={{ 
                          padding: "4px 12px",
                          margin: 0,
                          width: "100%"
                        }}
                      >
                        None
                      </Radio>
                      {templates.map(template => (
                        <Radio 
                          key={template.id} 
                          value={template.id}
                          style={{ 
                            padding: "4px 12px",
                            margin: 0,
                            width: "100%"
                          }}
                        >
                          {template.title}
                        </Radio>
                      ))}
                    </div>
                  </Radio.Group>
                  
                  {/* Separator and Add/Edit button */}
                  <div style={{ 
                    borderTop: "1px solid #f0f0f0",
                    marginTop: "8px",
                    paddingTop: "8px"
                  }}>
                    <div 
                      onClick={onAddEditCanvas}
                      style={{ 
                        color: "#4B4AD5", 
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        border: "1px dashed #4B4AD5",
                        backgroundColor: "#f8f9ff"
                      }}
                    >
                      <i className="icon-Add" style={{ fontSize: "12px" }}></i>
                      Add/Edit Rx Canvas
                    </div>
                  </div>
                </div>
              </div>
            )}
          >
            {/* Dummy options for display value */}
            <Option value="none">None</Option>
            {templates.map(template => (
              <Option key={template.id} value={template.id}>
                {template.title}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Page Information */}
      {selectedTemplate && selectedTemplateId !== 'none' && (
        <div 
          className="page-info d-flex align-items-center justify-content-between mt-3"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #e9ecef",
            fontSize: "12px"
          }}
        >
          <span style={{ color: "#6b7280" }}>
            Page 1 
            <span style={{ 
              marginLeft: "8px",
              backgroundColor: "#e3f2fd", 
              color: "#1976d2", 
              padding: "2px 6px", 
              borderRadius: "4px",
              fontWeight: "500"
            }}>
              Selected
            </span>
          </span>
          <span style={{ color: "#9ca3af" }}>
            {pageCount} page{pageCount !== 1 ? 's' : ''} available
          </span>
        </div>
      )}
    </div>
  );
};

export default CustomCanvasSelector; 