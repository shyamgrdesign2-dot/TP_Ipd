import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import moment from "moment";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { isAndroid, isBrowser, isChrome, isMobile, isSafari } from "react-device-detect";
import {
    Tabs,
    Table,
    Space,
    Drawer,
    Select,
    Segmented,
    DatePicker,
    Dropdown,
    Input,
    Button,
    message,
    Modal,
    Spin,
    Tour
} from "antd";
import { Row, Col, ButtonGroup } from "react-bootstrap";
import dayjs from "dayjs";

import { errorMessage, getClinic, trackEvent } from "../utils/utils";
import { getDecodedToken } from "../utils/localStorage";

import { TAB_QUEUE, TAB_FINISHED, TAB_CANCELLED, GB_ISCRIBE, PENDING_DIGITISATION_RX, PERSISTANT_STORAGE_KEY_AUTH_TOKEN, FETCH_SMART_RX, UNFINISHED_RX_CASE, GB_SMARTSYNC_CVT, TAB_ZYDUS_ENCOUNTER, TAB_ZYDUS_APPOINTMENT, GB_ZYDUS_USER, S_BILLING, S_TATVA_PRACTICE, TRIAL } from "../utils/constants";
import api from "../api/services/axiosService";
import { env } from "../EnvironmentConfig";
import noData from "../assets/images/nodata-found.svg";
import visitEnd from '../assets/images/end-visit.svg';
import ImgcancelEnd from '../assets/images/cancel-visit.svg';
import imgCloseVisit from '../assets/images/close-visit.svg';
import newTag from "../assets/images/new-gif.gif";
import alertIcon from '../assets/images/alertIcon.svg';
import { MESSAGE_KEY } from "../utils/constants";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import docimg from "../assets/images/docimg.png";
import welcomdoc from "../assets/images/welcom-doc.svg";
import symptoms from "../assets/images/symptoms-green.svg";
import suporticon from "../assets/images/suport-icon.svg";
import windoc from "../assets/images/win-doc.png";

import CommonModal from "../common/CommonModal";
import { useSelector, useDispatch } from "react-redux";

import {
    getCaseTypes,
    getAllAppointment,
    cancelAppointments,
    endVisit,
    zydusConsultAppoint,
    syncZydusPatientAndAppointment,
    copyGetAllAppointment,
    viewPatient,
    copyGetAllAppointment1,
    zydusAppointment
} from "../redux/appointmentsSlice";
import { viewCaseManager } from "../redux/caseManagerSlice";

import {
    changeSortOrder
} from "../redux/doctorsSlice";
import CreateCertificate from "./medical_certificate/CreateCertificate";
import { resetVaccineState } from "../redux/vaccineSlice";
import { resetGrowthChartState } from "../redux/growthChartSlice";
import { resetObstetricState } from "../redux/obstetricSlice";
import UploadDocument from "../pages/medicalRecords/UploadDocument";
import { fetchAllDocumentCategories } from "../pages/medicalRecords/service";
import { resetUploadDocState, setUploadDocCategories } from "../redux/uploadDocSlice";
import axios from "axios";
import LabParams from "./LabParams";
import UploadDocPopup from "../pages/medicalRecords/components/uploadDocPopup/UploadDocPopup";
import { generateUniqueFileName, getCorrectedFileName } from "../pages/medicalRecords/utils/helper";
import { resetDDxState } from "../redux/ddxSlice";
import CreateBill from "../pages/opdBilling/components/createBill/CreateBill";
import { checkToShowOpdBilling, fetchAdvanceSetting, fetchBillsByPatient, fetchPatientWalletBalance, fetchPrintSetting } from "../pages/opdBilling/service";
import RecentBills from "../pages/opdBilling/components/recentBills/RecentBills";
import AddAdvance from "../pages/opdBilling/components/advanceDeposit/AddAdvance";
import { useOpdBilling } from "../pages/opdBilling/useOpdBilling";
import { setAdvancedSettings, setBillPrintSettings, setShouldShowOpdBilling } from "../redux/billingSlice";
import WelcomeModal from "./userOnboarding/welcomeModal/WelcomeModal";
import { checkSymptomsCollectorTour } from "../api/services/ApiGenRx";
import ExpiredSubModal from "../pages/monetization/components/ExpiredSubModal";

const { TextArea } = Input;

const dateFormat = 'YYYY-MM-DD'
const showDateFormat = 'DD-MM-YYYY'

