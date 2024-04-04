import React, { useContext, useState, useCallback } from 'react';
import { Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { useSelector, useDispatch } from "react-redux";

import { MESSAGE_KEY } from "../utils/constants";
import {
    getDefaultPrintsettings,
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

    const onDefaultPrintsettings = async () => {
        dispatch(getDefaultPrintsettings({ default: true }));
    };

    const onSavePrintSettingsClick = async () => {
        if (printSettings?.letterhead_format == 0 && printSettings?.header_footer?.header?.doctor_info?.enable == 'N' && printSettings?.header_footer?.header?.clinic_info?.enable == 'N' && printSettings?.logo_enable == 'N') {
            message.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: `Enable at least one option (Doctor’s information, Clinic's information, Logo on Header)`,
                duration: 2
            });
        } else if (printSettings?.letterhead_format == 1 && !fileHeader) {
            message.open({
                key: MESSAGE_KEY,
                type: 'warning',
                content: `Upload header`,
                duration: 2
            });
        } else {
            var sendData = {
                letterhead_format: printSettings?.letterhead_format,
                whatsapp_letterhead_format: printSettings?.whatsapp_letterhead_format,
                qrcode_enable: printSettings?.qrcode_enable,
                prescription: JSON.stringify(printSettings?.prescription),
                header_footer: JSON.stringify(printSettings?.header_footer),
                page_format: JSON.stringify(printSettings?.page_format),

                // logo_enable: printSettings?.letterhead_format == 0 || (printSettings?.letterhead_format == 2 && printSettings?.whatsapp_letterhead_format == 0) ?
                //     printSettings?.logo_enable
                //     : 'N',
                // logo_image: printSettings?.letterhead_format == 0 || (printSettings?.letterhead_format == 2 && printSettings?.whatsapp_letterhead_format == 0) ?
                //     fileLogo ? fileLogo?.uploadFile : ''
                //     : 'N',

                // header_image: printSettings?.letterhead_format == 1 || (printSettings?.letterhead_format == 2 && printSettings?.whatsapp_letterhead_format == 1) ?
                //     fileHeader ? fileHeader?.uploadFile : ''
                //     : '',
                // footer_image: printSettings?.letterhead_format == 1 || (printSettings?.letterhead_format == 2 && printSettings?.whatsapp_letterhead_format == 1) ?
                //     fileFooter ? fileFooter?.uploadFile : ''
                //     : '',

                logo_enable: printSettings?.logo_enable,
                logo_image: fileLogo ? fileLogo?.uploadFile : '',

                header_image: fileHeader ? fileHeader?.uploadFile : '',
                footer_image: fileFooter ? fileFooter?.uploadFile : '',

                water_mark_enable: printSettings?.water_mark_enable,
                water_mark_image: fileWatermark ? fileWatermark?.uploadFile : '',

                signature_enable: printSettings?.signature_enable,
                signature_image: fileSignature ? fileSignature?.uploadFile : '',
            }

            const action = await dispatch(savePrintsettings(sendData));
            if (action.meta.requestStatus === "fulfilled") {
                navigate(-1)
            } else {
                message.open({
                    key: MESSAGE_KEY,
                    type: 'warning',
                    content: action.error.message,
                    duration: 2
                });
            }
        }
    };

    const checkDataFillOrNot = () => {
        navigate(-1)
        // showHideBackModal()
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
                    <button className='btn btn-text me-14' onClick={onDefaultPrintsettings}>
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