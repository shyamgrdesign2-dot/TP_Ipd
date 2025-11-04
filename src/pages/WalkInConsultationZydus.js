import React, {
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
} from "react";
import { AutoComplete, Input, Button, Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { isMobile } from "react-device-detect";
import { useFeatureIsOn } from "@growthbook/growthbook-react";

import TabHeader from "../components/tab_design/TabHeader";
import CommonModal from "../common/CommonModal";
import { clearSearch, searchPatients, synczyduspatient } from "../redux/appointmentsSlice";
import { isNumeric, isAlphabet, calculateAge, errorMessage, removeSpecialCharectorWithoutDotSpace } from "../utils/utils";
import { resetVaccineState } from "../redux/vaccineSlice";

import smartPad from "../assets/images/smartPad.svg";
import { GB_ISCRIBE } from "../utils/constants";
import { resetGrowthChartState } from "../redux/growthChartSlice";
import { resetObstetricState } from "../redux/obstetricSlice";
import moment from "moment";
import { resetUploadDocState } from "../redux/uploadDocSlice";
import { resetDDxState } from "../redux/ddxSlice";
import { setMedicationData } from "../redux/prescriptionSlice";

function WalkInConsultationZydus() {
    const navigate = useNavigate();

    const { profile } = useSelector((state) => state.doctors);
    const { patients, error } = useSelector((state) => state.records);

    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchOptions, setSearchOptions] = useState([]);
    const [clickedPatient, setClickedPatient] = useState(null);
    const [clickedDownArrow, setClickedDownArrow] = useState(false);
    const [autoCompleteFlag, setAutoCompleteFlag] = useState(false);
    const [isLoadingPatientDetails, setIsLoadingPatientDetails] = useState(false);
    const consultButtonRef = useRef(null);
    const isSmartSyncAccessableFromGB = useFeatureIsOn(
        GB_ISCRIBE
    );

    const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const currentHeight = window.innerHeight;

      // Compare new height with the original one to detect if the keyboard is open
      if (currentHeight < window.initialHeight) {
        setKeyboardOpen(true);
        // setKeyboardHeight(window.initialHeight - currentHeight);
      } else {
        setKeyboardOpen(false);
        // setKeyboardHeight(0);
      }
    };

    // Save the initial window height
    window.initialHeight = window.innerHeight;

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    const BoldWordInName = ({ name, boldWord }) => {
        if (!name || typeof name !== 'string') {
            return <span>{name || ''}</span>;
        }
        if (!boldWord || typeof boldWord !== 'string') {
            return <span>{name}</span>;
        }
        // Split the name into parts based on the bold word
        const parts = name.split(new RegExp(`(${removeSpecialCharectorWithoutDotSpace(boldWord)})`, "i"));

        // Map through the parts and apply different styles to the bold word
        const formattedName = parts.map((part, index) => {
            if (part.toLowerCase() === removeSpecialCharectorWithoutDotSpace(boldWord).toLowerCase()) {
                // If the part matches the bold word, render it in bold
                return (
                    <span key={index} className="fw-medium">
                        {part}
                    </span>
                );
            } else {
                // Otherwise, render it normally
                return <span key={index}>{part}</span>;
            }
        });

        return formattedName;
    };

    const onFocusParent = useCallback(() => {
        setAutoCompleteFlag(true);
    }, [autoCompleteFlag]);

    const onBlurParent = useCallback(
        () => {
            setAutoCompleteFlag(false);
        },
        [autoCompleteFlag]
    );

    // const onDownArrowClick = (patient, e) => {
    //   //   e.preventDefault();
    //   e.stopPropagation();
    //   // setOpenRowIndex(patient?.patient_unique_id);
    // };


    const onConsultClick = async (record) => {
        const action = await dispatch(synczyduspatient(record));
        if (action.meta.requestStatus === "fulfilled") {
            const result = action.payload
            window.Moengage.track_event("walkin_consult_start", {
                "doctor_id": profile?.doctor_unique_id,
                "patient_type": 'Existing',
                "patient_id": result?.patient_unique_id
            });
            navigate("/prescription", { state: { patient_data: { ...result, mrno: record.mrno } } })
        } else {
            errorMessage(action.error)
        }
    };

    const getMenuItems = (record) => {
        return [
            {
                label: (
                    <span
                        style={{
                            position: "absolute",
                            left: "-6.5rem",
                            top: "-6px",
                            backgroundColor: "white",
                            padding: "6px 68px 4px 14px",
                            borderRadius: "9px",
                            border: "1px solid #d5d5d5",
                            display: "inline-block",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            setAutoCompleteFlag(false)
                            onConsultClick(record);
                        }}
                    >
                        Consult
                    </span>
                ),
                key: "consult",
            },
        ];
    };

    const PatientPlank = (patient) => {
        return (
            <>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center" onClick={() => {
                        setAutoCompleteFlag(false)
                        setClickedPatient(patient)
                    }}>
                        <div className="list-patientName d-flex align-items-center me-4">
                            <i className="icon-patients backbar me-2"></i>{" "}
                            {/* <span className="fw-medium">
                                  {patient.pm_salutation && patient.pm_salutation}{" "}
                                  {patient.pm_first_name} {patient.pm_last_name} (
                                  {patient.pm_gender}, {patient.ageYears}y)
                              </span> */}
                            <span>
                                {patient.prefix && patient.prefix}{" "}
                                <BoldWordInName
                                    name={patient.patientname}
                                    boldWord={searchQuery}
                                />{" "}
                                ({patient.gender}, {calculateAge(moment(patient.dob).format('YYYY-MM-DD')).years}y)
                            </span>
                        </div>
                        {patient.mobilenumber && (
                            <div className="list-patientName d-flex align-items-center me-4">
                                <i className="icon-phone backbar me-2"></i>
                                {/* <span>{patient.pm_contact_no}</span> */}
                                <BoldWordInName
                                    name={patient.mobilenumber}
                                    boldWord={searchQuery}
                                />
                            </div>
                        )}
                        <div className="list-patientName d-flex align-items-center me-4">
                            <i className="icon-Id backbar me-2"></i>
                            {/* <span>{patient.pm_pid}</span> */}
                            <BoldWordInName name={patient.mrno} boldWord={searchQuery} />
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <Button
                            type="text"
                            className="btn btn-primary2 me-4 align-items-center d-flex"
                            icon={<i className="icon-Preview"></i>}
                            loading={isLoadingPatientDetails}
                            disabled={isLoadingPatientDetails}
                            onClick={() => onPatientDetailsClick(patient)}
                        >
                            Patient Details
                        </Button>
                        {isSmartSyncAccessableFromGB && !isMobile ? (
                            <div className="d-flex btn btn-smart-rx-walkin">
                                <div style={{ paddingLeft: "6px" }} onClick={() => onSmartRxClick(patient)}>
                                    <img src={smartPad} alt="vitals" />
                                    <button
                                        // className="btn btn-outline-primary btn-smart-rx"
                                        className="btn btn-smartRx-text"
                                    >
                                        SmartRx
                                    </button>
                                </div>
                                <div>
                                    <Dropdown
                                        className="btn"
                                        menu={{
                                            items: getMenuItems(patient),
                                        }}
                                        trigger={["click"]}
                                    >
                                        <a
                                            onClick={(e) => {
                                                e.preventDefault();
                                            }}
                                            style={{ padding: "5px" }}
                                        >
                                            <i
                                                className="icon-right"
                                                style={{
                                                    display: "block",
                                                    transform: `rotate(270deg)`,
                                                    color: "white",
                                                    // padding: "5px"
                                                }}
                                            />
                                        </a>
                                    </Dropdown>
                                </div>
                            </div>
                        ) : (
                            <Button
                                type="text"
                                className="btn btn-primary3 align-items-center d-flex"
                                icon={<i className="icon-Consult"></i>}
                                onClick={() => onConsultClick(patient)}
                            >
                                Start Consult
                            </Button>
                        )}
                    </div>
                </div>
            </>
        );
    };

    useEffect(() => {
        dispatch(resetVaccineState());
        dispatch(resetGrowthChartState());
        dispatch(resetObstetricState());
        dispatch(resetUploadDocState());
        dispatch(resetDDxState());
        dispatch(setMedicationData([]))
    }, [])

    useEffect(() => {
        if (searchQuery) {
            const timeOutId = setTimeout(() => {
                dispatch(searchPatients({ searchQuery: searchQuery, company: "zydus" }));
            }, 500);
            return () => {
                clearTimeout(timeOutId);
            };
        } else {
            dispatch(clearSearch());
        }
    }, [searchQuery]);

    useEffect(() => {
        const data = [];
        if (patients) {
            if (patients.length === 0 && searchQuery.length > 0) {
                data.push({
                    key: -2,
                    label: <div>{'No Data Found'}</div>,
                });
            } else {
                patients.map((patient) => {
                    return data.push({
                        key: JSON.stringify(patient),
                        value: patient.pm_pid,
                        label: PatientPlank(patient),
                    });
                });
            }
        }
        setSearchOptions(data);
    }, [patients]);

    const onSearchParent = useCallback(
        (query) => {
            setSearchQuery(query);
        },
        [searchQuery]
    );

    const handleClickDownArrow = () => {
        setClickedDownArrow(!clickedDownArrow);
    };

    const COMMON_MODAL = useMemo(() => {
        return (
            <CommonModal
                isModalOpen={clickedPatient != null}
                modalWidth={610}
                title={"Patient Selected"}
                onCancel={() => {
                    setClickedPatient(null);
                    setClickedDownArrow(false)
                }}
                modalBody={
                    <>
                        <div className="border bg-body rounded-10px p-2 patient-details">
                            <div className="d-flex align-items-center">
                                <i className="icon-patients me-2" />
                                <span className="title-common fontroboto">
                                    {clickedPatient?.patientname}{" "}
                                    <span className="fw-normal ms-2">
                                        {/* ({clickedPatient?.pm_gender}, {clickedPatient?.ageYears}y) */}
                                        ({clickedPatient?.gender}, {calculateAge(moment(clickedPatient?.dob).format('YYYY-MM-DD')).years}y)
                                    </span>
                                </span>
                            </div>
                            <div className="mt-2 d-flex align-items-center">
                                {clickedPatient?.mobilenumber && (
                                    <>
                                        <i className="icon-phone me-2" />{" "}
                                        <span>{clickedPatient?.mobilenumber}</span>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </>
                                )}
                                <i className="icon-Id me-2" />{" "}
                                <span>{clickedPatient?.mrno}</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="title-common">Choose Action</span>
                            <div className="d-flex align-items-center mt-2">
                                <div className="w-50">
                                    <Button
                                        type="text"
                                        className="btn btn-primary2 align-items-center d-flex btn-41 w-100"
                                        icon={<i className="icon-Preview" />}
                                        loading={isLoadingPatientDetails}
                                        disabled={isLoadingPatientDetails}
                                        onClick={() => onPatientDetailsClick(clickedPatient)}
                                    >
                                        View Patient Details{" "}
                                        <i className="icon-right iconrotate180 ms-auto" />
                                    </Button>
                                </div>
                                {isSmartSyncAccessableFromGB && !isMobile ? (
                                    <div className="w-50 ms-4">
                                        <div
                                            style={{
                                                background: "#4B4AD5",
                                                borderRadius: "10px",
                                                color: "white",
                                                position: "relative",
                                            }}
                                            className="d-flex justify-content-between"
                                        >
                                            <button
                                                className="btn btn-outline-primary btn-smart-rx"
                                                onClick={() => onSmartRxClick(clickedPatient)}
                                                style={{ padding: "9px 2rem 9px 10px" }}
                                            >
                                                <span className="btn-span-smartRx">SmartRx</span>
                                            </button>
                                            <button
                                                className="btn btn-outline-primary btn-down-arrow"
                                                onClick={handleClickDownArrow}
                                                style={{ padding: "9.5px 5px" }}
                                            >
                                                <span
                                                    role="img"
                                                    aria-label="down"
                                                    className="anticon anticon-down ant-select-suffix"
                                                >
                                                    <i
                                                        className="icon-right"
                                                        style={{
                                                            display: "block",
                                                            transform: `rotate(270deg)`,
                                                            color: "white",
                                                        }}
                                                    />
                                                </span>
                                            </button>
                                            {clickedDownArrow && (
                                                <div className='ps-rx-btns-grp' ref={consultButtonRef}>
                                                    <button
                                                        className="btn-consult-patient-details border-radius-all"
                                                        onClick={() => onConsultClick(clickedPatient)}
                                                    >
                                                        Consult
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-50 ms-4">
                                        <Button
                                            type="text"
                                            className="btn btn-primary3 align-items-center d-flex btn-41 w-100"
                                            icon={<i className="icon-Consult"></i>}
                                            onClick={() => onConsultClick(clickedPatient)}
                                        >
                                            Start Consult{" "}
                                            <i className="icon-right iconrotate180 ms-auto"></i>
                                        </Button>
                                    </div>
                                )
                                }
                            </div>
                        </div>
                    </>
                }
            />
        );
    }, [clickedPatient, clickedDownArrow]);

    const onPatientDetailsClick = async (record) => {
        // Prevent multiple clicks
        if (isLoadingPatientDetails) return;
        setIsLoadingPatientDetails(true);
        try {
            const action = await dispatch(synczyduspatient(record));
            if (action.meta.requestStatus === "fulfilled") {
                const result = action.payload;
                // Validate patient data before navigation
                if (!result?.patient_unique_id) {
                    errorMessage('Invalid patient data received. Please try again.');
                    return;
                }
                // Safe analytics tracking
                try {
                    if (window.Moengage && typeof window.Moengage.track_event === 'function') {
                        window.Moengage.track_event("TP_Patient_details", {
                            patient_number: record?.mobilenumber,
                            patient_id: result?.patient_unique_id
                        });
                    }
                } catch (error) {
                    console.warn('Analytics error:', error);
                }
                navigate("/patient_details", { 
                    state: { patient_data: { ...result, mrno: record.mrno } } 
                });
            } else {
                errorMessage(action.error);
            }
        } finally {
            setIsLoadingPatientDetails(false);
        }
    };

    const onSmartRxClick = async (record) => {
        const action = await dispatch(synczyduspatient(record));
        if (action.meta.requestStatus === "fulfilled") {
            const result = action.payload
            // window.Moengage.track_event("patient_search_consult", {
            //     doctor_id: profile?.doctor_unique_id,
            //     patient_id: result?.patient_unique_id,
            // });
            navigate("/smart-prescription", { state: { patient_data: { ...result, mrno: record.mrno } } })
        } else {
            errorMessage(action.error)
        }
    };

    return (
        <>
            {isMobile && <TabHeader flag={3} title="Start Walk-in Consultation" />}
            <div
                className={`${!isMobile && "border rounded-4 appointment-wrap"} p-4`}
            >
                <label className="mb-2 fontroboto fs-16 fw-medium">
                    {" "}
                    Enter Patient’s Name, Phone number or Id
                </label>{" "}
                <br />
                <div className="align-items-center d-flex position-relative">
                    <AutoComplete
                        value={searchQuery}
                        onSearch={onSearchParent}
                        options={searchOptions}
                        className={`${isMobile ? "autocomplete-ios" : "w-100"
                            } autocomplete-custom`}
                        onFocus={onFocusParent}
                        onBlur={onBlurParent}
                        open={autoCompleteFlag}
                        // defaultActiveFirstOption={true}
                        defaultOpen
                        listHeight={isMobile ? keyboardOpen ? window.innerHeight - 180 : window.innerHeight - 180 : 320}
                        autoFocus
                        popupClassName={`walkincomplete ${isMobile && "walkincomplete-mobile"
                            }`}
                    >
                        <Input
                            placeholder="Search via name, phn No or MRN (use * followed by last 6 digits of MRN eg: *234567)"
                            prefix={<i className="icon-search"></i>}
                            suffix={
                                searchQuery.length > 0 && (
                                    <i
                                        className="icon-Cross"
                                        onClick={() => onSearchParent("")}
                                    ></i>
                                )
                            }
                        />
                    </AutoComplete>

                    {COMMON_MODAL}
                </div>
            </div>
        </>
    );
}
export default React.memo(WalkInConsultationZydus);
