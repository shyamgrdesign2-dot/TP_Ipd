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
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

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
    const [showEditTooltip, setShowEditTooltip] = useState(false);
    const scrollContainerRef = useRef(null);
    const inputRef = useRef([]);
    const scrollRefs = useRef([]);
    const remarksRef = useRef(null);

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

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const toggleReport = (reportName) => {
        setExpandedReports((prev) => ({
            ...prev,
            [reportName]: !prev[reportName],
        }));
    };

    const handleClickOutside = (event) => {
      if (!remarksRef?.current?.contains(event.target)) {
        setShowEditTooltip(false);
      }
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
            selectedRange = refRange.ranges.find(range => range.gender === gender) || refRange.ranges?.[0];
        } else {
            selectedRange = refRange?.ranges?.[0]; // Single range case
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

    function replaceDateByIndex(
      inputValues,
      dateIndex,
      newDate
    ) {
      const updatedValues = { ...inputValues };

      Object.keys(updatedValues).forEach((reportName) => {
        Object.keys(updatedValues[reportName]).forEach((testName) => {
          const testData = updatedValues[reportName][testName];
          const dateKeys = Object.keys(testData);

          if (dateIndex >= 0 && dateIndex < dateKeys.length) {
            const oldDate = dateKeys[dateIndex];
            testData[newDate] = testData[oldDate];
            delete testData[oldDate];
          } else {
            console.warn(`Date index "${dateIndex}" is out of bounds.`);
          }
        });
      });

      return updatedValues;
    }

    const handleDateChange = (newDate, index) => {
        setDates((prevDates) => {
            const updatedDates = [...prevDates];
            updatedDates[index] = newDate;
            return updatedDates;
        });
        setInputValues((prev) => {
            const updatedData = replaceDateByIndex(prev, index, newDate);
            return updatedData;
        });
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
                    refRange: updatedData?.[reportName]?.[testName]?.[date]?.refRange || "",
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
        return "--";
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
                const updatedValues = JSON.parse(JSON.stringify(prevInputValues)); // Deep clone the previous state

                // Iterate over each reportName and testName to add the new date
        Object.keys(updatedValues).forEach((reportName) => {
          Object.keys(updatedValues[reportName]).forEach((testName) => {
                        if (!updatedValues[reportName][testName][date]) {
                            // Find the previous available refRange (if any)
                            const previousDates = Object.keys(updatedValues[reportName][testName]);
                            const lastDateWithRefRange = previousDates
                                .sort((a, b) => new Date(b) - new Date(a)) // Sort dates descending
                                .find((prevDate) => updatedValues[reportName][testName][prevDate]?.refRange); // Find the latest refRange
    
                            const refRangeFromPrevious = lastDateWithRefRange
                                ? updatedValues[reportName][testName][lastDateWithRefRange]?.refRange
                                : "";
    
                            updatedValues[reportName][testName][date] = {
                                reportName: reportName,
                                testName: testName,
                                value: "", // Initialize empty value
                                units: getUnitForTest(reportName, testName),
                                arrowDirection: "",
                                refRange: refRangeFromPrevious, // Use the refRange from the last available date or default
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

        const currentFilledData = assemblePayload(inputValues);
        const data = combineData(currentFilledData,filledData);
        setFilledData(data)
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
    const tooltipTitle = (notes, reportName, testName, date) => {
      return (
        <div
          className="d-flex justify-content-between flex-column h-100 w-100"
          ref={remarksRef}
        >
          <div className='h-80' style={{overflow:'auto'}}>{notes}</div>
          <div
            className="d-flex"
            onClick={() => handleOpenModal(reportName, testName, date)}
          >
            <img className="me-3" style={{cursor:'pointer'}} src={editIcon} alt="edit" />
            <div className="lab-params-tooltip-txt">Edit Remark</div>
          </div>
        </div>
      );
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
            <table className="labparam-table" style={{ tableLayout: "fixed", width: "100%"}}>
                <thead>
                <tr style={{padding: "0 0.75rem",background: "#efefef"}}>
                    <th className="labparam-head" style={{ paddingLeft:"17px", width: "280px", position: "sticky", left: 0, zIndex: 2 }}> {/* Set a fixed width here */}
                        <span>Name</span>
                    </th>
                    {dates.map((date, index) => (
                      <th key={date} className="date-values" style={{ padding:"10px",}}>
                          <span>{moment(date).format(showDateFormat)}</span>
                          <Tooltip
                          trigger={"click"}
                          placement="bottom"
                          title={
                              <>
                              <div className="tooltip-content">
                                  <img className="me-2" src={editIcon} alt="Edit" />
                                  <span>Edit Date</span>
                                  <DatePicker
                                  key={Math.random()}
                                  suffixIcon={null}
                                  inputReadOnly
                                  onChange={(date, dateString) => handleDateChange(dateString, index)}
                                  disabledDate={disabledDate}
                                  className="calender-labparams"
                                  />
                              </div>
                              <div className="tooltip-content" onClick={() => handleDeleteDate(date)}>
                                  <DeleteOutlined className="delete-icon" />
                                  <span>Delete</span>
                              </div>
                              </>
                          }
                          overlayClassName="custom-tooltip"
                          >
                          <EllipsisOutlined className="vertical-dots" style={{ fontSize: "16px" }} />
                          </Tooltip>
                      </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {Object.keys(inputValues).map((reportName) => (
                    <>
                    {/* Report Name Row */}
                    <tr
                        key={reportName}
                        className="test-parameters-header"
                        onClick={() => toggleReport(reportName)}
                    >
                        <td className="labparam-title" style={{ width: "auto", position: "sticky", left: 0, zIndex: 2 }}> {/* Match this width to the header */}
                        <span>{reportName}</span>
                        {testCounts[reportName] > 0 && <span> ({testCounts[reportName]})</span>}
                        {!!expandedReports[reportName] ? (
                            <button className="btn p-0 ms-2 iconrotate270" style={{ position: "absolute", left: "760px"}}>
                              <i className="icon-right fs-5" />
                            </button>
                        ) : (
                            <button className="btn p-0 ms-2 iconrotate180" style={{ position: "absolute", left: "760px"}}>
                              <i className="icon-right fs-5" />
                            </button>
                        )}
                        </td>
                        {dates.map((date) => (
                        <td key={date}></td>
                        ))}
                    </tr>
                    {/* <div style="height: 15px;"></div> */}
                    {/* Test Name and Test Values Rows */}
                    {expandedReports[reportName] &&
                        Object.keys(inputValues[reportName]).map((testName, index) => (
                        <tr key={testName} className="test-values-row">
                            {/* Test Name Column */}
                            <td className="labparam-title sticky-testname" style={{ width: 280, position: "sticky", left: 0, background: "#fff", zIndex: 2 }}>
                              <div style={{width:"280px", position: "sticky", left: "0px"}}>
                                  {testName}
                                  {testName !== "Remarks" && (
                                  <Tooltip
                                      placement="bottom"
                                      title={
                                      <div className="ref-range-tooltip">
                                          {/* Logic for rendering the reference range */}
                                          {(() => {
                                          let hasRenderedRefRange = false;
                                          return inputValues[reportName][testName] &&
                                              Object.keys(inputValues[reportName][testName]).map((date, index) => {
                                              const testData = inputValues[reportName][testName][date];
                                              const refRange = testData?.refRange;

                                              if (refRange && refRange.ranges && refRange.ranges.length > 0 && !hasRenderedRefRange) {
                                                  hasRenderedRefRange = true;
                                                  if (refRange.isConditional) {
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
                                                  const range = refRange.ranges[0];
                                                  return (
                                                      <div key={index}>
                                                      <strong>All:</strong> {`${range?.min} - ${range?.max} ${range?.unit}`}
                                                      </div>
                                                  );
                                                  }
                                              }
                                              return null;
                                              });
                                          })()}
                                          <div className="disclaimer-text">
                                          {`Disclaimer: This range is only for reference and may vary between patients based on different conditions.`}
                                          </div>
                                      </div>
                                      }
                                      overlayClassName="lab-params-tooltip"
                                      overlayInnerStyle={{ padding: '12px', width: '250px', background: "white", color: "black" }}
                                  >
                                      <i
                                      className="icon-info ms-1"
                                      style={{ cursor: "pointer", color: "#d3d3d3", fontSize: "18px", marginBottom: "10px" }}
                                      ></i>
                                  </Tooltip>
                                  )}
                              </div>
                            </td>

                            {/* Test Value Columns (aligned with date columns in <thead>) */}
                            {dates.map((date) => (
                            <td key={date} className="test-values-container">
                                {testName === "Remarks" ? (
                                <div>
                                    {inputValues[reportName][testName][date]?.value ? (
                                    <Tooltip
                                        title={tooltipTitle(inputValues?.[reportName]?.[testName]?.[date]?.value, reportName, testName, date)}
                                        overlayClassName="customTooltip"
                                        open={showEditTooltip}
                                        placement="top"
                                    >
                                        <div onClick={() => setShowEditTooltip(true)}>
                                        <div className="remarks-text truncated">
                                            {inputValues[reportName][testName][date]?.value}
                                        </div>
                                        <span style={{ fontWeight: 500, color: "#171725", textDecoration: "underline", cursor: "pointer" }}>View Remarks</span>
                                        </div>
                                    </Tooltip>
                                    ) : (
                                    <Button className="remarks-btn" onClick={() => handleOpenModal(reportName, testName, date)}>
                                        <span className="underline-button" >Add Remarks</span>
                                    </Button>
                                    )}
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
                                        color: inputValues[reportName][testName][date]?.arrowDirection ? "#E54848" : "inherit",
                                    }}
                                    type="text"
                                    className={`lab-params-input ${inputValues[reportName][testName][date]?.arrowDirection ? "lab-params-input-warning" : ""}`}
                                    suffix={
                                        <div className="d-flex justify-content-between w-100">
                                        <span>{inputValues[reportName][testName][date]?.value || ""}</span>
                                        {inputValues[reportName][testName][date]?.arrowDirection === "up" ? (
                                            <ArrowUpOutlined className="lab-params-warning" style={{ paddingLeft: 5 }} />
                                        ) : inputValues[reportName][testName][date]?.arrowDirection === "down" ? (
                                            <ArrowDownOutlined className="lab-params-warning" style={{ paddingLeft: 5 }} />
                                        ) : null}
                                        </div>
                                    }
                                    addonAfter={
                                        <div style={{ display: "flex", alignItems: "center" }}>
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
                            </td>
                            ))}
                        </tr>
                        ))}
                    </>
                ))}
                </tbody>
            </table>
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