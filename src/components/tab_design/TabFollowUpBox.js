import React, { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { Input, Button, Drawer, Tabs, Select, Spin, Popover, Row, Col, DatePicker, Tooltip } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import { isMobile } from 'react-device-detect';

import CashManagerContext from '../../context/CashManagerContext';
import { errorMessage, getFormattedDate, onlyNumberFormat, capitalizeAfterSentence, removeBeforeWhiteSpace } from "../../utils/utils";
import dayjs from "dayjs";
import Notes from "../../assets/images/notes.svg";
import followUp from "../../assets/images/followup.svg";
import CommonModal from '../../common/CommonModal';
import alertIcon from '../../assets/images/alertIcon.svg';

import {
    addFollowupTemplate,
    editFollowupTemplate,
    deleteFollowupTemplate,
    listFollowupTemplate,
} from "../../redux/followUpSlice";

const dateFormat = 'YYYY-MM-DD'

function TabFollowUpBox() {

    // const [messageApi, ] = message.useMessage();
    const {
        // selectedAdviceList,
        templates,
        loading,
    } = useSelector((state) => state.followUp);
    const dispatch = useDispatch();

    const { followUpDate, setFollowUpDate, additionalNote, setAdditionalNote } = useContext(CashManagerContext);
    const [followUpInput, setFollowUpInput] = useState('');
    const [saveButton, setSaveButton] = useState(false);
    const { isAutofillSelected, selectedSymptomsCollector } = useSelector(
      (state) => state.ddx
    );

    const [dateOptions, setDateOptions] = useState([
        { value: '2', unit: 'day', label: "2 Days" },
        { value: '2', unit: 'week', label: "2 Weeks" },
        { value: '2', unit: 'month', label: "2 Months" },
    ]);

    //PopOver1
    const [popOver1, setPopOver1] = useState(false);
    const [allTemplates, setAllTemplates] = useState([]);
    const [matchedTemplates, setMatchedTemplates] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [removeTemplateId, setRemoveTemplateId] = useState(null);

    //PopOver2
    const [popOver2, setPopOver2] = useState(false);
    const [inputTemplateName, setInputTemplateName] = useState(null);
    const TAB_ADD_TEMPLATE = 1;
    const TAB_UPDATE_TEMPLATE = 2;
    const ADD_EDIT_TEMPLATE_TABS = [
        { key: TAB_ADD_TEMPLATE, label: "New Template" },
        { key: TAB_UPDATE_TEMPLATE, label: "Update Template" },
    ];
    const [tabChange, setTabChange] = useState(TAB_ADD_TEMPLATE);

    const [templateDrawer, setTemplateDrawer] = useState(false);
    const [saveDrawer, setSaveDrawer] = useState(false);

    useEffect(() => {
      if (
        isAutofillSelected &&
        selectedSymptomsCollector &&
        Object.keys(selectedSymptomsCollector)?.length > 0 &&
        selectedSymptomsCollector?.notes?.length > 0
      ) {
        setAdditionalNote(
          capitalizeAfterSentence(selectedSymptomsCollector?.notes)
        );
      }
    }, [isAutofillSelected, selectedSymptomsCollector]);

    useEffect(() => {
        dispatch(listFollowupTemplate());
    }, []);

    useEffect(() => {
        setMatchedTemplates(templates);
        setAllTemplates(templates);
    }, [templates]);

    const onChangeFollowUp = useCallback(
        (e) => {
            const updateQuery = onlyNumberFormat(e.target.value);
            setFollowUpInput(updateQuery)
            setFollowUpDate(null)
            if (updateQuery.length > 0) {
                const options = [
                    { value: `${updateQuery}`, unit: 'day', label: `${updateQuery} ${updateQuery <= 1 ? 'Day' : 'Days'}` },
                    { value: `${updateQuery}`, unit: 'week', label: `${updateQuery} ${updateQuery <= 1 ? 'Week' : 'Weeks'}` },
                    { value: `${updateQuery}`, unit: 'month', label: `${updateQuery} ${updateQuery <= 1 ? 'Month' : 'Months'}` },
                ];
                setDateOptions(options);
            } else {
                const options = [
                    { value: '2', unit: 'day', label: "2 Days" },
                    { value: '2', unit: 'week', label: "2 Weeks" },
                    { value: '2', unit: 'month', label: "2 Months" },
                ];
                setDateOptions(options);
            }
        },
        [followUpInput, dateOptions]
    );

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().startOf('day');
    };

    const onDateChanged = (date, dateString) => {
        if (dateString) {
            const dateB = moment(dateString);
            const dateC = moment().format(dateFormat);

            console.log(`Difference is ${dateB.diff(dateC, 'days')} day(s)`);
            console.log(`Difference is ${dateB.diff(dateC, 'weeks')} week(s)`);
            console.log(`Difference is ${dateB.diff(dateC, 'months')} month(s)`);

            const days = dateB.diff(dateC, 'days');
            const weeks = dateB.diff(dateC, 'weeks');
            const months = dateB.diff(dateC, 'months');

            // const days = moment.duration(dateB.diff(dateC)).asDays();
            // const weeks = moment.duration(dateB.diff(dateC)).asWeeks();
            // const months = moment.duration(dateB.diff(dateC)).asMonths();

            if (months > 0) {
                setFollowUpInput(`${months} ${months <= 1 ? 'Month' : 'Months'}`)
            } else if (weeks > 0) {
                setFollowUpInput(`${weeks} ${weeks <= 1 ? 'Week' : 'Weeks'}`)
            } else {
                setFollowUpInput(`${days} ${days <= 1 ? 'Day' : 'Days'}`)
            }
            setFollowUpDate(getFormattedDate(moment(moment().format(dateFormat)).add(days, 'day').format(dateFormat)))
            setDateOptions([]);
        }
    };

    const onOptionPress = (e) => {
        window.Moengage.track_event("followup_chip_select", {
            "value": e.label
        });
        setDateOptions([]);
        setFollowUpInput(e.label)
        setFollowUpDate(getFormattedDate(moment(moment().format(dateFormat)).add(parseInt(e.value), e.unit).format(dateFormat)))
    };

    const onChangeNote = useCallback(
        (e) => {
            setAdditionalNote(e.target.value)
        },
        [additionalNote]
    );

    const onFocusClick = useCallback(
        () => {
            setSaveButton(true)
        },
        [saveButton]
    );
    const onSaveButtonClick = useCallback(
        () => {
            setSaveButton(false)
        },
        [saveButton]
    );

    // Handle Template Drawer
    const handleDrawerTemplate = useCallback(() => {
        setTemplateDrawer(!templateDrawer);
    }, [templateDrawer]);

    // Handle Save Drawer
    const handleDrawerSave = useCallback(() => {
        setInputTemplateName(null);
        setSaveDrawer(!saveDrawer);
    }, [saveDrawer]);

    //PopOver1 function
    const showHideTemplatesListPopover = useCallback(() => {
        setPopOver1(!popOver1);
    }, [popOver1]);

    const onSearch = (e) => {
        const searchQuery = e.target.value;
        if (searchQuery) {
            let filteredTemplates = templates.filter((template) => {
                return template.template_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            });
            setMatchedTemplates(filteredTemplates);
        } else {
            setMatchedTemplates(templates);
        }
    };

    const onTemplateSelected = (template) => {
        const updatedData = template.template_content
        setAdditionalNote(additionalNote.concat(` ${updatedData}`));
        !isMobile ? showHideTemplatesListPopover() : handleDrawerTemplate()
    };

    const onDeleteTemplateClicked = async (tmftm_id) => {
        const action = await dispatch(deleteFollowupTemplate(tmftm_id));
        if (action.meta.requestStatus === "rejected") {
            errorMessage(action.error)
        }
    };

    //PopOver2 function
    const showHideSaveTemplatePopOver = useCallback(() => {
        setInputTemplateName(null);
        setPopOver2(!popOver2);
    }, [popOver2]);

    const onTabChange = useCallback(
        (key) => {
            setInputTemplateName(null);
            setTabChange(key);
        },
        [tabChange]
    );

    const onChangeSaveTemplate = useCallback(
        (e) => {
            const updateQuery = removeBeforeWhiteSpace(e.target.value)
            setInputTemplateName(updateQuery);
        },
        [inputTemplateName]
    );

    const onAddTemplateClicked = async () => {
        if (additionalNote.length === 0) {
            errorMessage('Please enter some Additional Notes')
        } else {
            var sendData = {
                template_name: inputTemplateName,
                template_content: additionalNote,
            };
            const action = await dispatch(addFollowupTemplate(sendData));
            if (action.meta.requestStatus === "fulfilled") {
                setInputTemplateName(null);
                !isMobile ? showHideSaveTemplatePopOver() : handleDrawerSave()
            }
        }
    };

    const onSearchTemplate = useCallback(() => {
        setInputTemplateName(null);
    }, [inputTemplateName]);

    const onSelectTemplate = useCallback(
        (data, e) => {
            setInputTemplateName(e.key);
        },
        [inputTemplateName]
    );

    const onUpdateTemplateClicked = async () => {
        if (additionalNote.length === 0) {
            errorMessage('Please enter some Additional Notes')
        } else {
            var data = JSON.parse(inputTemplateName);
            var sendData = {
                tmftm_id: data.tmftm_id,
                template_name: data.template_name,
                template_content: additionalNote,
            };
            const action = await dispatch(editFollowupTemplate(sendData));
            if (action.meta.requestStatus === "fulfilled") {
                setInputTemplateName(null);
                !isMobile ? showHideSaveTemplatePopOver() : handleDrawerSave()
            }
        }
    };

    const showHideModal = useCallback((template_id) => {
        template_id !== undefined ? setRemoveTemplateId(template_id) : setRemoveTemplateId(null)
        setIsModalOpen(!isModalOpen);
    }, [isModalOpen]);

    //Template Remove
    const DELETE_MODAL = useMemo(() => {
        return (
            <CommonModal
                isModalOpen={isModalOpen}
                onCancel={showHideModal}
                modalWidth={500}
                title={"You may lose your data"}
                modalBody={
                    <>
                        <div className="alert-warning rounded-10px p-2 patient-details">
                            <div className="d-flex align-items-center">
                                <img className='me-3' src={alertIcon} alt="Warning" />
                                <span>
                                    Are you sure you want to delete this template?
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="d-flex align-items-center mt-2 justify-content-end">
                                <div onClick={() => {
                                    onDeleteTemplateClicked(removeTemplateId)
                                    showHideModal()
                                }}
                                    className="me-4 text-decoration-underline btn p-0 text-main">
                                    Yes Delete
                                </div>
                                <Button onClick={showHideModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                    <span>No</span>
                                </Button>
                            </div>
                        </div>
                    </>
                }
            />
        );
    }, [isModalOpen]);

    //Template Componet
    const TEMPLATE_CONTENT_WEB = useCallback(() => {
        return (
            <>
                <div className="pop-header" key="additional-notes-template">
                    <div className="align-items-center d-flex justify-content-between">
                        <div className="title-common">Additional Notes Templates</div>
                        <Button
                            className="btn btn-delete-prescription p-0"
                            onClick={showHideTemplatesListPopover}
                        >
                            <i className="icon-Cross" />
                        </Button>
                    </div>
                    <div className="mt-3" key="advice-template-search">
                        <Input
                            className="popinput"
                            onChange={onSearch}
                            placeholder="Search Templates"
                            allowClear
                            prefix={<i className="icon-search me-2" />}
                        />
                    </div>
                </div>
                <div className="pop-body">
                    {matchedTemplates.length > 0 &&
                        matchedTemplates.map((template, i) => {
                            return (
                                <div
                                    className="align-items-center d-flex medicine-templates"
                                    key={i}
                                >
                                    <div
                                        className="round-box"
                                        onClick={() => onTemplateSelected(template)}
                                    >
                                        <i className="icon-template"></i>
                                    </div>
                                    <div
                                        className="text-truncate w-100"
                                        onClick={() => onTemplateSelected(template)}
                                    >
                                        <div className="title text-main2">{template.template_name}</div>
                                        <div className="text-truncate">{template.template_content}</div>
                                    </div>
                                    <Button
                                        className="btn btn-delete-prescription p-0 ms-2"
                                        onClick={() => {
                                            showHideModal(template.tmftm_id)
                                            showHideTemplatesListPopover()
                                        }}
                                    >
                                        {template.loading ? (
                                            <Spin
                                                indicator={
                                                    <LoadingOutlined style={{ fontSize: 22 }} spin />
                                                }
                                            />
                                        ) : (
                                            <i className="icon-delete"></i>
                                        )}
                                    </Button>
                                </div>
                            );
                        })}
                </div>
            </>
        );
    }, [popOver1, matchedTemplates]);

    //Save Componet
    const SAVE_CONTENT_WEB = useCallback(() => {
        return (
            <>
                <div className="d-flex justify-content-between align-items-center border-bottom templatepopover">
                    <Tabs
                        defaultActiveKey={TAB_ADD_TEMPLATE}
                        items={ADD_EDIT_TEMPLATE_TABS}
                        onChange={onTabChange}
                        className="w-100"
                    />
                    <Button
                        className="btn btn-delete-prescription"
                        onClick={showHideSaveTemplatePopOver}
                    >
                        <i className="icon-Cross"></i>
                    </Button>
                </div>
                {tabChange === TAB_ADD_TEMPLATE ? (
                    <div className="pop-header d-flex">
                        <Input
                            allowClear
                            value={inputTemplateName && inputTemplateName}
                            className="popinput inputheight41"
                            placeholder="Template Name"
                            onChange={onChangeSaveTemplate}
                        />
                        <Button
                            className="btn btn-primary3 btn-41 ms-3"
                            loading={loading}
                            disabled={inputTemplateName ? false : true}
                            onClick={onAddTemplateClicked}
                        >
                            {" Save "}
                        </Button>
                    </div>
                ) : (
                    <div className="pop-header d-flex">
                        <Select
                            showSearch
                            value={inputTemplateName && JSON.parse(inputTemplateName).template_name}
                            className="autocomplete-custom w-100 popinput inputheight41"
                            placeholder="Select Template"
                            onSearch={onSearchTemplate}
                            onSelect={onSelectTemplate}
                            optionLabelProp="label"
                            options={allTemplates.map((template) => {
                                return {
                                    key: JSON.stringify(template),
                                    value: template.template_name,
                                    label: (
                                        <div key={template.tmftm_id}>
                                            {template.template_name}
                                        </div>
                                    ),
                                };
                            })}
                            optionRender={(option) => (
                                <div className="align-items-center d-flex text-truncate w-100">
                                    <div className="round-box"><i className="icon-template"></i></div>
                                    <div className="text-truncate w-100">
                                        <div className="title text-main2">{option.data.value}</div>
                                        <div className="text-truncate">{JSON.parse(option.data.key).template_content}</div>
                                    </div>
                                </div>
                            )}
                        />
                        <Button
                            className="btn btn-primary3 btn-41 ms-3"
                            loading={loading}
                            disabled={inputTemplateName ? false : true}
                            onClick={onUpdateTemplateClicked}
                        >
                            {" Update "}
                        </Button>
                    </div>
                )}
            </>
        );
    }, [tabChange, popOver2, inputTemplateName, loading, allTemplates]);

    //Template Componet Tab
    const TEMPLATE_CONTENT_TAB = useMemo(() => {
        return (
            <>
                <div>
                    <div className="medicine-templates">
                        <Input className="popinput" onChange={onSearch} placeholder="Search Templates" prefix={<i className='icon-search me-2'></i>} allowClear />
                    </div>
                    <div className="tab-template-height" >
                        {matchedTemplates.length > 0 &&
                            matchedTemplates.map((template, i) => {
                                return (
                                    <div className="align-items-center d-flex justify-content-between medicine-templates" key={i}>
                                        <div className="align-items-center d-flex text-truncate w-100" onClick={() => onTemplateSelected(template)}>
                                            <div className="round-box"><i className="icon-template"></i></div>
                                            <div className="text-truncate w-100">
                                                <div className="title text-main2">{template.template_name}</div>
                                                <div className="text-truncate">{template.template_content}</div>
                                            </div>
                                        </div>
                                        <Button className="btn btn-delete-prescription p-0 ms-3" onClick={() => showHideModal(template.tmftm_id)}>
                                            {template.loading ? (
                                                <Spin
                                                    indicator={
                                                        <LoadingOutlined style={{ fontSize: 22 }} spin />
                                                    }
                                                />
                                            ) : (
                                                <i className="icon-delete"></i>
                                            )}
                                        </Button>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </>
        );
    }, [templateDrawer, matchedTemplates]);

    //Save Componet Tab
    const SAVE_CONTENT_TAB = useMemo(() => {
        return (
            <>
                <div className="d-flex justify-content-between align-items-center border-bottom templatepopover">
                    <Tabs
                        defaultActiveKey={TAB_ADD_TEMPLATE}
                        items={ADD_EDIT_TEMPLATE_TABS}
                        onChange={onTabChange}
                        className="w-100" />
                </div>
                {tabChange === TAB_ADD_TEMPLATE ? (
                    <div className="medicine-templates d-flex">
                        <Input
                            allowClear
                            value={inputTemplateName && inputTemplateName}
                            className="popinput inputheight41"
                            placeholder="Template Name"
                            onChange={onChangeSaveTemplate}
                        />
                        <Button
                            className="btn btn-primary3 btn-41 ms-3"
                            loading={loading}
                            disabled={inputTemplateName ? false : true}
                            onClick={onAddTemplateClicked}
                        >
                            {" Save "}
                        </Button>
                    </div>
                ) : (
                    <div className="medicine-templates d-flex">
                        <Select
                            showSearch
                            value={inputTemplateName && JSON.parse(inputTemplateName).template_name}
                            className="autocomplete-custom w-100 popinput inputheight41"
                            placeholder="Select Template"
                            onSearch={onSearchTemplate}
                            onSelect={onSelectTemplate}
                            optionLabelProp="label"
                            options={allTemplates.map((template) => {
                                return {
                                    key: JSON.stringify(template),
                                    value: template.template_name,
                                    label: (
                                        <div key={template.tmftm_id}>
                                            {template.template_name}
                                        </div>
                                    ),
                                };
                            })}
                            optionRender={(option) => (
                                <div className="align-items-center d-flex text-truncate w-100">
                                    <div className="round-box"><i className="icon-template"></i></div>
                                    <div className="text-truncate w-100">
                                        <div className="title text-main2">{option.data.value}</div>
                                        <div className="text-truncate">{JSON.parse(option.data.key).template_content}</div>
                                    </div>
                                </div>
                            )}
                        />
                        <Button
                            className="btn btn-primary3 btn-41 ms-3"
                            loading={loading}
                            disabled={inputTemplateName ? false : true}
                            onClick={onUpdateTemplateClicked}
                        >
                            {" Update "}
                        </Button>
                    </div>
                )}
            </>
        );
    }, [tabChange, saveDrawer, inputTemplateName, loading, allTemplates]);

    return (
        <>
            <div>
                <div className="p-14-pb0">
                    <Row gutter={30}>
                        <Col md={8}>
                            <div className="d-flex align-items-center mb-14">
                                <img className='me-2' src={followUp} alt="Symptoms" />
                                <div className="title-common">Follow-up</div>
                            </div>
                            <div className="d-flex calender-merge-input mt-3">
                                <Input className="w-100 calnder-input1" placeholder="e.g. 3 Days" value={followUpInput} inputMode="numeric" onChange={onChangeFollowUp} allowClear />
                                <DatePicker inputReadOnly disabledDate={disabledDate} onChange={onDateChanged} />
                            </div>
                            {followUpDate && (
                                <div className="title fontroboto mt-2">
                                    {moment(followUpDate).format('dddd, Do MMMM YYYY')}
                                </div>
                            )}
                            <div className="d-flex flex-wrap mt-14 fllowbtn">
                                {dateOptions.length > 0 &&
                                    dateOptions.map((item, i) => {
                                        return (
                                            <Button key={i} type="text" className="btn btn-primary2 px-5-16 btn-fw-bold fs-12 mb-12 me-12" onClick={() => onOptionPress(item)}>{item.label}</Button>
                                        )
                                    })}
                            </div>
                        </Col>
                        <Col md={16}>
                            <div className="d-flex align-items-center justify-content-between mb-14">
                                <div className="d-flex align-items-center">
                                    <img className='me-2' src={Notes} alt="Symptoms" />
                                    <div className="title-common">Additional Notes</div>
                                </div>
                                {!isMobile ? (
                                    <div className="d-flex align-items-center">
                                        <Popover
                                            open={popOver1}
                                            onOpenChange={showHideTemplatesListPopover}
                                            content={TEMPLATE_CONTENT_WEB}
                                            trigger="click"
                                            overlayClassName="pop-350 pp-0"
                                            placement="bottom"
                                        >
                                            <button className="btn d-flex align-items-center btn-text">
                                                {" "}
                                                <i className="icon-template me-2"></i> <span>Templates</span>
                                            </button>
                                        </Popover>
                                        <Tooltip placement="bottom" title={(additionalNote.length > 0) ? "" : "Please enter some Additional Notes to save a template"}>
                                            <Popover
                                                open={popOver2}
                                                onOpenChange={() => (additionalNote.length > 0) && showHideSaveTemplatePopOver()}
                                                // onOpenChange={showHideSaveTemplatePopOver}
                                                content={SAVE_CONTENT_WEB}
                                                trigger="click"
                                                overlayClassName="pop-450 pp-0"
                                                placement="bottom"
                                            >
                                                <button className="btn d-flex align-items-center btn-text">
                                                    {" "}
                                                    <i className="icon-save me-2"></i> <span>Save</span>
                                                </button>
                                            </Popover>
                                        </Tooltip>
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center">
                                        <button className='btn d-flex align-items-center btn-text' onClick={handleDrawerTemplate}>
                                            <i className="icon-template me-2"></i> <span>Templates</span>
                                        </button>
                                        <Tooltip placement="bottom" title={(additionalNote.length > 0) ? "" : "Please enter some Additional Notes to save a template"}>
                                            <button className='btn d-flex align-items-center btn-text' onClick={() => (additionalNote.length > 0) && handleDrawerSave()} > <i className="icon-save me-2"></i> <span>Save</span></button>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                            <div className="textarea-save">
                                <Input.TextArea placeholder="Enter any specific note here" onFocus={onFocusClick} onBlur={onSaveButtonClick} value={additionalNote} className="textareaPlaceholder fontroboto text-main" rows={3} onChange={onChangeNote} />
                                {saveButton && (
                                    <Button className="d-flex align-items-center textarea-save-btn" onClick={onSaveButtonClick}>
                                        <i className="icon-check"></i>
                                        <a className="text-decoration-underline">Save</a>
                                    </Button>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
                {DELETE_MODAL}
                <Drawer title="Additional Notes Templates" placement="right" onClose={handleDrawerTemplate} open={templateDrawer} className="modalWidth-563" width="auto">
                    {TEMPLATE_CONTENT_TAB}
                </Drawer>
                <Drawer title="Save Template" placement="right" onClose={handleDrawerSave} open={saveDrawer} className="modalWidth-563" width="auto">
                    {SAVE_CONTENT_TAB}
                </Drawer>
            </div>
        </>
    );
}


export default React.memo(TabFollowUpBox);
