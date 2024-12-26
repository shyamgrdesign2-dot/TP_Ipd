import {
  AutoComplete,
  Button,
  DatePicker,
  Input,
  Select,
  Switch,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { AncSchedulerColumns } from "../../utils/constants";
import { splitByTrimester } from "../../utils/helper";
import "./AncScheduler.scss";
import AncImmunisationPopup from "../ancImmunisationPopup/AncImmunisationPopup";
import { removeBeforeWhiteSpace } from "../../../../utils/utils";
import AncPrintPreview from "../ancPrintPreview/AncPrintPreview";
import { useLocation } from "react-router-dom";
import { fetchSearchDiagnosis } from "../../service";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  addObstetricDetails,
  obstetricDetailsUpdated,
  patientDiagnosisUpdated,
} from "../../../../redux/obstetricSlice";

const AncScheduler = ({ ancHistory }) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data } = state;
  const { userId } = useSelector((state) => state.doctors);
  const { obstetricDetails, defaultAncSchedule } = useSelector(
    (state) => state.obstetric
  );
  const [ancSchedulerData, setAncSchedulerData] = useState(
    splitByTrimester(ancHistory)
  );
  const [activeCategory, setActiveCategory] = useState(0);
  const [immunisationPopup, setImmunisationPopup] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [searchSelected, setSearchSelected] = useState(null);
  const [shouldSelectForAllPatients, setShouldSelectForAllPatients] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const [shouldShowPrintPreview, setShouldShowPrintPreview] = useState(false);

  const getSearchOptions = async () => {
    const searchOptionsRes = await fetchSearchDiagnosis(
      searchQuery,
      patient_data.patient_unique_id
    );
    const data = [];
    searchOptionsRes?.map((e) => {
      return data.push({
        key: JSON.stringify({ ...e }),
        value: e.name,
        label: <div>{e.name}</div>,
      });
    });
    searchQuery &&
      data.push({
        key: JSON.stringify({
          change: 1,
          name: searchQuery,
        }),
        value: searchQuery,
        label: (
          <>
            <div>
              {searchQuery}
              <i className="icon-Add mx-1 text-primary fs-6"></i>{" "}
              <a className="fw-medium text-decoration-underline text-primary">
                {" "}
                Add Custom
              </a>
            </div>
          </>
        ),
        isCustom: true,
      });
    setSearchOptions(data);
  };

  useEffect(() => {
    if (ancHistory?.length) {
      setAncSchedulerData(splitByTrimester(ancHistory));
    }
  }, [ancHistory]);

  useEffect(() => {
    if (ancHistory?.length === 0) {
      const defaultData = defaultAncSchedule?.map((item) => ({
        masterId: item.id,
        name: item?.master?.name,
        weekRange: item.weekRange,
        dueDate: null,
        status: "Due",
        notes: null,
        enablePrint: false,
        created_at: new Date().toISOString(),
        created_by: userId,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      }));
      const newAncHistory = [...ancHistory, ...defaultData];
      const payload = {
        ...obstetricDetails,
        patientId: patient_data.patient_unique_id,
        ancHistory: newAncHistory,
      };
      dispatch(addObstetricDetails(payload));
      dispatch(patientDiagnosisUpdated());
      dispatch(obstetricDetailsUpdated());
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const timeOutId = setTimeout(() => {
        getSearchOptions();
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      setSearchOptions([]);
    }
  }, [searchQuery]);

  const trimesterList = [
    "First Trimester",
    "Second Trimester",
    "Third Trimester",
  ];

  const disabledDate = (current) => {
    return current && current >= moment().add(1, "days").startOf("day");
  };

  const renderTableHeader = () => {
    return (
      <tr>
        {AncSchedulerColumns?.map((header, index) => (
          <th
            key={index}
            className="obstetricTcell theaderCellStyle"
            style={{
              width: header.width,
              fontWeight: 600,
            }}
          >
            {header.title}
            {header.key === "enablePrint" && (
              <Tooltip
                key={index}
                title={
                  <div>
                    Enable the toggle to show test details in the Rx Print
                  </div>
                }
                overlayClassName="ancTooltip"
                placement="topLeft"
              >
                <i
                  className="icon-info ms-1 me-1"
                  style={{
                    cursor: "pointer",
                    color: "#A2A2A8",
                    fontSize: "18px",
                  }}
                />
              </Tooltip>
            )}
          </th>
        ))}
      </tr>
    );
  };

  const renderTableData = () => {
    const handleImmunisationChange = (key, index, value) => {
      setAncSchedulerData((prev) => {
        [...prev][index][key] = value;
        return [...prev];
      });
    };

    return ancSchedulerData?.[activeCategory]?.map((item, i) => {
      const {
        master,
        weekRange,
        status,
        dueDate,
        notes,
        enablePrint,
        isDefault,
      } = item;
      return (
        <tr key={i}>
          <td className="obstetricTcell">{master?.name}</td>
          <td className="obstetricTcell weekRange">
            {`${weekRange?.start} - ${weekRange?.end} weeks`}
            {!isDefault && (
              <i
                className="icon-Edit fs-6 d-flex justify-content-end"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setEditIndex(i);
                  setImmunisationPopup("edit");
                  setShouldSelectForAllPatients(true);
                }}
              />
            )}
          </td>
          <td className="obstetricTcell">
            <DatePicker
              key={"date"}
              onChange={(date) => {
                const formattedDate = date?.format("YYYY-MM-DD");
                handleImmunisationChange("givenDate", i, formattedDate);
              }}
              disabledDate={disabledDate}
              value={dueDate ? dayjs(moment(dueDate)) : ""}
              className="ancSchedulerBox"
              format={{
                format: "DD-MM-YYYY",
                type: "mask",
              }}
            />
          </td>
          <td className="obstetricTcell">
            <Select
              style={{ padding: 0 }}
              onChange={(value) => handleImmunisationChange("status", i, value)}
              options={[
                { value: "due", label: "Due" },
                { value: "completed", label: "Completed" },
              ]}
              placeholder="Select"
              className={`ancSchedulerBox custom-immunisation-select ${
                status === "Completed" ? "custom-immunisation-given-select" : ""
              }`}
              value={status || "due"}
              allowClear
            />
          </td>

          <td className="obstetricTcell">
            <Input.TextArea
              placeholder="Notes"
              value={notes}
              onChange={(e) =>
                handleImmunisationChange("notes", i, e.target.value)
              }
              className="textareaPlaceholder immunisationRemarks"
            />
          </td>
          <td className="obstetricTcell">
            <Switch
              checked={enablePrint}
              onChange={() =>
                handleImmunisationChange("enablePrint", i, !enablePrint)
              }
            />
          </td>
          <td className="obstetricTcell">
            {!isDefault && (
              <i
                className="icon-delete"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setImmunisationPopup("delete");
                  setEditIndex(i);
                }}
              />
            )}
          </td>
        </tr>
      );
    });
  };

  const handleSelectForAllPatients = () => {
    setShouldSelectForAllPatients((prev) => !prev);
  };

  const onSelect = (value, e) => {
    setImmunisationPopup("add");
    setShouldSelectForAllPatients(true);
    setSearchQuery("");
    const key = e.key && JSON.parse(e.key);
    setSearchSelected({ ...key, isCustom: e.isCustom });
  };

  const onSearch = useCallback(
    (query) => {
      setSearchQuery(removeBeforeWhiteSpace(query));
    },
    [searchQuery]
  );

  return (
    <div>
      <div
        className="d-flex justify-content-between"
        style={{ padding: "5px 40px" }}
      >
        <div className="medical-records d-flex" style={{ gap: 16 }}>
          {trimesterList?.map((item, index) => (
            <Button
              type="text"
              key={index}
              className={`btnStyle btn px-5-16 fs-14 category-btn ${
                index === activeCategory ? "active-category-btn" : ""
              }`}
              onClick={() => setActiveCategory(index)}
              style={{ height: 42 }}
            >
              <span
                className={`btnText category-label ${
                  index === activeCategory ? "active-category-label" : ""
                }`}
              >
                {item}
              </span>
            </Button>
          ))}
        </div>
        <div>
          <Button
            type="button"
            className="btn-41 btn ant-btn-text btn-input anotherVisitBtn d-flex align-items-center"
            onClick={() => setShouldShowPrintPreview(true)}
          >
            <i className="icon-Print me-2" />
            <span>Print ANC Scheduler</span>
          </Button>
        </div>
      </div>
      <div style={{ padding: "25px 40px 15px" }}>
        <AutoComplete
          value={searchQuery}
          onSearch={onSearch}
          options={searchOptions}
          className="autocomplete-custom w-100"
          onSelect={onSelect}
          defaultActiveFirstOption={true}
        >
          <Input
            placeholder="Search & add new test"
            prefix={<i className="icon-search" />}
          />
        </AutoComplete>
      </div>
      <div className="examinationTableViewContainer">
        <div className="tableWrappwer">
          <table
            className="tableView"
            style={{
              tableLayout: "fixed",
              overflow: "hidden",
            }}
          >
            <thead>{renderTableHeader()}</thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      </div>
      {immunisationPopup && (
        <AncImmunisationPopup
          onCancel={() => {
            setImmunisationPopup(null);
            setShouldSelectForAllPatients(false);
            setEditIndex(-1);
            setSearchSelected(null);
          }}
          title={
            immunisationPopup === "delete"
              ? "Remove Dummy test"
              : immunisationPopup === "add"
              ? "Add New Test"
              : "Edit Test Details"
          }
          description={
            "Are you sure you want to remove this “Dummy test” from the list"
          }
          popupType={immunisationPopup}
          shouldSelectForAllPatients={shouldSelectForAllPatients}
          handleSelectForAllPatients={handleSelectForAllPatients}
          ancDetails={
            immunisationPopup === "edit"
              ? ancSchedulerData?.[activeCategory]?.[editIndex]
              : searchSelected
          }
          editIndex={editIndex}
          activeCategory={activeCategory}
        />
      )}
      {shouldShowPrintPreview && (
        <AncPrintPreview
          ancSchedulerData={ancSchedulerData}
          shouldShowPrintPreview={shouldShowPrintPreview}
          onCancel={() => setShouldShowPrintPreview(false)}
        />
      )}
    </div>
  );
};

export default AncScheduler;
