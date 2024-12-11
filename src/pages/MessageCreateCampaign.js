import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Drawer, Popover, Steps, Radio, DatePicker, Select, Checkbox, Input, Spin } from 'antd';
import { Col, Container, Row } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';

import locale from "antd/es/date-picker/locale/de_DE";

import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { listAllTemplate, listDoctor, searchPatient, updatePatientCount, userCampaignAdd, userCampaignEdit } from "../redux/bulkMessagesSlice";
import moment from "moment";
import dayjs from "dayjs";

import { errorMessage, onlyNumberFormat } from "../utils/utils";

import VideoModal from "../common/VideoModal";
import messageCorner from '../assets/images/message-corner.svg'
import CreditImg from "../assets/images/credit_icon.svg"
import tutorial from '../assets/images/tutorial-icon.svg';
import messageCornerGrey from '../assets/images/message-corner-grey.svg'
import alertIcon from '../assets/images/alertIcon.svg';

import AvailableCredits from "../components/bulk_messages/AvailableCredits";
import CommonModal from "../common/CommonModal";

import "../components/bulk_messages/messages.scss";

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD'
const showDateFormat = 'DD MMM YYYY'

const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
const dateFormat1 = 'YYYY-MM-DD'
const timeFormat1 = 'HH:mm:ss'

const showDateTimeFormat = 'DD MMM YYYY hh:mm A'
const showDateFormat1 = 'DD MMM YYYY'
const showTimeFormat1 = 'hh:mm A'

const optionsTemplates = [
    {
        label: 'All Template',
        value: 'All Template',
    },
    {
        label: 'Festive & Seasonal Greetings',
        value: 'Festive & Seasonal Greetings',
    },
    {
        label: 'Doctor & Clinic Availability',
        value: 'Doctor & Clinic Availability',
    },
    {
        label: 'Health & Vaccination Updates',
        value: 'Health & Vaccination Updates',
    },
    {
        label: 'Clinic Information Updates',
        value: 'Clinic Information Updates',
    },
    {
        label: 'Appt. & Contact Reminders',
        value: 'Appt. & Contact Reminders',
    },
];

const SELECT_AFTER = [
    {
        value: 'Year',
        label: 'Year',
    },
    {
        value: 'Month',
        label: 'Month',
    }
]

const GENDER = ['Male', 'Female', 'Other']


