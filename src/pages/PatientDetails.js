import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Button, Spin, Drawer } from "antd";
import { isMobile } from 'react-device-detect';

import SidebarPatient from '../common/SidebarPatient'
import Welcome1 from '../common/Welcome1'
import VitalsBodyComposition from '../components/VitalsBodyComposition';
// import LabParameters from '../components/LabParameters';
import MedicalHistory from '../components/MedicalHistory';
import CarePlanBox from '../components/CarePlanBox';
// import Vaccination from '../components/Vaccination';
import Cardiology from '../components/Cardiology';
import variables from '../assets/scss/variables.scss'
import alertIcon from "../assets/images/alertIcon.svg";

import { useSelector, useDispatch } from "react-redux";

import {
    viewCaseManager,
} from "../redux/caseManagerSlice";
import VisitVaccination from "./vaccination/components/visitVaccination/VisitVaccination";
import CertificateDetails from "../components/medical_certificate/CertificateDetails";
import VisitGrowthChart from "./growthChart/components/visitGrowthChart/VisitGrowthChart";
import { useAccess } from "./vaccination/useAccess";
import VisitObstetric from "./obstetric/components/visitObstetric/VisitObstetric";
import { getClinicName } from "../utils/utils";
import VisitMedicalRecords from "./medicalRecords/components/visitMedicalRecords/VisitMedicalRecords";
import { setAllUploadedDocs, setPatientUploadedDocs } from "../redux/uploadDocSlice";
import { fetchAllPatientDocs, fetchDocsUploadedByPatient } from "./medicalRecords/service";
import { mergeDocuments } from "./medicalRecords/utils/helper";
import VisitLabParameters from "../components/VisitLabParameters";
import UploadDocPopup from "./medicalRecords/components/uploadDocPopup/UploadDocPopup";
import CommonModal from "../common/CommonModal";
import UploadDocument from "./medicalRecords/UploadDocument";
import BillingDashboard from "./opdBilling/components/billingDashboard/BillingDashboard";
import { fetchPrintSetting } from "./opdBilling/service";
import { setBillPrintSettings, setIpdBillPrintSettings } from "../redux/billingSlice";

const { Sider, Content } = Layout;

