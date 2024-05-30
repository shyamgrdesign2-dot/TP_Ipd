import React, { useEffect } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import { listCertificate } from "../../redux/doctorsSlice";
import { useSelector, useDispatch } from "react-redux";

function CreateCertificate({ handleCreateCertificateDrawer, replace, selectedTemplate }) {

    const navigate = useNavigate();

    const { certificateList } = useSelector((state) => state.doctors);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listCertificate());
    }, []);

    return (
        <div className="bg-white h-100 p-20">
            <div className="titleprint mb-2">Select certificate template</div>

            {certificateList?.map((item, index) => {
                return (
                    <div key={index} onClick={() => {
                        handleCreateCertificateDrawer()
                        navigate(`/certificate`, { replace: replace, state: { certificate_data: item } })
                    }} className={`${index !== certificateList?.length - 1 && 'border-bottom'} d-flex align-items-center py-3 cursor-pointer`}>
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
                )
            })}
            <div className="d-flex align-items-center justify-content-between custom-certificate">
                <div className="title-common">Want to create custom certificate ? </div>
                <Button onClick={() => { navigate('/certificate') }} className='btn btn-input btn-41'>
                    Custom Certificate
                </Button>
            </div>
        </div>
    )
}
export default React.memo(CreateCertificate);
