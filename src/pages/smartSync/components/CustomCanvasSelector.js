import React, { useState, useEffect } from 'react';
import { Button, Radio, Empty } from 'antd';
import './RxTemplateManager.scss';

const CANVAS_STORAGE_KEY = 'rxTemplates';

const CustomCanvasSelector = ({ selectedCanvasId, onSelectCanvas, onAddEditCanvas, refreshKey }) => {
  const [canvases, setCanvases] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(CANVAS_STORAGE_KEY);
    if (stored) {
      setCanvases(JSON.parse(stored));
    } else {
      setCanvases([]);
    }
  }, [refreshKey]);

  return (
    <div className="custom-canvas-selector" style={{ border: '2px solid #e4e4ef', padding: 16, borderRadius: 8, background: '#fff' }}>
      <div className="selector-title" style={{ fontWeight: 600, marginBottom: 12 }}>Select Custom Canvas</div>
      <Radio.Group
        className="canvas-radio-group"
        value={selectedCanvasId || 'none'}
        onChange={e => onSelectCanvas(e.target.value)}
        style={{ width: '100%' }}
      >
        <Radio value="none">None</Radio>
        {canvases.length === 0 && (
          <div style={{ margin: '16px 0' }}>
            <Empty description="No custom canvases yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
        {canvases.map(canvas => (
          <Radio value={canvas.id} key={canvas.id}>{canvas.name}</Radio>
        ))}
      </Radio.Group>
      <Button
        className="add-edit-canvas-btn"
        type="primary"
        block
        onClick={onAddEditCanvas}
        style={{ marginTop: 16 }}
      >
        Add/Edit Rx Canvas
      </Button>
    </div>
  );
};

export default CustomCanvasSelector; 