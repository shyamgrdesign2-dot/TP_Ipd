import React from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import defaultIcons from "../../../assets/images/indices";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const UnitInput = createRemoteComponent("UnitInput");

const FluidBalanceSection = ({
  sectionData = {},
  isEditable = true,
  fluidBalanceData = {},
  setFluidBalanceData = () => {},
}) => {
  const renderEditableMetrics = (item) => {
    return (
      <div className="ipd-fluid-item-section-container">
        <div className="">
          <div className="" key={item.id}>
            <UnitInput
              key={item.id}
              containerStyle={{ marginBottom: "20px" }}
              //   onChange={(e) => handleChange(e, item.id, item.id)}
              //   value={fluidBalanceData?.[item.id]}
            //   value={""}
              type="text"
              inputMode="text"
              label={item.label}
              unit={item?.unit || null}
              {...item}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderChildren = () => {
    const enabledItems = sectionData?.children?.filter((item) => item.enabled);
    return (
      <div className="fluid-balance-section-container">
        {enabledItems?.map((item) => {
          return renderEditableMetrics(item);
        })}
      </div>
    );
  };

  return (
    <div>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={sectionData?.id ? defaultIcons[`${sectionData.id}Dark`] : null}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable
            ? ""
            : "collapsible-wrapper-class-readonly ipdot-ion-readonly readonly-container-box"
        }`}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper>
    </div>
  );
};

export default FluidBalanceSection;