function MessageCreateCampaign() {

    const { loading, userCreditObj, allTemplateList, templateLoading, doctorList, patientCount } = useSelector((state) => state.bulkMessages);
    const { profile } = useSelector((state) => state.doctors);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { state } = useLocation();
    const { campaign_data } = state != null && state

    const [popOverVideo, setPopOverVideo] = useState(false);
    const [videoLink, setVideoLink] = useState(null);
    const [isBackModalOpen, setIsBackModalOpen] = useState(false);

    const [messageDetailed, setMessageDetailed] = useState(false);
    const [change, setChange] = useState(campaign_data !== undefined ? false : true);
    const [stepCurrent, setStepCurrent] = useState(0);

    const [template, setTemplate] = useState(null);

    const [clinic_name, setclinic_name] = useState('');
    const [festival_name, setfestival_name] = useState('');
    const [link, setlink] = useState('');
    const [dr_name, setdr_name] = useState('');
    const [patient_name, setpatient_name] = useState('');
    const [doctor_name, setdoctor_name] = useState('');
    const [date, setdate] = useState('');

    const [dateRange, setDateRange] = useState({
        startDate: moment().format(dateFormat),
        endDate: moment().format(dateFormat),
    });
    const [dateStatus, setDateStatus] = useState(1);
    const [pickerModal, setPickerModal] = useState(false);

    const [send_on, setSendOn] = useState(1);
    const [sender_type, setSender_type] = useState(1);
    const [filter_doc, setFilterDoc] = useState([]);
    const [min_age, setMinAge] = useState('');
    const [max_age, setMaxAge] = useState('');
    const [age_unit, setAgeUnit] = useState('Year');
    const [gender, setGender] = useState([]);
    const [schedule_type, setScheduleType] = useState(1);
    const [scheduleDateTime, setScheduleDateTime] = useState('');

    useEffect(() => {
        dispatch(listAllTemplate());
        dispatch(listDoctor());
    }, []);

    useEffect(() => {
        if (doctorList?.length > 0 && allTemplateList?.length > 0 && campaign_data !== undefined) {

            dispatch(updatePatientCount(campaign_data?.total_patient))

            setStepCurrent(1)

            const templateData = allTemplateList?.find(e => e?.id === campaign_data?.campaign_id)
            setTemplate(templateData)

            if (campaign_data?.msg_rowData?.hasOwnProperty('clinic_name')) {
                setclinic_name(campaign_data?.msg_rowData?.clinic_name)
            }
            if (campaign_data?.msg_rowData?.hasOwnProperty('festival_name')) {
                setfestival_name(campaign_data?.msg_rowData?.festival_name)
            }
            if (campaign_data?.msg_rowData?.hasOwnProperty('link')) {
                setlink(campaign_data?.msg_rowData?.link)
            }
            if (campaign_data?.msg_rowData?.hasOwnProperty('dr_name')) {
                setdr_name(campaign_data?.msg_rowData?.dr_name)
            }
            if (campaign_data?.msg_rowData?.hasOwnProperty('patient_name')) {
                setpatient_name(campaign_data?.msg_rowData?.patient_name)
            }
            if (campaign_data?.msg_rowData?.hasOwnProperty('doctor_name')) {
                setdoctor_name(campaign_data?.msg_rowData?.doctor_name)
            }
            if (campaign_data?.msg_rowData?.hasOwnProperty('date')) {
                setdate(campaign_data?.msg_rowData?.date)
            }

            setSendOn(campaign_data?.send_on === 'SMS' ? 1 : 2)
            setSender_type(campaign_data?.sender_type)

            if (campaign_data?.sender_type === 2) {
                const filterDocData = campaign_data?.filter_doc ? campaign_data?.filter_doc.split(',').map(Number) : ''
                setFilterDoc(filterDocData)

                if (campaign_data?.date_unit === 'Till date') {
                    setDateStatus(1)
                } else if (campaign_data?.date_unit === 'Last week') {
                    setDateStatus(2)
                } else if (campaign_data?.date_unit === 'Last month') {
                    setDateStatus(3)
                } else if (campaign_data?.date_unit === 'Last 3 month') {
                    setDateStatus(4)
                } else if (campaign_data?.date_unit === 'Last 6 month') {
                    setDateStatus(5)
                } else if (campaign_data?.date_unit === 'Last 1 year') {
                    setDateStatus(6)
                } else if (campaign_data?.date_unit === 'custom') {
                    setDateStatus(null)
                }
                setDateRange({
                    startDate: moment(campaign_data?.start_date).format(dateFormat),
                    endDate: moment(campaign_data?.end_date).format(dateFormat),
                })

                setMinAge(campaign_data?.min_age ? String(campaign_data?.min_age) : '')
                setMaxAge(campaign_data?.max_age ? String(campaign_data?.max_age) : '')
                setAgeUnit(campaign_data?.min_age_unit)

                const genderData = campaign_data?.gender ? campaign_data?.gender.split(',') : []
                setGender(genderData)

                setScheduleType(2)
                setScheduleDateTime(moment(`${campaign_data?.campaign_date} ${campaign_data?.campaign_date}`, showDateTimeFormat).format(dateTimeFormat))
            }
        }
    }, [doctorList, allTemplateList, campaign_data]);

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            var sendData = {
                sender_type: sender_type,
            }
            if (sender_type === 2) {
                if (gender?.length > 0) {
                    sendData['gender'] = gender.map(e => e).toString();
                }
                if (dateRange.startDate != dateRange.endDate) {
                    sendData['start_date'] = dateRange.startDate;
                    sendData['end_date'] = dateRange.endDate;
                }
                if (filter_doc?.length > 0) {
                    sendData['filter_doc'] = filter_doc?.includes(-1) ? doctorList.map(e => e?.um_id).toString() : filter_doc.map(e => e).toString();
                }
                if (min_age) {
                    sendData['min_age'] = min_age;
                }
                if (max_age) {
                    sendData['max_age'] = max_age;
                }
                sendData['min_age_unit'] = age_unit;
                sendData['max_age_unit'] = age_unit;
            }

            if (change) {
                dispatch(searchPatient(sendData));
            }
        }, 500);
        return () => {
            clearTimeout(timeOutId);
        };
    }, [change, sender_type, dateRange, gender, min_age, max_age, age_unit, filter_doc]);

    //Message Details
    const handleMessageDetailed = useCallback(
        () => {
            setMessageDetailed(!messageDetailed)
        },
        [messageDetailed]
    );

    //PopOverVideo function
    const showHideVideoListPopover = useCallback(() => {
        setPopOverVideo(!popOverVideo);
    }, [popOverVideo]);

    //Video Componet
    const VIDEO_CONTENT = useCallback(() => {
        return (
            <>
                <div className="video-contant rounded-4 p-20" key="oneclickrx-video">
                    <div className="align-items-center d-flex justify-content-between border-bottom mb-20 pb-2">
                        <div className="title-common lh-base">Video Tutorial</div>
                    </div>
                </div>
            </>
        );
    }, [popOverVideo]);

    // Steps Code
    const next = () => {
        setStepCurrent(prev => prev + 1);
        if (schedule_type === 1) {
            setScheduleDateTime(moment().add(30, 'minutes').format(dateTimeFormat))
        }
    };

    const prev = () => {
        setStepCurrent(prev => prev - 1);
    };

    //Template Click
    const onTemplateClick = (e) => {
        setTemplate(e)
        next()
    }

    // Custom Radio
    const handleSendOn = useCallback((e) => {
        setSendOn(e.target.value);
    }, [send_on]);

    // Custom Radio
    const handleSenderType = useCallback((e) => {
        setChange(true)
        setSender_type(e.target.value);
    }, [sender_type]);

    // Select Doctor
    const handleFilterDoc = useCallback((value) => {
        setChange(true)
        if (value?.at(-1) === -1) {
            setFilterDoc([-1]);
        } else {
            setFilterDoc(value.filter(item => item !== -1));
        }
    }, [filter_doc]);

    const handlePickerModal = useCallback(
        () => {
            setPickerModal(!pickerModal);
        },
        [pickerModal]
    );

    const rangePresets = [
        {
            label: <div className={`${dateStatus === 1 ? 'active' : ''}`}>Till date</div>,
            value: [dayjs(), dayjs().endOf('day')],
        },
        {
            label: <div className={`${dateStatus === 2 ? 'active' : ''}`}>Last week</div>,
            value: [dayjs().add(-7, 'd'), dayjs()],
        },
        {
            label: <div className={`${dateStatus === 3 ? 'active' : ''}`}>Last month</div>,
            value: [dayjs().add(-1, 'M'), dayjs()],
        },
        {
            label: <div className={`${dateStatus === 4 ? 'active' : ''}`}>Last 3 month</div>,
            value: [dayjs().add(-3, 'M'), dayjs()],
        },
        {
            label: <div className={`${dateStatus === 5 ? 'active' : ''}`}>Last 6 month</div>,
            value: [dayjs().add(-6, 'M'), dayjs()],
        },
        {
            label: <div className={`${dateStatus === 6 ? 'active' : ''}`}>Last 1 year</div>,
            value: [dayjs().add(-1, 'y'), dayjs()],
        },
        {
            label: <div className={`${!dateStatus ? 'active' : ''}`}>Custom range</div>,
            value: null,
        }
    ];

    const onRangeChange = (dates, dateStrings) => {
        setChange(true)
        if (dates) {
            // console.log('From: ', dates[0], ', to: ', dates[1]);
            // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);

            if (dayjs().format(dateFormat) == moment(dateStrings[0], showDateFormat).format(dateFormat)
                && dayjs().format(dateFormat) == moment(dateStrings[1], showDateFormat).format(dateFormat)) {
                setDateStatus(1);
            } else if (dayjs().add(-7, 'd').format(dateFormat) == moment(dateStrings[0], showDateFormat).format(dateFormat)
                && dayjs().format(dateFormat) == moment(dateStrings[1], showDateFormat).format(dateFormat)) {
                setDateStatus(2);
            } else if (dayjs().add(-1, 'M').format(dateFormat) == moment(dateStrings[0], showDateFormat).format(dateFormat)
                && dayjs().format(dateFormat) == moment(dateStrings[1], showDateFormat).format(dateFormat)) {
                setDateStatus(3);
            } else if (dayjs().add(-3, 'M').format(dateFormat) == moment(dateStrings[0], showDateFormat).format(dateFormat)
                && dayjs().format(dateFormat) == moment(dateStrings[1], showDateFormat).format(dateFormat)) {
                setDateStatus(4);
            } else if (dayjs().add(-6, 'M').format(dateFormat) == moment(dateStrings[0], showDateFormat).format(dateFormat)
                && dayjs().format(dateFormat) == moment(dateStrings[1], showDateFormat).format(dateFormat)) {
                setDateStatus(5);
            } else if (dayjs().add(-1, 'y').format(dateFormat) == moment(dateStrings[0], showDateFormat).format(dateFormat)
                && dayjs().format(dateFormat) == moment(dateStrings[1], showDateFormat).format(dateFormat)) {
                setDateStatus(6);
            } else {
                setDateStatus(null);
            }
            setDateRange({
                startDate: moment(dateStrings[0], showDateFormat).format(dateFormat),
                endDate: moment(dateStrings[1], showDateFormat).format(dateFormat),
            });
        } else {
            setDateStatus(null);
            setDateRange({
                startDate: moment().format(dateFormat),
                endDate: moment().format(dateFormat),
            });
        }
    };

    // Input Age
    const onChangeMinInput = useCallback((e) => {
        setChange(true)
        const value = onlyNumberFormat(e.target.value)
        setMinAge(value);
    }, [min_age]);

    const onChangeMaxInput = useCallback((e) => {
        setChange(true)
        const value = onlyNumberFormat(e.target.value)
        setMaxAge(value);
    }, [max_age]);

    // Select After
    const onSelectAfter = useCallback((value) => {
        setChange(true)
        setAgeUnit(value);
    }, [age_unit]);

    const selectAfter = (
        <Select
            defaultValue="Years"
            value={age_unit}
            onSelect={onSelectAfter}
            options={SELECT_AFTER} />
    );

    // Gender Checkbox
    const onChangeGender = useCallback((checkedValues) => {
        setChange(true)
        setGender(checkedValues)
    }, [gender]);

    // Schedule Radio
    const handleScheduleType = useCallback((e) => {
        setScheduleType(e.target.value);
    }, [schedule_type]);

    // Back Model
    const showHideBackModal = useCallback(() => {
        setIsBackModalOpen(!isBackModalOpen);
    }, [isBackModalOpen]);


    const renderTemplate = useMemo(() => {
        let parts = template && template?.text?.split(/{(.*?)}/);

        const elements = parts?.map((part, index) => {
            if (index % 2 !== 0) {
                if (part === 'clinic_name') {
                    return (
                        <Input
                            key={index}
                            style={{
                                height: '30px',
                                width: clinic_name ? parseInt(clinic_name?.length * 7.55) >= 150 ? clinic_name?.length * 7.55 : 150 : 150,
                                maxWidth: 300
                            }}
                            value={clinic_name}
                            onChange={(e) => setclinic_name(e.target.value)}
                            placeholder="Enter clinic name"
                            className="me-1 my-1 fw-medium"
                        />
                    );
                }
                else if (part === 'festival_name') {
                    return (
                        <Input
                            key={index}
                            style={{
                                height: '30px',
                                width: festival_name ? parseInt(festival_name?.length * 7.55) >= 150 ? festival_name?.length * 7.55 : 150 : 150,
                                maxWidth: 300
                            }}
                            value={festival_name}
                            onChange={(e) => setfestival_name(e.target.value)}
                            placeholder="Enter festival name"
                            className="me-1 my-1 fw-medium"
                        />
                    );
                }
                else if (part === 'link') {
                    return (
                        <Input
                            key={index}
                            style={{
                                height: '30px',
                                width: link ? parseInt(link?.length * 7.55) >= 150 ? link?.length * 7.55 : 150 : 150,
                                maxWidth: 300
                            }}
                            value={link}
                            onChange={(e) => setlink(e.target.value)}
                            placeholder="Enter link"
                            className="me-1 my-1 fw-medium"
                        />
                    );
                }
                else if (part === 'dr_name') {
                    return (
                        <Input
                            key={index}
                            style={{
                                height: '30px',
                                width: dr_name ? parseInt(dr_name?.length * 7.55) >= 150 ? dr_name?.length * 7.55 : 150 : 150,
                                maxWidth: 300
                            }}
                            value={dr_name}
                            onChange={(e) => setdr_name(e.target.value)}
                            placeholder="Enter doctor name"
                            className="me-1 my-1 fw-medium"
                        />
                    );
                }
                else if (part === 'patient_name') {
                    return (
                        <Input
                            key={index}
                            style={{
                                height: '30px',
                                width: patient_name ? parseInt(patient_name?.length * 7.55) >= 150 ? patient_name?.length * 7.55 : 150 : 150,
                                maxWidth: 300
                            }}
                            value={patient_name}
                            onChange={(e) => setpatient_name(e.target.value)}
                            placeholder="Enter patient name"
                            className="me-1 my-1 fw-medium"
                        />
                    );
                }
                else if (part === 'doctor_name') {
                    return (
                        <Input
                            key={index}
                            style={{
                                height: '30px',
                                width: doctor_name ? parseInt(doctor_name?.length * 7.55) >= 150 ? doctor_name?.length * 7.55 : 150 : 150,
                                maxWidth: 300
                            }}
                            value={doctor_name}
                            onChange={(e) => setdoctor_name(e.target.value)}
                            placeholder="Enter doctor name"
                            className="me-1 my-1 fw-medium"
                        />
                    );
                }
                else if (part === 'date') {
                    return (
                        <DatePicker
                            className="me-1 my-2"
                            style={{ width: 150, height: 30 }}
                            format={showDateFormat}
                            placeholder='Select date'
                            key={index}
                            value={date ? dayjs(moment(date).format(showDateFormat), showDateFormat) : ''}
                            onChange={(date, dateString) => setdate(moment(dateString, showDateFormat).format(showDateFormat))}
                        />
                    );
                }
            }
            return part;
        });
        return elements;
    }, [
        template,
        clinic_name,
        festival_name,
        link,
        dr_name,
        patient_name,
        doctor_name,
        date
    ]);

    const TEMPLATE_TEXT = useMemo(() => {
        return template && template?.text
            .replace(/{clinic_name}/g, clinic_name ? clinic_name : '{clinic_name}')
            .replace(/{festival_name}/g, festival_name ? festival_name : '{festival_name}')
            .replace(/{link}/g, link ? link : '{link}')
            .replace(/{dr_name}/g, dr_name ? dr_name : '{dr_name}')
            .replace(/{patient_name}/g, patient_name ? patient_name : '{patient_name}')
            .replace(/{doctor_name}/g, doctor_name ? doctor_name : '{doctor_name}')
            .replace(/{date}/g, date ? date : '{date}')
    }, [template,
        clinic_name,
        festival_name,
        link,
        dr_name,
        patient_name,
        doctor_name,
        date])


    const sendTemplate = () => {
        let msg_rowData = {}
        let parts = template && template?.text?.split(/{(.*?)}/);
        parts?.map((part, index) => {
            if (index % 2 !== 0) {
                if (part === 'clinic_name') {
                    msg_rowData['clinic_name'] = clinic_name;
                }
                else if (part === 'festival_name') {
                    msg_rowData['festival_name'] = festival_name;
                }
                else if (part === 'link') {
                    msg_rowData['link'] = link;
                }
                else if (part === 'dr_name') {
                    msg_rowData['dr_name'] = dr_name;
                }
                else if (part === 'patient_name') {
                    msg_rowData['patient_name'] = patient_name;
                }
                else if (part === 'doctor_name') {
                    msg_rowData['doctor_name'] = doctor_name;
                }
                else if (part === 'date') {
                    msg_rowData['date'] = date;
                }
            }
        })
        return msg_rowData;
    }
    const onAddEditCampaign = async () => {
        var sendData = {
            campaign_id: template?.id,
            send_on: send_on,
            campaign_date: moment(scheduleDateTime).format(dateFormat1),
            campaign_time: moment(scheduleDateTime).format(timeFormat1),
            msg_rowData: sendTemplate(),
            draft: 0,
            sender_type: sender_type,
            total_patient: patientCount,
            filter_doc: sender_type == 2 ? filter_doc?.includes(-1) ? doctorList.map(e => e?.um_id).toString() : filter_doc.map(e => e).toString() : '',
            date_unit: sender_type == 2 ? dateStatus === 1 ?
                'Till date'
                : dateStatus === 2 ?
                    'Last week'
                    : dateStatus === 3 ?
                        'Last month'
                        : dateStatus === 4 ?
                            'Last 3 month'
                            : dateStatus === 5 ?
                                'Last 6 month'
                                : dateStatus === 6 ?
                                    'Last 1 year'
                                    :
                                    'custom' : '',
            start_date: sender_type == 2 ? dateRange.startDate : '',
            end_date: sender_type == 2 ? dateRange.endDate : '',
            min_age: sender_type == 2 ? min_age ? min_age : '' : '',
            max_age: sender_type == 2 ? max_age ? max_age : '' : '',
            min_age_unit: sender_type == 2 ? age_unit : '',
            max_age_unit: sender_type == 2 ? age_unit : '',
            gender: sender_type == 2 ? gender?.length > 0 ? gender.map(e => e).toString() : '' : '',
        }

        if (campaign_data !== undefined) {
            sendData['id'] = campaign_data?.id
            sendData['change'] = change ? 1 : 0
        }

        const action = campaign_data !== undefined ? await dispatch(userCampaignEdit(sendData)) : await dispatch(userCampaignAdd(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            navigate('/bulk_messages', { replace: true })
        } else {
            errorMessage(action.payload.message)
        }
    }

    return (
        <>
            <div className='modalCard-header align-items-center d-flex justify-content-between'>
                <div className="align-items-center d-flex">
                    <div className='border-end h-100 text-center'>
                        <Button className='btn btn-delete-prescription px-3 h-100' onClick={showHideBackModal}>
                            <i className='icon-right lh-lg'></i>
                        </Button>
                    </div>
                    <CommonModal
                        isModalOpen={isBackModalOpen}
                        onCancel={showHideBackModal}
                        modalWidth={500}
                        title={"Are you sure you want to go back? "}
                        modalBody={
                            <>
                                <div className="alert-warning rounded-10px p-2 patient-details">
                                    <div className="d-flex align-items-center">
                                        <img className='me-3' src={alertIcon} alt="Warning" />
                                        <span>
                                            Your filled information will  be saved as Draft.
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="d-flex align-items-center mt-2 justify-content-end">
                                        <div onClick={() => navigate(-1)} className="me-4 text-decoration-underline btn p-0 text-main">
                                            <span>Yes, Go back</span>
                                        </div>
                                        <Button onClick={showHideBackModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                            <span>No</span>
                                        </Button>
                                    </div>
                                </div>
                            </>
                        }
                    />
                    <div className="w-100 px-20 fs-16 fw-semibold">Create Campaign</div>
                </div>
                <div className="align-items-center d-flex">
                    <Popover
                        open={popOverVideo}
                        onOpenChange={showHideVideoListPopover}
                        content={VIDEO_CONTENT}
                        trigger="click"
                        overlayClassName="pop-430 pp-0 videoTutorial"
                        placement="bottom"
                    >
                        <button className='btn d-flex align-items-center btn-text me-10 tutorial'>
                            <span className='text-decoration-none rounded-5 pe-3 bg-white shadow2'><img height={42} src={tutorial} />Tutorial</span>
                        </button>
                    </Popover>
                    {videoLink && (
                        <VideoModal
                            videoLink={videoLink}
                            onCancel={() => setVideoLink(null)}
                        />
                    )}
                    <Button
                        onClick={handleMessageDetailed}
                        className="px-3 btn-41 btn-message d-flex align-items-center me-3">
                        <img src={CreditImg} width={19} className="me-2" />
                        {`Available Credits: ${userCreditObj?.userCredit}`}
                    </Button>
                    {stepCurrent > 0 && (
                        <div className="d-flex">
                            <Button type="text" className="btn btn-primary1 me-3 btn-41 px-4 d-flex align-items-center" onClick={() => prev()}>
                                Back
                            </Button>
                            {stepCurrent === 1 ? (
                                <Button className='btn btn-primary3 me-30 btn-41 px-4 d-flex align-items-center' onClick={() => next()}>
                                    Next
                                </Button>
                            ) : (

                                <Button className='btn btn-primary3 me-30 btn-41 px-4 d-flex align-items-center'
                                    disabled={userCreditObj?.userCredit <= `${send_on === 1 ?
                                        (patientCount * Math.ceil(TEMPLATE_TEXT?.length / 160)) * userCreditObj?.defaultSMSCredit
                                        : patientCount * userCreditObj?.defaultWhatsAppCredit}`}
                                    loading={loading}
                                    onClick={onAddEditCampaign}>
                                    Send Message Now
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div >
            <div className="bg-body overflow-y-auto pt-5 pb-4" style={{ height: "calc(100vh - 60px)" }}>
                <Container>
                    <Row className="justify-content-center pb-5">
                        <Col xs={6}>
                            <Steps
                                className="campaign-steps"
                                current={stepCurrent}
                                items={Array.from({ length: 3 }, () => ({}))}
                            />
                            <div className="mt-3 d-flex align-items-center justify-content-between">
                                <div className={`fontroboto fs-14 fw-medium ${stepCurrent === 0 && 'text-primary-message'}`} style={{ marginLeft: -33 }}>Choose template</div>
                                <div className={`fontroboto fs-14 fw-medium ${stepCurrent === 1 && 'text-primary-message'}`} style={{ marginLeft: -23 }}>Configure</div>
                                <div className={`fontroboto fs-14 fw-medium ${stepCurrent === 2 && 'text-primary-message'}`} style={{ marginRight: -5 }}>Summary</div>
                            </div>
                        </Col>
                    </Row>

                    {stepCurrent === 0 ? (
                        <>
                            <div className="p-3 pt-0 d-flex align-items-center justify-content-between">
                                <div className="titleprint fw-semibold">
                                    Choose a template from below
                                </div>
                                <Select
                                    className="doctor-selection h-38"
                                    style={{ width: 250 }}
                                    placeholder="Please select"
                                    options={optionsTemplates}
                                />
                            </div>
                            <Row>
                                {templateLoading ? (
                                    <Spin style={{ marginTop: 120 }} />
                                ) : (
                                    allTemplateList?.map((e, i) => {
                                        return (
                                            <Col key={i} xs={4} className="px-3 px-xl-4 mb-4 mb-xl-5">
                                                <div className="message-box" onClick={() => onTemplateClick(e)}>
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <h5 className="text-truncate fs-16 mb-0 fw-semibold" style={{ color: '#000044' }}>{e?.campaign_name}</h5>
                                                        <i className="icon-right iconrotate180"></i>
                                                    </div>
                                                    <div className="mt-4 fs-14"
                                                        dangerouslySetInnerHTML={{
                                                            __html: e?.text
                                                                .replace(/{clinic_name}/g, `<label class="text-greycolor">{clinic_name}</label>`)
                                                                .replace(/{festival_name}/g, `<label class="text-greycolor">{festival_name}</label>`)
                                                                .replace(/{link}/g, `<label class="text-greycolor">{link}</label>`)
                                                                .replace(/{dr_name}/g, `<label class="text-greycolor">{dr_name}</label>`)
                                                                .replace(/{patient_name}/g, `<label class="text-greycolor">{patient_name}</label>`)
                                                                .replace(/{doctor_name}/g, `<label class="text-greycolor">{doctor_name}</label>`)
                                                                .replace(/{date}/g, `<label class="text-greycolor">{date}</label>`)
                                                        }}>
                                                    </div>
                                                </div>
                                            </Col>
                                        )
                                    })
                                )}
                            </Row>
                        </>
                    ) : stepCurrent === 1 ? (
                        <>
                            <div className="titleprint fw-semibold mb-3">
                                Configure “{template && template?.campaign_name}” Template
                            </div>

                            <Row className="gx-5 justify-content-between">
                                <Col xs={8}>
                                    <div className="configure-template">
                                        <h5 className="fs-16 mb-0 fw-semibold">Send on</h5>
                                        <div className="mt-3">
                                            <Radio.Group className="d-flex" onChange={handleSendOn} value={send_on}>
                                                <Radio className="col me-30" value={1}>SMS</Radio>
                                                <Radio className="col me-0" value={2}>WhatsApp</Radio>
                                            </Radio.Group>
                                        </div>
                                        <hr className="mb-28 mt-4" />
                                        <div className="my-2 d-flex align-items-center justify-content-between">
                                            <div className="fw-semibold">Compose Message</div>
                                            <button className="btn btn-text clear-text px-0" onClick={() => prev()}>
                                                <span className="text-primary">Change template</span>
                                            </button>
                                        </div>

                                        <div className="px-4 py-3 fs-14 border rounded-4 position-relative">{renderTemplate}
                                            <div className="fs-12-1 text-greycolor position-absolute" style={{ right: 7, bottom: 3 }}>{
                                                `${TEMPLATE_TEXT?.length}/160`
                                            }</div>
                                        </div>

                                        {send_on === 1 && (
                                            <div className="fs-12-1 text-greycolor mt-2">Note: Messages over 160 characters count as 2 SMS. Keep it concise to save costs.</div>
                                        )}
                                        <hr className="mb-28 mt-4" />
                                        <div className="fw-semibold">Who will Receive this message? <span className="text-scheduled">({patientCount} Patients)</span></div>
                                        <div className="mt-3">
                                            <Radio.Group className="d-flex" onChange={handleSenderType} value={sender_type}>
                                                <Radio className="col me-30" value={1}>All Patients</Radio>
                                                <Radio className="col me-0" value={2}>Custom</Radio>
                                            </Radio.Group>
                                            {sender_type === 2 && (
                                                <>
                                                    <div className="mt-4">
                                                        <div className="fs-14 text-greycolor">Select Doctors Whose Patients Will Receive This Message</div>
                                                        <Select
                                                            mode="multiple"
                                                            className="doctor-selection"
                                                            placeholder="Please select"
                                                            popupClassName="doctor-selection-popup"
                                                            value={filter_doc}
                                                            options={[{ um_id: -1, um_name: 'All Doctor', unique_id: '-1' }, ...doctorList].map((e) => {
                                                                return {
                                                                    value: e.um_id,
                                                                    label: e.um_name,
                                                                };
                                                            })}
                                                            optionRender={(option) => (
                                                                option.data.value === -1 ? (
                                                                    <div className="align-items-center d-flex text-truncate w-100">
                                                                        <div>
                                                                            <div className="py-2">{option.data.label}</div>
                                                                            <div className="position-absolute fw-normal" style={{ top: 36, left: '50%', zIndex: 9 }}>or</div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="align-items-center d-flex text-truncate w-100 py-1">
                                                                        <Checkbox className="advice-check" checked={filter_doc?.includes(option.data.value)} />
                                                                        {option.data.label}
                                                                    </div>
                                                                )
                                                            )}
                                                            onChange={handleFilterDoc}
                                                        />
                                                    </div>
                                                    <div className="mt-4 w-50 pe-3 position-relative">
                                                        <div className="fs-14 text-greycolor mb-2">Select Patients Who Visited Between</div>
                                                        <div className="massage-date-wrapper">
                                                            <div className="fs-14 h-100 w-100 d-flex align-items-center justify-content-between" onClick={handlePickerModal}>
                                                                <span>
                                                                    {dateStatus === 1 ? (
                                                                        'Till date'
                                                                    ) : dateStatus === 2 ? (
                                                                        'Last week'
                                                                    ) : dateStatus === 3 ? (
                                                                        'Last month'
                                                                    ) : dateStatus === 4 ? (
                                                                        'Last 3 month'
                                                                    ) : dateStatus === 5 ? (
                                                                        'Last 6 month'
                                                                    ) : dateStatus === 6 ? (
                                                                        'Last 1 year'
                                                                    ) : (
                                                                        'Custom range'
                                                                    )}
                                                                </span>
                                                                <i className="mx-2 fs-18 icon-calendar"></i>
                                                            </div>
                                                            <RangePicker
                                                                open={pickerModal}
                                                                presets={rangePresets}
                                                                format={showDateFormat}
                                                                onChange={onRangeChange}
                                                                popupClassName="massage-date"
                                                                className="massage-input"
                                                                inputReadOnly
                                                                renderExtraFooter={() =>
                                                                    <div className="d-flex align-items-center justify-content-between py-1">
                                                                        <div>{moment(dateRange.startDate).format(showDateFormat)} - {moment(dateRange.endDate).format(showDateFormat)}</div>
                                                                        <div>
                                                                            <button className="btn btn-text me-3 px-0" onClick={() => {
                                                                                setDateStatus(1);
                                                                                setDateRange({
                                                                                    startDate: moment().format(dateFormat),
                                                                                    endDate: moment().format(dateFormat),
                                                                                });
                                                                                handlePickerModal()
                                                                            }}>
                                                                                <span>Cancel</span>
                                                                            </button>
                                                                            <Button className="px-4" type="primary" onClick={handlePickerModal}>
                                                                                Done
                                                                            </Button>
                                                                        </div>
                                                                    </div>}
                                                                onOpenChange={() => { }}
                                                            // value={[dateRange.startDate != dateRange.endDate
                                                            //     ? dayjs(moment(dateRange.startDate).format(showDateFormat), showDateFormat)
                                                            //     : "",
                                                            // dateRange.startDate != dateRange.endDate
                                                            //     ? dayjs(moment(dateRange.endDate).format(showDateFormat), showDateFormat)
                                                            //     : ""]
                                                            // }
                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="mt-4 w-75">
                                                        <div className="fs-14 text-greycolor mb-2">Patient Age Range</div>
                                                        <div className="d-flex align-items-center">
                                                            <Input
                                                                inputMode="numeric"
                                                                className="patient-range"
                                                                value={min_age}
                                                                onChange={onChangeMinInput}
                                                                addonAfter={selectAfter} />
                                                            <div className="px-3">-</div>
                                                            <Input
                                                                inputMode="numeric"
                                                                className="patient-range"
                                                                value={max_age}
                                                                onChange={onChangeMaxInput}
                                                                addonAfter={selectAfter} />
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <div className="fs-14 text-greycolor mb-2">Gender</div>
                                                        <Checkbox.Group className="message-gender" value={gender} options={GENDER} onChange={onChangeGender} />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <hr className="mb-28 mt-4" />
                                        <div className="fw-semibold">When do you want to send this message?</div>
                                        <div className="mt-3">
                                            <Radio.Group className="d-flex" onChange={handleScheduleType} value={schedule_type}>
                                                <Radio className="col me-30" value={1}>Send Now</Radio>
                                                <Radio className="col me-0" value={2}>Schedule for later</Radio>
                                            </Radio.Group>
                                            {schedule_type === 2 && (
                                                <div className="mt-4 w-50 pe-3">
                                                    <div className="fs-14 text-greycolor mb-2">Select Schedule Date & Time</div>
                                                    <DatePicker
                                                        showTime
                                                        className="rounded-10px w-100"
                                                        style={{ height: 48 }}
                                                        format={showDateTimeFormat}
                                                        placeholder='Select date & time'
                                                        showNow={false}
                                                        locale={{
                                                            ...locale,
                                                            lang: {
                                                                ...locale.lang,
                                                                ok: "Done",
                                                            }
                                                        }}
                                                        renderExtraFooter={() => <div className="fs-12-1 text-greycolor">Note: Scheduling message allowed only between 9AM-9PM</div>}
                                                        value={scheduleDateTime ? dayjs(moment(scheduleDateTime).format(showDateTimeFormat), showDateTimeFormat) : ''}
                                                        onChange={(date, dateString) => setScheduleDateTime(moment(dateString).format(dateTimeFormat))}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="position-sticky top-0">
                                        <div className="sms-preview">
                                            <div className="text-center fs-14 mb-0 fw-medium fontroboto">{send_on === 1 ? 'SMS Preview' : 'WhatsApp Preview'}</div>
                                            <div className={`sms-preview-mobile ${send_on === 2 ? 'whatsup-preview-mobile' : ''}`}>
                                                <div className="sms-preview-message rounded-4 p-2">
                                                    <div className="fs-13 text-truncate-fourlines">
                                                        {TEMPLATE_TEXT}
                                                    </div>
                                                    <img className="position-absolute" style={{ left: -2, bottom: -3 }} src={send_on === 1 ? messageCornerGrey : messageCorner} alt="Message" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="fontroboto fs-18 fw-bold text-black">Credit Details</div>
                                            <div className="fs-12-1 fw-semibold fontroboto text-black-50">{`(${send_on === 1 ? '1 SMS = ' + userCreditObj?.defaultSMSCredit : '1 WhatsApp message = ' + userCreditObj?.defaultWhatsAppCredit} Credits)`}</div>
                                            <div className="my-3">
                                                <div className="d-flex align-items-center py-1 justify-content-between fs-14 fontroboto">
                                                    <div className="fontroboto fw-bold">Target Customers (A) :</div>
                                                    <div className="fontroboto fw-bold">{`${patientCount} User`}</div>
                                                </div>
                                                <div className="d-flex align-items-center py-1 justify-content-between fs-14 fontroboto">
                                                    <div className="fontroboto fw-bold">{`${send_on === 1 ? 'SMS' : 'Message'} Per Customers (B) :`}</div>
                                                    <div className="fontroboto fw-bold">{`${send_on === 1 ? patientCount * Math.ceil(TEMPLATE_TEXT?.length / 160) + ' SMS' : patientCount + ' Message'}`}</div>
                                                </div>
                                                <div className="d-flex align-items-center py-1 justify-content-between fs-14 fontroboto">
                                                    <div className="fontroboto fw-bold">{`Price Per ${send_on === 1 ? 'SMS' : 'Message'} (C) :`}</div>
                                                    <div className="fontroboto fw-bold">{`${send_on === 1 ? userCreditObj?.defaultSMSCredit : userCreditObj?.defaultWhatsAppCredit} Credits`}</div>
                                                </div>
                                                <hr className="mt-2 mb-3" />
                                                <div className="d-flex align-items-center justify-content-between fs-14 fontroboto">
                                                    <div className="fontroboto fw-bold">Total Credits Required (ABC) :</div>
                                                    <div className="fontroboto fw-bold">{`${send_on === 1 ? ((patientCount * Math.ceil(TEMPLATE_TEXT?.length / 160)) * userCreditObj?.defaultSMSCredit).toFixed(2) : (patientCount * userCreditObj?.defaultWhatsAppCredit).toFixed(2)} Credits`}</div>
                                                </div>
                                                <hr />
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    ) : stepCurrent === 2 && (
                        <>
                            <div className="configure-template overflow-y-auto w-75 mx-auto">
                                <div className="fs-18 lh-base">
                                    {`The below `}
                                    <span className="fw-semibold">{template?.campaign_name}</span>
                                    {` message will be sent on `}
                                    <span className="fw-semibold">{moment(scheduleDateTime).format(showDateFormat1)}</span>
                                    {` at `}
                                    <span className="fw-semibold">{moment(scheduleDateTime).format(showTimeFormat1)} </span> via <span className="fw-semibold">{send_on}</span>
                                    {` to `}
                                    {sender_type === 1 ? (
                                        <>
                                            <span className="fw-semibold"> {`${patientCount} patients`} </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="fw-semibold"> {`${patientCount} ${gender?.length === 1 ? gender : ''} patients`} </span>
                                            {` of age between `}
                                            <span className="fw-semibold"> {`${min_age}-${max_age} ${age_unit}`} </span>
                                            {` who visited in the `}
                                            <span className="fw-semibold">
                                                {dateStatus === 1 ? (
                                                    'Till date'
                                                ) : dateStatus === 2 ? (
                                                    'Last week'
                                                ) : dateStatus === 3 ? (
                                                    'Last month'
                                                ) : dateStatus === 4 ? (
                                                    'Last 3 month'
                                                ) : dateStatus === 5 ? (
                                                    'Last 6 month'
                                                ) : dateStatus === 6 ? (
                                                    'Last 1 year'
                                                ) : (
                                                    moment(dateRange?.startDate).format(showDateFormat) + " to " + moment(dateRange?.endDate).format(showDateFormat)
                                                )}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div className={`${send_on === 1 ? 'bg-selected' : 'bg-whatsup-message'} w-100 mt-4 py-3 rounded-20px d-flex justify-content-center align-items-center`} style={{ minHeight: 138 }}>
                                    <div className="bg-white w-60 fw-medium rounded-4 p-3 position-relative">
                                        {TEMPLATE_TEXT}
                                        <img className="position-absolute" style={{ left: -2, bottom: -3 }} src={messageCorner} alt="Message" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="fontroboto text-black fw-bold title-hypertension">Credit Details</div>
                                    <div className="title-common my-2 text-black-50">{`(${send_on === 1 ? '1 SMS = ' + userCreditObj?.defaultSMSCredit : '1 WhatsApp message = ' + userCreditObj?.defaultWhatsAppCredit} Credits)`}</div>

                                    <div className="mt-4 mb-3">
                                        <div className="d-flex align-items-center py-2 justify-content-between fs-18 fw-medium fontroboto">
                                            <div>Target Customers (A) :</div>
                                            <div>{`${patientCount} User`}</div>
                                        </div>
                                        <div className="d-flex align-items-center py-2 justify-content-between fs-18 fw-medium fontroboto">
                                            <div>{`${send_on === 1 ? 'SMS' : 'Message'} Per Customers (B) :`}</div>
                                            <div>{`${send_on === 1 ? patientCount * Math.ceil(TEMPLATE_TEXT?.length / 160) + ' SMS' : patientCount + ' Message'}`}</div>
                                        </div>
                                        <div className="d-flex align-items-center py-2 justify-content-between fs-18 fw-medium fontroboto">
                                            <div>{`Price Per ${send_on === 1 ? 'SMS' : 'Message'} (C) :`}</div>
                                            <div>{`${send_on === 1 ? userCreditObj?.defaultSMSCredit : userCreditObj?.defaultWhatsAppCredit} Credits`}</div>
                                        </div>
                                        <hr />
                                        <div className="d-flex align-items-center justify-content-between fs-18 fw-semibold fontroboto">
                                            <div>Total Credits Required (ABC) :</div>
                                            <div className="fw-medium">{`${send_on === 1 ? ((patientCount * Math.ceil(TEMPLATE_TEXT?.length / 160)) * userCreditObj?.defaultSMSCredit).toFixed(2) : (patientCount * userCreditObj?.defaultWhatsAppCredit).toFixed(2)} Credits`}</div>
                                        </div>
                                        <hr />
                                    </div>
                                    {/* <div className="text-greycolor">We will refund the credits for undelivered messages within 48 hours of delivery</div> */}
                                </div>
                            </div>
                        </>
                    )}
                </Container>
            </div>

            <Drawer
                className="modalWidth-645" width="auto"
                title="Buy Message Credits"
                placement="right"
                closable
                open={messageDetailed}
                onClose={handleMessageDetailed}
            >
                <AvailableCredits handleMessageDetailed={handleMessageDetailed} />
            </Drawer>
        </>
    );
}

export default MessageCreateCampaign;