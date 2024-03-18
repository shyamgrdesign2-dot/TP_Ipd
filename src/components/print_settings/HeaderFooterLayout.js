import React, { useState, useCallback,useContext } from "react";
import { Col, Radio, Row, Form, Switch, Button, Input, Checkbox, message } from "antd";
import Cropper from "react-cropper";

import PrintSettingsContext from '../../context/PrintSettingsContext';

import CommonModal from '../../common/CommonModal';
import { MESSAGE_KEY } from "../../utils/constants";

import defaultprofile from "../../assets/images/default-profile.svg";
import rxDisplayArea from '../../assets/images/rx-display-area.svg';
import wtsp from '../../assets/images/wtsp.svg';

import "cropperjs/dist/cropper.css";

const { TextArea } = Input;

function HeaderFooterLayout() {

    const cropperHeaderRef = React.createRef();
    const cropperFooterRef = React.createRef();

    const { printSettings, setPrintSettings, fileHeader, setFileHeader, fileFooter, setFileFooter } = useContext(PrintSettingsContext);

    const [headerFooterShowHide, setHeaderFooterShowHide] = useState(false);
    const [patientInfoShowHide, setPatientInfoShowHide] = useState(false);
    const [settingsShowHide, setSettingsShowHide] = useState(false);

    const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
    const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);

    //TAB_HEADER_FOOTER
    const onHeaderFooterClick = useCallback(
        () => {
            setHeaderFooterShowHide(!headerFooterShowHide)
        },
        [headerFooterShowHide]
    );

    const onLetterheadFormatChange = useCallback(
        (e) => {
            printSettings.letterhead_format = e.target.value
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    const onPatientInfoClick = useCallback(
        () => {
            setPatientInfoShowHide(!patientInfoShowHide)
        },
        [patientInfoShowHide]
    );

    const onSettingsClick = useCallback(
        () => {
            setSettingsShowHide(!settingsShowHide)
        },
        [settingsShowHide]
    );

    //Custom
    //Doctor’s information
    const onDoctorInfoSwitchChange = useCallback(
        (checked) => {
            printSettings.header_footer.header.doctor_info.enable = checked ? 'Y' : 'N'
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    const onDoctorInfoPlaceChange = useCallback(
        (e) => {
            printSettings.header_footer.header.doctor_info.place = e.target.value
            printSettings.header_footer.header.clinic_info.place = e.target.value === 'L' ? 'R' : 'L'
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    const onDoctorInfoHeaderChange = useCallback(
        (e) => {
            printSettings.header_footer.header.doctor_info.header = e.target.value
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    const onDoctorInfoSubHeaderChange = useCallback(
        (e) => {
            printSettings.header_footer.header.doctor_info.subheader = e.target.value
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    //Clinic’s information
    const onClinicInfoSwitchChange = useCallback(
        (checked) => {
            printSettings.header_footer.header.clinic_info.enable = checked ? 'Y' : 'N'
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    const onClinicInfoPlaceChange = useCallback(
        (e) => {
            printSettings.header_footer.header.clinic_info.place = e.target.value
            printSettings.header_footer.header.doctor_info.place = e.target.value === 'L' ? 'R' : 'L'
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    const onClinicInfoHeaderChange = useCallback(
        (e) => {
            printSettings.header_footer.header.clinic_info.header = e.target.value
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    const onClinicInfoSubHeaderChange = useCallback(
        (e) => {
            printSettings.header_footer.header.clinic_info.subheader = e.target.value
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    //Logo on Header
    const onLogoSwitchChange = useCallback(
        (checked) => {
            printSettings.logo_enable = checked ? 'Y' : 'N'
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    //Upload Letterhead
    //Header Image
    const showHideHeaderModal = useCallback(() => {
        setIsHeaderModalOpen(!isHeaderModalOpen);
    }, [isHeaderModalOpen]);

    const handleHeaderChange = (e) => {
        if (e.target.files?.length > 0) {
            const fileUrl = e.target.files[0];
            if (fileUrl.size <= 2000000) {
                const reader = new FileReader();
                reader.onload = () => {
                    setFileHeader({ headerImageShow: false, crop: true, showFile: reader.result, originalFile: fileUrl })
                    showHideHeaderModal()
                };
                reader.readAsDataURL(fileUrl);
            } else {
                message.open({
                    key: MESSAGE_KEY,
                    type: 'warning',
                    content: 'Please upload image below 2mb',
                    duration: 2
                });
            }
        }
    }

    const getHeaderCropData = () => {
        if (typeof cropperHeaderRef.current?.cropper !== "undefined") {
            setFileHeader({ ...fileHeader, crop: false, showFile: cropperHeaderRef.current?.cropper.getCroppedCanvas().toDataURL() })
        }
    };

    const getHeaderCropChangeData = () => {
        if (fileHeader && !fileHeader?.crop) {
            const reader = new FileReader();
            reader.onload = () => {
                setFileHeader({ ...fileHeader, headerImageShow: false, crop: true, showFile: reader.result })
            };
            reader.readAsDataURL(fileHeader.originalFile);
        }
    };

    const onHeaderImageSubmit = () => {
        setFileHeader({ ...fileHeader, headerImageShow: true })
        showHideHeaderModal()
    };

    //Footer Image
    const showHideFooterModal = useCallback(() => {
        setIsFooterModalOpen(!isFooterModalOpen);
    }, [isFooterModalOpen]);

    const handleFooterChange = (e) => {
        if (e.target.files?.length > 0) {
            const fileUrl = e.target.files[0];
            if (fileUrl.size <= 2000000) {
                const reader = new FileReader();
                reader.onload = () => {
                    setFileFooter({ footerImageShow: false, crop: true, showFile: reader.result, originalFile: fileUrl })
                    showHideFooterModal()
                };
                reader.readAsDataURL(fileUrl);
            } else {
                message.open({
                    key: MESSAGE_KEY,
                    type: 'warning',
                    content: 'Please upload image below 2mb',
                    duration: 2
                });
            }
        }
    }

    const getFooterCropData = () => {
        if (typeof cropperFooterRef.current?.cropper !== "undefined") {
            setFileFooter({ ...fileFooter, crop: false, showFile: cropperFooterRef.current?.cropper.getCroppedCanvas().toDataURL() })
        }
    };

    const getFooterCropChangeData = () => {
        if (fileFooter && !fileFooter?.crop) {
            const reader = new FileReader();
            reader.onload = () => {
                setFileFooter({ ...fileFooter, footerImageShow: false, crop: true, showFile: reader.result })
            };
            reader.readAsDataURL(fileFooter.originalFile);
        }
    };

    const onFooterImageSubmit = () => {
        setFileFooter({ ...fileFooter, footerImageShow: true })
        showHideFooterModal()
    };

    return (
        <div className="px-3 form_addnewpatient">
            <div className="border-bottom pb-3 mb-3">
                <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                    <Col lg="18">
                        <div className="titleprint">Header & Footer</div>
                    </Col>
                    <Col lg="6">
                        <Button className="btn rounded-10px px-1 border" style={{ transform: headerFooterShowHide ? "rotate(90deg)" : "rotate(-90deg)" }} onClick={onHeaderFooterClick}>
                            <i className="icon-right"></i>
                        </Button>
                    </Col>
                </Row>
                <div>Setup your header and Footer</div>

                {headerFooterShowHide && (
                    <div className="mt-4">
                        <div className="mt-3">
                            <Form.Item className="mb-0">
                                <label className="mb-1 title-common">Select Letterhead Format</label>
                                <Radio.Group className="d-flex gender-radio all-change-radio" onChange={onLetterheadFormatChange} value={printSettings?.letterhead_format}>
                                    <Radio.Button className="w-100 text-center" value={0}>Custom</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value={1}>Upload Letterhead</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value={2}>Own Letterhead</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </div>

                        {printSettings?.letterhead_format === 0 ? (
                            // For Custom tab  
                            <div className="mt-5">
                                <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                    <Col lg="18">
                                        <div className="title-common">Doctor’s information</div>
                                    </Col>
                                    <Col lg="6">
                                        <Switch onChange={onDoctorInfoSwitchChange} checked={printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' ? true : false} />
                                    </Col>
                                </Row>

                                {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' && (
                                    <>
                                        <Form.Item>
                                            <Radio.Group className="d-flex gender-radio" onChange={onDoctorInfoPlaceChange} value={printSettings?.header_footer?.header?.doctor_info?.place}>
                                                <Radio.Button className="w-100 text-center" value="L">Left</Radio.Button>
                                                <Radio.Button className="w-100 text-center" value="R">Right</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                        <div className="mt-3">
                                            <Form.Item>
                                                <label className="mb-1">Header</label>
                                                <Input className='inputheight41-group' onChange={onDoctorInfoHeaderChange} value={printSettings?.header_footer?.header?.doctor_info?.header} />
                                            </Form.Item>
                                        </div>
                                        <div className="mt-3">
                                            <Form.Item>
                                                <label className="mb-1">Subheader</label>
                                                <TextArea
                                                    className="endreason-textarea subheader-textarea"
                                                    style={{
                                                        resize: "none"
                                                    }}
                                                    onChange={onDoctorInfoSubHeaderChange}
                                                    value={printSettings?.header_footer?.header?.doctor_info?.subheader}
                                                />
                                            </Form.Item>
                                        </div>
                                    </>
                                )}

                                <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                    <Col lg="18">
                                        <div className="title-common">Clinic’s information</div>
                                    </Col>
                                    <Col lg="6">
                                        <Switch onChange={onClinicInfoSwitchChange} checked={printSettings?.header_footer?.header?.clinic_info?.enable === 'Y' ? true : false} />
                                    </Col>
                                </Row>

                                {printSettings?.header_footer?.header?.clinic_info?.enable === 'Y' && (
                                    <>
                                        <Form.Item>
                                            <Radio.Group className="d-flex gender-radio" onChange={onClinicInfoPlaceChange} value={printSettings?.header_footer?.header?.clinic_info?.place}>
                                                <Radio.Button className="w-100 text-center" value="L">Left</Radio.Button>
                                                <Radio.Button className="w-100 text-center" value="R">Right</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                        <div className="mt-3">
                                            <Form.Item>
                                                <label className="mb-1">Header</label>
                                                <Input className='inputheight41-group' onChange={onClinicInfoHeaderChange} value={printSettings?.header_footer?.header?.clinic_info?.header} />
                                            </Form.Item>
                                        </div>
                                        <div className="mt-3">
                                            <Form.Item>
                                                <label className="mb-1">Subheader</label>
                                                <TextArea
                                                    className="endreason-textarea subheader-textarea"
                                                    style={{
                                                        resize: "none"
                                                    }}
                                                    onChange={onClinicInfoSubHeaderChange}
                                                    value={printSettings?.header_footer?.header?.clinic_info?.subheader}
                                                />
                                            </Form.Item>
                                        </div>
                                    </>
                                )}

                                <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                    <Col lg="18">
                                        <div className="title-common">Logo on Header</div>
                                    </Col>
                                    <Col lg="6">
                                        <Switch onChange={onLogoSwitchChange} checked={printSettings?.logo_enable === 'Y' ? true : false} />
                                    </Col>
                                </Row>

                                {printSettings?.logo_enable === 'Y' && (
                                    <div className="upload-headfoot upload-headfoot1 p-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="text-start fontroboto">Upload a picture of your<br /> Logo</div>
                                            <div className="btn btn-input btn-41 d-flex align-items-center justify-content-center">
                                                <Form.Item name="pm_image" />
                                                <input type="file" accept="image/*" />
                                                <span><i className="icon-upload me-2"></i>Upload</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                                    <Col lg="18">
                                        <div className="title-common"><img className="img-fluid me-2" width={25} src={wtsp} alt="Header" /> See whatsApp Rx preview </div>
                                    </Col>
                                    <Col lg="6">
                                        <div className="d-flex align-items-center">
                                            <i className="icon-Preview"></i>
                                            <button className='btn btn-text'>
                                                <span>Default Settings</span>
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ) : printSettings?.letterhead_format === 1 ? (
                            //For Upload Letter head tab
                            <div className="mt-5">
                                <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                                    <Col lg="24">
                                        <div className="title-common">Upload your header and footer image</div>
                                    </Col>
                                </Row>
                                <div className="upload-headfoot">
                                    <div className="fw-medium text-decoration-underline cursor-pointer">Upload Header</div>
                                    <input key={Math.random()} className="image-upload-input" type="file" accept="image/*" onChange={handleHeaderChange} />
                                    <CommonModal
                                        handleCancel={true}
                                        isModalOpen={isHeaderModalOpen}
                                        onCancel={showHideHeaderModal}
                                        modalWidth={744}
                                        // title={"Crope Image"}
                                        title={
                                            <div className='d-flex'>
                                                <div className='align-items-center d-flex w-100'>
                                                    <div className="text-truncate-twolines">{'Crope Image'}</div>
                                                </div>
                                                <Button type='button' className="btn-41 btn px-4 btn-primary3 me-4" onClick={onHeaderImageSubmit}>
                                                    Submit
                                                </Button>
                                            </div>
                                        }
                                        modalBody={
                                            <>
                                                <div className="d-flex image-crop bg-dark justify-content-center align-items-center">
                                                    {fileHeader && fileHeader.crop ? (
                                                        <Cropper
                                                            ref={cropperHeaderRef}
                                                            // zoomTo={0.5}
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                            // initialAspectRatio={1}
                                                            preview=".img-preview"
                                                            src={fileHeader ? fileHeader?.showFile : defaultprofile}
                                                            viewMode={3}
                                                            background={false}
                                                            autoCropArea={0.3}
                                                            guides={false}
                                                        />
                                                    ) : (
                                                        <img
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                            src={fileHeader ? fileHeader?.showFile : defaultprofile} />
                                                    )}
                                                </div>
                                                <div className="mt-4">
                                                    <div className="d-flex align-items-center mt-2 justify-content-between">
                                                        <div className="fw-normal text-decoration-underline btn p-0 text-main" onClick={showHideHeaderModal}>
                                                            {fileHeader && !fileHeader?.crop ? '' : 'Discard'}
                                                        </div>
                                                        <div className="fw-normal text-decoration-underline btn p-0 text-main" onClick={() => fileHeader && !fileHeader?.crop ? getHeaderCropChangeData() : getHeaderCropData()}>
                                                            {fileHeader && !fileHeader?.crop ? 'Change' : 'Save'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <div className="fs-12-1 fontroboto"> Only jpg, jpeg or png files with the max size 2mb.</div>
                                    <Button className="btn btn-headfoot"><i className="icon-Edit me-1"></i>Edit</Button>
                                </div>
                                <div className="upload-headfoot">
                                    <div className="fw-medium text-decoration-underline cursor-pointer">Upload Footer</div>
                                    <input key={Math.random()} className="image-upload-input" type="file" accept="image/*" onChange={handleFooterChange} />
                                    <CommonModal
                                        handleCancel={true}
                                        isModalOpen={isFooterModalOpen}
                                        onCancel={showHideFooterModal}
                                        modalWidth={744}
                                        // title={"Crope Image"}
                                        title={
                                            <div className='d-flex'>
                                                <div className='align-items-center d-flex w-100'>
                                                    <div className="text-truncate-twolines">{'Crope Image'}</div>
                                                </div>
                                                <Button type='button' className="btn-41 btn px-4 btn-primary3 me-4" onClick={onFooterImageSubmit}>
                                                    Submit
                                                </Button>
                                            </div>
                                        }
                                        modalBody={
                                            <>
                                                <div className="d-flex image-crop bg-dark justify-content-center align-items-center">
                                                    {fileFooter && fileFooter.crop ? (
                                                        <Cropper
                                                            ref={cropperFooterRef}
                                                            // zoomTo={0.5}
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                            // initialAspectRatio={1}
                                                            preview=".img-preview"
                                                            src={fileFooter ? fileFooter?.showFile : defaultprofile}
                                                            viewMode={3}
                                                            background={false}
                                                            autoCropArea={0.3}
                                                            guides={false}
                                                        />
                                                    ) : (
                                                        <img
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                            src={fileFooter ? fileFooter?.showFile : defaultprofile} />
                                                    )}
                                                </div>
                                                <div className="mt-4">
                                                    <div className="d-flex align-items-center mt-2 justify-content-between">
                                                        <div className="fw-normal text-decoration-underline btn p-0 text-main" onClick={showHideFooterModal}>
                                                            {fileFooter && !fileFooter?.crop ? '' : 'Discard'}
                                                        </div>
                                                        <div className="fw-normal text-decoration-underline btn p-0 text-main" onClick={() => fileFooter && !fileFooter?.crop ? getFooterCropChangeData() : getFooterCropData()}>
                                                            {fileFooter && !fileFooter?.crop ? 'Change' : 'Save'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <div className="fs-12-1 fontroboto"> Only jpg, jpeg or png files with the max size 2mb.</div>
                                    <Button className="btn btn-headfoot"><i className="icon-Edit me-1"></i>Edit</Button>
                                </div>
                                <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                                    <Col lg="18">
                                        <div className="title-common"><img className="img-fluid me-2" width={25} src={wtsp} alt="Header" />See whatsApp Rx preview </div>
                                    </Col>
                                    <Col lg="6">
                                        <div className="d-flex align-items-center">
                                            <i className="icon-Preview"></i>
                                            <button className='btn btn-text'>
                                                <span>Default Settings</span>
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ) : (
                            // For Own Letterhead tab 
                            <div className="mt-5">
                                <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                                    <Col lg="24">
                                        <div className="title-common">Set page margins to display your own letterhead</div>
                                    </Col>
                                </Row>
                                <div className="">
                                    <div className="my-3 text-center">
                                        <label className="mb-1">Top (cm)</label> <br />
                                        <Input className='inputheight41-group' style={{ width: 70 }} />
                                    </div>
                                    <Row className="align-items-center justify-content-around form_addnewpatient mb-1">
                                        <Col lg="6">
                                            <div className="text-center">
                                                <label className="mb-1">Left (cm)</label> <br />
                                                <Input className='inputheight41-group' style={{ width: 70 }} />
                                            </div>
                                        </Col>
                                        <Col lg="12">
                                            <img src={rxDisplayArea} />
                                        </Col>
                                        <Col lg="6">
                                            <div className="text-center">
                                                <label className="mb-1">Right (cm)</label> <br />
                                                <Input className='inputheight41-group' style={{ width: 70 }} />
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="my-3 text-center">
                                        <Input className='inputheight41-group' style={{ width: 70 }} /> <br />
                                        <label className="mb-1">Bottom (cm)</label>
                                    </div>
                                </div>
                                <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                                    <Col lg="18">
                                        <div className="title-common"><img className="img-fluid me-2" width={25} src={wtsp} alt="Header" />See whatsApp Rx preview </div>
                                    </Col>
                                    <Col lg="6">
                                        <div className="d-flex align-items-center">
                                            <i className="icon-Preview"></i>
                                            <button className='btn btn-text'>
                                                <span>Default Settings</span>
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )}

                    </div>
                )}

            </div>

            <div className="border-bottom pb-3 mb-3">
                <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                    <Col lg="18">
                        <div className="titleprint">Display Patient Info</div>
                    </Col>
                    <Col lg="6">
                        <Button className="btn rounded-10px px-1 border" style={{ transform: patientInfoShowHide ? "rotate(90deg)" : "rotate(-90deg)" }} onClick={onPatientInfoClick}>
                            <i className="icon-right"></i>
                        </Button>
                    </Col>
                </Row>
                <div>Manage your patient information</div>
            </div>

            <div className="mb-3">
                <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                    <Col lg="18">
                        <div className="titleprint">Other Settings</div>
                    </Col>
                    <Col lg="6">
                        <Button className="btn rounded-10px px-1 border" style={{ transform: settingsShowHide ? "rotate(90deg)" : "rotate(-90deg)" }} onClick={onSettingsClick}>
                            <i className="icon-right"></i>
                        </Button>
                    </Col>
                </Row>
                <div>Customize your watermark, signature, and QR code</div>

                {settingsShowHide && (
                    <div className="mt-4">
                        <div className="mb-3">
                            <Row justify="space-between" className="align-items-center form_addnewpatient">
                                <Col lg="18">
                                    <div className="title-common">Watermark</div>
                                </Col>
                                <Col lg="6">
                                    <Switch />
                                </Col>
                            </Row>
                            <div className="upload-headfoot upload-headfoot1 p-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <img src={defaultprofile} style={{ height: 75 }} />
                                    <div className="btn btn-input btn-41 d-flex align-items-center justify-content-center">
                                        <Form.Item name="pm_image" />
                                        <input type="file" accept="image/*" />
                                        <span><i className="icon-upload me-2"></i> Upload New</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                <Col lg="18">
                                    <div className="title-common">Signature</div>
                                </Col>
                                <Col lg="6">
                                    <Switch />
                                </Col>
                            </Row>
                            <Form.Item className="mb-0 mt-3">
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="left">left</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">right</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <div className="border rounded-10px mt-3">
                                <div className="upload-headfoot border-0 border-bottom rounded-bottom-0 mt-0">
                                    <div className="fw-medium text-decoration-underline cursor-pointer">Draw or Upload Signature</div>
                                    <Button className="btn btn-headfoot"><i className="icon-Edit me-1"></i>Edit</Button>
                                </div>
                                <div className="p-3">
                                    <div className="title-common mb-3">Include in signature</div>
                                    <div className="mb-3">
                                        <Checkbox className="switch-name-check">Name of Doctor</Checkbox>
                                    </div>
                                    <div className="mb-3">
                                        <Checkbox className="switch-name-check">Medical Registration Number</Checkbox>
                                    </div>
                                    <div className="mb-3">
                                        <Checkbox className="switch-name-check">Qualifications</Checkbox>
                                    </div>

                                    <TextArea
                                        className="endreason-textarea h-76"
                                        placeholder="Enter qualification e.g. MBBS, MS, MD"
                                        style={{
                                            resize: "none"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                <Col lg="18">
                                    <div className="title-common">Show QR code</div>
                                </Col>
                                <Col lg="6">
                                    <Switch />
                                </Col>
                            </Row>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default React.memo(HeaderFooterLayout);
