import { MenuOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useState } from 'react';
import { Table, Switch, Row, Col } from 'antd';



const Row1 = ({ children, ...props }) => {
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
const CustomizeSetting = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      name: 'Vitals & Calculator',
      status: true
    },
    {
      key: '2',
      name: 'Medical History / Allergy',
      status: false
    },
    {
      key: '3',
      name: 'Lab Results',
      status: true
    },
  ]);
  const columns = [
    {
      title: 'LEFT SIDE OF ELEMETNS',
      key: 'sort',
      colSpan: 2,
      align: 'left',
      dataIndex: 'sort',
    },
    {
      title: '',
      colSpan: 0,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ENABLE/DISABLE',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => <Switch defaultChecked onChange={(checked) => onChange(checked, record)} checked={text} />,
    },
  ];

  const onChange = (checked, record) => {
    const index = dataSource.findIndex(e => e.key == record.key)
    if (index != -1) {
      dataSource[index].status = checked
      setDataSource((prev) => [...prev]);
    }
  };
  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };
  return (
    <div className='p-4'>
    <Row gutter={40} >
      <Col lg={12}>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            // rowKey array
            items={dataSource.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              className='customize-table'
              pagination={false}
              components={{
                body: {
                  row: Row1,
                },
              }}
              rowKey="key"
              columns={columns}
              dataSource={dataSource}
            />
          </SortableContext>
        </DndContext>
      </Col>
      <Col lg={12}>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            // rowKey array
            items={dataSource.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              className='customize-table'
              pagination={false}
              components={{
                body: {
                  row: Row1,
                },
              }}
              rowKey="key"
              columns={columns}
              dataSource={dataSource}
            />
          </SortableContext>
        </DndContext>
      </Col>
    </Row>
    </div>
  );
};
export default CustomizeSetting;