import React from "react";
import { Button, Card, Input } from 'antd';

function PrivateNotesBox(props) {
    const { handleDrawerPrivateNotes } = props
    return (
        <>
            <Card bordered={false} className="search-modalCard ">
                <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                    <div className='align-items-center d-flex'>
                        <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100' onClick={handleDrawerPrivateNotes}>
                            <i className='icon-Cross fs-3'></i>
                        </Button>
                        <div className="modal-title">Add Private Note</div>
                    </div>
                    <Button className='btn btn-primary3 btn-41 px-4 me-20' disabled>
                        Save
                    </Button>
                </div>
                <div className="px-20 py-3 bg-body">
                    <div className="title-common mb-2"> Private Note</div>
                    <div className="text-greycolor fontroboto mb-3"> 
                        This note only be visible to you and will not be printed. And you will be able to see in Patient Details.
                    </div>
                    <Input.TextArea placeholder="Write your notes" className="textareaPlaceholder" rows={4} />
                    <button className="mt-2 btn d-flex align-items-center btn-text">
                       <i className="icon-delete me-2 fs-5"></i> Delete Note
                    </button>
                </div>
            </Card>
        </>
    );
}


export default React.memo(PrivateNotesBox);
