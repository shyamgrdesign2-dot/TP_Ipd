import React from "react";
import { Button, Card, Row, Col } from 'antd';

function HistoryBox(props) {
    const { handleDrawerVital } = props

    return (
        <>
            <Card bordered={false} className="search-modalCard">
                <div>
                    <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                        <div className='align-items-center d-flex h-100'>
                            <div className='border-end h-100 text-center me-3'>
                                <div className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                    <i className='icon-right'></i>
                                </div>
                            </div>
                            <div className="title-common">Medical History</div>
                        </div>
                        <Button className='btn btn-primary3 btn-41 px-4 me-20' disabled>
                            Save
                        </Button>
                    </div>
                </div>
                <Row className='h-100 align-items-center w-100 justify-content-between'>
                    <Col lg={16}>
                        <div className="bg-white h-100">
                            <div className="border-bottom p-4">
                                <div className="titleprint">Medical problem?</div>
                                <div>
                                    <Button className="btn rounded-10px">Diabetes</Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={8} className='h-100'>
                        <div className="">

                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    );
}


export default React.memo(HistoryBox);
