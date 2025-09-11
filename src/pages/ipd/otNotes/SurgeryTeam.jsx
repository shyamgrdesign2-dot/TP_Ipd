import React, { useEffect, useMemo } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/icons/assessments";
import { defaultIcons } from "../../../assets/images/icons";
import "./surgeryDetails.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import {
  setSurgeryTeam,
} from "../../../redux/ipd/otNotesSlice";
import { fetchFilters } from "../../../redux/ipd/inPatientsSlice";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");

const SurgeryTeam = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { surgeryTeam } = useSelector(
    (state) => state.otNotes
  );
  const { filters } = useSelector((state) => state.inPatients);
  const doctorsList = filters?.doctor || [];
  const initialValue = useMemo(() => surgeryTeam || {}, [surgeryTeam]);
  const dispatch = useDispatch();

  const teamRoles = [
    { id: "primarySurgeon", name: "Primary Surgeon" },
    { id: "secondarySurgeon", name: "Secondary Surgeon" },
    { id: "assistant", name: "Assistant" },
    { id: "anaesthesiologist", name: "Anaesthesiologist" },
    { id: "scrubNurse", name: "Scrub Nurse" },
    { id: "floorCirculatingNurse", name: "Floor/ Circulating Nurse" },
  ];

  useEffect(() => {
    dispatch(fetchFilters({ field: "doctor" }));
  }, [])


  const renderChildren = () => {
    return (
      <div className="ipdot-st-section-container">
        {teamRoles?.map((role) => {
          return renderSection(role);
        })}
      </div>
    );
  };

  const renderSection = (role) => {
    const options = (doctorsList || []).map((item) => ({
      key: JSON.stringify(item),
      value: item.name,
      label: <div key={item.id}>{item.name}</div>,
    }));
    return (
      <div className="ipdot-st-section">
        <label className="surgery-label">{role.name}</label>
        <Select
          showSearch
          optionLabelProp="label"
          options={options}
          value={initialValue?.[role.id]?.name || undefined}
          className="autocomplete-custom w-100 popinput inputheight41"
          placeholder={`Select ${role.name}`}
          onSearch={(q) => dispatch(fetchFilters({ field: "doctor", search: q }))}
          allowClear
          onChange={(value, option) => {
            if (value === undefined || value === null) {
              dispatch(setSurgeryTeam({ roleId: role.id, value: {} }));
              return;
            }
            try {
              const parsed = option?.key ? JSON.parse(option.key) : null;
              dispatch(setSurgeryTeam({ roleId: role.id, value: parsed }));
            } catch (e) {
              dispatch(setSurgeryTeam({ roleId: role.id, value: value }));
            }
          }}
        />
      </div>
    );
  };

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        icon={assessmentsIcons[sectionData?.icon]}
        collapsible={isEditable}
        width={"100%"}
        className={"collapsible-wrapper-class"}
        data-testid={sectionData?.title}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper>
    </>
  );
};

export default SurgeryTeam;
