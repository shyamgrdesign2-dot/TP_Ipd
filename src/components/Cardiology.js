import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import Card from "react-bootstrap/Card";
import { Table, Dropdown, Button, Spin, Drawer } from "antd";
import { useNavigate } from "react-router-dom";
import { isChrome, isMobile, isSafari } from "react-device-detect";
import { useSelector } from "react-redux";
import api from "../api/services/axiosService";

import Symptomsicon from "../assets/images/Symptoms.svg";
import Examinationsicon from "../assets/images/Examination.svg";
import Diagnosisicon from "../assets/images/Diagnosis.svg";
import Medicationicon from "../assets/images/Medication.svg";
import Frameicon from "../assets/images/Frame.svg";
import Investigationicon from "../assets/images/Lab.svg";
import notesicon from "../assets/images/notes.svg";
import calenderBlank from "../assets/images/calenderBlank.svg";
import followUp from "../assets/images/followup.svg";
import smartPadGrey from "../assets/images/smartPadGrey.svg";
import successIcon from "../assets/images/success-icon.svg";
import vitalsIcon from "../assets/images/Vitals.svg";
import medicalHistoryIcon from "../assets/images/Medical-History.svg";
import vaccinationIcon from "../assets/images/Vaccination.svg";
import customModuleIcon from "../assets/images/custom-module.svg";

import {
  EXTRA_OPTIONS,
  FETCH_SMART_RX,
  GB_ISCRIBE,
  GB_SMARTSYNC_CVT,
  GB_SNAP_RX,
  PERSISTANT_STORAGE_KEY_AUTH_TOKEN,
} from "../utils/constants";

import {
  capitalize,
  isNumeric,
  medicine_freq_format,
  isValidMongoId,
  medicine_freq_dosage_format,
} from "../utils/utils";
import { env } from "../EnvironmentConfig";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import CvtKnowMore from "../pages/smartSync/components/CvtKnowMore";
import moment from "moment";
import { getModules } from "../redux/customModuleSlice";
import { getGenRx } from "../api/services/ApiGenRx";
import ApiCustomModule from "../api/services/ApiCustomModule";
import {
  getSnapRxDigitization,
  getSnapRxFiles,
} from "../pages/snapRx/services/snapRxService";

