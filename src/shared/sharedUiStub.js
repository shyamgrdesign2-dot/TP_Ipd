import React from "react";

function PassthroughWrapper({ children, title, className, style, defaultOpen, collapsible, ...rest }) {
  return React.createElement("div", {
    className: className || "",
    style: style || {},
    "data-testid": rest["data-testid"],
    role: "region",
    "aria-label": title,
  },
    title ? React.createElement("div", {
      style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 0", cursor: collapsible ? "pointer" : "default" },
      className: "collapsible-header",
    },
      rest.icon ? React.createElement("img", { src: rest.icon, alt: "", style: { width: 20, height: 20 } }) : null,
      React.createElement("span", { style: { fontSize: 14, fontWeight: 600 } }, title),
    ) : null,
    React.createElement("div", null, children),
  );
}

function StubCard({ children, className, style, ...rest }) {
  return React.createElement("div", { className: className || "", style: style || {} }, children);
}

function StubRichText({ value, readOnly, placeholder, ...rest }) {
  if (readOnly) {
    var content = "";
    if (typeof value === "string") content = value;
    else if (value && typeof value === "object") {
      try {
        if (Array.isArray(value)) {
          content = value.map(function(block) {
            if (block.children) return block.children.map(function(c) { return c.text || ""; }).join("");
            return "";
          }).join("\n");
        }
      } catch (e) { content = ""; }
    }
    return React.createElement("div", { style: { fontSize: 14, lineHeight: "20px", color: "#344054", whiteSpace: "pre-wrap" } }, content || "");
  }
  return React.createElement("textarea", {
    value: typeof value === "string" ? value : "",
    placeholder: placeholder || "",
    readOnly: true,
    style: { width: "100%", minHeight: 60, border: "1px solid #d0d5dd", borderRadius: 8, padding: 8, fontSize: 14 },
  });
}

function FilledByCardStub({ filledBy, role, showFilledOnDate, selectedDate, selectedTime, filledOnText }) {
  var dateStr = "";
  if (showFilledOnDate && selectedDate) {
    try {
      var d = new Date(selectedDate);
      if (!isNaN(d.getTime())) {
        dateStr = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
        var t = selectedTime ? new Date(selectedTime) : d;
        if (!isNaN(t.getTime())) {
          dateStr += " ( " + t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) + " )";
        }
      }
    } catch (e) { /* ignore */ }
  }
  return React.createElement("div", { className: "filled-by-card" },
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" } },
      React.createElement("div", { style: { width: 40, height: 40, borderRadius: 20, background: "#e9ecef", display: "flex", alignItems: "center", justifyContent: "center" } },
        React.createElement("img", { src: "", alt: "Doctor", style: { width: 24, height: 24 }, onError: function(e) { e.target.style.display = "none"; } })
      ),
      React.createElement("div", null,
        React.createElement("span", { style: { fontSize: 13, color: "#667085" } }, filledOnText || "Filled By:"),
        " ",
        React.createElement("span", { style: { fontSize: 14, fontWeight: 600, color: "#101828" } }, filledBy || ""),
        role ? React.createElement("span", {
          style: { display: "inline-block", marginLeft: 8, fontSize: 11, fontWeight: 500, color: "#027a48", background: "#ecfdf3", border: "1px solid #a6f4c5", borderRadius: 12, padding: "2px 8px" }
        }, role) : null,
        dateStr ? React.createElement("div", { style: { fontSize: 12, color: "#667085", marginTop: 2 } }, dateStr) : null
      )
    )
  );
}

