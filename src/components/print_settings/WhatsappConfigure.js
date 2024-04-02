import React, { useState, useEffect, useCallback, useContext } from "react";
import { Col, Radio, Row, Form, Switch, Button, Input, message } from "antd";
import Cropper from "react-cropper";
import { Navbar } from 'react-bootstrap';

import Quixote from "../../pages/Quixote";
import PrintSettingsContext from '../../context/PrintSettingsContext';

import CommonModal from '../../common/CommonModal';
import { MESSAGE_KEY, WHATSAPP } from "../../utils/constants";
import { dataUrlToFileUsingFetch } from "../../utils/utils";

import wtsp from '../../assets/images/wtsp.svg';

import defaultprofile from "../../assets/images/default-profile.svg";

const { TextArea } = Input;

function WhatsappConfigure(props) {

    const { handleDrawerOwnLetterHead } = props

    const inputHeaderFile = React.createRef();
    const cropperHeaderRef = React.createRef();

    const inputFooterFile = React.createRef();
    const cropperFooterRef = React.createRef();

    const inputLogoFile = React.createRef();

    const { printSettings, setPrintSettings, fileHeader, setFileHeader, fileFooter, setFileFooter, fileLogo, setFileLogo } = useContext(PrintSettingsContext);

    const [printSettingsCopy, setPrintSettingsCopy] = useState(null);
    const [fileHeaderCopy, setFileHeaderCopy] = useState(null);
    const [fileFooterCopy, setFileFooterCopy] = useState(null);
    const [fileLogoCopy, setFileLogoCopy] = useState(null);

    const [headerFooterShowHide, setHeaderFooterShowHide] = useState(false);

    const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
    const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);


    useEffect(() => {
        setPrintSettingsCopy(JSON.parse(JSON.stringify(printSettings)));
    }, [printSettings]);

    //TAB_HEADER_FOOTER
    const onWhatsappLetterheadFormatChange = useCallback(
        (e) => {
            printSettingsCopy.whatsapp_letterhead_format = e.target.value
            setPrintSettingsCopy((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettingsCopy]
    );

    //Header & Footer
    //Custom
    //Doctor’s information
    const onDoctorInfoSwitchChange = useCallback(
        (checked) => {
            printSettingsCopy.header_footer.header.doctor_info.enable = checked ? 'Y' : 'N'
            setPrintSettingsCopy((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettingsCopy]
    );

    const onDoctorInfoPlaceChange = useCallback(
        (e) => {
            printSettingsCopy.header_footer.header.doctor_info.place = e.target.value
            printSettingsCopy.header_footer.header.clinic_info.place = e.target.value === 'L' ? 'R' : 'L'
            setPrintSettingsCopy((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettingsCopy]
    );

    const onDoctorInfoHeaderChange = useCallback(
        (e) => {
            printSettingsCopy.header_footer.header.doctor_info.header = e.target.value
            setPrintSettingsCopy((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettingsCopy]
    );

    const onDoctorInfoSubHeaderChange = useCallback(
        (e) => {
            printSettingsCopy.header_footer.header.doctor_info.subheader = e.target.value
            setPrintSettingsCopy((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettingsCopy]
    );

    //Clinic’s information
    const onClinicInfoSwitchChange = useCallback(
        (checked) => {
            printSettingsCopy.header_footer.header.clinic_info.enable = checked ? 'Y' : 'N'
            setPrintSettingsCopy((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettingsCopy]
    );

    const onClinicInfoPlaceChange = useCallback(
        (e) => {
            printSettingsCopy.header_footer.header.clinic_info.place = e.target.value
            printSettingsCopy.header_footer.header.doctor_info.place = e.target.value === 'L' ? 'R' : 'L'
            setPrintSettingsCopy((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettingsCopy]
    );

    const onClinicInfoHeaderChange = useCallback(
        (e) => {
            printSettingsCopy.header_footer.header.clinic_info.header = e.target.value
            setPrintSettingsCopy((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettingsCopy]
    );

    const onClinicInfoSubHeaderChange = useCallback(
        (e) => {
            printSettingsCopy.header_footer.header.clinic_info.subheader = e.target.value
            setPrintSettingsCopy((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettingsCopy]
    );

    //Logo on Header
    const onLogoSwitchChange = useCallback(
        (checked) => {
            printSettingsCopy.logo_enable = checked ? 'Y' : 'N'
            setPrintSettingsCopy((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettingsCopy]
    );

    // Logo Image
    const handleLogoChange = (e) => {
        if (e.target.files?.length > 0) {
            const fileUrl = e.target.files[0];
            if (fileUrl.size <= 2000000 && (fileUrl.type == 'image/png' || fileUrl.type == 'image/jpeg' || fileUrl.type == 'image/jpg')) {
                setFileLogoCopy({ imageShow: true, showFile: URL.createObjectURL(fileUrl), uploadFile: fileUrl })
            } else {
                message.open({
                    key: MESSAGE_KEY,
                    type: 'warning',
                    content: 'Please upload only jpg, jpeg or png files with the max size 2mb.',
                    duration: 2
                });
            }
        }
    }

    //Upload Letterhead
    //Header Image
    const showHideHeaderModal = useCallback(() => {
        setIsHeaderModalOpen(!isHeaderModalOpen);
    }, [isHeaderModalOpen]);

    const handleHeaderChange = (e) => {
        if (e.target.files?.length > 0) {
            const fileUrl = e.target.files[0];
            if (fileUrl.size <= 2000000 && (fileUrl.type == 'image/png' || fileUrl.type == 'image/jpeg' || fileUrl.type == 'image/jpg')) {
                const reader = new FileReader();
                reader.onload = () => {
                    setFileHeaderCopy({ imageShow: false, crop: true, showFile: reader.result, originalFile: fileUrl })
                    showHideHeaderModal()
                };
                reader.readAsDataURL(fileUrl);
            } else {
                message.open({
                    key: MESSAGE_KEY,
                    type: 'warning',
                    content: 'Please upload only jpg, jpeg or png files with the max size 2mb.',
                    duration: 2
                });
            }
        }
    }

    const getHeaderCropData = async () => {
        if (typeof cropperHeaderRef.current?.cropper !== "undefined") {
            const trimData = cropperHeaderRef.current?.cropper.getCroppedCanvas().toDataURL(fileHeaderCopy.originalFile.type);
            const uploadFile = await dataUrlToFileUsingFetch(trimData, "header.png", "image/png")
            setFileHeaderCopy({ ...fileHeaderCopy, crop: false, showFile: trimData, uploadFile: uploadFile })
        }
    };

    const getHeaderCropChangeData = () => {
        if (fileHeaderCopy && !fileHeaderCopy?.crop) {
            const reader = new FileReader();
            reader.onload = () => {
                setFileHeaderCopy({ ...fileHeaderCopy, imageShow: false, crop: true, showFile: reader.result })
            };
            reader.readAsDataURL(fileHeaderCopy.originalFile);
        }
    };

    const onHeaderImageSubmit = () => {
        setFileHeaderCopy({ ...fileHeaderCopy, imageShow: true })
        showHideHeaderModal()
    };

    //Footer Image
    const showHideFooterModal = useCallback(() => {
        setIsFooterModalOpen(!isFooterModalOpen);
    }, [isFooterModalOpen]);

    const handleFooterChange = (e) => {
        if (e.target.files?.length > 0) {
            const fileUrl = e.target.files[0];
            if (fileUrl.size <= 2000000 && (fileUrl.type == 'image/png' || fileUrl.type == 'image/jpeg' || fileUrl.type == 'image/jpg')) {
                const reader = new FileReader();
                reader.onload = () => {
                    setFileFooterCopy({ imageShow: false, crop: true, showFile: reader.result, originalFile: fileUrl })
                    showHideFooterModal()
                };
                reader.readAsDataURL(fileUrl);
            } else {
                message.open({
                    key: MESSAGE_KEY,
                    type: 'warning',
                    content: 'Please upload only jpg, jpeg or png files with the max size 2mb.',
                    duration: 2
                });
            }
        }
    }

    const getFooterCropData = async () => {
        if (typeof cropperFooterRef.current?.cropper !== "undefined") {
            const trimData = cropperFooterRef.current?.cropper.getCroppedCanvas().toDataURL(fileFooterCopy.originalFile.type);
            const uploadFile = await dataUrlToFileUsingFetch(trimData, "footer.png", "image/png")
            setFileFooterCopy({ ...fileFooterCopy, crop: false, showFile: trimData, uploadFile: uploadFile })
        }
    };

    const getFooterCropChangeData = () => {
        if (fileFooterCopy && !fileFooterCopy?.crop) {
            const reader = new FileReader();
            reader.onload = () => {
                setFileFooterCopy({ ...fileFooterCopy, imageShow: false, crop: true, showFile: reader.result })
            };
            reader.readAsDataURL(fileFooterCopy.originalFile);
        }
    };

    const onFooterImageSubmit = () => {
        setFileFooterCopy({ ...fileFooterCopy, imageShow: true })
        showHideFooterModal()
    };

    const onWhatsappSaveSettingsClick = async () => {
        setPrintSettings(JSON.parse(JSON.stringify(printSettings)))
        setFileHeader(fileHeaderCopy)
        setFileFooter(fileFooterCopy)
        setFileLogo(fileLogoCopy)
    };

    return (
        <>
            <Navbar className="justify-content-between headerprescription p-0">
                <div className='align-items-center d-flex w-100 h-100 justify-content-between'>
                    <div className='align-items-center d-flex h-100 w-100'>
                        <div className='border-end h-100 text-center me-2'>
                            <div className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer' onClick={handleDrawerOwnLetterHead}>
                                <i className='icon-right'></i>
                            </div>
                        </div>
                        <div className='title-common'>
                            Whatsapp Rx Preview
                        </div>
                    </div>
                    <div className='d-flex align-items-center justify-content-end w-100'>
                        <Button type='button' className="btn-41 btn px-4 btn-primary3 me-4" onClick={onWhatsappSaveSettingsClick}>
                            Save
                        </Button>
                    </div>
                </div>
            </Navbar>

            {/* <style scoped>{css}</style> */}
            <div className={'w-100 bg-body wrapper2'}>
                <Row justify="space-between">
                    <Col lg={8} className="pe-4">
                        <div className="bg-white overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                            <div className="px-3 form_addnewpatient">
                                <div className="mt-4">
                                    <div className="mt-3">
                                        <Form.Item className="mb-0">
                                            <label className="mb-1 title-common">Select Whatsapp Rx Format</label>
                                            <Radio.Group className="d-flex gender-radio all-change-radio" onChange={onWhatsappLetterheadFormatChange} value={printSettingsCopy?.whatsapp_letterhead_format}>
                                                <Radio.Button className="w-100 text-center" value={0}>Custom</Radio.Button>
                                                <Radio.Button className="w-100 text-center" value={1}>Upload</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                    </div>

                                    {printSettingsCopy?.whatsapp_letterhead_format === 0 ? (
                                        // For Custom tab  
                                        <div className="mt-5">
                                            <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                                <Col lg="18">
                                                    <div className="title-common">Doctor’s information</div>
                                                </Col>
                                                <Col lg="6">
                                                    {printSettingsCopy?.header_footer?.header?.doctor_info?.enable === 'Y' && (<span className="fw-medium me-2 text-greycolor fs-16">Show</span>)}
                                                    <Switch onChange={onDoctorInfoSwitchChange} checked={printSettingsCopy?.header_footer?.header?.doctor_info?.enable === 'Y' ? true : false} />
                                                </Col>
                                            </Row>

                                            {printSettingsCopy?.header_footer?.header?.doctor_info?.enable === 'Y' && (
                                                <>
                                                    <Form.Item>
                                                        <Radio.Group className="d-flex gender-radio" onChange={onDoctorInfoPlaceChange} value={printSettingsCopy?.header_footer?.header?.doctor_info?.place}>
                                                            <Radio.Button className="w-100 text-center" value="L">Left</Radio.Button>
                                                            <Radio.Button className="w-100 text-center" value="R">Right</Radio.Button>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                    <div className="mt-3">
                                                        <Form.Item>
                                                            <label className="mb-1">Header</label>
                                                            <Input className='inputheight41-group' onChange={onDoctorInfoHeaderChange} value={printSettingsCopy?.header_footer?.header?.doctor_info?.header} />
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
                                                                value={printSettingsCopy?.header_footer?.header?.doctor_info?.subheader}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </>
                                            )}

                                            <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                                <Col lg="18">
                                                    <div className="title-common">Clinic's information</div>
                                                </Col>
                                                <Col lg="6">
                                                    {printSettingsCopy?.header_footer?.header?.clinic_info?.enable === 'Y' && (<span className="fw-medium me-2      text-greycolor fs-16">Show</span>)}
                                                    <Switch onChange={onClinicInfoSwitchChange} checked={printSettingsCopy?.header_footer?.header?.clinic_info?.enable === 'Y' ? true : false} />
                                                </Col>
                                            </Row>

                                            {printSettingsCopy?.header_footer?.header?.clinic_info?.enable === 'Y' && (
                                                <>
                                                    <Form.Item>
                                                        <Radio.Group className="d-flex gender-radio" onChange={onClinicInfoPlaceChange} value={printSettingsCopy?.header_footer?.header?.clinic_info?.place}>
                                                            <Radio.Button className="w-100 text-center" value="L">Left</Radio.Button>
                                                            <Radio.Button className="w-100 text-center" value="R">Right</Radio.Button>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                    <div className="mt-3">
                                                        <Form.Item>
                                                            <label className="mb-1">Header</label>
                                                            <Input className='inputheight41-group' onChange={onClinicInfoHeaderChange} value={printSettingsCopy?.header_footer?.header?.clinic_info?.header} />
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
                                                                value={printSettingsCopy?.header_footer?.header?.clinic_info?.subheader}
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
                                                    <span className="fw-medium me-2 text-greycolor fs-16">{printSettingsCopy?.logo_enable === 'Y' ? 'Show' : 'Hide'}</span>
                                                    <Switch onChange={onLogoSwitchChange} checked={printSettingsCopy?.logo_enable === 'Y' ? true : false} />
                                                </Col>
                                            </Row>

                                            {printSettingsCopy?.logo_enable === 'Y' && (
                                                <div className="upload-headfoot upload-headfoot2 p-3">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        {fileLogoCopy && fileLogoCopy?.imageShow ?
                                                            <img
                                                                style={{ height: 62, objectFit: 'contain', overflow: 'hidden' }}
                                                                src={fileLogoCopy?.showFile} />
                                                            :
                                                            <div className="text-start fontroboto">Upload a picture of your<br /> Logo</div>
                                                        }
                                                        <div className="btn btn-input btn-41 d-flex align-items-center justify-content-center" onClick={() => inputLogoFile.current?.click()}>
                                                            <input
                                                                key={Math.random()}
                                                                ref={inputLogoFile}
                                                                // className="image-upload-input"
                                                                style={{ display: 'none' }}
                                                                type="file"
                                                                accept="image/png"
                                                                onChange={handleLogoChange} />
                                                            <span><i className="icon-upload me-2"></i>{fileLogoCopy && fileLogoCopy?.imageShow ? 'Change' : 'Upload'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : printSettingsCopy?.whatsapp_letterhead_format === 1 && (
                                        //For Upload Letter head tab
                                        <div className="mt-5">
                                            <Row justify="space-between" className="align-items-center form_addnewpatient mb-1">
                                                <Col lg="24">
                                                    <div className="title-common">Upload your header and footer image</div>
                                                </Col>
                                            </Row>
                                            <div className="upload-headfoot">
                                                {fileHeaderCopy && fileHeaderCopy?.imageShow ? (
                                                    <>
                                                        <img
                                                            style={{ width: '100%', objectFit: 'contain', overflow: 'hidden' }}
                                                            src={fileHeaderCopy?.showFile} />
                                                        <Button className="btn btn-headfoot" onClick={() => inputHeaderFile.current?.click()}><i className="icon-Edit me-1"></i>Edit</Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="fw-medium text-decoration-underline cursor-pointer" onClick={() => inputHeaderFile.current?.click()}>Upload Header</div>
                                                        <div className="fs-12-1 fontroboto"> Only jpg, jpeg or png files with the max size 2mb.</div>
                                                    </>
                                                )}
                                                <input
                                                    key={Math.random()}
                                                    ref={inputHeaderFile}
                                                    // className="image-upload-input"
                                                    style={{ display: 'none' }}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleHeaderChange} />
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
                                                            <Button type='button' disabled={fileHeaderCopy && !fileHeaderCopy?.crop ? false : true} className="btn-41 btn px-4 btn-primary3 me-4" onClick={onHeaderImageSubmit}>
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    }
                                                    modalBody={
                                                        <>
                                                            <div className="d-flex image-crop bg-dark justify-content-center align-items-center">
                                                                {fileHeaderCopy && fileHeaderCopy.crop ? (
                                                                    <Cropper
                                                                        ref={cropperHeaderRef}
                                                                        // zoomTo={0.5}
                                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                                        // initialAspectRatio={1}
                                                                        preview=".img-preview"
                                                                        src={fileHeaderCopy ? fileHeaderCopy?.showFile : defaultprofile}
                                                                        viewMode={3}
                                                                        background={false}
                                                                        autoCropArea={0.3}
                                                                        guides={false}
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                                        src={fileHeaderCopy ? fileHeaderCopy?.showFile : defaultprofile} />
                                                                )}
                                                            </div>
                                                            <div className="mt-4">
                                                                <div className="d-flex align-items-center mt-2 justify-content-between">
                                                                    <div className="fw-normal text-decoration-underline btn p-0 text-main" onClick={showHideHeaderModal}>
                                                                        {fileHeaderCopy && !fileHeaderCopy?.crop ? '' : 'Discard'}
                                                                    </div>
                                                                    <div className="fw-normal text-decoration-underline btn p-0 text-main" onClick={() => fileHeaderCopy && !fileHeaderCopy?.crop ? getHeaderCropChangeData() : getHeaderCropData()}>
                                                                        {fileHeaderCopy && !fileHeaderCopy?.crop ? 'Change' : 'Save'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                />
                                            </div>
                                            <div className="upload-headfoot">
                                                {fileFooterCopy && fileFooterCopy?.imageShow ? (
                                                    <>
                                                        <img
                                                            style={{ width: '100%', objectFit: 'contain', overflow: 'hidden' }}
                                                            src={fileFooterCopy?.showFile} />
                                                        <Button className="btn btn-headfoot" onClick={() => inputFooterFile.current?.click()}><i className="icon-Edit me-1"></i>Edit</Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="fw-medium text-decoration-underline cursor-pointer" onClick={() => inputFooterFile.current?.click()}>Upload Footer</div>
                                                        <div className="fs-12-1 fontroboto"> Only jpg, jpeg or png files with the max size 2mb.</div>
                                                    </>
                                                )}
                                                <input
                                                    key={Math.random()}
                                                    ref={inputFooterFile}
                                                    // className="image-upload-input"
                                                    style={{ display: 'none' }}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFooterChange} />
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
                                                            <Button type='button' disabled={fileFooterCopy && !fileFooterCopy?.crop ? false : true} className="btn-41 btn px-4 btn-primary3 me-4" onClick={onFooterImageSubmit}>
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    }
                                                    modalBody={
                                                        <>
                                                            <div className="d-flex image-crop bg-dark justify-content-center align-items-center">
                                                                {fileFooterCopy && fileFooterCopy.crop ? (
                                                                    <Cropper
                                                                        ref={cropperFooterRef}
                                                                        // zoomTo={0.5}
                                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                                        // initialAspectRatio={1}
                                                                        preview=".img-preview"
                                                                        src={fileFooterCopy ? fileFooterCopy?.showFile : defaultprofile}
                                                                        viewMode={3}
                                                                        background={false}
                                                                        autoCropArea={0.3}
                                                                        guides={false}
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                                        src={fileFooterCopy ? fileFooterCopy?.showFile : defaultprofile} />
                                                                )}
                                                            </div>
                                                            <div className="mt-4">
                                                                <div className="d-flex align-items-center mt-2 justify-content-between">
                                                                    <div className="fw-normal text-decoration-underline btn p-0 text-main" onClick={showHideFooterModal}>
                                                                        {fileFooterCopy && !fileFooterCopy?.crop ? '' : 'Discard'}
                                                                    </div>
                                                                    <div className="fw-normal text-decoration-underline btn p-0 text-main" onClick={() => fileFooterCopy && !fileFooterCopy?.crop ? getFooterCropChangeData() : getFooterCropData()}>
                                                                        {fileFooterCopy && !fileFooterCopy?.crop ? 'Change' : 'Save'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={16} className="overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                        <div className="mx-auto overflow-y-auto" style={{ width: 900 }}>
                            <div className="titleprint mt-20"><img className="img-fluid me-2" width={25} src={wtsp} alt="WhatsApp" /> Whatsapp Preview</div>
                            <div className="border rounded-20px bg-white mt-20 overflow-hidden h-100">
                                <Quixote
                                    mode={WHATSAPP}
                                    printSettingsCopy={printSettingsCopy}
                                    fileHeaderCopy={fileHeaderCopy}
                                    fileFooterCopy={fileFooterCopy}
                                    fileLogoCopy={fileLogoCopy} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default React.memo(WhatsappConfigure);