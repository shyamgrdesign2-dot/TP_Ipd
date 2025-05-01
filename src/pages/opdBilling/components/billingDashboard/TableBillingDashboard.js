import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import moment from "moment";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  isAndroid,
  isBrowser,
  isChrome,
  isMobile,
  isSafari,
} from "react-device-detect";
import { Tabs, Select, Input } from "antd";
import { Row, Col, ButtonGroup } from "react-bootstrap";
import BillingTable from "./BillingTable/BillingTable";
import AdvanceDeposit from "./AdvanceDepositTable/AdvanceDepositTable";
import AdvanceDepositTable from "./AdvanceDepositTable/AdvanceDepositTable";
import depositIcon from "./../../../../assets/images/deposit-icon.svg";
import depositSelectedIcon from "./../../../../assets/images/deposit-selected-icon.svg";
import {
  fetchAdvancedDepositDashboard,
  fetchBillingDashboard,
  fetchBillsByPatient,
  listAdvancedDepositByPatient,
} from "../../service";
import { useSelector } from "react-redux";
import { db } from "../../../../firebase";
import { deleteDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { deleteDocsUploadedFromAndroid } from "../../../medicalRecords/service";
import { setLoadingStatus } from "../../../../redux/uploadDocSlice";

const dateFormat = "YYYY-MM-DD";
const TableBillingDashboard = forwardRef(
  (
    {
      onTabChange,
      patientData,
      handleTotalAdvanceUpdate,
      totalAdvanceBalance,
      createBillDrawer,
      addAdvanceDrawer,
      showHideSubModal
    },
    ref
  ) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { doctorList } = useSelector((state) => state.bulkMessages);
    const { userId } = useSelector((state) => state.doctors);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState(1);
    const [isAdvanceDepositTab, setIsAdvanceDepositTab] = useState(false);
    const [isBillingTab, setIsBillingTab] = useState(false);
    const [pageNo, setPageNo] = useState(0);
    const [visitTypeFilters, setVisitTypeFilters] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [billingCount, setBillingCount] = useState(0);
    const [advanceCount, setAdvanceCount] = useState(0);
    const [dateStatus, setDateStatus] = useState(1);
    const [dateRange, setDateRange] = useState({
      startDate: moment().format(dateFormat),
      endDate: moment().format(dateFormat),
    });
    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const doctorIds =
      doctorList.map((doctor) => doctor.um_id).length > 0
        ? doctorList.map((doctor) => doctor.um_id)
        : [userId];
    const deviceUid = localStorage.getItem("app_device_unique_id");
    const urlParams = new URLSearchParams(window.location.search);
    const isReceptionist = urlParams.has("receptionist");
    //   const [date, setDate] = useState({
    //     startDate: moment().format(dateFormat),
    //     endDate: moment().format(dateFormat),
    //   });

    useEffect(() => {
      if (!createBillDrawer || !addAdvanceDrawer) {
        getBillAndAdvanceCount();
      }
    }, [
      dateRange,
      createBillDrawer,
      addAdvanceDrawer,
      selectedDoctors,
      doctorList,
    ]);

    useEffect(() => {
      const checkInFireBase = async () => {
        if (deviceUid) {
          const docCapturedImage = doc(db, "billing", deviceUid);
          try {
            const docCapturedImageSnap = await getDoc(docCapturedImage);
            if (docCapturedImageSnap.exists()) {
              onSnapshot(
                doc(db, "billing", deviceUid),
                async (docSnapshotOfCapturedImage) => {
                  const res = docSnapshotOfCapturedImage?.data();
                  if (res?.clicked === "no") {
                    dispatch(setLoadingStatus(false));
                    deleteDoc(doc(db, "billing", deviceUid));
                    deleteDocsUploadedFromAndroid(
                      patientData ? patientData?.patient_unique_id : ""
                    );
                  }
                }
              );
            }
          } catch (error) {
            console.error("Error updating document:", error);
          }
        } else {
          console.error("Device UID not found");
        }
      };

      return () => checkInFireBase();
    }, [db, deviceUid]);

    const getBillAndAdvanceCount = async () => {
      const billParams = {
        page: 1,
        limit: 25,
        sortBy: "date",
        sortOrder: "desc",
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        doctorIds: isReceptionist ? urlParams.get("um_id")?.split(",") :
          selectedDoctors.length > 0 ? [...selectedDoctors] : [...doctorIds],
        patientId: patientData?.patient_unique_id
          ? patientData?.patient_unique_id
          : "",
      };
      const advanceParams = {
        page: 1,
        limit: 25,
        sortBy: "date",
        sortOrder: "desc",
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        doctorIds: isReceptionist ? urlParams.get("um_id")?.split(",") : doctorList.map((doctor) => doctor.um_id),
        patientId: patientData?.patient_unique_id
          ? patientData?.patient_unique_id
          : "",
      };   
      const billResponse = patientData
        ? await fetchBillsByPatient(billParams)
        : await fetchBillingDashboard(billParams);
      const advanceResponse = patientData
        ? await listAdvancedDepositByPatient(advanceParams)
        : await fetchAdvancedDepositDashboard(advanceParams);

      setBillingCount(billResponse?.summary?.count);
      setAdvanceCount(
        advanceResponse?.summary?.totalCount ||
          advanceResponse?.summary?.count ||
          0
      );
    };

    // Move items into the component body and make them depend on selectedTab
    const items = useMemo(
      () => [
        {
          key: 1,
          label: (
            <div className="d-flex align-items-center">
              <i className="icon-billings"></i>
              {`Billing (${billingCount})`}
            </div>
          ),
        },
        {
          key: 2,
          label: (
            <div
              className="d-flex align-items-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={
                  selectedTab === 2 || isHovered
                    ? depositSelectedIcon
                    : depositIcon
                }
                className="me-2"
                alt={selectedTab === 2 ? "selected-deposit" : "default-deposit"}
                style={{
                  width: "20px",
                  height: "20px",
                  display: "block",
                }}
              />
              {`Advance Deposit (${advanceCount})`}
            </div>
          ),
        },
      ],
      [selectedTab, isHovered, billingCount, advanceCount]
    ); // Add isHovered as dependency

    // Create a ref for the AdvanceDepositTable
    const advanceTableRef = useRef(null);

    // Expose the refresh function to parent
    useImperativeHandle(ref, () => ({
      refreshData: () => {
        if (advanceTableRef.current?.refreshData) {
          advanceTableRef.current.refreshData();
        }
      },
    }));

    const onChange = useCallback(
      (key) => {
        setPageNo(0);
        setVisitTypeFilters("");
        setSelectedTab(key);

        if (key === 1) {
          onTabChange("billingtable");
          setIsBillingTab(true);
        } else {
          onTabChange("advancetable");
          setIsAdvanceDepositTab(false);
        }
      },
      [selectedTab]
    );

    return (
      <>
        <div className="border rounded-4 appointment-wrap dateborder">
          <Tabs
            defaultActiveKey={1}
            items={items}
            onChange={onChange}
            activeKey={selectedTab}
          />
          <div className="appointment-data">
            {selectedTab === 1 ? (
              <BillingTable
                patientData={patientData}
                handleTotalAdvanceUpdate={handleTotalAdvanceUpdate}
                setBillingCount={setBillingCount}
                dateRange={dateRange}
                setDateRange={setDateRange}
                dateStatus={dateStatus}
                setDateStatus={setDateStatus}
                selectedDoctors={selectedDoctors}
                setSelectedDoctors={setSelectedDoctors}
                createBillDrawer={createBillDrawer}
                totalAdvanceBalance={totalAdvanceBalance}
                showHideSubModal={showHideSubModal}
              />
            ) : (
              <AdvanceDepositTable
                ref={advanceTableRef}
                patientData={patientData}
                dateRange={dateRange}
                setDateRange={setDateRange}
                dateStatus={dateStatus}
                setDateStatus={setDateStatus}
                totalAdvanceBalance={totalAdvanceBalance}
                showHideSubModal={showHideSubModal}
              />
            )}
          </div>
        </div>
      </>
    );
  }
);

export default React.memo(TableBillingDashboard);
