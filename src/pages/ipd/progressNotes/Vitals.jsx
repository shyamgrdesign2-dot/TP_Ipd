import React from "react";
import { IPD } from "../../../utils/locale";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { useSelector, useDispatch } from "react-redux";
import { setVitals } from "../../../redux/ipd/progressNotesSlice";

const UnitInput = createRemoteComponent("UnitInput");

const Vitals = (props) => {
  const { isEditable = true, onAutofill } = props || {};
  const { vitals } = useSelector((state) => state.progressNotes);
  const dispatch = useDispatch();

  const handleAutofill = () => {
    if (onAutofill) {
      onAutofill();
    }
  };

  return (
    <div className="ipdcn-vitals-main-container">
      <div className="ipdaf-vitals-header">
        <img src={defaultIcons.vitals} alt="vitals" />
        <div>{"Vitals"}</div>
      </div>
      <div className="ipdcn-vitals-container">
        {IPD.PROGRESS_NOTES_VITALS?.map((vital) => {
          return (
            <div className="input-container">
              <UnitInput
                containerStyle={{ marginBottom: "20px" }}
                onChange={(e) =>
                  dispatch(setVitals({ ...vitals, [vital.name]: e }))
                }
                value={vitals?.[vital?.name]}
                type="text"
                inputMode="decimal"
                {...vital}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Vitals;
