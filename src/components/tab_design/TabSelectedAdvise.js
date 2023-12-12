import React from "react";
import { Button, Checkbox } from 'antd';

function TabSelectedAdvise() {
    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };
    return (
        <>
            <div className="d-flex align-items-center justify-content-between border-bottom py-1">
                <Checkbox onChange={onChange}><div className="text-truncate-twolines">No alcohol</div></Checkbox>
                <Button className="focus-none btn px-1 btn-delete-prescription"><i className="icon-Edit fs-21"></i></Button>
            </div>
            <div className="d-flex align-items-center justify-content-between border-bottom py-1">
                <Checkbox onChange={onChange}><div className="text-truncate-twolines">Avoid spicy food</div></Checkbox>
                <Button className="focus-none btn px-1 btn-delete-prescription"><i className="icon-Edit fs-21"></i></Button>
            </div>
            <div className="d-flex align-items-center justify-content-between border-bottom py-1">
                <Checkbox onChange={onChange}><div className="text-truncate-twolines">No Smoking</div></Checkbox>
                <Button className="focus-none btn px-1 btn-delete-prescription"><i className="icon-Edit fs-21"></i></Button>
            </div>
            <div className="d-flex align-items-center justify-content-between border-bottom py-1">
                <Checkbox onChange={onChange}><div className="text-truncate-twolines">Follow Diet</div></Checkbox>
                <Button className="focus-none btn px-1 btn-delete-prescription"><i className="icon-Edit fs-21"></i></Button>
            </div>
            <div className="d-flex align-items-center justify-content-between border-bottom py-1">
                <Checkbox onChange={onChange}><div className="text-truncate-twolines">Avoid spicy food</div></Checkbox>
                <Button className="focus-none btn px-1 btn-delete-prescription"><i className="icon-Cross fs-21"></i></Button>
            </div>
            <div className="d-flex align-items-center justify-content-between border-bottom py-1">
                <Checkbox onChange={onChange}><div className="text-truncate-twolines">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div></Checkbox>
                <Button className="focus-none btn px-1 btn-delete-prescription"><i className="icon-Edit fs-21"></i></Button>
            </div>
        </>
    );
}

export default TabSelectedAdvise;
