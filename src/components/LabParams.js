import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Card, DatePicker, Input, Popover, Tooltip, message } from 'antd';
import { EllipsisOutlined, DeleteOutlined, CaretRightOutlined, CaretDownOutlined } from "@ant-design/icons";
import axios from 'axios';
import moment from "moment";
import { jwtDecode } from 'jwt-decode';
import { LAB_PARAMS_RESULTS, PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from '../utils/constants';
import { DEFAULT_TESTS_DATA } from '../utils/labParamsConstants';
import api from "../api/services/axiosService";
import { env } from "../EnvironmentConfig";
import CheckableTag from 'antd/es/tag/CheckableTag';
import CommonModal from '../common/CommonModal';
import alertIcon from '../assets/images/alertIcon.svg';
import editIcon from '../assets/images/edit.svg';

const LabResultsTable = ({ handleAddLabParamsDrawer, patient_unique_id, onSave, isBackModalOpen, showHideBackModal,  patientGender = "male"  }) => {

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
    const [testCounts, setTestCounts] = useState({});
    const [showTooltip, setShowTooltip] = useState(false);
    const scrollContainerRef = useRef(null);
    const inputRef = useRef([]);
    const scrollRefs = useRef([]);
    const [editingDate, setEditingDate] = useState(null);

    const currentDate = new Date().toISOString().split("T")[0];
    const dateFormat = 'YYYY-MM-DD';
    const showDateFormat = 'DD MMM, YY';

    //states for Remarks Functionality 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [activeReport, setActiveReport] = useState(null);
    const [activeTest, setActiveTest] = useState(null);
    const [activeDate, setActiveDate] = useState(null);

    const baseUrl = { customBaseUrl: env.lab_params_api_url  };

    // Helper function to group data by reportName
    const groupByReportName = (data) => {
        const grouped = {};
        data.forEach((result) => {
            result.inputs.forEach((input) => {
                if (!grouped[input.reportName]) {
                    grouped[input.reportName] = {};
                }
                if (!grouped[input.reportName][input.testName]) {
                    grouped[input.reportName][input.testName] = {};
                }
                grouped[input.reportName][input.testName][result.date] = input;
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
    
            const labParamsData = response.data;
    
            // If searchQuery is present, expand all the report names
            if (searchQuery) {
                const expanded = labParamsData.reduce((acc, report) => {
                    acc[report.reportName] = true; // Expand all reports
                    return acc;
                }, {});
                setExpandedReports(expanded); // Set expanded state for all reports
            } else {
                setExpandedReports({}); // Collapse all if no search query
            }
    
            return labParamsData;
        } catch (error) {
            console.error("Error fetching lab params:", error);
            return [];
        }
    };

    const getLabParams = async () => {
        try {
            const cleanedToken = token.replace(/['"]+/g, '');
            const patientId = patient_unique_id;
            const doctorId = tokenData?.user_id;
            const response = await axios.get(`https://pm-patient-docs-uat.tatvacare.in/api/v1/lab-parameters/results/${doctorId}/${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${cleanedToken}`,
                },
            });
            setExistingResults(response.data?.data?.results || []); 
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
                setExpandedReports({});
            } else {
                const labParamsResults = await searchLabParams(searchQuery);
                setLabParamsResults(labParamsResults);
            }
        };
        fetchLabParams(); 
    }, [searchQuery]);

    useEffect(() => {
        const timeOutId = setTimeout(async () => {
            const updatedResults = mergeSearchResults(existingResults, labParamsResults, searchQuery);
    
            // Sort newly added data first when no search query
            if (!searchQuery) {
                const sortedResults = updatedResults.sort((a, b) => new Date(b.date) - new Date(a.date));
                const groupedData = groupByReportName(sortedResults);
                setInputValues(groupedData);
            } else {
                const groupedData = groupByReportName(updatedResults);
                setInputValues(groupedData);
            }
        }, 1000);
    
        return () => clearTimeout(timeOutId);
    }, [labParamsResults, existingResults, searchQuery]);

    const combineData = (currentFilledData, filledData) => {
        const combinedResults = [...filledData];
      
        currentFilledData.forEach((currentEntry) => {
            // Check if the date already exists in the filledData
            const filledEntry = combinedResults.find((entry) => entry.date === currentEntry.date);
    
            if (filledEntry) {
                // If date exists, loop through the inputs of currentFilledData
                currentEntry.inputs.forEach((currentInput) => {
                    const matchingInput = filledEntry.inputs.find(
                        (filledInput) =>
                            filledInput.reportName === currentInput.reportName &&
                            filledInput.testName === currentInput.testName
                    );
    
                    if (matchingInput) {
                        // Update input if match is found
                        matchingInput.value = currentInput.value;
                        matchingInput.arrowDirection = currentInput.arrowDirection;
                        matchingInput.units = currentInput.units;

                        // Mark the input as recently updated by adding a `recentlyUpdated` flag
                        matchingInput.recentlyUpdated = true;
                    } else {
                        // If no match, add the new input and mark it as recently added
                        filledEntry.inputs.push({
                            ...currentInput,
                            recentlyUpdated: true
                        });
                        }
                });
            } else {
                // If date doesn't exist, push the new entry and mark it as recently added
                combinedResults.push({
                    ...currentEntry,
                    inputs: currentEntry.inputs.map(input => ({
                        ...input,
                        recentlyUpdated: true
                    }))
                });
                }
        });
    
        // Sort results by recently updated entries first, then by date
        combinedResults.forEach(entry => {
            entry.inputs.sort((a, b) => {
                if (a.recentlyUpdated && !b.recentlyUpdated) return -1;
                if (!a.recentlyUpdated && b.recentlyUpdated) return 1;
                return 0;
            });
        });
        
        return combinedResults;
    };

    const addRemarksToUniqueReportNames = (inputs) => {
        const uniqueReportNames = [...new Set(inputs.map(input => input.reportName))];
        uniqueReportNames.forEach(reportName => {
            const hasRemarks = inputs.some(input => input.testName === "Remarks" && input.reportName === reportName);
            if (!hasRemarks) {
                inputs.push({
                    reportName: reportName,
                    testName: "Remarks",
                    value: "",  // Default value for Remarks
                    units: "",
                    arrowDirection: "",
                    refRange: "",
                    recentlyUpdated: true  // Mark as newly added
                });
            }
        });
    };

    // Function to handle the modal opening
    const handleOpenModal = (reportName, testName, date) => {
        setActiveReport(reportName);
        setActiveTest(testName);
        setActiveDate(date);
        setModalContent(inputValues[reportName][testName][date]?.value || "");
        setIsModalOpen(true);
    };

    // Function to handle modal closing
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setActiveReport(null);
        setActiveTest(null);
        setActiveDate(null);
        setModalContent("");
    };

    // Function to handle saving remarks
    const handleSaveRemarks = () => {
        const updatedValues = { ...inputValues };
        if (!updatedValues[activeReport]) updatedValues[activeReport] = {};
        if (!updatedValues[activeReport][activeTest]) updatedValues[activeReport][activeTest] = {};
        if (!updatedValues[activeReport][activeTest][activeDate]) {
            updatedValues[activeReport][activeTest][activeDate] = {};
        }

        updatedValues[activeReport][activeTest][activeDate].value = modalContent;

        // Update input values
        setInputValues(updatedValues);

        // Close modal
        handleCloseModal();
    };

    const calculateArrowDirection = (value, refRange, gender = "ALL") => {
        if (!value || isNaN(parseFloat(value))) {
            return "";
        }
    
        let selectedRange;
    
        // Check if refRange has conditional ranges
        if (refRange?.isConditional) {
            selectedRange = refRange.ranges.find(range => range.gender === gender) || refRange.ranges[0];
        } else {
            selectedRange = refRange?.ranges[0]; // Single range case
        }
    
        if (selectedRange) {
            const numericValue = parseFloat(value);
            const min = parseFloat(selectedRange.min);
            const max = parseFloat(selectedRange.max);
    
            if (numericValue > max) {
                return "up";
            } else if (numericValue < min) {
                return "down";
            }
        }
    
        return ""; // No arrow if within range
    };

    const mergeSearchResults = (existingResults, labParamsResults, searchQuery) => {
        const tempResults = [];
    
        const currentFilledData = assemblePayload(inputValues);
        const data = combineData(currentFilledData, filledData);
    
        setFilledData(data);
        existingResults = data?.length > 0 ? data : existingResults; // Use the combined data
    
        // Case 1: No existing results
        if (existingResults.length === 0) {
            if (labParamsResults.length === 0) {
                // No labParamsResults: return default data
                const newEntry = {
                    date: new Date().toISOString().split('T')[0],
                    inputs: [...DEFAULT_TESTS_DATA]
                };

                // Call function to add 'Remarks'
                addRemarksToUniqueReportNames(newEntry.inputs);
                tempResults.push(newEntry);
            } else {
                // LabParamsResults exist: create new entry with current date
                const newEntry = {
                    date: new Date().toISOString().split('T')[0],
                    inputs: labParamsResults.map(lab => ({
                        reportName: lab.reportName || "",
                        testName: lab.testName || "",
                        value: "",
                        units: lab.units || "",
                        arrowDirection: "",
                        refRange: lab.refRange || "",
                    }))
                };

                // Call function to add 'Remarks'
                addRemarksToUniqueReportNames(newEntry.inputs);
                tempResults.push(newEntry);
                console.log(tempResults,"tempResults");
            }
            return tempResults;
        }
    
        // Case 2: Existing results present
        if (existingResults.length > 0) {
            if (labParamsResults.length > 0) {
                existingResults.forEach(entry => {
                    const newEntry = {
                        date: entry.date,  // Keep existing date
                        inputs: labParamsResults.map(lab => {
                            const existingInput = entry.inputs.find(input =>
                                input.testName === lab.testName && input.reportName === lab.reportName
                            );

                            const labInput = {
                            reportName: lab.reportName || "",
                            testName: lab.testName || "",
                            value: existingInput ? existingInput.value : "",  // Retain value if exists
                            units: lab.units || "",
                            arrowDirection: existingInput ? existingInput.arrowDirection : "",
                            refRange: lab.refRange || "",
                            };

                            return labInput;
                        })
                    };

                    // Call function to add 'Remarks'
                    addRemarksToUniqueReportNames(newEntry.inputs);

                    tempResults.push(newEntry);
                });

                return tempResults;
            }

            // Append predefined lab parameters if not already present
            if (DEFAULT_TESTS_DATA?.length > 0) {
                existingResults.forEach((entry) => {
                    const newEntry = {
                        date: entry.date,
                        inputs: [...entry.inputs]
                    };

                    DEFAULT_TESTS_DATA.forEach((lab) => {
                        const existingInput = newEntry.inputs.find(
                            input => input.testName === lab.testName && input.reportName === lab.reportName
                        );

                        if (!existingInput) {
                            newEntry.inputs.push({
                                reportName: lab.reportName || "",
                                testName: lab.testName || "",
                                value: "",
                                units: lab.units || "",
                                arrowDirection: "",
                                refRange: lab.refRange || "",
                                recentlyUpdated: true // Mark predefined data as newly added
                            });
                        }
                    });

                    // Call function to add 'Remarks'
                    addRemarksToUniqueReportNames(newEntry.inputs);

                    tempResults.push(newEntry);
                });

                return tempResults;
            }
        }
    
        return existingResults; // Fallback: return existing results if nothing changes
    };

    // Function to get the unique count of testNames for each reportName
    const getUniqueTestNameCount = (inputValues) => {
        const reportCounts = {};

        Object.keys(inputValues).forEach((reportName) => {
            const testNameSet = new Set();

            Object.keys(inputValues[reportName]).forEach((testName) => {
                const hasValue = Object.keys(inputValues[reportName][testName]).some((date) => {
                    return inputValues[reportName][testName][date]?.value;
                });

                if (hasValue) {
                    testNameSet.add(testName);
                }
            });

            if (testNameSet.size > 0) {
                reportCounts[reportName] = testNameSet.size;
            }
        });

        return reportCounts;
    };

    // Update the state when inputValues change
    useEffect(() => {
        const counts = getUniqueTestNameCount(inputValues);
        setTestCounts(counts);
    }, [inputValues]);
    
    useEffect(() => {
        if (existingResults.length === 0) {
            setDates([currentDate]);
        } else {
            const uniqueDates = [...new Set(existingResults.map((result) => result.date))];
            setDates(uniqueDates);
        }
    }, [existingResults]);

    const handleEditDate = (date) => {
        setEditingDate(date);
    };

    const handleDateChange = (newDate) => {
        
        if (editingDate) {
            const updatedDates = dates.map((date) =>
                date === editingDate ? newDate : date
            );

            setDates(updatedDates);
            setEditingDate(null);
        }
    };

    const handleDeleteDate = (dateToDelete) => {
        setDates((prevDates) => prevDates.filter((date) => date !== dateToDelete));
    };

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
    
            // Initialize the date for the testName if not present
            if (!updatedData[reportName][testName][date]) {
                updatedData[reportName][testName][date] = {
                    reportName,
                    testName,
                    value: "",
                    arrowDirection: "",
                    refRange: inputValues[reportName]?.[testName]?.[date]?.refRange || "",
                    units: getUnitForTest(reportName, testName),
                };
            }
    
            // Update the value and calculate the arrow direction
            const refRange = updatedData[reportName][testName][date].refRange;
            const gender = patientGender || "ALL"; // Assuming `patientGender` is available globally or passed in
    
            updatedData[reportName][testName][date].value = value;
            updatedData[reportName][testName][date].arrowDirection = calculateArrowDirection(value, refRange, gender);
    
            return updatedData;
        });
    };    
    
    const getUnitForTest = (reportName, testName) => {
        for (const date of dates) {
            const units = inputValues[reportName]?.[testName]?.[date]?.units;
            if (units) {
                return units;
            }
        }
        return "";
    };

    const assemblePayload = () => {
        const results = dates.map((date) => {
                const inputs = Object.keys(inputValues)
                    .flatMap((reportName) =>
                        Object.keys(inputValues[reportName])
                            .map((testName) => {
                                const testValue = inputValues[reportName][testName][date]?.value || "";
                                if (testValue) {
                                    return {
                                        reportName,
                                        testName: testName,
                                        value: testValue,
                                        arrowDirection: inputValues[reportName][testName][date]?.arrowDirection || "",
                                        refRange: inputValues[reportName][testName][date]?.refRange,
                                        units: inputValues[reportName][testName][date]?.units || getUnitForTest(reportName, testName),
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
                                reportName: reportName,
                                testName: testName,
                                value: "",
                                units: getUnitForTest(reportName, testName),
                                arrowDirection:"",
                                refRange: inputValues[reportName][testName][date]?.refRange,
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

        const data = assemblePayload();
        setFilledData(data);
        const payload = {
            patientId: patient_unique_id,
            doctorId: tokenData?.user_id,
            results: data,
        };

        try {
            const response = await api.post(
              LAB_PARAMS_RESULTS,
              payload,
              baseUrl
            );
            if(response){
                onSave(data);
                handleAddLabParamsDrawer();
            }
          } catch (error) {
            console.error("Error:", error);
          }

    }

    const handleScroll = (index) => {
        const scrollLeft = scrollRefs.current[index].scrollLeft;
        scrollRefs.current.forEach((ref, i) => {
            if (i !== index) {
                ref.scrollLeft = scrollLeft; // Synchronize scroll position
            }
        });
    };
    
    return (
      <div>
        <div
          className="modalCard-header h-60 align-items-center justify-content-between d-flex"
          style={{ position: "sticky", top: "0", zIndex: "3" }}
        >
          <div className="align-items-center d-flex">
            <Button
              type="text"
              className="btn btn-delete-prescription px-3 focus-none h-100"
              onClick={showHideBackModal}
            >
              <i className="icon-Cross fs-3"></i>
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
                        onClick={() => {
                          handleAddLabParamsDrawer();
                          showHideBackModal();
                        }}
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
            <div className="modal-title">Add Lab Results</div>
          </div>
          <Button
            className="btn btn-primary3 btn-41 px-4 me-20"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
        <div className="align-items-center d-flex justify-content-between px-20 py-3 gap-4" style={{position:"sticky",top:"3.78rem", backgroundColor:"white",zIndex:"999"}}>
          <Input
            value={searchQuery}
            placeholder="Search by test name or category"
            className="inputheight38"
            style={{ width: "18rem" }}
            prefix={<i className="icon-search" />}
            suffix={
              searchQuery.length > 0 && (
                <i className="icon-Cross" onClick={() => onSearch("")}></i>
              )
            }
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="position-relative">
            <Button className="btn btn-primary2 btn-41">Add New Date</Button>
            <DatePicker
              key={Math.random()}
              suffixIcon={null}
              inputReadOnly
              onChange={(date, dateString) => handleAddNewDate(dateString)}
              disabledDate={disabledDate}
              className="calender-labparams"
            />
          </div>
        </div>
        <div className="px-20">
          <div className="labparam-header">
            <div className="labparam-head">Name</div>
            <div className="labparam-head-date">
              {dates.map((date) => (
                <div key={date} className="labparam-head-dates">
                  {moment(date).format(showDateFormat)}
                </div>
              ))}
            </div>
          </div>
          {/* Scrollable container for date-based inputs */}
          <div ref={scrollContainerRef} className="d-flex">
            <div
              className="d-flex flex-column w-100"
              style={{ overflowY: "auto", position: "relative" }}
            >
              {Object.keys(inputValues).map((reportName) => (
                <>
                  <div
                    className="test-parameters-header"
                    key={reportName}
                    onClick={() => toggleReport(reportName)}
                  >
                    <div>
                      <span>{reportName}</span>
                      {testCounts[reportName] > 0 && (
                        <span> ({testCounts[reportName]})</span>
                      )}
                    </div>
                    {!!expandedReports[reportName] ? (
                      <CaretDownOutlined />
                    ) : (
                      <CaretRightOutlined />
                    )}
                  </div>
                  {Object.keys(inputValues[reportName]).map(
                    (testName, index) => (
                      <div>
                        {expandedReports[reportName] && ( // Only render if report is expanded
                          <div key={testName} className="test-values-row">
                            <div
                              className="labparam-title sticky-testname"
                              style={{
                                width: 280,
                                position: "sticky",
                                left: 0,
                                background: "#fff",
                                zIndex: 2,
                              }}
                            >
                              <div style={{ width:"100px" }}>
                                {testName}
                                <Tooltip
                                    placement="bottom"
                                    title={
                                        <div style={{ textAlign: 'center' }}>
                                          {(() => {
                                            // Initialize a variable to track if the reference range has been rendered
                                            let hasRenderedRefRange = false;
                                            
                                            return inputValues[reportName][testName] &&
                                              Object.keys(inputValues[reportName][testName]).map((date, index) => {
                                                const testData = inputValues[reportName][testName][date];
                                                const refRange = testData?.refRange;
                                    
                                                // If reference range is available and hasn't been rendered yet
                                                if (refRange && refRange.ranges && refRange.ranges.length > 0 && !hasRenderedRefRange) {
                                                  hasRenderedRefRange = true; // Set to true after rendering once
                                                  
                                                  if (refRange.isConditional) {
                                                    // If reference range is conditional (i.e., gender-based)
                                                    const maleRange = refRange.ranges.find(range => range.gender === 'MALE');
                                                    const femaleRange = refRange.ranges.find(range => range.gender === 'FEMALE');
                                                    
                                                    return (
                                                      <div key={index}>
                                                        <strong>Reference Range:</strong>
                                                        {maleRange && femaleRange ? (
                                                          <div>
                                                            <strong>Male:</strong> {`${maleRange.min} - ${maleRange.max} ${maleRange.unit}`} <br />
                                                            <strong>Female:</strong> {`${femaleRange.min} - ${femaleRange.max} ${femaleRange.unit}`}
                                                          </div>
                                                        ) : maleRange ? (
                                                          <div>
                                                            <strong>Male:</strong> {`${maleRange.min} - ${maleRange.max} ${maleRange.unit}`}
                                                          </div>
                                                        ) : femaleRange ? (
                                                          <div>
                                                            <strong>Female:</strong> {`${femaleRange.min} - ${femaleRange.max} ${femaleRange.unit}`}
                                                          </div>
                                                        ) : (
                                                          <div>No reference range available</div>
                                                        )}
                                                      </div>
                                                    );
                                                  } else {
                                                    // If reference range is common for all (i.e., non-conditional)
                                                    const range = refRange.ranges[0];
                                                    return (
                                                      <div key={index}>
                                                        <div>
                                                          <strong>All:</strong> {`${range?.min} - ${range?.max} ${range?.unit}`}
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                }
                                                // Render nothing if reference range has already been rendered
                                                return null;
                                              });
                                          })()}
                                          <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#888' }}>
                                            {`Disclaimer: This range is only for reference and may vary between patients based on different conditions.`}
                                          </div>
                                        </div>
                                      }
                                    overlayClassName="lab-params-tooltip"
                                    overlayInnerStyle={{ padding: '12px', width: '250px',background:"white",color:"black" }} // Adjust styling as necessary
                                >
                                    <i className="icon-info ms-1"
                                        style={{ cursor: "pointer",
                                        color: "#d3d3d3",
                                        fontSize: "18px",
                                        marginBottom: "10px",
                                    }}
                                        >
                                    </i>
                                </Tooltip>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                columnGap: "36px",
                                overflowX: "auto",
                                maxHeight: "220px",
                                "-ms-overflow-style": "none",
                                scrollbarWidth: "none"
                              }}
                              ref={(el) => (scrollRefs.current[index] = el)}
                              onScroll={() => handleScroll(index)}
                            >
                              {dates.map((date) => (
                                <div
                                  key={date}
                                  className="test-values-container"
                                >
                                {testName === "Remarks" ? (
                                    <div>
                                        <div className="remarks-text truncated">
                                            {inputValues[reportName][testName][date]?.value ? (
                                                inputValues[reportName][testName][date]?.value
                                            ) : (
                                                <Button
                                                    className="underline-button"
                                                    onClick={() => handleOpenModal(reportName, testName, date)}
                                                >
                                                    Add Remarks
                                                </Button>
                                            )}
                                        </div>

                                        {isRemarksVisible[reportName]?.[testName]?.[date] && (
                                            <div className="full-remarks-container">
                                                <div className="full-remarks-content">
                                                    {inputValues[reportName][testName][date]?.value}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <Input
                                            style={{
                                                width: "180px",
                                                display: "flex",
                                                alignItems: "center",
                                                borderRadius: "9px",
                                                border: inputValues[reportName][testName][date]?.arrowDirection
                                                    ? "2px solid #E54848" // Red border when up or down arrow
                                                    : "1px solid #d9d9d9", // Default border style
                                                color: inputValues[reportName][testName][date]?.arrowDirection
                                                    ? "#E54848" // Red text when up or down arrow
                                                    : "inherit", // Default text color
                                            }}
                                            type="text"
                                            value={inputValues[reportName][testName][date]?.value || ""}
                                            addonAfter={
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    {/* Show the up or down arrow based on the calculated direction */}
                                                    {inputValues[reportName][testName][date]?.arrowDirection === "up" ? (
                                                        <span style={{ height:"12px",position: "absolute",left: "-46%", zIndex:"1" }}>↑</span>
                                                    ) : inputValues[reportName][testName][date]?.arrowDirection === "down" ? (
                                                        <span style={{position: "absolute",left: "-46%", zIndex:"1" }}>↓</span>
                                                    ) : null}
                                    
                                                    {/* Show units */}
                                                    <span
                                                        style={{
                                                            textAlign: "center",
                                                            overflow: "hidden",
                                                            whiteSpace: "nowrap",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                    >
                                                        {inputValues[reportName][testName][date]?.units || getUnitForTest(reportName, testName)}
                                                    </span>
                                                </div>
                                            }
                                            onChange={(e) => handleInputChange(reportName, testName, date, e.target.value)}
                                        />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
        <CommonModal
            isModalOpen={isModalOpen}
            onCancel={handleCloseModal}
            modalWidth={500}
            title={"Add Remarks"}
            modalBody={
                <>
                    <div className="d-flex align-items-center mt-2 justify-content-end">
                        <textarea
                            className="remarks-textarea"
                            value={modalContent}
                            onChange={(e) => setModalContent(e.target.value)}
                            placeholder="Write your remarks here..."
                            style={{ width: '100%', height: '150px', resize: 'none', overflowY: 'scroll' }}
                        />
                    </div>
                    <div className='d-flex justify-content-end'>
                      <Button onClick={() => {handleSaveRemarks()}} className="lh-lg btn btn-primary3 btn-41 px-4">
                              <span>Save</span>
                      </Button>
                    </div>
                </>
            }
        />
      </div>
    );
};

export default LabResultsTable;