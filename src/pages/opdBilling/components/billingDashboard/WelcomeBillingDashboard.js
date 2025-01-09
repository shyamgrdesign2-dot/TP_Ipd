import React, { useState, useEffect, useCallback } from "react";
import Button from "react-bootstrap/Button";
import { Drawer } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userCredit } from "../../../../redux/bulkMessagesSlice";

import { getDecodedToken } from "../../../../utils/localStorage";
import CreditImg from "../../../../assets/images/credit_icon.svg"
import config from "../../../../config";
import AvailableCredits from "../../../../components/bulk_messages/AvailableCredits";

function WelcomeBillingDashboard(props) {

  const { locationPath, backVisible } = props;

  const { userCreditObj } = useSelector((state) => state.bulkMessages);
  const { profile } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const decodedToken = getDecodedToken();

  return (
    <>
      <div className="welcomesection position-relative">
        <div className="bg-welcome d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div>
                <h1>OPD Billing</h1>
            </div>
            <img
              src={require("../../../../assets/images/bg-welcome.png")}
              className="welcomeig d-inline-block align-top"
              alt="Welcome"
            />
          </div>
          <div className="d-flex gap-1">
            <div>
              {locationPath == "/" &&
                <div className="d-lg-flex d-block">
                  {/* <Button
                    variant="primary"
                    className="px-3 btn-41"
                    onClick={clickWalkInConsultation}>
                    {"Start Walk-in Consultation"}
                  </Button> */}
                </div>
              }
              {locationPath == "/bulk_messages" &&
                <div className="d-lg-flex d-block">
                  {/* <Button
                    onClick={handleAvailableCredit}
                    className="px-3 btn-41 btn-message d-flex align-items-center">
                    <img src={CreditImg} width={19} className="me-2" />
                    {`Available Credits: ${userCreditObj?.userCredit}`}
                  </Button>
                  <Button
                    variant="primary"
                    className="px-3 btn-41 ms-3 d-flex align-items-center"
                    onClick={() => navigate('/create-campaign')}>
                    <i className="icon-Add me-2"></i>
                    {"Choose new Template"}
                  </Button> */}
                </div>
              }
            </div>
          </div>
        </div>
        <div className="pb-5">&nbsp;</div>
      </div>

      {/* Message Credits Drawer */}
      {/* <Drawer
        className="modalWidth-645" width="auto"
        title="Buy Message Credits"
        placement="right"
        closable
        open={availableCredit}
        onClose={handleAvailableCredit}
      >
        <AvailableCredits handleAvailableCredit={handleAvailableCredit} />
      </Drawer> */}
    </>
  );
}

export default React.memo(WelcomeBillingDashboard);
