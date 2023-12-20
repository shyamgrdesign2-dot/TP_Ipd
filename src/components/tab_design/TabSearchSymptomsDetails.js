import React, { useState, useEffect, useCallback } from "react";
import { Input, Segmented } from 'antd';

function TabSearchSymptomsDetails({ childData }) {

    const SINCE_OPTIONS = ["Hour", "Day", "Week", "Month", "Year"];
    const [inputSince, setInputSince] = useState('');
    const [since, setSince] = useState(null);
    const [sinceOptions, setSinceOptions] = useState([]);

    useEffect(() => {
        return () => {
            console.log('hello')
        }
    }, []);

    useEffect(() => {
        const options = SINCE_OPTIONS.map((option) => {
            return {
                key: Math.random(),
                value: `${1} ${option}`,
                label: <>{`${1} ${option}`}</>,
            };
        });
        setSinceOptions(options);
    }, []);

    const onChangeInputSinceChild = useCallback(
        (e) => {
            setInputSince(e.target.value);
            if (e.target.value.length > 0) {
                const options = SINCE_OPTIONS.map((option) => {
                    return {
                        key: Math.random(),
                        value: `${e.target.value} ${option}`,
                        label: <>{`${e.target.value} ${option}`}</>,
                    };
                });
                setSinceOptions(options);
            } else {
                const options = SINCE_OPTIONS.map((option) => {
                    return {
                        key: Math.random(),
                        value: `${option}`,
                        label: <>{`${option}`}</>,
                    };
                });
                setSinceOptions(options);
            }
        },
        [inputSince, sinceOptions]
    );

    const SINCE_LIST = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: -1, label: <Input className="w-100 segment-input" placeholder="Custom" onChange={onChangeInputSinceChild} onClick={() => onChangeSegmentedSinceChild(-1)} /> }
    ];

    const SEVERITY_LIST = [
        { value: "severe", label: "Severe" },
        { value: "moderate", label: "Moderate" },
        { value: "mild", label: "Mild" },
    ];

    const onChangeSegmentedSinceChild = useCallback(
        (key) => {

            if (key != -1) {
                const options = SINCE_OPTIONS.map((option) => {
                    return {
                        key: Math.random(),
                        value: `${key} ${option}`,
                        label: <>{`${key} ${option}`}</>,
                    };
                });
                setSinceOptions(options);
            } else if (inputSince.length > 0) {
                const options = SINCE_OPTIONS.map((option) => {
                    return {
                        key: Math.random(),
                        value: `${inputSince} ${option}`,
                        label: <>{`${inputSince} ${option}`}</>,
                    };
                });
                setSinceOptions(options);
            } else {
                const options = SINCE_OPTIONS.map((option) => {
                    return {
                        key: Math.random(),
                        value: `${option}`,
                        label: <>{`${option}`}</>,
                    };
                });
                setSinceOptions(options);
            }
        },
        [sinceOptions]
    );

    const onChangeSinceChild = useCallback(
        (key) => {
            setSince(key)
        },
        [since]
    );


    return (
        <div className="p-4">
            <div>
                <label className="title-common">
                    Since
                </label>
                <Segmented

                    className="search-segment"
                    options={SINCE_LIST}
                    onChange={onChangeSegmentedSinceChild}
                />
            </div>
            <div className="mt-3">
                <Segmented
                    value={since}
                    className="search-segment"
                    options={sinceOptions}
                    onChange={onChangeSinceChild}
                />
            </div>
            <div className="mt-5">
                <label className="title-common">
                    Severity
                </label>
                <Segmented
                    className="search-segment"
                    options={SEVERITY_LIST}
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

export default React.memo(TabSearchSymptomsDetails);
