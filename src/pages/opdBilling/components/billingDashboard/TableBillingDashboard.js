import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
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
import AdvanceDeposit from "./AdvanceDepositTable/AdvanceDeposit";
import AdvanceDepositTable from "./AdvanceDepositTable/AdvanceDeposit";

function TableBillingDashboard({ onTabChange }) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(1);
  const [isAdvanceDepositTab, setIsAdvanceDepositTab] = useState(false);
  const [isBillingTab, setIsBillingTab] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [visitTypeFilters, setVisitTypeFilters] = useState('');
//   const [date, setDate] = useState({
//     startDate: moment().format(dateFormat),
//     endDate: moment().format(dateFormat),
//   });

  // Initialize items in state
  const [items, setItems] = useState([
    {
    //   key: TAB_BILLING,
      key: 1,
      label: (
        <div className="d-flex align-items-center">
          <i className="icon-Queue"></i>
          Billing ({10})
        </div>
      ),
    },
    {
    //   key: TAB_ADVANCE_DEPOSIT,
      key: 2,
      label: (
        <div className="d-flex align-items-center">
          <i className="icon-Finished"></i>
          Advance Deposit ({6})
        </div>
      ),
    },
  ]);

  const onChange = useCallback(
    (key) => {
      setPageNo(0);
      setVisitTypeFilters("");
      setSelectedTab(key);

      if (key === 1) {
        onTabChange("billingtable")
        setIsBillingTab(true);
      } else {
        onTabChange("advancetable")
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
            {
                selectedTab === 1 ?
                <BillingTable/> :
                <AdvanceDepositTable/>
            }
        </div>
      </div>
    </>
  );
}

export default React.memo(TableBillingDashboard);
