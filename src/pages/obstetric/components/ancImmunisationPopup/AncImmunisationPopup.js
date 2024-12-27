import { Button, Checkbox, Input } from "antd";
import CommonModal from "../../../../common/CommonModal";
import alertIcon from "./../../../../assets/images/alertIcon.svg";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  addObstetricDetails,
  obstetricDetailsUpdated,
  patientDiagnosisUpdated,
} from "../../../../redux/obstetricSlice";
import { useDispatch } from "react-redux";
import {
  deleteCustomAncScheduler,
  deleteCustomImmunisation,
  upsertCustomAncScheduler,
  upsertCustomImmunisation,
} from "../../service";

const AncImmunisationPopup = ({
  popupType,
  onCancel,
  title,
  description,
  ancDetails,
  editIndex,
  activeCategory,
  ancSchedulerData,
}) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data } = state;
  const { obstetricDetails: allObstetricDetails } = useSelector(
    (state) => state.obstetric
  );
  const obstetricDetails = allObstetricDetails?.currentPregnancy || {};
  const { ancHistory = [], immunisationHistory = [] } = obstetricDetails;
  const { userId } = useSelector((state) => state.doctors);
  const [name, setName] = useState(
    ancDetails?.master?.name || ancDetails?.name
  );
  const [range, setRange] = useState({
    start: ancDetails?.weekRange?.start,
    end: ancDetails?.weekRange?.end,
  });
  const [shouldSelectForAllPatients, setShouldSelectForAllPatients] = useState(
    popupType !== "delete"
  );
  const trimesterRange =
    Number(range?.start) === 0 && Number(range?.end) === 0
      ? null
      : range.start >= 1 && range.start <= 12
      ? 0
      : range.start >= 13 && range.start <= 27
      ? 1
      : range.start < 55 &&
        range.end >= range.start &&
        Number(range?.start) !== 0
      ? 2
      : null;

  const trimesterList = ["First", "Second", "Third"];

  const addOrEditCustomScheduler = async () => {
    if (
      ancDetails?.isCustom ||
      (ancDetails?.masterId && editIndex >= 0) ||
      (ancDetails?.id &&
        (name !== ancDetails?.name ||
          range?.start !== ancDetails?.weekRange?.start ||
          range?.end !== ancDetails?.weekRange?.end)) ||
      shouldSelectForAllPatients
    ) {
      if (activeCategory >= 0) {
        if (shouldSelectForAllPatients) {
          const customSchedulerPayload = {
            id: ancDetails?.masterId || ancDetails?.id,
            name: name,
            weekRange: range,
            patient_unique_id: shouldSelectForAllPatients
              ? 0
              : patient_data.patient_unique_id,
          };
          const customSchedulerRes = await upsertCustomAncScheduler(
            customSchedulerPayload
          );
          ancDetails.id = customSchedulerRes?.id;
        }
      } else {
        if (shouldSelectForAllPatients) {
          const customSchedulerPayload = {
            id: ancDetails?.masterId || ancDetails?.id,
            name: name,
            patient_unique_id: shouldSelectForAllPatients
              ? 0
              : patient_data.patient_unique_id,
          };
          const customSchedulerRes = await upsertCustomImmunisation(
            customSchedulerPayload
          );
          ancDetails.id = customSchedulerRes?.id;
        }
      }
    }

    let newAncHistory = [...ancHistory];
    let newImmunisationHistory = [...immunisationHistory];
    if (activeCategory >= 0) {
      if (editIndex >= 0) {
        ancSchedulerData[activeCategory][editIndex] = {
          ...ancSchedulerData[activeCategory][editIndex],
          master: {
            name: name,
            weekRange: shouldSelectForAllPatients
              ? range
              : ancSchedulerData[activeCategory][editIndex]?.master?.weekRange,
          },
          weekRange: range,
          enablePrint: true,
          updated_at: new Date().toISOString(),
          updated_by: userId,
        };
        newAncHistory = ancSchedulerData.flat();
      } else {
        newAncHistory = [
          ...ancHistory,
          {
            masterId: ancDetails?.id,
            weekRange: range,
            dueDate: null,
            status: "Due",
            notes: null,
            enablePrint: false,
            master: {
              name: name,
            },
            createdAt: new Date().toISOString(),
            createdBy: userId,
            modifiedAt: new Date().toISOString(),
            modifiedBy: userId,
          },
        ];
      }
    } else {
      if (editIndex >= 0) {
        newImmunisationHistory[editIndex] = {
          ...newImmunisationHistory[editIndex],
          master: {
            name: name,
          },
          default: false,
          enablePrint: true,
          modifiedAt: new Date().toISOString(),
          modifiedBy: userId,
        };
      } else {
        newImmunisationHistory = [
          ...immunisationHistory,
          {
            masterId: ancDetails?.id,
            givenDate: null,
            status: "Due",
            notes: null,
            enablePrint: false,
            default: false,
            master: {
              name: name,
            },
            createdAt: new Date().toISOString(),
            createdBy: userId,
            modifiedAt: new Date().toISOString(),
            modifiedBy: userId,
          },
        ];
      }
    }

    const payload = {
      ...obstetricDetails,
      currentPregnancy: {
        ...obstetricDetails.currentPregnancy,
        ancHistory: newAncHistory,
        immunisationHistory: newImmunisationHistory,
      },
    };
    dispatch(addObstetricDetails(payload));
    dispatch(obstetricDetailsUpdated());
    onCancel();
  };

  const deleteCustomScheduler = () => {
    if (activeCategory >= 0) {
      ancSchedulerData[activeCategory][editIndex] = {
        ...ancSchedulerData[activeCategory][editIndex],
        deleted: true,
      };
      if (shouldSelectForAllPatients) {
        deleteCustomAncScheduler(
          ancSchedulerData[activeCategory][editIndex]?.masterId
        );
        ancSchedulerData[activeCategory].splice(editIndex, 1);
      }
      const newAncHistory = ancSchedulerData.flat();
      const payload = {
        ...obstetricDetails,
        currentPregnancy: {
          ...obstetricDetails?.currentPregnancy,
          ancHistory: newAncHistory,
        },
      };
      dispatch(addObstetricDetails(payload));
      dispatch(patientDiagnosisUpdated());
      dispatch(obstetricDetailsUpdated());
    } else {
      ancSchedulerData[editIndex] = {
        ...ancSchedulerData[editIndex],
        deleted: true,
      };
      if (shouldSelectForAllPatients) {
        ancSchedulerData.splice(editIndex, 1);
        deleteCustomImmunisation(ancSchedulerData[editIndex]?.masterId);
      }
      const payload = {
        ...obstetricDetails,
        currentPregnancy: {
          ...obstetricDetails?.currentPregnancy,
          immunisationHistory: ancSchedulerData,
        },
      };
      dispatch(addObstetricDetails(payload));
      dispatch(patientDiagnosisUpdated());
      dispatch(obstetricDetailsUpdated());
    }
    onCancel();
  };

  const handleSelectForAllPatients = () => {
    setShouldSelectForAllPatients((prev) => !prev);
  };

  return (
    <div>
      <CommonModal
        isModalOpen={popupType}
        onCancel={onCancel}
        modalWidth={500}
        title={title}
        modalBody={
          <>
            {popupType === "delete" ? (
              <>
                <div className="alert-warning rounded-10px p-2 patient-details">
                  <div className="d-flex align-items-center">
                    <img className="me-3" src={alertIcon} alt="Warning" />
                    <span>{description}</span>
                  </div>
                </div>
                <div
                  className="d-flex align-items-center"
                  style={{ paddingTop: 30, gap: 10 }}
                >
                  <Checkbox
                    onClick={handleSelectForAllPatients}
                    className="anc-custom-checkbox"
                  />
                  <div>Also remove from the default list</div>
                </div>
              </>
            ) : (
              <>
                <div className="d-flex gap-5 align-items-center">
                  <label className="d-flex" style={{ fontWeight: 500 }}>
                    Name <span className="bdg-danger">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ height: 38 }}
                    disabled={ancDetails?.master?.default}
                  />
                </div>

                {activeCategory >= 0 && (
                  <div>
                    <div className="d-flex gap-5 mt-4 align-items-center">
                      <label style={{ fontWeight: 500 }}>
                        Weeks<span className="bdg-danger">*</span>
                      </label>
                      <div className="d-flex gap-3 align-items-center">
                        <Input
                          value={range?.start}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                          onChange={(e) =>
                            setRange({ ...range, start: e.target.value })
                          }
                          style={{ width: 92, height: 38 }}
                        />
                        -
                        <Input
                          value={range?.end}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                          onChange={(e) =>
                            setRange({ ...range, end: e.target.value })
                          }
                          style={{ width: 92, height: 38 }}
                        />
                      </div>
                    </div>
                    {range?.start &&
                    range?.end &&
                    Number(range?.start) > Number(range?.end) ? (
                      <div className="mt-3 ancImmunisationWarning">
                        <span className="warningTip" />
                        Start date cannot be greater than End date
                      </div>
                    ) : trimesterRange && trimesterRange !== activeCategory ? (
                      <div className="mt-3 ancImmunisationWarning">
                        <span className="warningTip" />
                        <b>Week {range.start}</b> belongs to the
                        <b> {trimesterList[trimesterRange]} Trimester.</b> Upon
                        saving, this test will be moved to the{" "}
                        {trimesterList[trimesterRange]} Trimester.
                      </div>
                    ) : null}
                  </div>
                )}

                <div
                  className="d-flex align-items-center"
                  style={{ paddingTop: 30, gap: 10 }}
                >
                  <Checkbox
                    onClick={handleSelectForAllPatients}
                    className="anc-custom-checkbox"
                    checked={shouldSelectForAllPatients}
                  />
                  <div>
                    Set this {activeCategory >= 0 ? "test" : "vaccine"} as
                    default for all patients
                  </div>
                </div>
              </>
            )}

            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div
                  onClick={onCancel}
                  className="me-4 text-decoration-underline btn p-0 text-main"
                >
                  {popupType === "delete" ? "No, Keep it" : "Cancel"}
                </div>
                <Button
                  onClick={
                    popupType === "add" || popupType === "edit"
                      ? addOrEditCustomScheduler
                      : deleteCustomScheduler
                  }
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                  disabled={
                    (popupType === "add" || popupType === "edit") &&
                    (!name ||
                      Number(range?.end) === 0 ||
                      Number(range?.start) === 0 ||
                      ((!range?.start ||
                        !range?.end ||
                        Number(range?.start) > Number(range?.end)) &&
                        activeCategory >= 0))
                  }
                >
                  <span>
                    {popupType === "delete"
                      ? "Yes, Remove"
                      : popupType === "add"
                      ? activeCategory >= 0
                        ? "Add Custom Test"
                        : "Add Custom Vaccine"
                      : "save"}
                  </span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default AncImmunisationPopup;
