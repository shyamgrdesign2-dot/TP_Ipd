import { Button } from "antd";
import BillTable from "../billingDashboard/BillingTable/BillTable";
import { useState, useCallback } from 'react';

const RecentBills = ({
  handleRecentBillDrawer,
  handleCreateBillDrawer,
  patientBills,
  getPatientBills,
}) => {
  const [sortConfig, setSortConfig] = useState({ field: null, order: null });

  const handleSortChange = useCallback((field, order) => {
    setSortConfig({ field, order });
    // Call getPatientBills with new sort parameters
    getPatientBills(undefined, { field, order });
  }, [getPatientBills]);

  return (
    <div>
      <div
        className="modalCard-header h-60 align-items-center justify-content-between d-flex"
        style={{
          position: "sticky",
          top: "0",
          zIndex: "5",
          background: "#fff",
        }}
      >
        <div className="align-items-center d-flex">
          <Button
            type="text"
            className="btn btn-delete-prescription px-3 focus-none h-100"
            onClick={handleRecentBillDrawer}
          >
            <i className="icon-Cross fs-3"></i>
          </Button>
          <div className="modal-title">Patient's Recent Bills</div>
        </div>
        <Button
          type="button"
          className="btn btn-primary3 px-4 me-20 d-flex align-items-center justify-content-between"
          onClick={handleCreateBillDrawer}
          style={{ width: "fit-content", height: 41 }}
        >
          <span className="icon-Add fs-5 me-2" />
          <span>Create New Bill</span>
        </Button>
      </div>
      <div className="m-4 rounded-20px bg-white">
        <BillTable
          data={patientBills}
          isPatientScreen={true}
          getPatientBills={getPatientBills}
          handleRecentBillDrawer={handleRecentBillDrawer}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  );
};

export default RecentBills;
