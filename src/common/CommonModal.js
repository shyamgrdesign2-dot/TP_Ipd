import React from 'react';
import { Modal, Card } from 'antd';

function CommonModal({ isModalOpen, title, modalBody }) {

    return (
        <Modal open={isModalOpen} centered closeIcon={false} footer={null} className='modalcommon'>
            <Card
                title={title}
                extra={
                    <button className='btn p-1 lh-1 btnclose closeButton' onClick={''}>
                        <i className='icon-Cross'></i>
                    </button>
                }>
                {modalBody}
            </Card>
        </Modal>
    )
}

export default CommonModal