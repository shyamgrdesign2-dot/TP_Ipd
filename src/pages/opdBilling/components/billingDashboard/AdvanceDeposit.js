import React, { useState, useCallback, useEffect } from "react";
// import { Dropdown, Menu, Checkbox, Button } from "antd";
import { Select, Checkbox, Row, Col, Input } from "antd";

const { Option } = Select;

const doctorsList = [
  { id: 1, name: "Doctor 1" },
  { id: 2, name: "Doctor 2" },
  { id: 3, name: "Doctor 3" },
  { id: 4, name: "Doctor 4" },
];

export default function AdvanceDeposit() {
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [pageNo, setPageNo] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState(1);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDoctors(doctorsList.map((doctor) => doctor.id));
    } else {
      setSelectedDoctors([]);
    }
    setSelectAll(checked);
  };

  const handleDoctorSelection = (doctorId, checked) => {
    if (checked) {
      setSelectedDoctors([...selectedDoctors, doctorId]);
    } else {
      setSelectedDoctors(selectedDoctors.filter((id) => id !== doctorId));
    }
    setSelectAll(false); // Uncheck "All Doctors" if any specific doctor is selected
  };

  const onSearch = useCallback(
    (query) => {
      setPageNo(0);
      setSearchQuery(query);
    },
    [searchQuery]
  );

  return (
    <div>
      <div className="appointment-data billing-table-wrapper">
        <Row className="justify-content-between align-items-center my-3 px-4">
          <Col xl={7} sm={5}>
            <Input
              value={searchQuery}
              placeholder="Search by patient name / phone no / bill no"
              className="inputheight38"
              prefix={<i className="icon-search" />}
              suffix={
                searchQuery.length > 0 && (
                  <i className="icon-Cross" onClick={() => onSearch("")}></i>
                )
              }
              onChange={(e) => onSearch(e.target.value)}
            />
          </Col>
          <Col xl={3}>
            <div className="d-flex align-items-center">
              <Select
                dropdownRender={(menu) => (
                  <div>
                    {/* All Doctors Option */}
                    <div style={{ padding: "8px" }}>
                      <Checkbox
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      >
                        All Doctors
                      </Checkbox>
                    </div>
                    <div
                      style={{
                        borderBottom: "1px solid #e8e8e8",
                        margin: "8px 0",
                      }}
                    />
                    {/* Custom Doctors */}
                    <div
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        padding: "8px",
                      }}
                    >
                      {doctorsList.map((doctor) => (
                        <div key={doctor.id} style={{ padding: "4px 0" }}>
                          <Checkbox
                            checked={selectedDoctors.includes(doctor.id)}
                            onChange={(e) =>
                              handleDoctorSelection(doctor.id, e.target.checked)
                            }
                          >
                            {doctor.name}
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                value={
                  selectAll
                    ? "All Doctors"
                    : `Selected (${selectedDoctors.length})`
                }
                style={{ width: "100%" }}
              >
                {/* Empty Option for Placeholder */}
                <Option value="placeholder" disabled>
                  Select Doctors
                </Option>
              </Select>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
