import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, Table, Space, Typography, Tooltip } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styles from "./BillingSettings.module.css";
import {
  deleteBillItem,
  fetchAdvanceSetting,
  listBillItem,
  searchBillItem,
} from "../../service";
import AdvanceBillSettings from "./AdvanceSettings";
import { useNavigate } from "react-router-dom";
import ServiceItemPopup from "../serviceItemPopup/ServiceItemPopup";
import CommonModal from "../../../../common/CommonModal";
import alertIcon from "../../../../assets/images/alertIcon.svg";
import { debounce } from "lodash";
import { setAdvancedSettings } from "../../../../redux/billingSlice";
import { useDispatch } from "react-redux";

const { Title } = Typography;

const BillingSettings = () => {
  const [searchText, setSearchText] = useState("");
  const [showAdvanceSettings, setShowAdvanceSettings] = useState(false);
  const navigate = useNavigate();
  const [actionType, setActionType] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [billItemsSummary, setBillItemsSummary] = useState({});
  const [isDeleteModuleModalOpen, setIsDeleteModuleModalOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 20,
  });

  const [filteredInfo, setFilteredInfo] = useState({
    type: params.type ? [params.type] : null,
  });

  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "ITEMS",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Service", value: "Service" },
        { text: "Consumables", value: "Consumables" },
      ],
      filteredValue: filteredInfo.type || null,
      filterMultiple: false,
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "PRICE PER UNIT",
      dataIndex: "price",
      key: "price",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "price" && sortedInfo.order,
      render: (value) => `₹${value}`,
    },
    {
      title: "DISCOUNT",
      dataIndex: "discount",
      key: "discount",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "discount" && sortedInfo.order,
      render: (value) => (value ? `₹${value}` : "-"),
    },
    {
      title: "GST (%)",
      dataIndex: "gst",
      key: "gst",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "gst" && sortedInfo.order,
      render: (value) => `${value}%`,
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: true,
      sortOrder: sortedInfo.columnKey === "totalAmount" && sortedInfo.order,
      render: (value) => `₹${value}`,
    },
    {
      title: "ACTION",
      key: "action",
      render: (_, record, index) => (
        <Space>
          <Button
            type="text"
            icon={<i className="icon-Edit" />}
            className={styles.actionButton}
            onClick={() => {
              setActionType("edit");
              setEditIndex(index);
            }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className={styles.actionButton}
            onClick={() => {
              setBillToDelete(record);
              toggleDeleteModuleModal();
            }}
          />
        </Space>
      ),
    },
  ];

  const debouncedSearch = debounce(searchBillItemByName, 500);

  // Cleanup debounce on unmount
  useEffect(() => {
    getAdvanceSettings();
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    if (searchText.trim()) {
      debouncedSearch();
    } else {
      fetchBillItems();
    }
  }, [searchText]);

  useEffect(() => {
    fetchBillItems();
  }, [params]);

  const handleTableChange = (pagination, filters, sorter, extra) => {
    const newParams = { ...params };

    // Only update filter if it changed
    if (extra.action === "filter") {
      setFilteredInfo(filters);
      if (filters.type && filters.type.length > 0) {
        newParams.type = filters.type[0];
      } else {
        newParams.type = "";
      }
    }

    // Only update sort if it changed
    if (extra.action === "sort") {
      setSortedInfo(sorter);
      newParams.sortBy = sorter.order ? sorter.columnKey : undefined;
      newParams.sortOrder =
        sorter.order === "ascend"
          ? "asc"
          : sorter.order === "descend"
          ? "desc"
          : sorter.order;
    }

    // Always handle pagination changes
    if (pagination.current !== params.page) {
      newParams.page = pagination.current;
    }

    setParams(newParams);
  };

  const getAdvanceSettings = async () => {
    const advanceSettingsResponse = await fetchAdvanceSetting();
    if (advanceSettingsResponse) {
      dispatch(setAdvancedSettings(advanceSettingsResponse));
    }
  };

  const fetchBillItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      params.type && queryParams.append("type", params.type);
      params?.name && queryParams.set("name", params?.name);
      queryParams.set("page", params.page);
      queryParams.set("limit", params?.limit);
      params?.sortBy && queryParams.set("sortBy", params?.sortBy);
      params?.sortOrder && queryParams.set("sortOrder", params?.sortOrder);
      console.log({ queryParams });
      const response = await listBillItem(queryParams);
      setBillItems(response.data);
      setBillItemsSummary(response.summary);
    } catch (err) {
      setError("Failed to fetch bill items.");
    } finally {
      setLoading(false);
    }
  };

  async function searchBillItemByName() {
    setLoading(true);
    setError(null);
    try {
      const response = await searchBillItem(searchText);
      setBillItems(response);
    } catch (err) {
      setError("Failed to fetch bill items.");
    } finally {
      setLoading(false);
    }
  }

  const handleAdvanceSettings = () => {
    setShowAdvanceSettings(!showAdvanceSettings);
  };

  const handleAddNewBillItem = () => {
    setActionType("add");
    setEditIndex(-1);
  };

  const closeServiceItemPopup = () => {
    setActionType(null);
  };

  const toggleDeleteModuleModal = useCallback(() => {
    setIsDeleteModuleModalOpen(!isDeleteModuleModalOpen);
  }, [isDeleteModuleModalOpen]);

  const deletBillItemById = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteBillItem(billToDelete?.id);
      if (response?.status === 204) {
        setBillItems((prev) =>
          prev.filter((item) => item.id !== billToDelete.id)
        );
      } else {
        setError(response?.data);
      }
    } catch (err) {
      setError("Failed to fetch bill items.");
    } finally {
      setLoading(false);
      toggleDeleteModuleModal();
    }
  };

  const DELETE_MODULE_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isDeleteModuleModalOpen}
        onCancel={toggleDeleteModuleModal}
        modalWidth={550}
        title={"Are you sure you want to delete this module?"}
        modalBody={
          <>
            <div className="d-flex align-items-start alert-warning rounded-10px p-3 patient-details">
              <img className="me-3" src={alertIcon} alt="Warning" />
              <span>
                This action will permanently delete the{" "}
                <b>{billToDelete?.name}</b> and cannot be undone. Please confirm
                to proceed
              </span>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div
                  onClick={deletBillItemById}
                  className="me-4 text-decoration-underline btn p-0 text-main"
                >
                  Yes, Delete
                </div>
                <Button
                  onClick={toggleDeleteModuleModal}
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                >
                  <span>No</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isDeleteModuleModalOpen]);

  return (
    <div>
      <div className="modalCard-header h-60 align-items-center justify-content-between d-flex position-sticky top-0 z-2">
        <div className="align-items-center d-flex h-100">
          <div className="border-end h-100 text-center me-3">
            <div
              onClick={() => navigate("/")}
              className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
            >
              <i className="icon-right"></i>
            </div>
          </div>
          <div className="title-common">Billing Settings</div>
        </div>
        <Space className="me-4">
          <div
            className="d-flex align-items-center justify-content-end h-38 me-4"
            onClick={handleAdvanceSettings}
          >
            <i className="icon-setting"></i>
            <span className="text-decoration-underline fw-medium cursor-pointer">
              {" "}
              Advance Settings{" "}
            </span>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ height: 41 }}
            onClick={handleAddNewBillItem}
          >
            Add new bill item
          </Button>
        </Space>
      </div>
      <div className={styles.container}>
        <div className="d-flex justify-content-between align-items-center">
          <Title level={5}>Billing Item list</Title>
          <div className={styles.searchContainer}>
            <Input
              placeholder="Search by item name"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.tableContainer}>
          <Table
            columns={columns}
            dataSource={billItems}
            onChange={handleTableChange}
            pagination={{
              current: params.page,
              pageSize: params.limit,
              total: billItemsSummary?.count, // Your total count
            }}
            loading={loading}
          />
        </div>
      </div>
      {showAdvanceSettings && (
        <AdvanceBillSettings
          visible={showAdvanceSettings}
          onClose={handleAdvanceSettings}
          getAdvanceSettings={getAdvanceSettings}
        />
      )}
      {actionType && (
        <ServiceItemPopup
          onCancel={closeServiceItemPopup}
          editIndex={editIndex}
          item={billItems[editIndex]}
          setDataSource={setBillItems}
        />
      )}
      {DELETE_MODULE_MODAL}
    </div>
  );
};

export default BillingSettings;
