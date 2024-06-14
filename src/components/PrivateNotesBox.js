import React, { useCallback, useState } from "react";
import { Button, Card, Input } from 'antd';

import CommonModal from '../common/CommonModal';
import alertIcon from '../assets/images/alertIcon.svg';

function PrivateNotesBox(props) {
    const { handleDrawerPrivateNotes } = props

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showHideModal = useCallback(() => {
        setIsModalOpen(!isModalOpen);
    }, [isModalOpen]);

    return (
        <>
            <Card bordered={false} className="search-modalCard bg-body">
                <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                    <div className='align-items-center d-flex'>
                        <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100' onClick={handleDrawerPrivateNotes}>
                            <i className='icon-Cross fs-3'></i>
                        </Button>
                        <div className="modal-title">Add Private Note</div>
                    </div>
                    <Button className='btn btn-primary3 btn-41 px-4 me-20' disabled>
                        Save
                    </Button>
                </div>
                <div className="px-20 py-3">
                    <div className="title-common mb-2"> Private Note</div>
                    <div className="text-greycolor fontroboto mb-3">
                        This note only be visible to you and will not be printed. And you will be able to see in Patient Details.
                    </div>
                    <Input.TextArea placeholder="Write your notes" className="textareaPlaceholder" rows={4} />
                    <button onClick={() => showHideModal()} className="mt-2 btn d-flex align-items-center btn-text float-end">
                        <i className="icon-delete me-2 fs-5"></i> Delete Note
                    </button>
                </div>
            </Card>
            <CommonModal
                isModalOpen={isModalOpen}
                onCancel={showHideModal}
                modalWidth={357}
                title={"Delete Note"}
                modalBody={
                    <>
                        <div className="alert-warning rounded-10px p-2 patient-details">
                            <div className="d-flex align-items-center">
                                <img className='me-3' src={alertIcon} alt="Warning" />
                                <span>
                                    Are you sure you want to delete this note?
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="d-flex align-items-center mt-2 justify-content-end">
                                <div onClick={() => {
                                    showHideModal()
                                    handleDrawerPrivateNotes()
                                }}
                                    className="me-4 text-decoration-underline btn p-0 text-main">
                                    Yes, Delete
                                </div>
                                <Button onClick={showHideModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                    <span>No, Keep</span>
                                </Button>
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}


export default React.memo(PrivateNotesBox);
