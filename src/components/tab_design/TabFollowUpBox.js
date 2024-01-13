import React, { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { Input, Button, Drawer, Tabs, message, Select, Card, Spin, Row, Col, DatePicker } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import CashManagerContext from '../../context/CashManagerContext';
import { MESSAGE_KEY } from "../../utils/constants";
import { onlyNumberFormat, getFormattedDate } from "../../utils/utils";
import Symptomsicon from "../../assets/images/Symptoms.svg";

const dateFormat = 'YYYY-MM-DD'

function TabFollowUpBox() {

    const [messageApi, contextHolder] = message.useMessage();

    const { followUpDate, setFollowUpDate, additionalNote, setAdditionalNote } = useContext(CashManagerContext);
    const [followUpInput, setFollowUpInput] = useState('');

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

    const onOptionPress = useCallback(
        (e) => {
            setFollowUpInput(e.label)
            setFollowUpDate(getFormattedDate(moment(moment().format(dateFormat)).subtract(parseInt(e.value), e.unit).format(dateFormat)))
        },
        [followUpDate]
    );

    const onChangeNote = useCallback(
        (e) => {
            setAdditionalNote(e.target.value)
        },
        [additionalNote]
    );

    return (
        <>
            {contextHolder}
            <div className="prescription-box-sm p-20px">
                <div className="p-14-pb0">
                    <Row gutter={30}>
                        <Col md={7}>
                            <div className="d-flex align-items-center mb-14">
                                <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                <div className="title-common">Follow-up</div>
                            </div>
                            {/* <DatePicker className="w-100" /> */}
                            <Input className="w-100" placeholder="e.g. 3 Days" value={followUpInput} inputMode="numeric" onChange={onChangeFollowUp} allowClear />
                            {followUpDate && (
                                <div className="title fontroboto mt-2">
                                    {moment(followUpDate).format('dddd, Do MMMM YYYY')}
                                </div>
                            )}
                            <div className="d-flex flex-wrap mt-14">
                                {dateOptions.length > 0 &&
                                    dateOptions.map((item, i) => {
                                        return (
                                            <Button key={i} type="text" className="btn btn-primary2 chips-custom mb-14 me-14" onClick={() => onOptionPress(item)}>{item.label}</Button>
                                        )
                                    })}
                            </div>
                        </Col>
                        <Col md={17}>
                            <div className="d-flex align-items-center mb-14">
                                <img className='me-2' src={Symptomsicon} alt="Symptoms" />
                                <div className="title-common">Additional Notes</div>
                            </div>
                            <div className="textarea-save">
                                <Input.TextArea placeholder="Enter any specific note here" defaultValue={additionalNote} className="textareaPlaceholder fontroboto text-main" rows={3} onChange={onChangeNote} />
                                {/* <Button className="d-flex align-items-center textarea-save-btn">
                                    <i className="icon-check"></i>
                                    <a className="text-decoration-underline">Save</a>
                                </Button> */}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}


export default React.memo(TabFollowUpBox);
