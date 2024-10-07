import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, DatePicker, Input, Tooltip } from 'antd';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';

import moment from "moment";

// Sample Data
const data = {
    results: [
        {
            date: "2024-09-21",
            inputs: [
                { reportName: "Thyroid", name: "Red blood cell count", value: "98.4", unit: "Cells/L", arrowDirection: "up" },
                { reportName: "Complete Blood Count - CBC", name: "Hemoglobin", value: "40", unit: "dl" },
                { reportName: "Complete Blood Count - CBC", name: "Platelet Count", value: "95", unit: "Billion/L", arrowDirection: "down" }
            ]
        },
        {
            date: "2024-10-22",
            inputs: [
                { reportName: "Complete Blood Count - CBC", name: "Hemoglobin", value: "", unit: "dl" },
                { reportName: "Complete Blood Count - CBC", name: "Platelet Count", value: "100", unit: "Billion/L" }
            ]
        },
        {
            date: "2024-09-24",
            inputs: [
                { reportName: "Thyroid-4", name: "Red blood cells", value: "98.4", unit: "Cells/L", arrowDirection: "up" },
                { reportName: "CBC", name: "Hemo", value: "40", unit: "dl" },            ]
        },
    ]
};

const LabResultsTable = ({ data }) => {
    // Helper function to group data by reportName
    const groupByReportName = (data) => {
        const grouped = {};
        data.results.forEach((result) => {
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

    const groupedData = groupByReportName(data);
    const [inputValues, setInputValues] = useState(groupedData);

    const scrollContainerRef = useRef(null);
    const inputRef = useRef([]);
    const [expandedReports, setExpandedReports] = useState({}); // State to manage expansion

    const [dateString, setDateString] = useState(null);
    const dates = [...new Set(data.results.map((result) => result.date))];

    const dateFormat = 'YYYY-MM-DD'
    const showDateFormat = 'DD MMM, YY'

    const toggleReport = (reportName) => {
        setExpandedReports((prev) => ({
            ...prev,
            [reportName]: !prev[reportName], // Toggle the expanded state
        }));
    };

    const handleInputChange = (reportName, testName, date, value) => {
        // Update the value in the state
        setInputValues((prev) => {
            const updatedData = { ...prev };
            if (updatedData[reportName][testName][date]) {
                updatedData[reportName][testName][date].value = value;
            }
            return updatedData;
        });
    };

    // Helper function to find the fallback unit
    const getUnitForTest = (reportName, testName) => {
        for (const date of dates) {
            const unit = inputValues[reportName][testName][date]?.unit;
            if (unit) {
                return unit; // Return the first non-empty unit found
            }
        }
        return ""; // Return empty string if no unit is found
    };

    return (
        <div>
            <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                <div className='align-items-center d-flex'>
                    <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100'>
                        <i className='icon-Cross fs-3'></i>
                    </Button>
                    <div className="modal-title">Add Lab Results</div>
                </div>
                <Button className='btn btn-primary3 btn-41 px-4 me-20' >
                    Save
                </Button>
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
                                                <div key={testName} className='labparam-head'>
                                                    {testName}
                                                </div>
                                                {dates.map((date) => (
                                                    <div key={date} className='test-values-container'>
                                                        <div className='test-value'>
                                                            <Input
                                                                className="inputheight41-group"
                                                                type="text"
                                                                value={inputValues[reportName][testName][date]?.value || ""}
                                                                // Use the current date's unit or fallback to another date's unit
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

export default function App() {
    return (
        <div className="App">
            <LabResultsTable data={data}/>
        </div>
    );
}