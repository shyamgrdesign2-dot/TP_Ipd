import React, { useState, useContext, useCallback } from 'react';
import { Form, Input } from 'antd';
import { useSelector } from "react-redux";
import LanguageMoreModal from './LanguageMoreModal';

import DoctorWebsiteSettingsContext from '../../context/DoctorWebsiteSettingsContext';
import { blockedEmoji, onlyNumberFormat } from '../../utils/utils';

function DWAboutDoctor() {

    const { aboutDoctor, setAboutDoctor } = useContext(DoctorWebsiteSettingsContext);

    const { languageList } = useSelector((state) => state.doctorWebsite);

    const [languageMoreOptionsVisible, setLanguageMoreOptionsVisible] = useState(false);

    const handleLanguageMoreOptionsVisible = useCallback(
        () => {
            setLanguageMoreOptionsVisible(!languageMoreOptionsVisible)
        },
        [languageMoreOptionsVisible]
    );

    const onChangeInput = useCallback(
        (e, key) => {
            if (key === 'years_experience') {
                if (e.target.value.length < 4 && (!e.target.value || parseInt(e.target.value) <= 100)) {
                    aboutDoctor[key] = onlyNumberFormat(e.target.value);
                }
            } else {
                aboutDoctor[key] = blockedEmoji(e.target.value);
            }
            setAboutDoctor((prev) => { return { ...prev } });
        },
        [aboutDoctor]
    );

    const decrement = useCallback(
        () => {
            if (!aboutDoctor?.years_experience || parseInt(aboutDoctor?.years_experience) > 0) {
                setAboutDoctor((prev) => { return { ...prev, years_experience: prev?.years_experience ? parseInt(prev?.years_experience) - 1 : 1 } });
            }
        },
        [aboutDoctor]
    );
    const increment = useCallback(
        () => {
            if (!aboutDoctor?.years_experience || parseInt(aboutDoctor?.years_experience) < 100) {
                setAboutDoctor((prev) => { return { ...prev, years_experience: prev?.years_experience ? parseInt(prev?.years_experience) + 1 : 1 } });
            }
        },
        [aboutDoctor]
    );

    const onLanguageClick = useCallback(
        (e) => {
            var data = aboutDoctor.hasOwnProperty('language') ? [...aboutDoctor?.language] : []
            if (data.includes(e)) {
                const index = data.indexOf(e);
                if (index > -1) {
                    data.splice(index, 1);
                }
                aboutDoctor.language = [...data];
            } else {
                data.push(e)
                aboutDoctor.language = [...data];
            }
            setAboutDoctor((prev) => { return { ...prev } });
        },
        [aboutDoctor]
    );

    return (
        <div className="bg-white p-20 overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <div className="text-greycolor fontroboto mb-3"> Write a brief introduction. Highlight your role, experience, languages spoken, best qualities, and key skills.</div>
            <Form layout="vertical">
                <Form.Item
                    label="Years of Experience"
                    className='fw-medium mb-20'
                    required>
                    <Input placeholder="12"
                        className="text-capitalize rounded-10px h-38"
                        value={aboutDoctor?.years_experience}
                        onChange={(e) => onChangeInput(e, 'years_experience')} />
                    <div className='position-absolute' style={{ top: 11, right: 11 }}>
                        <i className='icon-minus fs-16 p-2 cursor-pointer' onClick={decrement}></i>
                        <i className='icon-Add fs-16 p-2 cursor-pointer ms-4' onClick={increment}></i>
                    </div>
                </Form.Item>
            </Form>
            <hr className='mt-1' />
            <div className='fw-medium mb-20'>Languages Spoken</div>
            <div className='d-flex flex-wrap'>
                {aboutDoctor.hasOwnProperty('language') && aboutDoctor?.language && aboutDoctor?.language?.map((e, i) => {
                    return (
                        <div key={`${e + "-" + i}`} className={`language-chips border rounded-10px p-2 me-2 mb-2 h-100 cursor-pointer`} onClick={() => onLanguageClick(e)}>
                            <div className='d-flex align-items-cnter fontroboto' style={{ lineHeight: 1.3 }}>
                                {e}
                                <i className={`icon-Cross fs-18 ms-2`}></i>
                            </div>
                        </div>
                    )
                })}
                {languageList?.slice(0, 5)?.filter(e => aboutDoctor.hasOwnProperty('language') ? !aboutDoctor?.language?.includes(e?.title) : e?.title)?.map((e, i) => {
                    return (
                        <div key={`${e?.title + "-" + i}`} className={`${aboutDoctor.hasOwnProperty('language') && aboutDoctor?.language?.includes(e?.title) && 'language-chips'} border rounded-10px p-2 me-2 mb-2 h-100 cursor-pointer`} onClick={() => onLanguageClick(e?.title)}>
                            <div className='d-flex align-items-cnter fontroboto' style={{ lineHeight: 1.3 }}>
                                {e?.title}
                                <i className={`${aboutDoctor.hasOwnProperty('language') && aboutDoctor?.language?.includes(e?.title) ? 'icon-Cross' : 'icon-Add'} fs-18 ms-2`}></i>
                            </div>
                        </div>
                    )
                })}
                <div className="closable-chips rounded-10px p-2 me-2" onClick={handleLanguageMoreOptionsVisible}>
                    <div className='d-flex align-items-cnter fontroboto' style={{ lineHeight: 1.3 }}>
                        More
                        <i className='icon-right iconrotate270 fs-18 ms-2'></i>
                    </div>
                </div>
            </div>
            {languageMoreOptionsVisible && (
                <LanguageMoreModal
                    width='430px'
                    onClose={handleLanguageMoreOptionsVisible}
                    onClick={(e) => {
                        // setLanguageMoreOptionsVisible(false);
                        onLanguageClick(e?.title)
                    }}
                    selectedValue={aboutDoctor.hasOwnProperty('language') ? aboutDoctor?.language : []}
                    array={languageList.slice(5, languageList.length)} />
            )}
            <hr className='mt-1' />
            <div className='title-common'>About Doctor</div>
            <div className="text-greycolor fontroboto my-3"> Write a brief introduction. Share your experience journey, major achievements, best qualities, and key skills. </div>
            <Input.TextArea rows="5"
                showCount
                maxLength={400}
                className="show-count-textarea text-capitalize textareaPlaceholder rounded-10px"
                value={aboutDoctor?.about}
                onChange={(e) => onChangeInput(e, 'about')} />
            <div className="text-greycolor fontroboto my-2"> Write maximum 400 characters </div>
        </div>
    );
}

export default React.memo(DWAboutDoctor);
