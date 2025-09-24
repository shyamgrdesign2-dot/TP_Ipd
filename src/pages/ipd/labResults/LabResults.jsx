import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Tabs, Typography, Space } from "antd";
import "./styles.scss";
import {
  setActiveTab,
  selectActiveTab,
} from "../../../redux/ipd/labResultsSlice";
import ScanResults from "./ScanResults";
import Pathologyresults from "./PathologyResults";
import { defaultIcons } from "../../../assets/images/labResultsIcons";

const { TabPane } = Tabs;
const { Text } = Typography;

const LabResults = () => {
  const activeTab = useSelector(selectActiveTab);
  const dispatch = useDispatch();

  return (
    <div className="lab-results-container">
      <Card className="lab-results-card">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => dispatch(setActiveTab(key))}
          className="lab-results-tabs"
        >
          <TabPane
            tab={
              <Space>
                <div className="tab-icon pathology-icon">
                  <img
                    src={
                      activeTab === "pathology"
                        ? defaultIcons.pathologyResultsPcDark
                        : defaultIcons.pathologyResultsGray
                    }
                    className={
                      activeTab === "pathology"
                        ? "pathology-icon-active"
                        : "pathology-icon-inactive"
                    }
                    alt="pathology"
                  />
                </div>
                <Text>Pathology Results</Text>
              </Space>
            }
            key="pathology"
          />
          <TabPane
            tab={
              <Space>
                <div className="tab-icon scan-icon">
                  <img
                    src={
                      activeTab === "scan"
                        ? defaultIcons.scanResultsPcDark
                        : defaultIcons.scanResultsGray
                    }
                    alt="scan"
                    className={
                      activeTab === "scan"
                        ? "scan-icon-active"
                        : "scan-icon-inactive"
                    }
                  />
                </div>
                <Text>Scan Results</Text>
              </Space>
            }
            key="scan"
          />
        </Tabs>

        <>
          {activeTab === "pathology" && <Pathologyresults />}
          {activeTab === "scan" && <ScanResults />}
        </>
      </Card>
    </div>
  );
};

export default LabResults;
