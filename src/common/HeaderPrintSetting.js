import React, { useContext, useState, useCallback } from 'react';
import { Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { useSelector, useDispatch } from "react-redux";

import { MESSAGE_KEY } from "../utils/constants";
import {
    savePrintsettings,
} from "../redux/doctorsSlice";

import CommonModal from './CommonModal';
import alertIcon from '../assets/images/alertIcon.svg';

import PrintSettingsContext from '../context/PrintSettingsContext';

function HeaderPrintSetting() {
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.doctors);
    const dispatch = useDispatch();

    const { printSettings, fileHeader, fileFooter, fileLogo, fileWatermark, fileSignature } = useContext(PrintSettingsContext);

    const [isBackModalOpen, setIsBackModalOpen] = useState(false);

    const onSavePrintSettingsClick = async () => {
        var sendData = {
            letterhead_format: printSettings?.letterhead_format,
            whatsapp_letterhead_format: printSettings?.whatsapp_letterhead_format,
            logo_enable: printSettings?.logo_enable,
            water_mark_enable: printSettings?.water_mark_enable,
            signature_enable: printSettings?.signature_enable,
            qrcode_enable: printSettings?.qrcode_enable,
            prescription: JSON.stringify(printSettings?.prescription),
            header_footer: JSON.stringify(printSettings?.header_footer),
            page_format: JSON.stringify(printSettings?.page_format),

            logo_image: fileLogo ? fileLogo?.uploadFile : '',
            header_image: fileHeader ? fileHeader?.uploadFile : '',
            footer_image: fileFooter ? fileFooter?.uploadFile : '',
            water_mark_image: fileWatermark ? fileWatermark?.uploadFile : '',
            signature_image: fileSignature ? fileSignature?.uploadFile : '',
        }
        console.log(sendData)

        const action = await dispatch(savePrintsettings(sendData));
        if (action.meta.requestStatus === "fulfilled") {

        } else {
            message.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: action.error.message,
                duration: 2
            });
        }

    };

    const checkDataFillOrNot = () => {
        showHideBackModal()
    }

    const showHideBackModal = useCallback(() => {
        setIsBackModalOpen(!isBackModalOpen);
    }, [isBackModalOpen]);

    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <div className='align-items-center d-flex w-100 h-100 justify-content-between'>
                <div className='align-items-center d-flex h-100 w-100'>
                    <div className='border-end h-100 text-center me-2'>
                        <div onClick={checkDataFillOrNot} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                            <i className='icon-right'></i>
                        </div>
                        <CommonModal
                            isModalOpen={isBackModalOpen}
                            onCancel={showHideBackModal}
                            modalWidth={500}
                            title={"You may lose your data"}
                            modalBody={
                                <>
                                    <div className="alert-warning rounded-10px p-2 patient-details">
                                        <div className="d-flex align-items-center">
                                            <img className='me-3' src={alertIcon} alt="Warning" />
                                            <span>
                                                Are you sure you want to leave? <br />
                                                You will permanently lose your data.
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="d-flex align-items-center mt-2 justify-content-end">
                                            <div onClick={() => navigate('/', { replace: true })} className="me-4 text-decoration-underline btn p-0 text-main">
                                                Yes Leave
                                            </div>
                                            <Button onClick={showHideBackModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                                <span>No, Stay</span>
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            }
                        />
                    </div>
                    <div className='title-common'>
                        Configure Print Setting
                    </div>
                </div>
                <div className='d-flex align-items-center justify-content-end w-100'>
                    <button className='btn btn-text me-14'>
                        <span>Default Settings</span>
                    </button>
                    <Button type='button' className="btn-41 btn px-4 btn-primary3 me-4" onClick={onSavePrintSettingsClick} loading={loading}>
                        Save
                    </Button>
                </div>
            </div>
        </Navbar>
    );
}

export default React.memo(HeaderPrintSetting);