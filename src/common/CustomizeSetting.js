import React, { useState, useEffect, useContext } from 'react';
import { Table, Switch, Row, Col, Button, Card } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy, } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { errorMessage } from "../utils/utils";

import CashManagerContext from "../context/CashManagerContext";

import { useSelector, useDispatch } from "react-redux";
import { customizedPad } from "../redux/doctorsSlice";

const CustomRow = ({ children, ...props }) => {
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
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      },
    ),
    transition,
    ...(isDragging
      ? {
        position: 'relative',
        zIndex: 9999,
      }
      : {}),
  };
  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === 'sort') {
          return React.cloneElement(child, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{
                  touchAction: 'none',
                  cursor: 'move',
                }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

function CustomizeSetting({ handleDrawerCustomize }) {

  const { setSymptomsData, setExaminationData, setDiagnosisData, setAdviceData, setInvestigationData, setMedicationData, setVitalsData, setFollowUpDate, setAdditionalNote } = useContext(CashManagerContext);
  const { loading, customizedPadLeftList, customizedPadRightList } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();

  const [dataSourceLeft, setDataSourceLeft] = useState([]);
  const [dataSourceRight, setDataSourceRight] = useState([]);


  useEffect(() => {
    if (customizedPadLeftList.length > 0) {
      const updatedData = customizedPadLeftList.map((e, i) => {
        return { ...e };
      });
      setDataSourceLeft(updatedData);
    }
  }, [handleDrawerCustomize]);

  useEffect(() => {
    if (customizedPadRightList.length > 0) {
      const updatedData = customizedPadRightList.map((e, i) => {
        return { ...e };
      });
      setDataSourceRight(updatedData);
    }
  }, [handleDrawerCustomize]);

  //LEFT SIDE OF ELEMETNS
  const columnsLeft = [
    {
      title: 'LEFT SIDE OF ELEMETNS',
      key: 'sort',
      colSpan: 2,
      align: 'left',
      width: 50,
      dataIndex: 'sort',
    },
    {
      title: '',
      colSpan: 0,
      dataIndex: 'tmdpm_name',
      key: 'tmdpm_name',
      render: (text, record) => <div className='align-items-center d-flex'><img src={record.tmdpm_icon_url} className='me-3' style={{ marginLeft: -12 }} />{record.tmdpm_name}</div>
    },
    {
      title: 'ENABLE/DISABLE',
      dataIndex: 'tmdpm_status',
      key: 'tmdpm_status',
      render: (text, record) => <Switch defaultChecked onChange={(checked) => onChangeLeft(checked, record)} checked={text ? false : true} />,
    },
  ];

  const onChangeLeft = (checked, record) => {
    const index = dataSourceLeft.findIndex(e => e.tmdpm_id == record.tmdpm_id)
    if (index !== -1) {
      dataSourceLeft[index].tmdpm_status = checked ? 0 : 1
      setDataSourceLeft((prev) => [...prev]);
    }
  };

  const onDragEndLeft = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSourceLeft((previous) => {
        const activeIndex = previous.findIndex((i) => i.tmdpm_id === active.id);
        const overIndex = previous.findIndex((i) => i.tmdpm_id === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  //RIGHT SIDE OF ELEMETNS
  const columnsRight = [
    {
      title: 'RIGHT SIDE OF ELEMETNS',
      key: 'sort',
      colSpan: 2,
      width: 50,
      align: 'left',
      dataIndex: 'sort',
    },
    {
      title: '',
      colSpan: 0,
      dataIndex: 'tmdpm_name',
      key: 'tmdpm_name',
      render: (text, record) => <div className='align-items-center d-flex'><img src={record.tmdpm_icon_url} className='me-3' style={{ marginLeft: -12 }} />{record.tmdpm_name}</div>
    },
    {
      title: 'ENABLE/DISABLE',
      dataIndex: 'tmdpm_status',
      key: 'tmdpm_status',
      render: (text, record) => <Switch defaultChecked onChange={(checked) => onChangeRight(checked, record)} checked={text ? false : true} />,
    },
  ];

  const onChangeRight = (checked, record) => {
    const index = dataSourceRight.findIndex(e => e.tmdpm_id == record.tmdpm_id)
    if (index !== -1) {
      dataSourceRight[index].tmdpm_status = checked ? 0 : 1
      setDataSourceRight((prev) => { return [...prev] });
    }
  };

  const onDragEndRight = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSourceRight((previous) => {
        const activeIndex = previous.findIndex((i) => i.tmdpm_id === active.id);
        const overIndex = previous.findIndex((i) => i.tmdpm_id === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  async function onCustomizePadClick() {
    if (dataSourceLeft.length == 0) {
      errorMessage('Something went wrong! please try again later')
    } else if (dataSourceRight.length == 0) {
      errorMessage('Something went wrong! please try again later')
    } else if (dataSourceLeft.length > 0 && dataSourceLeft.filter((e) => !e.tmdpm_status).length <= 0) {
      errorMessage('Please enable at least one left side of elemetns')
    } else if (dataSourceRight.length > 0 && dataSourceRight.filter((e) => !e.tmdpm_status).length <= 0) {
      errorMessage('Please enable at least one right side of elemetns')
    } else {
      var sendData = {
        data: {
          default: false,
          reset: false,
          left: dataSourceLeft,
          right: dataSourceRight,
        }
      }
      const action = await dispatch(customizedPad(sendData))
      if (action.meta.requestStatus === "fulfilled") {
        const left = action.payload.left
        const right = action.payload.right
        if (right.findIndex(e => e.tmdpm_id === 5 && e.tmdpm_status === 0) === -1) {
          setSymptomsData([])
        }
        if (right.findIndex(e => e.tmdpm_id === 10 && e.tmdpm_status === 0) === -1) {
          setExaminationData([])
        }
        if (right.findIndex(e => e.tmdpm_id === 11 && e.tmdpm_status === 0) === -1) {
          setDiagnosisData([])
        }
        if (right.findIndex(e => e.tmdpm_id === 12 && e.tmdpm_status === 0) === -1) {
          setMedicationData([])
        }
        if (right.findIndex(e => e.tmdpm_id === 13 && e.tmdpm_status === 0) === -1) {
          setAdviceData([])
        }
        if (right.findIndex(e => e.tmdpm_id === 14 && e.tmdpm_status === 0) === -1) {
          setInvestigationData([])
        }
        if (right.findIndex(e => e.tmdpm_id === 15 && e.tmdpm_status === 0) === -1) {
          setFollowUpDate(null)
          setAdditionalNote('')
        }
        if (left.findIndex(e => e.tmdpm_id === 1 && e.tmdpm_status === 0) === -1) {
          setVitalsData([])
        }
        handleDrawerCustomize()
      } else {
        errorMessage(action.error)
      }
    }
  }

  async function onDefaultPadClick() {
    errorMessage('Action in progress..')
    var sendData = {
      data: {
        default: true,
        reset: false
      }
    }
    const action = await dispatch(customizedPad(sendData))
    if (action.meta.requestStatus === "fulfilled") {
      const left = action.payload.left
      const right = action.payload.right
      if (right.findIndex(e => e.tmdpm_id === 5 && e.tmdpm_status === 0) === -1) {
        setSymptomsData([])
      }
      if (right.findIndex(e => e.tmdpm_id === 10 && e.tmdpm_status === 0) === -1) {
        setExaminationData([])
      }
      if (right.findIndex(e => e.tmdpm_id === 11 && e.tmdpm_status === 0) === -1) {
        setDiagnosisData([])
      }
      if (right.findIndex(e => e.tmdpm_id === 12 && e.tmdpm_status === 0) === -1) {
        setMedicationData([])
      }
      if (right.findIndex(e => e.tmdpm_id === 13 && e.tmdpm_status === 0) === -1) {
        setAdviceData([])
      }
      if (right.findIndex(e => e.tmdpm_id === 14 && e.tmdpm_status === 0) === -1) {
        setInvestigationData([])
      }
      if (right.findIndex(e => e.tmdpm_id === 15 && e.tmdpm_status === 0) === -1) {
        setFollowUpDate(null)
        setAdditionalNote('')
      }
      if (left.findIndex(e => e.tmdpm_id === 1 && e.tmdpm_status === 0) === -1) {
        setVitalsData([])
      }
      errorMessage('Action successfully')
      handleDrawerCustomize()
    } else {
      errorMessage(action.error)
    }
  }

  return (
    <div>
      <Card bordered={false} className="search-modalCard">
        <div className='modalCard-header align-items-center justify-content-between d-flex'>
          <div className='align-items-center d-flex w-100'>
            <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100' onClick={handleDrawerCustomize}>
              <i className='icon-Cross fs-3'></i>
            </Button>
            <div className="modal-title text-truncate-twolines">{'Customize Your Pad'}</div>
          </div>
          <div className='d-flex align-items-center justify-content-end w-100'>
            <button className='btn d-flex align-items-center btn-text me-14' onClick={onDefaultPadClick}>
              <span>Default Settings</span>
            </button>
            <Button type='button' className="btn-41 btn px-4 btn-primary3 me-4" onClick={onCustomizePadClick} loading={loading}>
              Save
            </Button>
          </div>
        </div>
      </Card>

      <Row className='p-4'>
        <Col lg={12} className='pe-3'>
          <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEndLeft}>
            <SortableContext
              // rowKey array
              items={dataSourceLeft.map((i) => i.tmdpm_id)}
              strategy={verticalListSortingStrategy}
            >
              <Table
                className='customize-table'
                pagination={false}
                components={{
                  body: {
                    row: CustomRow,
                  },
                }}
                rowKey="tmdpm_id"
                columns={columnsLeft}
                dataSource={dataSourceLeft}
              />
            </SortableContext>
          </DndContext>
        </Col>
        <Col lg={12} className='ps-3'>
          <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEndRight}>
            <SortableContext
              // rowKey array
              items={dataSourceRight.map((i) => i.tmdpm_id)}
              strategy={verticalListSortingStrategy}
            >
              <Table
                className='customize-table'
                pagination={false}
                components={{
                  body: {
                    row: CustomRow,
                  },
                }}
                rowKey="tmdpm_id"
                columns={columnsRight}
                dataSource={dataSourceRight}
              />
            </SortableContext>
          </DndContext>
        </Col>
      </Row>
    </div>
  );
};
export default React.memo(CustomizeSetting);