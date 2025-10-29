import React from 'react';
import { Table } from 'antd';
import './styles.scss';

function normalizeColumns(columns) {
  if (!columns?.length) return [];
  if (typeof columns[0] === 'string') {
    return columns.map((t, i) => ({
      key: `c${i}`,
      dataIndex: `c${i}`,
      title: t,
      align: 'center',
      className: 'st__th',
    }));
  }
  // already objects
  return columns.map((c, i) => ({
    key: c.key ?? `c${i}`,
    dataIndex: c.key ?? `c${i}`,
    title: c.title,
    width: c.width,
    align: 'center',
    className: 'st__th',
  }));
}

function normalizeRows(rows, cols) {
  if (!rows?.length) return [];
  if (Array.isArray(rows[0])) {
    return rows.map((arr, r) => {
      const obj = { key: `r${r}` };
      cols.forEach((col, i) => (obj[col.dataIndex] = arr[i] ?? ''));
      return obj;
    });
  }
  return rows.map((r, i) => ({ key: r.key ?? `r${i}`, ...r }));
}

export default function SectionedTable({ title = '', sections }) {
  return (
    <div className='st__card'>
      {title ? <div className='st__title'>{title}</div> : null}

      {sections?.map((section, idx) => {
        // Create components object for custom header rendering
        const components = {
          header: {
            wrapper: 'thead',
            row: 'tr',
            cell: 'th',
          },
        };

        // Process columns and data
        const cols = normalizeColumns(section.columns);
        const dataSource = normalizeRows(section.values, cols);

        // Add section title row to dataSource if title exists
        const tableColumns = cols.map((col, index) => ({
          ...col,
          onHeaderCell: () => ({
            className: index === 0 && section.title ? 'st__section-header-first' : 'st__th',
          }),
        }));

        return (
          <div className='st__section' key={`sec-${idx}`}>
            <div className='st__tableWrap'>
              <Table
                bordered
                pagination={false}
                columns={tableColumns}
                dataSource={dataSource}
                size='small'
                className='st__table'
                components={components}
                title={() => 
                  section.title ? (
                    <div className="st__section-header">
                      <span>{section.title}</span>
                    </div>
                  ) : null
                }
              />
            </div>

            {section.remarks ? (
              <div className='st__remarks'>
                <span className='st__remarksLabel'>Remarks :</span>{' '}
                <span className='st__remarksText'>{section.remarks}</span>
              </div>
            ) : null}
            {section.diagnosisNotes ? (
              <div className='st__remarks'>
                <span className='st__remarksLabel'>Diagnosis Notes :</span>{' '}
                <span className='st__remarksText'>{section.diagnosisNotes}</span>
              </div>
            ) : null}

            {idx < sections.length - 1 ? <div className='ipd-obs-st__divider' /> : null}
          </div>
        );
      })}
    </div>
  );
}