import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Button, message } from 'antd';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { PlusOutlined, MinusOutlined, RedoOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import reuploadIcon from "../../../assets/images/reupload.svg";
import tutorialIcon from '../../../assets/images/tutorial.svg';
import { dataUrlToFileUsingFetch } from '../../../utils/utils';
import { updateCustomSyncPadTemplate } from '../services/uploadService';
import './RxTemplateUploadDrawer.scss';

const EditTemplateModal = ({ visible, onClose, template, onSave }) => {
  const [file, setFile] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const cropperRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (template && visible) {
      

      const editPages = template.uploaded_files.map((file, index) => ({
        id: `edit-page-${file.id}-${index}`,
        image: file.file_url,
        showFile: file.file_url,
        croppedImage: null,
        uploadFile: null,
        hasBeenEdited: false,
        isReady: true,
        zoom: 1,
        rotation: 0,
        cropBoxData: null,
        order: file.order || index + 1,
        pageNumber: index + 1,
        originalFileId: file.id,
        unique_id: file.unique_id,
        // Auto-save state tracking
        autoSavedState: {
          zoom: 1,
          rotation: 0,
          cropBoxData: null,
          croppedImage: null,
          hasBeenEdited: false
        },
        originalState: {
          image: file.file_url,
          zoom: 1,
          rotation: 0
        }
      }));

      setFile({
        id: template.id,
        name: template.title,
        originalFile: template,
        originalFileType: "object",
        originalFileConstructor: "Template",
        pagesCount: editPages.length,
        pages: editPages
      });
      setSelectedPageIndex(0);
      setZoom(1);
    }
  }, [template, visible]);

  // Cleanup on close
  useEffect(() => {
    if (!visible) {
      setFile(null);
      setSelectedPageIndex(0);
      setZoom(1);
      // Clear auto-save timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    }
  }, [visible]);


  useEffect(() => {
    if (file?.pages && file.pages[selectedPageIndex]) {
      // Reset zoom when page changes
      setZoom(1);
      
      // Small delay to ensure the cropper component has mounted
      setTimeout(() => {
        if (cropperRef.current?.cropper) {
          const cropper = cropperRef.current.cropper;
          // Reset cropper to default state
          cropper.reset();
        }
      }, 100);
    }
  }, [selectedPageIndex, file?.pages]);

  // Auto-save page state when user finishes cropping
  const autoSavePageState = (isCropping = false) => {
    if (!file?.pages || !cropperRef.current?.cropper) return;

    const currentPage = file.pages[selectedPageIndex];
    if (!currentPage) return;

    try {
      const cropper = cropperRef.current.cropper;
      const updatedPages = [...file.pages];
      
      if (isCropping) {
        // Save cropped image
        const croppedCanvas = cropper.getCroppedCanvas();
        const croppedImageDataUrl = croppedCanvas.toDataURL('image/png');
        
        updatedPages[selectedPageIndex] = {
          ...currentPage,
          croppedImage: croppedImageDataUrl,
          showFile: croppedImageDataUrl,
          cropBoxData: cropper.getData(),
          zoom: cropper.getImageData().ratio,
          hasBeenEdited: true,
          uploadFile: null // Will be created during save
        };
      } else {
        // Save current state without cropping
        updatedPages[selectedPageIndex] = {
          ...currentPage,
          cropBoxData: cropper.getData(),
          zoom: cropper.getImageData().ratio,
          hasBeenEdited: true
        };
      }

      setFile({ ...file, pages: updatedPages });
    } catch (error) {
      console.error('Error auto-saving page state:', error);
    }
  };


  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id && file?.pages) {
      const oldIndex = file.pages.findIndex(page => page.id === active.id);
      const newIndex = file.pages.findIndex(page => page.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newPages = arrayMove(file.pages, oldIndex, newIndex);
        
        // Update the file with reordered pages
        setFile(prev => ({
          ...prev,
          pages: newPages
        }));

        // Update selected page index if needed
        if (selectedPageIndex === oldIndex) {
          setSelectedPageIndex(newIndex);
        } else if (selectedPageIndex > oldIndex && selectedPageIndex <= newIndex) {
          setSelectedPageIndex(selectedPageIndex - 1);
        } else if (selectedPageIndex < oldIndex && selectedPageIndex >= newIndex) {
          setSelectedPageIndex(selectedPageIndex + 1);
        }
      }
    }
  };


  const SortableThumbnail = ({ page, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: page.id || index });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`page-thumbnail ${selectedPageIndex === index ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
        onClick={() => {
          if (!file?.pages || !file.pages[index]) {
            return;
          }
          
          if (isProcessing) {
            message.warning('Please wait for the current operation to complete.');
            return;
          }
          
          setSelectedPageIndex(index);
          setZoom(1); // Reset zoom when changing pages
        }}
        {...attributes}
        {...listeners}
      >
        <img src={page.showFile} alt={`Page ${index + 1}`} />
        <div className="drag-handle">⋮⋮</div>
      </div>
    );
  };


  const handleZoom = (delta) => {
    const newZoom = zoom + delta;
    if (newZoom >= 0.5 && newZoom <= 3) {
      setZoom(newZoom);
      if (cropperRef.current?.cropper) {
        cropperRef.current.cropper.zoomTo(newZoom);
      }
    }
  };


  const handleRotate = () => {
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.rotate(90);
    }
  };


  const handleResetPage = () => {
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.reset();
    }
    setZoom(1);
  };

  // Reupload handler (adapted for edit)
  const handleReupload = () => {
    if (!file?.pages) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const newFile = e.target.files[0];
      if (newFile) {
        try {
          const reader = new FileReader();
          reader.onload = (event) => {
            const updatedPages = [...file.pages];
            updatedPages[selectedPageIndex] = {
              ...updatedPages[selectedPageIndex],
              image: event.target.result,
              showFile: event.target.result,
              croppedImage: null,
              uploadFile: null,
              hasBeenEdited: true,
              cropBoxData: null
            };
            setFile({ ...file, pages: updatedPages });
            setZoom(1);
            message.success(`Page ${selectedPageIndex + 1} replaced successfully`);
          };
          reader.readAsDataURL(newFile);
        } catch (error) {
          console.error('Error reuploading page:', error);
          message.error('Failed to replace page. Please try again.');
        }
      }
    };
    input.click();
  };


  const handleRemove = () => {
    // If single page or no pages, cannot remove
    if (!file?.pages || file.pages.length <= 1) {
      message.error('Cannot remove the last page. Template must have at least one page.');
      return;
    }
    
    // Multi-page: remove only selected page
    const updatedPages = file.pages.filter((_, index) => index !== selectedPageIndex);
    
    // Determine new selected page index
    let newSelectedIndex = selectedPageIndex;
    if (selectedPageIndex >= updatedPages.length) {
      // If we removed the last page, select the new last page
      newSelectedIndex = updatedPages.length - 1;
    }
    
    // Update both states together to maintain consistency
    setFile(prev => ({
      ...prev,
      pages: updatedPages
    }));
    setSelectedPageIndex(newSelectedIndex);
    
    // Reset zoom for new page
    const newSelectedPage = updatedPages[newSelectedIndex];
    const pageZoom = newSelectedPage?.zoom || 1;
    setZoom(pageZoom);
    
    message.success(`Page ${selectedPageIndex + 1} removed successfully`);
  };

  // Save all changes (adapted from upload drawer)
  const handleSave = async () => {
    // Validate canvas name (same validation as upload drawer)
    if (!file?.name?.trim()) {
      message.error('Please enter a canvas name before submitting.');
      return;
    }
    
    // Validate canvas name length
    if (file.name.trim().length > 15) {
      message.error('Canvas name must be 15 characters or less.');
      return;
    }
    
    // Validate canvas name characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(file.name.trim())) {
      message.error('Canvas name contains invalid characters. Please use only letters, numbers, spaces, and common punctuation.');
      return;
    }
    
    // Validate at least one page exists
    if (!file?.pages || file.pages.length === 0) {
      message.error('Please upload at least one page before submitting.');
      return;
    }

    setIsProcessing(true);
    
    try {
      message.loading('Updating template...', 0);
      
      const filesForUpload = await Promise.all(
        file.pages.map(async (page, index) => {
          let fileToUpload = page.uploadFile;
          
          if (!fileToUpload) {
            if (page.showFile || page.image) {
              try {
                const imageData = page.showFile || page.image;
                fileToUpload = await dataUrlToFileUsingFetch(
                  imageData,
                  `rx-template-page-${index + 1}.png`,
                  'image/png'
                );
              } catch (error) {
                console.error(`Failed to create File object for page ${index + 1}:`, error);
                throw new Error(`Failed to prepare file for page ${index + 1}: ${error.message}`);
              }
            } else {
              throw new Error(`Page ${index + 1} has no image data to upload`);
            }
          }
          
          return {
            uploadFile: fileToUpload,
            order: page.order || index + 1,
            pageNumber: index + 1,
            croppedImage: page.croppedImage || page.showFile,
            cropBoxData: page.cropBoxData,
            isCropped: !!page.croppedImage,
            hasBeenEdited: page.hasBeenEdited
          };
        })
      );

      const templateData = {
        title: file.name.trim(),
        files: filesForUpload
      };

      const result = await updateCustomSyncPadTemplate(
        file.id,
        templateData,
        (progress) => {
          message.destroy();
          message.loading(`Updating... ${progress}%`, 0);
        }
      );

      message.destroy();
      
      if (result.success) {
        message.success('Template updated successfully!');
        
        if (onSave) {
          onSave(result.data);
        }
        
        onClose();
        
        setFile(null);
        setZoom(1);
        setSelectedPageIndex(0);
        setIsProcessing(false);
      } else {
        message.error(result.error || 'Failed to update template');
        setIsProcessing(false);
      }
    } catch (error) {
      message.destroy();
      console.error('Exception in handleSave:', error);
      message.error('Failed to update template. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!file) return null;

  const allPagesReady = file.pages.every(page => page.isReady);

  return (
    <Drawer
      title={null}
      closable={false}
      placement="right"
      onClose={onClose}
      open={visible}
      width={730}
      className="rx-upload-drawer"
    >
      <div className="rx-upload-modal-bg">
        {/* Header - exactly like upload drawer */}
        <div className="rx-upload-header">
          <div className="rx-upload-header-left">
            <i className="icon-right rx-upload-back" onClick={onClose}></i>
          </div>
          <div className="rx-upload-header-title">
            Edit Rx Canvas
          </div>
          <div className="rx-upload-header-actions">
            <button className="rx-upload-tutorial">
              <img src={tutorialIcon} alt="Tutorial" className="rx-upload-tutorial-icon" height="24" style={{marginRight: 8}} />
              Tutorial
            </button>
            <button 
              type="default"
              className="rx-upload-submit" 
              disabled={!allPagesReady || !file?.name?.trim() || isProcessing}
              onClick={handleSave}
            >
              {isProcessing ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </div>
        
        {/* Main Content Card - exactly like upload drawer */}
        <div className="rx-upload-card">
          {/* Preview State Body - exactly like upload drawer */}
          <div className="preview-state-body">
            {/* Canvas Name Input - exactly like upload drawer */}
            <div className="canvas-name-row">
              <label className="canvas-name-label">Canvas Name <span className="required">*</span></label>
              <div style={{position: 'relative', width: '100%'}}>
                <input
                  className="canvas-name-input"
                  type="text"
                  maxLength={15}
                  placeholder="Enter canvas name (required)"
                  value={file.name || ''}
                  onChange={e => setFile({ ...file, name: e.target.value })}
                  autoFocus
                />
                <span className="canvas-name-count">{(file.name || '').length}/15</span>
              </div>
            </div>
            
            {/* Cropper Preview Row - exactly like upload drawer */}
            <div className="cropper-preview-row">
              {/* Page Label - exactly like upload drawer */}
              <div className="page-label">Page {file?.pages && file.pages[selectedPageIndex] ? selectedPageIndex + 1 : 0}</div>
              {/* Cropper Container - exactly like upload drawer */}
              <div className="cropper-container">
                <Cropper
                  key={`cropper-${selectedPageIndex}-${file.pages[selectedPageIndex]?.id || 'default'}`}
                  ref={cropperRef}
                  style={{ height: 400 }}
                  src={file.pages[selectedPageIndex]?.showFile || ''}
                  viewMode={2}
                  background={false}
                  zoomable={true}
                  guides={true}
                  autoCropArea={1}
                  dragMode="move"
                  zoom={file.pages[selectedPageIndex]?.zoom || 1}
                  onError={(error) => {
                    console.error('Cropper error:', error);
                    message.error('Failed to load image for cropping. Please try again.');
                  }}
                  ready={() => {
  
                  }}
                  cropend={() => {
                    // Auto-save when user finishes cropping
                    if (autoSaveTimeoutRef.current) {
                      clearTimeout(autoSaveTimeoutRef.current);
                    }
                    autoSaveTimeoutRef.current = setTimeout(() => {
                      autoSavePageState(true);
                    }, 300);
                  }}
                />
              </div>
              {/* Cropper Actions Row - exactly like upload drawer */}
              <div className="cropper-actions-row">
                <div className="cropper-actions-left">
                  <Button 
                    icon={<img src={reuploadIcon}/>} 
                    onClick={handleReupload} 
                    disabled={isProcessing}
                    className='reupload-button'>
                    Reupload
                  </Button>
                  <Button 
                    className='remove-button' 
                    icon={<DeleteOutlined />} 
                    onClick={handleRemove}
                    disabled={isProcessing}
                  >
                    Remove
                  </Button>
                </div>
                <div className="cropper-actions-right">
                  <div className={`cropper-action-btn ${isProcessing ? 'disabled' : ''}`} onClick={isProcessing ? null : handleRotate}><RedoOutlined /></div>
                  <div className={`cropper-action-btn ${isProcessing ? 'disabled' : ''}`} onClick={isProcessing ? null : () => handleZoom(-0.1)}><MinusOutlined /></div>
                  <div className={`cropper-action-btn ${isProcessing ? 'disabled' : ''}`} onClick={isProcessing ? null : () => handleZoom(0.1)}><PlusOutlined /></div>
                  {/* Reset button - always visible */}
                  <div className={`cropper-action-btn reset-btn ${isProcessing ? 'disabled' : ''}`} onClick={isProcessing ? null : handleResetPage}>
                    <span style={{ fontSize: '12px', color: 'white' }}>Reset</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Page Thumbnails with Drag and Drop - exactly like upload drawer */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="page-thumbnails-row">
                <SortableContext
                  items={file.pages.map((page, index) => page.id || index)}
                  strategy={verticalListSortingStrategy}
                >
                  {file.pages.map((page, index) => (
                    <SortableThumbnail key={page.id || index} page={page} index={index} />
                  ))}
                </SortableContext>
              </div>
            </DndContext>

          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default EditTemplateModal; 