function Cardiology(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profile, userId } = useSelector((state) => state.doctors);
  const { frequencyList, timingList } = useSelector((state) => state.doctors);

  const {
    patient_data,
    tcmData,
    loading,
    viewCaseManagerData,
    nextPress,
    prevPress,
  } = props;

  const [customModulesRxData, setCustomModulesRxData] = useState([]);

  const [filteredInfo, setFilteredInfo] = useState({});
  const [setSortedInfo] = useState({});
  const [smartRxFile, setSmartRxFile] = useState([]);
  const [isSmartRxFile, setIsSmartRxFile] = useState(false);
  const [isSnapRx, setIsSnapRx] = useState(false);
  const [snapRxFile, setSnapRxFile] = useState([]);
  const [isSnapRxdigitised, setIsSnapRxdigitised] = useState(null);
  const [showDigitalSnapRx, setShowDigitalSnapRx] = useState(null);
  const [showDigitalRx, setShowDigitalRx] = useState(null);
  const [showDigitalGenRx, setShowDigitalGenRx] = useState(true);
  const [rxDigitisedData, setRxDigitisedData] = useState(null);
  const [snapRxDigitisedData, setSnapRxDigitisedData] = useState(null);
  const [isRxdigitised, setIsRxdigitised] = useState(null);
  const [cvtDrawer, setCvtDrawer] = useState(false);
  const [printUrl, setPrintUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [genRxData, setGenRxData] = useState(null);
  const [genRxQueries, setGenRxQueries] = useState(null);

  const isSmartSyncAccessableFromGB = useFeatureIsOn(GB_ISCRIBE);
  const isSmartSyncCVTAccessableFromGB = useFeatureIsOn(GB_SMARTSYNC_CVT);

  const isSnapRxAccessableFromGB = useFeatureIsOn(GB_SNAP_RX);

  const baseUrl = { customBaseUrl: env.casemanager_api_url };
  const baseUrlRxDigitise = env.rx_digitization;

  useEffect(() => {
    setSmartRxFile([]);
    setShowDigitalRx(false);
    if (viewCaseManagerData?.tcm_id) {
      fetchCustomModules();
      fetchData();
    }
    if (
      isSnapRxAccessableFromGB &&
      viewCaseManagerData?.tcm_id &&
      viewCaseManagerData?.smart_prescription_filename?.includes("snap_rx")
    ) {
      setIsSnapRx(true);
      fetchSnapRxFile();
      fetchSnapRxDigitisedData(viewCaseManagerData?.tcm_id);
    } else {
      setIsSnapRx(false);
    }
    if (
      isSmartSyncAccessableFromGB &&
      viewCaseManagerData?.smart_prescription_filename !== null &&
      viewCaseManagerData?.smart_prescription_filename?.includes(".jpeg")
      // viewCaseManagerData.medicine?.length === 0 &&
      // viewCaseManagerData.symptoms?.length === 0 &&
      // viewCaseManagerData.examination?.length === 0 &&
      // viewCaseManagerData.diagnosis?.length === 0 &&
      // viewCaseManagerData.advice?.length === 0 &&
      // viewCaseManagerData.investigation?.length === 0 &&
      // viewCaseManagerData.visit_advice &&
      // viewCaseManagerData.treatment
    ) {
      setIsSmartRxFile(true);
      if (viewCaseManagerData?.tcm_id && isSmartSyncCVTAccessableFromGB) {
        fetchRxDigitisedData(viewCaseManagerData?.tcm_id);
      }
    } else {
      setIsSmartRxFile(false);
    }
    if (viewCaseManagerData?.moduleContents?.length) {
      dispatch(getModules(userId));
    }
    if (isValidMongoId(viewCaseManagerData?.smart_prescription_filename)) {
      getGenRxDetails();
    }
  }, [viewCaseManagerData]);

  // Function to update rxDigitize parameter in the URL
  const updateRxDigitizeInUrl = (url, showDigitalRx) => {
    const urlObj = new URL(url);

    if (showDigitalRx) {
      urlObj.searchParams.set("rxDigitize", "true");
    } else {
      urlObj.searchParams.delete("rxDigitize");
    }

    // setPrintUrl(urlObj.toString());
    return urlObj.toString();
  };

  useEffect(() => {
    if (viewCaseManagerData?.print_url) {
      setPrintUrl(viewCaseManagerData?.print_url);
      // Only modify the URL if showDigitalRx is true, else keep printUrl unchanged
      const updatedUrl = updateRxDigitizeInUrl(
        viewCaseManagerData?.print_url,
        showDigitalRx || showDigitalSnapRx
      );

      setPrintUrl(updatedUrl);
    }
  }, [showDigitalRx, showDigitalSnapRx]);

  const fetchCustomModules = async () => {
    try {
      if (
        !viewCaseManagerData?.doctor_data?.um_id ||
        !viewCaseManagerData?.moduleContents?.length
      ) {
        setCustomModulesRxData([]);
        return;
      }

      const response = await ApiCustomModule.getModules(
        viewCaseManagerData.doctor_data.um_id
      );

      const customModulesMap = new Map(
        response?.modules?.map((module) => [module.module_id, module.name])
      );

      const processedModules = viewCaseManagerData.moduleContents
        .filter((module) => module.content && module.content.length > 0)
        .map((content) => ({
          ...content,
          module_name: customModulesMap.get(content.module_id),
        }));

      setCustomModulesRxData(processedModules);
    } catch (error) {
      console.error("Error fetching custom modules:", error);
      setCustomModulesRxData([]);
    }
  };

  const fetchData = async () => {
    const payload = {
      tcm_id: viewCaseManagerData?.tcm_id,
    };
    try {
      if (viewCaseManagerData?.smart_prescription_filename?.includes(".jpeg")) {
        const response = await api.post(FETCH_SMART_RX, payload, baseUrl);
        if (response?.data?.length) {
          setSmartRxFile(response?.data);
        } else {
          setSmartRxFile(null);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchSnapRxFile = async () => {
    const response = await getSnapRxFiles(
      patient_data.patient_unique_id,
      viewCaseManagerData?.tcm_id
    );
    setSnapRxFile(response?.uploaded_files || []);
  };

  const getGenRxDetails = async () => {
    try {
      const response = await getGenRx(
        viewCaseManagerData?.smart_prescription_filename
      );

      if (response.success) {
        setGenRxData(response.data?.editedData || response.data?.digitizeData);
        setGenRxQueries(
          response.data?.history?.map(({ transcription }) => transcription)
        );
      } else {
        throw new Error(response.error || "Failed to get Rx");
      }
    } catch (error) {
      console.error("Error getting Rx details:", error);
    }
  };

  const handleDrawerCvtKnowMore = useCallback(() => {
    setCvtDrawer(!cvtDrawer);
  }, [cvtDrawer]);

  //Handle Sider
  const handleCollapsed = useCallback(
    (flag) => {
      // if (flag === 1) {
      //     handleDrawerVital();
      // }
      if (flag === 5) {
        handleDrawerCvtKnowMore();
      }
    },
    [cvtDrawer]
  );

  async function printRxInAppContent() {
    navigate(
      `/patient_details/?url=${viewCaseManagerData?.print_rx_url}&key=print`,
      { replace: true, state: { patient_data: patient_data } }
    );
    navigate(0, { replace: true });
  }
  async function printRxContent() {
    await window.open(viewCaseManagerData?.print_rx_url);
  }

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const items = [
    {
      label: (
        <div
          onClick={() =>
            !isChrome && !isSafari ? printRxInAppContent() : printRxContent()
          }
        >
          Print Medicines Only
        </div>
      ),
      key: "printrx",
    },
    // {
    //     label: 'Saved as a Template',
    //     key: 'SavedasTemplate',
    // }
  ];

  const medicationData = viewCaseManagerData
    ? JSON.parse(JSON.stringify(viewCaseManagerData.medicine))
    : [];

  const innerMedication = (index) => {
    const mainArray = [];
    for (var i = index; i < medicationData.length; i++) {
      if (medicationData[i].tmm_id == medicationData[index].tmm_id) {
        mainArray.push(medicationData[i]);
      } else {
        break;
      }
    }
    return mainArray;
  };
  var sNO = 1;
  const columns = [
    {
      title: "S.NO",
      dataIndex: "rx",
      key: "rx",
      width: "40px",
      className: "rowspan-border-0",
      render: (text, record, index) => (
        <div>
          <span>
            {record?.tmm_id != medicationData[index - 1]?.tmm_id && sNO++}
          </span>
        </div>
      ),
      onCell: (record, index) => {
        if (record?.tmm_id != medicationData[index - 1]?.tmm_id) {
          return {
            rowSpan: innerMedication(index)?.length,
          };
        }
        if (record?.tmm_id == medicationData[index - 1]?.tmm_id) {
          return {
            rowSpan: 0,
          };
        }
      },
    },
    {
      title: "MEDICINE",
      dataIndex: "name",
      key: "name",
      className: "rowspan-border-0",
      render: (text, record) => (
        <div className="lh-base">
          <div className="fw-medium">{record.tmm_medicine_name}</div>
          <small>{record.tmm_generic}</small>
        </div>
      ),
      onCell: (record, index) => {
        if (record?.tmm_id != medicationData[index - 1]?.tmm_id) {
          return {
            rowSpan: innerMedication(index)?.length,
          };
        }
        if (record?.tmm_id == medicationData[index - 1]?.tmm_id) {
          return {
            rowSpan: 0,
          };
        }
      },
    },
    {
      title: "DOSE",
      dataIndex: "upd",
      key: "upd",
      width: "110px",
      render: (text, record, index) => (
        <>
          <div>{`${
            record.tmm_dosage && record.tmm_unit
              ? `${medicine_freq_dosage_format(record.tmm_dosage)} ${
                  record?.medicineUnit &&
                  record?.medicineUnit.find(
                    (x) => x.tmu_id == record.tmm_unit
                  ) !== undefined
                    ? record?.medicineUnit.find(
                        (x) => x.tmu_id == record.tmm_unit
                      ).tmu_title
                    : ""
                }`
              : `${
                  record?.medicineUnit &&
                  record?.medicineUnit.find(
                    (x) => x.tmu_id == record.default_tmm_unit
                  ) !== undefined
                    ? record?.medicineUnit.find(
                        (x) => x.tmu_id == record.default_tmm_unit
                      ).tmu_title
                    : ""
                }`
          }`}</div>

          {record?.tmm_id == medicationData[index - 1]?.tmm_id && (
            <div className="badge-then">Then</div>
          )}
        </>
      ),
    },
    {
      title: "Frequency",
      dataIndex: "TimeFrequency",
      key: "TimeFrequency",
      render: (text, record) => (
        <div className="lh-base">
          {record.tmf_block == 0 || record.tmf_block == ""
            ? `${
                record.tcm_tmm_freq_morning ||
                record.tcm_tmm_freq_afternoon ||
                record.tcm_tmm_freq_evening ||
                record.tcm_tmm_freq_night
                  ? `${
                      record.tcm_tmm_freq_morning
                        ? medicine_freq_dosage_format(
                            record.tcm_tmm_freq_morning
                          )
                        : 0
                    }-${
                      record.tcm_tmm_freq_afternoon
                        ? medicine_freq_dosage_format(
                            record.tcm_tmm_freq_afternoon
                          )
                        : 0
                    }${
                      record.tcm_tmm_freq_evening
                        ? "-" +
                          medicine_freq_dosage_format(
                            record.tcm_tmm_freq_evening
                          )
                        : ""
                    }-${
                      record.tcm_tmm_freq_night
                        ? medicine_freq_dosage_format(record.tcm_tmm_freq_night)
                        : 0
                    }`
                  : `-`
              }`
            : `(${
                frequencyList.find((x) => x.tmf_id == record.tmm_freq_type) !==
                undefined
                  ? frequencyList.find((x) => x.tmf_id == record.tmm_freq_type)
                      .tmf_title
                  : ""
              })`}
          <div>
            {timingList.find((x) => x.tmt_id == record.tmm_time) !== undefined
              ? timingList.find((x) => x.tmt_id == record.tmm_time).tmt_title
              : ""}
          </div>
        </div>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: "82px",
      render: (text, record) => (
        <div>
          {EXTRA_OPTIONS.some((x) => x.value == record.tmm_duration_type)
            ? capitalize(record.tmm_duration_type, true)
            : isNumeric(record.tmm_days)
            ? `${record.tmm_days} ${record.tmm_duration_type}`
            : "-"}
        </div>
      ),
    },
    {
      title: "QTY",
      dataIndex: "qty",
      key: "qty",
      width: "50px",
      render: (text, record) => (
        <div>{`${record.display_qty ? record.display_qty : "-"}`}</div>
      ),
    },
    {
      title: "Notes",
      dataIndex: "note",
      key: "note",
      render: (text, record) => (
        <div>{`${record.tmm_remarks ? record.tmm_remarks : "-"}`}</div>
      ),
    },
  ];

  const printContent = async () => {
    if (showDigitalRx || showDigitalSnapRx) {
      showDigitalRx &&
        window.Moengage.track_event("TP_Digitised_Prescription_Print", {
          Doctor_Name: profile?.um_name,
          Doctor_Number: profile?.um_contact,
          Doctor_Unique_Id: profile?.doctor_unique_id,
        });
      await window.open(printUrl);
    } else if (showDigitalGenRx && !isSmartRxFile) {
      const urlObj = new URL(viewCaseManagerData?.print_url);
      urlObj.searchParams.set("voiceRxDigitize", "true");
      const updatedUrl = urlObj.toString();
      await window.open(updatedUrl);
    } else {
      await window.open(viewCaseManagerData?.print_rx_url);
    }
  };

  const printInAppContent = async () => {
    let voiceRxUrl;
    if (showDigitalGenRx) {
      window.Moengage.track_event("TP_Digitised_Prescription_Print", {
        Doctor_Name: profile?.um_name,
        Doctor_Number: profile?.um_contact,
        Doctor_Unique_Id: profile?.doctor_unique_id,
      });
      const urlObj = new URL(viewCaseManagerData?.print_url);
      urlObj.searchParams.set("voiceRxDigitize", "true");
      voiceRxUrl = urlObj.toString();
    }
    navigate(
      `/patient_details/?url=${
        showDigitalGenRx && voiceRxUrl
          ? voiceRxUrl
          : viewCaseManagerData?.print_url
      }&key=print`,
      { replace: true, state: { patient_data: patient_data } }
    );
    navigate(0, { replace: true });
  };

  const handleEditRxClick = () => {
    window.Moengage.track_event("edit_rx_click", {
      doctor_id: profile?.doctor_unique_id,
      patient_id:
        patient_data !== undefined ? patient_data.patient_unique_id : 0,
      rx_date: viewCaseManagerData?.consultation_date,
    });

    if (isSnapRx && isSnapRxAccessableFromGB) {
      return navigate("/snap-rx", {
        state: {
          patient_data: patient_data,
          caseManagerData: viewCaseManagerData,
        },
      });
    }
    if (isSmartRxFile) {
      navigate("/smart-prescription", {
        state: {
          patient_data: patient_data,
          caseManagerData: viewCaseManagerData,
          smartRxFilesData: smartRxFile,
        },
      });
    } else {
      navigate("/prescription", {
        state: {
          patient_data: patient_data,
          send_path: "patient_details",
          caseManagerData: viewCaseManagerData,
        },
      });
    }
  };

  const fetchRxDigitisedData = async (caseId) => {
    try {
      const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
      const cleanedToken = token.replace(/['"]+/g, "");

      // API call for Rx Digitisation
      const response = await axios.get(
        `${baseUrlRxDigitise}/api/v1/rxdigitize/rx/${caseId}`,
        {
          headers: {
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );
      if (response?.data?.data) {
        setRxDigitisedData(response?.data?.data);
        if (response?.data?.data?.isDigitize) {
          setIsRxdigitised(true);
        } else {
          setIsRxdigitised(false);
        }
      } else {
        setRxDigitisedData(null);
      }

      return response.data; // return the data after it's fetched
    } catch (error) {
      console.error("Error digitizing the prescription:", error);
      return null;
    }
  };

  const fetchSnapRxDigitisedData = async (tcmId) => {
    try {
      const response = await getSnapRxDigitization(
        patient_data.patient_unique_id,
        tcmId
      );

      if (response?.digitization) {
        setSnapRxDigitisedData(
          response?.digitization?.editedData ||
            response?.digitization?.refinedData
        );
        setIsSnapRxdigitised(response?.digitization?.isDigitize);
      } else {
        setSnapRxDigitisedData(null);
        setIsSnapRxdigitised(false);
      }

      return response.digitization; // return the data after it's fetched
    } catch (error) {
      console.error("Error digitizing the prescription:", error);
      return null;
    }
  };

  const handleDigitiseRx = async (record) => {
    navigate("/smart-rx-digitise", {
      state: {
        patient_data: patient_data,
        smartRxFilesData: smartRxFile,
        tcm_id: viewCaseManagerData?.tcm_id,
        print_url: viewCaseManagerData?.print_rx_url,
        pam_id: patient_data?.pam_id,
        digitisedData: rxDigitisedData,
        page: "patient-summary",
        type: "new",
      },
    });
  };

  const handleDigitiseSnapRx = async (record) => {
    navigate("/snap-rx/digitise", {
      state: {
        patient_data: patient_data,
        smartRxFilesData: snapRxFile,
        tcm_id: viewCaseManagerData?.tcm_id,
        print_url: viewCaseManagerData?.print_rx_url,
        pam_id: patient_data?.pam_id,
        digitisedData: snapRxDigitisedData,
        page: "patient-summary",
        type: "new",
      },
    });
  };

  // Render items for each type (medications, tests, etc.)
  const renderItems = (type) => (
    <div className="digitised-data-section">
      <ul>
        {/* Handle vitals type separately */}
        {type === "vitals" &&
          Object.entries(rxDigitisedData?.editedData?.vitals || {})
            .filter(([key, value]) => value.trim()) // Filter out empty or falsy values
            .map(([key, value]) => (
              <li key={key}>
                <div className="medicine-item">
                  <span>
                    {/* Format the key to be human-readable */}
                    {`${key
                      .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
                      .replace(/^./, (str) => str.toUpperCase())}: `}
                  </span>
                  <span>{value}</span>
                </div>
              </li>
            ))}

        {/* Handle other types (assume they are arrays) */}
        {type !== "vitals" &&
          Array.isArray(rxDigitisedData?.editedData?.[type]) &&
          rxDigitisedData.editedData[type].map((item, index) => (
            <li key={index}>
              <div className="medicine-item">
                <span>
                  {/* Render dynamically based on type */}
                  {type === "advice"
                    ? item
                    : type === "symptoms" && item?.name?.length > 0
                    ? item.name[0]?.toUpperCase() + item.name?.slice(1)
                    : type === "medications" || type === "tests"
                    ? item?.refinedName
                    : item?.name}
                </span>

                {/* Optional rendering for lineItem */}
                {(type === "medications" ||
                  type === "vaccinations" ||
                  type === "medicalHistory" ||
                  type === "tests" ||
                  type === "symptoms") &&
                  item.lineItem && <span>{` (${item.lineItem})`}</span>}

                {/* Optional rendering for notes */}
                {(type === "examination" || type === "diagnosis") &&
                  item.notes && <span>{` (${item.notes})`}</span>}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );

  const renderGenRxItems = (type) => (
    <div className="digitised-data-section" style={{ marginLeft: 0 }}>
      <ol>
        {type === "followUp" && genRxData?.followUp && (
          <div className="medicine-item">
            <span>{genRxData?.followUp}</span>
          </div>
        )}
        {/* Handle vitals type separately */}
        {type === "vitalsAndBodyComposition" &&
          Object.entries(genRxData?.vitalsAndBodyComposition || {})
            .filter(([key, value]) => value.trim()) // Filter out empty or falsy values
            .map(([key, value]) => (
              <li key={key}>
                <div className="medicine-item">
                  <span>
                    {/* Format the key to be human-readable */}
                    {`${key
                      .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
                      .replace(/^./, (str) => str.toUpperCase())}: `}
                  </span>
                  <span>{value}</span>
                </div>
              </li>
            ))}

        {/* Handle other types (assume they are arrays) */}
        {type !== "vitalsAndBodyComposition" &&
          Array.isArray(genRxData?.[type]) &&
          genRxData?.[type].map((item, index) => (
            <li key={index}>
              <div className="medicine-item">
                {["advice", "others"].includes(type) && <span>{item}</span>}

                {/* Optional rendering for lineItem */}
                {(type === "medications" ||
                  type === "vaccinations" ||
                  type === "medicalHistory" ||
                  type === "labInvestigation" ||
                  type === "symptoms" ||
                  type === "examinations" ||
                  type === "diagnosis") &&
                  item.lineItem && <span>{item.lineItem}</span>}
              </div>
            </li>
          ))}
      </ol>
    </div>
  );

  const renderGenRxCustomModules = () =>
    Object.entries(genRxData?.dynamicFields || {}).map(([module, data]) => {
      return (
        Array.isArray(data) &&
        data?.every((item) => typeof item === "string") && (
          <>
            <div className="d-flex align-items-start">
              <div className="title-digitise-section mb-1">
                {module
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </div>
            </div>
            <div className="digitised-data-section" style={{ marginLeft: 0 }}>
              <ol>
                {data.map((value, index) => (
                  <li key={index}>
                    <div className="medicine-item">
                      <span>{value}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )
      );
    });

  // Add this helper function at the top of the component
  const hasValidContent = (data, type) => {
    if (!data?.[type] || !Array.isArray(data[type])) return false;

    return data[type].some((item) => {
      if (typeof item === "string") return item.trim().length > 0;

      // For object types, check if any relevant fields have content
      const relevantFields = {
        medications: ["refinedName", "lineItem"],
        symptoms: ["name", "lineItem"],
        examination: ["name", "notes"],
        diagnosis: ["name", "notes"],
        medicalHistory: ["name", "lineItem"],
        vaccinations: ["name", "lineItem"],
        tests: ["refinedName", "lineItem"],
      };

      const fieldsToCheck = relevantFields[type] || ["name"];
      return fieldsToCheck.some((field) => item[field]?.trim?.().length > 0);
    });
  };

  return (
    <div className="appointment-wrap PatientDetailswrap m-0">
      <Card className="">
        {viewCaseManagerData ? (
          <>
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="title2">{`${viewCaseManagerData?.doctor_data?.doctor_name} | ${viewCaseManagerData?.doctor_data?.dp_name}`}</div>
                  <div className="subtitle">
                    {viewCaseManagerData?.showConsultationDateTime}
                  </div>
                </div>
                <div className="align-items-center d-flex">
                  <Button
                    className="btn border rounded-3 px-1 me-2 antdesable-custom"
                    onClick={nextPress}
                    disabled={
                      !loading &&
                      tcmData.page > 1 &&
                      viewCaseManagerData?.next_tcm_id
                        ? false
                        : true
                    }
                  >
                    <i className="icon-right d-block"></i>
                  </Button>
                  <span className="fw-normal fs-14 fontroboto">{`${tcmData.page}/${viewCaseManagerData?.total_consultation}`}</span>
                  <Button
                    className="btn border rounded-3 antdesable-custom p-1 ms-2"
                    onClick={prevPress}
                    disabled={
                      !loading &&
                      tcmData.page < viewCaseManagerData?.total_consultation &&
                      viewCaseManagerData?.prev_tcm_id
                        ? false
                        : true
                    }
                  >
                    <i
                      className="icon-right"
                      style={{ display: "block", transform: `rotate(180deg)` }}
                    ></i>
                  </Button>
                </div>
                <div>
                  <button
                    className="btn p-0 ms-3"
                    style={{
                      visibility:
                        viewCaseManagerData?.doctor_data?.editCase &&
                        !(isSmartRxFile && isMobile)
                          ? "visible"
                          : "hidden",
                    }}
                    onClick={handleEditRxClick}
                  >
                    <i className="icon-Edit"></i>
                  </button>
                  <button
                    className="btn p-0 ms-3"
                    onClick={() =>
                      !isChrome && !isSafari
                        ? printInAppContent()
                        : printContent()
                    }
                    style={{
                      visibility:
                        !showDigitalGenRx &&
                        isValidMongoId(
                          viewCaseManagerData?.smart_prescription_filename
                        )
                          ? "hidden"
                          : "visible",
                    }}
                  >
                    <i className="icon-Print"></i>
                  </button>
                  {!isSmartRxFile &&
                    !isValidMongoId(
                      viewCaseManagerData?.smart_prescription_filename
                    ) && (
                      <Dropdown
                        className="btn btn-outline btn-more ms-1"
                        menu={{ items }}
                        trigger={["click"]}
                      >
                        <a onClick={(e) => e.preventDefault()}>
                          <i className="icon-More"></i>
                        </a>
                      </Dropdown>
                    )}
                </div>
              </div>
            </Card.Header>

            {isSmartSyncCVTAccessableFromGB &&
              isSmartRxFile &&
              viewCaseManagerData?.smart_prescription_filename?.length > 0 &&
              rxDigitisedData &&
              !isSnapRx &&
              (isRxdigitised ? (
                <div className="p-2 mb-2">
                  <button
                    className={`digital-btn ${
                      !showDigitalRx
                        ? "digitise-toggle-btn"
                        : "active-digitise-toggle-btn"
                    }`}
                    onClick={() => setShowDigitalRx(true)}
                  >
                    Digital Rx
                  </button>
                  <button
                    className={`written-btn ${
                      showDigitalRx
                        ? "digitise-toggle-btn"
                        : "active-digitise-toggle-btn"
                    }`}
                    onClick={() => setShowDigitalRx(false)}
                  >
                    Written Rx
                  </button>
                </div>
              ) : (
                rxDigitisedData?.ocrData && (
                  <div className="digitise-info-cardiology">
                    <img
                      src={successIcon}
                      alt="success"
                      width="40px"
                      height="40px"
                    />
                    <p>
                      <span className="digitise-info-header-cardiology">
                        {`${patient_data?.pm_fullname}'s Digital Rx is ready!`}
                      </span>
                      Digitise Rx to enhance patient care, workflow efficiency,
                      and revenue.
                      <button
                        className="know-more-btn"
                        onClick={handleDrawerCvtKnowMore}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            paddingLeft: "4px",
                            textDecoration: "underline",
                            textDecorationColor: "#454551",
                          }}
                        >
                          Know More
                        </span>
                      </button>
                    </p>
                    <button
                      className="digitise-info-btn-cardiology"
                      onClick={handleDigitiseRx}
                    >
                      Digitise Rx Now
                    </button>
                  </div>
                )
              ))}

            {isSnapRxAccessableFromGB &&
              isSnapRx &&
              snapRxDigitisedData &&
              (isSnapRxdigitised ? (
                <div className="p-2 mb-2">
                  <button
                    className={`digital-btn ${
                      !showDigitalSnapRx
                        ? "digitise-toggle-btn"
                        : "active-digitise-toggle-btn"
                    }`}
                    onClick={() => setShowDigitalSnapRx(true)}
                  >
                    Digital Rx
                  </button>
                  <button
                    className={`written-btn ${
                      showDigitalSnapRx
                        ? "digitise-toggle-btn"
                        : "active-digitise-toggle-btn"
                    }`}
                    onClick={() => setShowDigitalSnapRx(false)}
                  >
                    Written Rx
                  </button>
                </div>
              ) : (
                snapRxDigitisedData?.ocrData && (
                  <div className="digitise-info-cardiology">
                    <img
                      src={successIcon}
                      alt="success"
                      width="40px"
                      height="40px"
                    />
                    <p>
                      <span className="digitise-info-header-cardiology">
                        {`${patient_data?.pm_fullname}'s Digital Rx is ready!`}
                      </span>
                      Digitise Rx to enhance patient care, workflow efficiency,
                      and revenue.
                      <button
                        className="know-more-btn"
                        onClick={handleDrawerCvtKnowMore}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            paddingLeft: "4px",
                            textDecoration: "underline",
                            textDecorationColor: "#454551",
                          }}
                        >
                          Know More
                        </span>
                      </button>
                    </p>
                    <button
                      className="digitise-info-btn-cardiology"
                      onClick={handleDigitiseSnapRx}
                    >
                      Digitise Rx Now
                    </button>
                  </div>
                )
              ))}

            {genRxData &&
              isValidMongoId(
                viewCaseManagerData?.smart_prescription_filename
              ) &&
              !isSmartRxFile &&
              !loading && (
                <div className="p-2 m-2">
                  <button
                    className={`digital-btn ${
                      !showDigitalGenRx
                        ? "digitise-toggle-btn"
                        : "active-digitise-toggle-btn"
                    }`}
                    onClick={() => setShowDigitalGenRx(true)}
                  >
                    Digital Rx
                  </button>
                  <button
                    className={`written-btn ${
                      showDigitalGenRx
                        ? "digitise-toggle-btn"
                        : "active-digitise-toggle-btn"
                    }`}
                    onClick={() => setShowDigitalGenRx(false)}
                  >
                    Transcript
                  </button>
                </div>
              )}
            <Drawer
              closeIcon={false}
              // placement="right"
              onClose={handleDrawerCvtKnowMore}
              open={cvtDrawer}
              className=".modalWidth-800"
              width={800}
            >
              <CvtKnowMore
                handleDrawerCvtKnowMore={handleDrawerCvtKnowMore}
                handleCollapsed={(flag) => handleCollapsed(flag)}
              />
            </Drawer>
            {loading ? (
              <div
                className="d-flex flex-column justify-content-center"
                style={{ height: "calc(100vh - 218px)" }}
              >
                <div className="align-items-center text-center">
                  <Spin />
                </div>
              </div>
            ) : genRxData &&
              isValidMongoId(
                viewCaseManagerData?.smart_prescription_filename
              ) &&
              !isSmartRxFile ? (
              <div>
                {showDigitalGenRx ? (
                  <div className="m-4">
                    {genRxData?.vitalsAndBodyComposition &&
                      Object.values(genRxData?.vitalsAndBodyComposition).some(
                        (value) => value
                      ) && (
                        <>
                          <div className="d-flex align-items-start">
                            <div className="title-digitise-section mb-1">
                              Vitals and Body compositions
                            </div>
                          </div>
                          {renderGenRxItems("vitalsAndBodyComposition")}
                        </>
                      )}

                    {genRxData?.medicalHistory &&
                      genRxData?.medicalHistory.length > 0 && (
                        <>
                          <div className="d-flex align-items-start">
                            <div className="title-digitise-section mb-1">
                              Medical History
                            </div>
                          </div>
                          {renderGenRxItems("medicalHistory")}
                        </>
                      )}

                    {genRxData?.symptoms && genRxData?.symptoms.length > 0 && (
                      <>
                        <div className="d-flex align-items-start">
                          <div className="title-digitise-section mb-1">
                            Symptoms
                          </div>
                        </div>
                        {renderGenRxItems("symptoms")}
                      </>
                    )}

                    {genRxData?.examinations &&
                      genRxData?.examinations.length > 0 && (
                        <>
                          <div className="d-flex align-items-start">
                            <div className="title-digitise-section mb-1">
                              Examinations
                            </div>
                          </div>
                          {renderGenRxItems("examinations")}
                        </>
                      )}

                    {genRxData?.diagnosis &&
                      genRxData?.diagnosis.length > 0 && (
                        <>
                          <div className="d-flex align-items-start">
                            <div className="title-digitise-section mb-1">
                              Diagnosis
                            </div>
                          </div>
                          {renderGenRxItems("diagnosis")}
                        </>
                      )}

                    {genRxData?.medications &&
                      genRxData?.medications.length > 0 && (
                        <>
                          <div className="d-flex align-items-start">
                            <div className="title-digitise-section mb-1">
                              Medication
                            </div>
                          </div>
                          {renderGenRxItems("medications")}
                        </>
                      )}

                    {genRxData?.labInvestigation &&
                      genRxData?.labInvestigation.length > 0 && (
                        <>
                          <div className="d-flex align-items-start">
                            <div className="title-digitise-section mb-1">
                              Lab Investigation
                            </div>
                          </div>
                          {renderGenRxItems("labInvestigation")}
                        </>
                      )}

                    {genRxData?.advice && genRxData?.advice.length > 0 && (
                      <>
                        <div className="d-flex align-items-start">
                          <div className="title-digitise-section mb-1">
                            Advices
                          </div>
                        </div>
                        {renderGenRxItems("advice")}
                      </>
                    )}

                    {genRxData?.vaccinations &&
                      genRxData?.vaccinations.length > 0 && (
                        <>
                          <div className="d-flex align-items-start">
                            <div className="title-digitise-section mb-1">
                              Vaccination
                            </div>
                          </div>
                          {renderGenRxItems("vaccinations")}
                        </>
                      )}
                    {genRxData?.others && genRxData.others.length > 0 && (
                      <>
                        <div className="d-flex align-items-start">
                          <div className="title-digitise-section mb-1">
                            Others
                          </div>
                        </div>
                        {renderGenRxItems("others")}
                      </>
                    )}
                    {genRxData.dynamicFields && renderGenRxCustomModules()}
                    {genRxData?.followUp && (
                      <>
                        <div className="d-flex align-items-start">
                          <div className="title-digitise-section mb-1">
                            Follow Up
                          </div>
                        </div>
                        {renderGenRxItems("followUp")}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="m-4">
                    {genRxQueries?.map((query, index) => (
                      <div key={index} className="gen-rx-transcript">
                        {query}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : isSmartRxFile && !isSnapRx ? (
              <div>
                {isRxdigitised && showDigitalRx ? (
                  <div className="m-4">
                    {rxDigitisedData?.editedData?.vitals &&
                      Object.values(rxDigitisedData?.editedData?.vitals).some(
                        (value) => value?.trim?.().length > 0
                      ) && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={vitalsIcon}
                              alt="Vitals"
                            />
                            <div className="title-digitise-section mb-1">
                              Vitals and Body compositions
                            </div>
                          </div>
                          {renderItems("vitals")}
                        </>
                      )}

                    {rxDigitisedData?.editedData?.medicalHistory &&
                      hasValidContent(
                        rxDigitisedData.editedData,
                        "medicalHistory"
                      ) && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={medicalHistoryIcon}
                              alt="MedicalHistory"
                            />
                            <div className="title-digitise-section mb-1">
                              Medical History
                            </div>
                          </div>
                          {renderItems("medicalHistory")}
                        </>
                      )}

                    {rxDigitisedData?.editedData?.symptoms &&
                      hasValidContent(
                        rxDigitisedData.editedData,
                        "symptoms"
                      ) && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={Symptomsicon}
                              alt="Symptoms"
                            />
                            <div className="title-digitise-section mb-1">
                              Symptoms
                            </div>
                          </div>
                          {renderItems("symptoms")}
                        </>
                      )}

                    {rxDigitisedData?.editedData?.examination &&
                      hasValidContent(
                        rxDigitisedData.editedData,
                        "examination"
                      ) && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={Examinationsicon}
                              alt="Examination"
                            />
                            <div className="title-digitise-section mb-1">
                              Examinations
                            </div>
                          </div>
                          {renderItems("examination")}
                        </>
                      )}

                    {rxDigitisedData?.editedData?.diagnosis &&
                      hasValidContent(
                        rxDigitisedData.editedData,
                        "diagnosis"
                      ) && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={Diagnosisicon}
                              alt="Diagnosis"
                            />
                            <div className="title-digitise-section mb-1">
                              Diagnosis
                            </div>
                          </div>
                          {renderItems("diagnosis")}
                        </>
                      )}

                    {rxDigitisedData?.editedData?.medications &&
                      hasValidContent(
                        rxDigitisedData.editedData,
                        "medications"
                      ) && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={Medicationicon}
                              alt="Medications"
                            />
                            <div className="title-digitise-section mb-1">
                              Medication
                            </div>
                          </div>
                          {renderItems("medications")}
                        </>
                      )}

                    {rxDigitisedData?.editedData?.tests &&
                      hasValidContent(rxDigitisedData.editedData, "tests") && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={Investigationicon}
                              alt="Tests"
                            />
                            <div className="title-digitise-section mb-1">
                              Lab Investigation
                            </div>
                          </div>
                          {renderItems("tests")}
                        </>
                      )}

                    {rxDigitisedData?.editedData?.advice &&
                      hasValidContent(rxDigitisedData.editedData, "advice") && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={Frameicon}
                              alt="Advice"
                            />
                            <div className="title-digitise-section mb-1">
                              Advices
                            </div>
                          </div>
                          {renderItems("advice")}
                        </>
                      )}

                    {rxDigitisedData?.editedData?.vaccinations &&
                      hasValidContent(
                        rxDigitisedData.editedData,
                        "vaccinations"
                      ) && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={vaccinationIcon}
                              alt="vaccinations"
                            />
                            <div className="title-digitise-section mb-1">
                              Vaccinations
                            </div>
                          </div>
                          {renderItems("vaccinations")}
                        </>
                      )}
                  </div>
                ) : (
                  <>
                    {smartRxFile?.length > 0 &&
                      smartRxFile?.map(({ smart_prescription_file }) => (
                        <div style={{ padding: "5px" }}>
                          {smart_prescription_file && (
                            <img
                              src={smart_prescription_file}
                              alt="Smart Rx"
                              width="100%"
                              height="660px"
                            />
                          )}
                        </div>
                      ))}
                  </>
                )}
                <div
                  className={`d-flex align-items-center mb-14 ${
                    viewCaseManagerData?.follow_up_date
                      ? "follow-up-detailsPage"
                      : ""
                  }`}
                >
                  {viewCaseManagerData?.follow_up_date && (
                    <>
                      <img className="me-3" src={followUp} alt="Symptoms" />
                      <div className="title-common">Follow-up:</div>
                      <div className="follow-up-date-text">
                        {viewCaseManagerData?.follow_up_date
                          ? moment(viewCaseManagerData.follow_up_date).format(
                              "DD/MM/YYYY"
                            )
                          : ""}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : isSnapRx && isSnapRxAccessableFromGB ? (
              <div>
                {isSnapRxdigitised && showDigitalSnapRx ? (
                  <div className="m-4">
                    {snapRxDigitisedData?.vitals &&
                      Object.values(snapRxDigitisedData?.vitals).some(
                        (value) => value?.trim?.().length > 0
                      ) && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={vitalsIcon}
                              alt="Vitals"
                            />
                            <div className="title-digitise-section mb-1">
                              Vitals and Body compositions
                            </div>
                          </div>
                          {renderItems("vitals")}
                        </>
                      )}

                    {snapRxDigitisedData?.medicalHistory &&
                      hasValidContent(
                        snapRxDigitisedData,
                        "medicalHistory"
                      ) && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={medicalHistoryIcon}
                              alt="MedicalHistory"
                            />
                            <div className="title-digitise-section mb-1">
                              Medical History
                            </div>
                          </div>
                          {renderItems("medicalHistory")}
                        </>
                      )}

                    {snapRxDigitisedData?.symptoms &&
                      hasValidContent(snapRxDigitisedData, "symptoms") && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={Symptomsicon}
                              alt="Symptoms"
                            />
                            <div className="title-digitise-section mb-1">
                              Symptoms
                            </div>
                          </div>
                          {renderItems("symptoms")}
                        </>
                      )}

                    {snapRxDigitisedData?.examination &&
                      hasValidContent(snapRxDigitisedData, "examination") && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={Examinationsicon}
                              alt="Examination"
                            />
                            <div className="title-digitise-section mb-1">
                              Examinations
                            </div>
                          </div>
                          {renderItems("examination")}
                        </>
                      )}

                    {snapRxDigitisedData?.diagnosis &&
                      hasValidContent(snapRxDigitisedData, "diagnosis") && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={Diagnosisicon}
                              alt="Diagnosis"
                            />
                            <div className="title-digitise-section mb-1">
                              Diagnosis
                            </div>
                          </div>
                          {renderItems("diagnosis")}
                        </>
                      )}

                    {snapRxDigitisedData?.medications &&
                      hasValidContent(snapRxDigitisedData, "medications") && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={Medicationicon}
                              alt="Medications"
                            />
                            <div className="title-digitise-section mb-1">
                              Medication
                            </div>
                          </div>
                          {renderItems("medications")}
                        </>
                      )}

                    {snapRxDigitisedData?.tests &&
                      hasValidContent(snapRxDigitisedData, "tests") && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={Investigationicon}
                              alt="Tests"
                            />
                            <div className="title-digitise-section mb-1">
                              Lab Investigation
                            </div>
                          </div>
                          {renderItems("tests")}
                        </>
                      )}

                    {snapRxDigitisedData?.advice &&
                      hasValidContent(snapRxDigitisedData, "advice") && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={Frameicon}
                              alt="Advice"
                            />
                            <div className="title-digitise-section mb-1">
                              Advices
                            </div>
                          </div>
                          {renderItems("advice")}
                        </>
                      )}

                    {snapRxDigitisedData?.vaccinations &&
                      hasValidContent(snapRxDigitisedData, "vaccinations") && (
                        <>
                          <div className="d-flex align-items-start">
                            <img
                              className="me-2"
                              src={vaccinationIcon}
                              alt="vaccinations"
                            />
                            <div className="title-digitise-section mb-1">
                              Vaccinations
                            </div>
                          </div>
                          {renderItems("vaccinations")}
                        </>
                      )}
                  </div>
                ) : (
                  <>
                    {!!snapRxFile?.length &&
                      snapRxFile?.map(({ fileUrl }) => (
                        <div style={{ padding: "5px" }}>
                          {fileUrl && (
                            <img
                              src={fileUrl}
                              alt="Snap Rx"
                              width="100%"
                              height="660px"
                            />
                          )}
                        </div>
                      ))}
                  </>
                )}
              </div>
            ) : (
              <Card.Body className="p-0 cardbody-data">
                <div>
                  <div className="p-3 pb-0">
                    {viewCaseManagerData.symptoms.length > 0 && (
                      <div className="d-flex align-items-start mb-4">
                        <img
                          className="me-2"
                          src={Symptomsicon}
                          alt="Symptoms"
                        />
                        <div>
                          <div className="title">Symptoms</div>
                          {viewCaseManagerData.symptoms.map((item, i) => {
                            return (
                              <span key={i}>
                                <span>{item.symptom_name}</span> :{" "}
                                <label>{`${
                                  item.since &&
                                  `since ${item.since}${item.severity && ","}`
                                } ${
                                  item.severity &&
                                  `severity ${item.severity}${
                                    item.note && ","
                                  } `
                                } ${item.note && `${item.note}`}`}</label>
                                {viewCaseManagerData.symptoms.length - 1 != i &&
                                  " | "}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {viewCaseManagerData.examination.length > 0 && (
                      <div className="d-flex align-items-start mb-4">
                        <img
                          className="me-2"
                          src={Examinationsicon}
                          alt="Examinations"
                        />
                        <div>
                          <div className="title">Examinations</div>
                          {viewCaseManagerData.examination.map((item, i) => {
                            return (
                              <span key={i}>
                                <span>{item.examination_name}</span> :{" "}
                                <label>{item.note}</label>
                                {viewCaseManagerData.examination.length - 1 !=
                                  i && " | "}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {viewCaseManagerData.surgeries.length > 0 && (
                      <div className="d-flex align-items-start mb-4">
                        <img
                          className="me-2"
                          src={Examinationsicon}
                          alt="surgeries"
                        />
                        <div>
                          <div className="title">Surgeries/Procedures</div>
                          {viewCaseManagerData.surgeries.map((item, i) => {
                            return (
                              <span key={i}>
                                <span>{item.name}</span> :{" "}
                                <label>{item.notes}</label>
                                {viewCaseManagerData.surgeries.length - 1 !=
                                  i && " | "}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {viewCaseManagerData.diagnosis.length > 0 && (
                      <div className="d-flex align-items-start mb-4">
                        <img
                          className="me-2"
                          src={Diagnosisicon}
                          alt="Diagnosis"
                        />
                        <div>
                          <div className="title">Diagnosis</div>
                          {viewCaseManagerData.diagnosis.map((item, i) => {
                            return (
                              <span key={i}>
                                <span>{item.tds_name}</span> :{" "}
                                <label>{`${
                                  item.since &&
                                  `since ${item.since}${item.status && ","}`
                                } ${
                                  item.status &&
                                  `status ${item.status}${item.note && ","} `
                                } ${item.note && `${item.note}`}`}</label>
                                {viewCaseManagerData.diagnosis.length - 1 !=
                                  i && " | "}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {medicationData.length > 0 && (
                      <div className="d-flex align-items-center">
                        <img
                          className="me-2"
                          src={Medicationicon}
                          alt="Medication"
                        />
                        <div>
                          <div className="title">Medication (Rx)</div>
                        </div>
                      </div>
                    )}
                  </div>
                  {medicationData.length > 0 && (
                    <div>
                      <div className="border-top border-bottom mt-2">
                        <Table
                          className="table-border patient-medication"
                          columns={columns}
                          dataSource={medicationData}
                          onChange={handleChange}
                          pagination={false}
                        />
                      </div>
                    </div>
                  )}
                  <div className="p-3">
                    {viewCaseManagerData.advice.length > 0 && (
                      <div className="d-flex align-items-start mb-4">
                        <img className="me-2" src={Frameicon} alt="Advice" />
                        <div>
                          <div className="title">Advice</div>

                          {viewCaseManagerData.advice.map((item, i) => {
                            return (
                              <label key={i}>{`${i != 0 ? ", " : ""}${
                                item.advice_name
                              }`}</label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {viewCaseManagerData.investigation.length > 0 && (
                      <div className="d-flex align-items-start mb-4">
                        <img
                          className="me-2"
                          src={Investigationicon}
                          alt="Advice"
                        />
                        <div>
                          <div className="title">Lab Investigation</div>
                          {viewCaseManagerData.investigation.map((item, i) => {
                            return (
                              <span key={i}>
                                <span key={i}>{item.investigation_name}</span> :{" "}
                                <label>{item.note}</label>
                                {viewCaseManagerData.investigation.length - 1 !=
                                  i && " | "}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {viewCaseManagerData.visit_advice && (
                      <div className="d-flex align-items-start mb-4">
                        <img
                          className="me-2"
                          src={notesicon}
                          alt="Doctor Note"
                        />
                        <div>
                          <div className="title">Doctor Note</div>
                          <label>{viewCaseManagerData.visit_advice}</label>
                        </div>
                      </div>
                    )}
                    {viewCaseManagerData.treatment && (
                      <div className="d-flex align-items-start mb-4">
                        <img
                          className="me-2"
                          src={notesicon}
                          alt="Doctor Note1"
                        />
                        <div>
                          <div className="title">Treatment</div>
                          <label className="whitespace-pre-wrap">
                            {viewCaseManagerData.treatment}
                          </label>
                        </div>
                      </div>
                    )}
                    {customModulesRxData.length > 0 &&
                      customModulesRxData?.map(
                        (item) =>
                          item.module_name && (
                            <div className="d-flex align-items-start mb-4">
                              <img
                                className="me-2"
                                src={customModuleIcon}
                                alt={item.module_name}
                              />
                              <div>
                                <div className="title">{item.module_name}</div>
                                {item.content.map((c, i) => {
                                  return (
                                    <span key={i}>
                                      {c.title && (
                                        <>
                                          <span>{c.title}</span>
                                          {c.notes?.trim() ? <br /> : ""}
                                        </>
                                      )}
                                      {c.notes?.trim() && (
                                        <div>
                                          {c.notes
                                            ?.trim()
                                            ?.replace(/\n+/g, "\n")
                                            .split("\n")
                                            .map((line, index) => (
                                              <React.Fragment key={index}>
                                                {line}
                                                {index !==
                                                  c.notes
                                                    ?.trim()
                                                    ?.replace(/\n+/g, "\n")
                                                    .split("\n").length -
                                                    1 && <br />}
                                              </React.Fragment>
                                            ))}
                                        </div>
                                      )}
                                      {item.content.length - 1 !== i && <br />}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )
                      )}
                  </div>
                </div>
              </Card.Body>
            )}
          </>
        ) : (
          <div
            className="d-flex flex-column justify-content-center"
            style={{ height: "calc(100vh - 118px)" }}
          >
            {loading ? (
              <div className="align-items-center text-center">
                <Spin />
              </div>
            ) : (
              <div className="align-items-center text-center">
                <img
                  src={calenderBlank}
                  width={57}
                  height={62}
                  alt="No vital & body composition saved for the patient!"
                />
                <p className="mt-4 fontroboto">
                  No any visit found for this patient yet
                </p>
                <Button
                  className="btn btn-primary3 btn-text-white px-5 btn-41"
                  onClick={() => {
                    window.Moengage.track_event("start_new_visit_click", {
                      doctor_id: profile?.doctor_unique_id,
                      patient_id:
                        patient_data !== undefined
                          ? patient_data.patient_unique_id
                          : 0,
                    });
                    navigate("/prescription", {
                      state: {
                        patient_data: patient_data,
                        send_path: "patient_details",
                      },
                    });
                  }}
                >
                  {"Start New Visit"}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
export default React.memo(Cardiology);
