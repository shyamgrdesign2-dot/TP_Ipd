import React, { useState, useCallback, useContext } from "react";
import { Col, Radio, Row, Form, Switch, Button, Input, Checkbox, message, Table } from "antd";
import Cropper from "react-cropper";


import PrintSettingsContext from '../../context/PrintSettingsContext';

import CommonModal from '../../common/CommonModal';
import { MESSAGE_KEY } from "../../utils/constants";

import defaultprofile from "../../assets/images/default-profile.svg";
import rxDisplayArea from '../../assets/images/rx-display-area.svg';
import wtsp from '../../assets/images/wtsp.svg';
import "cropperjs/dist/cropper.css";

import { MenuOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { TextArea } = Input;

const CustomRow = ({ children, ...props }) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key'],
    });
    const style = {
        ...props.style,
        transform: CSS.Transform.toString(
            transform && {
                ...transform,
                scaleY: 1,
            }
        ),
        transition,
        ...(isDragging ? {
            position: 'relative',
            zIndex: 9999,
        } : {}),
    };
    return (
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
            {React.Children.map(children, (child) => {
                if (child.key === 'sort') {
                    return React.cloneElement(child, {
                        children: (
                            <MenuOutlined
                                ref={setActivatorNodeRef}
                                style={{
                                    touchAction: 'none',
                                    cursor: 'move',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                {...listeners}
                            />
                        ),
                    });
                } else if (child.key === 'tmdpm_status') {
                    return React.cloneElement(child, {
                        style: {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    });
                }
                return child;
            })}
        </tr>
    );
};

function HeaderFooterLayout() {
    const cropperHeaderRef = React.createRef();
    const cropperFooterRef = React.createRef();
    const cropperLogoRef = React.createRef();

    const { printSettings, setPrintSettings, fileHeader, setFileHeader, fileFooter, setFileFooter, fileLogo, setFileLogo } = useContext(PrintSettingsContext);

    const [headerFooterShowHide, setHeaderFooterShowHide] = useState(false);
    const [patientInfoShowHide, setPatientInfoShowHide] = useState(false);
    const [settingsShowHide, setSettingsShowHide] = useState(false);

    const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
    const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);


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

    //Header & Footer
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

    // Logo Image
    const showHideLogoModal = useCallback(() => {
        setIsLogoModalOpen(!isLogoModalOpen);
    }, [isLogoModalOpen]);

    const handleLogoChange = (e) => {
        if (e.target.files?.length > 0) {
            const fileUrl = e.target.files[0];
            if (fileUrl.size <= 2000000) {
                const reader = new FileReader();
                reader.onload = () => {
                    setFileLogo({ logoImageShow: false, crop: true, showFile: reader.result, originalFile: fileUrl })
                    showHideLogoModal()
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

    const getLogoCropData = () => {
        if (typeof cropperLogoRef.current?.cropper !== "undefined") {
            setFileLogo({ ...fileLogo, crop: false, showFile: cropperLogoRef.current?.cropper.getCroppedCanvas().toDataURL() })
        }
    };

    const getLogoCropChangeData = () => {
        if (fileLogo && !fileLogo?.crop) {
            const reader = new FileReader();
            reader.onload = () => {
                setFileLogo({ ...fileLogo, logoImageShow: false, crop: true, showFile: reader.result })
            };
            reader.readAsDataURL(fileLogo.originalFile);
        }
    };

    const onLogoImageSubmit = () => {
        setFileLogo({ ...fileLogo, logoImageShow: true })
        showHideLogoModal()
    };

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


    //Display Patient Info
    const patientInfoTable = [
        {
            title: '',
            key: 'sort',
            colSpan: 2,
            width: 50,
            align: 'center',
            dataIndex: 'sort',
        },
        {
            title: '',
            colSpan: 0,
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    {record.title}
                </div>
            ),
        },
        {
            title: '',
            dataIndex: 'enable',
            key: 'enable',
            render: (text, record) => <Switch defaultChecked onChange={(checked) => onChangePatientInfo(checked, record)} checked={text != 'Y' ? false : true} />,

        },
    ];

    const onChangePatientInfo = (checked, record) => {
        const index = printSettings.header_footer.patient_info.findIndex(e => e.id == record.id)
        if (index !== -1) {
            printSettings.header_footer.patient_info[index].enable = checked ? 'Y' : 'N'
            // setPrintSettings((prev) => { return [...prev] });
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        }
    };

    const onDragEndPatientInfo = ({ active, over }) => {
        if (active.id !== over?.id) {
            setPrintSettings((prev) => {
                const activeIndex = prev.header_footer.patient_info.findIndex((i) => i.id === active.id);
                const overIndex = prev.header_footer.patient_info.findIndex((i) => i.id === over?.id);
                return {
                    ...prev,
                    header_footer: {
                        header: { ...prev.header_footer.header },
                        patient_info: arrayMove(prev.header_footer.patient_info, activeIndex, overIndex),
                        margin: { ...prev.header_footer.margin },
                        other_settings: { ...prev.header_footer.other_settings }
                    }
                };
            });
        }
    };

    //Other Settings
    const onWatermarkSwitchChange = useCallback(
        (checked) => {
            printSettings.water_mark_enable = checked ? 'Y' : 'N'
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    const onSignatureSwitchChange = useCallback(
        (checked) => {
            printSettings.signature_enable = checked ? 'Y' : 'N'
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    const onSignaturePlaceChange = useCallback(
        (e) => {
            printSettings.header_footer.other_settings.signature_place = e.target.value
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

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
                                            {fileLogo && fileLogo?.logoImageShow ?
                                                <img
                                                    style={{ width: '25%', objectFit: 'contain' }}
                                                    src={fileLogo?.showFile} /> : <div className="text-start fontroboto">Upload a picture of your<br /> Logo</div>
                                            }



                                            <div className="btn btn-input btn-41 d-flex align-items-center justify-content-center">
                                                <Form.Item name="pm_image" />
                                                <input key={Math.random()} className="image-upload-input" type="file" accept="image/*" onChange={handleLogoChange} />
                                                <span><i className="icon-upload me-2"></i>{fileLogo && fileLogo?.logoImageShow ? 'Change' : 'Upload'}</span>
                                                <CommonModal
                                                    handleCancel={true}
                                                    isModalOpen={isLogoModalOpen}
                                                    onCancel={showHideLogoModal}
                                                    modalWidth={744}
                                                    // title={"Crope Image"}
                                                    title={
                                                        <div className='d-flex'>
                                                            <div className='align-items-center d-flex w-100'>
                                                                <div className="text-truncate-twolines">{'Crope Logo Image'}</div>
                                                            </div>
                                                            <Button type='button' className="btn-41 btn px-4 btn-primary3 me-4" onClick={onLogoImageSubmit}>
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    }
                                                    modalBody={
                                                        <>
                                                            <div className="d-flex image-crop bg-dark justify-content-center align-items-center">
                                                                {fileLogo && fileLogo.crop ? (
                                                                    <Cropper
                                                                        ref={cropperLogoRef}
                                                                        // zoomTo={0.5}
                                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                                        // initialAspectRatio={1}
                                                                        preview=".img-preview"
                                                                        src={fileLogo ? fileLogo?.showFile : defaultprofile}
                                                                        viewMode={3}
                                                                        background={false}
                                                                        autoCropArea={0.3}
                                                                        guides={false}
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                                        src={fileLogo ? fileLogo?.showFile : defaultprofile} />
                                                                )}
                                                            </div>
                                                            <div className="mt-4">
                                                                <div className="d-flex align-items-center mt-2 justify-content-between">
                                                                    <div className="fw-normal text-decoration-underline btn p-0 text-main" onClick={showHideLogoModal}>
                                                                        {fileLogo && !fileLogo?.crop ? '' : 'Discard'}
                                                                    </div>
                                                                    <div className="fw-normal text-decoration-underline btn p-0 text-main" onClick={() => fileLogo && !fileLogo?.crop ? getLogoCropChangeData() : getLogoCropData()}>
                                                                        {fileLogo && !fileLogo?.crop ? 'Change' : 'Save'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                />
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
                {patientInfoShowHide && (
                    <div className="mt-4">
                        <div className="mt-4">
                            <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                <Col lg={24}>
                                    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEndPatientInfo}>
                                        <SortableContext
                                            // rowKey array
                                            items={printSettings?.header_footer?.patient_info.map((i) => i.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <Table
                                                className='customize-table'
                                                pagination={false}
                                                components={{
                                                    body: {
                                                        row: CustomRow,
                                                    },
                                                }}
                                                rowKey="id"
                                                columns={patientInfoTable}
                                                dataSource={printSettings?.header_footer?.patient_info}
                                            />
                                        </SortableContext>
                                    </DndContext>
                                </Col>
                            </Row>
                        </div>
                    </div>
                )}
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
                                    <Switch onChange={onWatermarkSwitchChange} checked={printSettings?.water_mark_enable === 'Y' ? true : false} />
                                </Col>
                            </Row>
                            {printSettings?.water_mark_enable === 'Y' && (
                                <div className="upload-headfoot upload-headfoot1 p-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <img src={defaultprofile} style={{ height: 75 }} />
                                        <div className="btn btn-input btn-41 d-flex align-items-center justify-content-center">
                                            <Form.Item name="pm_image" />
                                            <input type="file" accept="image/*" />
                                            <span><i className="icon-upload me-2"></i> Upload New</span>
                                        </div>
                                    </div>
                                </div>)}
                        </div>
                        <div className="mt-4">
                            <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                                <Col lg="18">
                                    <div className="title-common">Signature</div>
                                </Col>
                                <Col lg="6">
                                    <Switch onChange={onSignatureSwitchChange} checked={printSettings?.signature_enable === 'Y' ? true : false} />
                                </Col>
                            </Row>
                            {printSettings?.signature_enable === 'Y' && (
                                <div>
                                    <Form.Item className="mb-0 mt-3">
                                        <Radio.Group className="d-flex gender-radio" onChange={onSignaturePlaceChange} value={printSettings?.header_footer?.other_settings?.signature_place}>
                                            <Radio.Button className="w-100 text-center" value="L">left</Radio.Button>
                                            <Radio.Button className="w-100 text-center" value="R">right</Radio.Button>
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
                            )}
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