import React, { useRef, useEffect, useCallback } from "react";
import { message, Tooltip } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { createRemoteComponent } from "../../shared/remoteComponents";
import DynamicPickerTable from "./DynamicPickerTable";
import { searchMedication, searchGeneric } from "../../redux/medicationSlice";
import {
  addTreatmentNote,
  updateTreatmentNote,
  removeTreatmentNote,
} from "../../redux/ipd/dischargeSummarySlice";
import {
  formatDateToShortMonthYear,
  getModuleCode,
  removeBeforeWhiteSpace,
  replaceCommasAndSemicolons,
} from "../../utils/utils";
import { useLocation } from "react-router-dom";
import { dischargeSummaryIcons } from "../../assets/images/indices";
import "./styles.scss";
import { greenTick } from "../../assets/images/dischargeSummaryIcons";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const TreatmentGiven = ({ sectionData }) => {
  const { state } = useLocation();
  const { isEditable = true } = state || {};
  const tableRef = useRef();
  const dispatch = useDispatch();

  const { treatmentNotes, treatmentNotesLoading, actualDischargeSummaryData } =
    useSelector((state) => state.dischargeSummary);

  const handleSearch = async (query) => {
    if (!query) return [];

    try {
      const medicationAction = await dispatch(
        searchMedication({
          searchQuery: removeBeforeWhiteSpace(query),
          type: "parent",
        })
      );

      const genericAction = await dispatch(
        searchGeneric(replaceCommasAndSemicolons(removeBeforeWhiteSpace(query)))
      );

      const medicationResults = medicationAction.payload || [];
      const genericResults = genericAction.payload || [];

      const formattedResults = [
        ...medicationResults.map((med) => ({
          id: med.tmm_id,
          name: med.tmm_medicine_name,
          code: "DS",
          type: med.tmm_type || "Medication",
          strength: med.tmm_strength || "",
          manufacturer: med.tmm_company || "",
        })),
        ...genericResults.map((gen) => ({
          id: `gen_${gen.id || Date.now()}`,
          name: gen.tmm_generic || gen.name,
          code: "CN",
          type: "Generic",
          strength: "",
          manufacturer: "",
        })),
      ];

      return formattedResults;
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  };

  const ToolTipContent = (record) => {
    return (
      <div className="chrosum-tooltip-container">
        <div className="chrotol-source">
          <span>Source:</span>
          {record.module} - {record.subModule}
        </div>
        <div className="chrotol-source">
          <span>Date:</span>
          {record.givenDate}
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text, record) => {
        let code = getModuleCode(record.module);
        if ((record.module === "OT Note" || record.module === "OT Notes") && record.subModule === "Surgery Details") {
          code = null;
        }
        return (
          <div className="medication-name-cell">
            <span className="medication-name">{text}</span>
            <Tooltip title={ToolTipContent(record)}>
              <span
                className={`badge badge-${
                  record.code?.toLowerCase() || "default"
                }`}
              >
                {code ? `[${code}]` : null}
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "GIVEN DATE",
      dataIndex: "givenDate",
      key: "givenDate",
      type: "date",
      width: 160,
      placeholder: "Select date",
      dateProps: {
        format: "DD MMM YYYY",
        style: { width: "100%" },
      },
    },
    {
      title: "DURATION",
      dataIndex: "duration",
      key: "duration",
      type: "select",
      width: 120,
      placeholder: "Select duration",
      options: [
        { label: "1 day", value: "1 day" },
        { label: "3 days", value: "3 days" },
        { label: "5 days", value: "5 days" },
        { label: "7 days", value: "7 days" },
        { label: "10 days", value: "10 days" },
        { label: "14 days", value: "14 days" },
        { label: "21 days", value: "21 days" },
        { label: "30 days", value: "30 days" },
      ],
      selectProps: {
        style: { width: "100%" },
      },
    },
    {
      title: "NOTE",
      dataIndex: "notes",
      key: "notes",
      type: "input",
      placeholder: "Notes",
      inputProps: {
        style: { width: "100%" },
      },
    },
  ];

  const searchConfig = {
    valueField: "name",
    titleField: "name",
    subtitleField: "code",
    preventDuplicates: true,
    duplicateCheckField: "id",
    renderOption: (item) => (
      <div className="option-row">
        <span className="option-title">{item.name}</span>
      </div>
    ),
  };

  const handleRowChange = (row, field, value) => {
    dispatch(
      updateTreatmentNote({ key: row.key, updates: { [field]: value } })
    );
  };

  const handleRowAdd = (row) => {
    dispatch(addTreatmentNote(row));
  };

  const handleRowDelete = (row) => {
    dispatch(removeTreatmentNote(row.key));
  };

  const renderTreatmentTable = () => (
    <DynamicPickerTable
      ref={tableRef}
      isEditable={isEditable}
      columns={columns}
      initialData={treatmentNotes}
      searchConfig={searchConfig}
      onSearch={handleSearch}
      onRowChange={handleRowChange}
      onRowAdd={handleRowAdd}
      onRowDelete={handleRowDelete}
      emptyText="No treatments added"
      searchPlaceholder="Search by treatment name or type..."
      rootClassName="treatment-given-picker"
      loading={treatmentNotesLoading}
      hideTableWhenEmpty={true}
    />
  );

  const showLastUpdatedAt = () => {
    if (!actualDischargeSummaryData?.date) return null;
    return (
      <div className="success-gradient-pill">
        <img src={greenTick} alt="." />
        {`Last Updated on ${formatDateToShortMonthYear(
          actualDischargeSummaryData?.date
        )}`}
      </div>
    );
  };

  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      title={sectionData?.title}
      width="100%"
      icon={dischargeSummaryIcons[`${sectionData?.id}Pc`]}
      showAutoFill={false}
      containerClass={`wrapper-class ${
        !isEditable
          ? "ipd-wrapper-class-readonly rich-text-editor-container-readonly"
          : ""
      }`}
      showMagicPenGif={false}
      showMicrophone={false}
      placeholder="Treatment given details"
      renderBody={renderTreatmentTable}
      headerComponent={showLastUpdatedAt}
    />
  );
};

export default TreatmentGiven;
