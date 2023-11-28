import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import HeaderPrescription from "../common/HeaderPrescription";
import { addRecord, updateRecord, createNewRecord, getAllRecords } from "../redux/recordsSlice";

function Testing() {
  const navigate = useNavigate();
  const records = useSelector((state) => state.records.records);
  const loading = useSelector((state) => state.records.loading);
  const error = useSelector((state) => state.records.error);
  const dispatch = useDispatch();
  console.log('error: ', error);

  useEffect(() => {
    dispatch(getAllRecords());
  },[getAllRecords]);

  return (
    <>
      <HeaderPrescription />
      <div className="w-100 bg-body wrapper2 custom-scroll prescription-wrapper">
        {loading ? <div>Loading...</div> : 
            error ? <div>{error.message}</div> : records.map((record) => {
                return (
                <>
                    <div key={record.uuid}>{record.pm_first_name}</div>
                </>
                );
            })
        
        }
        <button onClick={() => dispatch(createNewRecord())}>Add Record</button>
      </div>
    </>
  );
}

export default Testing;
