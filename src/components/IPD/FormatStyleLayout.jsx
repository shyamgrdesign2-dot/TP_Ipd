import React, { useCallback, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox } from "antd";
import { MenuOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  setDraftSettings,
  updateDraftFormatStyle,
  updateDraftParameter,
} from "../../redux/ipd/printSettingsSlice";

const RowContext = React.createContext({});

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <MenuOutlined
      ref={setActivatorNodeRef}
      style={{
        touchAction: "none",
        cursor: "move",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      {...listeners}
    />
  );
};

const SortableCard = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 9999,
          opacity: 0.5,
        }
      : {}),
  };

  return (
    <RowContext.Provider
      value={{
        setActivatorNodeRef,
        listeners,
      }}
    >
      <div ref={setNodeRef} style={style} {...attributes}>
        {children}
      </div>
    </RowContext.Provider>
  );
};

function FormatStyleLayout({ moduleType, formatSettings }) {
  const dispatch = useDispatch();
  const { draftSettings } = useSelector((state) => state.printSettings);
  const [expandedSections, setExpandedSections] = useState({});

  // formatSettings is now an array
  const formatSections = React.useMemo(() => {
    if (!Array.isArray(formatSettings)) return [];
    // Create a copy before sorting to avoid mutating Redux state
    return [...formatSettings].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [formatSettings]);

  const updateSectionInArray = useCallback(
    (sections, sectionId, updates, level = 0) => {
      return sections.map((section) => {
        if (section.id === sectionId) {
          return { ...section, ...updates };
        }

        // Check subSections recursively
        if (section.subSections && section.subSections.length > 0) {
          const updatedSubSections = updateSectionInArray(
            section.subSections,
            sectionId,
            updates,
            level + 1
          );
          if (updatedSubSections !== section.subSections) {
            return { ...section, subSections: updatedSubSections };
          }
        }

        return section;
      });
    },
    []
  );

  const onVisibilityChange = useCallback(
    (sectionId, visible) => {
      // Use Redux action to update draft format style
      dispatch(
        updateDraftFormatStyle({ moduleType, sectionId, updates: { visible } })
      );
    },
    [dispatch, moduleType]
  );

  const onParameterCheckboxChange = useCallback(
    (parentSectionId, parameterId, checked) => {
      // Use Redux action to update draft parameter
      dispatch(
        updateDraftParameter({
          moduleType,
          sectionId: parentSectionId,
          parameterId,
          selected: checked,
        })
      );
    },
    [dispatch, moduleType]
  );

  const onDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!active || !over || active.id === over.id) return;

      const sections = [...(formatSettings || [])];

      // Helper function to find item and its parent
      const findItemInSections = (sections, itemId, parentId = null) => {
        for (let section of sections) {
          if (section.id === itemId) {
            return { found: true, level: "root", parentId: null };
          }

          if (section.subSections) {
            for (let subSection of section.subSections) {
              if (subSection.id === itemId) {
                return { found: true, level: "sub", parentId: section.id };
              }
            }
          }
        }
        return { found: false };
      };

      const activeInfo = findItemInSections(sections, active.id);
      const overInfo = findItemInSections(sections, over.id);

      // Only allow reordering within the same level and parent
      if (
        activeInfo.level !== overInfo.level ||
        activeInfo.parentId !== overInfo.parentId
      ) {
        return;
      }

      if (activeInfo.level === "root") {
        // Reorder root level sections
        const activeIndex = sections.findIndex(
          (section) => section.id === active.id
        );
        const overIndex = sections.findIndex(
          (section) => section.id === over.id
        );

        if (activeIndex !== -1 && overIndex !== -1) {
          const reorderedSections = arrayMove(sections, activeIndex, overIndex);

          // Update order values
          const updatedSections = reorderedSections.map((section, index) => ({
            ...section,
            order: index + 1,
          }));

          // Update the entire formatStyle array in draft settings
          const currentSettings = draftSettings[moduleType] || {};
          dispatch(
            setDraftSettings({
              moduleType,
              settings: {
                ...currentSettings,
                formatStyle: updatedSections,
              },
            })
          );
        }
      } else if (activeInfo.level === "sub") {
        // Reorder subsections within parent
        const parentSection = sections.find(
          (s) => s.id === activeInfo.parentId
        );
        if (!parentSection || !parentSection.subSections) return;

        const subSections = [...parentSection.subSections];
        const activeIndex = subSections.findIndex(
          (sub) => sub.id === active.id
        );
        const overIndex = subSections.findIndex((sub) => sub.id === over.id);

        if (activeIndex !== -1 && overIndex !== -1) {
          const reorderedSubSections = arrayMove(
            subSections,
            activeIndex,
            overIndex
          );

          // Update order values
          const updatedSubSections = reorderedSubSections.map((sub, index) => ({
            ...sub,
            order: index + 1,
          }));

          // Update the parent section with new subsections
          const updatedSections = sections.map((section) =>
            section.id === activeInfo.parentId
              ? { ...section, subSections: updatedSubSections }
              : section
          );

          // Update the entire formatStyle array in draft settings
          const currentSettings = draftSettings[moduleType] || {};
          dispatch(
            setDraftSettings({
              moduleType,
              settings: {
                ...currentSettings,
                formatStyle: updatedSections,
              },
            })
          );
        }
      }
    },
    [formatSettings, dispatch, moduleType, draftSettings]
  );

  const toggleSectionExpansion = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getDisplayName = (key) => {
    // Convert camelCase to readable format
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const renderSection = (section, level = 0) => {
    const hasSubSections =
      section.subSections && section.subSections.length > 0;
    const isExpanded = expandedSections[section.id];
    const isMainSection = level === 0;

    // Main section card (top level)
    if (isMainSection && hasSubSections) {
      return (
        <div
          key={section.id}
          className="border rounded-3"
          style={{
            borderColor: "#e2e2ea",
            borderWidth: "0.5px",
            overflow: "hidden",
          }}
        >
          {/* Main section header */}
          <div
            className="bg-white d-flex align-items-center justify-content-between"
            style={{ padding: "12px" }}
          >
            <div className="d-flex align-items-center gap-3">
              <DragHandle />
              <div
                className="d-flex align-items-center gap-3 cursor-pointer Preview-color-icon"
                onClick={() => onVisibilityChange(section.id, !section.visible)}
              >
                <i
                  className={`icon-Preview ${
                    !section.visible ? "disable-preview" : ""
                  }`}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#454551",
                    fontFamily: "Poppins",
                  }}
                >
                  {section.label || getDisplayName(section.id)}
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Button
                type="text"
                icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                onClick={() => toggleSectionExpansion(section.id)}
                style={{ padding: "4px" }}
              />
            </div>
          </div>

          {/* Subsections container */}
          {isExpanded && (
            <div
              style={{
                backgroundColor: "#fafafb",
                padding: "0 12px",
              }}
            >
              <DndContext
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={[...(section.subSections || [])]
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((sub) => sub.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {[...(section.subSections || [])]
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((subSection, index) => (
                      <SortableCard key={subSection.id} id={subSection.id}>
                        <div
                          style={{
                            borderBottom:
                              index < section.subSections.length - 1
                                ? "0.5px solid #e2e2ea"
                                : "none",
                          }}
                        >
                          {renderSubSection(subSection, 1)}
                        </div>
                      </SortableCard>
                    ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      );
    }

    // Simple section card (no subsections)
    return (
      <div
        key={section.id}
        className="border rounded-3 d-flex align-items-center justify-content-between"
        style={{
          borderColor: "#e2e2ea",
          borderWidth: "0.5px",
          padding: "12px",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <DragHandle />
          <div
            className="d-flex align-items-center gap-3 cursor-pointer Preview-color-icon"
            onClick={() => onVisibilityChange(section.id, !section.visible)}
          >
            <i
              className={`icon-Preview ${
                !section.visible ? "disable-preview" : ""
              }`}
            />
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#454551",
                fontFamily: "Poppins",
              }}
            >
              {section.label || getDisplayName(section.id)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSubSection = (subSection, level) => {
    const hasParameters =
      subSection.parameters && subSection.parameters.length > 0;
    const isExpanded = expandedSections[subSection.id];

    return (
      <div style={{ padding: "12px 0" }}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <DragHandle />
            <div
              className="d-flex align-items-center gap-3 cursor-pointer Preview-color-icon"
              onClick={() =>
                onVisibilityChange(subSection.id, !subSection.visible)
              }
            >
              <i
                className={`icon-Preview ${
                  !subSection.visible ? "disable-preview" : ""
                }`}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#454551",
                  fontFamily: "Poppins",
                  textTransform: level === 1 ? "capitalize" : "none",
                }}
              >
                {subSection.label || getDisplayName(subSection.id)}
              </span>
            </div>
          </div>
        </div>

        {/* Customise Options */}
        {hasParameters && (
          <div className="mt-3">
            <div
              className="border rounded-3"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderColor: "#e2e2ea",
                padding: "8px 16px",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-between cursor-pointer"
                onClick={() => toggleSectionExpansion(subSection.id)}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#454551",
                      fontFamily: "Poppins",
                      marginBottom: "4px",
                    }}
                  >
                    Customise Options
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#a2a2a8",
                      fontFamily: "Poppins",
                    }}
                  >
                    Select/deselect the parameters need to be printed
                  </div>
                </div>
                <Button
                  type="text"
                  icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                  style={{ padding: "4px", fontSize: "12px" }}
                />
              </div>
              {isExpanded && (
                <div className="mt-3">
                  {/* Render parameters as checkboxes */}
                  {hasParameters && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {subSection.parameters.map((parameter) => (
                        <div
                          key={parameter.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Checkbox
                            checked={parameter.selected}
                            onChange={(e) =>
                              onParameterCheckboxChange(
                                subSection.id,
                                parameter.id,
                                e.target.checked
                              )
                            }
                            style={{
                              fontSize: "12px",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#454551",
                              fontFamily: "Poppins",
                              fontWeight: 500,
                            }}
                          >
                            {parameter.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: "0 18px" }}>
      <div className="titleprint mb-3">Format Style</div>

      {/* Sections Container */}
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={formatSections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {formatSections.map((section) => (
              <SortableCard key={section.id} id={section.id}>
                {renderSection(section)}
              </SortableCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default React.memo(FormatStyleLayout);
