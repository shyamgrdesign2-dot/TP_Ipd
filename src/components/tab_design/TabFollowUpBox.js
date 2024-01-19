import React, { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { Input, Button, Drawer, Tabs, message, Select, Card, Spin, Row, Col, DatePicker } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import CashManagerContext from '../../context/CashManagerContext';
import { MESSAGE_KEY } from "../../utils/constants";
import { getFormattedDate, onlyNumberFormat } from "../../utils/utils";
import dayjs from "dayjs";
import Notes from "../../assets/images/notes.svg";
import followUp from "../../assets/images/followup.svg";

const dateFormat = 'YYYY-MM-DD'

function TabFollowUpBox() {

    const [messageApi, contextHolder] = message.useMessage();

    const { followUpDate, setFollowUpDate, additionalNote, setAdditionalNote } = useContext(CashManagerContext);
    const [followUpInput, setFollowUpInput] = useState('');
    const [saveButton, setSaveButton] = useState(false);

    const [dateOptions, setDateOptions] = useState([
        { value: '2', unit: 'day', label: "2 Days" },
        { value: '2', unit: 'week', label: "2 Weeks" },
        { value: '2', unit: 'month', label: "2 Months" },
    ]);

    const onChangeFollowUp = useCallback(
        (e) => {
            const updateQuery = onlyNumberFormat(e.target.value);
            setFollowUpInput(updateQuery)
            setFollowUpDate(null)
            if (updateQuery.length > 0) {
                const options = [
                    { value: `${updateQuery}`, unit: 'day', label: `${updateQuery} Days` },
                    { value: `${updateQuery}`, unit: 'week', label: `${updateQuery} Weeks` },
                    { value: `${updateQuery}`, unit: 'month', label: `${updateQuery} Months` },
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
                setFollowUpInput(`${months} Months`)
            } else if (weeks > 0) {
                setFollowUpInput(`${weeks} Weeks`)
            } else {
                setFollowUpInput(`${days} Days`)
            }
            setFollowUpDate(getFormattedDate(moment(moment().format(dateFormat)).add(days, 'day').format(dateFormat)))
            setDateOptions([]);
        }
    };

    const onOptionPress = (e) => {
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

    return (
        <>
            {contextHolder}
            <div className="prescription-box-sm p-20px">
                <div className="p-14-pb0">
                    <Row gutter={30}>
                        <Col md={8}>
                            <div className="d-flex align-items-center mb-14">
                                <img className='me-2' src={followUp} alt="Symptoms" />
                                <div className="title-common">Follow-up</div>
                            </div>
                            <div className="d-flex calender-merge-input">
                                <Input className="w-100 calnder-input1" placeholder="e.g. 3 Days" value={followUpInput} inputMode="numeric" onChange={onChangeFollowUp} allowClear />
                                <DatePicker inputReadOnly disabledDate={disabledDate} onChange={onDateChanged} />
                            </div>
                            {followUpDate && (
                                <div className="title fontroboto mt-2">
                                    {moment(followUpDate).format('dddd, Do MMMM YYYY')}
                                </div>
                            )}
                            <div className="d-flex flex-wrap mt-14">
                                {dateOptions.length > 0 &&
                                    dateOptions.map((item, i) => {
                                        return (
                                            <Button key={i} type="text" className="btn btn-primary2 btn-fw-bold mb-14 me-14" onClick={() => onOptionPress(item)}>{item.label}</Button>
                                        )
                                    })}
                            </div>
                        </Col>
                        <Col md={16}>
                            <div className="d-flex align-items-center mb-14">
                                <img className='me-2' src={Notes} alt="Symptoms" />
                                <div className="title-common">Additional Notes</div>
                            </div>
                            <div className="textarea-save">
                                <Input.TextArea placeholder="Enter any specific note here" onFocus={onFocusClick} onBlur={onSaveButtonClick}value={additionalNote} className="textareaPlaceholder fontroboto text-main" rows={3} onChange={onChangeNote} />
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
            </div>
        </>
    );
}


export default React.memo(TabFollowUpBox);
