import { Button, Input } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const LabResultsTable = ({ handleViewLabParamsDrawer, labParamsData, handleSwitchToAddLabParams }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedReports, setExpandedReports] = useState({});
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Toggle report expansion/collapse
    const toggleReport = (reportName) => {
        setExpandedReports((prevState) => ({
            ...prevState,
            [reportName]: !prevState[reportName],
        }));
    };

    // Grouping tests by report name and test name
    const groupedData = {};

    labParamsData?.forEach((report) => {
        report.inputs.forEach((input) => {
            const reportKey = input.reportName;
            const testKey = input.testName;

            if (!groupedData[reportKey]) {
                groupedData[reportKey] = {};
            }

            if (!groupedData[reportKey][testKey]) {
                groupedData[reportKey][testKey] = [];
            }

            groupedData[reportKey][testKey].push({
                date: report.date,
                value: input.value,
                unit: input.units,
            });
        });
    });

    useEffect(() => {
      Object.keys(groupedData)?.map((reportName) => {
        setExpandedReports((prevState) => ({
          ...prevState,
          [reportName]: true,
        }));
      });
    }, [labParamsData]);
    
    // Filter data for search functionality
    const filteredData = labParamsData?.filter((report) =>
        report.inputs.some((input) =>
            input.testName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Handle horizontal scrolling via dragging
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX; // Distance moved
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseLeaveOrUp = () => {
        setIsDragging(false);
    };

    return (
        <div>
            <div className='modalCard-header h-60 align-items-center justify-content-between d-flex' style={{ position: "sticky", top: "0", zIndex: "999" }}>
                <div className='align-items-center d-flex'>
                    <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100' onClick={handleViewLabParamsDrawer} >
                        <i className='icon-Cross fs-3'></i>
                    </Button>
                    <div className="modal-title">Lab Results</div>
                </div>
                <Button className='btn btn-primary3 btn-41 px-4 me-20' onClick={handleSwitchToAddLabParams}>
                    Add/ Edit Parameters
                </Button>
            </div>
            {/* Search Bar */}
            <div className="align-items-center d-flex justify-content-between px-20 py-3 gap-4">
                <Input
                    // value={searchQuery}
                    placeholder="Search by test name or category"
                    className="inputheight38"
                    style={{width:"18rem"}}
                    prefix={<i className="icon-search" />}
                    // suffix={searchQuery.length > 0 && <i className="icon-Cross" onClick={() => onSearch('')}></i>}
                    // onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        
            {/* Table Wrapper */}
            <div style={{ overflowX: 'auto', margin: "8px" }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    {/* Table Header */}
                    <thead style={{ backgroundColor: "#F1F1F5" }}>
                        <tr>
                            <th
                                style={{
                                    position: 'sticky',
                                    left: 0,
                                    background: '#F1F1F5',
                                    width: "23rem",
                                    padding: '10px',
                                    borderTopLeftRadius: "10px",
                                    borderBottomLeftRadius: "10px",
                                    fontWeight: "600",
                                }}
                            >
                                Name
                            </th>
                            {filteredData.map((entry) => (
                                <th
                                    key={entry.date}
                                    style={{
                                        width: '160px',
                                        padding: '10px',
                                        zIndex: "1",
                                        fontWeight: "600",
                                    }}
                                >
                                    {dayjs(entry?.date).format("DD MMM, YY")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <div style={{ height: '10px' }}></div>
        
                    {/* Table Body */}
                    <tbody>
                        {Object.keys(groupedData).length > 0 ? (
                            Object.keys(groupedData).map((reportName, index) => {
                                const isExpanded = expandedReports[reportName];
        
                                return (
                                    <React.Fragment key={index}>
                                        {/* Report Name Row (collapsible) */}
                                        <tr
                                            onClick={() => toggleReport(reportName)}
                                            style={{
                                                cursor: 'pointer',
                                                background: '#FAFAFB',
                                                width: '100%',
                                            }}
                                        >
                                            <td
                                                colSpan={filteredData.length + 1} // Span across all columns
                                                style={{
                                                    position: 'sticky',
                                                    left: 0,  // Set the left position to make it stick on the left
                                                    zIndex: 2, // Ensure it stays above the other rows
                                                    background: "#FAFAFB", // Provide a background so it doesn't overlap
                                                    padding: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    width: "23rem", // Set a fixed width
                                                    borderTopLeftRadius: "10px",
                                                    borderBottomLeftRadius: "10px",
                                                }}
                                            >   
                                                <span>{reportName}</span>
                                                {/* <div style={{position:"absolute",top:"27%",right:"-81%"}}>
                                                    {isExpanded ? (
                                                        <CaretDownOutlined style={{ cursor: 'pointer' }} />
                                                    ) : (
                                                        <CaretRightOutlined style={{ cursor: 'pointer' }} />
                                                    )}
                                                </div> */}
                                            </td>
                                            {filteredData.map((entry, entryIndex) => {
                                                const isLastCell = entryIndex === filteredData.length - 1;
                                                return (
                                                    <td
                                                        key={entry.date}
                                                        style={{
                                                            background: "#FAFAFB",
                                                            width:"160px",
                                                            padding: '10px',
                                                            textAlign: 'right', // Right align the icon for the last cell
                                                            borderTopRightRadius: isLastCell ? "10px" : " ",
                                                            borderBottomRightRadius: isLastCell ? "10px" : " ",
                                                        }}
                                                    >
                                                
                                                    </td>
                                                );
                                            })}
                                        </tr>

                                        {!isExpanded  && <div style={{ height: '10px' }}></div>}
        
                                        {/* Test Rows (expandable) */}
                                        {isExpanded &&
                                            Object.keys(groupedData[reportName]).map((testName, testIndex) => (
                                                <>
                                                    <tr key={testIndex}>
                                                        <td
                                                            style={{
                                                                position: 'sticky',
                                                                left: 0,
                                                                background: '#fff',
                                                                width: "23rem",
                                                                padding: '10px',
                                                                borderRight: '1px solid #ddd',
                                                            }}
                                                        >
                                                            {testName}
                                                        </td>
                                                        <td colSpan={filteredData.length} style={{ padding: 0 }}>
                                                            <div
                                                                ref={scrollRef}
                                                                onMouseDown={handleMouseDown}
                                                                onMouseLeave={handleMouseLeaveOrUp}
                                                                onMouseUp={handleMouseLeaveOrUp}
                                                                onMouseMove={handleMouseMove}
                                                                style={{
                                                                    display: 'flex',
                                                                    overflowX: 'auto',
                                                                    cursor: isDragging ? 'grabbing' : 'grab',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                {filteredData.map((entry) => {
                                                                    const testOnDate =
                                                                        groupedData[reportName][testName].find(
                                                                            (t) => t.date === entry.date
                                                                        );
            
                                                                    return (
                                                                        <div
                                                                            key={entry.date}
                                                                            style={{
                                                                                width:"160px",
                                                                                borderRight: '1px solid #ddd',
                                                                                padding: '10px',
                                                                                background: 'white',
                                                                                fontWeight: "400",
                                                                            }}
                                                                        >
                                                                            {testOnDate
                                                                                ? `${testOnDate.value} ${testOnDate.unit}`
                                                                                : '-'}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </>
                                        ))}
                                        <div style={{ height: '10px' }}></div>
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={filteredData.length + 1}>No results found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LabResultsTable;


