import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Button } from 'antd';

function HeaderWhatsAppSetting(props) {

    const { handleDrawerOwnLetterHead } = props

    const onWhatsappSaveSettingsClick = async () => {

    };

    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <div className='align-items-center d-flex w-100 h-100 justify-content-between'>
                <div className='align-items-center d-flex h-100 w-100'>
                    <div className='border-end h-100 text-center me-2'>
                        <div className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer' onClick={handleDrawerOwnLetterHead}>
                            <i className='icon-right'></i>
                        </div>
                    </div>
                    <div className='title-common'>
                        Whatsapp Rx Preview
                    </div>
                </div>
                <div className='d-flex align-items-center justify-content-end w-100'>
                    <Button type='button' className="btn-41 btn px-4 btn-primary3 me-4" onClick={onWhatsappSaveSettingsClick}>
                        Save
                    </Button>
                </div>
            </div>
        </Navbar>
    );
}

export default React.memo(HeaderWhatsAppSetting);