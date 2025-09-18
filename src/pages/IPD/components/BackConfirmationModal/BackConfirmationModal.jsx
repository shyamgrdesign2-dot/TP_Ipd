import React from 'react';
import CommonModal from '../../../../common/CommonModal';
import alertIcon from '../../../../assets/images/alertIcon.svg';
import { Button } from 'antd';

export default function BackConfirmationModal ({ isModalOpen, onCancel, onConfirm }) {
  return (
    <CommonModal
      isModalOpen={isModalOpen}
      onCancel={onCancel}
      modalWidth={500}
      title="You may lose your data"
      modalBody={
        <>
          <div className="alert-warning rounded-10px p-2 patient-details">
            <div className="d-flex align-items-center">
              <img className="me-3" src={alertIcon} alt="Warning" />
              <span>
                Are you sure you want to leave? <br />
                You will lose your unsaved data.
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="d-flex align-items-center mt-2 justify-content-end">
              <div
                onClick={onConfirm}
                className="me-4 text-decoration-underline btn p-0 text-main"
              >
                Yes Leave
              </div>
              <Button
                onClick={onCancel}
                className="lh-lg btn btn-primary3 btn-41 px-4"
              >
                <span>No, Stay</span>
              </Button>
            </div>
          </div>
        </>
      }
    />
  );
};