function AppointmentData({ locationPath }) {

    const navigate = useNavigate();

    const { sort_order, profile, siteId, empNo, userId } = useSelector(
        (state) => state.doctors
    );
    const { uploadDocCategories } = useSelector(
        (state) => state.uploadDoc
    );
    const { isOpdBillChecked } = useSelector(
      (state) => state.billing
    );
    const { isLoading } = useSelector((state) => state.uploadDoc);
    const { advancedSettings } = useSelector((state) => state.billing);
    const { isOpdBillingAccessable } = useOpdBilling();

    const [searchParams, setSearchParams] = useSearchParams();
    const from = searchParams.get("from");
    const [modalOpen, setModalOpen] = useState(true);

    const { queueCount, finishedCount, cancelledCount, zydusEncounterCount, zydusAappointmentCount, appointmentsData, caseTypes, loading, setOnLoad, finishedData, zydusAappointmentData } = useSelector((state) => state.records);
    const dispatch = useDispatch();

    const [date, setDate] = useState({
        startDate: moment().format(dateFormat),
        endDate: moment().format(dateFormat),
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [pageNo, setPageNo] = useState(0);
    const [visitTypeFilters, setVisitTypeFilters] = useState('');
    const [openRowIndex, setOpenRowIndex] = useState(null);
    const [pendingDigitisation, setPendingDigitisation] = useState(null);
    const consultButtonRef = useRef(null);
    const isSmartSyncAccessableFromGB = useFeatureIsOn(
        GB_ISCRIBE
    );
    const isZydusUserAccessableFromGB = useFeatureIsOn(GB_ZYDUS_USER);
    const [zydusSearchQuery, setZydusSearchQuery] = useState('');
    const [matchedAppointment, setMatchedAppointment] = useState([]);

    const [filesData, setFilesData] = useState([]);
    const [uploadDocDrawer, setUploadDocDrawer] = useState(false);
    const [isFileSizeError, setIsFileSizeError] = useState(false);
    const [isFileLimitError, setIsFileLimitError] = useState(false);
    const [isFileTypeError, setIsFileTypeError] = useState(null);
    const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
    const [isBackModalOpen, setIsBackModalOpen] = useState(false);
    const [patientData, setPatientData] = useState(null);
    const fileInputRef = useRef(null);

    const { planDetails } = useSelector(state => state.subscription);
    const { service_mappings } = planDetails || {};
    const EMR_planDetails = service_mappings?.find(e => e.service_name === S_TATVA_PRACTICE)
    const BILLING_planDetails = service_mappings?.find(e => e.service_name === S_BILLING)

    const urlParams = new URLSearchParams(window.location.search);
    const isReceptionist = urlParams.has("receptionist");
    const [appointmentSelectedFromMenu, setAppointmentSelectedFromMenu] =
      useState(null);
    const [tourRef, setTourRef] = useState(null);

    const [isSubModalOpen, setIsSubModalOpen] = useState(false);

    const showHideSubModal = () => {
        setIsSubModalOpen(!isSubModalOpen);
    }

    const checkBillingPurchased = async () => {
        if (EMR_planDetails?.plan_tier !== TRIAL && BILLING_planDetails?.plan_tier === TRIAL) {
            showHideSubModal()
        } else {
            return true;
        }
    }
    
     // Add the tour handler
    const onTourHandle = () => {
        setIsSymptomsCollectorTour(false);
    };

    // Add the steps configuration
    const steps = [
      {
        title: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "20px",
              fontWeight: "500",
              color: "#1A1A1A",
              width: "305px",
            }}
          >
            Symptoms Collected
            <img className="img-fluid" width={52} height={20} src={newTag} />
          </div>
        ),
        description: (
          <div
            style={{
              fontSize: "16px",
              color: "#454551",
              lineHeight: "24px",
              width: "305px",
            }}
          >
            This icon means the AI Agent Mira has collected the patient's{" "}
            <strong style={{ fontWeight: 600 }}>symptoms</strong> &{" "}
            <strong style={{ fontWeight: 600 }}>medical history</strong>. You
            can now <strong style={{ fontWeight: 600 }}>preview</strong> and{" "}
            <strong style={{ fontWeight: 600 }}>autofill</strong> them into the{" "}
            <strong style={{ fontWeight: 600 }}>Rx</strong>
          </div>
        ),
        target: () => tourRef,
        nextButtonProps: {
          children: <div className="sc-tour-button">Got it</div>,
          onClick: onTourHandle,
        },
      },
    ];

    const handleDrawerUploadDoc = () => {
        setUploadDocDrawer(!uploadDocDrawer);
    };

    const handleDeletePopup = () => {
        setShowDeletePopup(true);
    };

    const handleRetryBtn = () => {
        setFilesData([]);
        setIsFileSizeError(false);
        setIsFileLimitError(false);
        setIsFileTypeError(null);
    };

    const getAllDocumentCategories = async () => {
        const response = await fetchAllDocumentCategories();
        dispatch(setUploadDocCategories(response));
    };

    const handleFileUpload = (event, record) => {
        const files = event.target.files;
        if (files) {
            const filesData = Array.from(files);
            if (filesData.length > 0) {
                const updatedFiles = [];
                filesData.forEach((file) => {
                    const cleanFileName = getCorrectedFileName(file?.name || "");
                    // Check if the file is an image and if its name follows typical camera-captured file patterns
                    const isCapturedFromCamera =
                        (file.type === "image/jpeg" ||
                            file.type === "image/png" ||
                            file.type === "image/jpg") &&
                        (cleanFileName === "image.jpg" ||
                            cleanFileName === "image.png" ||
                            cleanFileName === "image.jpeg");

                    let newFile = file;

                    if (isCapturedFromCamera) {
                        // Generate a unique file name for camera-captured images
                        const uniqueFileName = generateUniqueFileName(file);
                        newFile = new File([file], uniqueFileName, { type: file.type });
                    } else {
                        // If the file name had spaces, create a new file with spaces removed
                        newFile = new File([file], cleanFileName, { type: file.type });
                    }

                    updatedFiles.push(newFile);
                });
                setFilesData(updatedFiles);
                handleDrawerUploadDoc();
                setPatientData(record);
            }
        }
        event.target.value = null;
    };

    const handleAddClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const isSmartSyncCVTAccessableFromGB = useFeatureIsOn(
        GB_SMARTSYNC_CVT
    );

    const baseUrl = env.casemanager_api_url;
    const customBaseUrl = { customBaseUrl: env.casemanager_api_url };
    const baseUrlRxDigitise = env.rx_digitization;

    const handleClickOutside = (event) => {
        if (!consultButtonRef?.current?.contains(event.target)) {
            setOpenRowIndex(null);
        }
    };

    useEffect(() => {
      if (uploadDocCategories.length === 0 && !isReceptionist) {
        getAllDocumentCategories();
      }
      if (
        advancedSettings &&
        Object.keys(advancedSettings).length === 0 &&
        isOpdBillingAccessable
      ) {
        getAdvanceSettings();
      }
      getBillPrintSettings();
    }, [isOpdBillingAccessable]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isReceptionist) {
            const patientRecord = {
              patient_unique_id: urlParams.get("patient_unique_id"),
              pam_id: urlParams.get("pam_id"),
              pm_pid: urlParams.get("pm_pid"),
              source: urlParams.get("source"),
              receptionistId: urlParams.get("receptionistId"),
              receptionistName: urlParams.get("receptionistName"),
            };
            getPatientBills(patientRecord);
            const receptionistTask = urlParams.get("receptionist");
            if (receptionistTask === "bill") {
                handleRecentBillDrawer();
                trackEvent("TP_Billing_CreateBill", {
                  patientId: patientRecord?.patient_unique_id,
                  source: patientRecord?.source,
                  receptionistId: patientRecord?.receptionistId,
                  receptionistName: patientRecord?.receptionistName,
                });
            } else if (receptionistTask === "advance-deposit") {
                handleAddAdvanceDrawer();
            }
        }
    }, []);

    const getAdvanceSettings = async () => {
        const advanceSettingsResponse = await fetchAdvanceSetting();
        if (advanceSettingsResponse) {
            dispatch(setAdvancedSettings(advanceSettingsResponse));
        }
    };

    const getBillPrintSettings = async () => {
        const printSettingsResponse = await fetchPrintSetting(
            isReceptionist ? urlParams.get("um_id") : ""
        );
        if (printSettingsResponse) {
            dispatch(setBillPrintSettings(printSettingsResponse));
        }
    };

    const fetchPendingDigitisationRx = async () => {

        try {
            const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
            const cleanedToken = token.replace(/['"]+/g, '');
            const decodedToken = getDecodedToken();
            const doctorId = decodedToken?.result?.user_id;

            // API call for Rx Digitisation
            const response = await axios.get(
                `${baseUrl}/api/v1/casemanager/unfinished-digitize-rx/${doctorId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cleanedToken}`,
                    },
                }
            );

            const pendingDigitisationRx = response?.data;

            if (pendingDigitisationRx) {
                setPendingDigitisation(pendingDigitisationRx);
            }
        } catch (error) {
            console.error('Error fetching the pending Digitisation prescriptions:', error);
        }
    }

    // Initialize items in state
    const [items, setItems] = useState([
        {
            key: TAB_QUEUE,
            label: (
                <div className="d-flex align-items-center">
                    <i className="icon-Queue"></i>
                    Queue ({queueCount})
                </div>
            ),
        },
        {
            key: TAB_FINISHED,
            label: (
                <div className="d-flex align-items-center">
                    <i className="icon-Finished"></i>
                    Finished ({finishedCount})
                </div>
            ),
        },
        {
            key: TAB_CANCELLED,
            label: (
                <div className="d-flex align-items-center">
                    <i className="icon-Cancelled"></i>
                    Cancelled ({cancelledCount})
                </div>
            ),
        },
    ]);

    // UseEffect to update items when pendingDigitisation changes
    useEffect(() => {
        const updatedItems = [
            {
                key: TAB_QUEUE,
                label: (
                    <div className="d-flex align-items-center">
                        <i className="icon-Queue"></i>
                        Queue ({isDigitisationTab ? 0 : queueCount})
                    </div>
                ),
            },
            {
                key: TAB_FINISHED,
                label: (
                    <div className="d-flex align-items-center">
                        <i className="icon-Finished"></i>
                        Finished ({isDigitisationTab ? 0 : finishedCount})
                    </div>
                ),
            },
            {
                key: TAB_CANCELLED,
                label: (
                    <div className="d-flex align-items-center">
                        <i className="icon-Cancelled"></i>
                        Cancelled ({isDigitisationTab ? 0 : cancelledCount})
                    </div>
                ),
            },
        ];

        // Split the string by commas and get the length
        const pendingDigitisationArray = pendingDigitisation?.data?.split(',');
        const pendingDigitisationLength = pendingDigitisationArray?.length;

        // Conditionally add the Pending Digitisation tab
        if (isSmartSyncCVTAccessableFromGB && pendingDigitisation?.data?.length > 0) {
            updatedItems.push({
                key: 2,
                label: (
                    <div className="d-flex align-items-center">
                        <i className="icon-Report"></i>
                        Pending Digitisation ({pendingDigitisationLength})
                    </div>
                ),
            });
        }

        const decodedToken = getDecodedToken();
        const tokenData = decodedToken?.result;
        if (tokenData?.hospital_business_id == env.zydus_business_id && isZydusUserAccessableFromGB) {
            const zydusItems = [
                {
                    key: TAB_ZYDUS_APPOINTMENT,
                    label: (
                        <div className="d-flex align-items-center">
                            <i className="icon-Queue"></i>
                            Appointment {zydusAappointmentCount ? `(${zydusAappointmentCount})` : ''}
                        </div>
                    ),
                },
                {
                    key: TAB_ZYDUS_ENCOUNTER,
                    label: (
                        <div className="d-flex align-items-center">
                            <i className="icon-Queue"></i>
                            Encounter {zydusEncounterCount ? `(${zydusEncounterCount})` : ''}
                        </div>
                    ),
                }
            ];
            updatedItems.splice(1, 0, ...zydusItems);
        }

        // Update the items state with new data
        setItems(updatedItems);

    }, [pendingDigitisation, queueCount, finishedCount, cancelledCount, appointmentsData, isZydusUserAccessableFromGB]);

    const [selectedTab, setSelectedTab] = useState(TAB_QUEUE);
    const [isDigitisationTab, setIsDigitisationTab] = useState(false);

    useEffect(() => {
        const decodedToken = getDecodedToken();
        const tokenData = decodedToken?.result;
        if (tokenData?.hospital_business_id == env.zydus_business_id && isZydusUserAccessableFromGB) {
            setSelectedTab(TAB_ZYDUS_ENCOUNTER)
        }
    }, [isZydusUserAccessableFromGB]);

    const calanderOptions = [
        { value: 1, label: "Today" },
        { value: 2, label: "Next 7 Days" },
        { value: 3, label: "Next 30 Days" },
        { value: 4, label: "Last 7 Days" },
        { value: 5, label: "Last 30 Days" },
        { value: 6, label: "Till Date" },
    ];
    const [selectedCalanderOptions, setSelectedCalanderOptions] = useState(1);

    const segmentedList = [
        { value: 1, icon: <i className="icon-List"></i> },
        { value: 2, icon: <i className="icon-calendar"></i> },
    ];
    const [segmented, setSegmented] = useState(1);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [isEndVisitReasonModal, setEndVisitReasonModal] = useState(false);
    const [endVisitReasonDrawer, setEndVisitReasonDrawer] = useState(false);
    const [createCertificateDrawer, setCreateCertificateDrawer] = useState(false);
    const [addlabparamsDrawer, setAddlabparamsDrawer] = useState(false);
    const [endVisitReason, setEndVisitReason] = useState('');
    const [noDetailsModal, setNoDetailsModal] = useState(false);
    const [shouldShowUploadDocPopup, setShowUploadDocPopup] = useState(false);
    const [createBillDrawer, setCreateBillDrawer] = useState(false);
    const [recentBillDrawer, setRecentBillDrawer] = useState(false);
    const [addAdvanceDrawer, setAddAdvanceDrawer] = useState(false);
    const [patientBills, setPatientBills] = useState([]);
    const [patientWalletBalance, setPatientWalletBalance] = useState(0);
    const [isSymptomsCollectorTour, setIsSymptomsCollectorTour] = useState(false);
    const [firstSymptomIndex, setFirstSymptomIndex] = useState(null);

    // Add this useEffect to find the first record with symptoms
    useEffect(() => {
      if (
        selectedTab !== TAB_ZYDUS_ENCOUNTER &&
        selectedTab !== TAB_ZYDUS_APPOINTMENT
      ) {
        const firstIndex = appointmentsData?.findIndex(
          (record) => record.symptomsGathered
        );
        setFirstSymptomIndex(firstIndex);
      } else {
        const firstIndex = matchedAppointment?.findIndex(
          (record) => record.symptomsGathered
        );
        setFirstSymptomIndex(firstIndex);
      }
    }, [appointmentsData, matchedAppointment, selectedTab]);

    const showHideBackModal = () => {
        setIsBackModalOpen(!isBackModalOpen);
    };

    useEffect(() => {
        if (locationPath == '/' && ['onboarding', 'finalSetup'].includes(from)) {
            setModalOpen(true)
        }
    }, [locationPath, from]);

    useEffect(() => {
        if (!isReceptionist) {
            dispatch(getCaseTypes());
            dispatch(resetVaccineState());
            dispatch(resetGrowthChartState());
            dispatch(resetObstetricState());
            dispatch(resetUploadDocState());
            dispatch(resetDDxState());
            getSymptomCollectorTourCheck();
        }
    }, []);

    useEffect(() => {
        if (!createBillDrawer && !isReceptionist) {
        const timeOutId = setTimeout(async () => {
            if (selectedTab != TAB_ZYDUS_ENCOUNTER && selectedTab != TAB_ZYDUS_APPOINTMENT) {
                var sendData = {
                    startDate: date.startDate,
                    endDate: date.endDate,
                    apStatue: (isDigitisationTab && pendingDigitisation?.data) ? 3 : selectedTab,
                    filterVisitType: visitTypeFilters,
                    page: pageNo,
                    search: searchQuery,
                    sortOrder: sort_order,
                    fetchBillStatus: advancedSettings?.billingStatusInAppointmentScreen,
                    ...(isDigitisationTab && pendingDigitisation?.data
                        ? { cvtAppointmentIdsStr: pendingDigitisation.data }
                        : {})
                }
                // console.log(sendData)
                dispatch(getAllAppointment(sendData));
            } else {
              encounterAndFinishDataManage();
            }

            // if (searchQuery) {
            //     const searchTimeOutId = setTimeout(() => {
            //         dispatch(getAllAppointment(sendData));
            //     }, 500);
            //     return () => {
            //         clearTimeout(searchTimeOutId);
            //     };
            // } else {
            //     dispatch(getAllAppointment(sendData));
            // }
        }, 500);
        return () => {
            clearTimeout(timeOutId);
        };
        }
    }, [selectedTab, date, searchQuery, pageNo, visitTypeFilters, sort_order, isDigitisationTab, siteId, createBillDrawer, advancedSettings?.billingStatusInAppointmentScreen]);

    useEffect(() => {
        if (!isOpdBillChecked && !isReceptionist) {
            getShowOpdBilling();
        }
    }, []);

    const getSymptomCollectorTourCheck = async () => {
        const decodedToken = getDecodedToken();
        const clinicId = String(decodedToken?.result?.clinic_id);
        const isSymptomsCollectorTourRes = await checkSymptomsCollectorTour({
          um_id: userId,
          hm_id: clinicId,
        });
        if (isSymptomsCollectorTourRes) {
            setIsSymptomsCollectorTour(true);
        }
    };

    const getShowOpdBilling = async () => {
        const res = await checkToShowOpdBilling();
        dispatch(setShouldShowOpdBilling(res));
    };

    const encounterAndFinishDataManage = async () => {
        if (siteId) {
            let encounterData = []
            if (pageNo === 0) {
                var sendZydusData = {
                  siteId: siteId,
                  empNo: empNo.toString(),
                  date: moment(date.startDate).format(showDateFormat),
                  apStatue: selectedTab,
                  page: 0,
                  filterVisitType: visitTypeFilters,
                  fetchBillStatus:
                    advancedSettings?.billingStatusInAppointmentScreen,
                };
                let encounterAction = await dispatch(zydusConsultAppoint(sendZydusData));
                if (encounterAction.meta.requestStatus === "fulfilled") {
                    encounterData = encounterAction.payload
                }

                var sendZydusAppointmentData = {
                    siteId: siteId,
                    empNo: empNo.toString(),
                    date: moment(date.startDate).format(showDateFormat)
                }
                dispatch(zydusAppointment(sendZydusAppointmentData));
            }

            let sendData = {
              startDate: date.startDate,
              endDate: date.endDate,
              apStatue: TAB_FINISHED,
              page: 0,
              fetchBillStatus:
                advancedSettings?.billingStatusInAppointmentScreen,
            };

            let action = await dispatch(copyGetAllAppointment1(sendData));
            let appData = []
            while (appData.length < encounterData.length && action.meta.requestStatus === "fulfilled") {
                appData.push(...action?.payload?.app_data?.filter(x => x.pam_ref_id != null));
                if (appData.length >= encounterData.length) {
                    break;
                }
                sendData.page += 1;
                action = await dispatch(copyGetAllAppointment1(sendData));
            }

        }
    }


    useEffect(() => {
        if (isSmartSyncAccessableFromGB && isSmartSyncCVTAccessableFromGB) {
            fetchPendingDigitisationRx();
        }
    }, [isSmartSyncAccessableFromGB]);

    useEffect(() => {
        if (date.startDate === date.endDate) {
            if (moment(moment(date.startDate).format(dateFormat)).isSame(moment().format(dateFormat), 'day')) {
                setSelectedCalanderOptions(1)
            } else {
                setSelectedCalanderOptions(null)
            }
        }
    }, [date]);

    const handleUploadDocPopup = (record) => {
        setShowUploadDocPopup((prev) => !prev);
        setPatientData(record);
    };

    const onChange = useCallback(
        (key) => {
            setPageNo(0)
            setVisitTypeFilters('')
            setSelectedCalanderOptions(1)
            setSelectedTab(key);

            if (key === 2) {
                setIsDigitisationTab(true)
                setDate({
                    startDate: moment(0).format(dateFormat),
                    endDate: moment().format(dateFormat),
                })
            }
            else {
                setIsDigitisationTab(false);
                setDate({
                    startDate: moment().format(dateFormat),
                    endDate: moment().format(dateFormat),
                })
            }
        },
        [selectedTab]
    );

    const onSearch = useCallback(
        (query) => {
            setPageNo(0)
            setSearchQuery(query);
        },
        [searchQuery]
    );

    useEffect(() => {
        const searchTimeOutId = setTimeout(() => {
            if (selectedTab === TAB_ZYDUS_ENCOUNTER || selectedTab === TAB_ZYDUS_APPOINTMENT) {
                if (zydusSearchQuery) {
                    let filtered = appointmentsData.filter((item) => {
                        return item.pm_fullname
                            .toLowerCase()
                            .includes(zydusSearchQuery.toLowerCase()) ||
                            item.mrno
                                .toLowerCase()
                                .includes(zydusSearchQuery.toLowerCase()) ||
                            item.pm_contact_no
                                .toLowerCase()
                                .includes(zydusSearchQuery.toLowerCase());
                    });
                    setMatchedAppointment(filtered);
                } else {
                    setMatchedAppointment(appointmentsData);
                }
            }
        }, 500);
        return () => {
            clearTimeout(searchTimeOutId);
        };
    }, [zydusSearchQuery, appointmentsData]);

    const onZydusSearch = useCallback(
        (query) => {
            setZydusSearchQuery(query);
        },
        [zydusSearchQuery]
    );

    const onDateChange = useCallback(
        (date, dateString) => {
            if (dateString) {
                setPageNo(0)
                setDate({
                    startDate: moment(dateString, showDateFormat).format(dateFormat),
                    endDate: moment(dateString, showDateFormat).format(dateFormat),
                });
            }
        },
        [date]
    );

    const backDatePress = useCallback(
        () => {
            setPageNo(0)
            setDate({
                startDate: moment(date.startDate).subtract(1, 'day').format(dateFormat),
                endDate: moment(date.endDate).subtract(1, 'day').format(dateFormat),
            })
        },
        [date]);

    const nextDatePress = useCallback(
        () => {
            if (selectedTab !== TAB_QUEUE) {
                if (!moment(moment(date.startDate).format(dateFormat)).isSame(moment().format(dateFormat), 'day')) {
                    setPageNo(0)
                    setDate({
                        startDate: moment(date.startDate).add(1, 'day').format(dateFormat),
                        endDate: moment(date.endDate).add(1, 'day').format(dateFormat),
                    })
                } else {
                    errorMessage(`Can't select next date`)
                }
            } else {
                setPageNo(0)
                setDate({
                    startDate: moment(date.startDate).add(1, 'day').format(dateFormat),
                    endDate: moment(date.endDate).add(1, 'day').format(dateFormat),
                })
            }
        },
        [date]);

    const handleDateChange = useCallback(
        (value) => {
            setSelectedCalanderOptions(value)
            const today = "2024-10-28"
            const updatedate = {
                startDate: moment().format(dateFormat),
                endDate: moment().format(dateFormat),
            }
            setPageNo(0)
            if (value === 1) {
                setDate(updatedate)
            } else if (value === 2) {
                setDate({
                    startDate: moment(updatedate.startDate).format(dateFormat),
                    endDate: moment(updatedate.endDate).add(7, 'day').format(dateFormat),
                })
            } else if (value === 3) {
                setDate({
                    startDate: moment(updatedate.startDate).format(dateFormat),
                    endDate: moment(updatedate.endDate).add(30, 'day').format(dateFormat),
                })
            } else if (value === 4) {
                setDate({
                    startDate: moment(updatedate.startDate).subtract(7, 'day').format(dateFormat),
                    endDate: moment(updatedate.endDate).format(dateFormat),
                })
            } else if (value === 5) {
                setDate({
                    startDate: moment(updatedate.startDate).subtract(30, 'day').format(dateFormat),
                    endDate: moment(updatedate.endDate).format(dateFormat),
                })
            } else if (value === 6) {
                setDate({
                    startDate: moment(today).format(dateFormat),
                    endDate: moment(updatedate.endDate).format(dateFormat),
                })
            } else {
                setDate(null)
            }
        },
        [selectedCalanderOptions, date]
    );

    const segmentedChange = useCallback(
        (key) => {
            setSegmented(key);
        },
        [segmented]
    );

    const getVisitTypeFilters = () => {
        return caseTypes.map((e) => {
            return {
                text: e.toct_type,
                value: selectedTab != TAB_ZYDUS_ENCOUNTER && selectedTab != TAB_ZYDUS_APPOINTMENT ? e.toct_id : e.toct_type,
            };
        });
    };

    const getMenuItems = (record) => {
        const items = [
            {
                label: <span onClick={() => onPatientDetailsClick(record)}>Patient Details</span>,
                key: "patientdetails",
            },
            isOpdBillingAccessable ? {
                label: <div
                    onClick={async () => {
                        const isPurchased = await checkBillingPurchased()
                        if (isPurchased) {
                            setAppointmentSelectedFromMenu(record);
                            if (patientBills?.length === 0) {
                                const clinic = getClinic();
                                trackEvent("TP_Billing_CreateBill", {
                                    patientName: record.pm_fullname,
                                    patientId: record?.patient_unique_id,
                                    doctorSpeciality: profile?.dp_name,
                                    doctorId: profile?.doctor_unique_id,
                                    doctorContact: profile?.um_contact,
                                    source: selectedTab === TAB_QUEUE ? "appointment_queue" : selectedTab === TAB_FINISHED ? "appointment_finished" : "",
                                    city: clinic?.hm_city,
                                    pincode: clinic?.hm_pincode,
                                    subscriptionStatus: planDetails?.currentPlanStatus
                                })
                                handleCreateBillDrawer()
                            } else {
                                handleRecentBillDrawer();
                            }
                        }
                    }}>{patientBills?.length === 0 ? "Create Bill" : "View/Create Bill"}</div>,
                key: "createbill",
            } : undefined,
            isOpdBillingAccessable ? {
                label: <div
                    onClick={async () => {
                        const isPurchased = await checkBillingPurchased()
                        if (isPurchased) {
                            setAppointmentSelectedFromMenu(record);
                            handleAddAdvanceDrawer();
                        }
                    }}>Advance Deposit</div>,
                key: "advancebill",
            } : undefined,
            {
                label: <span
                    onClick={() => {
                        setAppointmentSelectedFromMenu(record);
                        handleAddLabParamsDrawer()
                    }}>Add Lab Results</span>,
                key: "labparams",
            },
            {
                label: <span
                    onClick={() => {
                        setAppointmentSelectedFromMenu(record);
                        handleConfirmationModal()
                    }}>Cancel Appointment</span>,
                key: "cancelappt",
            },
            {
                label: <span
                    onClick={() => {
                        setAppointmentSelectedFromMenu(record);
                        handleCreateCertificateDrawer()
                    }}>Create Certificate</span>,
                key: "certificate",
            },
            {
                label: <span
                    onClick={() => {
                        setAppointmentSelectedFromMenu(record);
                        handleEndVisitReasonDrawer()
                    }}>End Visit</span>,
                key: "endvisit",
            },
            {
                label: <span
                    onClick={() => {
                        setAppointmentSelectedFromMenu(record);
                        handleEndVisitReasonModal();
                    }}>End Visit Reason</span>,
                key: "endvisitreason",
            },
            {
                label: (
                    <div onClick={handleAddClick}>
                        Upload Medical Records
                        {isAndroid && !isBrowser ? (
                            <div
                                ref={fileInputRef}
                                onClick={() => handleUploadDocPopup(record)}
                                style={{ display: "none" }}
                            />
                        ) : (
                            <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                onChange={(event) => handleFileUpload(event, record)}
                                accept="image/png, image/jpeg, image/jpg, application/pdf"
                                style={{ display: "none" }}
                            />
                        )}
                    </div>
                ),
                key: "uploadDoc",
            },
        ]?.filter((item) => item);

        if (selectedTab === TAB_QUEUE) {
            return items.filter((item) => item.key !== "endvisitreason");
        } else if (selectedTab === TAB_FINISHED) {
            return items.filter((item) => item.key !== "endvisit" && item.key !== "cancelappt");
        } else if (selectedTab === TAB_CANCELLED) {
            return items.filter((item) => item.key !== "endvisitreason" && item.key !== "endvisit" && item.key !== "cancelappt");
        } else {
            return items;
        }
    };

    const onConsultClick = async (record) => {
        window.Moengage.track_event("patient_search_consult", {
            "doctor_id": profile?.doctor_unique_id,
            "patient_id": record?.patient_unique_id
        });
        goToPatientDetails(record, '/prescription');
    }

    const onPatientDetailsClick = async (record) => {
        goToPatientDetails(record, '/patient_details');
    }

    const goToPatientDetails = async (record, route) => {
        const decodedToken = getDecodedToken();
        const tokenData = decodedToken?.result;
        if (tokenData?.hospital_business_id == env.zydus_business_id && isZydusUserAccessableFromGB) {
            var sendZydusData = {
              siteId: siteId,
              empNo: empNo.toString(),
              date: moment(date.startDate).format(showDateFormat),
              apStatue: TAB_ZYDUS_ENCOUNTER,
              page: 0,
              filterVisitType: visitTypeFilters,
              fetchBillStatus:
                advancedSettings?.billingStatusInAppointmentScreen,
            };
            const action = await dispatch(zydusConsultAppoint(sendZydusData))
            if (action.meta.requestStatus === "fulfilled") {
                const data = action?.payload?.find(e => e?.encounterId == record?.pam_ref_id)
                if (data !== undefined) {
                    navigate(route, {
                        state: {
                            patient_data: {
                                ...record,
                                mrno: data.mrno,
                                departmentId: data.departmentId,
                                visitId: data.visitId,
                                encounterId: data.encounterId,
                                employeeId: empNo[empNo.length - 1]
                            }
                        }
                    })
                } else {
                    navigate(route, { state: { patient_data: record } })
                }
            }
        } else {
            navigate(route, { state: { patient_data: record } })
        }
    }

    const onZydus_Consult_PatientDetails_Click = async (record, flag) => {
        const decodedToken = getDecodedToken();
        const tokenData = decodedToken?.result;

        const listSalutation = [
            "B/O",
            "Baby",
            "D/O",
            "Dr",
            "Master",
            "Miss",
            "Mr",
            "Mrs",
            "Ms.",
            "S/O"
        ];
        const [title, ...rest] = record.patientName.split(" "); //patientName

        let sendData = {
            "source": "TP-React-FE", //Static
            "business_id": tokenData?.hospital_business_id, //From Token
            "hospital_id": siteId, // site_id
            "doctor_ref_id": record.employeeId, // employeeId
            "patient_ref_id": record.mrno, //mrno
            "encounter_ref_id": record.encounterId, //encounterId
            "visit_type": record.visitTypeCode, //visitTypeCode
            "scheduled_date": moment(record.encounterDateTime, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY'), //encounterDateTime
            "scheduled_time": moment(record.encounterDateTime, 'DD-MM-YYYY HH:mm').format('HH:mm:ss'), //encounterDateTime
            "scheduled_duration": "", //Static
            "billing_status": "PAID", //Static
            "patient_details": {
                "salutation": listSalutation.some(e => e.toLowerCase() === title.toLowerCase()) ? title : "",
                "first_name": listSalutation.some(e => e.toLowerCase() === title.toLowerCase()) ? rest.join(" ") : record.patientName,
                "middle_name": "",
                "last_name": "",
                "date_of_birth": record.dob,
                "gender": record.gender,
                "contact_number": record.mobileNo,
                "email_id": "noreply@zydushospitals.com",
                "address": record.patient_address
            }
        }

        const action = await dispatch(syncZydusPatientAndAppointment(sendData))
        if (action.meta.requestStatus === "fulfilled") {
            if (flag === 1) {
                goToConsut(record, action, sendData.business_id);
            } else {
                let cashManagerSendData = {
                    patient_unique_id: action?.payload?.patient_unique_id !== undefined ? action?.payload?.patient_unique_id : 0,
                    tcm_id: 0
                }

                const actionCashManager = await dispatch(viewCaseManager(cashManagerSendData));
                if (actionCashManager.meta.requestStatus === "fulfilled") {
                    const actionViewPatient = await dispatch(viewPatient({ patient_unique_id: action?.payload?.patient_unique_id, source: 'zydus' }));
                    if (actionViewPatient.meta.requestStatus === "fulfilled") {
                        navigate("/patient_details", {
                            state: {
                                patient_data: {
                                    ...actionViewPatient?.payload,
                                    pam_id: action?.payload?.pam_id,
                                    mrno: record.mrno,
                                    departmentId: record.departmentId,
                                    visitId: record.visitId,
                                    encounterId: record.encounterId,
                                    employeeId: empNo[empNo.length - 1],
                                    hospital_business_id: tokenData?.hospital_business_id
                                }
                            }
                        })
                    } else {
                        errorMessage('Something went wrong! Please try again later')
                    }
                } else {
                    goToConsut(record, action, sendData.business_id);
                }
            }
        } else {
            errorMessage('Something went wrong! Please try again later')
        }
    }

    const goToConsut = async (record, action, business_id) => {
        const actionViewPatient = await dispatch(viewPatient({ patient_unique_id: action?.payload?.patient_unique_id, source: 'zydus' }));
        if (actionViewPatient.meta.requestStatus === "fulfilled") {
            navigate("/prescription", {
                state: {
                    patient_data: {
                        ...actionViewPatient?.payload,
                        pam_id: action?.payload?.pam_id,
                        mrno: record.mrno,
                        departmentId: record.departmentId,
                        visitId: record.visitId,
                        encounterId: record.encounterId,
                        employeeId: empNo[empNo.length - 1],
                        hospital_business_id: business_id
                    }
                }
            })
        } else {
            errorMessage('Something went wrong! Please try again later')
        }
    }

    const onSmartRxClick = async (record) => {
        window.Moengage.track_event("patient_search_consult", {
            "doctor_id": profile?.doctor_unique_id,
            "patient_id": record?.patient_unique_id
        });
        navigate("/smart-prescription", { state: { patient_data: record } })
    }

    const fetchData = async (tcm_id) => {
        const payload = {
            tcm_id: tcm_id,
        };
        try {
            const response = await api.post(
                FETCH_SMART_RX,
                payload,
                customBaseUrl
            );
            if (response?.data?.length) {
                return response.data;
            }
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    };

    const fetchRxDigitisedData = async (tcm_id) => {
        try {
            const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
            const cleanedToken = token.replace(/['"]+/g, '');

            // API call for Rx Digitisation
            const response = await axios.get(`${baseUrlRxDigitise}/api/v1/rxdigitize/rx/${tcm_id}`, {
                headers: {
                    'Authorization': `Bearer ${cleanedToken}`,
                },
            });
            return response.data; // return the data after it's fetched
        } catch (error) {
            console.error('Error digitizing the prescription:', error);
            return null;
        }
    };

    // Function to remove non-numeric characters (like 'th', 'rd', 'st') from the day part and format the date correctly
    function formatDate(dateString) {
        // Remove 'th', 'rd', 'st' or any such suffix from the day part
        const cleanedDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');

        // Try parsing the cleaned date
        const date = new Date(cleanedDateString);

        // Ensure the date is valid
        if (isNaN(date)) {
            console.error("Invalid date format");
            return null;  // Return null if the date is invalid
        }

        // Format the date to YYYY-MM-DD
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2); // Add leading zero if necessary
        const day = (`0${date.getDate()}`).slice(-2); // Add leading zero if necessary
        return `${year}-${month}-${day}`;
    }

    const handleDigitiseRx = async (record) => {
        const formattedDate = formatDate(record.apDate);

        const payload = {
            pam_id: record.pam_id,
            tcm_created_date: formattedDate
        };
        try {
            // API call for Rx Digitisation case id
            const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
            const cleanedToken = token.replace(/['"]+/g, '');
            const response = await axios.post(`${baseUrl}${UNFINISHED_RX_CASE}`, payload, {
                headers: {
                    'Authorization': `Bearer ${cleanedToken}`,
                },
            });
            const tcm_id = response.data[0]?.tcm_id
            const smartRxData = await fetchData(tcm_id);
            // const ocrData = await fetchRxDigitisedData(tcm_id);

            navigate("/smart-rx-digitise", {
                state: {
                    patient_data: record,
                    smartRxFilesData: smartRxData,
                    tcm_id: tcm_id,
                    pam_id: record.pam_id,
                    print_url: record.print_rx_url,
                    // digitisedData: ocrData.data,
                    page: "pending-digitization",
                    type: "new"
                },
            })
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const onPrintRxUrlClick = async (record) => {
        if (record.print_rx_url) {
            if (!isChrome && !isSafari) {
                navigate(`/?url=${record.print_rx_url}&key=print`, { replace: true })
                navigate(0, { replace: true });
            } else {
                await window.open(record.print_rx_url);
            }
        } else {
            setAppointmentSelectedFromMenu(record);
            handleNoDetailsModal()
        }
    }

    const genderAge = (patient_data) => {
        var value = `${patient_data?.pm_gender}, `
        if (profile?.dp_id === 9) {
            if (patient_data?.ageYears != 0) {
                value += `${patient_data?.ageYears}y`
            }
            if (patient_data?.ageMonths != 0) {
                value += ` ${patient_data?.ageMonths}m`
            }
            if (patient_data?.ageDays != 0) {
                value += ` ${patient_data?.ageDays}d`
            }
        } else {
            if (patient_data?.ageYears != 0) {
                value += `${patient_data?.ageYears}y`
            } else if (patient_data?.ageMonths != 0) {
                value += ` ${patient_data?.ageMonths}m`
            } else if (patient_data?.ageDays != 0) {
                value += ` ${patient_data?.ageDays}d`
            }
        }
        return value
    }

    const columns = [
        {
            title: "#",
            dataIndex: "srno",
            key: "srno",
            ellipsis: true,
            width: 80,
            className: "fs-14",
            render: (text, record, index) => (
                <div>
                    <span>{index + 1}</span>
                </div>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            render: (text, record) => (
                <div>
                    {selectedTab != TAB_ZYDUS_ENCOUNTER && selectedTab != TAB_ZYDUS_APPOINTMENT ?
                        <span className="text-primary cursor-pointer" onClick={() => onPatientDetailsClick(record)}>
                            {record.pm_salutation ? `${record.pm_salutation} ${record.pm_fullname}` : record.pm_fullname}
                        </span>
                        :
                        selectedTab == TAB_ZYDUS_ENCOUNTER ?
                            <span className="text-primary cursor-pointer" onClick={() => onZydus_Consult_PatientDetails_Click(record, 2)}>
                                {record.pm_fullname}
                            </span>
                            :
                            <span className="text-primary">
                                {record.pm_fullname}
                            </span>
                    }
                    <br />
                    <small>
                        {genderAge(record)}
                    </small>
                </div>
            ),
        },
        {
            title: selectedTab != TAB_ZYDUS_ENCOUNTER && selectedTab != TAB_ZYDUS_APPOINTMENT ? "Contact" : "Contact & Mrn",
            dataIndex: "pm_contact_no",
            key: "pm_contact_no",
            ellipsis: true,
            render: (text, record) => (
                <div>
                    <span>{record.pm_contact_no} </span> <br /> <small> {record.mrno} {zydusAappointmentData.some((x) => x.mrno == record.mrno) && selectedTab == TAB_ZYDUS_ENCOUNTER && '(A)'}</small>
                </div>
            )
        },
        {
            title: selectedTab !== TAB_ZYDUS_APPOINTMENT ? "Visit Type" : "Status",
            dataIndex: selectedTab !== TAB_ZYDUS_APPOINTMENT ? "toct_type" : "appointmentStatus",
            key: selectedTab !== TAB_ZYDUS_APPOINTMENT ? "toct_type" : "appointmentStatus",
            ellipsis: true,
            filteredValue: visitTypeFilters.split(',') || '',
            filters: selectedTab !== TAB_ZYDUS_APPOINTMENT ? getVisitTypeFilters() : null,
             render: (text, record) => (
                <div>
                    <span>{selectedTab !== TAB_ZYDUS_APPOINTMENT ? record.toct_type : record.appointmentStatus}</span>
                    {advancedSettings?.billingStatusInAppointmentScreen && record.billStatus && <span className={`bill-status ${record.billStatus === "Unbilled" ? "bill-status-unbilled" : ""}`}>{record.billStatus}</span>}
                </div>
            )
        },
        {
            title: "Slot",
            dataIndex: "time",
            key: "time",
            ellipsis: true,
            sortDirections: ['descend', 'ascend', 'descend'],
            defaultSortOrder: sort_order,
            sorter: (a, b, sortOrder) => {
                if (selectedTab !== TAB_ZYDUS_APPOINTMENT && selectedTab != TAB_ZYDUS_ENCOUNTER) {
                    if (sortOrder !== sort_order) {
                        setPageNo(0)
                        dispatch(changeSortOrder(sortOrder))
                    }
                } else {
                    const lhsDateTime = `${a.apDate} ${a.apTime}`;
                    const lhsLongTime = moment(lhsDateTime, "Do MMM YYYY HH:mm A").valueOf();

                    const rhsDateTime = `${b.apDate} ${b.apTime}`;
                    const rhsLongTime = moment(rhsDateTime, "Do MMM YYYY HH:mm A").valueOf();

                    const result = lhsLongTime - rhsLongTime;
                    return result;
                }
            },
            render: (text, record) => (
                <div>
                    <span className="text-lowercase">{record.apTime} </span> <br /> <small> {record.apDate}</small>
                </div>
            ),
        },
        {
            title: selectedTab != TAB_ZYDUS_APPOINTMENT ? "Action" : "",
            key: "action",
            width: 200,
            render: (_, record, index) => (
                selectedTab != TAB_ZYDUS_APPOINTMENT ?
                    <div size="middle" style={{ display: "flex", justifyContent: "space-between" }}>
                        {isSmartSyncAccessableFromGB && !isMobile && selectedTab != TAB_ZYDUS_ENCOUNTER ? (
                            isDigitisationTab ?
                                <>
                                    <button className="btn btn-outline-primary" style={{ fontSize: "13px !important" }} onClick={() => handleDigitiseRx(record, index)}>
                                        {"Digitise Rx"}
                                    </button>
                                </> :
                                <div className="d-flex">
                                    {selectedTab !== TAB_CANCELLED && (
                                        <button
                                            // className="btn btn-outline-primary btn-smart-rx" 
                                            className={`btn btn-outline-primary ${selectedTab === TAB_FINISHED ? 'btn-print-rx' : 'btn-smart-rx'}`}
                                            onClick={() => selectedTab === TAB_QUEUE ? onSmartRxClick(record) : onPrintRxUrlClick(record)}
                                        >
                                            {selectedTab === TAB_FINISHED ? "PrintRx" : "SmartRx"}
                                        </button>
                                    )}
                                    {selectedTab === TAB_QUEUE && (
                                        <button
                                            className="btn btn-outline-primary btn-down-arrow"
                                            onClick={() => setOpenRowIndex(openRowIndex === index ? null : index)}
                                        >
                                            <span role="img" aria-label="down" class="anticon anticon-down ant-select-suffix">
                                                <i
                                                    className="icon-right"
                                                    style={{ display: "block", transform: `rotate(270deg)` }}
                                                />
                                            </span>
                                        </button>
                                    )}
                                    {openRowIndex === index &&
                                        <button ref={consultButtonRef} className="btn-consult" onClick={() => onConsultClick(record)}>
                                            Consult
                                        </button>
                                    }
                                </div>
                        ) : (
                            <>
                                {selectedTab !== TAB_CANCELLED && selectedTab != TAB_ZYDUS_APPOINTMENT && !finishedData.some((x) => x.pam_ref_id == record.encounterId) && (
                                    <button className="btn btn-outline-primary" onClick={() => selectedTab === TAB_QUEUE ? onConsultClick(record) : selectedTab === TAB_ZYDUS_ENCOUNTER ? onZydus_Consult_PatientDetails_Click(record, 1) : onPrintRxUrlClick(record)}>
                                        {selectedTab === TAB_FINISHED ? "PrintRx" : "Consult"}
                                    </button>
                                )}
                            </>
                        )}
                        {record?.symptomsGathered && (
                        <>
                            <img 
                                ref={index === firstSymptomIndex ? setTourRef : null}
                                src={symptoms} 
                                alt="symptoms" 
                                onClick={() => setIsSymptomsCollectorTour(true)}
                                style={{ cursor: 'pointer', marginLeft: '10px' }}
                            />
                             {index === firstSymptomIndex &&
                             (<Tour 
                                placement="bottomRight"
                                closeIcon={false} 
                                open={isSymptomsCollectorTour} 
                                steps={steps} 
                                onClose={onTourHandle}
                                maskClosable={true}
                                style={{
                                    width: '305px',
                                    borderRadius: '16px',
                                    padding: '24px'
                                }}
                                width={305}
                            />)}
                        </>
                        )}
                        {!isDigitisationTab && selectedTab != TAB_ZYDUS_ENCOUNTER && selectedTab != TAB_ZYDUS_APPOINTMENT &&
                            <Dropdown
                                className="btn btn-outline btn-more ms-3 d-flex align-items-center"
                                menu={{
                                    items: getMenuItems(record),
                                }}
                                trigger={["click"]}
                            >
                                <a
                                    onClick={(e) => {
                                        e.preventDefault();
                                        getPatientBills(record);
                                    }}
                                >
                                    <i className="icon-More" />
                                </a>
                            </Dropdown>
                        }
                    </div>
                    : null
            ),

        },
    ];

    const handleChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
        setVisitTypeFilters(filters.toct_type ? filters.toct_type.toString() : '');
    };

    const emptyText = (
        <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ height: "calc(100vh - 350px)" }}
        >
            <img src={noData} alt="Warning" />
            <div className="mt-3 fontroboto fw-normal">
                {selectedTab === TAB_QUEUE
                    ? "There are no patients in your queue right now!"
                    : selectedTab === TAB_FINISHED
                        ? "You haven't finished any consultations or ended the visit yet."
                        : "Nothing here! You haven’t cancelled any appointments here."}
            </div>
        </div>
    );

    const loadMoreData = useCallback(
        () => {
            setPageNo(pageNo + 1)
        },
        [pageNo]
    );

    const handleConfirmationModal = useCallback(
        () => {
            setConfirmationModalOpen(!isConfirmationModalOpen)
        },
        [isConfirmationModalOpen]
    );

    const handleEndVisitReasonModal = useCallback(
        () => {
            setEndVisitReasonModal(!isEndVisitReasonModal)
        },
        [isEndVisitReasonModal]
    );

    const handleEndVisitReasonDrawer = useCallback(
        () => {
            setEndVisitReasonDrawer(!endVisitReasonDrawer)
        },
        [endVisitReasonDrawer]
    );

    const handleCreateCertificateDrawer = useCallback(
        () => {
            setCreateCertificateDrawer(!createCertificateDrawer)
        },
        [createCertificateDrawer]
    );

    const handleAddLabParamsDrawer = useCallback(
        () => {
            setAddlabparamsDrawer(!addlabparamsDrawer)
        },
        [addlabparamsDrawer]
    );

    const handleCreateBillDrawer = useCallback(
        () => {
            setCreateBillDrawer(!createBillDrawer);
            if (recentBillDrawer && !isReceptionist) {
                setRecentBillDrawer(false);
            }
            if (recentBillDrawer && isReceptionist) {
                getPatientBills(appointmentSelectedFromMenu);
            }
        },
        [createBillDrawer]
    );

    const handleAddAdvanceDrawer = useCallback(
        () => {
            setAddAdvanceDrawer(!addAdvanceDrawer);
        },
        [addAdvanceDrawer]
    );

    const handleRecentBillDrawer = useCallback(() => {
        setRecentBillDrawer(!recentBillDrawer);
    }, [recentBillDrawer]);

    const handleLabParamsUpdate = (() => {
        // setAddlabparamsDrawer(!addlabparamsDrawer)
    });

    const handleNoDetailsModal = useCallback(
        () => {
            setNoDetailsModal(!noDetailsModal)
        },
        [noDetailsModal]
    );

    const onEndVisitReasonChange = useCallback(
        (e) => {
            setEndVisitReason(e.target.value)
        },
        [endVisitReason]
    );

    const getPatientBills = async (record, sortParams = {}) => {
        const queryParams = {
            doctorIds: isReceptionist ? urlParams.get("um_id")?.split(",") : [userId],
            sortBy: sortParams.field || "date",  // Default sort by date
            sortOrder: sortParams.order || "asc", // Default ascending order
            page: 1,
            limit: 25,
            patientId: record?.patient_unique_id || appointmentSelectedFromMenu?.patient_unique_id,
            appointmentId: isReceptionist ? undefined : record?.pam_id || appointmentSelectedFromMenu?.pam_id,
            type: "new"
        };

        if (!isReceptionist) {
            queryParams.startDate = moment().format("YYYY-MM-DD");
            queryParams.endDate = moment().format("YYYY-MM-DD");
        }

        const response = await fetchBillsByPatient(queryParams);
            if (isReceptionist) {
                const patientData = {
                  patient_unique_id: record?.patient_unique_id || appointmentSelectedFromMenu?.patient_unique_id || urlParams.get("patient_unique_id"),
                  pm_pid: record?.pm_pid,
                  pam_id: record?.pam_id,
                  source: record?.source,
                  receptionistId: record?.receptionistId,
                  receptionistName: record?.receptionistName,
                  pm_fullname: response?.patient?.name,
                  pm_contact_no: response?.patient?.phone,
                  pm_salutation: response?.patient?.salutation,
                  pm_gender: response?.patient?.gender,
                  tpml_refrence_id: response?.patient?.refId,
                  address: response?.patient?.address,
                  ageYears: response?.patient?.ageYears,
                  ageMonths: response?.patient?.ageMonths,
                  ageDays: response?.patient?.ageDays,
                  pm_pid: urlParams.get("pm_pid"),
                  pam_id: urlParams.get("pam_id"),
                  source: urlParams.get("source"),
                  receptionistId: urlParams.get("receptionistId"),
                  receptionistName: urlParams.get("receptionistName"),
                };
                setAppointmentSelectedFromMenu(patientData);
            }
        if (response?.bills?.length > 0) {
            const billData = response?.bills?.map((bill) => ({
                ...bill,
                patient: response?.patient,
            }));
            setPatientBills(billData);
        }
        const patientWalletBalanceRes = await fetchPatientWalletBalance(
            record?.patient_unique_id ||
            appointmentSelectedFromMenu?.patient_unique_id ||
            urlParams.get("patient_unique_id")
        );
        setPatientWalletBalance(patientWalletBalanceRes?.advanceDepositBalance);
    };

    const NO_DETAILS_MODAL = useMemo(() => {
        return (
            <CommonModal
                isModalOpen={noDetailsModal}
                onCancel={handleNoDetailsModal}
                modalWidth={500}
                title={"No Details Found"}
                modalBody={
                    <>
                        <div className="alert-warning rounded-10px p-2 patient-details">
                            <div className="d-flex align-items-center">
                                <img className='me-3' src={alertIcon} alt="Warning" />
                                <span>
                                    {`The doctor ended ${appointmentSelectedFromMenu?.pm_first_name}’s visit without adding prescription details.`}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="d-flex align-items-center mt-2 justify-content-end">
                                <Button onClick={handleNoDetailsModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                    <span>Got It</span>
                                </Button>
                            </div>
                        </div>
                    </>
                }
            />
        );
    }, [noDetailsModal]);

    const CONFIRMATION_MODAL = useMemo(() => {
        return (
            <CommonModal
                isModalOpen={isConfirmationModalOpen}
                modalWidth={610}
                title={"Are you sure you want to cancel this appointment?"}
                onCancel={handleConfirmationModal}
                modalBody={
                    <>
                        <div className="border bg-body rounded-10px p-2 patient-details">
                            <div className="d-flex align-items-center">
                                <i className="icon-patients me-2" />

                                <span className="title-common fontroboto">
                                    {appointmentSelectedFromMenu?.pm_fullname}
                                    <span className="fw-normal ms-2">
                                        ({genderAge(appointmentSelectedFromMenu)})
                                    </span>
                                </span>
                            </div>
                            <div className="mt-2 d-flex align-items-center">
                                <i className="icon-phone me-2" />{" "}
                                <span>{appointmentSelectedFromMenu?.pm_contact_no}</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <i className="icon-Id me-2" />{" "}
                                <span>{appointmentSelectedFromMenu?.pm_pid}</span>
                            </div>
                        </div>
                        <div className="alert-warning rounded-10px p-2 patient-details mt-3">
                            <div className="d-flex align-items-center">
                                <img className='me-3' src={alertIcon} alt="Warning" />
                                <span>
                                    Canceling this appointment will free up the time slot for others.
                                    This action cannot be undone. Do you want to proceed?
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="d-flex align-items-center mt-2">
                                <Button
                                    type="text"
                                    className="btn btn-primary2 align-items-center text-primary btn-41 me-4 w-50"
                                    onClick={handleConfirmationModal}>
                                    No, Keep Appointment{" "}
                                </Button>
                                <Button
                                    type="text"
                                    className="btn btn-primary3 align-items-center btn-41 w-50"
                                    loading={loading}
                                    onClick={async () => {
                                        const sendData = {
                                            pam_id: appointmentSelectedFromMenu.pam_id,
                                            patient_unique_id: appointmentSelectedFromMenu.patient_unique_id,
                                            pm_id: appointmentSelectedFromMenu.pm_id,
                                            pm_pid: appointmentSelectedFromMenu.pm_pid
                                        };
                                        const action = await dispatch(cancelAppointments(sendData));
                                        if (action.meta.requestStatus === "fulfilled") {
                                            handleConfirmationModal()
                                            message.open({
                                                key: MESSAGE_KEY,
                                                type: '',
                                                className: 'message-appointment',
                                                content: (
                                                    <div className='d-flex align-items-center'>
                                                        <img src={ImgcancelEnd} className='me-3' />
                                                        <div>
                                                            <div className='title-common text-start fontroboto'>Appointment Cancelled Successfully</div>
                                                            <div className='fontroboto text-start fw-normal mt-1'>View cancelled appointments in Cancelled tab.</div>
                                                        </div>
                                                        <img src={imgCloseVisit} className='ms-3' onClick={() => message.destroy()} />
                                                    </div>
                                                ),
                                                duration: 5,
                                            });
                                        }
                                    }}>
                                    Yes, Cancel Appointment{" "}
                                </Button>
                            </div>
                        </div>
                    </>
                }
            />
        );
    }, [isConfirmationModalOpen]);

    const END_VISIT_REASON_DISPLAY_MODAL = useMemo(() => {
        return (
            <CommonModal
                isModalOpen={isEndVisitReasonModal}
                modalWidth={610}
                title={
                    <>
                        <div className="d-flex align-items-center">
                            <i className="icon-patients me-2" />
                            <span className="title-common fontroboto">
                                {appointmentSelectedFromMenu?.pm_fullname}
                                <span className="fw-normal ms-2">
                                    ({genderAge(appointmentSelectedFromMenu)})
                                </span>
                            </span>
                        </div>
                    </>
                }
                onCancel={handleEndVisitReasonModal}
                modalBody={
                    <>
                        <div className="mb-2 fw-medium fs-16">End Visit Reason</div>
                        <div className="border bg-body rounded-10px p-3 patient-details" style={{ minHeight: 100 }}>
                            {appointmentSelectedFromMenu?.tpvl_remarks}
                        </div>
                    </>
                }
            />
        );
    }, [isEndVisitReasonModal]);

    const onEndVisitClick = async () => {
        const sendData = {
            pam_id: appointmentSelectedFromMenu.pam_id,
            patient_unique_id: appointmentSelectedFromMenu.patient_unique_id,
            pm_id: appointmentSelectedFromMenu.pm_id,
            pm_pid: appointmentSelectedFromMenu.pm_pid,
            tpvl_remarks: endVisitReason
        };
        const action = await dispatch(endVisit(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            setEndVisitReason('')
            handleEndVisitReasonDrawer()

            message.open({
                key: MESSAGE_KEY,
                type: '',
                className: 'message-appointment',
                content: (
                    <div className='d-flex align-items-center'>
                        <img src={visitEnd} className='me-3' />
                        <div>
                            <div className='title-common text-start fontroboto'>{`${appointmentSelectedFromMenu?.pm_first_name}’s visit ended successfully.`}</div>
                            <div className='fontroboto text-start fw-normal mt-1'>View completed visits in finished tab.</div>
                        </div>
                        <img src={imgCloseVisit} className='ms-3' onClick={() => message.destroy()} />
                    </div>
                ),
                duration: 5,
            });

        }
    }

    const disabledDate = (current) => {
        // Can not select days before today and today
        // return current && current > dayjs().endOf("day");
        return current && current >= moment().add(1, 'days').startOf('day');
    };

    const observer = useRef();
    const lastPostElementRef = useCallback(
        (node) => {
            if (loading || !setOnLoad) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreData()
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, setOnLoad]
    );

    // const lastPostElementRef = useRef(null);
    // useEffect(() => {
    //     if (loading || !setOnLoad) return;
    //     const observer = new IntersectionObserver(
    //         ([entry]) => {
    //             if (entry.isIntersecting) {
    //                 loadMoreData()
    //             }
    //         },
    //         {
    //             root: null, // viewport
    //             rootMargin: '0px', // no margin
    //             threshold: 0.5, // 50% of target visible
    //         }
    //     );

    //     if (lastPostElementRef.current) {
    //         observer.observe(lastPostElementRef.current);
    //     }

    //     // Clean up the observer
    //     return () => {
    //         if (lastPostElementRef.current) {
    //             observer.unobserve(lastPostElementRef.current);
    //         }
    //     };
    // }, [loading, setOnLoad]);

    return (
        <>
            {!isReceptionist && (<div className="border rounded-4 appointment-wrap dateborder">
                <Tabs
                    defaultActiveKey={TAB_QUEUE}
                    items={items}
                    onChange={onChange}
                    activeKey={selectedTab}
                />
                <div className="appointment-data">
                    <Row className="justify-content-between align-items-center my-3 px-4">
                        <Col xl={4} sm={4}>
                            {(selectedTab != TAB_ZYDUS_ENCOUNTER && selectedTab != TAB_ZYDUS_APPOINTMENT) ? (
                                <Input
                                    value={searchQuery}
                                    placeholder="Search patient by name and mobile number"
                                    className="inputheight38"
                                    prefix={<i className="icon-search" />}
                                    suffix={searchQuery.length > 0 && <i className="icon-Cross" onClick={() => onSearch('')}></i>}
                                    onChange={(e) => onSearch(e.target.value)}
                                />
                            ) : (
                                <Input
                                    value={zydusSearchQuery}
                                    placeholder="Search patient by name, MRN or mobile number"
                                    className="inputheight38"
                                    prefix={<i className="icon-search" />}
                                    suffix={zydusSearchQuery.length > 0 && <i className="icon-Cross" onClick={() => onZydusSearch('')}></i>}
                                    onChange={(e) => onZydusSearch(e.target.value)}
                                />
                            )}
                        </Col>
                        <Col md="auto">
                            <div className="d-flex align-items-center">
                                <ButtonGroup aria-label="Basic example" className="appointment-date-group">
                                    <Button
                                        variant="outline-light"
                                        className="dateoutline"
                                        disabled={date.startDate !== date.endDate}
                                        onClick={backDatePress}>
                                        <i className="icon-right d-block text-main"></i>
                                    </Button>
                                    <Button variant="outline-light" className="p-0 antround-0" disabled={isDigitisationTab}>
                                        <DatePicker
                                            inputReadOnly
                                            format={showDateFormat}
                                            placeholder={showDateFormat.toLowerCase()}
                                            // disabled={date.startDate != date.endDate}
                                            disabledDate={selectedTab !== TAB_QUEUE && selectedTab !== TAB_ZYDUS_ENCOUNTER && selectedTab !== TAB_ZYDUS_APPOINTMENT && disabledDate}
                                            defaultValue={dayjs(moment(date.startDate).format(showDateFormat), showDateFormat)}
                                            value={
                                                date.startDate == date.endDate
                                                    ? dayjs(moment(date.startDate).format(showDateFormat), showDateFormat)
                                                    : ""
                                            }
                                            onChange={onDateChange}

                                        />
                                    </Button>
                                    <Button
                                        variant="outline-light"
                                        className="dateoutline"
                                        disabled={date.startDate !== date.endDate}
                                        onClick={nextDatePress}>
                                        <i className="icon-right text-main d-block iconrotate180"></i>
                                    </Button>
                                </ButtonGroup>
                                {(selectedTab != TAB_ZYDUS_ENCOUNTER && selectedTab != TAB_ZYDUS_APPOINTMENT) && (
                                    <Select
                                        placeholder="Select Period"
                                        className="ms-3 appointmentselect"
                                        value={isDigitisationTab ? 6 : selectedCalanderOptions}
                                        options={
                                            selectedTab === TAB_QUEUE
                                                ? calanderOptions.filter(e => [1, 2, 3].includes(e.value))
                                                : isDigitisationTab
                                                    ? calanderOptions.filter(e => e.value === 6)
                                                    : calanderOptions.filter(e => [1, 4, 5].includes(e.value))
                                        }
                                        onChange={handleDateChange}
                                    />
                                )}
                                {/* <Segmented
                                className="ms-3 appointment-segment"
                                defaultValue={1}
                                options={segmentedList}
                                onChange={segmentedChange}
                            /> */}
                            </div>
                        </Col>
                    </Row>
                    {segmented == 1 ? (
                        <div>
                            <>
                                <Table
                                    className="px-xl-4 px-0"
                                    columns={columns}
                                    dataSource={selectedTab !== TAB_ZYDUS_ENCOUNTER && selectedTab !== TAB_ZYDUS_APPOINTMENT ? appointmentsData : matchedAppointment}
                                    onChange={handleChange}
                                    pagination={false}
                                    loading={loading && pageNo === 0}
                                    locale={{ emptyText: emptyText }}
                                />
                                {appointmentsData.length >= 25 && setOnLoad && selectedTab !== TAB_ZYDUS_ENCOUNTER && selectedTab !== TAB_ZYDUS_APPOINTMENT && (
                                    <div ref={lastPostElementRef} className="align-items-center d-flex h-38 justify-content-center">
                                        <Spin />
                                    </div>
                                    // <button
                                    //     ref={lastPostElementRef}
                                    //     className="btn btn-light w-100 mt-3 load-more">
                                    //     Show More
                                    // </button>
                                )}
                            </>
                        </div>
                    ) : (
                        <h1>Grid View</h1>
                    )}
                    {CONFIRMATION_MODAL}
                    {END_VISIT_REASON_DISPLAY_MODAL}
                    {NO_DETAILS_MODAL}
                </div>
                <Drawer
                    className="modalWidth-700" width="auto"
                    title="End Visit"
                    placement="right"
                    closable
                    open={endVisitReasonDrawer}
                    onClose={handleEndVisitReasonDrawer}
                    extra={
                        <Button
                            type='button'
                            onClick={onEndVisitClick}
                            className="btn-41 btn px-4 btn-primary3"
                            loading={loading}
                            disabled={!endVisitReason}>
                            Done
                        </Button>
                    }
                // key="left"
                >
                    <div className="p-4">
                        <div className="title-common mb-2">Reason</div>
                        <TextArea
                            // showCount
                            className="endreason-textarea"
                            // maxLength={100}
                            value={endVisitReason}
                            placeholder="Enter reason for end visit"
                            onChange={onEndVisitReasonChange}
                            style={{
                                height: 200,
                                resize: "none",
                            }}
                        />
                    </div>
                </Drawer>
                <Drawer
                    className="modalWidth-563" width="auto"
                    title="Create Certificate"
                    placement="right"
                    closable
                    open={createCertificateDrawer}
                    onClose={handleCreateCertificateDrawer}
                // key="left"
                >
                    <CreateCertificate handleCreateCertificateDrawer={handleCreateCertificateDrawer} patient_data={appointmentSelectedFromMenu} replace={false} />
                </Drawer>
                {addlabparamsDrawer && (<Drawer
                    closeIcon={false}
                    className="modalWidth-700"
                    // title="Add Lab Results"
                    placement="right"
                    open={addlabparamsDrawer}
                    onClose={showHideBackModal}
                    width="auto"
                // key="left"
                >
                    <LabParams handleAddLabParamsDrawer={handleAddLabParamsDrawer} patient_unique_id={appointmentSelectedFromMenu?.patient_unique_id} isBackModalOpen={isBackModalOpen} showHideBackModal={showHideBackModal} onSave={handleLabParamsUpdate} />
                </Drawer>)}
            </div>)}

            {modalOpen && (
                <WelcomeModal 
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    profile={profile}
                />
                // <Modal
                //     open={modalOpen}
                //     centered
                //     footer={null}
                //     width={window.innerWidth / 1.2}
                //     className="modal-onbording"
                //     onCancel={() => setModalOpen(false)}>
                //     <div style={{ flex: 1 }}>

                //         <div style={{ flex: 1, margin: 20 }}>

                //             <figure>
                //                 <img src={welcomdoc} style={{ width: window.innerWidth / 17, height: window.innerWidth / 17 }} />
                //             </figure>

                //             <div className='d-flex'>
                //                 <div style={{ flex: 1, marginRight: 35 }}>
                //                     <div>
                //                         <h2 className="fw-medium mb-2" style={{ fontSize: 16 }}>Dr. {profile?.um_name.split(/\s+/).filter(word => (word.toLowerCase() != "Dr".toLowerCase() && word.toLowerCase() != "Dr.".toLowerCase())).join(' ')},</h2>
                //                         <h3 className="fw-semibold mb-5" style={{ fontSize: 48 }}>Welcome to TatvaPractice</h3>
                //                     </div>
                //                     <div style={{ background: '#fef4f5', padding: 15, borderRadius: 10 }}>
                //                         <span>
                //                             <img src={suporticon} alt={""} />
                //                         </span>
                //                         <h3 className="fs-6 fw-medium" style={{ marginTop: 9 }}>We will connect with you soon</h3>
                //                         <p className="fs-7 fw-normal">
                //                             We will contact you within 24 hours to assist you in setting
                //                             up your digital clinic and provide a walkthrough for writing
                //                             prescription digitally.
                //                         </p>
                //                     </div>
                //                 </div>
                //                 <figure>
                //                     {/* <img src={docimg} style={{ width: '100%', height: window.innerHeight / 1.9, objectFit: 'contain' }} /> */}
                //                     <iframe width="498" height="392" className="rounded-4" src="https://www.youtube.com/embed/ENARZJhE0iI?si=1TPlavqb5nvR0vx3" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                //                 </figure>
                //             </div>

                //         </div>

                //         {/* <div class="doc-enjoy-secton d-flex align-items-center flex-column">
                //             <h3 className="fs-5 fw-semibold">
                //                 <span>
                //                     <img src={windoc} />
                //                 </span>
                //                 Enjoy your 30 days trial period
                //             </h3>
                //             <p className="fs-7 fw-normal">
                //                 This version is free for only 30 days. If you want to use
                //                 the version for further, Please take a subscription
                //             </p>
                //         </div> */}



                //     </div>
                // </Modal>
            )}
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
                        patientData={patientData}
                        handleUploadDocPopup={() => setShowUploadDocPopup((prev) => !prev)}
                        isAppointmentData={true}
                    />
                </Drawer>
            )}
            {shouldShowUploadDocPopup && (
                <UploadDocPopup
                    shouldShowUploadDocPopup={shouldShowUploadDocPopup}
                    onCancel={() => setShowUploadDocPopup(false)}
                    setFilesData={setFilesData}
                    filesData={filesData}
                    setUploadDocDrawer={setUploadDocDrawer}
                    patientData={patientData}
                    setIsFileSizeError={setIsFileSizeError}
                    setIsFileLimitError={setIsFileLimitError}
                    setIsFileTypeError={setIsFileTypeError}
                />
            )}
            {(isLoading || (isReceptionist && (!recentBillDrawer && !addAdvanceDrawer))) ? (
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
                                                <span style={{ fontWeight: 700 }}>8MB.</span> Please
                                                upload a file smaller than 8MB
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
            {createBillDrawer && (<Drawer
                closeIcon={false}
                placement="right"
                bodyStyle={{ backgroundColor: "white" }}
                open={createBillDrawer}
                onClose={showHideBackModal}
                width="100%"
                push={false}
            >
                <CreateBill handleCreateBillDrawer={handleCreateBillDrawer} isBackModalOpen={isBackModalOpen} showHideBackModal={showHideBackModal} patientData={appointmentSelectedFromMenu} />
            </Drawer>)}
            {recentBillDrawer && (
                <Drawer
                    closeIcon={false}
                    placement="right"
                    open={recentBillDrawer}
                    onClose={handleRecentBillDrawer}
                    width={isReceptionist ? "100%" : "77%"}
                    push={false}
                >
                    <RecentBills
                        handleRecentBillDrawer={handleRecentBillDrawer}
                        handleCreateBillDrawer={handleCreateBillDrawer}
                        patientBills={patientBills}
                        getPatientBills={getPatientBills}
                        totalAdvanceBalance={patientWalletBalance}
                        patientData={appointmentSelectedFromMenu}
                    />
                </Drawer>
            )}
            {addAdvanceDrawer &&
                <Drawer
                    closeIcon={false}
                    placement="right"
                    open={addAdvanceDrawer}
                    onClose={handleAddAdvanceDrawer}
                    width={isReceptionist ? "100%" : "85%"}
                    push={false}
                >
                    <AddAdvance handleAddAdvanceDrawer={handleAddAdvanceDrawer} patientData={appointmentSelectedFromMenu} />
                </Drawer>
            }

            <ExpiredSubModal
                title={S_BILLING}
                isSubModalOpen={isSubModalOpen}
                showHideSubModal={showHideSubModal} />
        </>
    );
}

export default React.memo(AppointmentData);