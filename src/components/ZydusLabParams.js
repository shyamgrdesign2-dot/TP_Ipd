import React, { useState, useEffect } from "react";
import { Button, Tooltip } from "antd";
import axios from "axios";
import { env } from "../EnvironmentConfig";
import { PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN, PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import CommonModal from "../common/CommonModal";
import alertIcon from "../assets/images/alertIcon.svg";
import moment from "moment";
import { DatePicker } from "antd";
import { EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";

const ZydusLabParams = ({
    handleZydusTestReportDrawer,
    mrno,
    patientId,
    mrcNo,
    onSave,
    isBackModalOpen,
    showHideBackModal,
    patientGender,
    labReportID,
    setLabReportID,
    zydusSelectedLabParams,
    setZydusSelectedLabParams
}) => {
    const [token, setToken] = useState(null);
    const [labResults, setLabResults] = useState([]);
    const [expandedSections, setExpandedSections] = useState({});
    const [selectedItems, setSelectedItems] = useState({});
    const [organizedData, setOrganizedData] = useState({
        dates: [],
        tests: {}
    });

    useEffect(() => {
        const storedToken = localStorage.getItem(PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN);
        if (storedToken) {
            try {
                const authToken = JSON.parse(storedToken);
                setToken(authToken);
                fetchLabResults(authToken);
            } catch (error) {
                console.error("Error parsing token:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (labResults.length > 0) {
            organizeData();
        }
    }, [labResults]);

    const organizeData = () => {
        // Get unique dates and sort them in descending order (newest first)
        const dates = [...new Set(labResults.map(result => result.certifiedDate))]
            .sort((a, b) => moment(b, "DD-MM-YYYY").valueOf() - moment(a, "DD-MM-YYYY").valueOf())
            .map(date => moment(date, "DD-MM-YYYY").format("DD MMM, YYYY"));

        // Organize tests by name
        const tests = {};
        labResults.forEach(result => {
            const formattedDate = moment(result.certifiedDate, "DD-MM-YYYY").format("DD MMM, YYYY");
            if (!tests[result.serviceName]) {
                tests[result.serviceName] = {
                    serviceCode: result.serviceCode,
                    parameters: {},
                    dates: {}
                };
            }

            // Store the date result with all required fields
            tests[result.serviceName].dates[formattedDate] = {
                resultvalue: result.resultvalue,
                referenceRange: result.referenceRange,
                sampleId: result.sampleId,
                labResultId: result.labResultId,
                certifiedDate: result.certifiedDate
            };

            // Store parameters if they exist
            if (result.labResultParameters && result.labResultParameters.length > 0) {
                result.labResultParameters.forEach(param => {
                    if (!tests[result.serviceName].parameters[param.parameterName]) {
                        tests[result.serviceName].parameters[param.parameterName] = {
                            referenceRange: param.referenceRange
                        };
                    }
                    if (!tests[result.serviceName].parameters[param.parameterName].dates) {
                        tests[result.serviceName].parameters[param.parameterName].dates = {};
                    }
                    tests[result.serviceName].parameters[param.parameterName].dates[formattedDate] = {
                        resultValue: param.resultValue,
                        labResultParameterId: param.labResultParameterId
                    };
                });
            }
        });

        setOrganizedData({ dates, tests });
    };

    const fetchLabResults = async (authToken) => {
        try {
                const response = await axios.get(`${env.zydus_ict_lab_result_api_url}/ictApiProxy/emr/lab/result/list`, {
                params: {
                    mrno: mrno,
                    noOfDays: 6000
                },
                headers: {
                    'authorization': `Bearer ${authToken}`
                }
            });
            setLabResults(response.data.data);
        } catch (error) {
            console.error('Error fetching lab results:', error);
        }
    };

    const toggleSection = (serviceName) => {
        setExpandedSections(prev => ({
            ...prev,
            [serviceName]: !prev[serviceName]
        }));
    };

    const handleDeleteDataModal = () => {
        handleZydusTestReportDrawer();
        showHideBackModal();
    };

    const handleServiceCheckboxChange = (serviceName, checked) => {
        setSelectedItems(prev => {
            const newSelected = { ...prev };
            const testData = organizedData.tests[serviceName];

            if (!testData) {
                return newSelected;
            }

            if (checked) {
                // If service has parameters, select all parameters
                if (testData.parameters && Object.keys(testData.parameters).length > 0) {
                    Object.keys(testData.parameters).forEach(paramName => {
                        const paramKey = `${serviceName}_${paramName}`;
                        const paramData = testData.parameters[paramName];
                        
                        // Get ALL available dates for this parameter (consistent with individual parameter selection)
                        const allDates = Object.keys(paramData.dates);
                        const parameterData = [];
                        
                        allDates.forEach(date => {
                            const serviceDateData = testData.dates[date];
                            const paramDateData = paramData.dates[date];
                            
                            if (serviceDateData && paramDateData) {
                                parameterData.push({
                                    date: moment(date, "DD MMM, YYYY").format("DD-MM-YYYY"),
                                    sampleId: serviceDateData.sampleId || "",
                                    certifiedDate: serviceDateData.certifiedDate,
                                    labResultId: serviceDateData.labResultId || "",
                                    resultValue: paramDateData.resultValue || "-",
                                    referenceRange: paramData.referenceRange || "-",
                                    labResultParameterId: paramDateData.labResultParameterId || "",
                                    parameterName: paramName,
                                    status: true
                                });
                            }
                        });
                        
                        if (parameterData.length > 0) {
                            newSelected[paramKey] = {
                                serviceData: {
                                    referenceRange: paramData.referenceRange || "-",
                                    serviceCode: testData.serviceCode,
                                    serviceName: serviceName,
                                    parameterName: paramName
                                },
                                parameterData: parameterData
                            };
                        }
                    });
                } else {
                    // If service has no parameters, select the service itself with ALL dates
                    const allDates = Object.keys(testData.dates);
                    const serviceParameterData = [];
                    
                    allDates.forEach(date => {
                        const dateData = testData.dates[date];
                        if (dateData) {
                            serviceParameterData.push({
                                date: moment(date, "DD MMM, YYYY").format("DD-MM-YYYY"),
                                sampleId: dateData.sampleId || "",
                                certifiedDate: dateData.certifiedDate,
                                labResultId: dateData.labResultId || "",
                                resultValue: dateData.resultvalue || "-",
                                status: true
                            });
                        }
                    });
                    
                    if (serviceParameterData.length > 0) {
                        newSelected[serviceName] = {
                            serviceData: {
                                referenceRange: testData.dates[allDates[0]]?.referenceRange || "-",
                                serviceCode: testData.serviceCode,
                                serviceName: serviceName
                            },
                            parameterData: serviceParameterData
                        };
                    }
                }
            } else {
                // Remove the service data when unchecked
                delete newSelected[serviceName];
                
                // Also remove all parameters associated with this service
                Object.keys(newSelected).forEach(key => {
                    if (key.startsWith(`${serviceName}_`)) {
                        delete newSelected[key];
                    }
                });
            }

            return newSelected;
        });

        // Auto-expand the section when service is selected
        if (checked) {
            setExpandedSections(prev => ({
                ...prev,
                [serviceName]: true
            }));
        }
    };

    const handleParameterCheckboxChange = (serviceName, paramName, checked) => {
        setSelectedItems(prev => {
            const newSelected = { ...prev };
            const key = `${serviceName}_${paramName}`;
            const testData = organizedData.tests[serviceName];

            if (!testData) {
                return newSelected;
            }

            if (checked) {
                const paramData = testData.parameters[paramName];
                if (paramData && paramData.dates) {
                    // Get all dates for this parameter
                    const allDates = Object.keys(paramData.dates);
                    const parameterData = [];

                    // Process each date's data
                    allDates.forEach(date => {
                        const dateData = testData.dates[date];
                        const paramDateData = paramData.dates[date];

                        if (dateData && paramDateData) {
                            parameterData.push({
                                date: moment(date, "DD MMM, YYYY").format("DD-MM-YYYY"),
                                sampleId: dateData.sampleId || "",
                                certifiedDate: dateData.certifiedDate,
                                labResultId: dateData.labResultId || "",
                                resultValue: paramDateData.resultValue || "-",
                                referenceRange: paramData.referenceRange || "-",
                                labResultParameterId: paramDateData.labResultParameterId || "",
                                parameterName: paramName,
                                status: true
                            });
                        }
                    });

                    if (parameterData.length > 0) {
                        newSelected[key] = {
                            serviceData: {
                                referenceRange: paramData.referenceRange || "-",
                                serviceCode: testData.serviceCode,
                                serviceName: serviceName
                            },
                            parameterData: parameterData
                        };
                    }
                }
            } else {
                // Remove the parameter data when unchecked
                delete newSelected[key];
            }

            return newSelected;
        });

        // Auto-expand the section when any parameter is selected
        if (checked) {
            setExpandedSections(prev => ({
                ...prev,
                [serviceName]: true
            }));
        }
    };

    const isServiceChecked = (serviceName) => {
        // CRITICAL FIX: Guard against race conditions
        if (!organizedData || !organizedData.tests || !organizedData.tests[serviceName]) {
            console.warn(`⚠️ Service data not ready for: ${serviceName}`);
            return false;
        }

        const testData = organizedData.tests[serviceName];

        // If service has parameters, check selection state
        if (testData.parameters && Object.keys(testData.parameters).length > 0) {
            const parameterKeys = Object.keys(testData.parameters).map(paramName => `${serviceName}_${paramName}`);
            
            // CRITICAL FIX: Properly validate selected items
            const selectedParameterKeys = parameterKeys.filter(key => {
                const item = selectedItems[key];
                return item && item.parameterData && item.parameterData.length > 0;
            });
            

            
            if (selectedParameterKeys.length === 0) {
                return false;
            } else if (selectedParameterKeys.length === parameterKeys.length) {
                return true;
            } else {
                return 'indeterminate';
            }
        } else {
            // If service has no parameters, check if the service itself is selected
            const item = selectedItems[serviceName];
            const isSelected = item && item.parameterData && item.parameterData.length > 0;
            
            return !!isSelected;
        }
    };

    const renderServiceCheckbox = (serviceName, additionalProps = {}) => {
        try {
            const checkState = isServiceChecked(serviceName);
            const isIndeterminate = checkState === 'indeterminate';
            const isChecked = checkState === true;
            
            return (
                <input
                    type="checkbox"
                    checked={isChecked}
                    ref={(el) => {
                        if (el) {
                            // CRITICAL FIX: Safely set indeterminate state
                            try {
                                el.indeterminate = isIndeterminate;
                            } catch (error) {
                                console.warn('Failed to set indeterminate state:', error);
                            }
                        }
                    }}
                    onChange={(e) => {
                        try {
                            e.stopPropagation();
                            handleServiceCheckboxChange(serviceName, e.target.checked);
                        } catch (error) {
                            console.error('Error in service checkbox change:', error);
                        }
                    }}
                    style={{
                        width: "16px",
                        height: "16px",
                        margin: "0",
                        cursor: "pointer",
                        ...additionalProps.style
                    }}
                    {...additionalProps}
                />
            );
        } catch (error) {
            console.error('Error rendering service checkbox:', error);
            // Fallback: render a basic checkbox
            return (
                <input
                    type="checkbox"
                    checked={false}
                    disabled
                    style={{
                        width: "16px",
                        height: "16px",
                        margin: "0",
                        cursor: "not-allowed"
                    }}
                />
            );
        }
    };

    const renderValue = (value, referenceRange) => {
        if (!value) return "-";
        
        // If value is an object with resultValue
        if (typeof value === 'object' && value.resultValue !== undefined) {
            return (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{fontSize:"14px"}}>{value.resultValue}</span>
                    {referenceRange && referenceRange !== "-" && (
                        <span style={{ color: "#666", fontSize: "12px" }}>
                            ({referenceRange})
                        </span>
                    )}
                </div>
            );
        }
        
        // If value is a string or number
        if (typeof value === 'string' || typeof value === 'number') {
            return (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{fontSize:"14px"}}>{value}</span>
                    {referenceRange && referenceRange !== "-" && (
                        <span style={{ color: "#666", fontSize: "12px" }}>
                            ({referenceRange})
                        </span>
                    )}
                </div>
            );
        }
        
        return "-";
    };

    const preparePayload = () => {
        // Create a map to group inputs by date
        const dateMap = new Map();

        // Process each selected item
        Object.entries(selectedItems).forEach(([key, data]) => {
            // Process each parameter data entry
            data.parameterData.forEach(paramData => {
                const date = paramData.date;

                if (!dateMap.has(date)) {
                    dateMap.set(date, []);
                }

                // Check if this is a service with parameters
                if (key.includes('_')) {
                    // This is a parameter of a service
                    const [serviceName, paramName] = key.split('_');

                    // Check if we already have this service in the inputs for this date
                    let existingServiceIndex = dateMap.get(date).findIndex(
                        input => input.serviceName === serviceName
                    );

                    if (existingServiceIndex === -1) {
                        // Add new service with parameter
                        // For services with parameters, we need to get the main service's resultvalue from the raw data
                        // Find the corresponding service data for this date from organizedData
                        const serviceDateData = organizedData.tests[serviceName]?.dates[moment(date, "DD-MM-YYYY").format("DD MMM, YYYY")];
                        
                        dateMap.get(date).push({
                            referenceRange: serviceDateData?.referenceRange || data.serviceData.referenceRange || "-",
                            serviceCode: data.serviceData.serviceCode,
                            sampleId: paramData.sampleId,
                            certifiedDate: paramData.certifiedDate,
                            serviceName: serviceName,
                            resultvalue: serviceDateData?.resultvalue || "-", // ✅ FIX: Use date-specific service resultvalue
                            labResultParameters: [{
                                resultValue: paramData.resultValue,
                                referenceRange: paramData.referenceRange,
                                labResultParameterId: paramData.labResultParameterId,
                                parameterName: paramName,
                                status: true
                            }],
                            labResultId: paramData.labResultId
                        });
                    } else {
                        // Add parameter to existing service
                        const existingService = dateMap.get(date)[existingServiceIndex];
                        
                        // Check if this parameter already exists to avoid duplicates
                        const paramExists = existingService.labResultParameters.some(
                            param => param.parameterName === paramName
                        );
                        
                        if (!paramExists) {
                            existingService.labResultParameters.push({
                                resultValue: paramData.resultValue,
                                referenceRange: paramData.referenceRange,
                                labResultParameterId: paramData.labResultParameterId,
                                parameterName: paramName,
                                status: true
                            });
                        }
                    }
                } else {
                    // This is a service without parameters
                    dateMap.get(date).push({
                        referenceRange: paramData.referenceRange || data.serviceData.referenceRange,
                        serviceCode: data.serviceData.serviceCode,
                        sampleId: paramData.sampleId,
                        certifiedDate: paramData.certifiedDate,
                        serviceName: key,
                        resultvalue: paramData.resultValue, // ✅ FIX: Use date-specific resultValue from paramData
                        labResultId: paramData.labResultId,
                        status: true
                    });
                }
            });
        });

        // Convert map to array and sort by date
        const payload = {
            patient_unique_id: patientId,
            source: "zydus-ict",
            mrc_no: mrcNo,
            data: Array.from(dateMap.entries())
                .map(([date, inputs]) => ({
                    date,
                    inputs
                }))
                .sort((a, b) => moment(b.date, "DD-MM-YYYY").valueOf() - moment(a.date, "DD-MM-YYYY").valueOf())
        };

        return payload;
    };

    const handleSave = async () => {
        try {
            // 1. Prepare payload
            const payload = preparePayload();
            if (!payload || !payload.data || !Array.isArray(payload.data)) {
                console.error("❌ Invalid or empty payload");
                return;
            }

            // 2. Validate payload structure
            for (const item of payload.data) {
                // Check required fields
                if (!item.date || !item.inputs || !Array.isArray(item.inputs)) {
                    console.error("❌ Missing required fields in payload", item);
                    return;
                }

                // Validate each input
                for (const input of item.inputs) {
                    // Check required service fields
                    if (!input.serviceName || !input.serviceCode || !input.certifiedDate) {
                        console.error("❌ Invalid service data - missing required fields:", {
                            serviceName: input.serviceName,
                            serviceCode: input.serviceCode,
                            certifiedDate: input.certifiedDate
                        });
                        return;
                    }

                    // If service has parameters, validate them
                    if (input.labResultParameters && Array.isArray(input.labResultParameters)) {
                        for (const param of input.labResultParameters) {
                            if (!param.parameterName || param.resultValue === undefined || param.resultValue === null) {
                                console.error("❌ Invalid parameter data - missing required fields:", {
                                    parameterName: param.parameterName,
                                    resultValue: param.resultValue
                                });
                                return;
                            }
                        }
                    }
                }
            }

            // 3. Get and validate token
            const storedToken = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
            if (!storedToken) {
                console.error("❌ No auth token found");
                return;
            }

            let token;
            try {
                token = JSON.parse(storedToken);
            } catch (parseError) {
                console.error("❌ Error parsing token:", parseError);
                return;
            }

            // 4. Prepare API config
            const apiConfig = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            // 5. Make API call based on flow
            let response;
            if (labReportID) {
                response = await axios.post(
                    `${env.lab_params_api_url}/api/v1/lab-reports/updatebyID`,
                    {
                        ...payload,
                        labReportID: labReportID
                    },
                    apiConfig
                );
            } else {
                response = await axios.post(
                    `${env.lab_params_api_url}/api/v1/lab-reports/`,
                    payload,
                    apiConfig
                );
            }

            // 6. Handle response
            if (!response || !response.data) {
                throw new Error("Invalid response from server");
            }

            // 7. Update state and close drawer
            if (response.data?.labReportID) {
                setLabReportID(response.data.labReportID);
            }
            
            // Update the parent's state with the new data
            setZydusSelectedLabParams(payload.data);
            
            // Call onSave with the new labReportID
            onSave(response.data?.labReportID);
            
            // Close the drawer
            handleZydusTestReportDrawer();

            // 8. Clear selection state after successful save
            setSelectedItems({});

        } catch (error) {
            console.error("❌ Save failed:", error.response?.data || error.message);
        }
    };

    const fetchPreviousSelections = async (labReportID) => {
        try {
            const response = await axios.post(
                `${env.lab_params_api_url}/api/v1/lab-reports/getByID`,
                {
                    labReportID: labReportID,
                    source: "zydus-ict",
                    patient_unique_id: patientId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN))}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data && response.data.data) {
                setZydusSelectedLabParams(response.data.data);
            }
            return response.data;
        } catch (error) {
            console.error("❌ Error fetching previous selections:", error.response?.data || error.message);
            return null;
        }
    };

    const transformPreviousSelections = (apiData) => {
        const newSelectedItems = {};
        
        try {
            apiData.data.forEach(dateData => {
                dateData.inputs.forEach(input => {
                    if (input.labResultParameters && input.labResultParameters.length > 0) {
                        // Handle services with parameters (e.g., CBC - Hemoglobin)
                        input.labResultParameters.forEach(param => {
                            const key = `${input.serviceName}_${param.parameterName}`;
                            if (!newSelectedItems[key]) {
                                newSelectedItems[key] = {
                                    serviceData: {
                                        referenceRange: input.referenceRange,
                                        serviceCode: input.serviceCode,
                                        serviceName: input.serviceName,
                                        resultvalue: input.resultvalue
                                    },
                                    parameterData: []
                                };
                            }
                            
                            newSelectedItems[key].parameterData.push({
                                date: dateData.date,
                                sampleId: input.sampleId,
                                certifiedDate: input.certifiedDate,
                                labResultId: input.labResultId,
                                resultValue: param.resultValue,
                                referenceRange: param.referenceRange,
                                labResultParameterId: param.labResultParameterId,
                                parameterName: param.parameterName,
                                status: true
                            });
                        });
                    } else {
                        // Handle services without parameters (e.g., Serum)
                        if (!newSelectedItems[input.serviceName]) {
                            newSelectedItems[input.serviceName] = {
                                serviceData: {
                                    referenceRange: input.referenceRange,
                                    serviceCode: input.serviceCode,
                                    serviceName: input.serviceName,
                                    resultvalue: input.resultvalue
                                },
                                parameterData: []
                            };
                        }
                        
                        newSelectedItems[input.serviceName].parameterData.push({
                            date: dateData.date,
                            sampleId: input.sampleId,
                            certifiedDate: input.certifiedDate,
                            labResultId: input.labResultId,
                            resultValue: input.resultvalue,
                            status: true
                        });
                    }
                });
            });
            
            return newSelectedItems;
        } catch (error) {
            console.error("❌ Error transforming data:", error);
            return {};
        }
    };

    // CRITICAL FIX: Load previous selections only after organized data is ready
    useEffect(() => {
        const loadPreviousSelections = async () => {
            // Wait for organized data to be ready
            if (labReportID && organizedData.tests && Object.keys(organizedData.tests).length > 0) {
                const previousData = await fetchPreviousSelections(labReportID);
                if (previousData) {
                    const transformedSelections = transformPreviousSelections(previousData);
                    setSelectedItems(transformedSelections);

                    // Automatically expand sections that have selected parameters
                    const expandedSectionsToSet = {};
                    Object.keys(transformedSelections).forEach(key => {
                        if (key.includes('_')) {
                            // This is a parameter selection, get the service name
                            const serviceName = key.split('_')[0];
                            expandedSectionsToSet[serviceName] = true;
                        } else {
                            // This is a service selection
                            expandedSectionsToSet[key] = true;
                        }
                    });
                    setExpandedSections(expandedSectionsToSet);
                }
            }
        };

        loadPreviousSelections();
    }, [labReportID, patientId]); // CRITICAL: Fixed infinite loop by removing organizedData dependency
    
    // Separate effect to handle auto-selection when data becomes available
    useEffect(() => {
        const handleAutoSelection = async () => {
            if (labReportID && organizedData.tests && Object.keys(organizedData.tests).length > 0 && Object.keys(selectedItems).length === 0) {
                const previousData = await fetchPreviousSelections(labReportID);
                if (previousData) {
                    const transformedSelections = transformPreviousSelections(previousData);
                    setSelectedItems(transformedSelections);

                    // Automatically expand sections that have selected parameters
                    const expandedSectionsToSet = {};
                    Object.keys(transformedSelections).forEach(key => {
                        if (key.includes('_')) {
                            const serviceName = key.split('_')[0];
                            expandedSectionsToSet[serviceName] = true;
                        } else {
                            expandedSectionsToSet[key] = true;
                        }
                    });
                    setExpandedSections(expandedSectionsToSet);
                }
            }
        };

        handleAutoSelection();
    }, [organizedData.dates.length]); // Only trigger when data length changes (stable)
    return (
        <div style={{ backgroundColor: "#fff" }}>
            <div className='modalCard-header h-60 align-items-center justify-content-between d-flex' style={{ position: "sticky", top: "0", zIndex: "999" }}>
                <div className='align-items-center d-flex'>
                    <Button
                        type="text"
                        className='btn btn-delete-prescription px-3 focus-none h-100'
                        onClick={showHideBackModal}
                    >
                        <i className='icon-Cross fs-3'></i>
                    </Button>
                    <CommonModal
                        isModalOpen={isBackModalOpen}
                        onCancel={showHideBackModal}
                        modalWidth={500}
                        title={"You may lose your data"}
                        modalBody={
                            <>
                                <div className="alert-warning rounded-10px p-2 patient-details">
                                    <div className="d-flex align-items-center">
                                        <img className="me-3" src={alertIcon} alt="Warning" />
                                        <span>
                                            Are you sure you want to leave? <br />
                                            You will permanently lose your data.
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="d-flex align-items-center mt-2 justify-content-end">
                                        <div
                                            onClick={handleDeleteDataModal}
                                            className="me-4 text-decoration-underline btn p-0 text-main"
                                        >
                                            Yes Leave
                                        </div>
                                        <Button
                                            onClick={showHideBackModal}
                                            className="lh-lg btn btn-primary3 btn-41 px-4"
                                        >
                                            <span>No, Stay</span>
                                        </Button>
                                    </div>
                                </div>
                            </>
                        }
                    />
                    <div className="modal-title">Zydus Test Reports</div>
                </div>
                <Button className='btn btn-primary3 btn-41 px-4 me-20' onClick={handleSave}>
                    <i className="icon-Save me-2"></i>
                    Save
                </Button>
            </div>

            <div style={{ overflowX: "auto", margin: "8px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ backgroundColor: "#F1F1F5" }}>
                        <tr style={{ position: "sticky", left: 0 }}>
                            <th style={{
                                position: "sticky",
                                left: 0,
                                background: "#F1F1F5",
                                width: "23rem",
                                padding: "10px",
                                borderTopLeftRadius: "10px",
                                borderBottomLeftRadius: "10px",
                                fontWeight: "600",
                                zIndex: 3
                            }}>
                                <span>Lab Service/Parameter</span>
                            </th>
                            {organizedData?.dates?.map((date, index) => (
                                <th key={date} style={{ 
                                    padding: "10px",
                                    minWidth: "120px",
                                    borderTopRightRadius: index === organizedData.dates.length - 1 ? "10px" : "0",
                                    borderBottomRightRadius: index === organizedData.dates.length - 1 ? "10px" : "0",
                                    fontWeight: "600",
                                    fontSize: "14px"
                                }}>
                                    <div className="date-values" style={{ textWrap: "nowrap" }}>
                                        <span>{date}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={organizedData.dates.length + 1} style={{ height: "15px", background: "#fff" }}></td>
                        </tr>
                        {/* Service rows */}
                        {Object.entries(organizedData.tests).map(([serviceName, testData], index) => (
                            <React.Fragment key={serviceName}>
                                {/* Service Row */}
                                <tr
                                    style={{
                                        cursor: "pointer",
                                        width: "100%",
                                        backgroundColor: "#FAFAFB",
                                    }}
                                    onClick={() => toggleSection(serviceName)}
                                >
                                    <td
                                        style={{
                                            position: "sticky",
                                            left: 0,
                                            zIndex: 2,
                                            backgroundColor: "#FAFAFB",
                                            padding: "10px",
                                            display: "flex",
                                            alignItems: "center",
                                            width: "23rem",
                                            borderTopLeftRadius: "10px",
                                            borderBottomLeftRadius: "10px",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 10px" }}>
                                            {renderServiceCheckbox(serviceName)}
                                            <span style={{ fontSize: "14px", fontWeight: "500" }}>{serviceName}</span>
                                        </div>
                                        {expandedSections[serviceName] ? (
                                            <button
                                                className="btn p-0 ms-2 iconrotate180"
                                                style={{ position: "absolute", left: "816px" }}
                                            >
                                                <i className="icon-right fs-5" />
                                            </button>
                                        ) : (
                                            <button
                                                className="btn p-0 ms-2 iconrotate270"
                                                style={{ position: "absolute", left: "816px" }}
                                            >
                                                <i className="icon-right fs-5" />
                                            </button>
                                        )}
                                    </td>
                                    {organizedData?.dates?.map((date, index) => {
                                        const isLastCell = index === organizedData.dates.length - 1;
                                        return (
                                            <td
                                                key={date}
                                                style={{
                                                    width: "160px",
                                                    padding: "10px",
                                                    textAlign: "right",
                                                    borderTopRightRadius: isLastCell ? "10px" : "0",
                                                    borderBottomRightRadius: isLastCell ? "10px" : "0",
                                                }}
                                            ></td>
                                        );
                                    })}
                                </tr>

                                {/* Parameters or Direct Result */}
                                {expandedSections[serviceName] && (
                                    <>
                                        {Object.keys(testData.parameters).length > 0 ? (
                                            // Case 1: Has parameters - show all parameters
                                            Object.entries(testData.parameters).map(([paramName, paramData]) => (
                                                <tr key={`${serviceName}-${paramName}`} style={{ background: "#fff" }}>
                                                    <td style={{
                                                        position: "sticky",
                                                        left: 0,
                                                        background: "#fff",
                                                        padding: "10px",
                                                        width: "23rem",
                                                    }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 10px" }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={!!selectedItems[`${serviceName}_${paramName}`]}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    handleParameterCheckboxChange(serviceName, paramName, e.target.checked);
                                                                }}
                                                                style={{
                                                                    width: "16px",
                                                                    height: "16px",
                                                                    margin: "0",
                                                                    cursor: "pointer"
                                                                }}
                                                            />
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <span style={{ fontSize: "14px" }}>{paramName}</span>
                                                                {paramData.referenceRange && (
                                                                    <Tooltip
                                                                        placement="bottom"
                                                                        title={
                                                                            <div className="ref-range-tooltip">
                                                                                <div>
                                                                                    <strong>Reference Range:</strong>
                                                                                    {(() => {
                                                                                        const refRange = paramData.referenceRange;
                                                                                        // Check if refRange is a string (direct value)
                                                                                        if (typeof refRange === 'string' && refRange !== '-') {
                                                                                            return <div>{refRange}</div>;
                                                                                        }
                                                                                        // Check if refRange is an object with ranges
                                                                                        if (refRange?.ranges?.length > 0) {
                                                                                            const maleRange = refRange.ranges.find(
                                                                                                (range) => range.gender?.toLowerCase() === "male"
                                                                                            );
                                                                                            const femaleRange = refRange.ranges.find(
                                                                                                (range) => range.gender?.toLowerCase() === "female"
                                                                                            );
                                                                                            const allRange = refRange.ranges.find(
                                                                                                (range) => range.gender?.toLowerCase() === "all"
                                                                                            );

                                                                                            if (maleRange && femaleRange) {
                                                                                                return (
                                                                                                    <div>
                                                                                                        Male: {`${maleRange.min} - ${maleRange.max} ${maleRange.unit}`} <br />
                                                                                                        Female: {`${femaleRange.min} - ${femaleRange.max} ${femaleRange.unit}`}
                                                                                                    </div>
                                                                                                );
                                                                                            } else if (maleRange) {
                                                                                                return (
                                                                                                    <div>
                                                                                                        Male: {`${maleRange.min} - ${maleRange.max} ${maleRange.unit}`}
                                                                                                    </div>
                                                                                                );
                                                                                            } else if (femaleRange) {
                                                                                                return (
                                                                                                    <div>
                                                                                                        Female: {`${femaleRange.min} - ${femaleRange.max} ${femaleRange.unit}`}
                                                                                                    </div>
                                                                                                );
                                                                                            } else if (allRange) {
                                                                                                return (
                                                                                                    <div>
                                                                                                        All: {`${allRange.min} - ${allRange.max} ${allRange.unit}`}
                                                                                                    </div>
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                        // If refRange is a simple string value
                                                                                        if (refRange && refRange !== '-') {
                                                                                            return <div>{refRange}</div>;
                                                                                        }
                                                                                        return <div>No reference range available</div>;
                                                                                    })()}
                                                                                </div>
                                                                                <div className="disclaimer-text">
                                                                                    <span style={{ fontWeight: "600" }}>Disclaimer:</span>{" "}
                                                                                    {`This range is only for reference and may vary between patients based on different conditions.`}
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                        overlayClassName="lab-params-tooltip"
                                                                        overlayInnerStyle={{
                                                                            padding: "12px",
                                                                            width: "250px",
                                                                            background: "white",
                                                                            color: "black",
                                                                        }}
                                                                    >
                                                                        <i
                                                                            className="icon-info ms-1"
                                                                            style={{
                                                                                cursor: "pointer",
                                                                                color: "#d3d3d3",
                                                                                fontSize: "18px",
                                                                                marginBottom: "10px",
                                                                            }}
                                                                        ></i>
                                                                    </Tooltip>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {organizedData?.dates?.map(date => {
                                                        const paramDateData = paramData.dates[date];
                                                        const value = renderValue(paramDateData, paramData.referenceRange);
                                                        return (
                                                            <td 
                                                                key={`${serviceName}-${paramName}-${date}`}
                                                                style={{ 
                                                                    padding: "10px",
                                                                    background: "transparent"
                                                                }}
                                                            >
                                                                {value}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))
                                        ) : (
                                            // Case 2: No parameters - show service result directly
                                            <tr style={{ background: "#fff" }}>
                                                <td style={{
                                                    position: "sticky",
                                                    left: 0,
                                                    background: "#fff",
                                                    padding: "10px",
                                                    width: "23rem",
                                                }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 10px" }}>
                                                        {renderServiceCheckbox(serviceName)}
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            <span style={{ fontSize: "14px" }}>{serviceName}</span>
                                                            {Object.values(testData.dates)[0]?.referenceRange && (
                                                                <Tooltip
                                                                    placement="bottom"
                                                                    title={
                                                                        <div className="ref-range-tooltip">
                                                                            <div>
                                                                                <strong>Reference Range:</strong>
                                                                                {(() => {
                                                                                    const refRange = Object.values(testData.dates)[0]?.referenceRange;
                                                                                    // Check if refRange is a string (direct value)
                                                                                    if (typeof refRange === 'string' && refRange !== '-') {
                                                                                        return <div>{refRange}</div>;
                                                                                    }
                                                                                    // Check if refRange is an object with ranges
                                                                                    if (refRange?.ranges?.length > 0) {
                                                                                        const maleRange = refRange.ranges.find(
                                                                                            (range) => range.gender?.toLowerCase() === "male"
                                                                                        );
                                                                                        const femaleRange = refRange.ranges.find(
                                                                                            (range) => range.gender?.toLowerCase() === "female"
                                                                                        );
                                                                                        const allRange = refRange.ranges.find(
                                                                                            (range) => range.gender?.toLowerCase() === "all"
                                                                                        );

                                                                                        if (maleRange && femaleRange) {
                                                                                            return (
                                                                                                <div>
                                                                                                    Male: {`${maleRange.min} - ${maleRange.max} ${maleRange.unit}`} <br />
                                                                                                    Female: {`${femaleRange.min} - ${femaleRange.max} ${femaleRange.unit}`}
                                                                                                </div>
                                                                                            );
                                                                                        } else if (maleRange) {
                                                                                            return (
                                                                                                <div>
                                                                                                    Male: {`${maleRange.min} - ${maleRange.max} ${maleRange.unit}`}
                                                                                                </div>
                                                                                            );
                                                                                        } else if (femaleRange) {
                                                                                            return (
                                                                                                <div>
                                                                                                    Female: {`${femaleRange.min} - ${femaleRange.max} ${femaleRange.unit}`}
                                                                                                </div>
                                                                                            );
                                                                                        } else if (allRange) {
                                                                                            return (
                                                                                                <div>
                                                                                                    All: {`${allRange.min} - ${allRange.max} ${allRange.unit}`}
                                                                                                </div>
                                                                                            );
                                                                                        }
                                                                                    }
                                                                                    // If refRange is a simple string value
                                                                                    if (refRange && refRange !== '-') {
                                                                                        return <div>{refRange}</div>;
                                                                                    }
                                                                                    return <div>No reference range available</div>;
                                                                                })()}
                                                                            </div>
                                                                            <div className="disclaimer-text">
                                                                                <span style={{ fontWeight: "600" }}>Disclaimer:</span>{" "}
                                                                                {`This range is only for reference and may vary between patients based on different conditions.`}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    overlayClassName="lab-params-tooltip"
                                                                    overlayInnerStyle={{
                                                                        padding: "12px",
                                                                        width: "250px",
                                                                        background: "white",
                                                                        color: "black",
                                                                    }}
                                                                >
                                                                    <i
                                                                        className="icon-info ms-1"
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            color: "#d3d3d3",
                                                                            fontSize: "18px",
                                                                            marginBottom: "10px",
                                                                        }}
                                                                    ></i>
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                {organizedData?.dates?.map(date => (
                                                    <td key={date} style={{ padding: "10px" }}>
                                                        {renderValue(testData.dates[date]?.resultvalue, testData.dates[date]?.referenceRange)}
                                                    </td>
                                                ))}
                                            </tr>
                                        )}
                                    </>
                                )}
                                
                                {/* Add spacer after each test section except the last one */}
                                {index < Object.keys(organizedData.tests).length - 1 && (
                                    <tr>
                                        <td colSpan={organizedData.dates.length + 1} style={{ height: "10px", background: "#fff" }}></td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ZydusLabParams; 
