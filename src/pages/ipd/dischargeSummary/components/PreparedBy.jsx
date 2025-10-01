import React, { useEffect } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import { setPreparedBy } from "../../../../redux/ipd/dischargeSummarySlice";
import { fetchFilters } from "../../../../redux/ipd/inPatientsSlice";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");

const PreparedBy = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { filters } = useSelector((state) => state.inPatients);
  const doctorsList = filters?.doctor || [];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFilters({ field: "doctor" }));
  }, [dispatch]);

  const renderPreparedByDoctor = (data) => {
    const options = (doctorsList || []).map((item) => ({
      key: JSON.stringify(item),
      value: item.name,
      label: <div key={item.id}>{item.name} {item?.role ? `(${item?.role})` : ""}</div>,
    }));
    
    return (
      <div>
        <label className="followup-label">
          {data?.title || "Prepared By"}
        </label>
        <Select
          mode="multiple"
          className="autocomplete-custom w-100 popinput inputheight41"
          placeholder="Select Doctors"
          options={options}
          value={dischargeSummaryData?.preparedBy || []}
          onChange={(values, options) => {
            if (!values || values.length === 0) {
              dispatch(setPreparedBy([]));
              return;
            }
            
            const selectedDoctors = values.map((value, index) => {
              const option = options[index];
              try {
                const parsed = option?.key ? JSON.parse(option.key) : null;
                if (parsed) {
                  return {
                    id: parsed.id,
                    name: parsed.name,
                    role: parsed.role
                  };
                } else {
                  return {
                    name: value
                  };
                }
              } catch (e) {
                return {
                  name: value
                };
              }
            });
            
            dispatch(setPreparedBy(selectedDoctors));
          }}
          onSearch={(q) =>
            dispatch(fetchFilters({ field: "doctor", search: q }))
          }
          showSearch
          allowClear
          optionLabelProp="label"
        />
      </div>
    );
  };

  const renderSection = () => {
    const preparedByItem = sectionData?.children?.find(
      (item) => item.id === "preparedByPerson"
    ) || { title: "Prepared By" };

    return (
      <div className="prepared-by-container">
        <div className="prepared-by-doctor-section">
          {renderPreparedByDoctor(preparedByItem)}
        </div>
      </div>
    );
  }

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={sectionData?.id ? dischargeSummaryIcons[`${sectionData.id}Dark`] : null}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly"
        }`}
        defaultOpen
      >
        {renderSection()}
      </CollapsibleWrapper>
    </>
  );
};

export default PreparedBy;
