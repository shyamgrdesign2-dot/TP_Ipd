// import React, { useState, useMemo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import { DatePicker, Card } from "antd";

// import dayjs from "dayjs";
// import {
//   setCurrentConsultantNote,
//   setClinicalAssessmentPlan,
//   setVitals,
//   setLabInvestigation,
//   setAdditionalRemarks,
// } from "../../../redux/ipd/consultantNotesSlice";
// import { setMedicationData } from "../../../redux/prescriptionSlice";
// import "./styles.scss";
// import { createRemoteComponent } from "../../../shared/remoteComponents";
// import { defaultIcons } from "../../../assets/images/icons/index.js";
// import {
//   MedicineTable,
//   LabInvestigationTable,
// } from "../../../components/ReusableTable";

// const ReusableProgressCard = createRemoteComponent("ReusableProgressCard");
// const ReusableStepper = createRemoteComponent("ReusableStepper");
// const RichTextEditor = createRemoteComponent("RichTextEditor");

// const OtNotesTimeline = () => {
//   const otNotesState = useSelector((state) => state.otNotes);
//   console.log('INTEL ==> otNotesState', otNotesState)
//   const { state } = useLocation();
//   const { patient_data, patientDetails } = state || {};
//   const [filterDate, setFilterDate] = useState(null);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Filter notes by date if filter is applied
//   const filteredNotes = useMemo(() => {
//     if (!filterDate) return otNotesState || [];

//     return (otNotesState || []).filter((note) => {
//       const noteDate = dayjs(note.createdAt);
//       const filterDateValue = dayjs(filterDate);
//       return noteDate.isSame(filterDateValue, "day");
//     });
//   }, [otNotesState, filterDate]);

//   // Sort notes by date (newest first)
//   const sortedNotes = useMemo(() => {
//     return [...filteredNotes].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );
//   }, [filteredNotes]);

//   // Handle edit button click
//   const handleEditNote = (note) => {
//     console.log('INTEL ==> edit note', note)
//   };

//   const handleReusableItemEvent = (eventName, payload) => {
//     if (eventName === "edit") {
//       const note = payload?.data;
//       console.log('INTEL ==> edit note', note)
//     }
//   };

//   // Event handlers for group header actions (download, print)
//   const handleGroupHeaderAction = (action, groupKey, groupData) => {
//     console.log(`Group Header ${action}:`, { groupKey, groupData });
//     addEvent(`Group Header - ${action}`, { groupKey, groupData });
//   };

//   // Custom render functions for ReusableStepper
//   const renderCustomGroupHeader = (groupKey, groupData, emit) => {
//     const date = new Date(groupKey);
//     const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
//       month: "short",
//     })}, ${date.getFullYear()}`;

//     return (
//       <Card className="medical-progress__date-header-card">
//         <div className="medical-progress__content-date">
//           <img
//             className="medical-progress__content-calendar-icon"
//             style={{ fill: "#581C87" }}
//             src={defaultIcons.calendarIcon}
//             alt=""
//           />
//           <span className="medical-progress__content-date-text">
//             {formattedDate}
//           </span>
//           <img
//             className="medical-progress__content-download-icon"
//             style={{ fill: "#581C87", cursor: "pointer" }}
//             src={defaultIcons.downloadIcon}
//             alt="Download"
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               handleGroupHeaderAction("Download", groupKey, groupData);
//               // Also emit the event for the stepper
//               if (emit) {
//                 emit("groupHeaderAction", {
//                   action: "download",
//                   groupKey,
//                   groupData,
//                 });
//               }
//             }}
//             title="Download this date's consultant notes"
//           />
//           <img
//             className="medical-progress__content-print-icon"
//             style={{ fill: "#581C87", cursor: "pointer" }}
//             src={defaultIcons.printerIcon}
//             alt="Print"
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               handleGroupHeaderAction("Print", groupKey, groupData);
//               // Also emit the event for the stepper
//               if (emit) {
//                 emit("groupHeaderAction", {
//                   action: "print",
//                   groupKey,
//                   groupData,
//                 });
//               }
//             }}
//             title="Print this date's consultant notes"
//           />
//           <img
//             className="medical-progress__content-calendar-icon"
//             style={{ fill: "#581C87", cursor: "pointer" }}
//             src={defaultIcons.editIcon}
//             alt="Edit"
//             onClick={() => handleEditNote(groupData?.[0]?.raw)}
//             title="Edit this date's consultant notes"
//           />
//         </div>
//       </Card>
//     );
//   };

//   const renderCustomItem = (item, itemIndex, groupKey, items, emit) => {
//     const value = item.period || item.timeOfDay || "";
//     const formattedTimeOfDay = value.charAt(0).toUpperCase() + value.slice(1);

