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

  // Initialize edit data when template changes
  useEffect(() => {
    if (template && visible) {
      console.log('🔧 Initializing edit data for template:', template.title);
      
      // Convert template data to file format (exactly like upload drawer)
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

  // Reset cropper when page changes (same as upload drawer)
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
        const cropBoxData = cropper.getData();
        updatedPages[selectedPageIndex] = {
          ...currentPage,
          cropBoxData: cropBoxData,
          zoom: cropper.getImageData().ratio,
          // ✅ FIXED: Get current rotation from cropper, not from stored state
          rotation: cropBoxData.rotate || 0,
          hasBeenEdited: true
        };
      }

      setFile({ ...file, pages: updatedPages });
    } catch (error) {
      console.error('Error auto-saving page state:', error);
    }
  };

  // Restore page state when navigating between pages
  const restorePageState = (pageIndex) => {
    if (!file?.pages || !file.pages[pageIndex]) {
      return;
    }
    
    const page = file.pages[pageIndex];
    
    // Wait for cropper to be ready
    setTimeout(() => {
      if (cropperRef.current?.cropper) {
        const cropper = cropperRef.current.cropper;
        
        // Restore zoom
        if (page.zoom && page.zoom !== 1) {
          cropper.zoomTo(page.zoom);
          setZoom(page.zoom); // Also update the zoom state
        } else {
          setZoom(1);
        }
        
        // Restore rotation using setData
        if (page.rotation && page.rotation !== 0) {
          cropper.setData({ rotate: page.rotation });
        }
        
        // Restore crop box if it exists
        if (page.cropBoxData) {
          cropper.setCropBoxData(page.cropBoxData);
        }
      }
    }, 100);
  };

  // Restore page state when navigating between pages
  useEffect(() => {
    if (file?.pages && file.pages[selectedPageIndex]) {
      // Small delay to ensure cropper is ready
      setTimeout(() => {
        restorePageState(selectedPageIndex);
      }, 150);
    }
  }, [selectedPageIndex, file?.pages]);

  // Handle drag end for reordering (same as upload drawer)
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

  // Sortable thumbnail component (exactly like upload drawer)
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
          // Don't reset zoom - let restorePageState handle it
        }}
        {...attributes}
        {...listeners}
      >
        <img src={page.showFile} alt={`Page ${index + 1}`} />
        <div className="drag-handle">⋮⋮</div>
      </div>
    );
  };

  // Zoom handler (same as upload drawer)
  const handleZoom = (delta) => {
    const newZoom = zoom + delta;
    if (newZoom >= 0.5 && newZoom <= 3) {
      setZoom(newZoom);
      if (cropperRef.current?.cropper) {
        cropperRef.current.cropper.zoomTo(newZoom);
      }
      
      // Save zoom state to page data
      setFile(prevFile => ({
        ...prevFile,
        pages: prevFile.pages.map((page, index) => {
          if (index === selectedPageIndex) {
            return {
              ...page,
              zoom: newZoom,
              hasBeenEdited: true
            };
          }
          return page;
        })
      }));
    }
  };

  // Rotate handler (same as upload drawer)
  const handleRotate = () => {
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.rotate(90);
      
      // Save rotation state to page data
      setFile(prevFile => ({
        ...prevFile,
        pages: prevFile.pages.map((page, index) => {
          if (index === selectedPageIndex) {
            const currentRotation = page.rotation || 0;
            const newRotation = (currentRotation + 90) % 360;
            return {
              ...page,
              rotation: newRotation,
              hasBeenEdited: true
            };
          }
          return page;
        })
      }));
    }
  };

  // Reset page handler (same as upload drawer)
  const handleResetPage = () => {
    if (!file?.pages || selectedPageIndex >= file.pages.length) {
      return;
    }

    // Reset the cropper
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.reset();
    }
    
    // Reset zoom state
    setZoom(1);
    
    // ✅ FIXED: Reset the page state in the file.pages array
    setFile(prevFile => ({
      ...prevFile,
      pages: prevFile.pages.map((page, index) => {
        if (index === selectedPageIndex) {
          return {
            ...page,
            zoom: 1,
            rotation: 0,
            cropBoxData: null,
            croppedImage: null, // ✅ FIXED: Reset cropped image
            showFile: page.image, // ✅ FIXED: Restore to original image
            hasBeenEdited: false
          };
        }
        return page;
      })
    }));
    
    console.log('✅ Page reset completed for page', selectedPageIndex + 1);
  };

  // Reupload handler (adapted for edit)
  const handleReupload = () => {
    if (!file?.pages) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
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

  // Remove handler (same as upload drawer)
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
      
      console.log('🔧 Preparing template data for update...');
      
      // ✅ FIXED: Auto-save current page state before submitting
      if (cropperRef.current?.cropper) {
        await autoSavePageState(false);
      }
      
      // Create proper file objects for each page (same as upload drawer)
      const filesForUpload = await Promise.all(
        file.pages.map(async (page, index) => {
          let fileToUpload = page.uploadFile;
          
          // If no uploadFile exists, create one from the image data
          if (!fileToUpload) {
            if (page.showFile || page.image) {
              try {
                let imageData = page.showFile || page.image;
                
                // ✅ FIXED: Get current state from cropper for the selected page
                if (index === selectedPageIndex && cropperRef.current?.cropper) {
                  const cropper = cropperRef.current.cropper;
                  try {
                    // Get the current canvas with all transformations applied
                    const canvas = cropper.getCroppedCanvas() || cropper.getCanvas();
                    if (canvas) {
                      imageData = canvas.toDataURL('image/png', 0.9);
                    }
                  } catch (error) {
                    console.warn(`Could not get current cropper state for page ${index + 1}:`, error);
                    // Fallback to stored image data
                  }
                }
                
                console.log(`🖼️ Creating File object for page ${index + 1}`);
                
                // Convert image to File object with unique name
                const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9);
                fileToUpload = await dataUrlToFileUsingFetch(
                  imageData,
                  `smart-sync-${uniqueId}-page-${index + 1}.png`,
                  'image/png'
                );
              } catch (error) {
                console.error(`❌ Failed to create File object for page ${index + 1}:`, error);
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

      console.log(`✅ Template data prepared: "${templateData.title}" with ${templateData.files.length} files`);

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
        console.log('✅ Update successful, calling onSave and closing...');
        message.success('Template updated successfully!');
        
        // Call the onSave callback with the response data
        if (onSave) {
          console.log('📞 Calling onSave callback...');
          onSave(result.data);
        }
        
        console.log('🚪 Closing drawer...');
        onClose();
        
        // Reset state
        console.log('🧹 Resetting state...');
        setFile(null);
        setZoom(1);
        setSelectedPageIndex(0);
        setIsProcessing(false);
        
        console.log('✅ Update process completed successfully');
      } else {
        console.log('❌ Update failed with error:', result.error);
        message.error(result.error || 'Failed to update template');
        setIsProcessing(false);
      }
    } catch (error) {
      message.destroy();
      console.error('💥 Exception in handleSave:', error);
      console.error('Error stack:', error.stack);
      message.error('Failed to update template. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!file) return null;

  // Helper: check if all pages are ready for submission
  const allPagesReady = file?.pages?.every(page => {
    // Page is ready if:
    // 1. It has been cropped (page.croppedImage exists) - user saved the crop
    // 2. OR it has been edited with rotation/zoom but not cropped (rotation/zoom are valid edits)
    // 3. OR it hasn't been edited at all (user never interacted with it)
    return page.croppedImage || (page.hasBeenEdited && (page.rotation !== 0 || page.zoom !== 1)) || !page.hasBeenEdited;
  });

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
                    // console.log('Cropper ready for page:', selectedPageIndex + 1);
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