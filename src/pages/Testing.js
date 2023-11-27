import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import HeaderPrescription from "../common/HeaderPrescription";
import { addRecord, updateRecord } from "../redux/recordsSlice";

function Testing() {
  const navigate = useNavigate();
  const records = useSelector((state) => state.records.records);
  const dispatch = useDispatch();
  console.log("redocds: ", records);

  return (
    <>
      <HeaderPrescription />
      <div className="w-100 bg-body wrapper2 custom-scroll prescription-wrapper">
        Hello testing
        <button onClick={() => dispatch(addRecord())}>Add Record</button>
        {records.map((record) => {
          return (
            <>
              <div key={record.uuid}>{record.uuid}</div>
            </>
          );
        })}
      </div>
    </>
  );
}

export default Testing;
