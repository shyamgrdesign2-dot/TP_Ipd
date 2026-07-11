import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const PatientDetailsLayout = ({
  items,
  onHandleSelect,
  onRequestClose,
  fullName,
  gender,
  age,
  wardBedNumber,
  consultant,
  admittedOn,
  renderContent,
  showAddCTA,
  contentHeaderActions,
  showAbhaLogo,
  abhaLogoUrl,
}) => {
  const [selectedKey, setSelectedKey] = useState(
    items?.[0]?.key || items?.[0]?.id || items?.[0]?.label || items?.[0]?.name
  );

  const handleSelect = (item) => {
    const key = item.key || item.id || item.label || item.name;
    setSelectedKey(key);
    onHandleSelect?.(item);
  };

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#fff",
        }}
      >
        <button
          onClick={onRequestClose}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 18,
            padding: 4,
          }}
        >
          &lt;
        </button>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#e6f7ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
            color: "#1890ff",
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>
            {fullName}
            {showAbhaLogo && abhaLogoUrl && (
              <img
                src={abhaLogoUrl}
                alt="ABHA"
                style={{ height: 16, marginLeft: 8 }}
              />
            )}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {gender}, {age}y
          </div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "#666" }}>
          <div>{wardBedNumber}</div>
          <div>Consultant: {consultant}</div>
          <div>Admitted on: {admittedOn}</div>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <nav
          style={{
            width: 200,
            borderRight: "1px solid #e8e8e8",
            overflowY: "auto",
            background: "#fafafa",
            padding: "8px 0",
          }}
        >
          {items?.map((item) => {
            const key = item.key || item.id || item.label || item.name;
            const displayText = item.label || item.name || key;
            return (
              <button
                key={key}
                onClick={() => handleSelect(item)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 16px",
                  border: "none",
                  background:
                    selectedKey === key ? "#e6f7ff" : "transparent",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: selectedKey === key ? 600 : 400,
                  borderRight:
                    selectedKey === key
                      ? "3px solid #1890ff"
                      : "3px solid transparent",
                }}
              >
                {displayText}
              </button>
            );
          })}
        </nav>
        <main style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {contentHeaderActions}
          {typeof renderContent === "function"
            ? renderContent()
            : renderContent}
        </main>
      </div>
    </div>
  );
};

const CollapsibleWrapper = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        border: "1px solid #e8e8e8",
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "10px 16px",
          cursor: "pointer",
          fontWeight: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fafafa",
          borderRadius: open ? "8px 8px 0 0" : 8,
        }}
      >
        {title}
        <span>{open ? "▲" : "▼"}</span>
      </div>
      {open && <div style={{ padding: 16 }}>{children}</div>}
    </div>
  );
};

const GenericCard = ({ title, children, ...rest }) => (
  <div
    style={{
      border: "1px solid #e8e8e8",
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      background: "#fff",
    }}
    {...rest}
  >
    {title && (
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
    )}
    {children}
  </div>
);

const RichTextEditWrapper = ({ value, onChange, placeholder, ...rest }) => (
  <textarea
    value={value || ""}
    onChange={(e) => onChange?.(e.target.value)}
    placeholder={placeholder || "Enter text..."}
    style={{
      width: "100%",
      minHeight: 100,
      padding: 8,
      border: "1px solid #d9d9d9",
      borderRadius: 4,
      resize: "vertical",
      fontFamily: "inherit",
    }}
  />
);

const RichTextEditor = ({ value, onChange, readOnly, ...rest }) => {
  if (readOnly) {
    return (
      <div
        style={{ padding: 8 }}
        dangerouslySetInnerHTML={{ __html: value || "" }}
      />
    );
  }
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        width: "100%",
        minHeight: 100,
        padding: 8,
        border: "1px solid #d9d9d9",
        borderRadius: 4,
        resize: "vertical",
        fontFamily: "inherit",
      }}
    />
  );
};

const UnitInput = ({ value, onChange, unit, placeholder, ...rest }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: "4px 8px",
        border: "1px solid #d9d9d9",
        borderRadius: 4,
        width: 80,
      }}
    />
    {unit && <span style={{ fontSize: 12, color: "#666" }}>{unit}</span>}
  </div>
);

const LayoutWithMenu = ({ children, ...rest }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    {children}
  </div>
);

const Customization = ({ children, ...rest }) => <>{children}</>;

const GenericTable = ({ columns, dataSource, ...rest }) => (
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 14,
    }}
  >
    {columns && (
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key || col.dataIndex}
              style={{
                padding: "8px 12px",
                borderBottom: "2px solid #e8e8e8",
                textAlign: "left",
              }}
            >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
    )}
    <tbody>
      {dataSource?.map((row, i) => (
        <tr key={row.key || i}>
          {columns?.map((col) => (
            <td
              key={col.key || col.dataIndex}
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              {col.render
                ? col.render(row[col.dataIndex], row, i)
                : row[col.dataIndex]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const SectionedTable = GenericTable;

const AutoFillButton = ({ onClick, children, ...rest }) => (
  <button
    onClick={onClick}
    style={{
      padding: "4px 12px",
      border: "1px solid #1890ff",
      borderRadius: 4,
      background: "#fff",
      color: "#1890ff",
      cursor: "pointer",
      fontSize: 13,
    }}
    {...rest}
  >
    {children || "Auto Fill"}
  </button>
);

const ReusableProgressCard = ({ title, children, ...rest }) => (
  <div
    style={{
      border: "1px solid #e8e8e8",
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
    }}
  >
    {title && (
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
    )}
    {children}
  </div>
);

const FilledByCard = ({ children, ...rest }) => (
  <div
    style={{
      padding: "8px 12px",
      background: "#f5f5f5",
      borderRadius: 4,
      fontSize: 12,
      color: "#666",
    }}
  >
    {children}
  </div>
);

const ReusableStepper = ({ steps, current, children, ...rest }) => (
  <div>
    <div
      style={{
        display: "flex",
        gap: 8,
        marginBottom: 16,
        overflowX: "auto",
      }}
    >
      {steps?.map((step, i) => (
        <div
          key={i}
          style={{
            padding: "6px 12px",
            borderRadius: 16,
            background: i === current ? "#1890ff" : "#f0f0f0",
            color: i === current ? "#fff" : "#333",
            fontSize: 13,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          onClick={() => step.onClick?.(i)}
        >
          {step.title || step.label || `Step ${i + 1}`}
        </div>
      ))}
    </div>
    {children}
  </div>
);

const VoiceAI = () => null;

export const RemoteComponents = {
  LayoutWithMenu,
  Customization,
  PatientDetailsLayout,
  CollapsibleWrapper,
  GenericCard,
  RichTextEditWrapper,
  GenericTable,
  SectionedTable,
  UnitInput,
  AutoFillButton,
  RichTextEditor,
  ReusableProgressCard,
  FilledByCard,
  ReusableStepper,
  VoiceAI,
};

export const withRemoteComponent = (WrappedComponent) => {
  return function WithRemoteComponentWrapper(props) {
    return <WrappedComponent {...props} />;
  };
};

export const createRemoteComponent = (componentName) => {
  const Component = RemoteComponents[componentName];

  if (!Component) {
    return function MissingComponent() {
      return null;
    };
  }

  return function RemoteComponentWrapper(props) {
    return (
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
  };
};
