export const NumberOfBedsTooltip = () => (
  <div className="ipd-beds-tooltip-content">
    <p>
      For example, if you type <strong>10</strong>, the system will create{" "}
      <strong>10 beds</strong> automatically.
    </p>
  </div>
);

export const BedNameFormatTooltip = () => (
  <div className="ipd-beds-tooltip-content">
    <p className="mb-0">Choose how you want the bed name to look.</p>
    <ul>
      <li>
        <strong>Prefix</strong> adds text before the number{" "}
        <strong>(BED_01)</strong>.
      </li>
      <li>
        <strong>Suffix</strong> adds text after the number{" "}
        <strong>(01_BED)</strong>.
      </li>
      <li>
        Select <strong>'None'</strong> if you only want numbers{" "}
        <strong>(01)</strong>.
      </li>
    </ul>
  </div>
);

export const PrefixTextTooltip = () => (
  <div className="ipd-beds-tooltip-content">
    <p className="mb-0">
      Type the word or letter you want to add with every bed name. For example:{" "}
      <strong>BED</strong>, <strong>Twin</strong> Etc.
    </p>
    <ul>
      <li>
        If you selected <strong>Prefix</strong>, it will appear before the
        number <strong>(BED_01)</strong>.
      </li>
      <li>
        If you selected Suffix, it will appear after the number{" "}
        <strong>(01_BED)</strong>.
      </li>
    </ul>
  </div>
);

export const StartingNumberTooltip = () => (
  <div className="ipd-beds-tooltip-content">
    <p>
      Enter the number from where the bed numbering should begin. For example,
      if you type 01, the beds will be 01, 02, 03…
    </p>
  </div>
);
