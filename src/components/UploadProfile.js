import React, { useState } from 'react';
import defaultprofile from '../assets/images/default-profile.svg';

function UploadProfile() {
    const [file, setFile] = useState(null);

    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    return (
        <>
            <div>
                <img className='profilepic' src={file ? file : defaultprofile} alt='Profile Photo' />
            </div>
            <div className='text-center mt-4'>
                <div className='btn btn-input btn-41 d-flex align-items-center'>
                    <input type="file" accept="image/*" onChange={handleChange} />
                    <i className='icon-camera me-3'></i> <span>Upload Profile</span>
                </div>
            </div>
        </>
    )
}

export default React.memo(UploadProfile)