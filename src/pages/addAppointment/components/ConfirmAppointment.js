import React, { useEffect, useState, useCallback, useMemo } from "react";
import { AutoComplete, Button, Col, Input, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearSearch, listCategories, searchPatients } from "../../../redux/appointmentsSlice";
import { isAlphabet, isNumeric } from "../../../utils/utils";

function ConfirmAppointment({ handleConfirmAppointment, clickedPatient, setClickedPatient }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { patients, error, caseTypes, categoriesList } = useSelector((state) => state.records);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchOptions, setSearchOptions] = useState([]);

    const [selectedCashType, setSelectedCashType] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(null);

    useEffect(() => {
        dispatch(listCategories())
        if (searchQuery) {
            const timeOutId = setTimeout(() => {
                dispatch(searchPatients({ searchQuery: searchQuery, company: "" }));
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
                    label: <div>{error}</div>,
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
        data.push({
            key: -1,
            value: "Add New Patient",
            label: AddPatientPlank(),
        });
        setSearchOptions(data);
    }, [patients]);

    const onSearchParent = useCallback(
        (query) => {
            setSearchQuery(query);
        },
        [searchQuery]
    );

    const BoldWordInName = ({ name, boldWord }) => {
        const parts = name.split(new RegExp(`(${boldWord})`, "i"));
        const formattedName = parts.map((part, index) => {
            if (part.toLowerCase() === boldWord.toLowerCase()) {
                return (
                    <span key={index} className="fw-medium">
                        {part}
                    </span>
                );
            } else {
                return <span key={index}>{part}</span>;
            }
        });

        return formattedName;
    };

    const PatientPlank = (patient) => {
        return (
            <>
                <div className="d-flex align-items-center" onClick={() => setClickedPatient(patient)}>
                    <div className="list-patientName d-flex align-items-center me-4">
                        <i className="icon-patients backbar me-2"></i>{" "}
                        <span>
                            {patient.pm_salutation && patient.pm_salutation}{" "}
                            <BoldWordInName
                                name={patient.pm_fullname}
                                boldWord={searchQuery}
                            />{" "}
                        </span>
                    </div>
                    <div className="list-patientName d-flex align-items-center me-4">
                        <i className="icon-phone backbar me-2"></i>
                        <BoldWordInName
                            name={patient.pm_contact_no}
                            boldWord={searchQuery}
                        />
                    </div>
                    <div className="list-patientName d-flex align-items-center me-4">
                        <i className="icon-Id backbar me-2"></i>
                        <BoldWordInName name={patient.pm_pid} boldWord={searchQuery} />
                    </div>
                </div>
            </>
        );
    };

    const AddPatientPlank = () => {
        return (
            <Button
                type="text"
                className="btn btn-primary1 btn-41 align-items-center d-flex"
                icon={<i className="icon-Add"></i>}
                onClick={goToAddPatient}
            >
                Add New Patient
            </Button>
        );
    };

    function goToAddPatient() {
        if (searchQuery.length === 10 && isNumeric(searchQuery)) {
            navigate("/add_patient", { state: { patient_data: { pm_fullname: '', pm_contact_no: searchQuery }, from: 'add-appointment' } });
        } else if (searchQuery.length > 0 && isAlphabet(searchQuery)) {
            navigate("/add_patient", { state: { patient_data: { pm_fullname: searchQuery, pm_contact_no: '' }, from: 'add-appointment' } });
        } else {
            navigate("/add_patient", { state: { from: '/add-appointment' } });
        }
    }


    const onSelectCaseType = useCallback(
        (data, e) => {
            setSelectedCashType(e.key);
        },
        [selectedCashType]
    );

    const onSelectCategories = useCallback(
        (data, e) => {
            setSelectedCategories(e.key);
        },
        [selectedCategories]
    );

    return (
        <div className="bg-white h-100 p-20">
            <div className="d-flex align-items-center rounded-10px mb-4" style={{ backgroundColor: '#F2F4F7' }}>
                <i className="bg-custom-purple fs-4 rounded-start-3 icon-patients p-3 text-primary"></i>
                <div className="flex-grow-1 py-3 px-2 text-truncate fw-semibold fs-16">Dr. Mihir Behara</div>
                <i className="text-primary icon-Edit cursor-pointer p-3" onClick={handleConfirmAppointment}></i>
            </div>
            <div className="d-flex align-items-center rounded-10px mb-4" style={{ backgroundColor: '#F2F4F7' }}>
                <i className="icon-Queue text-primary rounded-start-3 p-3 bg-custom-purple"></i>
                <div className="flex-grow-1 py-3 px-2 text-truncate fw-semibold fs-16">07:15 PM (Today) <span className="fw-normal"> | 08th Feb 2024 </span> </div>
                <i className="icon-Edit text-primary cursor-pointer p-3" onClick={handleConfirmAppointment}></i>
            </div>

            <div className='mb-4'>
                <label className="mb-2">
                    Patient Name, Mobile no & ID <sup className="text-danger-custom">*</sup>
                </label>
                <br />
                {clickedPatient ? (
                    <div className="d-flex align-items-center border py-2 px-3 rounded-10px" onClick={() => setClickedPatient(null)}>
                        <div className="d-flex align-items-center me-4">
                            <i className="icon-patients backbar me-2"></i>{" "}
                            <span className="fw-medium lh-1">{clickedPatient?.pm_salutation} {clickedPatient?.pm_fullname}</span>
                        </div>
                        <div className="d-flex align-items-center me-4">
                            <i className="icon-phone backbar me-2"></i>
                            <span className="fw-medium lh-1">{clickedPatient?.pm_contact_no}</span>
                        </div>
                        <div className="d-flex align-items-center me-4">
                            <i className="icon-Id backbar me-2"></i>
                            <span className="fw-medium lh-1">{clickedPatient?.pm_pid}</span>
                        </div>
                    </div>
                ) : (
                    <div className="align-items-center d-flex position-relative">
                        <AutoComplete
                            value={searchQuery}
                            onSearch={onSearchParent}
                            options={searchOptions}
                            className='w-100 autocomplete-custom'
                            popupClassName='walkincomplete'
                        >
                            <Input
                                placeholder="Search by Patient’s Name, Phone number or Id"
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
                    </div>
                )}
            </div>

            <Row gutter={20} className="mb-4">
                <Col span={12}>
                    <label className="d-block mb-2">Case Type<sup className="text-danger-custom">*</sup></label>
                    <Select
                        className="autocomplete-custom w-100"
                        placeholder="Select Case Type"
                        options={caseTypes?.map((item) => {
                            return {
                                key: JSON.stringify(item),
                                value: item.toct_id,
                                label: (
                                    <div key={item.toct_id}>
                                        {item.toct_type}
                                    </div>
                                ),
                            };
                        })}
                        value={selectedCashType && JSON.parse(selectedCashType).toct_id}
                        onSelect={onSelectCaseType}
                    />
                </Col>
                <Col span={12}>
                    <label className="d-block mb-2">Category</label>
                    <Select
                        className="autocomplete-custom w-100"
                        placeholder="Select Category"
                        options={categoriesList?.map((item) => {
                            return {
                                key: JSON.stringify(item),
                                value: item.pt_id,
                                label: (
                                    <div key={item.pt_id}>
                                        {item.pt_name}
                                    </div>
                                ),
                            };
                        })}
                        value={selectedCategories && JSON.parse(selectedCategories).pt_id}
                        onSelect={onSelectCategories}
                    />
                </Col>
            </Row>
            <label className="d-block mb-2">Remarks for Receptionist</label>
            <Input.TextArea placeholder="Write your remarks" className="textareaPlaceholder fontroboto text-main" rows={3} />
        </div>
    )
}

export default ConfirmAppointment