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
import { splitByTrimester } from "../../utils/helper";
import { upsertCustomAncScheduler } from "../../service";

const AncImmunisationPopup = ({
  popupType,
  onCancel,
  title,
  description,
  ancDetails,
  editIndex,
  activeCategory,
}) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data } = state;
  const { obstetricDetails } = useSelector((state) => state.obstetric);
  const { ancHistory = [] } = obstetricDetails;
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

  const addOrEditCustomScheduler = async () => {
    if (ancDetails?.isCustom) {
      const customSchedulerPayload = {
        name: ancDetails?.name,
        weekRange: range,
        patient_unique_id: shouldSelectForAllPatients
          ? 0
          : patient_data.patient_unique_id,
      };
      const customSchedulerRes = await upsertCustomAncScheduler(
        customSchedulerPayload
      );
    }

    let newAncHistory = [...ancHistory];
    if (editIndex >= 0) {
      const ancSchedulerData = splitByTrimester(ancHistory);
      ancSchedulerData[activeCategory][editIndex] = {
        ...ancSchedulerData[activeCategory][editIndex],
        name: name,
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
          enablePrint: true,
          master: {
            name: name,
          },
          created_at: new Date().toISOString(),
          created_by: userId,
          updated_at: new Date().toISOString(),
          updated_by: userId,
        },
      ];
    }

    const payload = {
      ...obstetricDetails,
      patientId: patient_data.patient_unique_id,
      ancHistory: newAncHistory,
    };
    dispatch(addObstetricDetails(payload));
    dispatch(patientDiagnosisUpdated());
    dispatch(obstetricDetailsUpdated());
    onCancel();
  };

  const deleteCustomScheduler = () => {
    const ancSchedulerData = splitByTrimester(ancHistory);
    ancSchedulerData[activeCategory].splice(editIndex, 1);
    const newAncHistory = ancSchedulerData.flat();
    const payload = {
      ...obstetricDetails,
      patientId: patient_data.patient_unique_id,
      ancHistory: newAncHistory,
    };
    dispatch(addObstetricDetails(payload));
    dispatch(patientDiagnosisUpdated());
    dispatch(obstetricDetailsUpdated());
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

                <div className="d-flex gap-5 mt-4 align-items-center">
                  <label style={{ fontWeight: 500 }}>
                    Weeks<span className="bdg-danger">*</span>
                  </label>
                  <div className="d-flex gap-3 align-items-center">
                    <Input
                      value={range?.start}
                      onChange={(e) =>
                        setRange({ ...range, start: e.target.value })
                      }
                      style={{ width: 92, height: 38 }}
                    />
                    -
                    <Input
                      value={range?.end}
                      onChange={(e) =>
                        setRange({ ...range, end: e.target.value })
                      }
                      style={{ width: 92, height: 38 }}
                    />
                  </div>
                </div>

                <div
                  className="d-flex align-items-center"
                  style={{ paddingTop: 30, gap: 10 }}
                >
                  <Checkbox
                    onClick={handleSelectForAllPatients}
                    className="anc-custom-checkbox"
                    checked={shouldSelectForAllPatients}
                  />
                  <div>Set this test as default for all patients</div>
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
                    (!name || !range?.start || !range?.end)
                  }
                >
                  <span>
                    {popupType === "delete"
                      ? "Yes, Remove"
                      : popupType === "add"
                      ? "Add Custom Test"
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
