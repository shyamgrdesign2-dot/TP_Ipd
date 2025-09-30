import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Table, Switch, Row, Col, Button, Card, Popover, Modal } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy, } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { errorMessage, getClinicName } from "../utils/utils";

import CashManagerContext from "../context/CashManagerContext";

import { useSelector, useDispatch } from "react-redux";
import { customizedPad, listVideo } from "../redux/doctorsSlice";

import tutorial from '../assets/images/tutorial-icon.svg';
import playcover2 from '../assets/images/play-cover2.png';
import playIcons from '../assets/images/tube-icon.svg';
import fullicon from '../assets/images/full-icon.svg';
import VideoModal from './VideoModal';
import { useAccess } from '../pages/vaccination/useAccess';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { GB_CARE_PLAN, GB_ISCRIBE } from '../utils/constants';
import customModuleIcon from '../assets/images/custom-module.svg';

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

function CustomizeSetting({ handleDrawerCustomize, isVaccinationEnabled, isGrowthChartEnabled, page }) {

  const { setSymptomsData, setExaminationData, setDiagnosisData, setAdviceData, setInvestigationData, setMedicationData, setVitalsData, setMedicalHistoryData, setPrivateNotesData, setFollowUpDate, setAdditionalNote } = useContext(CashManagerContext);
  const { loading, customizedPadLeftList, customizedPadRightList, videoList, profile } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();
  const [dataSourceLeft, setDataSourceLeft] = useState([]);
  const [dataSourceRight, setDataSourceRight] = useState([]);

  const [popOverVideo, setPopOverVideo] = useState(false);
  const [videoLink, setVideoLink] = useState(null);
  const { isGynaecHistoryAccessable } = useAccess();
  const {customModules} = useSelector((state) => state.customModules);
  const isCarePlanEnabled = useFeatureIsOn(GB_CARE_PLAN);

  useEffect(() => {
    if (customizedPadLeftList.length > 0) {
      let updatedData = customizedPadLeftList
      // Hide Care Plan completely when GB flag is OFF
      .filter(e => e.tmdpm_id === 22 ? isCarePlanEnabled : true)
      .filter(e => e.tmdpm_id === 7 && e.tmdpm_status === 0 ? isVaccinationEnabled : e.tmdpm_id === 16 && e.tmdpm_status === 0 ? isGrowthChartEnabled : e.tmdpm_id === 17 && e.tmdpm_status === 0 ? isGynaecHistoryAccessable : true).map((e, i) => {
        return { ...e };
      });
      updatedData = updatedData.filter((item) => item?.tmdpm_id !== 20);
      setDataSourceLeft(updatedData);
    }
    dispatch(listVideo());
  }, [handleDrawerCustomize]);

  useEffect(() => {
    if (customizedPadRightList.length > 0) {
      const updatedData = customizedPadRightList.map((e) => ({ ...e }));
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
      render: (text, record) => <div className='align-items-center d-flex'><img src={record.tmdpm_icon_url} className='me-3' style={{ marginLeft: -12 }} />{(isGynaecHistoryAccessable && record.tmdpm_name === "Medical History") ? "Gynec History" : record.tmdpm_name}</div>
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
      render: (text, record) => <div className='align-items-center d-flex'><img src={record.is_custom_module ? customModuleIcon : record.tmdpm_icon_url} className='me-3' style={{ marginLeft: -12 }} />{record.tmdpm_name}</div>
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
        if (left.findIndex(e => e.tmdpm_id === 3 && e.tmdpm_status === 0) === -1) {
          setMedicalHistoryData([])
        }
        if (left.findIndex(e => e.tmdpm_id === 8 && e.tmdpm_status === 0) === -1) {
          setMedicalHistoryData([])
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
      const customModulesInPad = customModules?.map((cm) => ({
        tmdpm_id: cm.module_id,
        tmdpm_name: cm.name,
        tmdpm_short_name: cm.name,
        tmdpm_type: "R",
        tmdpm_status: 0,
        is_custom_module: true,
  }))
      const addCustomModulesPayload = {
        default: false,
        reset: false,
        left: action.payload.left,
        right: [...action.payload.right,...customModulesInPad]
      }
      const customModulesAction = await dispatch(customizedPad({data:addCustomModulesPayload}))
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
      if (left.findIndex(e => e.tmdpm_id === 3 && e.tmdpm_status === 0) === -1) {
        setMedicalHistoryData([])
      }
      if (left.findIndex(e => e.tmdpm_id === 8 && e.tmdpm_status === 0) === -1) {
        setMedicalHistoryData([])
      }
      errorMessage('Action successfully')
      handleDrawerCustomize()
    } else {
      errorMessage(action.error)
    }
  }

  //PopOverVideo function
  const showHideVideoListPopover = useCallback(() => {
    setPopOverVideo(!popOverVideo);
  }, [popOverVideo]);

  //Video Componet
  const VIDEO_CONTENT = useCallback(() => {
    return (
      <>
        <div className="video-contant rounded-4 p-20" key="oneclickrx-video">
          <div className="align-items-center d-flex justify-content-between border-bottom mb-20 pb-2">
            <div className="title-common lh-base">Video Tutorial</div>
            <Button className="btn btn-delete-prescription p-0"
              onClick={showHideVideoListPopover}>
              <i className="icon-Cross" />
            </Button>
          </div>
          {videoList[0]?.video?.map((item1, i1) => {
            return (
              <div key={i1} className={`d-flex ${i1 !== videoList[0]?.video.length - 1 && 'pb-3 mb-15 border-bottom'}`}>
                <div className="tutorial-play me-14">
                  <button type="button"
                    onClick={() => {
                      setVideoLink(item1)
                      const clinic_name = getClinicName(profile?.hospital_data);
                      window.Moengage.track_event("TP_Tutorial_Viewed", {
                        clinic_name,
                        tutorial_type: videoList[0]?.category,
                      });
                    }}
                  >
                    <img src={playIcons} />
                  </button>
                  <span className='tutorial-thumb'><img src={item1.thumbnail} /></span>
                </div>
                <div>
                  <h3 className="title-common text-welcome">{item1?.tmv_title}</h3>
                  <div className="fs-12 fontroboto fw-normal text-main">{item1?.tmv_description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </>
      // <>
      //   <div className="video-contant rounded-4 p-20" key="oneclickrx-video">
      //     <div className="align-items-center d-flex justify-content-between border-bottom mb-20 pb-2">
      //       <div className="title-common">Video Tutorial</div>
      //       <Button className="btn btn-delete-prescription p-0"
      //         onClick={showHideVideoListPopover}>
      //         <i className="icon-Cross" />
      //       </Button>
      //     </div>
      //     {videoList[0]?.video?.map((item1, i1) => {
      //       return (
      //         <div key={i1} className="d-flex flex-column mb-3">
      //           <div className="tutorial-play">
      //             <button type="button" onClick={() => setVideoLink(item1)}><img src={playIcons} /></button>
      //             <span><img className='w-100 rounded-3' src={item1.thumbnail} /></span>
      //           </div>
      //           <div className='mt-2'>
      //             <div className="fs-12 fontpoppins fw-medium text-main">{item1?.tmv_description}</div>
      //           </div>
      //         </div>
      //       )
      //     })}
      //   </div>
      // </>
    );
  }, [popOverVideo]);

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

            <Popover
              open={popOverVideo}
              onOpenChange={showHideVideoListPopover}
              content={VIDEO_CONTENT}
              trigger="click"
              overlayClassName="pop-430 pp-0 videoTutorial"
              placement="bottom"
            >
              <button className='btn d-flex align-items-center btn-text me-10 tutorial'>
                {/* onClick={showHideVideoListPopover} */}
                <span className='text-decoration-none rounded-5 pe-3 bg-white shadow2'><img height={42} src={tutorial} />Tutorial</span>
              </button>
            </Popover>

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
        <Col lg={12} sm={12} className='pe-3'>
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
        { page === "normal-rx-page" &&
          <Col lg={12} sm={12} className='ps-3'>
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
        }
      </Row>

      {videoLink && (
        <VideoModal
          videoLink={videoLink}
          onCancel={() => setVideoLink(null)}
        />
      )}
    </div>
  );
};
export default React.memo(CustomizeSetting);