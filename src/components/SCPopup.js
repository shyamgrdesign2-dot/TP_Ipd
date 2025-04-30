import { Button, Checkbox, Divider, Modal } from "antd";
import { useState } from "react";
import autoFill from "../assets/images/autofill-white.svg";
import scHeaderBg from "../assets/images/sc-header-bg.png";
import scBg from "../assets/images/sc-bg.svg";
import close from "../assets/images/close-square.svg";
import scStrip from "../assets/images/sc-strip.png";
import { useSelector } from "react-redux";
import symptoms from "../assets/images/Symptoms.svg";
import medicalHistory from "../assets/images/medical-history-dark.svg";
import { useDispatch } from "react-redux";
import {
  setSelectAutofill,
  setSelectedSymptomsCollector,
} from "../redux/ddxSlice";

const VALID_TYPES = {
  medical_condition: "Medical Condition",
  "medical condition": "Medical Condition",
  allergies: "Allergies",
  allergy: "Allergies",
  "family history": "Family History",
  lifestyle: "Lifestyle",
};

const segregateDataByType = (data) => {
  const segregatedData = {
    "Medical Condition": [],
    Allergies: [],
    "Family History": [],
    Lifestyle: [],
    "Additional History": [],
  };

  data.forEach((item) => {
    const normalizedType = item.type.toLowerCase();
    const mappedType = VALID_TYPES[normalizedType];

    const newItem = {
      name: item.name,
      duration: item.duration || "",
      notes: item.notes || "",
      relation: item.relation || "",
      status: "Active",
      medication: normalizedType === "medical_condition" ? "Yes" : "",
    };

    if (mappedType) {
      segregatedData[mappedType].push(newItem);
    } else {
      // Add to Additional History as notes
      segregatedData["Additional History"].push({
        notes: `${item.name}${item.notes ? `: ${item.notes}` : ""}`,
      });
    }
  });

  return {
    symptoms: [], // Keep existing symptoms if any
    medicalHistory: [
      {
        title: "Medical Condition",
        items: segregatedData["Medical Condition"].map((item) => ({
          name: item.name,
          duration: item.duration,
          status: item.status,
          medication: item.medication,
          notes: item.notes,
        })),
      },
      {
        title: "Allergies",
        items: segregatedData["Allergies"].map((item) => ({
          name: item.name,
          duration: item.duration,
          status: item.status,
          notes: item.notes,
        })),
      },
      {
        title: "Family History",
        items: segregatedData["Family History"].map((item) => ({
          name: item.name,
          duration: item.duration,
          relation: item.relation,
          notes: item.notes,
        })),
      },
      {
        title: "Lifestyle",
        items: segregatedData["Lifestyle"].map((item) => ({
          name: item.name,
          duration: item.duration,
          status: item.status,
          notes: item.notes,
        })),
      },
      {
        title: "Additional History",
        items: segregatedData["Additional History"].map((item) => ({
          notes: item.notes,
        })),
      },
    ].filter((section) => section.items.length > 0), // Only include sections with items
  };
};

const formatMedicalHistoryForDisplay = (data) => {
  if (!data) return [];

  const groupedData = {
    "Medical Condition": [],
    Allergies: [],
    "Family History": [],
    Lifestyle: [],
    "Additional History": [],
  };

  data.forEach((item) => {
    const normalizedType = item.type?.toLowerCase();
    const mappedType = VALID_TYPES[normalizedType] || "Additional History";

    let displayText = item.name;
    const additionalInfo = [];

    if (item.relation) additionalInfo.push(`Relation: ${item.relation}`);
    if (item.duration) additionalInfo.push(`Since: ${item.duration}`);
    if (item.notes) additionalInfo.push(`Notes: ${item.notes}`);

    if (additionalInfo.length > 0) {
      displayText += ` (${additionalInfo.join(", ")})`;
    }

    groupedData[mappedType].push({
      ...item,
      displayText,
    });
  });

  // Convert to array format with titles and filter out empty sections
  return Object.entries(groupedData)
    .filter(([_, items]) => items.length > 0)
    .map(([title, items]) => ({
      title,
      items,
    }));
};

