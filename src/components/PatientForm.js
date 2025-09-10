import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useContext,
} from "react";
import { isMobile } from "react-device-detect";
import { Col, Row } from "react-bootstrap";
import { Form, Tabs, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFeatureIsOn } from "@growthbook/growthbook-react";

import { ADD, EDIT, GB_ISCRIBE, GB_SNAP_RX } from "../utils/constants";
import { errorMessage, getClinicName } from "../utils/utils";

import TabHeader from "../components/tab_design/TabHeader";
import PersonalDetails from "../components/PersonalDetails";
import AddressDetails from "../components/AddressDetails";
import UploadProfile from "../components/UploadProfile";
import { viewPatient, addPatient, editPatient } from "../redux/appointmentsSlice";
import CommonModal from "../common/CommonModal";
import saveIcon from '../assets/images/save.svg';
import smartPad from '../assets/images/smartPad.svg';
import startConsultIcon from '../assets/images/startConsult.svg';
import { updateDob } from "../pages/vaccination/service";
import { getDecodedToken } from "../utils/localStorage";

const { TabPane } = Tabs;

function PatientForm({ mode = ADD, patient_data }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { loading } = useSelector(
        (state) => state.records
    );
    const { profile } = useSelector((state) => state.doctors);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientData, setPatientData] = useState(null);
    const isSmartSyncAccessableFromGB = useFeatureIsOn(
        GB_ISCRIBE
    );
    const isSnapRxAccessable = useFeatureIsOn(GB_SNAP_RX);

    // Check if user came from all patients page
    const isFromAllPatients = location.state?.from === "/all_patients";
    const isFromAddAppointment = location.state?.from === "/add-appointment";

    useEffect(() => {
        const getEditData = async () => {
            var sendData = {
                patient_unique_id: patient_data.patient_unique_id
            };
            await dispatch(viewPatient(sendData));
        }
        mode === EDIT && getEditData()
    }, []);

    const showHideModal = useCallback(() => {
        setIsModalOpen(!isModalOpen);
    }, [isModalOpen]);

    const handleConsult = () => {
        navigate("/prescription", { state: { patient_data: patientData } });
    }
    const handleSmartRx = () => {
        navigate("/smart-prescription", { state: { patient_data: patientData } })
    }
    const handleSnapRx = () => {
        navigate("/snap-rx", { state: { patient_data: patientData } })
    }

    const onFinish = () => {
        const decodedToken = getDecodedToken();
        const hospital_bid = decodedToken?.result?.hospital_business_id;
        form.validateFields().then(async (values) => {
            const finalValues = {
                ...values,
                pm_reference_id: values.pm_reference_id ? values.pm_reference_id : '',
                pm_salutation: values.pm_salutation !== undefined ? values.pm_salutation : '',
                pm_pincode: values.pm_pincode !== undefined ? values.pm_pincode : '',
                pm_dob: values['pm_dob'] ? values['pm_dob'].format('YYYY-MM-DD') : values['dob'],
                pm_city: values.pm_city !== undefined ? values.pm_city : '',
                pm_state: values.pm_state !== undefined ? values.pm_state : '',
                pm_address: values.pm_address !== undefined ? values.pm_address : '',
            };
            delete finalValues['pm_dob_show'];

            if (mode === EDIT) {
                finalValues['patient_unique_id'] = patient_data.patient_unique_id
            }

            const action = mode === EDIT ? await dispatch(editPatient(finalValues)) : await dispatch(addPatient(finalValues));
            if (action.meta.requestStatus === "fulfilled") {
                const clinic_name = getClinicName(profile?.hospital_data);
                window.Moengage.track_event("TP_Patient_added", {
                    clinic_name,
                    "patient_number": patient_data?.pm_contact_no,
                    "patient_id": patient_data?.patient_unique_id
                });
                if (
                    mode === EDIT &&
                    patient_data.pm_dob !== finalValues.pm_dob
                ) {
                    const payload = {
                        patient_uid: patient_data?.patient_unique_id,
                        patient_pid: patient_data?.pm_pid,
                        hospital_bid:
                            patient_data?.hm_business_id ||
                            patient_data?.hospital_business_id || hospital_bid,
                        hospital_id:
                            patient_data?.hm_id || profile?.hospital_data?.[0]?.hm_id,
                        updated_dob: finalValues.pm_dob,
                    };
                    await updateDob(payload);
                }

                // Handle navigation based on source page
                if (isFromAllPatients) {
                    navigate("/all_patients", {
                        replace: true,
                        state: {
                            showMessage: true,
                            messageType: mode === EDIT ? 'updated' : 'added'
                        }
                    });
                } else if (isFromAddAppointment) {
                    navigate("/add-appointment", {
                        replace: true,
                        state: {
                            ...location.state,
                            patient_data: { ...action.payload },
                        }
                    });
                } else {
                    if (isMobile || !isSmartSyncAccessableFromGB) {
                        mode === EDIT ?
                            navigate("/patient_details", {
                                replace: true,
                                state: {
                                    patient_data: { ...patient_data, ...action.payload }
                                }
                            }) :
                            navigate("/prescription", {
                                replace: true,
                                state: { patient_data: action.payload }
                            });
                    } else {
                        if (mode !== EDIT) {
                            setIsModalOpen(true);
                            setPatientData(action.payload);
                        }
                        if (mode === EDIT) {
                            navigate("/patient_details", {
                                replace: true,
                                state: {
                                    patient_data: { ...patient_data, ...action.payload }
                                }
                            });
                        }
                    }
                }
            } else {
                errorMessage(action.error);
            }
        }).catch(info => {
            console.log('info', info)
        });
    };

    return (
        <>
            {isMobile && (
                <TabHeader
                    flag={2}
                    mode={mode}
                    title={mode === EDIT ? "Edit Patient Details" : "Add New Patient"}
                    loading={loading}
                    onClick={onFinish} />
            )}
            <Form
                form={form}
                layout="vertical"
                className="form_addnewpatient">
                <div className={isMobile ? "" : "border rounded-4 appointment-wrap"}>
                    <div className={isMobile ? "p-30 pt-0" : "p-30 overflow-y-auto"} style={{ height: 'calc(100vh - 242px)' }}>
                        <Row className="justify-content-between">
                            <Col sm={8}>
                                {isMobile ? (
                                    <div className="tabs-patient">
                                        <Tabs defaultActiveKey="1">
                                            <TabPane tab="Personal Details" key="1">
                                                <PersonalDetails form={form} mode={mode} patient_data={patient_data} />
                                            </TabPane>
                                            <TabPane tab="Address Details" key="2">
                                                <AddressDetails form={form} />
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                ) : (
                                    <>
                                        <PersonalDetails form={form} mode={mode} patient_data={patient_data} />
                                        <hr className="mb-3 mt-1" />
                                        <AddressDetails form={form} />
                                    </>
                                )}
                            </Col>
                            <Col sm={3} className="mt-5">
                                <UploadProfile form={form} mode={mode} />
                            </Col>
                        </Row>
                    </div>
                    {!isMobile && (
                        <>
                            <hr className="my-0" />
                            <div className="text-end p-20">
                                <button type="button" className="btn btn-text text-decoration-underline me-3" onClick={() => mode === EDIT ? navigate(-1) : isFromAddAppointment ? navigate("/add-appointment", {
                                    replace: true,
                                    state: {
                                        ...location.state
                                    }
                                }) : navigate(-2)}>
                                    Cancel
                                </button>
                                <Button
                                    className='btn btn-primary3 me-30 btn-41 px-4'
                                    onClick={onFinish}
                                    loading={loading}>
                                    {mode === EDIT
                                        ? 'Save'
                                        : (isFromAllPatients || isFromAddAppointment)
                                            ? 'Add Patient'
                                            : 'Add Patient to Consult'
                                    }
                                </Button>
                            </div>
                            <CommonModal
                                isModalOpen={isModalOpen}
                                onCancel={showHideModal}
                                modalWidth={500}
                                title={"Patient Added"}
                                modalBody={
                                    <>
                                        <div className="rounded-10px p-2 patient-details" style={{ borderRadius: "10px", background: "rgba(25, 187, 122, 0.10)" }}>
                                            <div className="d-flex align-items-center">
                                                <img className='me-3' src={saveIcon} alt="Warning" />
                                                <span>
                                                    Patient has been successfully added.
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="me-4 text-decoration-underline btn p-0 text-main">
                                                Choose Action
                                            </div>
                                            <div>
                                                {(isSmartSyncAccessableFromGB && isSnapRxAccessable) ? (
                                                    <div className="d-flex align-items-center mt-2" style={{ gap: "1rem" }}>
                                                        <Button onClick={handleSmartRx} className="lh-lg btn btn-secondary3 btn-41 px-4 me-2">
                                                            <img className='me-1' src={smartPad} alt="SmartRx" />
                                                            <span>Smart Rx</span>
                                                        </Button>
                                                        <Button onClick={handleSnapRx} className="lh-lg btn btn-secondary3 btn-41 px-4 me-2">
                                                            <img className='me-1' src={smartPad} alt="SmartRx" />
                                                            <span>Snap Rx</span>
                                                        </Button>
                                                        <Button onClick={handleConsult} className="lh-lg btn btn-secondary2 btn-41 px-4 me-2">
                                                            <img className='me-1' src={startConsultIcon} alt="Consult" />
                                                            <span>Consult</span>
                                                        </Button>
                                                    </div>
                                                ) : isSmartSyncAccessableFromGB ? (
                                                    <div className="d-flex align-items-center mt-2" style={{ gap: "3.4rem" }}>
                                                        <Button onClick={handleSmartRx} className="lh-lg btn btn-secondary3 btn-41 px-4 me-4">
                                                            <img className='me-3' src={smartPad} alt="SmartRx" />
                                                            <span>Start Smart Rx</span>
                                                        </Button>
                                                        <Button onClick={handleConsult} className="lh-lg btn btn-secondary2 btn-41 px-4 me-4">
                                                            <img className='me-3' src={startConsultIcon} alt="Consult" />
                                                            <span>Start Consult</span>
                                                        </Button>
                                                    </div>
                                                ) : isSnapRxAccessable ? (
                                                    <div className="d-flex align-items-center mt-2" style={{ gap: "3.4rem" }}>
                                                        <Button onClick={handleSnapRx} className="lh-lg btn btn-secondary3 btn-41 px-4 me-4">
                                                            <img className='me-3' src={smartPad} alt="SmartRx" />
                                                            <span>Start Snap Rx</span>
                                                        </Button>
                                                        <Button onClick={handleConsult} className="lh-lg btn btn-secondary2 btn-41 px-4 me-4">
                                                            <img className='me-3' src={startConsultIcon} alt="Consult" />
                                                            <span>Start Consult</span>
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button onClick={handleConsult} className="lh-lg btn btn-secondary2 btn-41 px-4 me-4">
                                                        <img className='me-3' src={startConsultIcon} alt="Consult" />
                                                        <span>Start Consult</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                }
                            />
                        </>
                    )}
                </div>
            </Form>
        </>
    );
}
export default React.memo(PatientForm);
