import React, { useRef, useEffect, useCallback } from "react";
import { message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { createRemoteComponent } from "../../shared/remoteComponents";
import DynamicPickerTable from "./DynamicPickerTable";
import { searchMedication, searchGeneric } from "../../redux/medicationSlice";
import {
  generateTreatmentNotes,
  addTreatmentNote,
  updateTreatmentNote,
  removeTreatmentNote,
} from "../../redux/ipd/dischargeSummarySlice";
import {
  removeBeforeWhiteSpace,
  replaceCommasAndSemicolons,
} from "../../utils/utils";
import { useLocation } from "react-router-dom";
import { dischargeSummaryIcons } from "../../assets/images/indices";
import './styles.scss';

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const TreatmentGiven = ({ sectionData }) => {
  const { state } = useLocation();
  const { patientDetails, isEditable = true } = state || {};
  const tableRef = useRef();
  const dispatch = useDispatch();
  
  // Get treatment notes from Redux store
  const { treatmentNotes, treatmentNotesLoading } = useSelector(
    (state) => state.dischargeSummary
  );

  // Fetch treatment notes using Redux
  const fetchTreatmentNotes = useCallback(() => {
    if (patientDetails?.details?.id && patientDetails?.admissionId) {
      dispatch(
        generateTreatmentNotes({
          patientId: patientDetails.details.id,
          admissionId: patientDetails.admissionId,
        })
      );
    }
  }, [dispatch, patientDetails?.details?.id, patientDetails?.admissionId]);

  // Load data on component mount
  useEffect(() => {
    fetchTreatmentNotes();
  }, [fetchTreatmentNotes]);

  // Search medications using redux
  const handleSearch = async (query) => {
    if (!query) return [];

    try {
      // Search both medications and generics
      const medicationAction = await dispatch(
        searchMedication({
          searchQuery: removeBeforeWhiteSpace(query),
          type: "parent",
        })
      );

      const genericAction = await dispatch(
        searchGeneric(replaceCommasAndSemicolons(removeBeforeWhiteSpace(query)))
      );

      // Combine results from both searches
      const medicationResults = medicationAction.payload || [];
      const genericResults = genericAction.payload || [];

      // Format results for the picker
      const formattedResults = [
        ...medicationResults.map((med) => ({
          id: med.tmm_id,
          name: med.tmm_medicine_name,
          code: "CN", // Default to CN for medications
          type: med.tmm_type || "Medication",
          strength: med.tmm_strength || "",
          manufacturer: med.tmm_company || "",
        })),
        ...genericResults.map((gen) => ({
          id: `gen_${gen.id || Date.now()}`,
          name: gen.tmm_generic || gen.name,
          code: "CN", // Default to CN for generics
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

  // Column configuration
  const columns = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text, record) => (
        <div className="medication-name-cell">
          <span className="medication-name">{text}</span>
          <span
            className={`badge badge-${record.code?.toLowerCase() || "default"}`}
          >
            [{record.code || "N/A"}]
          </span>
        </div>
      ),
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

  // Search configuration
  const searchConfig = {
    valueField: "name",
    titleField: "name",
    subtitleField: "code",
    preventDuplicates: true,
    duplicateCheckField: "id",
    renderOption: (item) => (
      <div className="option-row">
        <span className="option-title">{item.name}</span>
        <span className="option-subtitle">[{item.code}]</span>
      </div>
    ),
  };

  // Event handlers
  const handleRowChange = (row, field, value) => {
    dispatch(updateTreatmentNote({ key: row.key, updates: { [field]: value } }));
    // message.success(`Updated ${field} for ${row.name}`);
  };

  const handleRowAdd = (row) => {
    dispatch(addTreatmentNote(row));
    // message.success(`Added ${row.name} to the list`);
  };

  const handleRowDelete = (row) => {
    dispatch(removeTreatmentNote(row.key));
    // message.success(`Removed ${row.name} from the list`);
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
    />
  );

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
    />
  );
};

export default TreatmentGiven;