//     return (
//       <ReusableProgressCard
//         record={{
//           id: "1",
//           sections: [
//             {
//               key: "clinicalAssessmentPlan",
//               title: "Clinical Assessment & Plan",
//               data: item.clinicalAssessmentPlan,
//               type: "richtext",
//             },
//             {
//               key: "vitals",
//               title: "Vitals",
//               data: item.vitals,
//               type: "richtext",
//             },
//             {
//               key: "currentMedication",
//               title: "Medication(Rx)",
//               data: item.currentMedication,
//               type: "table",
//             },
//             {
//               key: "labInvestigation",
//               title: "Lab Investigation",
//               data: item.labInvestigation,
//               type: "lab-table",
//             },
//             {
//               key: "additionalRemarks",
//               title: "Additional Remarks",
//               data: item.additionalRemarks,
//               type: "richtext",
//             },
//           ],
//           filledBy: item.filledBy,
//           role: "Consultant",
//         }}
//         components={{
//           RichTextEditor,
//           MedicineTable,
//           LabInvestigationTable,
//         }}
//         icons={{
//           timeIcons: {
//             morning: defaultIcons.clockIcon,
//             afternoon: defaultIcons.clockIcon,
//             evening: defaultIcons.clockIcon,
//             night: defaultIcons.clockIcon,
//           },
//           sectionIcons: {
//             clinicalAssessmentPlan: defaultIcons.basicInfoBg,
//             vitals: defaultIcons.physicalExam,
//             currentMedication: defaultIcons.funcAssess,
//             labInvestigation: defaultIcons.treatment,
//             additionalRemarks: defaultIcons.noteColoured,
//           },
//           actionIcons: {
//             download: defaultIcons.downloadIcon,
//             print: defaultIcons.printerIcon,
//             edit: defaultIcons.editIcon,
//           },
//         }}
//         showHeader={false} // No time header
//         className="detailed-medical-card"
//         onAction={(eventName, payload) =>
//           emit(eventName, { ...payload, data: item })
//         }
//       />
//     );
//   };

//   // Helper function to add events to the log
//   const addEvent = (eventType, data) => {
//     const newEvent = {
//       id: Date.now(),
//       timestamp: new Date().toLocaleTimeString(),
//       type: eventType,
//       data: data,
//     };
//     // setEvents((prev) => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
//   };

//   const mappedData = useMemo(() => {
//     // if (!Array.isArray(otNotesState)) return [];
//     return [1,2,4].map((entry) => {
//       const pn = entry?.otNotes || {};
//       const dateIso = pn?.date ? new Date(pn.date) : null;
//       const timeIso = pn?.time ? new Date(pn.time) : null;
//       const formattedDate = dateIso
//         ? `${dateIso.getFullYear()}-${String(dateIso.getMonth() + 1).padStart(
//             2,
//             "0"
//           )}-${String(dateIso.getDate()).padStart(2, "0")}`
//         : undefined;
//       return {
//         // identifiers and raw source to support edit flow
//         _id: entry?._id,
//         raw: entry,
//         date: formattedDate,
//         period: pn?.period,
//         time: timeIso ? timeIso.toLocaleTimeString() : undefined,
//         timestamp: pn?.time,
//         clinicalAssessmentPlan: pn?.clinicalAssessmentPlan,
//         vitals: pn?.vitals,
//         currentMedication: pn?.currentMedication,
//         labInvestigation: pn?.labInvestigation,
//         additionalRemarks: pn?.additionalRemarks,
//         filledBy: entry?.createdBy ? `Dr. ${entry.createdBy}` : undefined,
//         role: undefined,
//       };
//     });
//   }, [otNotesState]);

//   return (
//     <div className="consultant-notes-timeline">
//       {/* Filter Section */}
//       {/* <div className="timeline-filter">
//         <div className="timeline-filter-left">
//           <DatePicker
//             placeholder="Filter by Date"
//             value={filterDate}
//             onChange={setFilterDate}
//             allowClear
//             format="DD MMM YYYY"
//             className="timeline-date-filter"
//           />
//         </div>
//       </div> */}

//       <ReusableStepper
//         data={mappedData}
//         groupBy={(item) =>
//           item.date || item.timestamp?.split(" ")[0] || "Unknown"
//         }
//         sortGroups={(a, b) => new Date(b) - new Date(a)}
//         renderGroupHeader={renderCustomGroupHeader}
//         renderItem={renderCustomItem}
//         onItemEvent={handleReusableItemEvent}
//         layout={{
//           gridGutter: [16, 16],
//           colProps: { xs: 24, sm: 12, lg: 8 },
//           stepDirection: "vertical",
//           currentStep: -1,
//         }}
//         toolbar={{ show: false }}
//       />
//     </div>
//   );
// };

// export default OtNotesTimeline;

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Card, DatePicker } from "antd";
import dayjs from "dayjs";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons/index.js";
import {
  MedicineTable,
  LabInvestigationTable,
} from "../../../components/ReusableTable";

const ReusableProgressCard = createRemoteComponent("ReusableProgressCard");
const ReusableStepper = createRemoteComponent("ReusableStepper");
const RichTextEditor = createRemoteComponent("RichTextEditor");

