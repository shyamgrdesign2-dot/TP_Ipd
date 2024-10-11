import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Card, DatePicker, Input, Tooltip, message } from 'antd';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from "moment";
import { jwtDecode } from 'jwt-decode';
import { DEFAULT_TESTS_DATA, LAB_PARAMS_RESULTS, PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from '../utils/constants';
import api from "../api/services/axiosService";
import { env } from "../EnvironmentConfig";
import CheckableTag from 'antd/es/tag/CheckableTag';

const LabResultsTable = ({ handleAddLabParamsDrawer, patient_data }) => {

    const [token, setToken] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [dates, setDates] = useState([]);
    const [existingResults, setExistingResults] = useState([]);
    const [filledData, setFilledData] = useState([]);
    const [inputValues, setInputValues] = useState({});
    const [expandedReports, setExpandedReports] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [labParamsResults, setLabParamsResults] = useState([]);
    const [isRemarksVisible, setIsRemarksVisible] = useState({});
    const scrollContainerRef = useRef(null);
    const inputRef = useRef([]);
    const currentDate = new Date().toISOString().split("T")[0];
    const dateFormat = 'YYYY-MM-DD';
    const showDateFormat = 'DD MMM, YY';

    const baseUrl = { customBaseUrl: env.lab_params_api_url  };

    // Helper function to group data by reportName
    const groupByReportName = (data) => {
        const grouped = {};
        data.forEach((result) => {
            result.inputs.forEach((input) => {
                if (!grouped[input.reportName]) {
                    grouped[input.reportName] = {};
                }
                if (!grouped[input.reportName][input.name]) {
                    grouped[input.reportName][input.name] = {};
                }
                grouped[input.reportName][input.name][result.date] = input;
            });
        });
        return grouped;
    };

    useEffect(() => {
        const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
        if (token) {
            try {
                setToken(token);
                const decoded = jwtDecode(token);
                setTokenData(decoded.result);
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const toggleReport = (reportName) => {
        setExpandedReports((prev) => ({
            ...prev,
            [reportName]: !prev[reportName],
        }));
    };

    const searchLabParams = async (searchQuery) => {
        try {
            const cleanedToken = token.replace(/['"]+/g, '');
            const response = await axios.get(`https://pm-patient-docs-uat.tatvacare.in/api/v1/lab-parameters?search=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${cleanedToken}`,
                },
            });
            return response.data; 
        } catch (error) {
            console.error("Error fetching lab params:", error);
            return [];
        }
    }

    const getLabParams = async () => {
        try {
            const cleanedToken = token.replace(/['"]+/g, '');
            const patientId = patient_data?.patient_unique_id;
            const doctorId = tokenData?.user_id;
            const response = await axios.get(`https://pm-patient-docs-uat.tatvacare.in/api/v1/lab-parameters/results/${doctorId}/${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${cleanedToken}`,
                },
            });
            setExistingResults(response.data?.results || []); 
        } catch (error) {
            console.error("Error fetching lab params:", error);
        }
    };

    useEffect(() => {
        if(token){
            getLabParams();
        }
    },[token])

    const onSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    useEffect(() => {
        const fetchLabParams = async () => {
             if (searchQuery === '') {
                setLabParamsResults([]);
            } else {
                const labParamsResults = await searchLabParams(searchQuery);
                setLabParamsResults(labParamsResults);
            }
        };
        fetchLabParams(); 
    }, [searchQuery]);

    useEffect(() => {
        const timeOutId = setTimeout(async () => {
            const updatedResults = mergeSearchResults(existingResults, labParamsResults);
            const groupedData = groupByReportName(updatedResults);
            setInputValues(groupedData);
        }, 500);
        return () => {
            clearTimeout(timeOutId);
        };
    }, [labParamsResults, existingResults]);

    const combineData = (currentFilledData, filledData) => {
        const combinedResults = [...filledData]; // Start with a copy of filledData
      
        currentFilledData.forEach((currentEntry) => {
          // Check if there is an entry with the same date in filledData
          const filledEntry = combinedResults.find(
            (entry) => entry.date === currentEntry.date
          );
      
          if (filledEntry) {
            // If date matches, loop through the inputs of currentFilledData
            currentEntry.inputs.forEach((currentInput) => {
              const matchingInput = filledEntry.inputs.find(
                (filledInput) =>
                  filledInput.reportName === currentInput.reportName &&
                  filledInput.name === currentInput.name
              );
      
              if (matchingInput) {
                // If reportName and name match, update filledData's input with currentInput's values
                matchingInput.value = currentInput.value;
                matchingInput.arrowDirection = currentInput.arrowDirection;
                matchingInput.unit = currentInput.unit;
              } else {
                // If no match, add the currentInput to the filledEntry's inputs
                filledEntry.inputs.push(currentInput);
              }
            });
          } else {
            // If no matching date, add the entire currentEntry to the results
            combinedResults.push(currentEntry);
          }
        });
      
        return combinedResults;
    };

    function mergeSearchResults(existingResults, labParamsResults, searchQuery) {
        const tempResults = [];

        const currentFilledData = assemblePayload(inputValues);
        const data = combineData(currentFilledData,filledData) 
        setFilledData(data)

        existingResults = data?.length > 0 ?  data : existingResults ;
    
        // Case 1: No existing results
        if (existingResults.length === 0) {
            if (labParamsResults.length === 0) {
                // If no existing results and no labParamsResults, show predefined lab params with current date
                const newEntry = {
                    date: new Date().toISOString().split('T')[0],
                    inputs: [...DEFAULT_TESTS_DATA]
                };
                tempResults.push(newEntry);
            } else {
                // If no existing results but labParamsResults exist, show them with current date
                const newEntry = {
                    date: new Date().toISOString().split('T')[0],
                    inputs: labParamsResults.map(lab => ({
                        labParametersMasterId: lab._id || "",
                        reportName: lab.reportName || "",
                        name: lab.testName || "",
                        value: "",
                        unit: lab.units || ""
                    }))
                };
                tempResults.push(newEntry);
            }
            return tempResults;
        }
    
        // Case 2: Existing results exist
        if (existingResults.length > 0) {
            // Case 3: Existing results and labParamsResults exist
            if (labParamsResults.length > 0) {
                existingResults.forEach(entry => {
                    // Create a new entry using the existing date
                    const newEntry = {
                        date: entry.date, // Retain the date of the existing entry
                        inputs: labParamsResults.map(lab => {
                            // Check if the lab.testName exists in the current entry's inputs
                            const existingInput = entry.inputs.find(input => 
                                input.name === lab.testName && input.reportName === lab.reportName
                            );

                            // If found, retain the existing value, otherwise set an empty value
                            const labInput = {
                                labParametersMasterId: lab.labParametersMasterId || "",
                                reportName: lab.reportName || "",
                                name: lab.testName || "",
                                value: existingInput ? existingInput.value : "", // Retain existing value if present
                                unit: lab.units || ""
                            };

                            // Check if 'Remarks' exists in the current inputs for the same reportName
                            const remarksInput = entry.inputs.find(input => 
                                input.name === "Remarks" && input.reportName === lab.reportName
                            );

                            if (remarksInput) {
                                // Add Remarks as a new field if found in the existing results for that reportName
                                return {
                                    ...labInput,
                                    name:remarksInput.name,
                                    value: remarksInput.value || "",
                                    // Attach remarks if they exist
                                };
                            }

                            return labInput; // Return the normal input if no remarks found
                        })
                    };

                    // Push the new entry with labParamsResults mapped to the existing date
                    tempResults.push(newEntry);
                });

                return tempResults; // Return processed results
            }


            // If predefined lab parameters exist, append them
            if (DEFAULT_TESTS_DATA.length > 0) {
            
                // First step: Iterate over existing results and push existing inputs to tempResults
                existingResults.forEach((entry) => {
                    // Create a new entry for each existing date
                    let newEntry = {
                        date: entry.date, // Retain the date of the existing entry
                        inputs: [...entry.inputs], // Copy all existing inputs
                    };

                    // Second step: Append predefined results if they are not already in the inputs
                    DEFAULT_TESTS_DATA.forEach((lab) => {
                        // Check if this predefined lab test already exists in the current date's inputs
                        const existingInput = newEntry.inputs.find(
                            (input) =>
                                input.name === lab.name &&
                                input.reportName === lab.reportName
                        );

                        // If it doesn't exist, add it to the inputs with an empty value
                        if (!existingInput) {
                            newEntry.inputs.push({
                                labParametersMasterId: lab.labParametersMasterId || "",
                                reportName: lab.reportName || "",
                                name: lab.name || "",
                                value: "", // Set empty value for predefined tests
                                unit: lab.unit || "",
                            });
                        }
                    });

                    // Push the newEntry to tempResults
                    tempResults.push(newEntry);
                });

                return tempResults;
            }
    
        }
    
        // Final fallback: just return existingResults if they exceed the expected conditions
        return existingResults;
    }
    
    useEffect(() => {
        if (existingResults.length === 0) {
            setDates([currentDate]);
        } else {
            const uniqueDates = [...new Set(existingResults.map((result) => result.date))];
            setDates(uniqueDates);
        }
    }, [existingResults]);

    const disabledDate = (current) => {
        return current && current >= moment().add(1, 'days').startOf('day');
    };

    const handleInputChange = (reportName, testName, date, value) => {
        setInputValues((prev) => {
            const updatedData = { ...prev };
    
            // Check if the reportName exists
            if (!updatedData[reportName]) {
                updatedData[reportName] = {};
            }
    
            // Check if the testName exists under the reportName
            if (!updatedData[reportName][testName]) {
                updatedData[reportName][testName] = {};
            }
    
            // Check if the date exists under the testName, if not, initialize it
            if (!updatedData[reportName][testName][date]) {
                updatedData[reportName][testName][date] = {
                    labParametersMasterId: "", 
                    reportName: reportName,
                    name: testName,
                    value: "",
                    unit: getUnitForTest(reportName, testName),
                };
            }
    
            // Update the value for the specific date
            updatedData[reportName][testName][date].value = value;
    
            return updatedData;
        });
    };
    
    const getUnitForTest = (reportName, testName) => {
        for (const date of dates) {
            const unit = inputValues[reportName]?.[testName]?.[date]?.unit;
            if (unit) {
                return unit;
            }
        }
        return "";
    };

    const assemblePayload = (inputValues) => {
        const results = dates
            .map((date) => {
                const inputs = Object.keys(inputValues)
                    .flatMap((reportName) =>
                        Object.keys(inputValues[reportName])
                            .map((testName) => {
                                const testValue = inputValues[reportName][testName][date]?.value || "";
                                if (testValue) {
                                    return {
                                        labParametersMasterId: inputValues[reportName][testName][date]?.labParametersMasterId,
                                        reportName,
                                        name: testName,
                                        value: testValue,
                                        arrowDirection: inputValues[reportName][testName][date]?.arrowDirection || "",
                                        unit: inputValues[reportName][testName][date]?.unit || getUnitForTest(reportName, testName),
                                    };
                                } else {
                                    return null; // Exclude tests without a value
                                }
                            })
                            .filter((input) => input !== null) // Remove null entries
                    );
    
                return inputs.length > 0 ? { date, inputs } : null; // Remove dates with no valid inputs
            })
            .filter((result) => result !== null); // Filter out null dates
    
        return results;
    };

    const handleAddNewDate = (date) => {
        if (!dates.includes(date)) {
            // Update the dates
            setDates((prevDates) => [...prevDates, date]);
    
            // Update the inputValues to include the new date
            setInputValues((prevInputValues) => {
                const updatedValues = { ...prevInputValues };
    
                // Iterate over each reportName and testName to add the new date
                Object.keys(updatedValues).forEach((reportName) => {
                    Object.keys(updatedValues[reportName]).forEach((testName) => {
                        if (!updatedValues[reportName][testName][date]) {
                            updatedValues[reportName][testName][date] = {
                                labParametersMasterId: "",
                                reportName: reportName,
                                name: testName,
                                value: "",
                                unit: getUnitForTest(reportName, testName),
                            };
                        }
                    });
                });
    
                return updatedValues;
            });
        } else {
            message.warning('Date already exists');
        }
    };

    const handleSave = async() =>{
        const payload = {
            patientId: patient_data?.patient_unique_id,
            doctorId: tokenData?.user_id,
            results: filledData 
        }

        try {
            const response = await api.post(
              LAB_PARAMS_RESULTS,
              payload,
              baseUrl
            );
            if(response){
                handleAddLabParamsDrawer();
            }
          } catch (error) {
            console.error("Error:", error);
          }

    }
    
    return (
        <div>
            <div className='modalCard-header h-60 align-items-center justify-content-between d-flex' style={{position: "sticky",top: "0",zIndex: "1"}}>
                <div className='align-items-center d-flex'>
                    <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100' onClick={handleAddLabParamsDrawer} >
                        <i className='icon-Cross fs-3'></i>
                    </Button>
                    <div className="modal-title">Add Lab Results</div>
                </div>
                <Button className='btn btn-primary3 btn-41 px-4 me-20' onClick={handleSave}>
                    Save
                </Button>
            </div>
            <div className="align-items-center d-flex justify-content-between px-20 py-3 gap-4">
                <Input
                    value={searchQuery}
                    placeholder="Search by test name or category"
                    className="inputheight38"
                    style={{width:"18rem"}}
                    prefix={<i className="icon-search" />}
                    suffix={searchQuery.length > 0 && <i className="icon-Cross" onClick={() => onSearch('')}></i>}
                    onChange={(e) => onSearch(e.target.value)}
                />
                <div className="position-relative">
                    <Button className='btn btn-primary2 btn-41'>
                        Add New Date
                    </Button>
                    <DatePicker key={Math.random()} suffixIcon={null} inputReadOnly onChange={(date, dateString) => handleAddNewDate(dateString)} disabledDate={disabledDate} className='calender-labparams'/>
                </div>
            </div>
            <div className='px-20'>
                <div className='labparam-header'>
                    <div className='labparam-head'>Name</div>
                    <div className='labparam-head-date'>
                        {dates.map((date) => (
                            <div key={date} className='labparam-head-dates'>
                                {moment(date).format(showDateFormat)}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Scrollable container for date-based inputs */}
                <div ref={scrollContainerRef} className='d-flex'>
                    <div className="d-flex flex-column w-100">
                        {Object.keys(inputValues).map((reportName) => (
                            <>
                                <div className="test-parameters-header" onClick={() => toggleReport(reportName)}>
                                    <span className=''>{reportName}</span>
                                    {(!!expandedReports[reportName]) ? <CaretDownOutlined /> : <CaretRightOutlined />}
                                </div>
                                { Object.keys(inputValues[reportName]).map((testName) => (
                                    <>
                                        { expandedReports[reportName] && ( // Only render if report is expanded
                                            <div key={testName} className="test-values-row">
                                                <div key={testName} className='labparam-title'>
                                                    {testName}
                                                </div>
                                                {dates.map((date) => (
                                                    <div key={date} className='test-values-container'>
                                                        {testName === "Remarks" ? (
                                                            // Conditionally rendering remarks as text with truncation
                                                            <div className='test-value'>
                                                                <div 
                                                                    className="remarks-text truncated" 
                                                                >
                                                                    {inputValues[reportName][testName][date]?.value || "No remarks"}
                                                                </div>

                                                                {/* Modal or container to show full remarks when clicked */}
                                                                {isRemarksVisible[reportName]?.[testName]?.[date] && (
                                                                    <div className="full-remarks-container">
                                                                        <div className="full-remarks-content">
                                                                            {inputValues[reportName][testName][date]?.value}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            // Regular input for non-remarks fields
                                                            <div className='test-value'>
                                                                <Input
                                                                    className="inputheight41-group"
                                                                    type="text"
                                                                    value={inputValues[reportName][testName][date]?.value || ""}
                                                                    addonAfter={inputValues[reportName][testName][date]?.unit || getUnitForTest(reportName, testName)}
                                                                    onChange={(e) =>
                                                                        handleInputChange(
                                                                            reportName,
                                                                            testName,
                                                                            date,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ))}
                            </>
                        ))}
                    </div>
                </div>
            </div>  
    </div>
);
};

export default LabResultsTable;