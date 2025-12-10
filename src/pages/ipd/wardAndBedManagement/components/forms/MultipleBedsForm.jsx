import React from "react";
import { Button, Input, InputNumber, Tooltip } from "antd";
import { BED_NAME_FORMAT } from "../../constants";
import {
  NumberOfBedsTooltip,
  BedNameFormatTooltip,
  PrefixTextTooltip,
  StartingNumberTooltip,
} from "../tooltips/BedFormTooltips";
import { defaultIcons } from "../../../../../assets/images/icons";
import infoIcon from "../../../../../assets/images/icons/info.svg";

const MultipleBedsForm = ({
  numberOfBeds,
  setNumberOfBeds,
  bedNameFormat,
  setBedNameFormat,
  prefixText,
  setPrefixText,
  suffixText,
  setSuffixText,
  startingNumber,
  setStartingNumber,
  bedPreview,
  onAddBed,
  isAddBedDisabled,
}) => {
  return (
    <>
      {/* Number of Beds */}
      <div className="add-beds-form-field">
        <label className="add-beds-form-label">
          How many beds do you want to add?
          <span className="required-asterisk">*</span>
          <Tooltip
            title={<NumberOfBedsTooltip />}
            overlayClassName="ipd-beds-tooltip"
            placement="top"
          >
            <img
              src={infoIcon}
              className="icon-info add-beds-info-icon"
              alt="Info"
            />
          </Tooltip>
        </label>
        <InputNumber
          value={numberOfBeds}
          onChange={setNumberOfBeds}
          placeholder="Eg: 10"
          min={1}
          className="add-beds-number-input"
          controls={false}
        />
      </div>

      {/* Bed Name Format */}
      <div className="add-beds-form-field">
        <label className="add-beds-form-label">
          Select how the bed names should appear
          <span className="required-asterisk">*</span>
          <Tooltip
            title={<BedNameFormatTooltip />}
            overlayClassName="ipd-beds-tooltip"
            placement="top"
          >
            <img
              src={infoIcon}
              className="icon-info add-beds-info-icon"
              alt="Info"
            />
          </Tooltip>
        </label>
        <div className="bed-name-format-buttons">
          <button
            className={`format-button ${
              bedNameFormat === BED_NAME_FORMAT.PREFIX ? "active" : ""
            }`}
            onClick={() => setBedNameFormat(BED_NAME_FORMAT.PREFIX)}
          >
            Prefix
          </button>
          <button
            className={`format-button ${
              bedNameFormat === BED_NAME_FORMAT.SUFFIX ? "active" : ""
            }`}
            onClick={() => setBedNameFormat(BED_NAME_FORMAT.SUFFIX)}
          >
            Suffix
          </button>
          <button
            className={`format-button ${
              bedNameFormat === BED_NAME_FORMAT.BOTH ? "active" : ""
            }`}
            onClick={() => setBedNameFormat(BED_NAME_FORMAT.BOTH)}
          >
            Both
          </button>
          <button
            className={`format-button ${
              bedNameFormat === BED_NAME_FORMAT.NONE ? "active" : ""
            }`}
            onClick={() => setBedNameFormat(BED_NAME_FORMAT.NONE)}
          >
            None
          </button>
        </div>
      </div>

      {/* Prefix Text */}
      {(bedNameFormat === BED_NAME_FORMAT.PREFIX ||
        bedNameFormat === BED_NAME_FORMAT.BOTH) && (
        <div className="add-beds-form-field">
          <label className="add-beds-form-label">
            Text to add before the bed number (Prefix)
            <span className="required-asterisk">*</span>
            <Tooltip
              title={<PrefixTextTooltip />}
              overlayClassName="ipd-beds-tooltip"
              placement="top"
            >
              <img
                src={infoIcon}
                className="icon-info add-beds-info-icon"
                alt="Info"
              />
            </Tooltip>
          </label>
          <Input
            value={prefixText}
            onChange={(e) => setPrefixText(e.target.value)}
            placeholder="Eg: BED_"
            className="add-beds-text-input"
          />
        </div>
      )}

      {/* Suffix Text */}
      {(bedNameFormat === BED_NAME_FORMAT.SUFFIX ||
        bedNameFormat === BED_NAME_FORMAT.BOTH) && (
        <div className="add-beds-form-field">
          <label className="add-beds-form-label">
            Text to add after the bed number (Suffix)
            <span className="required-asterisk">*</span>
            <Tooltip
              title={<PrefixTextTooltip />}
              overlayClassName="ipd-beds-tooltip"
              placement="top"
            >
              <img
                src={infoIcon}
                className="icon-info add-beds-info-icon"
                alt="Info"
              />
            </Tooltip>
          </label>
          <Input
            value={suffixText}
            onChange={(e) => setSuffixText(e.target.value)}
            placeholder="Eg: _BED"
            className="add-beds-text-input"
          />
        </div>
      )}

      {/* Starting Number */}
      <div className="add-beds-form-field">
        <label className="add-beds-form-label">
          Starting number for the beds
          <span className="required-asterisk">*</span>
          <Tooltip
            title={<StartingNumberTooltip />}
            overlayClassName="ipd-beds-tooltip"
            placement="top"
          >
            <img
              src={infoIcon}
              className="icon-info add-beds-info-icon"
              alt="Info"
            />
          </Tooltip>
        </label>
        <Input
          value={startingNumber}
          onChange={(e) => setStartingNumber(e.target.value)}
          placeholder="Eg: 01"
          className="add-beds-text-input"
        />
      </div>

      {/* Bed Preview */}
      {bedPreview && (
        <div className="bed-preview">
          <span className="bed-preview-label">Bed No. Preview:</span>
          <span className="bed-preview-value">{bedPreview}</span>
        </div>
      )}

      {/* Add Bed Button */}
      <Button
        type="primary"
        icon={<img src={defaultIcons.plusIcon} alt="+" />}
        onClick={onAddBed}
        disabled={isAddBedDisabled}
        className="add-bed-button"
      >
        Add Bed
      </Button>
    </>
  );
};

export default React.memo(MultipleBedsForm);
