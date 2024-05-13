import React from "react";
import { Modal } from "antd";

import fullicon from '../assets/images/full-icon.svg';

function VideoModal({ videoLink, onCancel }) {
    return (
        <Modal
            open={videoLink}
            centered
            footer={null}
            width={1000}
            className="prescription-pad"
            onCancel={onCancel}
        >
            <div className='use-prescription d-flex w-100 justify-content-between'>
                <h5 className="mb-0">{videoLink?.tmv_title}</h5>
                <a href={videoLink?.link} target='_blank'><img src={fullicon} /></a>
            </div>
            <div className="videodrawer">
                <iframe width="100%" height="520" src={videoLink?.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
        </Modal>
    );
}

export default React.memo(VideoModal);
