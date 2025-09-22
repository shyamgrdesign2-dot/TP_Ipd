import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Spin,
  message,
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
import ToolbarActions from "../components/ToolbarActions/ToolbarActions";
import {
  getPathologyResults,
  addToDischargeThunk,
  setActiveTab,
  setSearchText,
  toggleCategory,
  selectAll,
  deselectAll,
  selectCategoryWithTests,
  deselectCategoryWithTests,
  selectTest,
  deselectTest,
  selectCategory,
  deselectCategory,
  clearError,
  selectLabResultsState,
  selectPathologyResults,
  selectSelectedTests,
  selectSelectedCategories,
  selectIsLoading,
  selectIsUpdating,
  selectError,
  selectUpdateError,
  selectActiveTab,
  selectSearchText,
  selectExpandedCategories,
  selectTotalSelectionCount,
  selectTotalItemCount,
  selectIsAllSelected,
  selectIsCategorySelected,
  selectIsCategoryIndeterminate,
  selectIsMainCheckboxIndeterminate,
} from "../../../redux/labResultsSlice";

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

const LabResults = ({ patientId = "123", admissionId = "AID-5698" }) => {
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);

  // Redux state
  const pathologyResults = useSelector(selectPathologyResults);
  const selectedTests = useSelector(selectSelectedTests);
  const selectedCategories = useSelector(selectSelectedCategories);
  const activeTab = useSelector(selectActiveTab);
  const searchText = useSelector(selectSearchText);
  const expandedCategories = useSelector(selectExpandedCategories);
  const isLoading = useSelector(selectIsLoading);
  const isUpdating = useSelector(selectIsUpdating);
  const error = useSelector(selectError);
  const updateError = useSelector(selectUpdateError);
  const totalSelectionCount = useSelector(selectTotalSelectionCount);
  const totalItemCount = useSelector(selectTotalItemCount);
  const isAllSelected = useSelector(selectIsAllSelected);
  const isMainIndeterminate = useSelector(selectIsMainCheckboxIndeterminate);

  // Refs for scroll synchronization
  const headerScrollRef = useRef(null);
  const rowScrollRefs = useRef([]);

  // Get auth token from localStorage or context
  const getAuthToken = () => {
    return (
      localStorage.getItem("authToken") ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiZG9jdG9yX3VuaXF1ZV9pZCI6InhMd0hVRTNzSld6YUZmVCIsIm1vYmlsZV9ubyI6Ijk2ODY5OTc1NDIiLCJjbGluaWNfaWQiOjM5MCwiaG9zcGl0YWxfYnVzaW5lc3NfaWQiOjM5Njc0MTcxOTkwNjcwMCwidXNlcl9pZCI6NTI0LCJhZG1pbiI6MSwic2VhcmNoV2l0aCI6IlQiLCJpbmRpdmlkdWFsUHJlc2VudGF0aW9uIjoiTiIsInRlbXBsYXRlTm90ZXNIaWRlIjoiTiJ9LCJpYXQiOjE3MzU2MTkzMjYsImV4cCI6MTc2NzE3NjkyNn0.C8JczRD_lAyUzcb_CRQmuhuT8PsD0vEltpFtD7Vsegs"
    );
  };

  // Load data on component mount
  useEffect(() => {
    if (patientId && admissionId) {
      const token = getAuthToken();
      dispatch(getPathologyResults({ patientId, admissionId, token }));
    }
  }, [dispatch, patientId, admissionId]);

  // Handle errors
  useEffect(() => {
    if (error) {
      message.error(`Error loading lab results: ${error}`);
      dispatch(clearError());
    }
    if (updateError) {
      message.error(`Error updating lab results: ${updateError}`);
      dispatch(clearError());
    }
  }, [error, updateError, dispatch]);

  // Synchronize scrolling between header and rows
  useEffect(() => {
    const handleHeaderScroll = (e) => {
      const scrollLeft = e.target.scrollLeft;
      setIsScrolled(scrollLeft > 0);
      rowScrollRefs.current.forEach((ref) => {
        if (ref && ref !== e.target) {
          ref.scrollLeft = scrollLeft;
        }
      });
    };

    const handleRowScroll = (e) => {
      const scrollLeft = e.target.scrollLeft;
      setIsScrolled(scrollLeft > 0);
      if (headerScrollRef.current) {
        headerScrollRef.current.scrollLeft = scrollLeft;
      }
      rowScrollRefs.current.forEach((ref) => {
        if (ref && ref !== e.target) {
          ref.scrollLeft = scrollLeft;
        }
      });
    };

    // Add event listeners
    if (headerScrollRef.current) {
      headerScrollRef.current.addEventListener("scroll", handleHeaderScroll);
    }

    rowScrollRefs.current.forEach((ref) => {
      if (ref) {
        ref.addEventListener("scroll", handleRowScroll);
      }
    });

    // Cleanup
    return () => {
      if (headerScrollRef.current) {
        headerScrollRef.current.removeEventListener(
          "scroll",
          handleHeaderScroll
        );
      }
      rowScrollRefs.current.forEach((ref) => {
        if (ref) {
          ref.removeEventListener("scroll", handleRowScroll);
        }
      });
    };
  }, [expandedCategories]); // Re-run when categories expand/collapse

  // Helper functions for checkbox management
  const getAllTestKeys = () => {
    return labResultsData.flatMap((category) =>
      category.tests.map((test) => test.key)
    );
  };

  const getTotalSelectionCount = () => {
    return selectedTests.length + selectedCategories.length;
  };

  const getTotalItemCount = () => {
    const allTestKeys = getAllTestKeys();
    const allCategoryKeys = getAllCategoryKeys();
    return allTestKeys.length + allCategoryKeys.length;
  };

  const getCategoryTestKeys = (categoryKey) => {
    const category = labResultsData.find((cat) => cat.key === categoryKey);
    return category ? category.tests.map((test) => test.key) : [];
  };

  const getAllCategoryKeys = () => {
    return labResultsData.map((category) => category.key);
  };

  // Handle main checkbox (select all)
  const handleMainCheckboxChange = (checked) => {
    if (checked) {
      dispatch(selectAll());
    } else {
      dispatch(deselectAll());
    }
  };

  // Handle category checkbox
  const handleCategoryCheckboxChange = (categoryKey, checked) => {
    const categoryTestKeys = getCategoryTestKeys(categoryKey);

    if (checked) {
      dispatch(
        selectCategoryWithTests({ categoryKey, testKeys: categoryTestKeys })
      );
    } else {
      dispatch(
        deselectCategoryWithTests({ categoryKey, testKeys: categoryTestKeys })
      );
    }
  };

  // Handle individual test checkbox
  const handleTestCheckboxChange = (testKey, categoryKey, checked) => {
    if (checked) {
      dispatch(selectTest(testKey));

      // Check if all tests in category are now selected
      const categoryTestKeys = getCategoryTestKeys(categoryKey);
      const updatedSelectedTests = [...selectedTests, testKey];
      const allCategoryTestsSelected = categoryTestKeys.every((key) =>
        updatedSelectedTests.includes(key)
      );

      if (
        allCategoryTestsSelected &&
        !selectedCategories.includes(categoryKey)
      ) {
        dispatch(selectCategory(categoryKey));
      }
    } else {
      dispatch(deselectTest(testKey));

      // Deselect category if it was selected
      if (selectedCategories.includes(categoryKey)) {
        dispatch(deselectCategory(categoryKey));
      }
    }
  };

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
    dispatch(toggleCategory(categoryKey));
  };

  // Handle add to discharge summary
  const handleAddToDischarge = async () => {
    try {
      const token = getAuthToken();
      await dispatch(
        addToDischargeThunk({
          patientId,
          admissionId,
          token,
        })
      ).unwrap();
      await dispatch(getPathologyResults({ patientId, admissionId, token }));

      message.success("Successfully added selected items to discharge summary");
    } catch (error) {
      message.error("Failed to add items to discharge summary");
    }
  };

  // Helper function to check if category is selected
  const isCategorySelected = (categoryKey) => {
    return selectedCategories.includes(categoryKey);
  };

  // Helper function to check if category is indeterminate
  const isCategoryIndeterminate = (categoryKey) => {
    const categoryTestKeys = getCategoryTestKeys(categoryKey);
    const selectedCategoryTests = categoryTestKeys.filter((key) =>
      selectedTests.includes(key)
    );
    return (
      selectedCategoryTests.length > 0 &&
      selectedCategoryTests.length < categoryTestKeys.length
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
          checked={isCategorySelected(category.key)}
          indeterminate={isCategoryIndeterminate(category.key)}
          onChange={(e) => {
            e.stopPropagation(); // Prevent category toggle when clicking checkbox
            handleCategoryCheckboxChange(category.key, e.target.checked);
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
          onChange={(key) => dispatch(setActiveTab(key))}
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
            onChange={(e) => dispatch(setSearchText(e.target.value))}
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
          {/* Global Table Header */}
          <div className="table-header-container">
            <div
              className={`table-header-fixed ${isScrolled ? "scrolled" : ""}`}
            >
              <div className="header-checkbox">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isMainIndeterminate}
                  onChange={(e) => handleMainCheckboxChange(e.target.checked)}
                />
              </div>
              <div className="header-name">
                <Text
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#454551",
                  }}
                >
                  Name
                </Text>
              </div>
            </div>
            <div className="table-header-scrollable" ref={headerScrollRef}>
              <div className="header-date">
                <Text
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#171725",
                  }}
                >
                  06 Aug, 2025
                </Text>
              </div>
              <div className="header-date">
                <Text
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#171725",
                  }}
                >
                  04 Aug, 2025
                </Text>
              </div>
              <div className="header-date">
                <Text
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#171725",
                  }}
                >
                  03 Aug, 2025
                </Text>
              </div>
              {/* Add more date columns as needed */}
              <div className="header-date">
                <Text
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#171725",
                  }}
                >
                  02 Aug, 2025
                </Text>
              </div>
              <div className="header-date">
                <Text
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#171725",
                  }}
                >
                  01 Aug, 2025
                </Text>
              </div>
              <div className="header-date">
                <Text
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#171725",
                  }}
                >
                  31 Jul, 2025
                </Text>
              </div>
              <div className="header-trends">
                <Space>
                  <Text
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#171725",
                    }}
                  >
                    Trends
                  </Text>
                  <InfoCircleOutlined
                    style={{ color: "#A2A2A8", fontSize: "14px" }}
                  />
                </Space>
              </div>
            </div>
          </div>

          {/* Categories and Data */}
          {(pathologyResults.length > 0
            ? pathologyResults
            : labResultsData
          ).map((category) => (
            <div key={category.key} className="category-section">
              {expandedCategories.includes(category.key) ? (
                <div className="expanded-category">
                  <div className="category-header">
                    {renderCategoryHeader(category)}
                  </div>
                  <div className="category-content">
                    {category.tests.map((test, testIndex) => (
                      <div key={test.key} className="test-row-container">
                        <div
                          className={`test-row-fixed ${
                            isScrolled ? "scrolled" : ""
                          }`}
                        >
                          <div className="test-checkbox">
                            <Checkbox
                              checked={selectedTests.includes(test.key)}
                              onChange={(e) => {
                                handleTestCheckboxChange(
                                  test.key,
                                  category.key,
                                  e.target.checked
                                );
                              }}
                            />
                          </div>
                          <div className="test-name">
                            <Space>
                              <Text
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 500,
                                  color: "#454551",
                                }}
                              >
                                {test.name}
                              </Text>
                              <Tooltip title="Test information">
                                <InfoCircleOutlined
                                  style={{ color: "#A2A2A8", fontSize: "16px" }}
                                />
                              </Tooltip>
                            </Space>
                          </div>
                        </div>
                        <div
                          className="test-row-scrollable"
                          ref={(el) => (rowScrollRefs.current[testIndex] = el)}
                        >
                          <div className="test-value">
                            <Space>
                              <Text
                                style={{
                                  color:
                                    test.values["06 Aug, 2025"]?.color ||
                                    "#454551",
                                }}
                              >
                                {test.values["06 Aug, 2025"]?.value || "--"}
                              </Text>
                              {getTrendIcon(test.values["06 Aug, 2025"]?.trend)}
                            </Space>
                          </div>
                          <div className="test-value">
                            <Space>
                              <Text
                                style={{
                                  color:
                                    test.values["04 Aug, 2025"]?.color ||
                                    "#454551",
                                }}
                              >
                                {test.values["04 Aug, 2025"]?.value || "--"}
                              </Text>
                              {getTrendIcon(test.values["04 Aug, 2025"]?.trend)}
                            </Space>
                          </div>
                          <div className="test-value">
                            <Space>
                              <Text
                                style={{
                                  color:
                                    test.values["03 Aug, 2025"]?.color ||
                                    "#454551",
                                }}
                              >
                                {test.values["03 Aug, 2025"]?.value || "--"}
                              </Text>
                              {getTrendIcon(test.values["03 Aug, 2025"]?.trend)}
                            </Space>
                          </div>
                          {/* Add more date columns as needed */}
                          <div className="test-value">
                            <Space>
                              <Text style={{ color: "#454551" }}>--</Text>
                            </Space>
                          </div>
                          <div className="test-value">
                            <Space>
                              <Text style={{ color: "#454551" }}>--</Text>
                            </Space>
                          </div>
                          <div className="test-value">
                            <Space>
                              <Text style={{ color: "#454551" }}>--</Text>
                            </Space>
                          </div>
                          <div className="test-trend">
                            {getTrendTag(test.trend)}
                          </div>
                        </div>
                      </div>
                    ))}
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
      {/* Loading Spinner */}
      {isLoading && (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "40px" }}
        >
          <Spin size="large" />
        </div>
      )}

      {/* Toolbar Actions */}
      <div className="ipd-toolbar-edit-custom-print-download">
        <ToolbarActions
          showEditForm={false}
          showSelectionCount={totalSelectionCount > 0}
          showAddToDischarge={totalSelectionCount > 0}
          selectedCount={totalSelectionCount}
          totalCount={totalItemCount}
          onAddToDischarge={handleAddToDischarge}
          onPrintPreview={() => console.log("Preview")}
          onPrint={() => console.log("Print")}
          onSettings={() => console.log("Settings")}
          onDownload={() => console.log("Download")}
        />
      </div>
    </div>
  );
};

export default LabResults;
