import React, { useState, useCallback, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Radio,
  Row,
  Form,
  Switch,
  Button,
  Input,
  Select,
  Checkbox,
} from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SignatureCanvas from "react-signature-canvas";

import { isMobile } from "react-device-detect";
import { errorMessage, dataUrlToFileUsingFetch } from "../../utils/utils";

import {
  setDraftSettings,
  setFile,
  uploadFile,
  getFileUrlByFilename,
} from "../../redux/ipd/printSettingsSlice";

import CommonModal from "../../common/CommonModal";

import defaultprofile from "../../assets/images/default-profile.svg";
import rxDisplayArea from "../../assets/images/rx-display-area.svg";
import { LETTERHEAD_FORMATS } from "../PDFGenerator";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

const RowContext = React.createContext({});

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <MenuOutlined
      ref={setActivatorNodeRef}
      style={{
        touchAction: "none",
        cursor: "move",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 9999,
        }
      : {}),
  };
  const contextValue = React.useMemo(
    () => ({
      setActivatorNodeRef,
      listeners,
    }),
    [setActivatorNodeRef, listeners]
  );
  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const FONTS_SIZE_LIST = [
  {
    value: 8,
    label: "8",
  },
  {
    value: 10,
    label: "10",
  },
  {
    value: 12,
    label: "12",
  },
  {
    value: 14,
    label: "14",
  },
  {
    value: 16,
    label: "16",
  },
];

