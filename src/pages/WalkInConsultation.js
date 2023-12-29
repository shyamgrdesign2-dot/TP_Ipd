import React, { useEffect, useState, useCallback, useMemo } from "react";
import { AutoComplete, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { isMobile } from "react-device-detect";

import TabHeader from "../components/tab_design/TabHeader";
import CommonModal from "../common/CommonModal";
import { clearSearch, searchPatients } from "../redux/appointmentsSlice";

function WalkInConsultation() {
  const navigate = useNavigate();
  const { patients, error } = useSelector((state) => state.records);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const [clickedPatient, setClickedPatient] = useState(null);

  const PatientPlank = (patient) => {
    return (
      <>
        <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
          <div className="d-flex align-items-center">
            <div className="list-patientName d-flex align-items-center me-4">
              <i className="icon-patients backbar me-2"></i>{" "}
              <span>
                {patient.pm_salutation && patient.pm_salutation}{" "}
                {patient.pm_first_name} {patient.pm_last_name} (
                {patient.pm_gender}, {patient.ageYears}y)
              </span>
            </div>
            <div className="list-patientName d-flex align-items-center me-4">
              <i className="icon-phone backbar me-2"></i>
              <span>{patient.pm_contact_no}</span>
            </div>
            <div className="list-patientName d-flex align-items-center me-4">
              <i className="icon-Id backbar me-2"></i>
              <span>{patient.patient_unique_id}</span>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <Link to="/patient_details">
              <Button
                type="text"
                className="btn btn-primary2 me-4 align-items-center d-flex"
                icon={<i className="icon-Preview"></i>}
              >
                Patient Details
              </Button>
            </Link>
            <Button
              type="text"
              className="btn btn-primary3 align-items-center d-flex"
              icon={<i className="icon-Consult"></i>}
              onClick={() => navigate("/prescription", { state: patient })}
            >
              Start Consult
            </Button>
          </div>
        </div>
      </>
    );
  };

  const AddPatientPlank = () => {
    return (
      <Link to="/add_new_patient">
        <Button
          type="text"
          className="btn btn-primary1 btn-41 align-items-center d-flex"
          icon={<i className="icon-Add"></i>}
        >
          Add New Patient
        </Button>
      </Link>
    );
  };

  useEffect(() => {
    if (searchQuery) {
      const timeOutId = setTimeout(() => {
        dispatch(searchPatients(searchQuery));
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
          key: "-2",
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
    if (!isMobile) {
      data.push({
        key: "-1",
        value: "Add New Patient",
        label: AddPatientPlank(),
      });
    }
    setSearchOptions(data);
  }, [patients]);

  const onSearchParent = useCallback(
    (query) => {
      setSearchQuery(query);
    },
    [searchQuery]
  );

  const onSelect = useCallback(
    (data, e) => {
      e.key != -1
        ? setClickedPatient(JSON.parse(e.key))
        : navigate("/add_new_patient");
    },
    [clickedPatient]
  );

  const COMMON_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={clickedPatient != null}
        modalWidth={610}
        title={"Patient Selected"}
        onCancel={() => {
          setClickedPatient(null);
        }}
        modalBody={
          <>
            <div className="border bg-body rounded-10px p-2 patient-details">
              <div className="d-flex align-items-center">
                <i className="icon-patients me-2" />
                <span>
                  {clickedPatient?.pm_salutation
                    ? clickedPatient?.pm_salutation
                    : "Mr./Mrs./Miss."}{" "}
                  {clickedPatient?.pm_first_name} {clickedPatient?.pm_last_name}{" "}
                  ({clickedPatient?.pm_gender}, {clickedPatient?.ageYears}y)
                </span>
              </div>
              <div className="mt-2 d-flex align-items-center">
                <i className="icon-phone me-2" />{" "}
                <span>{clickedPatient?.pm_contact_no}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <i className="icon-Id me-2" />{" "}
                <span>{clickedPatient?.patient_unique_id}</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="title-common">Choose Action</span>
              <div className="d-flex align-items-center mt-2">
                <Link to="/patient_details" className="me-4 w-50">
                  <Button
                    type="text"
                    className="btn btn-primary2 align-items-center d-flex btn-41 w-100"
                    icon={<i className="icon-Preview" />}
                  >
                    View Patient Details{" "}
                    <i className="icon-right iconrotate90 ms-auto" />
                  </Button>
                </Link>
                <Button
                  type="text"
                  className="btn btn-primary3 align-items-center d-flex btn-41 w-100"
                  icon={<i className="icon-Consult"></i>}
                  onClick={() =>
                    navigate("/prescription", { state: clickedPatient })
                  }
                >
                  Start Consult{" "}
                  <i className="icon-right iconrotate90 ms-auto"></i>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [clickedPatient]);

  return (
    <>
      {isMobile && <TabHeader flag={1} title="Start Walk-in Consultation" />}
      <div
        className={`${!isMobile && "border rounded-4 appointment-wrap"} p-4`}
      >
        <label className="mb-2">
          {" "}
          Enter Patient’s Name, Phone number or Id
        </label>{" "}
        <br />
        <div className="align-items-center d-flex">
          <AutoComplete
            value={searchQuery}
            onSearch={onSearchParent}
            options={searchOptions}
            className="autocomplete-custom w-100"
            onSelect={onSelect}
            defaultActiveFirstOption={true}
            defaultOpen
            autoFocus
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

          {COMMON_MODAL}
        </div>
      </div>
    </>
  );
}
export default WalkInConsultation;