const SCPopup = ({ handlePopup }) => {
  const dispatch = useDispatch();
  const { symptomCollector } = useSelector((state) => state.ddx);

  // Initialize with all symptoms selected
  const [selectedSymptoms, setSelectedSymptoms] = useState(
    symptomCollector?.symptoms?.map((s) => s.name) || []
  );

  // Initialize with all medical history items selected
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState(
    symptomCollector?.medicalHistory?.map((item) => item.name) || []
  );

  // Format medical history for display
  const formattedMedicalHistory = formatMedicalHistoryForDisplay(
    symptomCollector?.medicalHistory
  );

  const handleAutofill = () => {
    // Filter and format selected symptoms
    const selectedSymptomData = symptomCollector.symptoms.filter((symptom) =>
      selectedSymptoms.includes(symptom.name)
    );

    // Filter and format selected medical history
    const selectedMedicalHistoryData = symptomCollector.medicalHistory.filter(
      (item) => selectedMedicalHistory.includes(item.name)
    );

    // Combine and segregate the data
    const formattedData = segregateDataByType([
      ...selectedMedicalHistoryData.map((item) => ({
        type: item.type,
        name: item.name,
        duration: item.duration,
        relation: item.relation,
        notes: item.notes,
        lineItem: item.lineItem,
      })),
    ]);

    // Add selected symptoms to the formatted data
    formattedData.symptoms = selectedSymptomData;

    // Dispatch the selected data
    dispatch(setSelectedSymptomsCollector(formattedData));
    dispatch(setSelectAutofill(true));
    handlePopup();
  };

  console.log("formattedMedicalHistory", formattedMedicalHistory);

  return (
    <Modal
      width={"730px"}
      height={"100%"}
      centered
      open={true}
      closeIcon={null}
      onCancel={handlePopup}
      className="sc-popup modalcommon"
      style={{
        top: "10%",
        right: "10%",
        margin: 0,
        position: "fixed",
        height: "100vh",
        padding: "0",
        borderRadius: "20px",
        overflow: "hidden",
      }}
      title={
        <div
          className="d-flex justify-content-between align-items-center"
          style={{
            background: `url(${scHeaderBg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "100%",
            padding: "0px 24px",
            width: "100%",
          }}
        >
          <div
            className="d-flex justify-content-between align-items-center w-100"
            style={{ height: 88 }}
          >
            <div className="d-flex justify-content-between align-items-center gap-3">
              <div>
                <img width={42} height={42} src={scStrip} alt="close" />
              </div>
              <div>
                <div
                  className="text-white"
                  style={{ fontSize: 18, fontWeight: 500 }}
                >
                  Agent Mira
                </div>
                <span
                  className="text-white"
                  style={{ fontSize: 14, fontWeight: 400 }}
                >
                  Your personal medical assistant
                </span>
              </div>
            </div>
            <div>
              <img
                src={close}
                alt="close"
                className="cursor-pointer"
                onClick={handlePopup}
              />
            </div>
          </div>
        </div>
      }
      footer={null}
    >
      <div
        style={{
          height: 300,
          background: `url(${scBg})`,
          objectFit: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          padding: 24,
          overflow: "auto",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 600 }}>
          Symptoms & Medical History Shared by Patient
        </div>
        <div style={{ fontSize: 16, paddingBottom: 20 }}>
          You can edit these details after they are autofilled into the Rx Pad
          or Voice Rx.
        </div>

        {symptomCollector?.symptoms?.length > 0 && (
          <div
            style={{
              overflow: "auto",
              background: "white",
              padding: 18,
              borderRadius: 10,
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex gap-3 patient-details">
                <img src={symptoms} alt="symptoms" />
                <span style={{ color: "#454551" }}>Symptoms</span>
              </div>

              <span
                className="hyperling-text-style cursor-pointer"
                onClick={() => {
                  if (
                    selectedSymptoms.length === symptomCollector.symptoms.length
                  ) {
                    setSelectedSymptoms([]); // Unselect all
                  } else {
                    setSelectedSymptoms(
                      symptomCollector.symptoms.map((s) => s.name)
                    ); // Select all
                  }
                }}
              >
                {selectedSymptoms.length === symptomCollector.symptoms.length
                  ? "Unselect All"
                  : "Select All"}
              </span>
            </div>
            <Divider style={{ margin: "15px 0px" }} />
            <div className="space-y-6">
              {symptomCollector?.symptoms?.map((symptom, index) => (
                <div
                  key={index}
                  className="ml-3 mb-2 relative pl-4 d-flex gap-2"
                >
                  <span className="text-[14px] font-medium text-gray-900 mb-1">
                    <Checkbox
                      className="me-2"
                      checked={selectedSymptoms.includes(symptom.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSymptoms([
                            ...selectedSymptoms,
                            symptom.name,
                          ]);
                        } else {
                          setSelectedSymptoms(
                            selectedSymptoms.filter(
                              (name) => name !== symptom.name
                            )
                          );
                        }
                      }}
                    />
                    {symptom.name}
                  </span>
                  {(symptom.duration || symptom.severity || symptom.notes) && (
                    <span className="text-gray-400">
                      (
                      {symptom.duration && (
                        <>
                          Since:{" "}
                          <span className="text-gray-600">
                            {symptom.duration}
                          </span>{" "}
                          {symptom.severity && (
                            <span className="text-black">, </span>
                          )}
                        </>
                      )}
                      {symptom.severity && (
                        <span className="text-gray-600">
                          {symptom.severity}
                        </span>
                      )}
                      {symptom.notes && (
                        <span className="text-gray-600">{symptom.notes}</span>
                      )}
                      )
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {formattedMedicalHistory.length > 0 && (
          <div
            style={{
              overflow: "auto",
              background: "white",
              padding: 18,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex gap-3 patient-details">
                <img src={medicalHistory} alt="medical history" />
                <span style={{ color: "#454551" }}>Medical History</span>
              </div>
            </div>

            {formattedMedicalHistory.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-[16px] font-medium text-gray-900">
                    {section.title}
                  </span>
                  <span
                    className="text-primary cursor-pointer"
                    style={{ textDecoration: "underline" }}
                    onClick={() => {
                      const sectionItems = section.items.map(
                        (item) => item.name
                      );
                      if (
                        sectionItems.every((name) =>
                          selectedMedicalHistory.includes(name)
                        )
                      ) {
                        setSelectedMedicalHistory(
                          selectedMedicalHistory.filter(
                            (name) => !sectionItems.includes(name)
                          )
                        );
                      } else {
                        const newSelected = [
                          ...new Set([
                            ...selectedMedicalHistory,
                            ...sectionItems,
                          ]),
                        ];
                        setSelectedMedicalHistory(newSelected);
                      }
                    }}
                  >
                    Unselect All
                  </span>
                </div>

                <div
                  className="space-y-2"
                  style={{
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "16px",
                    border: "1px solid #F1F1F5",
                  }}
                >
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="d-flex align-items-start gap-2"
                      style={{
                        borderBottom:
                          itemIndex !== section.items.length - 1
                            ? "1px solid #F1F1F5"
                            : "none",
                        paddingBottom:
                          itemIndex !== section.items.length - 1 ? "12px" : "0",
                        marginBottom:
                          itemIndex !== section.items.length - 1 ? "12px" : "0",
                      }}
                    >
                      <Checkbox
                        className="me-2"
                        checked={selectedMedicalHistory.includes(item.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMedicalHistory([
                              ...selectedMedicalHistory,
                              item.name,
                            ]);
                          } else {
                            setSelectedMedicalHistory(
                              selectedMedicalHistory.filter(
                                (name) => name !== item.name
                              )
                            );
                          }
                        }}
                      />
                      {section.title === "Additional History" ? (
                        <div className="text-[14px] text-gray-900">
                          {item.displayText}
                        </div>
                      ) : (
                        <div className="text-[14px] text-gray-900">
                          <div className="d-flex gap-2 align-items-center flex-wrap">
                            <span className="font-medium">Issue :</span>
                            <span>{item.name}</span>
                            {item.duration && (
                              <>
                                <span className="font-medium">| Since :</span>
                                <span>{item.duration}</span>
                              </>
                            )}
                            {item.status && (
                              <>
                                <span className="font-medium">| Status :</span>
                                <span>{item.status}</span>
                              </>
                            )}
                            {item.medication && (
                              <>
                                <span className="font-medium">
                                  | Medication :
                                </span>
                                <span>{item.medication}</span>
                              </>
                            )}
                            {item.relation && (
                              <>
                                <span className="font-medium">
                                  | Relative :
                                </span>
                                <span>{item.relation}</span>
                              </>
                            )}
                          </div>
                          {item.notes && (
                            <div className="d-flex gap-2 align-items-center mt-1">
                              <span className="font-medium">Notes :</span>
                              <span>{item.notes}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          height: 88,
        }}
      >
        <Button
          className="btn btn-primary3 btn-41 px-4 d-flex align-items-center justify-content-center"
          style={{ gap: 10, width: "80%" }}
          onClick={handleAutofill}
        >
          <img src={autoFill} alt="auto-fill" />
          <span>Autofill details</span>
        </Button>
      </div>
    </Modal>
  );
};

export default SCPopup;