function IPDHeaderFooterLayout({ moduleType, updateFooterImageHeight }) {
  const dispatch = useDispatch();
  const { draftSettings, fileStates } = useSelector(
    (state) => state.printSettings
  );

  // Get file states from Redux for this module
  const moduleFileStates = fileStates[moduleType] || {};
  const fileLogo = moduleFileStates.fileLogo || null;
  const fileWatermark = moduleFileStates.fileWatermark || null;
  const fileSignature = moduleFileStates.fileSignature || null;
  const fileHeader = moduleFileStates.fileHeader || null;
  const fileFooter = moduleFileStates.fileFooter || null;
  const cropperHeaderRef = React.createRef();
  const { headerFooter } = draftSettings[moduleType] || {};
  const { header, footer } = headerFooter || {};

  // Helper functions to update files in Redux
  const setFileLogo = useCallback(
    (fileData) => {
      dispatch(setFile({ moduleType, fileType: "fileLogo", fileData }));
    },
    [dispatch, moduleType]
  );

  const setFileWatermark = useCallback(
    (fileData) => {
      dispatch(setFile({ moduleType, fileType: "fileWatermark", fileData }));
    },
    [dispatch, moduleType]
  );

  const setFileSignature = useCallback(
    (fileData) => {
      dispatch(setFile({ moduleType, fileType: "fileSignature", fileData }));
    },
    [dispatch, moduleType]
  );

  const setFileHeader = useCallback(
    (fileData) => {
      dispatch(setFile({ moduleType, fileType: "fileHeader", fileData }));
    },
    [dispatch, moduleType]
  );

  const setFileFooter = useCallback(
    (fileData) => {
      dispatch(setFile({ moduleType, fileType: "fileFooter", fileData }));
    },
    [dispatch, moduleType]
  );

  // Get current module settings from draft
  const currentModuleSettings = useMemo(
    () => draftSettings[moduleType] || {},
    [draftSettings, moduleType]
  );

  const headerFooterSettings = useMemo(
    () => currentModuleSettings.headerFooter || {},
    [currentModuleSettings]
  );

  // Helper function to update header/footer settings
  const updateHeaderFooter = useCallback(
    (updates) => {
      dispatch(
        setDraftSettings({
          moduleType,
          settings: {
            ...currentModuleSettings,
            headerFooter: {
              ...headerFooterSettings,
              ...updates,
            },
          },
        })
      );
    },
    [dispatch, moduleType, currentModuleSettings, headerFooterSettings]
  );

  const inputHeaderFile = React.createRef();
  const inputFooterFile = React.createRef();
  const inputLogoFile = React.createRef();
  const inputWatermarkFile = React.createRef();
  const inputSignatureFile = React.createRef();
  const signatureRef = React.createRef();
  const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);

  const [isSignatureDrawerOpen, setIsSignatureDrawerOpen] = useState(false);
  const [signatureMode, setSignatureMode] = useState("draw");

  const [headerFooterShowHide, setHeaderFooterShowHide] = useState(false);
  const [patientInfoShowHide, setPatientInfoShowHide] = useState(false);
  const [settingsShowHide, setSettingsShowHide] = useState(false);

  // Load logo from settings if exists
  React.useEffect(() => {
    const loadLogoFromSettings = async () => {
      const logoFilename = headerFooterSettings.header?.logo;

      // If there's a logo filename and it's not already loaded
      if (logoFilename && (!fileLogo || fileLogo.filename !== logoFilename)) {
        try {
          // Get the file URL from the filename
          const fileUrlResult = await dispatch(
            getFileUrlByFilename(logoFilename)
          ).unwrap();
          const fileUrl = fileUrlResult.url || fileUrlResult;

          setFileLogo({
            imageShow: true,
            showFile: fileUrl,
            filename: logoFilename,
          });
        } catch (error) {
          console.error("Error loading logo:", error);
        }
      }
    };

    loadLogoFromSettings();
  }, [headerFooterSettings.header?.logo, dispatch, fileLogo, setFileLogo]);

  // Load watermark from settings if exists
  React.useEffect(() => {
    const loadWatermarkFromSettings = async () => {
      const watermarkUrl = headerFooterSettings.otherSettings?.watermarkImg;

      // If there's a watermark URL and it's not already loaded
      if (
        watermarkUrl &&
        (!fileWatermark || fileWatermark.showFile !== watermarkUrl)
      ) {
        setFileWatermark({
          imageShow: true,
          showFile: watermarkUrl,
        });
      }
    };

    loadWatermarkFromSettings();
  }, [
    headerFooterSettings.otherSettings?.watermarkImg,
    fileWatermark,
    setFileWatermark,
  ]);

  // Load signature from settings if exists
  React.useEffect(() => {
    const loadSignatureFromSettings = async () => {
      const signatureUrl = headerFooterSettings.otherSettings?.signatureImg;

      // If there's a signature URL and it's not already loaded
      if (
        signatureUrl &&
        (!fileSignature || fileSignature.showFile !== signatureUrl)
      ) {
        setFileSignature({
          imageShow: true,
          showFile: signatureUrl,
        });
      }
    };

    loadSignatureFromSettings();
  }, [
    headerFooterSettings.otherSettings?.signatureImg,
    fileSignature,
    setFileSignature,
  ]);

  // Get module title for display
  const getModuleTitle = () => {
    const titleMap = {
      assessment: "Assessment Form",
      progressNotes: "Progress Notes",
      consultationNotes: "Consultant Notes",
      otNotes: "Operation Notes",
      crossReferral: "Cross Referral",
      dischargeSummary: "Discharge Summary",
    };
    return titleMap[moduleType] || "Document";
  };

  const onHeaderFooterClick = useCallback(() => {
    setHeaderFooterShowHide(!headerFooterShowHide);
  }, [headerFooterShowHide]);

  const onLetterheadFormatChange = useCallback(
    (e) => {
      updateHeaderFooter({
        letterHeadFormat: e.target.value,
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  const onPatientInfoClick = useCallback(() => {
    setPatientInfoShowHide(!patientInfoShowHide);
  }, [patientInfoShowHide]);

  const onSettingsClick = useCallback(() => {
    setSettingsShowHide(!settingsShowHide);
  }, [settingsShowHide]);

  // Header Information
  const onInformationAlignmentVisibleChange = useCallback(
    (checked) => {
      updateHeaderFooter({
        header: {
          ...headerFooterSettings.header,
          informationAlignmentVisible: checked,
        },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  const onInformationAlignmentChange = useCallback(
    (e) => {
      updateHeaderFooter({
        header: {
          ...headerFooterSettings.header,
          informationAlignment: e.target.value,
        },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  const onHeaderTitleChange = useCallback(
    (e) => {
      updateHeaderFooter({
        header: { ...headerFooterSettings.header, title: e.target.value },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  const onSubTitleChange = useCallback(
    (e) => {
      updateHeaderFooter({
        header: { ...headerFooterSettings.header, subTitle: e.target.value },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  // Logo on Header
  const onLogoSwitchChange = useCallback(
    (checked) => {
      updateHeaderFooter({
        header: {
          ...headerFooterSettings.header,
          logo: checked ? "enabled" : "",
        },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  // Logo Image
  const handleLogoChange = async (e) => {
    if (e.target.files?.length > 0) {
      const file = e.target.files[0];
      if (
        file.size <= 2000000 &&
        (file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg")
      ) {
        try {
          // Show preview immediately
          const previewUrl = URL.createObjectURL(file);
          setFileLogo({
            imageShow: true,
            showFile: previewUrl,
            uploadFile: file,
            uploading: true,
          });

          // Upload file to API using FormData
          const formData = new FormData();
          formData.append("file", file);

          const uploadResult = await dispatch(uploadFile(formData)).unwrap();

          const filename = uploadResult.filename || uploadResult;

          // Get the file URL from the filename
          const fileUrlResult = await dispatch(
            getFileUrlByFilename(filename)
          ).unwrap();
          const fileUrl = fileUrlResult.fileUrl || fileUrlResult;

          // Update logo in settings and file state
          updateHeaderFooter({
            header: {
              ...headerFooterSettings.header,
              logo: fileUrl,
            },
          });

          setFileLogo({
            imageShow: true,
            showFile: fileUrl,
            uploadFile: file,
            uploading: false,
          });
        } catch (error) {
          console.error("Error uploading logo:", error);
          errorMessage("Failed to upload logo. Please try again.");
          setFileLogo(null);
        }
      } else {
        errorMessage(
          "Please upload only jpg, jpeg or png files with the max size 2mb."
        );
      }
    }
  };

  // Watermark Image
  const handleWatermarkChange = async (e) => {
    if (e.target.files?.length > 0) {
      const file = e.target.files[0];
      if (
        file.size <= 2000000 &&
        (file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg")
      ) {
        try {
          // Show preview immediately
          const previewUrl = URL.createObjectURL(file);
          setFileWatermark({
            imageShow: true,
            showFile: previewUrl,
            uploadFile: file,
            uploading: true,
          });

          // Upload file to API using FormData
          const formData = new FormData();
          formData.append("file", file);

          const uploadResult = await dispatch(uploadFile(formData)).unwrap();
          const filename = uploadResult.filename || uploadResult;

          // Get the file URL from the filename
          const fileUrlResult = await dispatch(
            getFileUrlByFilename(filename)
          ).unwrap();
          const fileUrl = fileUrlResult.fileUrl || fileUrlResult;

          // Update watermark in settings with URL (stores URL like logo)
          updateHeaderFooter({
            otherSettings: {
              ...headerFooterSettings.otherSettings,
              watermarkImg: fileUrl,
            },
          });

          setFileWatermark({
            imageShow: true,
            showFile: fileUrl,
            uploadFile: file,
            uploading: false,
          });
        } catch (error) {
          console.error("Error uploading watermark:", error);
          errorMessage("Failed to upload watermark. Please try again.");
          setFileWatermark(null);
        }
      } else {
        errorMessage(
          "Please upload only jpg, jpeg or png files with the max size 2mb."
        );
      }
    }
  };

  // Header Image Upload
  const handleHeaderChange = async (e) => {
    if (e.target.files?.length > 0) {
      const file = e.target.files[0];
      if (
        file.size <= 2000000 &&
        (file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg")
      ) {
        try {
          // Show preview immediately with originalFile for cropping
          const previewUrl = URL.createObjectURL(file);
          setFileHeader({
            imageShow: false,
            showFile: previewUrl,
            uploadFile: file,
            uploading: true,
            originalFile: file,
            crop: true,
          });
          showHideHeaderModal();
        } catch (error) {
          console.error("Error handling header:", error);
          errorMessage("Failed to load header image. Please try again.");
          setFileHeader(null);
        }
      } else {
        errorMessage(
          "Please upload only jpg, jpeg or png files with the max size 2mb."
        );
      }
    }
  };

  // Footer Image Upload
  const handleFooterChange = async (e) => {
    if (e.target.files?.length > 0) {
      const file = e.target.files[0];
      if (
        file.size <= 2000000 &&
        (file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg")
      ) {
        try {
          // Show preview immediately with originalFile for cropping
          const previewUrl = URL.createObjectURL(file);
          setFileFooter({
            imageShow: false,
            showFile: previewUrl,
            uploadFile: file,
            uploading: true,
            originalFile: file,
            crop: true,
          });
          showHideFooterModal();
        } catch (error) {
          console.error("Error handling footer:", error);
          errorMessage("Failed to load footer image. Please try again.");
          setFileFooter(null);
        }
      } else {
        errorMessage(
          "Please upload only jpg, jpeg or png files with the max size 2mb."
        );
      }
    }
  };

  // Signature Image Upload (for upload mode in drawer)
  const handleSignatureUpload = async (e) => {
    if (e.target.files?.length > 0) {
      const file = e.target.files[0];
      if (
        file.size <= 2000000 &&
        (file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg")
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          setFileSignature({
            imageShow: false,
            showFile: reader.result,
            uploadFile: file,
          });
        };
        reader.readAsDataURL(file);
      } else {
        errorMessage(
          "Please upload only jpg, jpeg or png files with the max size 2mb."
        );
      }
    }
  };

  // Footer
  const onFooterTextChange = useCallback(
    (e) => {
      updateHeaderFooter({
        footer: { ...headerFooterSettings.footer, title: e.target.value },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  const onSelectFooterFontSize = useCallback(
    (data) => {
      updateHeaderFooter({
        footer: { ...headerFooterSettings.footer, fontSize: data },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  // Margin handler that updates margins for the current letterhead format
  const onMarginChange = (position, limit) => (e) => {
    const value = e.target.value;
    if (value <= limit) {
      const currentFormat = headerFooterSettings.letterHeadFormat;
      const currentMargins = headerFooterSettings.margins || {};
      updateHeaderFooter({
        margins: {
          ...currentMargins,
          [currentFormat]: {
            ...currentMargins[currentFormat],
            [position]: value,
          },
        },
      });
    }
  };

  const onTopMarginChange = onMarginChange("top", 15);
  const onLeftMarginChange = onMarginChange("left", 10);
  const onRightMarginChange = onMarginChange("right", 10);
  const onBottomMarginChange = onMarginChange("bottom", 15);

  const onChangePatientInfo = (checked, id) => {
    const currentFields = headerFooterSettings.displayPatientInfo?.fields || [];

    // Update the enabled property for the specific field
    const updatedFields = currentFields.map((field) =>
      field.id === id ? { ...field, enabled: checked } : field
    );

    updateHeaderFooter({
      displayPatientInfo: {
        ...headerFooterSettings.displayPatientInfo,
        fields: updatedFields,
      },
    });
  };

  const onDragEndPatientInfo = ({ active, over }) => {
    if (!active || !over || active.id === over.id) return;

    const currentFields = headerFooterSettings.displayPatientInfo?.fields || [];
    const activeIndex = currentFields.findIndex(
      (field) => field.id === active.id
    );
    const overIndex = currentFields.findIndex((field) => field.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      // Create a new array with reordered fields
      const reorderedFields = [...currentFields];
      const [movedField] = reorderedFields.splice(activeIndex, 1);
      reorderedFields.splice(overIndex, 0, movedField);

      // Update order values for all fields
      const fieldsWithUpdatedOrder = reorderedFields.map((field, index) => ({
        ...field,
        order: index + 1,
      }));

      updateHeaderFooter({
        displayPatientInfo: {
          ...headerFooterSettings.displayPatientInfo,
          fields: fieldsWithUpdatedOrder,
        },
      });
    }
  };

  // Other Settings
  const onWatermarkSwitchChange = useCallback(
    (checked) => {
      updateHeaderFooter({
        otherSettings: {
          ...headerFooterSettings.otherSettings,
          watermark: checked,
        },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  const onSignatureSwitchChange = useCallback(
    (checked) => {
      updateHeaderFooter({
        otherSettings: {
          ...headerFooterSettings.otherSettings,
          signature: checked ? "left" : "",
        },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  const onSignaturePlaceChange = useCallback(
    (e) => {
      updateHeaderFooter({
        otherSettings: {
          ...headerFooterSettings.otherSettings,
          signature: e.target.value,
        },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  // Signature Modal
  const showHideSignatureDrawer = useCallback(() => {
    setIsSignatureDrawerOpen(!isSignatureDrawerOpen);
  }, [isSignatureDrawerOpen]);

  const onSignatureModeChange = useCallback(
    (e) => {
      setSignatureMode(e.target.value);
      setFileSignature(null);
    },
    [setFileSignature]
  );

  const onResetSignature = () => {
    if (signatureRef.current) {
      signatureRef.current?.clear();
    }
    setFileSignature(null);
  };

  const onRemoveSignature = () => {
    if (signatureRef.current) {
      signatureRef.current?.clear();
    }
    setFileSignature(null);
    updateHeaderFooter({
      otherSettings: {
        ...headerFooterSettings.otherSettings,
        signatureImg: "",
      },
    });
  };

  const handleTrim = async () => {
    if (signatureMode === "draw") {
      if (signatureRef.current?.isEmpty()) {
        errorMessage("Please provide signature");
        return;
      }
      const trimData = signatureRef.current
        ?.getTrimmedCanvas()
        .toDataURL("image/png");
      const uploadFile = await dataUrlToFileUsingFetch(
        trimData,
        "signature.png",
        "image/png"
      );
      setFileSignature({
        ...fileSignature,
        preview: true,
        showFile: trimData,
        uploadFile: uploadFile,
      });
    } else {
      // For upload mode, just mark as preview ready
      if (fileSignature) {
        setFileSignature({
          ...fileSignature,
          preview: true,
        });
      }
    }
  };

  const onSignatureImageSubmit = async () => {
    if (!fileSignature?.uploadFile) {
      errorMessage("Please provide a signature");
      return;
    }

    try {
      // Upload file to API using FormData
      const formData = new FormData();
      formData.append("file", fileSignature.uploadFile);

      const uploadResult = await dispatch(uploadFile(formData)).unwrap();
      const filename = uploadResult.filename || uploadResult;

      // Get the file URL from the filename
      const fileUrlResult = await dispatch(
        getFileUrlByFilename(filename)
      ).unwrap();
      const fileUrl = fileUrlResult.fileUrl || fileUrlResult;

      // Update signature in settings with URL
      updateHeaderFooter({
        otherSettings: {
          ...headerFooterSettings.otherSettings,
          signatureImg: fileUrl,
        },
      });

      setFileSignature({
        imageShow: true,
        showFile: fileUrl,
        uploadFile: fileSignature.uploadFile,
      });

      showHideSignatureDrawer();
    } catch (error) {
      console.error("Error uploading signature:", error);
      errorMessage("Failed to upload signature. Please try again.");
    }
  };

  // Include in signature checkboxes
  const onSignatureCheckbox1Change = useCallback(
    (e) => {
      updateHeaderFooter({
        otherSettings: {
          ...headerFooterSettings.otherSettings,
          includeInSignature: {
            ...headerFooterSettings.otherSettings?.includeInSignature,
            nameOfDoctor: e.target.checked,
          },
        },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  const onSignatureCheckbox2Change = useCallback(
    (e) => {
      updateHeaderFooter({
        otherSettings: {
          ...headerFooterSettings.otherSettings,
          includeInSignature: {
            ...headerFooterSettings.otherSettings?.includeInSignature,
            medicalRegistrationNumber: e.target.checked,
          },
        },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  const onSignatureCheckbox3Change = useCallback(
    (e) => {
      updateHeaderFooter({
        otherSettings: {
          ...headerFooterSettings.otherSettings,
          includeInSignature: {
            ...headerFooterSettings.otherSettings?.includeInSignature,
            qualifications: e.target.checked,
          },
        },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  const onSignatureQualificationChange = useCallback(
    (e) => {
      updateHeaderFooter({
        otherSettings: {
          ...headerFooterSettings.otherSettings,
          includeInSignature: {
            ...headerFooterSettings.otherSettings?.includeInSignature,
            qualificationsDescription: e.target.value,
          },
        },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  const onShowQrSwitchChange = useCallback(
    (checked) => {
      updateHeaderFooter({
        otherSettings: {
          ...headerFooterSettings.otherSettings,
          showQRCode: checked,
        },
      });
    },
    [updateHeaderFooter, headerFooterSettings]
  );

  // Get current settings with defaults
  const currentSettings = headerFooterSettings || {};
  const headerSettings = currentSettings.header || {};

  const footerSettings = currentSettings.footer || {};
  const displayPatientInfo = currentSettings.displayPatientInfo || {};
  const otherSettings = currentSettings.otherSettings || {};
  const cropperFooterRef = React.createRef();

  const showHideFooterModal = useCallback(() => {
    setIsFooterModalOpen(!isFooterModalOpen);
  }, [isFooterModalOpen]);

  const getFooterCropData = async () => {
    if (typeof cropperFooterRef.current?.cropper !== "undefined") {
      const trimData = cropperFooterRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL(fileFooter.originalFile.type);
      const uploadFile = await dataUrlToFileUsingFetch(
        trimData,
        "footer.png",
        "image/png"
      );
      setFileFooter({
        ...fileFooter,
        crop: false,
        showFile: trimData,
        uploadFile: uploadFile,
      });
    }
  };

  const getFooterCropChangeData = () => {
    if (fileFooter && !fileFooter?.crop) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileFooter({
          ...fileFooter,
          imageShow: false,
          crop: true,
          showFile: reader.result,
        });
      };
      reader.readAsDataURL(fileFooter.originalFile);
    }
  };

  const onFooterImageSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("file", fileFooter.uploadFile);

      const uploadResult = await dispatch(uploadFile(formData)).unwrap();
      const filename = uploadResult.filename || uploadResult;

      const fileUrlResult = await dispatch(
        getFileUrlByFilename(filename)
      ).unwrap();
      const fileUrl = fileUrlResult.fileUrl || fileUrlResult;

      updateHeaderFooter({
        footer: {
          ...headerFooterSettings.footer,
          footerImg: fileUrl,
        },
      });

      setFileFooter({
        ...fileFooter,
        crop: false,
        imageShow: true,
        showFile: fileUrl,
        uploadFile: fileFooter.uploadFile,
      });

      if (typeof updateFooterImageHeight === "function") {
        updateFooterImageHeight({ showFile: fileUrl }, true);
      }
    } catch (error) {
      console.error("Error uploading cropped footer:", error);
      errorMessage("Failed to upload footer image. Please try again.");
    }

    showHideFooterModal();
  };

  const showHideHeaderModal = useCallback(() => {
    setIsHeaderModalOpen(!isHeaderModalOpen);
  }, [isHeaderModalOpen]);

  const getHeaderCropData = async () => {
    if (typeof cropperHeaderRef.current?.cropper !== "undefined") {
      const trimData = cropperHeaderRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL(fileHeader.originalFile.type);
      const uploadFile = await dataUrlToFileUsingFetch(
        trimData,
        "header.png",
        "image/png"
      );
      setFileHeader({
        ...fileHeader,
        crop: false,
        showFile: trimData,
        uploadFile: uploadFile,
      });
    }
  };

  const getHeaderCropChangeData = () => {
    if (fileHeader && !fileHeader?.crop) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileHeader({
          ...fileHeader,
          imageShow: false,
          crop: true,
          showFile: reader.result,
        });
      };
      reader.readAsDataURL(fileHeader?.originalFile);
    }
  };

  const onHeaderImageSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("file", fileHeader.uploadFile);

      const uploadResult = await dispatch(uploadFile(formData)).unwrap();
      const filename = uploadResult.filename || uploadResult;

      const fileUrlResult = await dispatch(
        getFileUrlByFilename(filename)
      ).unwrap();
      const fileUrl = fileUrlResult.fileUrl || fileUrlResult;

      updateHeaderFooter({
        header: {
          ...headerFooterSettings.header,
          headerImg: fileUrl,
        },
      });

      setFileHeader({
        ...fileHeader,
        crop: false,
        imageShow: true,
        showFile: fileUrl,
        uploadFile: fileHeader.uploadFile,
      });
    } catch (error) {
      console.error("Error uploading cropped header:", error);
      errorMessage("Failed to upload header image. Please try again.");
    }

    showHideHeaderModal();
  };

  return (
    <div className="px-3 form_addnewpatient">
      <div className="border-bottom pb-3 mb-3">
        <Row
          justify="space-between"
          className="align-items-center form_addnewpatient mb-1"
        >
          <Col lg="18">
            <div className="titleprint">Header & Footer</div>
          </Col>
          <Col lg="6">
            <Button
              className="btn rounded-10px px-1 border px-3-15"
              style={{
                transform: headerFooterShowHide
                  ? "rotate(90deg)"
                  : "rotate(-90deg)",
              }}
              onClick={onHeaderFooterClick}
            >
              <i className="icon-right"></i>
            </Button>
          </Col>
        </Row>
        <div>Setup your header and Footer</div>

        {headerFooterShowHide && (
          <div className="mt-4">
            <div className="mt-3">
              <Form.Item className="mb-0">
                <label className="mb-1 title-common">
                  Select Letterhead Format
                </label>
                <Radio.Group
                  className={`d-flex gender-radio all-change-radio ${
                    isMobile ? "segmented-radio-mobile" : ""
                  }`}
                  onChange={onLetterheadFormatChange}
                  value={currentSettings.letterHeadFormat}
                >
                  <Radio.Button
                    className="w-100 text-center"
                    value={LETTERHEAD_FORMATS.CUSTOM}
                  >
                    Custom
                  </Radio.Button>
                  <Radio.Button
                    className="w-100 text-center"
                    value={LETTERHEAD_FORMATS.UPLOAD}
                  >
                    Upload Letterhead
                  </Radio.Button>
                  <Radio.Button
                    className="w-100 text-center"
                    value={LETTERHEAD_FORMATS.OWN}
                  >
                    Own Letterhead
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>

            {currentSettings.letterHeadFormat === LETTERHEAD_FORMATS.CUSTOM && (
              <div className="mt-5">
                <Row
                  justify="space-between"
                  className="align-items-center form_addnewpatient mb-3"
                >
                  <Col lg="18">
                    <div className="title-common">Header Information</div>
                  </Col>
                  <Col lg="6">
                    <span className="fw-medium me-2 text-greycolor fs-16">
                      {headerSettings.informationAlignmentVisible
                        ? "Show"
                        : "Hide"}
                    </span>
                    <Switch
                      onChange={onInformationAlignmentVisibleChange}
                      checked={
                        headerSettings.informationAlignmentVisible || false
                      }
                    />
                  </Col>
                </Row>

                {headerSettings.informationAlignmentVisible && (
                  <>
                    <div className="mt-3">
                      <Form.Item>
                        <label className="mb-1">Header</label>
                        <Input
                          className="inputheight41-group"
                          placeholder="Enter Header"
                          onChange={onHeaderTitleChange}
                          value={headerSettings.title || getModuleTitle()}
                        />
                      </Form.Item>
                    </div>
                    <div className="mt-3">
                      <Form.Item>
                        <label className="mb-1">Subheader</label>
                        <Input
                          className="inputheight41-group"
                          placeholder="Enter Information"
                          onChange={onSubTitleChange}
                          value={headerSettings.subTitle || ""}
                        />
                      </Form.Item>
                    </div>
                  </>
                )}

                <Row
                  justify="space-between"
                  className="align-items-center form_addnewpatient mb-3"
                >
                  <Col lg="18">
                    <div className="title-common">Logo on Header</div>
                  </Col>
                  <Col lg="6">
                    <span className="fw-medium me-2 text-greycolor fs-16">
                      {headerSettings.logo ? "Show" : "Hide"}
                    </span>
                    <Switch
                      onChange={onLogoSwitchChange}
                      checked={!!headerSettings.logo}
                    />
                  </Col>
                </Row>

                {headerSettings.informationAlignmentVisible && (
                  <>
                    <Form.Item>
                      <Radio.Group
                        className={`d-flex gender-radio ${
                          isMobile ? "segmented-radio-mobile" : ""
                        }`}
                        onChange={onInformationAlignmentChange}
                        value={headerSettings.informationAlignment || "right"}
                      >
                        <Radio.Button
                          className="w-100 text-center"
                          value="left"
                        >
                          Left
                        </Radio.Button>
                        <Radio.Button
                          className="w-100 text-center"
                          value="right"
                        >
                          Right
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </>
                )}

                {/* {headerSettings.logo && ( */}
                <div className="upload-headfoot upload-headfoot2 p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    {fileLogo && fileLogo?.imageShow ? (
                      <img
                        style={{
                          height: 62,
                          objectFit: "contain",
                          overflow: "hidden",
                        }}
                        src={fileLogo?.showFile}
                        alt="Logo"
                      />
                    ) : (
                      <div className="text-start fontroboto">
                        Upload a picture of your
                        <br /> Logo
                      </div>
                    )}
                    <div
                      className="btn btn-input btn-41 d-flex align-items-center justify-content-center"
                      onClick={() => inputLogoFile.current?.click()}
                    >
                      <input
                        key={Math.random()}
                        ref={inputLogoFile}
                        style={{ display: "none" }}
                        type="file"
                        accept="image/png"
                        onChange={handleLogoChange}
                      />
                      <span>
                        <i className="icon-upload me-2"></i>
                        {fileLogo && fileLogo?.imageShow ? "Change" : "Upload"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* )} */}

                <div className="mt-3">
                  <Form.Item>
                    <label className="mb-1">Footer Text</label>
                    <Input
                      className="inputheight41-group"
                      placeholder="Enter Footer Text"
                      onChange={onFooterTextChange}
                      value={footerSettings.title || ""}
                    />
                  </Form.Item>
                </div>

                <div className="mt-3">
                  <Form.Item>
                    <label className="mb-1">Footer Font Size</label>
                    <Select
                      className="autocomplete-custom"
                      placeholder="Select footer font size"
                      options={FONTS_SIZE_LIST}
                      value={footerSettings.fontSize || 10}
                      onSelect={onSelectFooterFontSize}
                      allowClear
                    />
                  </Form.Item>
                </div>
              </div>
            )}

            {/* Upload Letterhead Format */}
            {currentSettings.letterHeadFormat === LETTERHEAD_FORMATS.UPLOAD && (
              <div className="mt-5">
                <Row
                  justify="space-between"
                  className="align-items-center form_addnewpatient mb-1"
                >
                  <Col lg="24">
                    <div className="title-common">
                      Upload your header and footer image
                    </div>
                  </Col>
                </Row>

                <div className="upload-headfoot">
                  {(fileHeader && fileHeader?.imageShow) ||
                  header?.headerImg ? (
                    <>
                      <img
                        style={{
                          width: "100%",
                          objectFit: "contain",
                          overflow: "hidden",
                        }}
                        src={fileHeader?.showFile || header?.headerImg}
                        alt="Header"
                      />
                      <Button
                        className="btn btn-headfoot"
                        onClick={() => inputHeaderFile.current?.click()}
                      >
                        <i className="icon-Edit me-1"></i>Edit
                      </Button>
                    </>
                  ) : (
                    <>
                      <div
                        className="fw-medium text-decoration-underline cursor-pointer"
                        onClick={() => inputHeaderFile.current?.click()}
                      >
                        Upload Header
                      </div>
                      <div className="fs-12-1 fontroboto">
                        Only jpg, jpeg or png files with the max size 2mb.
                      </div>
                    </>
                  )}
                  <input
                    key={Math.random()}
                    ref={inputHeaderFile}
                    style={{ display: "none" }}
                    type="file"
                    accept="image/*"
                    onChange={handleHeaderChange}
                  />
                  <CommonModal
                    handleCancel={true}
                    isModalOpen={isHeaderModalOpen}
                    onCancel={showHideHeaderModal}
                    modalWidth={744}
                    // title={"Crop Image"}
                    title={
                      <div className="d-flex">
                        <div className="align-items-center d-flex w-100">
                          <div className="text-truncate-twolines">
                            {"Crop Image"}
                          </div>
                        </div>
                        <Button
                          type="button"
                          disabled={
                            fileHeader && !fileHeader?.crop ? false : true
                          }
                          className="btn-41 btn px-4 btn-primary3 me-4"
                          onClick={onHeaderImageSubmit}
                        >
                          Submit
                        </Button>
                      </div>
                    }
                    modalBody={
                      <>
                        <div className="d-flex image-crop bg-dark justify-content-center align-items-center">
                          {fileHeader && fileHeader.crop ? (
                            <Cropper
                              ref={cropperHeaderRef}
                              // zoomTo={0.5}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                              // initialAspectRatio={1}
                              preview=".img-preview"
                              src={
                                fileHeader
                                  ? fileHeader?.showFile
                                  : defaultprofile
                              }
                              viewMode={3}
                              background={false}
                              autoCropArea={0.3}
                              guides={false}
                            />
                          ) : (
                            <img
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                              src={
                                fileHeader
                                  ? fileHeader?.showFile
                                  : defaultprofile
                              }
                            />
                          )}
                        </div>
                        <div className="mt-4">
                          <div className="d-flex align-items-center mt-2 justify-content-between">
                            <div
                              className="fw-normal text-decoration-underline btn p-0 text-main"
                              onClick={showHideHeaderModal}
                            >
                              {fileHeader && !fileHeader?.crop ? "" : "Discard"}
                            </div>
                            <div
                              className="fw-normal text-decoration-underline btn p-0 text-main"
                              onClick={() =>
                                fileHeader && !fileHeader?.crop
                                  ? getHeaderCropChangeData()
                                  : getHeaderCropData()
                              }
                            >
                              {fileHeader && !fileHeader?.crop
                                ? "Change"
                                : "Save"}
                            </div>
                          </div>
                        </div>
                      </>
                    }
                  />
                </div>

                <div className="upload-headfoot mt-3">
                  {(fileFooter && fileFooter?.imageShow) ||
                  footer?.footerImg ? (
                    <>
                      <img
                        style={{
                          width: "100%",
                          objectFit: "contain",
                          overflow: "hidden",
                        }}
                        src={fileFooter?.showFile || footer?.footerImg}
                        alt="Footer"
                      />
                      <Button
                        className="btn btn-headfoot"
                        onClick={() => inputFooterFile.current?.click()}
                      >
                        <i className="icon-Edit me-1"></i>Edit
                      </Button>
                    </>
                  ) : (
                    <>
                      <div
                        className="fw-medium text-decoration-underline cursor-pointer"
                        onClick={() => inputFooterFile.current?.click()}
                      >
                        Upload Footer
                      </div>
                      <div className="fs-12-1 fontroboto">
                        Only jpg, jpeg or png files with the max size 2mb.
                      </div>
                    </>
                  )}
                  <input
                    key={Math.random()}
                    ref={inputFooterFile}
                    style={{ display: "none" }}
                    type="file"
                    accept="image/*"
                    onChange={handleFooterChange}
                  />
                  <CommonModal
                    handleCancel={true}
                    isModalOpen={isFooterModalOpen}
                    onCancel={showHideFooterModal}
                    modalWidth={744}
                    // title={"Crop Image"}
                    title={
                      <div className="d-flex">
                        <div className="align-items-center d-flex w-100">
                          <div className="text-truncate-twolines">
                            {"Crop Image"}
                          </div>
                        </div>
                        <Button
                          type="button"
                          disabled={
                            fileFooter && !fileFooter?.crop ? false : true
                          }
                          className="btn-41 btn px-4 btn-primary3 me-4"
                          onClick={onFooterImageSubmit}
                        >
                          Submit
                        </Button>
                      </div>
                    }
                    modalBody={
                      <>
                        <div className="d-flex image-crop bg-dark justify-content-center align-items-center">
                          {fileFooter && fileFooter.crop ? (
                            <Cropper
                              ref={cropperFooterRef}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                              preview=".img-preview"
                              src={
                                fileFooter
                                  ? fileFooter?.showFile
                                  : defaultprofile
                              }
                              viewMode={3}
                              background={false}
                              autoCropArea={0.3}
                              guides={false}
                            />
                          ) : (
                            <img
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                              src={
                                fileFooter
                                  ? fileFooter?.showFile
                                  : defaultprofile
                              }
                            />
                          )}
                        </div>
                        <div className="mt-4">
                          <div className="d-flex align-items-center mt-2 justify-content-between">
                            <div
                              className="fw-normal text-decoration-underline btn p-0 text-main"
                              onClick={showHideFooterModal}
                            >
                              {fileFooter && !fileFooter?.crop ? "" : "Discard"}
                            </div>
                            <div
                              className="fw-normal text-decoration-underline btn p-0 text-main"
                              onClick={() =>
                                fileFooter && !fileFooter?.crop
                                  ? getFooterCropChangeData()
                                  : getFooterCropData()
                              }
                            >
                              {fileFooter && !fileFooter?.crop
                                ? "Change"
                                : "Save"}
                            </div>
                          </div>
                        </div>
                      </>
                    }
                  />
                </div>
              </div>
            )}

            <div className="mt-5">
              <Row
                justify="space-between"
                className="align-items-center form_addnewpatient mb-1"
              >
                <Col lg="24">
                  <div className="title-common">
                    Set page margins to display your letterhead
                  </div>
                </Col>
              </Row>
              <div className="">
                <div className="my-3 text-center">
                  <label className="mb-1">Top (cm)</label> <br />
                  <Input
                    className="inputheight41-group"
                    value={
                      currentSettings.margins?.[
                        currentSettings.letterHeadFormat
                      ]?.top
                    }
                    onChange={onTopMarginChange}
                    style={{ width: 70 }}
                  />
                </div>
                <Row className="align-items-center justify-content-around form_addnewpatient mb-1">
                  <Col lg="6">
                    <div className="text-center">
                      <label className="mb-1">Left (cm)</label> <br />
                      <Input
                        className="inputheight41-group"
                        value={
                          currentSettings.margins?.[
                            currentSettings.letterHeadFormat
                          ]?.left
                        }
                        onChange={onLeftMarginChange}
                        style={{ width: 70 }}
                      />
                    </div>
                  </Col>
                  <Col lg="12">
                    <img src={rxDisplayArea} alt="Display Area" />
                  </Col>
                  <Col lg="6">
                    <div className="text-center">
                      <label className="mb-1">Right (cm)</label> <br />
                      <Input
                        className="inputheight41-group"
                        value={
                          currentSettings.margins?.[
                            currentSettings.letterHeadFormat
                          ]?.right
                        }
                        onChange={onRightMarginChange}
                        style={{ width: 70 }}
                      />
                    </div>
                  </Col>
                </Row>
                <div className="my-3 text-center">
                  <Input
                    className="inputheight41-group"
                    value={
                      currentSettings.margins?.[
                        currentSettings.letterHeadFormat
                      ]?.bottom
                    }
                    onChange={onBottomMarginChange}
                    style={{ width: 70 }}
                  />{" "}
                  <br />
                  <label className="mb-1">Bottom (cm)</label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-bottom pb-3 mb-3">
        <Row
          justify="space-between"
          className="align-items-center form_addnewpatient mb-1"
        >
          <Col lg="18">
            <div className="titleprint">Display Patient Info</div>
          </Col>
          <Col lg="6">
            <Button
              className="btn rounded-10px px-1 border px-3-15"
              style={{
                transform: patientInfoShowHide
                  ? "rotate(90deg)"
                  : "rotate(-90deg)",
              }}
              onClick={onPatientInfoClick}
            >
              <i className="icon-right"></i>
            </Button>
          </Col>
        </Row>
        <div>Manage your patient information</div>
        {patientInfoShowHide && (
          <div className="mt-4">
            <div className="my-4">
              <div className="my-2">Show Patient Info</div>
              <Radio.Group
                value={displayPatientInfo.showPatientInfo || 0}
                onChange={(e) => {
                  updateHeaderFooter({
                    displayPatientInfo: {
                      ...headerFooterSettings.displayPatientInfo,
                      showPatientInfo: e.target.value,
                    },
                  });
                }}
                style={{ width: "100%", display: "flex" }}
              >
                <Radio.Button
                  value={0}
                  style={{ flex: 1, textAlign: "center" }}
                >
                  Only on First Page
                </Radio.Button>
                <Radio.Button
                  value={1}
                  style={{ flex: 1, textAlign: "center" }}
                >
                  On All Pages
                </Radio.Button>
              </Radio.Group>
            </div>
            <div className="mt-4">
              <div className="mt-4">
                <Row
                  justify="space-between"
                  className="align-items-center form_addnewpatient mb-3"
                >
                  <Col lg={24}>
                    <DndContext
                      modifiers={[restrictToVerticalAxis]}
                      onDragEnd={onDragEndPatientInfo}
                    >
                      <SortableContext
                        items={[...displayPatientInfo.fields]
                          .sort((a, b) => (a.order || 0) - (b.order || 0))
                          .map((field) => field.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <table className="customize-table table-display-patient">
                          <tbody>
                            {[...displayPatientInfo.fields]
                              .sort((a, b) => (a.order || 0) - (b.order || 0))
                              .map((field) => (
                                <CustomRow
                                  key={field.id}
                                  data-row-key={field.id}
                                >
                                  <td
                                    className="align-middle text-center"
                                    style={{ width: "50px" }}
                                  >
                                    <DragHandle />
                                  </td>
                                  <td>{field.label}</td>
                                  <td className="align-middle text-center">
                                    <Switch
                                      onChange={(checked) =>
                                        onChangePatientInfo(checked, field.id)
                                      }
                                      checked={field.enabled !== false}
                                    />
                                  </td>
                                </CustomRow>
                              ))}
                          </tbody>
                        </table>
                      </SortableContext>
                    </DndContext>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-3">
        <Row
          justify="space-between"
          className="align-items-center form_addnewpatient mb-1"
        >
          <Col lg="18">
            <div className="titleprint">Other Settings</div>
          </Col>
          <Col lg="6">
            <Button
              className="btn rounded-10px px-1 border px-3-15"
              style={{
                transform: settingsShowHide
                  ? "rotate(90deg)"
                  : "rotate(-90deg)",
              }}
              onClick={onSettingsClick}
            >
              <i className="icon-right"></i>
            </Button>
          </Col>
        </Row>
        <div>Customize your watermark, signature, and QR code</div>

        {settingsShowHide && (
          <div className="mt-4">
            <div className="mb-3">
              <Row
                justify="space-between"
                className="align-items-center form_addnewpatient"
              >
                <Col lg="18">
                  <div className="title-common">Watermark</div>
                </Col>
                <Col lg="6">
                  <Switch
                    onChange={onWatermarkSwitchChange}
                    checked={otherSettings.watermark || false}
                  />
                </Col>
              </Row>
              {otherSettings.watermark && (
                <div className="upload-headfoot upload-headfoot1 p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <img
                      style={{
                        height: 62,
                        objectFit: "contain",
                        overflow: "hidden",
                      }}
                      src={
                        fileWatermark && fileWatermark?.imageShow
                          ? fileWatermark?.showFile
                          : defaultprofile
                      }
                      alt="Watermark"
                    />
                    <div
                      className="btn btn-input btn-41 d-flex align-items-center justify-content-center"
                      onClick={() => inputWatermarkFile.current?.click()}
                    >
                      <input
                        key={Math.random()}
                        ref={inputWatermarkFile}
                        style={{ display: "none" }}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleWatermarkChange}
                      />
                      <span>
                        <i className="icon-upload me-2"></i>
                        {fileWatermark && fileWatermark?.imageShow
                          ? "Change"
                          : "Upload New"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Row
                justify="space-between"
                className="align-items-center form_addnewpatient mb-3"
              >
                <Col lg="18">
                  <div className="title-common">Signature</div>
                </Col>
                <Col lg="6">
                  <Switch
                    onChange={onSignatureSwitchChange}
                    checked={!!otherSettings.signature}
                  />
                </Col>
              </Row>
            </div>

            {/* Signature Place Selection and Draw/Upload */}
            {otherSettings.signature && (
              <div className="mt-3">
                <Form.Item className="mb-3">
                  <Radio.Group
                    className="d-flex gender-radio"
                    onChange={onSignaturePlaceChange}
                    value={otherSettings.signature}
                  >
                    <Radio.Button className="w-100 text-center" value="left">
                      Left
                    </Radio.Button>
                    <Radio.Button className="w-100 text-center" value="right">
                      Right
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>

                {/* Signature Container */}
                <div className="border rounded-10px mt-3">
                  <div className="upload-headfoot border-0 border-bottom rounded-bottom-0 mt-0">
                    {fileSignature && fileSignature?.imageShow ? (
                      <>
                        <img
                          style={{
                            width: "100%",
                            objectFit: "contain",
                            overflow: "hidden",
                          }}
                          src={fileSignature?.showFile}
                          alt="Signature"
                        />
                        <Button
                          className="btn btn-headfoot btn-headfoot2 px-2"
                          onClick={onRemoveSignature}
                        >
                          <i className="icon-delete"></i>
                        </Button>
                        <Button
                          className="btn btn-headfoot px-2"
                          onClick={showHideSignatureDrawer}
                        >
                          <i className="icon-Edit"></i>
                        </Button>
                      </>
                    ) : (
                      <div
                        className="fw-medium text-decoration-underline cursor-pointer"
                        onClick={showHideSignatureDrawer}
                      >
                        Draw or Upload Signature
                      </div>
                    )}

                    {/* Signature Modal */}
                    <CommonModal
                      handleCancel={true}
                      isModalOpen={isSignatureDrawerOpen}
                      onCancel={showHideSignatureDrawer}
                      modalWidth={744}
                      title={
                        <div className="d-flex">
                          <div className="align-items-center d-flex w-100">
                            <div className="text-truncate-twolines">
                              Signature Image
                            </div>
                          </div>
                          <Button
                            type="button"
                            disabled={
                              !(fileSignature && fileSignature?.preview)
                            }
                            className="btn-41 btn px-4 btn-primary3 me-4"
                            onClick={onSignatureImageSubmit}
                          >
                            Submit
                          </Button>
                        </div>
                      }
                      modalBody={
                        <>
                          <div>
                            <div className="rounded-top-3 bg-body border border-bottom-0 d-flex align-items-center justify-content-between p-2">
                              <div className="fw-medium fontroboto text-main ms-2">
                                Draw Signature
                              </div>
                              <div>
                                <Form.Item className="mb-0">
                                  <Radio.Group
                                    className={`d-flex gender-radio draw-upload ${
                                      isMobile ? "segmented-radio-mobile" : ""
                                    }`}
                                    onChange={onSignatureModeChange}
                                    value={signatureMode}
                                  >
                                    <Radio.Button
                                      className="w-100 text-center"
                                      value="draw"
                                    >
                                      <div className="d-flex align-items-center">
                                        <i className="fs-18 icon-Edit me-1"></i>
                                        <span className="fontroboto fs-12-1 fw-medium">
                                          Draw
                                        </span>
                                      </div>
                                    </Radio.Button>
                                    <Radio.Button
                                      className="w-100 text-center"
                                      value="upload"
                                    >
                                      <div className="d-flex align-items-center">
                                        <i className="fs-16 icon-upload me-1"></i>
                                        <span className="fontroboto fs-12-1 fw-medium">
                                          Upload
                                        </span>
                                      </div>
                                    </Radio.Button>
                                  </Radio.Group>
                                </Form.Item>
                              </div>
                            </div>
                            <div className="d-flex image-crop border justify-content-center align-items-center">
                              {signatureMode === "draw" ? (
                                <SignatureCanvas
                                  ref={signatureRef}
                                  canvasProps={{ width: 694, height: 189 }}
                                />
                              ) : (
                                <>
                                  {fileSignature && fileSignature.showFile ? (
                                    <img
                                      style={{
                                        width: "100%",
                                        height: "189px",
                                        objectFit: "contain",
                                      }}
                                      src={fileSignature.showFile}
                                      alt="Uploaded signature"
                                    />
                                  ) : (
                                    <>
                                      <div
                                        className="fw-medium text-decoration-underline cursor-pointer"
                                        onClick={() =>
                                          inputSignatureFile.current?.click()
                                        }
                                      >
                                        Upload Signature
                                      </div>
                                      <input
                                        key={Math.random()}
                                        ref={inputSignatureFile}
                                        style={{ display: "none" }}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleSignatureUpload}
                                      />
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="d-flex align-items-center justify-content-between rounded-bottom-3 border border-top-0 p-2">
                              <div
                                className="fw-medium text-decoration-underline btn p-0 text-main"
                                onClick={onResetSignature}
                              >
                                Reset
                              </div>
                              <div
                                className="fw-medium text-decoration-underline btn p-0 text-main"
                                onClick={handleTrim}
                              >
                                {fileSignature && fileSignature?.preview
                                  ? "Change"
                                  : "Save"}
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="fw-normal text-main fw-medium fontroboto mb-1">
                                Signature Preview
                              </div>
                              <div
                                style={{
                                  height: 100,
                                  width: 200,
                                  border: "1px solid",
                                  borderColor: "#E2E2EA",
                                  backgroundColor: "#FAFAFB",
                                  borderRadius: "10px",
                                }}
                              >
                                {fileSignature && fileSignature?.preview && (
                                  <img
                                    style={{
                                      width: "100%",
                                      height: "100px",
                                      objectFit: "contain",
                                      overflow: "hidden",
                                    }}
                                    src={fileSignature?.showFile}
                                    alt="Preview"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      }
                    />
                  </div>

                  {/* Include in Signature */}
                  <div className="p-3">
                    <div className="title-common mb-3">
                      Include in signature
                    </div>
                    <div className="mb-3">
                      <Checkbox
                        className="switch-name-check"
                        onChange={onSignatureCheckbox1Change}
                        checked={
                          !!otherSettings.includeInSignature?.nameOfDoctor
                        }
                      >
                        Name of Doctor
                      </Checkbox>
                    </div>
                    <div className="mb-3">
                      <Checkbox
                        className="switch-name-check"
                        onChange={onSignatureCheckbox2Change}
                        checked={
                          !!otherSettings.includeInSignature
                            ?.medicalRegistrationNumber
                        }
                      >
                        Medical Registration Number
                      </Checkbox>
                    </div>
                    <div className="mb-3">
                      <Checkbox
                        className="switch-name-check"
                        onChange={onSignatureCheckbox3Change}
                        checked={
                          !!otherSettings.includeInSignature?.qualifications
                        }
                      >
                        Qualifications
                      </Checkbox>
                    </div>
                    <Input.TextArea
                      className="endreason-textarea h-76"
                      placeholder="Enter qualification e.g. MBBS, MS, MD"
                      style={{ resize: "none" }}
                      onChange={onSignatureQualificationChange}
                      value={
                        otherSettings.includeInSignature
                          ?.qualificationsDescription || ""
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <Row
                justify="space-between"
                className="align-items-center form_addnewpatient mb-3"
              >
                <Col lg="18">
                  <div className="title-common">Show QR code</div>
                </Col>
                <Col lg="6">
                  <Switch
                    onChange={onShowQrSwitchChange}
                    checked={otherSettings.showQRCode || false}
                  />
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(IPDHeaderFooterLayout);
