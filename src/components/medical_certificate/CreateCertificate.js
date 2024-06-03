import React, { useEffect, useCallback, useState, useMemo } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import CommonModal from '../../common/CommonModal';

import alertIcon from '../../assets/images/alertIcon.svg';
import { listCertificate } from "../../redux/doctorsSlice";
import { useSelector, useDispatch } from "react-redux";

function CreateCertificate({ handleCreateCertificateDrawer, replace, selectedTemplate }) {

    const navigate = useNavigate();

    const { certificateList } = useSelector((state) => state.doctors);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listCertificate());
    }, []);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [removeId, setRemoveId] = useState(null);

    const showHideModal = useCallback((id) => {
        id !== undefined ? setRemoveId(id) : setRemoveId(null)
        setIsModalOpen(!isModalOpen);
    }, [isModalOpen]);

    const onDeleteClicked = async (id) => {
        alert(id)
    };

    const DELETE_MODAL = useMemo(() => {
        return (
            <CommonModal
                isModalOpen={isModalOpen}
                onCancel={showHideModal}
                modalWidth={357}
                title={"Delete Certificate"}
                modalBody={
                    <>
                        <div className="alert-warning rounded-10px p-2 patient-details">
                            <div className="d-flex align-items-center">
                                <img className='me-3' src={alertIcon} alt="Warning" />
                                <span>
                                    Are you sure you want to delete this certificate?
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="d-flex align-items-center mt-2 justify-content-end">
                                <div onClick={() => {
                                    onDeleteClicked(removeId)
                                    showHideModal()
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
        );
    }, [isModalOpen]);

    return (
        <div className="bg-white overflow-y-auto p-20" style={{ height: 'calc( 100vh - 61px)' }}>
            <div className="titleprint mb-2">Select certificate template</div>

            {certificateList?.map((item, index) => {
                return (
                    <div key={index} className={`${index !== certificateList?.length - 1 && 'border-bottom'} d-flex align-items-center py-3 cursor-pointer`}>
                        <div onClick={() => {
                            handleCreateCertificateDrawer()
                            navigate(`/certificate`, { replace: replace, state: { certificate_data: item } })
                        }} className="d-flex w-100 align-items-center justify-content-between">
                            <div className="bg-fitness">
                                {item?.title[0]}
                            </div>
                            <div className="d-flex w-100 align-items-center justify-content-between">
                                <div className={`title-common ${selectedTemplate == item?.id && 'text-primary'}`}>
                                    {item.title}
                                </div>
                                {selectedTemplate == item?.id && (
                                    <i className="icon-check text-primary"></i>
                                )}
                            </div>
                        </div>
                        {selectedTemplate != item?.id && !item?.pms_default && (
                            <Button onClick={() => showHideModal(item?.id)} className="btn btn-delete-prescription px-1"><i className="icon-delete"></i></Button>
                        )}
                    </div>
                )
            })}
            <div className="d-flex align-items-center justify-content-between custom-certificate position-sticky" style={{ bottom: 0 }}>
                <div className="title-common">Want to create custom certificate ? </div>
                <Button onClick={() => { navigate('/certificate') }} className='btn btn-input btn-41'>
                    Custom Certificate
                </Button>
            </div>
            {DELETE_MODAL}
        </div>
    )
}
export default React.memo(CreateCertificate);
