import React, { useState } from "react";
import {
  Card,
  Tabs,
  Input,
  Button,
  Table,
  Checkbox,
  Tag,
  Typography,
  Space,
  Tooltip,
  Dropdown,
  Menu,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  DownOutlined,
  UpOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import "./styles.scss";

const { TabPane } = Tabs;
const { Text, Title } = Typography;

// Mock data based on Figma design
const labResultsData = [
  {
    key: "1",
    category: "Complete Blood Count (8)",
    tests: [
      {
        key: "1-1",
        name: "Red blood cell count",
        values: {
          "06 Aug, 2025": {
            value: "98.4 Cells/L",
            trend: "rising",
            color: "#e54848",
          },
          "04 Aug, 2025": { value: "--", trend: null, color: "#454551" },
          "03 Aug, 2025": {
            value: "97.4 Cells/L",
            trend: "rising",
            color: "#e54848",
          },
        },
        trend: "rising",
      },
      {
        key: "1-2",
        name: "WBC count",
        values: {
          "06 Aug, 2025": { value: "--", trend: null, color: "#454551" },
          "04 Aug, 2025": {
            value: "100 Cell/L",
            trend: "falling",
            color: "#e54848",
          },
          "03 Aug, 2025": {
            value: "100 Cell/L",
            trend: "falling",
            color: "#e54848",
          },
        },
        trend: "falling",
      },
      {
        key: "1-3",
        name: "Hemoglobing(/dl)",
        values: {
          "06 Aug, 2025": { value: "--", trend: null, color: "#454551" },
          "04 Aug, 2025": {
            value: "40 Grams/dL/L",
            trend: null,
            color: "#454551",
          },
          "03 Aug, 2025": {
            value: "40 Grams/dL/L",
            trend: null,
            color: "#454551",
          },
        },
        trend: "stable",
      },
      {
        key: "1-4",
        name: "Hematocrit",
        values: {
          "06 Aug, 2025": { value: "20%", trend: null, color: "#454551" },
          "04 Aug, 2025": { value: "15 %", trend: "falling", color: "#e54848" },
          "03 Aug, 2025": { value: "--", trend: null, color: "#454551" },
        },
        trend: "stable",
      },
      {
        key: "1-5",
        name: "Platelet count",
        values: {
          "06 Aug, 2025": {
            value: "95 Billion/L",
            trend: "rising",
            color: "#e54848",
          },
          "04 Aug, 2025": {
            value: "98 Billion/L",
            trend: null,
            color: "#454551",
          },
          "03 Aug, 2025": {
            value: "98 Billion/L",
            trend: null,
            color: "#454551",
          },
        },
        trend: "newly-abnormal",
      },
      {
        key: "1-6",
        name: "Platelet count",
        values: {
          "06 Aug, 2025": {
            value: "95 Billion/L",
            trend: "rising",
            color: "#e54848",
          },
          "04 Aug, 2025": {
            value: "98 Billion/L",
            trend: null,
            color: "#454551",
          },
          "03 Aug, 2025": {
            value: "100 Billion/L",
            trend: "rising",
            color: "#e54848",
          },
        },
        trend: "fluctuating",
      },
      {
        key: "1-7",
        name: "Creatinine",
        values: {
          "06 Aug, 2025": {
            value: "1.5 mg/dL",
            trend: "falling",
            color: "#e54848",
          },
          "04 Aug, 2025": { value: "--", trend: null, color: "#454551" },
          "03 Aug, 2025": { value: "--", trend: null, color: "#454551" },
        },
        trend: null,
      },
      {
        key: "1-8",
        name: "Remarks",
        values: {
          "06 Aug, 2025": {
            value: "Transform your practice with the p...",
            trend: null,
            color: "#454551",
          },
          "04 Aug, 2025": { value: "--", trend: null, color: "#454551" },
          "03 Aug, 2025": {
            value: "Transform your practice w.. View more",
            trend: null,
            color: "#454551",
          },
        },
        trend: null,
      },
    ],
  },
  {
    key: "2",
    category: "Kidney Function Test (2)",
    tests: [],
  },
  {
    key: "3",
    category: "Thyroid Function Profile (4)",
    tests: [],
  },
  {
    key: "4",
    category: "Fertitlity/PCOS Profile (2)",
    tests: [],
  },
  {
    key: "5",
    category: "Routine Imaging & Histopath(1)",
    tests: [],
  },
  {
    key: "6",
    category: "Vitamin & Minerals (8)",
    tests: [],
  },
  {
    key: "7",
    category: "Fever Profile (1)",
    tests: [],
  },
  {
    key: "8",
    category: "Iron Profile (1)",
    tests: [],
  },
  {
    key: "9",
    category: "Pulmonary Function (4)",
    tests: [],
  },
  {
    key: "10",
    category: "Iron Deficiency (3)",
    tests: [],
  },
  {
    key: "11",
    category: "Iron Deficiency (2)",
    tests: [],
  },
  {
    key: "12",
    category: "Iron Deficiency (3)",
    tests: [],
  },
];

const LabResults = () => {
  const [activeTab, setActiveTab] = useState("pathology");
  const [searchText, setSearchText] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(["1"]);
  const [selectedTests, setSelectedTests] = useState([]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "rising":
        return <ArrowUpOutlined style={{ color: "#e54848" }} />;
      case "falling":
        return <ArrowDownOutlined style={{ color: "#e54848" }} />;
      case "stable":
        return <MinusOutlined style={{ color: "#3d8c40" }} />;
      default:
        return null;
    }
  };

  const getTrendTag = (trend) => {
    const trendConfig = {
      rising: {
        color: "#fc5a5a",
        bgColor: "rgba(252,90,90,0.06)",
        text: "Rising",
      },
      falling: {
        color: "#fc5a5a",
        bgColor: "rgba(252,90,90,0.06)",
        text: "Falling",
      },
      stable: {
        color: "#3d8c40",
        bgColor: "rgba(61,140,64,0.06)",
        text: "Stable",
      },
      "back-to-normal": {
        color: "#3d8c40",
        bgColor: "rgba(61,140,64,0.06)",
        text: "Back to Normal",
      },
      "newly-abnormal": {
        color: "#ed8a00",
        bgColor: "rgba(237,138,0,0.06)",
        text: "Newly Abnormal",
      },
      fluctuating: {
        color: "#ed8a00",
        bgColor: "rgba(237,138,0,0.06)",
        text: "Fluctuating",
      },
    };

    const config = trendConfig[trend];
    if (!config) return null;

    return (
      <Tag
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
          border: "none",
          borderRadius: "100px",
          padding: "6px 12px",
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: "",
      dataIndex: "checkbox",
      key: "checkbox",
      width: 60,
      render: (_, record) => (
        <Checkbox
          checked={selectedTests.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedTests([...selectedTests, record.key]);
            } else {
              setSelectedTests(
                selectedTests.filter((key) => key !== record.key)
              );
            }
          }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (text, record) => (
        <Space>
          <Text style={{ fontSize: "16px", fontWeight: 500, color: "#454551" }}>
            {text}
          </Text>
          <Tooltip title="Test information">
            <InfoCircleOutlined
              style={{ color: "#A2A2A8", fontSize: "16px" }}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "06 Aug, 2025",
      dataIndex: "values",
      key: "date1",
      width: 220,
      render: (values) => (
        <Space>
          <Text style={{ color: values["06 Aug, 2025"]?.color || "#454551" }}>
            {values["06 Aug, 2025"]?.value || "--"}
          </Text>
          {getTrendIcon(values["06 Aug, 2025"]?.trend)}
        </Space>
      ),
    },
    {
      title: "04 Aug, 2025",
      dataIndex: "values",
      key: "date2",
      width: 220,
      render: (values) => (
        <Space>
          <Text style={{ color: values["04 Aug, 2025"]?.color || "#454551" }}>
            {values["04 Aug, 2025"]?.value || "--"}
          </Text>
          {getTrendIcon(values["04 Aug, 2025"]?.trend)}
        </Space>
      ),
    },
    {
      title: "03 Aug, 2025",
      dataIndex: "values",
      key: "date3",
      width: 220,
      render: (values) => (
        <Space>
          <Text style={{ color: values["03 Aug, 2025"]?.color || "#454551" }}>
            {values["03 Aug, 2025"]?.value || "--"}
          </Text>
          {getTrendIcon(values["03 Aug, 2025"]?.trend)}
        </Space>
      ),
    },
    {
      title: (
        <Space>
          <Text style={{ fontSize: "12px", fontWeight: 500, color: "#171725" }}>
            Trends
          </Text>
          <InfoCircleOutlined style={{ color: "#A2A2A8", fontSize: "14px" }} />
        </Space>
      ),
      dataIndex: "trend",
      key: "trend",
      width: 200,
      render: (trend) => getTrendTag(trend),
    },
  ];

  const dateFilterMenu = (
    <Menu>
      <Menu.Item key="1">Last 7 days</Menu.Item>
      <Menu.Item key="2">Last 30 days</Menu.Item>
      <Menu.Item key="3">Last 3 months</Menu.Item>
      <Menu.Item key="4">Custom range</Menu.Item>
    </Menu>
  );

  const handleCategoryToggle = (categoryKey) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryKey)
        ? prev.filter((key) => key !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const renderCategoryHeader = (category) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        cursor: "pointer",
      }}
      onClick={() => handleCategoryToggle(category.key)}
    >
      <Text style={{ fontSize: "16px", fontWeight: 500, color: "#454551" }}>
        {category.category}
      </Text>
      <Space>
        <Checkbox
          checked={selectedTests.includes(category.key)}
          onChange={(e) => {
            e.stopPropagation(); // Prevent category toggle when clicking checkbox
            if (e.target.checked) {
              setSelectedTests([...selectedTests, category.key]);
            } else {
              setSelectedTests(
                selectedTests.filter((key) => key !== category.key)
              );
            }
          }}
        />
        {expandedCategories.includes(category.key) ? (
          <UpOutlined />
        ) : (
          <DownOutlined />
        )}
      </Space>
    </div>
  );

  return (
    <div className="lab-results-container">
      <Card className="lab-results-card">
        {/* Header Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="lab-results-tabs"
        >
          <TabPane
            tab={
              <Space>
                <div className="tab-icon pathology-icon" />
                <Text
                  style={{
                    color: activeTab === "pathology" ? "#4b4ad5" : "#454551",
                  }}
                >
                  Pathology Results
                </Text>
              </Space>
            }
            key="pathology"
          />
          <TabPane
            tab={
              <Space>
                <div className="tab-icon scan-icon" />
                <Text
                  style={{
                    color: activeTab === "scan" ? "#4b4ad5" : "#454551",
                  }}
                >
                  Scan Results
                </Text>
              </Space>
            }
            key="scan"
          />
        </Tabs>

        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <Input
            placeholder="Search by test name or category"
            prefix={<SearchOutlined style={{ color: "#A2A2A8" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          <Dropdown overlay={dateFilterMenu} trigger={["click"]}>
            <Button className="date-filter-btn">
              <CalendarOutlined />
              Filter by date
            </Button>
          </Dropdown>
        </div>

        {/* Lab Results Table */}
        <div className="lab-results-content">
          {labResultsData.map((category) => (
            <div key={category.key} className="category-section">
              {expandedCategories.includes(category.key) ? (
                <div className="expanded-category">
                  <div className="category-header">
                    {renderCategoryHeader(category)}
                  </div>
                  <div className="category-content">
                    <Table
                      columns={columns}
                      dataSource={category.tests}
                      pagination={false}
                      className="lab-tests-table"
                      rowClassName="lab-test-row"
                    />
                  </div>
                </div>
              ) : (
                <div className="collapsed-category">
                  {renderCategoryHeader(category)}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LabResults;
