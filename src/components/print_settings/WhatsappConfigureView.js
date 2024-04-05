import React from "react";
import { Button, Spin } from "antd";
import { Navbar } from 'react-bootstrap';
import { NORMAL } from "../../utils/constants";
import Quixote from "../../pages/Quixote";
import wtsp from '../../assets/images/wtsp.svg';

function WhatsappConfigureView(props) {

    const { handleDrawerWhatsappView } = props

    return (
        <>
            <Navbar className="justify-content-between headerprescription bg-white p-0">
                <div className='align-items-center d-flex w-100 h-100 justify-content-between'>
                    <div className='align-items-center d-flex h-100 w-100'>
                        <div className='border-end h-100 text-center me-4'>
                            <div className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer' onClick={handleDrawerWhatsappView}>
                                <i className='icon-right'></i>
                            </div>
                        </div>
                        <div className='title-common'>
                            WhatsApp Rx Preview
                        </div>
                    </div>
                    <div className='d-flex align-items-center justify-content-end w-100'>
                        <Button type='button' className="btn-41 btn px-4 btn-primary3 me-4" onClick={handleDrawerWhatsappView}>
                            Done
                        </Button>
                    </div>
                </div>
            </Navbar>

            <div className={'w-100 bg-body d-flex wrapper2'}>
                <div className="mx-auto">
                    <div className="titleprint mt-20"><img className="img-fluid me-2" width={25} src={wtsp} alt="WhatsApp" /> WhatsApp Preview</div>
                    <div className="border rounded-20px bg-white mt-20 overflow-auto" style={{ height: 'calc(100vh - 136px)' }}>
                        <Spin style={{ position: 'absolute', zIndex: 0, left: "50%", top: "50%" }} />
                        <Quixote mode={NORMAL} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default React.memo(WhatsappConfigureView);