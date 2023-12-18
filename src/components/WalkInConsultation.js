import React, { useEffect, useState } from "react";
import { AutoComplete, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import CommonModal from "../common/CommonModal";
import { clearSearch, searchAppointments } from "../redux/appointmentsSlice";

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

export const EmptyPlank = ({ emptyMessage }) => {
  return <div>{emptyMessage}</div>;
};

const PatientPlank = ({ patient, setClickedPatient, setIsModalOpen }) => {
  return (
    <>
      <div
        className="d-flex align-items-center justify-content-between py-3 border-bottom"
        onClick={() => {
          setIsModalOpen();
          setClickedPatient(patient);
        }}
      >
        <div className="d-flex align-items-center">
          <div className="list-patientName d-flex align-items-center me-4">
            <i className="icon-patients backbar me-2"></i>{" "}
            <span>
              {patient.pm_salutation ? patient.pm_salutation : "Mr./Mrs./Miss."}{" "}
              {patient.pm_first_name} {patient.pm_last_name} (
              {patient.pm_gender}, {patient.ageYears})
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
          <Link to="/prescription">
            <Button
              type="text"
              className="btn btn-primary3 align-items-center d-flex"
              icon={<i className="icon-Consult"></i>}
            >
              Start Consult
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

function WalkInConsultation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [searchQuery, setSearchQuery] = useState(null);
  const [clickedPatient, setClickedPatient] = useState(null);
  const { patients, error } = useSelector((state) => state.records);
  const [isModalOpen, setIsModalOpen] = useState("");
  const [options, setOptions] = useState([
    {
      label: <AddPatientPlank />,
    },
  ]);

  console.log("error: ", error);

  const addAddPatientPlank = () => {
    const data = [];
    data.push({
      label: <AddPatientPlank />,
    });
    setOptions(data);
  };
  console.log("patients: ", patients);

  useEffect(() => {
    if (!searchQuery) {
      dispatch(clearSearch());
      addAddPatientPlank();
    } else if (searchQuery && searchQuery.length >= 3) {
      dispatch(searchAppointments(searchQuery));
    }
  }, [dispatch, searchQuery]);

  useEffect(() => {
    const data = [];
    console.log("patients:", patients);
    if (patients) {
      if (patients.length === 0) {
        data.push({
          value: -1,
          label: (
            <>
              <EmptyPlank emptyMessage={error} />
            </>
          ),
        });
      } else {
        patients.map((patient) => {
          return data.push({
            value: patient.patient_unique_id,
            label: (
              <>
                <PatientPlank
                  patient={patient}
                  setClickedPatient={setClickedPatient}
                  setIsModalOpen={setIsModalOpen}
                />
              </>
            ),
          });
        });
      }
    }

    data.push({
      label: <AddPatientPlank />,
    });
    setOptions(data);
  }, [patients]);

  const onSearch = (query) => {
    setValue(query);
    let id = setTimeout(() => {
      setSearchQuery(query);
      clearTimeout(id);
    }, 500);
  };

  return (
    <div className="border rounded-4 appointment-wrap p-4">
      <label className="mb-2"> Enter Patient’s Name, Phone number or Id</label>{" "}
      <br />
      <div className="align-items-center d-flex">
        <AutoComplete
          value={value}
          options={options}
          style={{
            width: "100%",
          }}
          onSearch={onSearch}
          defaultOpen
          autoFocus
          className="autocomplete-custom"
          popupClassName="autocompletepopup"
        >
          <Input
            placeholder="Search by Patient’s Name, Phone number or Id"
            prefix={<i className="icon-search"></i>}
            suffix={
              value.length > 0 && (
                <i className="icon-Cross" onClick={() =>{
                  onSearch(null);
                  setValue("");
                }}></i>
              )
            }
          />
        </AutoComplete>
      </div>
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
                <i className="icon-patients me-2"></i>
                <span>
                  {clickedPatient?.pm_salutation
                    ? clickedPatient?.pm_salutation
                    : "Mr./Mrs./Miss."}{" "}
                  {clickedPatient?.pm_first_name} {clickedPatient?.pm_last_name}{" "}
                  ({clickedPatient?.pm_gender}, {clickedPatient?.ageYears})
                </span>
              </div>
              <div className="mt-2 d-flex align-items-center">
                <i className="icon-phone me-2"></i>{" "}
                <span>{clickedPatient?.pm_contact_no}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <i className="icon-Id me-2"></i>{" "}
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
                    icon={<i className="icon-Preview"></i>}
                  >
                    View Patient Details{" "}
                    <i className="icon-right iconrotate90 ms-auto"></i>
                  </Button>
                </Link>
                <Link to="/prescription" className="w-50">
                  <Button
                    type="text"
                    className="btn btn-primary3 align-items-center d-flex btn-41 w-100"
                    icon={<i className="icon-Consult"></i>}
                  >
                    Start Consult{" "}
                    <i className="icon-right iconrotate90 ms-auto"></i>
                  </Button>
                </Link>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
}
export default WalkInConsultation;