function PatientDetailsLayoutStub(props) {
  var items = props.items || [];
  var renderContent = props.renderContent;
  var onHandleSelect = props.onHandleSelect;
  var fullName = props.fullName || "";
  var gender = props.gender || "";
  var age = props.age || "";
  var wardBedNumber = props.wardBedNumber || "";
  var consultant = props.consultant || "";
  var admittedOn = props.admittedOn || "";

  var activeItem = items.find(function(it) { return it.isActive; }) || items[0];

  var initials = fullName.split(" ").map(function(w) { return w[0] || ""; }).join("").substring(0, 2).toUpperCase();

  function handleMenuClick(item) {
    if (onHandleSelect) onHandleSelect(item.id);
  }

  return React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100vh" } },
    React.createElement("div", { style: { position: "sticky", top: 0, zIndex: 199 } },
      React.createElement("div", {
        style: { background: "linear-gradient(135deg, #1a1994 0%, #673AAC 50%, #D565EA 100%)", color: "#fff", padding: "16px 24px" }
      },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16 } },
          React.createElement("button", {
            onClick: function() { window.history.back(); },
            style: { background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18, padding: 4 }
          }, "<"),
          React.createElement("span", {
            style: { width: 36, height: 36, borderRadius: 18, background: "rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }
          }, initials),
          React.createElement("div", null,
            React.createElement("div", { style: { fontSize: 16, fontWeight: 600 } }, fullName),
            React.createElement("div", { style: { fontSize: 12, opacity: 0.85 } },
              [gender, age ? age + "y" : ""].filter(Boolean).join(", ")
            )
          )
        ),
        React.createElement("div", { style: { fontSize: 12, opacity: 0.8, marginTop: 4, marginLeft: 68 } },
          wardBedNumber,
          consultant ? React.createElement("span", { style: { marginLeft: 16 } }, "Consultant: ", consultant) : null,
          admittedOn ? React.createElement("span", { style: { marginLeft: 16 } }, "Admitted on: ", admittedOn) : null
        )
      )
    ),
    React.createElement("div", { style: { display: "flex", flex: 1, overflow: "hidden" } },
      React.createElement("nav", {
        style: { width: 100, borderRight: "1px solid #e6e6ee", overflowY: "auto", background: "#fafafa", flexShrink: 0, paddingTop: 8 }
      },
        items.map(function(item) {
          return React.createElement("button", {
            key: item.id,
            onClick: function() { handleMenuClick(item); },
            style: {
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%",
              padding: "10px 4px", border: "none", cursor: "pointer", fontSize: 10, fontWeight: item.isActive ? 700 : 500,
              color: item.isActive ? "#673AAC" : "#667085",
              background: item.isActive ? "#f3f0ff" : "transparent",
              borderLeft: item.isActive ? "3px solid #673AAC" : "3px solid transparent",
              textAlign: "center", lineHeight: "13px"
            }
          },
            item.icon ? React.createElement("img", { src: item.icon, alt: item.title || "", style: { width: 20, height: 20 } }) : null,
            React.createElement("span", null, item.title || item.id)
          );
        })
      ),
      React.createElement("main", { style: { flex: 1, overflowY: "auto", padding: 0 } },
        React.createElement("h2", {
          style: { fontSize: 18, fontWeight: 700, color: "#101828", padding: "16px 24px 8px", margin: 0 }
        }, activeItem?.title || ""),
        React.createElement("div", null,
          typeof renderContent === "function" ? renderContent(activeItem) : null
        )
      )
    )
  );
}

function StubTable({ children, columns, dataSource, ...rest }) {
  return React.createElement("div", null, children);
}

function StubInput(props) {
  return React.createElement("input", { type: "text", value: props.value || "", readOnly: true, style: { border: "1px solid #d0d5dd", borderRadius: 8, padding: "4px 8px" } });
}

function StubButton(props) {
  return null;
}

function StubStepper(props) {
  return React.createElement("div", null, props.children);
}

function StubVoiceAI(props) {
  return null;
}

function LayoutWithMenuStub({ children }) {
  return React.createElement("div", null, children);
}

export var CollapsibleWrapper = PassthroughWrapper;
export var GenericCard = StubCard;
export var RichTextEditWrapper = StubRichText;
export var RichTextEditor = StubRichText;
export var FilledByCard = FilledByCardStub;
export var PatientDetailsLayout = PatientDetailsLayoutStub;
export var GenericTable = StubTable;
export var SectionedTable = StubTable;
export var UnitInput = StubInput;
export var AutoFillButton = StubButton;
export var ReusableProgressCard = StubCard;
export var ReusableStepper = StubStepper;
export var VoiceAI = StubVoiceAI;
export var LayoutWithMenu = LayoutWithMenuStub;
export var Customization = StubCard;

export default {
  CollapsibleWrapper: PassthroughWrapper,
  GenericCard: StubCard,
  RichTextEditWrapper: StubRichText,
  RichTextEditor: StubRichText,
  FilledByCard: FilledByCardStub,
  PatientDetailsLayout: PatientDetailsLayoutStub,
  GenericTable: StubTable,
  SectionedTable: StubTable,
  UnitInput: StubInput,
  AutoFillButton: StubButton,
  ReusableProgressCard: StubCard,
  FilledByCard: FilledByCardStub,
  ReusableStepper: StubStepper,
  VoiceAI: StubVoiceAI,
  LayoutWithMenu: LayoutWithMenuStub,
  Customization: StubCard,
};
