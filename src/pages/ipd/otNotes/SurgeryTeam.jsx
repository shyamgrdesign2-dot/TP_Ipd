import React, { useEffect, useMemo } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import "./surgeryDetails.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import { setSurgeryTeam } from "../../../redux/ipd/otNotesSlice";
import { fetchFilters } from "../../../redux/ipd/inPatientsSlice";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");

const SurgeryTeam = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { surgeryTeam } = useSelector((state) => state.otNotes);
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
  }, []);

  const renderChildren = (data) => {
    return (
      <div className="ipdot-st-section-container">
        {data.children?.filter(item => item.enabled)?.map((role) => {
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
        <label className="otNotes-label">{role.name || role.title}</label>
        <Select
          showSearch
          optionLabelProp="label"
          mode="multiple"
          options={options}
          value={
            Array.isArray(initialValue?.[role.id]) 
              ? initialValue[role.id].map(item => item.name || item)
              : undefined
          }
          className="multiple-select-custom autocomplete-custom w-100 popinput inputheight41"
          placeholder={`Select ${role.name || role.title}`}
          onSearch={(q) =>
            dispatch(fetchFilters({ field: "doctor", search: q }))
          }
          allowClear
          onChange={(values, options) => {
            if (!values || values.length === 0) {
              dispatch(setSurgeryTeam({ roleId: role.id, value: [] }));
              return;
            }
            
            const parsedValues = [];
            
            if (Array.isArray(options)) {
              // Handle multiple selections
              options.forEach((option, index) => {
                try {
                  const parsed = option?.key ? JSON.parse(option.key) : null;
                  if (parsed) {
                    parsedValues.push(parsed);
                  } else {
                    parsedValues.push({ name: values[index] });
                  }
                } catch (e) {
                  parsedValues.push({ name: values[index] });
                }
              });
            } else {
              // Handle single selection (fallback)
              try {
                const parsed = options?.key ? JSON.parse(options.key) : null;
                if (parsed) {
                  parsedValues.push(parsed);
                } else {
                  parsedValues.push({ name: values });
                }
              } catch (e) {
                parsedValues.push({ name: values });
              }
            }
            
            dispatch(setSurgeryTeam({ roleId: role.id, value: parsedValues }));
          }}
        />
      </div>
    );
  };

  return (
    <div className="ipdot-st-section-container">
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={sectionData?.id ? otNotesIcons[`${sectionData.id}Dark`] : null}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly"
        }`}
        defaultOpen
      >
        {renderChildren(sectionData)}
      </CollapsibleWrapper>
    </div>
  );
};

export default SurgeryTeam;
