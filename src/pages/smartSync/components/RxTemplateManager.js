import React, { useState } from 'react';
import { Button, Card, Dropdown, message } from 'antd';
import { Row, Col } from 'react-bootstrap';
import './RxTemplateManager.scss';
import download from '../../../assets/images/document-download.svg';
import edit from '../../../assets/images/document-edit.svg';
import trash from '../../../assets/images/trash.svg';
import alertIcon from '../../../assets/images/alertIcon.svg';
import CommonModal from '../../../common/CommonModal';
import { deleteCustomSyncPadTemplate } from '../services/uploadService';

const RxTemplateManager = ({
  onClose,
  templates,
  onUploadNew,
  onEdit,
  onDelete,
  onDownload,
  onRefresh,
  downloadingTemplateId
}) => {
  return (
    <div className="template-manager">
      <Card bordered={false} className="search-modalCard">
        <div
          className="modalCard-header align-items-center justify-content-between d-flex"
          style={{
            position: "sticky",
            top: "0px",
            zIndex: 2,
            height: "90px",
          }}
        >
          <div className="align-items-center d-flex">
            <Button
              type="text"
              className="btn btn-delete-prescription px-3 focus-none h-100"
              onClick={onClose}
            >
              <i className="icon-Cross fs-3"></i>
            </Button>
            <div className="modal-title">Add/Edit Rx Canvas</div>
          </div>
          <div style={{ padding: "20px" }}>
            <Button
              className="btn-41 btn ant-btn-text btn-input"
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
              onClick={onUploadNew}
            >
              <i className="icon-plus" style={{ fontSize: "12px" }}></i>
              Add New Rx Canvas
            </Button>
          </div>
        </div>

        {/* Template Grid */}
        <div className="d-flex justify-content-center flex-column">
          {templates && templates.length > 0 ? (
            <Row
              xs={1}
              sm={2}
              md={2}
              lg={3}
              className="gy-4 w-100"
              style={{ padding: "25px" }}
            >
              {templates.map((template, index) => (
                <Col key={template.id || index} className="gx-4">
                  <TemplateCard
                    template={template}
                    onEdit={() => onEdit(template.id)}
                    onDelete={() => onDelete(template.id)}
                    onDownload={() => onDownload(template.id)}
                    onRefresh={onRefresh}
                    isDownloading={downloadingTemplateId === template.id}
                    templates={templates}
                    onClose={onClose}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div style={{ 
              textAlign: "center", 
              padding: "50px", 
              color: "#6c757d" 
            }}>
              <i className="icon-template" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
              <div style={{ fontSize: '16px', marginBottom: '8px' }}>No templates found</div>
              <div style={{ fontSize: '14px' }}>Upload your first custom Rx canvas template</div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

const TemplateCard = ({ template, onEdit, onDelete, onDownload, onRefresh, isDownloading, templates, onClose }) => {
  const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const isLastTemplate = templates && templates.length === 1;
    
    try {
      const result = await deleteCustomSyncPadTemplate(template.id);
      if (result.success) {
        message.success('Template deleted successfully');
        
        if (isLastTemplate) {
          onClose();
        }
        
        onRefresh();
        setShowDeletePopup(false);
      } else {
        message.error(result.error || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      message.error('Failed to delete template. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Get thumbnail URL for display
  const thumbnailUrl = template.uploaded_files && template.uploaded_files.length > 0 
    ? template.uploaded_files[0].file_url 
    : null;

  const dropdownItems = [
    {
      key: 'edit',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={edit} alt="Edit" width="16" height="16" />
          Edit
        </div>
      ),
      onClick: () => onEdit(),
    },
    {
      key: 'download',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={download} alt="Download" width="16" height="16" />
          Download
        </div>
      ),
      onClick: () => onDownload(),
    },
    {
      key: 'delete',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={trash} alt="Delete" width="16" height="16" />
          Delete
        </div>
      ),
      onClick: () => setShowDeletePopup(true),
      danger: true,
    },
  ];

  return (
    <>
      <Card
        className="record-card"
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          cursor: "pointer",
          height: "300px",
          position: "relative",
        }}
        bodyStyle={{ padding: 0 }}
        hoverable
      >
        <div
          className="image-container"
          style={{
            backgroundImage: thumbnailUrl ? `url('${thumbnailUrl}')` : 'none',
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            cursor: "pointer",
          }}
        >
          {isDownloading && (
            <div className="downloading-overlay">
              <span>Downloading...</span>
            </div>
          )}
          {!thumbnailUrl && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#6c757d'
            }}>
              <i className="icon-template" style={{ fontSize: '32px', marginBottom: '8px' }}></i>
              <div style={{ fontSize: '12px' }}>No Preview</div>
            </div>
          )}
        </div>

        <div style={{ padding: "15px" }}>
          <div className="d-flex justify-content-between align-items-start">
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#333",
                  marginBottom: "4px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {template.title || 'Untitled Template'}
              </div>
              <div style={{ fontSize: "12px", color: "#6c757d" }}>
                {template.uploaded_files?.length || 0} files
              </div>
            </div>
            
            <Dropdown
              menu={{ items: dropdownItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button 
                type="text" 
                size="small"
                style={{ padding: "4px 8px" }}
                onClick={(e) => e.stopPropagation()}
              >
                <i className="icon-more-horizontal"></i>
              </Button>
            </Dropdown>
          </div>
        </div>
      </Card>

      <CommonModal
        isModalOpen={shouldShowDeletePopup}
        setIsModalOpen={setShowDeletePopup}
        centered={true}
        modalIcon={alertIcon}
        modalTitle="Delete Template"
        modalBody="Are you sure you want to delete this template? This action cannot be undone."
        primaryBtnText={isDeleting ? "Deleting..." : "Delete"}
        secondaryBtnText="Cancel"
        primaryBtnHandler={handleDelete}
        primaryBtnLoading={isDeleting}
        primaryBtnDanger={true}
      />
    </>
  );
};

export default RxTemplateManager; 