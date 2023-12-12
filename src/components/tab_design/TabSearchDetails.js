import React from "react";
import { Input, Segmented } from 'antd';

function TabSearchDetails() {
    // Segnment
    const segmentedList = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: 6, label: <Input className="w-100 segment-input" placeholder="Custom" /> },
    ];
    const segmentedSeverityList = [
        { value: 'severe', label: 'Severe' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'mild', label: 'Mild' },
    ];
    const segmentedTimeList = [
        { value: 'hour', label: '1H' },
        { value: 'day', label: '1D' },
        { value: 'Week', label: '1W' },
        { value: 'month', label: '1M' },
        { value: 'year', label: '1Y' },
    ];

    return (
        <div className="p-4">
            <div>
                <label className="title-common">
                    Since
                </label>
                <Segmented
                    className="search-segment"
                    options={segmentedList}
                />
            </div>
            <div className="mt-3">
                <Segmented
                    className="search-segment"
                    options={segmentedTimeList}
                />
            </div>
            <div className="mt-5">
                <label className="title-common">
                    Severity
                </label>
                <Segmented
                    className="search-segment"
                    options={segmentedSeverityList}
                />
            </div>
            <div className="mt-5">
                <label className="title-common">
                    Add Details
                </label>
                <Input.TextArea placeholder="Enter any specific details here" className="textareaPlaceholder" rows={3} />
            </div>
        </div>
    );
}

export default TabSearchDetails;
