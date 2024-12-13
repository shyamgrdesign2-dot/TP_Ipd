import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Button, Card, Row, Col, Input } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { capitalizeAfterSentence } from "../../utils/utils";

import CashManagerContext from "../../context/CashManagerContext";
import { searchModule } from "../../redux/customModuleSlice";
import { updateDragDrop } from "../../redux/doctorsSlice";

import dragChips from "../../../src/assets/images/drag-chips.gif";
import tagNew from "../../../src/assets/images/tag-new.svg";

import TabSearchHeader from "./TabSearchHeader";

import { SortableContainer, SortableElement } from "react-sortable-hoc";

function TabCustomModuleSearch({ passIndex, onClose, module }) {
  const { searchModuleResults } = useSelector((state) => state.customModules);
  const { dragDrop } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();

  const { customModuleContents, setCustomModuleContents } =
    useContext(CashManagerContext);

  const [searchParentQuery, setSearchParentQuery] = useState("");

  const [childSearchOptions, setChildSearchOptions] = useState([]);

  const [searchChildQuery, setSearchChildQuery] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(passIndex);
  const moduleData =
    customModuleContents
      .filter((content) => content.module_id === module.module_id)
      ?.flatMap((item) => item.content) || [];

  //Parent AutoComplete
  useEffect(() => {
    if (searchChildQuery) {
      const timeOutId = setTimeout(() => {
        dispatch(
          searchModule({
            moduleId: module?.module_id,
            keyword: searchChildQuery,
          })
        );
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    }
  }, [searchChildQuery]);

  useEffect(() => {
    const data = [];
    searchModuleResults.map(({ title }, i) => {
      return data.push({
        key: JSON.stringify({ title, i, unique_id: uuidv4() }),
        value: title,
      });
    });
    if (searchChildQuery.length > 0) {
      searchChildQuery &&
        data.push({
          key: JSON.stringify({
            unique_id: uuidv4(),
            change: 1,
            title: searchChildQuery,
          }),
          value: searchChildQuery,
        });
    }
    setChildSearchOptions(data);
  }, [searchModuleResults]);

  const updateCustomModuleContents = (updatedContent) => {
    const moduleExists = customModuleContents.some(
      (content) => content.module_id === module.module_id
    );

    const updatedModules = moduleExists
      ? customModuleContents.map((content) => {
          if (content.module_id === module.module_id) {
            return {
              ...content,
              module_name: module.name,
              content: updatedContent,
            };
          }
          return content;
        })
      : [
          ...customModuleContents,
          {
            module_id: module.module_id,
            module_name: module.name,
            content: updatedContent,
          },
        ];

    setCustomModuleContents(updatedModules);
  };

  const onSearchParent = useCallback(
    (query) => {
      setSearchChildQuery(query);
    },
    [searchChildQuery]
  );

  const onSelectParent = useCallback(
    (e) => {
      const newItem = { title: e, notes: "" };
      updateCustomModuleContents([...moduleData, newItem]);
      setSearchParentQuery("");
      setSelectedIndex([...moduleData, newItem].length - 1);
    },
    [moduleData, selectedIndex]
  );

  const onRemoveRow = (index) => {
    const updatedModuleData = moduleData.filter((_, i) => i !== index);
    updateCustomModuleContents(updatedModuleData);
  };

  // Tour Drag & Drop
  const [tourOpen, setTourOpen] = useState(false);
  const tourRef = useRef(null);

  useEffect(() => {
    // dispatch(updateDragDrop(''));
    setTimeout(() => {
      if (moduleData?.length > 1 && !dragDrop?.examination) {
        setTourOpen(true);
      }
    }, 400);
  }, [moduleData]);

  // Drag & Drop
  const SortableItem = SortableElement(({ item }) => (
    <div
      style={{
        width:
          item.title.length > 12 && item.title.length < 24
            ? `${item.title.length * 10.5}px`
            : item.title.length >= 24
            ? "256px"
            : "150px",
        zIndex: 9999,
      }}
      className={`${
        selectedIndex == item.index && "closable-chips-active"
      } d-flex align-items-center justify-content-between text-truncate closable-chips`}
    >
      <div
        className="text-truncate p-2"
        onClick={() => {
          setSelectedIndex(item.index);
        }}
      >
        <div className="text-truncate">
          {item.title}
          {item.notes ? (
            <div className="text-truncate small">{item.notes}</div>
          ) : (
            <div className="text-truncate small">Add Notes</div>
          )}
        </div>
      </div>
      <Button
        type="text"
        className="rounded-0 btn-close-chips"
        onClick={() => onRemoveRow(item.index)}
      >
        <i className="icon-Cross"></i>
      </Button>
    </div>
  ));

  const SortableList = SortableContainer(({ items }) => {
    return (
      <div className="d-flex flex-wrap">
        {items.map((item, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            item={{ ...item, index }}
          />
        ))}
      </div>
    );
  });

  const TABLE_CUSTOM_MODULE = useMemo(() => {
    return (
      moduleData.length > 0 && (
        <SortableList
          items={moduleData}
          onSortEnd={({ oldIndex, newIndex }) => {
            const newModuleData = [...moduleData];
            const [movedItem] = newModuleData.splice(oldIndex, 1);
            newModuleData.splice(newIndex, 0, movedItem);
            updateCustomModuleContents(newModuleData);
          }}
          axis="xy"
          pressDelay={100}
        />
      )
    );
  }, [moduleData, selectedIndex]);

  const onChangeInputNoteChild = useCallback(
    (e) => {
      const tempModuleData = [...moduleData];
      tempModuleData[selectedIndex].notes = capitalizeAfterSentence(
        e.target.value
      );
      updateCustomModuleContents(tempModuleData);
    },
    [selectedIndex, moduleData]
  );

  //Child Componet
  const CHILD_DRAWER_DATA = useMemo(() => {
    return (
      selectedIndex != null &&
      moduleData[selectedIndex] !== undefined && (
        <>
          <div className="h-100">
            <div className="selectedchip-header d-flex flex-column justify-content-center title px-20">
              <span className="text-truncate-twolines">
                {selectedIndex != null && moduleData[selectedIndex].title}
              </span>
            </div>
            <div className="p-4">
              <label className="title-common">Add Notes</label>
              <Input.TextArea
                value={selectedIndex != null && moduleData[selectedIndex].notes}
                placeholder="Enter any specific notes here"
                className="textareaPlaceholder"
                rows={3}
                onChange={onChangeInputNoteChild}
              />
            </div>
          </div>
        </>
      )
    );
  }, [selectedIndex, moduleData]);

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Card bordered={false} className="search-modalCard h-100">
        <TabSearchHeader
          placeholder="Search Examinations"
          searchQuery={searchChildQuery}
          onSearchParent={onSearchParent}
          disabled={moduleData.length > 0 ? false : true}
          onClose={handleClose}
        />
        <div className="modalcard-body">
          <Row gutter={0} className="h-100">
            <Col md={14}>
              <div className="bg-white h-100 p-14">
                {moduleData.length > 0 && !searchChildQuery && (
                  <>
                    <div className="title2">Added</div>
                    <div className="d-flex flex-wrap">
                      <span ref={tourRef} className="pt-3">
                        {TABLE_CUSTOM_MODULE}
                      </span>
                    </div>
                  </>
                )}
                <div>
                  <div className="title2">
                    {searchChildQuery.length > 0
                      ? "Search Results"
                      : "Frequently Used"}
                  </div>
                  <div className="mt-3">
                    {searchChildQuery.length > 0
                      ? childSearchOptions.length > 0 &&
                        childSearchOptions
                          .filter(
                            (e) =>
                              ![...moduleData.map((e1) => e1.title)].includes(
                                e.value
                              )
                          )
                          .map((item, i) => {
                            return i === childSearchOptions.length - 1 ? (
                              <Button
                                key={i}
                                type="text"
                                className="btn btn-primary2 chips-custom mb-14 chips-addCustom chips-height"
                                onClick={() => onSelectParent(item.value)}
                              >
                                "{item.value}"{" "}
                                <i className="icon-Add mx-2 fs-6"></i>{" "}
                                <a className="fw-medium text-decoration-underline text-primary">
                                  {" "}
                                  Add Custom
                                </a>
                              </Button>
                            ) : (
                              <Button
                                key={i}
                                type="text"
                                style={{
                                  width: item.value.length > 26 && "250px",
                                }}
                                className={`${
                                  item.value.length > 26 && "chips-custom-break"
                                } btn btn-primary2 chips-custom mb-14 me-14`}
                                onClick={() => onSelectParent(item.value)}
                              >
                                {item.value}
                              </Button>
                            );
                          })
                      : searchModuleResults.length > 0 &&
                        searchModuleResults
                          .filter(
                            (e) =>
                              ![...moduleData.map((e1) => e1.title)].includes(
                                e?.title
                              )
                          )
                          .map((item, i) => {
                            return (
                              <Button
                                key={i}
                                type="text"
                                style={{
                                  width: item?.title.length > 26 && "250px",
                                }}
                                className={`${
                                  item?.title.length > 26 &&
                                  "chips-custom-break"
                                } btn btn-primary2 chips-custom mb-14 me-14`}
                                onClick={() => onSelectParent(item?.title)}
                              >
                                {item?.title}
                              </Button>
                            );
                          })}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={10}>{CHILD_DRAWER_DATA}</Col>
          </Row>
        </div>
      </Card>
    </>
  );
}

export default React.memo(TabCustomModuleSearch);
