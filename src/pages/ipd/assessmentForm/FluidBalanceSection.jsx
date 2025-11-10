import React, { useEffect } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import defaultIcons from "../../../assets/images/indices";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setFluidBalance } from "../../../redux/ipd/consultantNotesSlice";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const UnitInput = createRemoteComponent("UnitInput");

const FluidBalanceSection = ({ sectionData = {}, isEditable = true }) => {
  const { fluidBalance = {} } = useSelector((state) => state.consultantNotes);
  const dispatch = useDispatch();

  useEffect(() => {
    const input = parseFloat(fluidBalance?.fluidInput) || 0;
    const output = parseFloat(fluidBalance?.fluidOutput) || 0;
    const balance = input - output;

    if (fluidBalance?.balance !== balance) {
      dispatch(setFluidBalance({ ...fluidBalance, balance }));
    }
  }, [fluidBalance?.fluidInput, fluidBalance?.fluidOutput]);

  const handleFluidBalanceEdit = (value, key) => {
    dispatch(setFluidBalance({ ...fluidBalance, [key]: parseFloat(value) }));
  };
  const renderEditableMetrics = () => {
    return (
      <div className="ipd-fluid-item-section-container">
        {sectionData?.children
          ?.filter((config) => config.enabled)
          ?.map((config) => {
            const {
              children: _omitChildren,
              dangerouslySetInnerHTML: _omitDsi,
              ...configProps
            } = config || {};
            const isBalance = config.id === "balance";
            return (
              <div className="input-container" key={config.id}>
                <UnitInput
                  key={config.id}
                  containerStyle={{ marginBottom: "20px" }}
                  onChange={
                    isBalance
                      ? undefined
                      : (e) => handleFluidBalanceEdit(e, config.id)
                  }
                  value={fluidBalance?.[config.id]}
                  type="number"
                  inputMode="numeric"
                  label={config.label}
                  unit={"ml"}
                  disabled={isBalance}
                  {...configProps}
                  placeholder={config.placeholder}
                />
              </div>
            );
          })}
      </div>
    );
  };

  const renderChildren = () => {
    return (
      <div className="fluid-balance-section-container">
        {renderEditableMetrics()}
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
