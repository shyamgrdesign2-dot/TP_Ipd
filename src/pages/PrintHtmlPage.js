import React from "react";
import PrintHeaderImage from "../assets/images/print-header.png";
import { Flex, Col } from "antd";
import '../assets/scss/print.scss';

function PrintHtmlPage() {
    return (
        <>
            {/* Header */}
            <div className="pb-4 print-custom-header border-bottom">
                {/* For Upload Image Header */}
                <img className="img-fluid" src={PrintHeaderImage} alt="Header" />

                {/* Print R on your letter header */}
                {/* <div style={{marginLeft: 50, marginRight: 50, marginTop: 50, marginBottom: 50}}></div> */}

                {/* For custom Header */}
                {/* <div className="text-primary fw-bold fontroboto text-uppercase" style={{ fontSize: 24 }}>
                    Care Clinic
                </div> */}
                {/* <div className="fontroboto" style={{ fontSize: 14 }}>
                    Hyderabad, India • 07894561230 • contact@careclinic.com
                </div> */}
            </div>

            {/* Patient Details */}
            <div className="py-4 border-dark border-bottom patient-details">
                <Flex justify="space-between">
                    <Col flex={7}>
                        <div className="details-name">
                            <span>Patient Name & ID: </span>
                            <span>Abhishek Baroliya, #MH-020230214002</span>
                        </div>
                        <div className="details-name">
                            <span>Age/Gender: </span>
                            <span>28 Years, Male</span>
                        </div>
                        <div className="details-name">
                            <span>Height / Weight: </span>
                            <span>170cm / 68kg</span>
                        </div>
                        <div className="details-name">
                            <span>Address: </span>
                            <span>K9 Sardar Banglow, Prahladnagar, Ahmedabad 380015, Gujarat</span>
                        </div>
                    </Col>
                    <Col flex={3}>
                        <div className="details-name">
                            <span>Date: </span>
                            <span>22/11/2023 04:36 PM</span>
                        </div>
                        <div className="details-name">
                            <span>Mobile: </span>
                            <span>7894561230</span>
                        </div>
                        <div className="details-name">
                            <span>Blood Group: </span>
                            <span>A+</span>
                        </div>
                    </Col>
                </Flex>
            </div>
        </>
    );
}
export default PrintHtmlPage;
