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

                {/* Print RX on your letter header */}
                {/* <div style={{marginLeft: 50, marginRight: 50, marginTop: 50, marginBottom: 50}}></div> */}

                {/* For custom Header */}
                {/* <div className="text-primary fw-bold fontroboto text-uppercase" style={{ fontSize: 24 }}>
                    Care Clinic
                </div>
                <div className="fontroboto" style={{ fontSize: 14 }}>
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

            {/* Page Format */}

            {/* Inline View */}
            <div className="py-4">
                <div className="mb-2">
                    <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Symptoms:&nbsp;</label>
                    <label style={{ fontFamily: 'roboto', fontSize: 12 }}><label className="fw-medium">Chest pain </label> (2 months, mild, Lorem ispsum dolor sit amet), <label className="fw-medium">Cold</label> (1 month, Severe)</label>
                </div>
                <div className="mb-2">
                    <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Examinations:&nbsp;</label>
                    <label style={{ fontFamily: 'roboto', fontSize: 12 }}> <label className="fw-medium">No dehydration</label> (Lorem ipsum dolor sit amet, consectetur adipiscing elit), <label className="fw-medium">Chest congestion </label> (Lorem ipsum dolor sit)</label>
                </div>
            </div>

            {/* List View */}
            <div className="py-4">
                <div className="mb-3">
                    <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Symptoms:&nbsp;</label> <br />
                    <label style={{ fontFamily: 'roboto', fontSize: 12 }}>
                        <label className="fw-medium mt-1">&nbsp;1.&nbsp;</label> <label className="fw-medium">Chest pain </label> (2 months, mild, Lorem ispsum dolor sit amet) <br />
                        <label className="fw-medium mt-1">&nbsp;2.&nbsp;</label> <label className="fw-medium">Cold</label> (1 month, Severe)
                    </label>
                </div>
                <div className="mb-3">
                    <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Examinations:&nbsp;</label> <br />
                    <label style={{ fontFamily: 'roboto', fontSize: 12 }}>
                        <label className="fw-medium mt-1">&nbsp;1.&nbsp;</label> <label className="fw-medium">Hypertension: </label> Lorem ipsum dolor sit amet, consectetur adipiscing elit<br />
                        <label className="fw-medium mt-1">&nbsp;2.&nbsp;</label> <label className="fw-medium">Chest congestion: </label> Lorem ipsum dolor sit
                    </label>
                </div>
            </div>

            {/* Table View */}
            <div className="py-4">
                <label className="fw-bold mb-1" style={{ fontFamily: 'roboto', fontSize: 12 }}>Symptoms:&nbsp;</label>
                <table className="w-100 mb-3" cellPadding={5} cellSpacing={5}>
                    <tr>
                        <th style={{fontSize: 12}}>NAME</th>
                        <th style={{fontSize: 12}}>SINCE</th>
                        <th style={{fontSize: 12}}>SEVERITY</th>
                        <th style={{fontSize: 12}}>REMARKS</th>
                    </tr>
                    <tr>
                        <td style={{fontSize: 12}}>Chest pain</td>
                        <td style={{fontSize: 12}}>2 months</td>
                        <td style={{fontSize: 12}}>Mild</td>
                        <td style={{fontSize: 12}}>Test that does not require any fasting</td>
                    </tr>
                    <tr>
                        <td style={{fontSize: 12}}>Cold</td>
                        <td style={{fontSize: 12}}>1 months</td>
                        <td style={{fontSize: 12}}>Severe</td>
                        <td style={{fontSize: 12}}>-</td>
                    </tr>
                </table>

                <label className="fw-bold mb-1" style={{ fontFamily: 'roboto', fontSize: 12 }}>Examinations:&nbsp;</label>
                <table className="w-100 mb-3" cellPadding={5} cellSpacing={5}>
                    <tr>
                        <th style={{fontSize: 12}}>NAME</th>
                        <th style={{fontSize: 12}}>SINCE</th>
                        <th style={{fontSize: 12}}>SEVERITY</th>
                        <th style={{fontSize: 12}}>REMARKS</th>
                    </tr>
                    <tr>
                        <td style={{fontSize: 12}}>Chest pain</td>
                        <td style={{fontSize: 12}}>2 months</td>
                        <td style={{fontSize: 12}}>Mild</td>
                        <td style={{fontSize: 12}}>Test that does not require any fasting</td>
                    </tr>
                    <tr>
                        <td style={{fontSize: 12}}>Cold</td>
                        <td style={{fontSize: 12}}>1 months</td>
                        <td style={{fontSize: 12}}>Severe</td>
                        <td style={{fontSize: 12}}>-</td>
                    </tr>
                </table>
            </div>
        </>
    );
}
export default PrintHtmlPage;