function PatientDetails({ isIPD = false }) {

    const { profile, userId } = useSelector((state) => state.doctors);
    const { isLoading } = useSelector((state) => state.uploadDoc);
    const {
        viewCaseManagerData,
        loading,
    } = useSelector((state) => state.caseManager);
    const { allUploadedDocs } = useSelector(
      (state) => state.uploadDoc
    );
      const { billPrintSettings, ipdBillPrintSettings } = useSelector(
        (state) => state.billing
      );
    const dispatch = useDispatch();

    const { state } = useLocation();
    const { patient_data, patientData } = state
    console.log('INTEL ==> patient_data', patient_data)
    console.log('INTEL ==> patientData', patientData)

    let location = useLocation();
    const navigate = useNavigate();
    const { isVaccinationAccessable, isGrowthChartAccessable } = useAccess(
      patient_data?.ageYears
    );

    const [sidebarKey, setSidebarKey] = useState(1);

    const [locationPath, setLocationPath] = useState("/");
    const [collapsed, setCollapsed] = useState(isMobile ? true : false);
    const [tcmData, setTcmData] = useState({ tcm_id: 0, page: 1 });
    const [filesData, setFilesData] = useState([]);
    const [shouldShowUploadDocPopup, setShowUploadDocPopup] = useState(false);
    const [isFileSizeError, setIsFileSizeError] = useState(false);
    const [isFileLimitError, setIsFileLimitError] = useState(false);
    const [isFileTypeError, setIsFileTypeError] = useState(null);
    const [uploadDocDrawer, setUploadDocDrawer] = useState(false);
    const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
    const [isEditDocument, setIsEditDocument] = useState(false);

    useEffect(() => {
        setLocationPath(location.pathname);
    }, [location]);

    useEffect(() => {
        const clinic_name = getClinicName(profile?.hospital_data);
        window.Moengage.track_event("TP_Patient_detail_landing", {
            clinic_name,
            patient_number: patient_data?.pm_contact_no,
            patient_id: patient_data?.patient_unique_id,
        })
        var sendData = {
            patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
            tcm_id: tcmData.tcm_id
        }
        dispatch(viewCaseManager(sendData));
        // const timeOutId = setTimeout(() => {
        //     var sendData = {
        //         patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
        //         tcm_id: tcmData.tcm_id
        //     }
        //     dispatch(viewCaseManager(sendData));
        // }, 500);
        // return () => {
        //     clearTimeout(timeOutId);
        // };
    }, [tcmData]);

    useEffect(() => {
    if (patient_data.patient_unique_id && allUploadedDocs.length === 0) {
        getAllPatientDocs();
    }
    if (
      (billPrintSettings && Object.keys(billPrintSettings).length === 0)
    ) {
      getBillPrintSettings();
    }
    if (
      (ipdBillPrintSettings && Object.keys(ipdBillPrintSettings).length === 0)
    ) {
      getIpdBillPrintSettings();
    }
    }, []);

    const getBillPrintSettings = async () => {
        const printSettingsResponse = await fetchPrintSetting(userId);
        if (printSettingsResponse) {
            dispatch(setBillPrintSettings(printSettingsResponse));
        }
    };

    const getIpdBillPrintSettings = async () => {
        const printSettingsResponse = await fetchPrintSetting(userId, "ipdBill");
        if (printSettingsResponse) {
            dispatch(setIpdBillPrintSettings(printSettingsResponse));
        }
    };

    const getAllPatientDocs = async () => {
        const doctorUploadedDocs = await fetchAllPatientDocs(patient_data.patient_unique_id);
        const patientUploadedDocs = await fetchDocsUploadedByPatient(
          patient_data.patient_unique_id
        );
        dispatch(setPatientUploadedDocs(patientUploadedDocs));
        dispatch(
          setAllUploadedDocs(
            mergeDocuments(doctorUploadedDocs, patientUploadedDocs)
          )
        );
    };

    const nextPress = () => {
        window.Moengage.track_event("patient_detail_prev", {
            "doctor_id": profile?.doctor_unique_id,
            "patient_id": patient_data !== undefined ? patient_data.patient_unique_id : 0
        });
        setTcmData({ tcm_id: viewCaseManagerData?.next_tcm_id, page: tcmData.page -= 1 })
    }

    const prevPress = () => {
        window.Moengage.track_event("patient_detail_next", {
            "doctor_id": profile?.doctor_unique_id,
            "patient_id": patient_data !== undefined ? patient_data.patient_unique_id : 0
        });
        setTcmData({ tcm_id: viewCaseManagerData?.prev_tcm_id, page: (tcmData.page += 1) })
    }

    const onClickSidebarHandle = useCallback((key) => {
        setSidebarKey(key)
    }, [sidebarKey])

    const handleUploadDocPopup = () => {
        setShowUploadDocPopup((prev) => !prev);
    };

    const handleRetryBtn = () => {
        setFilesData([]);
        setIsFileSizeError(false);
        setIsFileLimitError(false);
        setIsFileTypeError(null);
    };

   const handleDeletePopup = () => {
     setShowDeletePopup(true);
   };

   const handleDrawerUploadDoc = () => {
     setUploadDocDrawer(!uploadDocDrawer);
   };

    return (
        <>
            <Layout className={`${isIPD ? 'ipd-patient-details-layout' : ''}`}>
                {!isIPD ? (
                    <Sider trigger={null} collapsible collapsed={collapsed} className={collapsed ? 'ant-layout-sider1' : 'ant-layout-sider'}>
                        <div className='d-flex align-items-center justify-content-between'>
                            <button type='button' className={`${isMobile ? 'px-1' : ''} btn btn-action d-flex align-items-center`} onClick={() => navigate(-1)}>
                                {isMobile ? (
                                    <><i className="icon-right"></i> <div>{'\u00A0Back'}</div></>
                                ) : (
                                    <><i className="icon-right text-main" style={{ color: !collapsed && variables.grayColor }}></i> <div className="backbar text-main">{!collapsed && '\u00A0Back'}</div></>
                                )}

                            </button>
                            {!isMobile && (<Button className={collapsed ? 'collapseborder border rounded-10px' : ''} style={collapsed && { marginRight: -12, backgroundColor: 'white', zIndex: 1, }} type="text" icon={collapsed ? <i className='icon-Expand fs-21'></i> : <i className='icon-Contract fs-21'></i>} onClick={() => setCollapsed(!collapsed)} />)}
                        </div>
                        <SidebarPatient collapsed={collapsed} patient_data={patient_data} viewCaseManagerData={viewCaseManagerData} sidebarKey={sidebarKey} onClickSidebarHandle={onClickSidebarHandle} />
                    </Sider>
                ): null}

                <Content>
                    <div className='w-100 vh-100 overflow-y-auto'>
                        { sidebarKey !== 4 && !isIPD && 
                            <Welcome1
                                locationPath={locationPath}
                                isMobile={isMobile}
                                patient_data={patient_data}
                                viewCaseManagerData={viewCaseManagerData}
                                sidebarKey={sidebarKey}
                                filesData={filesData}
                                setFilesData={setFilesData}
                                handleUploadDocPopup={handleUploadDocPopup}
                                handleDrawerUploadDoc={handleDrawerUploadDoc}
                            />
                        }
                        {sidebarKey === 1 ? (
                            <div className={`appointment-wrap PatientDetailsPageWrap ${isIPD ? 'ipd-patient-details-page-wrap' : ''}`}>
                                <div className='row'>
                                    <div className='col-lg-5 col-md-12 col-12'>
                                        {viewCaseManagerData && (viewCaseManagerData?.vitals?.length > 0 || viewCaseManagerData?.patient_birth_weight) && (
                                            <VitalsBodyComposition loading={loading} passVitals={viewCaseManagerData ? [...viewCaseManagerData.vitals].slice(0, 2) : viewCaseManagerData} patientBirthWeight={viewCaseManagerData?.patient_birth_weight} />
                                        )}
                                        
                                        <MedicalHistory loading={loading} medicalHistoryData={viewCaseManagerData?.medical_history} doctorId={viewCaseManagerData?.doctor_data?.um_id} />
                                        
                                        {isVaccinationAccessable && <VisitVaccination />}
                                        {isGrowthChartAccessable && <VisitGrowthChart />}
                                        <VisitObstetric doctorId={viewCaseManagerData?.doctor_data?.um_id} />
                                            
                                        {<VisitLabParameters patient_unique_id={patient_data?.patient_unique_id} doc_id={userId}/>}
                                        
                                        {/* Care Plan List - Show assigned care plans for patient */}
                                        <CarePlanBox
                                            patientId={patient_data?.patient_unique_id}
                                            selectedTcmId={tcmData?.tcm_id}
                                            readOnly={true}
                                        />
                                        {/*   <LabParameters />
                                            <Vaccination /> */}
                                    </div>
                                    <div className='col-lg-7 col-md-12 col-12'>
                                        <Cardiology isIPD={isIPD} patient_data={patient_data} tcmData={tcmData} loading={loading} viewCaseManagerData={viewCaseManagerData} nextPress={nextPress} prevPress={prevPress} />
                                    </div>
                                </div>
                            </div>
                        ) : sidebarKey === 2 ? (
                            <div className="appointment-wrap PatientDetailswrap">
                                <CertificateDetails patient_data={patient_data} />
                            </div>
                        ) : sidebarKey === 3 ? (
                            <div className="appointment-wrap PatientDetailswrap">
                                <VisitMedicalRecords
                                    filesData={filesData}
                                    setUploadDocDrawer={setUploadDocDrawer}
                                    setFilesData={setFilesData}
                                    handleUploadDocPopup={handleUploadDocPopup}
                                    setIsEditDocument={setIsEditDocument}
                                    handleDrawerUploadDoc={handleDrawerUploadDoc}
                                 />
                            </div>
                        ) : (
                            <div className="vh-100">
                                <BillingDashboard patientData={patient_data} fromPath="patientDetails" />
                            </div>
                        )}
                    </div>
                </Content>

            </Layout>
            {uploadDocDrawer && (
                <Drawer
                    closeIcon={false}
                    placement="right"
                    bodyStyle={{ backgroundColor: "white" }}
                    onClose={handleDeletePopup}
                    open={uploadDocDrawer}
                    className="modalWidth-700"
                    width="auto"
                    push={false}
                >
                    <UploadDocument
                        onClose={handleDeletePopup}
                        handleDrawerUploadDoc={handleDrawerUploadDoc}
                        shouldShowDeletePopup={shouldShowDeletePopup}
                        setShowDeletePopup={setShowDeletePopup}
                        filesData={filesData}
                        setFilesData={setFilesData}
                        isEditDocument={isEditDocument}
                        setIsEditDocument={setIsEditDocument}
                        handleUploadDocPopup={handleUploadDocPopup}
                    />
                </Drawer>
            )}
            {shouldShowUploadDocPopup && (
                <UploadDocPopup
                    shouldShowUploadDocPopup={shouldShowUploadDocPopup}
                    onCancel={handleUploadDocPopup}
                    setFilesData={setFilesData}
                    filesData={filesData}
                    setUploadDocDrawer={setUploadDocDrawer}
                    setIsFileSizeError={setIsFileSizeError}
                    setIsFileLimitError={setIsFileLimitError}
                    setIsFileTypeError={setIsFileTypeError}
                />
            )}
            {isFileSizeError || isFileLimitError || isFileTypeError ? (
                <CommonModal
                    isModalOpen={isFileSizeError || isFileLimitError || isFileTypeError}
                    onCancel={handleRetryBtn}
                    modalWidth={500}
                    title={
                        isFileSizeError
                        ? "Exceeded File Size"
                        : isFileLimitError
                        ? "Exceeded File Upload Limit"
                        : isFileTypeError
                        ? "File format not supported"
                        : "You may lose your data"
                    }
                    modalBody={
                        <>
                        <div className="alert-warning rounded-10px p-2 patient-details">
                            <div className="d-flex align-items-center">
                            <img className="me-3" src={alertIcon} alt="Warning" />
                            <span>
                                {isFileSizeError ? (
                                <>
                                    The file size exceeded{" "}
                                    <span style={{ fontWeight: 700 }}>15MB.</span> Please
                                    upload a file smaller than 15MB
                                </>
                                ) : isFileLimitError ? (
                                <>
                                    You can only upload up to
                                    <span style={{ fontWeight: 700 }}> 5 files.</span>{" "}
                                    Please reduce the number of files and try again.
                                </>
                                ) : isFileTypeError ? (
                                <>
                                    You can't upload
                                    <span style={{ fontWeight: 700 }}>
                                    {" "}
                                    {isFileTypeError}
                                    </span>{" "}
                                    file. Only PDF, JPG, JPEG, and PNG formats are accepted.
                                </>
                                ) : (
                                "Are you sure you want to leave ?"
                                )}
                            </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button
                            onClick={handleRetryBtn}
                            className="w-100 btn btn-primary3 btn-41 px-4"
                            >
                            Retry
                            </Button>
                        </div>
                        </>
                    }
                />
            ) : null}

            {isLoading ? (
                <div>
                    <Spin
                        style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        zIndex: "9999",
                        }}
                        size="large"
                    />
                </div>
            ) : null}
        </>
    );
}

export default PatientDetails;
