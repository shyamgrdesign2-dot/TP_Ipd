import React, { useState, useEffect, useCallback, useContext, useMemo, useRef } from "react";
import { Button, Card, DatePicker, Input, Tooltip } from 'antd';

const dateFormat = 'YYYY-MM-DD'
const showDateFormat = 'DD MMM, YY'

function CvtKnowMore(props) {

    const { handleDrawerCvtKnowMore, handleCollapsed } = props
    return (
        <>
            <Card bordered={false} className="search-modalCard ">
                <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                    <div className='align-items-center d-flex'>
                        <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100' onClick={handleDrawerCvtKnowMore}>
                            <i className='icon-Cross fs-3'></i>
                        </Button>
                        <div className="modal-title">AI-Powered Smart Rx Digitisation</div>
                    </div>
                </div>
                <div>this is CVT knowmore page</div>
            </Card>
        </>
    );
}


export default React.memo(CvtKnowMore);