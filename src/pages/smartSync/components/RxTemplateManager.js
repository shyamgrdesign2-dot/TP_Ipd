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
  onRefresh 
}) => {
  console.log('🎯 RxTemplateManager rendered with:', templates?.length, 'templates');

  return (
    <div className="template-manager">
      <Card bordered={false} className="search-modalCard">
        {/* Header Section - Following Medical Records Pattern */}
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
              <i className="icon-Add" />
              <span>Add New Rx Canvas</span>
            </Button>
          </div>
        </div>

        {/* Template Grid - Following Medical Records Pattern */}
        <div className="d-flex justify-content-center flex-column">
          <Row
            xs={1}
            sm={2}
            md={2}
            lg={3}
            className="gy-4 w-100"
            style={{ padding: "0 0 50px 24px" }}
          >
            {templates?.map((template, index) => (
              <Col key={template.id || index} className="gx-4">
                <TemplateCard
                  template={template}
                  onEdit={() => onEdit(template.id)}
                  onDelete={() => onDelete(template.id)}
                  onDownload={() => onDownload(template.id)}
                  onRefresh={onRefresh}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Card>
    </div>
  );
};

// Template Card Component - Following RecordCard Pattern
const TemplateCard = ({ template, onEdit, onDelete, onDownload, onRefresh }) => {
  const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCustomSyncPadTemplate(template.id);
      if (result.success) {
        message.success('Template deleted successfully');
        onRefresh(); // Refresh the templates list
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

  const toggleDeletePopup = () => {
    setShowDeletePopup(prev => !prev);
  };

  const getMenuItems = () => [
    {
      label: (
        <div onClick={onDownload}>
          <img src={download} alt="download" className="me-2" />
          Download
        </div>
      ),
      key: "download",
    },
    {
      label: (
        <div onClick={onEdit}>
          <img src={edit} alt="edit" className="me-2" />
          Edit
        </div>
      ),
      key: "edit",
    },
    {
      label: (
        <div onClick={toggleDeletePopup}>
          <img src={trash} alt="delete" className="me-2" />
          Delete
        </div>
      ),
      key: "delete",
    },
  ];

  // Get first uploaded file for thumbnail
  const thumbnailUrl = template.uploaded_files?.[0]?.file_url;
  const pageCount = template.uploaded_files?.length || 0;

  return (
    <>
      <div className="image-wrapper">
        <div
          className="image-container"
          style={{
            backgroundImage: thumbnailUrl ? `url('${thumbnailUrl}')` : 'none',
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          onClick={() => onDownload()} // Click to preview/download
        >
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

        <div className="document-details">
          <div
            className="d-flex justify-content-between flex-column align-items-start"
            style={{ fontSize: "14px", width: "85%" }}
          >
            <div className="category">{template.title}</div>
            <div>{pageCount} page{pageCount !== 1 ? 's' : ''}</div>
          </div>
          <div>
            <Dropdown
              className="btn btn-outline btn-more"
              menu={{
                items: getMenuItems(),
              }}
            >
              <div>
                <i className="icon-More" />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - Following Medical Records Pattern */}
      {shouldShowDeletePopup && (
        <CommonModal
          isModalOpen={shouldShowDeletePopup}
          onCancel={toggleDeletePopup}
          modalWidth={510}
          title="You may lose your data"
          modalBody={
            <>
              <div className="alert-warning rounded-10px p-2 patient-details">
                <div className="d-flex align-items-center">
                  <img className="me-3" src={alertIcon} alt="Warning" />
                  <span>Are you sure you want to delete this template?</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="d-flex align-items-center mt-2 justify-content-end">
                  <div
                    onClick={handleDelete}
                    className="me-4 text-decoration-underline btn p-0 text-main"
                    style={{ 
                      pointerEvents: isDeleting ? 'none' : 'auto',
                      opacity: isDeleting ? 0.6 : 1 
                    }}
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                  </div>
                  <Button
                    onClick={toggleDeletePopup}
                    className="lh-lg btn btn-primary3 btn-41 px-4"
                    disabled={isDeleting}
                  >
                    <span>No</span>
                  </Button>
                </div>
              </div>
            </>
          }
        />
      )}
    </>
  );
};

export default RxTemplateManager; 