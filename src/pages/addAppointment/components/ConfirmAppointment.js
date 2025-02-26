import { Col, Input, Row, Select } from "antd";
import React from "react";

function ConfirmAppointment() {
    return (
        <div className="bg-white h-100 p-20">
            <div className="d-flex align-items-center rounded-10px mb-4" style={{ backgroundColor: '#F2F4F7' }}>
                <i className="bg-custom-purple fs-4 icon-patients p-3 text-primary"></i>
                <div className="flex-grow-1 py-3 px-2 text-truncate fw-semibold fs-16">Dr. Mihir Behara</div>
                <i className="text-primary icon-Edit cursor-pointer p-3"></i>
            </div>
            <div className="d-flex align-items-center rounded-10px mb-4" style={{ backgroundColor: '#F2F4F7' }}>
                <i className="icon-Queue text-primary p-3 bg-custom-purple"></i>
                <div className="flex-grow-1 py-3 px-2 text-truncate fw-semibold fs-16">07:15 PM (Today) <span className="fw-normal"> | 08th Feb 2024 </span> </div>
                <i className="icon-Edit text-primary cursor-pointer p-3"></i>
            </div>

            <div className="d-flex align-items-center border py-2 px-3 rounded-10px mb-4">
                <div className="d-flex align-items-center me-4">
                    <i className="icon-patients backbar me-2"></i>{" "}
                    <span className="fw-medium lh-1"> Rahul Sharma </span>
                </div>
                <div className="d-flex align-items-center me-4">
                    <i className="icon-phone backbar me-2"></i>
                    <span className="fw-medium lh-1">7894561230</span>
                </div>
                <div className="d-flex align-items-center me-4">
                    <i className="icon-Id backbar me-2"></i>
                    <span className="fw-medium lh-1">PI202306001</span>
                </div>
            </div>

            <Row gutter={20} className="mb-4">
                <Col span={12}>
                    <label className="d-block mb-2">Case Type<sup className="text-danger-custom">*</sup></label>
                    <Select
                        className="autocomplete-custom w-100"
                        placeholder="Select Case Type"
                        options={[]}
                        value={null}
                    // onSelect={(e) => onSelect(e, 'start_year', i)}
                    />
                </Col>
                <Col span={12}>
                    <label className="d-block mb-2">Category</label>
                    <Select
                        className="autocomplete-custom w-100"
                        placeholder="Select Category"
                        options={[]}
                        value={null}
                    // onSelect={(e) => onSelect(e, 'start_year', i)}
                    />
                </Col>
            </Row>
            <label className="d-block mb-2">Remarks for Receptionist</label>
            <Input.TextArea placeholder="Write your remarks" className="textareaPlaceholder fontroboto text-main" rows={3} />
        </div>
    )
}

export default ConfirmAppointment