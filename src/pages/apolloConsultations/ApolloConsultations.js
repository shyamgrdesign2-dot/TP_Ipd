import React, { useEffect, useState } from "react";
import {
  Table,
  DatePicker,
  Select,
  Input,
  Button,
  Row,
  Col,
  Space,
  Spin,
} from "antd";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  fetchApolloConsultations,
  fetchApolloDoctors,
  updateConsultationRemarks,
} from "./service";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const ApolloConsultations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState({});
  const [filters, setFilters] = useState({
    dateRange: [moment().startOf("day"), moment().endOf("day")],
    selectedDoctors: [],
  });
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchConsultations();
    fetchDoctors();
  }, [filters]);

  const fetchConsultations = async (page = 1, reset = false) => {
    setLoading(true);
    try {
      const { dateRange, selectedDoctors } = filters;
      const startDate = dateRange[0]?.format("YYYY-MM-DD") || null;
      const endDate = dateRange[1]?.format("YYYY-MM-DD") || null;
      const um_ids = selectedDoctors.join(",");

      const response = await fetchApolloConsultations({
        page,
        startDate: "2024-12-09",
        endDate: "2024-12-12",
        umIds: um_ids,
      });
      const fetchedData = response;

      setData(reset ? fetchedData : [...data, ...fetchedData]);
      setHasMore(fetchedData.length === pagination.pageSize);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetchApolloDoctors();
      setDoctors(response);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const updateRemarks = async (tcmId, remark) => {
    try {
      await updateConsultationRemarks({ tcm_id: tcmId, remarks: remark });
      setData((prevData) =>
        prevData.map((entry) =>
          entry.tcm_id === tcmId ? { ...entry, remarks: remark } : entry
        )
      );
    } catch (error) {
      console.error("Error updating remarks:", error);
    }
  };

  const handleDateChange = (range) => {
    setFilters({ ...filters, dateRange: range });
    setPagination({ ...pagination, page: 1 });
    fetchConsultations(1, true);
  };

  const handleDoctorChange = (value) => {
    setFilters({ ...filters, selectedDoctors: value });
    setPagination({ ...pagination, page: 1 });
    fetchConsultations(1, true);
  };

  const handleRemarksChange = (tcmId, value) => {
    setRemarks({ ...remarks, [tcmId]: value });
  };

  const handleSaveRemarks = (tcmId) => {
    const remark = remarks[tcmId];
    updateRemarks(tcmId, remark);
  };

  const columns = [
    {
      title: "Patient Name (Apollo ID)",
      dataIndex: "patientName",
      key: "patientName",
      render: (text, record) => `${text} (${record.apolloId || "N/A"})`,
    },
    {
      title: "Consultation Date & Time",
      dataIndex: "consultationDateTime",
      key: "consultationDateTime",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm A"),
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorName",
      key: "doctorName",
      ellipsis: true,
      //   filteredValue: filters.selectedDoctors,
      //   filters: () =>
      //     doctors.map((doctor) => ({ text: doctor.name, value: doctor.um_id })),
    },
    {
      title: "Investigations",
      dataIndex: "investigations",
      key: "investigations",
      render: (investigations) => investigations.join(", "),
    },
    {
      title: "USG",
      dataIndex: "investigations",
      key: "usg",
      render: (investigations) =>
        investigations.length > 0 ? investigations.join(", ") : "No",
    },
    {
      title: "Vaccinations",
      dataIndex: "vaccinations",
      key: "vaccinations",
      render: (vaccinations) => vaccinations.join(", "),
    },
    {
      title: "Surgeries",
      dataIndex: "surgeries",
      key: "surgeries",
      render: (surgeries) => (surgeries.length ? surgeries.join(", ") : "No"),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (text, record) => (
        <Space direction="vertical" style={{ width: "100%" }}>
          <TextArea
            rows={2}
            defaultValue={text}
            onChange={(e) => handleRemarksChange(record.tcm_id, e.target.value)}
          />
          <Button
            type="primary"
            onClick={() => handleSaveRemarks(record.tcm_id)}
          >
            Save
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Row justify="space-between" style={{ marginBottom: "20px" }}>
        <Col>
          <Space>
            <RangePicker
              onChange={handleDateChange}
              defaultValue={filters.dateRange}
            />
            <Select
              mode="multiple"
              placeholder="Select Doctors"
              onChange={handleDoctorChange}
              style={{ minWidth: "200px" }}
            >
              {doctors.map((doc) => (
                <Select.Option key={doc.um_id} value={doc.um_id}>
                  {doc.doctorName}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Col>
      </Row>
      <InfiniteScroll
        dataLength={data.length}
        next={() => fetchConsultations(pagination.page + 1)}
        hasMore={hasMore}
        loader={<Spin />}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.tcm_id}
          pagination={false}
        />
      </InfiniteScroll>
    </div>
  );
};

export default ApolloConsultations;
