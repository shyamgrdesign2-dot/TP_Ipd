import React, { useContext, useMemo, useCallback } from 'react';
import { Button, Table, Switch, Input } from 'antd';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import DoctorWebsiteSettingsContext from '../../context/DoctorWebsiteSettingsContext';
import { MenuOutlined } from '@ant-design/icons';
import { CSS } from '@dnd-kit/utilities';

const RowContext = React.createContext({});
const DragHandle = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);

    return (
        <MenuOutlined
            ref={setActivatorNodeRef}
            style={{
                touchAction: 'none',
                cursor: 'move',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            {...listeners}
        />
    );
};
const CustomRow = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props['data-row-key'],
    });
    const style = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging
            ? {
                position: 'relative',
                zIndex: 9999,
            }
            : {}),
    };
    const contextValue = useMemo(
        () => ({
            setActivatorNodeRef,
            listeners,
        }),
        [setActivatorNodeRef, listeners],
    );
    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};

function DWMembership() {

    const { membership, setMembership } = useContext(DoctorWebsiteSettingsContext);

    const patientInfoTable = [
        {
            key: 'sort',
            colSpan: 2,
            width: 50,
            align: 'center',
            dataIndex: 'sort',
            render: () => <DragHandle />
        },
        {
            colSpan: 0,
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <Input placeholder="12"
                        className="text-capitalize rounded-10px h-38"
                        value={record.title}
                    // onChange={(e) => onChangeInput(e, 'title')}
                    />

                </div>
            ),
        },
        {
            dataIndex: 'enable',
            key: 'enable',
            render: (text, record) =>
                <i className="icon-delete"></i>

        },
    ];

    const onDragEndPatientInfo = ({ active, over }) => {
        if (active.title !== over?.title) {
            setMembership((prev) => {
                const activeIndex = prev.membership.findIndex((i) => i.title === active.title);
                const overIndex = prev.membership.findIndex((i) => i.title === over?.title);
                return {
                    ...prev,
                    membership: {
                        title: { ...prev.membership[0].title },

                    }
                };
            });
        }
    };

    const addMemberShipClick = useCallback(
        () => {
            membership.push({
                title: ''
            })
            setMembership((prev) => { return [...prev] });
        },
        [membership]
    );


    return (
        <div className="bg-white overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <div className='p-20'>
                <div className="text-greycolor fontroboto"> Include the memberships you are associated with.</div>
                {membership.map((e, i) => {
                    return (
                        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEndPatientInfo}>
                            <SortableContext
                                // rowKey array
                                items={membership.map((i) => i.title)}
                                strategy={verticalListSortingStrategy}
                            >
                                <Table
                                    className='customize-table table-display-patient'
                                    pagination={false}
                                    components={{
                                        body: {
                                            row: CustomRow,
                                        },
                                    }}
                                    rowKey="id"
                                    columns={patientInfoTable}
                                    dataSource={membership}
                                    showHeader={false}
                                />
                            </SortableContext>
                        </DndContext>
                    )
                })}

                <Button className='btn btn-input w-100 btn-41 d-flex align-items-center justify-content-center mt-3' onClick={addMemberShipClick} ><i className='icon-Add fs-18 me-2'></i>Add Service</Button>
            </div>
        </div>
    );
}

export default DWMembership;