const OtNotesTimeline = () => {
  const otNotesState = useSelector((state) => state.otNotes);
  console.log('INTEL ==> otnotesstate', otNotesState)
  const { state } = useLocation();
  const { patient_data, patientDetails } = state || {};
  const [filterDate, setFilterDate] = useState(null);

  const renderCustomGroupHeader = (groupKey, groupData, emit) => {
    return (
      <Card className="medical-progress__content-header">
        <div className="medical-progress__content-header-left">
          <span className="medical-progress__content-header-date">
            {dayjs(groupKey).format("DD MMM YYYY")}
          </span>
        </div>
        <div className="medical-progress__content-header-right">
          <img
            className="medical-progress__content-download-icon"
            style={{ fill: "#581C87", cursor: "pointer" }}
            src={defaultIcons.downloadIcon}
            alt="Download"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // handleGroupHeaderAction("Download", groupKey, groupData);
              if (emit) {
                emit("groupHeaderAction", {
                  action: "download",
                  groupKey,
                  groupData,
                });
              }
            }}
            title="Download this date's OT notes"
          />
          <img
            className="medical-progress__content-print-icon"
            style={{ fill: "#581C87", cursor: "pointer" }}
            src={defaultIcons.printerIcon}
            alt="Print"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              //handleGroupHeaderAction("Print", groupKey, groupData);
              if (emit) {
                emit("groupHeaderAction", {
                  action: "print",
                  groupKey,
                  groupData,
                });
              }
            }}
            title="Print this date's OT notes"
          />
        </div>
      </Card>
    );
  };

  const renderCustomItem = (item, itemIndex, groupKey, items, emit) => {
    console.log('INTEL ==>item', item)
    return (
        <div>{item.title || item.id}</div>
    //   <ReusableProgressCard
    //     record={{
    //       id: "1",
    //       sections: [
    //         {
    //           key: "surgeryDetails",
    //           title: "Surgery Details",
    //           data: item.surgeryDetails,
    //           type: "richtext",
    //         },
    //         {
    //           key: "surgeryTeam", 
    //           title: "Surgery Team",
    //           data: item.surgeryTeam,
    //           type: "richtext",
    //         },
    //         {
    //           key: "operativeNotes",
    //           title: "Operative Notes",
    //           data: item.operativeNotes,
    //           type: "richtext",
    //         },
    //         {
    //           key: "intraOperativeNotes",
    //           title: "Intra-Operative Notes",
    //           data: item.intraOperativeNotes,
    //           type: "richtext",
    //         },
    //         {
    //           key: "postOperativeNotes",
    //           title: "Post-Operative Notes",
    //           data: item.postOperativeNotes,
    //           type: "richtext",
    //         }
    //       ],
    //       filledBy: item.filledBy,
    //       role: "Surgeon",
    //     }}
    //     components={{
    //       RichTextEditor,
    //       MedicineTable,
    //       LabInvestigationTable,
    //     }}
    //     icons={{
    //       sectionIcons: {
    //         surgeryDetails: defaultIcons.basicInfoBg,
    //         surgeryTeam: defaultIcons.physicalExam,
    //         operativeNotes: defaultIcons.funcAssess,
    //         intraOperativeNotes: defaultIcons.treatment,
    //         postOperativeNotes: defaultIcons.noteColoured,
    //       },
    //       actionIcons: {
    //         download: defaultIcons.downloadIcon,
    //         print: defaultIcons.printerIcon,
    //       },
    //     }}
    //     showHeader={false}
    //     className="detailed-medical-card"
    //     onAction={(eventName, payload) =>
    //       emit(eventName, { ...payload, data: item })
    //     }
    //   />
    );
  };

  const handleReusableItemEvent = (eventName, payload) => {
    console.log("Event:", eventName, payload);
  };

  const mappedData = useMemo(() => {
    console.log('INTEL ==> X', otNotesState.otNotesData)
    if (!Array.isArray(otNotesState.otNotesData)) return [];
    const x= otNotesState.otNotesData.map((entry) => {
      const pn = entry?.otNotes || {};
      const dateIso = entry?.createdAt ? new Date(entry?.createdAt) : null;
      return {
        date: dateIso?.toISOString(),
        renderStepItem: (x,y,z,k) => {
            console.log('INTEL ==> x,y,z,k', x,y,z,k)
            return (
                <div className="intellasdfsafsdf">hello</div>
            )
        }
      };
    });
    console.log('INTEL ==> X',x)
    return x;
  }, [otNotesState.otNotesData]);


  return (
    <div className="ot-notes-timeline">
      <ReusableStepper
        data={mappedData}
        groupBy={(item) =>
          item.date || item.timestamp?.split(" ")[0] || "Unknown"
        }
        sortGroups={(a, b) => new Date(b) - new Date(a)}
        renderGroupHeader={renderCustomGroupHeader}
        renderItem={renderCustomItem}
        onItemEvent={handleReusableItemEvent}
        layout={{
          gridGutter: [16, 16],
          colProps: { xs: 24, sm: 12, lg: 8 },
          stepDirection: "vertical",
          currentStep: -1,
        }}
        toolbar={{ show: true, label: 'All dates' }}
      />
    </div>
  );
};

export default OtNotesTimeline;
