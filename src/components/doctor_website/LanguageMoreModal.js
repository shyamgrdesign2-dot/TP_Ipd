import React from "react";
import { Button } from "antd";

function TabMedicationMoreModal({ width, onClose }) {
    return (
        <>
            <div
                className="modal-overlay"
                style={{
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100vw",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: "998",
                }}
                onClick={() => onClose()}
            ></div>
            <div
                className="more-options-container"
                style={{
                    position: "fixed",
                    bottom: "0px",
                    left: "0px",
                    padding: "10px",
                    width: width,
                    backgroundColor: "white",
                    border: "1px solid lightgrey",
                    borderRadius: "6px",
                    zIndex: "999",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}>
                    <div
                        className="title2"
                        style={{
                            margin: "8px",
                            fontSize: "16px",
                        }}>
                        Select More Languages
                    </div>
                    <button
                        type="button"
                        onClick={() => onClose()}
                        className="ant-btn ant-btn-text btn btn-delete-prescription px-3 focus-none h-100">
                        <i className="icon-Cross fs-3"></i>
                    </button>
                </div>
                <div className="mt-3 d-flex flex-wrap">
                    <Button
                        type="text"
                        className="btn btn-primary2 chips-custom mb-14 me-14">
                        <span>
                            Assamese
                        </span>
                    </Button>
                    <Button
                        type="text"
                        className="btn btn-primary2 chips-custom mb-14 me-14">
                        <span>
                            Bengali
                        </span>
                    </Button>
                    <Button
                        type="text"
                        className="btn btn-primary2 chips-custom mb-14 me-14">
                        <span>
                            Kannada
                        </span>
                    </Button>
                    <Button
                        type="text"
                        className="btn btn-primary2 chips-custom mb-14 me-14">
                        <span>
                            Kashmiri
                        </span>
                    </Button>
                    <Button
                        type="text"
                        className="btn btn-primary2 chips-custom mb-14 me-14">
                        <span>
                            Konkani
                        </span>
                    </Button>

                    <Button
                        type="text"
                        className="btn btn-primary2 chips-custom mb-14 me-14">
                        <span>
                            Manipuri
                        </span>
                    </Button>

                </div>
            </div>
        </>
    );
}

export default React.memo(TabMedicationMoreModal);
