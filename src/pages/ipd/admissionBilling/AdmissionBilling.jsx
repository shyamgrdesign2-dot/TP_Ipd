import React, { useEffect, useRef, useState } from "react";
import { Drawer, Spin } from "antd";
import { Document, Page } from "react-pdf";
import { pdf } from "@react-pdf/renderer";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";

import ViewBillPdf from "../../opdBilling/components/viewBillPdf/ViewBillPdf";
import CreateBill from "../../opdBilling/components/createBill/CreateBill";
import ToolbarActions from "../components/ToolbarActions/ToolbarActions";
import ConfigureBillSettings from "../../opdBilling/components/configureBillSettings/ConfigureBillSettings";
import RefundBill from "../../opdBilling/components/billingDashboard/RefundBill/RefundBill";
import AddForm3cBills from "../../opdBilling/components/manage3cBills/AddForm3cBills";
import AddAdvance from "../../opdBilling/components/advanceDeposit/AddAdvance";
import {
  fetchBillsByAdmissionIds,
  fetchPrintSetting,
  listAdvancedDepositByPatient,
  createShortLink,
  generateBillToken,
  sendWhatsAppMessage,
} from "../../opdBilling/service";
import { setIpdBillPrintSettings } from "../../../redux/billingSlice";
import {
  calculateTotalPaidAmount,
  handleDownload,
  printContent,
} from "../../opdBilling/utils/helper";
import { setLoadingStatus } from "../../../redux/uploadDocSlice";
import {
  transformAdmissionToPatient,
  getClinic,
  trackEvent,
} from "../../../utils/utils";
import { PERSISTANT_STORAGE_KEY_BILL_TOKEN } from "../../../utils/constants";
import { useLocalStorage } from "../../../utils/localStorage";
import config from "../../../config";
import { WhatsAppOpdBillTemplateId } from "../../opdBilling/utils/constants";
import { message } from "antd";
import "./styles.scss";
import TableBillingDashboard from "../../opdBilling/components/billingDashboard/TableBillingDashboard";
import emptyFileIcon from "../../../assets/images/empty-file.svg";

const AdmissionBilling = ({
  patientDetails,
  patient_data,
  shouldOpenCreateBill,
  onDrawerOpened,
  totalAdvanceBalance: propTotalAdvanceBalance,
  onTotalAdvanceBalanceChange,
  shouldOpenAddAdvance,
  onAddAdvanceDrawerOpened,
  pastBillingHistoryDrawer,
  setPastBillingHistoryDrawer,
}) => {
  const dispatch = useDispatch();
  const divRef = useRef(null);

  const admissionId = patientDetails?.admissionId;

  const { ipdBillPrintSettings, advancedSettings } = useSelector(
    (state) => state.billing
  );
  const { profile, userId } = useSelector((state) => state.doctors);
  const { planDetails } = useSelector((state) => state.subscription);

  const [billData, setBillData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createBillDrawer, setCreateBillDrawer] = useState(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [showConfigureSettings, setShowConfigureSettings] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [printBlob, setPrintBlob] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [divWidth, setDivWidth] = useState(0);
  const [totalAdvanceBalance, setTotalAdvanceBalance] = useState(
    propTotalAdvanceBalance
  );
  const [getBillToken, setBillToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_BILL_TOKEN
  );
  // WhatsApp state - kept for potential future use in ToolbarActions
  // eslint-disable-next-line no-unused-vars
  const [whatsappButtonText, setWhatsappButtonText] =
    useState("Send to WhatsApp");
  // eslint-disable-next-line no-unused-vars
  const [isWhatsappLoading, setIsWhatsappLoading] = useState(false);
  const [editBillDrawer, setEditBillDrawer] = useState(false);
  const [refundBillDrawer, setRefundBillDrawer] = useState(false);
  const [addForm3cDrawer, setAddForm3cDrawer] = useState(false);
  const [, setForm3cData] = useState(0);
  const [addAdvanceDrawer, setAddAdvanceDrawer] = useState(false);
  const billingTableRef = useRef(null);
  const totalPaidAmount = calculateTotalPaidAmount(billData);
  const patientDataForPdf = {
    pm_pid: patientDetails?.details?.pm_pid,
    pm_fullname: patientDetails?.details?.name,
    pm_gender: patientDetails?.details?.gender,
    pm_contact_no: patientDetails?.details?.contact,
    tpml_refrence_id: patientDetails?.details?.mrno,
    ageYears: patientDetails?.details?.age,
    address: patientDetails?.details?.address,
  };

  // Transform patient data for billing
  const transformedPatientData = React.useMemo(() => {
    if (patientDetails) {
      return transformAdmissionToPatient(patientDetails);
    }
    return patient_data || {};
  }, [patientDetails, patient_data]);

  // Check if bill exists for this admission and fetch advance balance
  useEffect(() => {
    const checkBillExists = async () => {
      if (!admissionId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetchBillsByAdmissionIds([admissionId]);

        if (response?.[admissionId]) {
          // Bill exists - get the first bill
          setBillData(response?.[admissionId]?.bills?.[0]);
        } else {
          // No bill exists
          setBillData(null);
        }

        // Fetch advance balance for the patient
        if (transformedPatientData?.patient_unique_id && profile?.user_id) {
          const params = {
            status: "Deposit",
            sortBy: "date",
            sortOrder: "desc",
            page: 1,
            limit: 25,
            doctorIds: profile.user_id,
            search: "",
            patientId: transformedPatientData.patient_unique_id,
          };
          try {
            const advanceResponse = await listAdvancedDepositByPatient(params);
            if (advanceResponse?.summary?.totalAdvanceBalance) {
              const balance = advanceResponse.summary.totalAdvanceBalance;
              setTotalAdvanceBalance(balance);
              if (onTotalAdvanceBalanceChange) {
                onTotalAdvanceBalanceChange(balance);
              }
            }
          } catch (error) {
            console.error("Error fetching advance balance:", error);
          }
        }
      } catch (error) {
        console.error("Error checking for bill:", error);
        setBillData(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkBillExists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admissionId]);

  const getIpdBillPrintSettings = React.useCallback(async () => {
    const printSettingsResponse = await fetchPrintSetting("", "ipdBill");
    if (printSettingsResponse) {
      dispatch(setIpdBillPrintSettings(printSettingsResponse));
    }
  }, [dispatch]);

  const makePDFUrl = React.useCallback(async () => {
    if (!billData || !ipdBillPrintSettings) return;

    try {
      const blob = await pdf(
        <ViewBillPdf
          printSettings={ipdBillPrintSettings}
          patientData={patientDataForPdf}
          profile={profile}
          billData={billData}
          totalAdvanceBalance={totalAdvanceBalance || 0}
          gstIn={advancedSettings?.GSTIN}
          showCreatedBy={
            advancedSettings?.ipdSetting?.enableCreatedByInRx || false
          }
        />
      ).toBlob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }, [
    billData,
    ipdBillPrintSettings,
    profile,
    totalAdvanceBalance,
    advancedSettings,
  ]);

  // Fetch print settings if not available
  useEffect(() => {
    if (
      (ipdBillPrintSettings &&
        Object.keys(ipdBillPrintSettings).length === 0) ||
      !ipdBillPrintSettings
    ) {
      getIpdBillPrintSettings();
    }
  }, [ipdBillPrintSettings, getIpdBillPrintSettings]);

  // Generate PDF URL when bill data and print settings are available
  useEffect(() => {
    if (
      billData &&
      ipdBillPrintSettings &&
      Object.keys(ipdBillPrintSettings).length > 0
    ) {
      makePDFUrl();
    }
  }, [billData, ipdBillPrintSettings, makePDFUrl]);

  // Set div width for PDF rendering
  useEffect(() => {
    if (divRef.current) {
      setDivWidth(divRef.current?.offsetWidth);
    }
  }, [divRef]);

  // Fetch print settings if not available
  useEffect(() => {
    if (
      (ipdBillPrintSettings &&
        Object.keys(ipdBillPrintSettings).length === 0) ||
      !ipdBillPrintSettings
    ) {
      getIpdBillPrintSettings();
    }
  }, [ipdBillPrintSettings, getIpdBillPrintSettings]);

  // Generate PDF URL when bill data and print settings are available
  useEffect(() => {
    if (
      billData &&
      ipdBillPrintSettings &&
      Object.keys(ipdBillPrintSettings).length > 0
    ) {
      makePDFUrl();
    }
  }, [billData, ipdBillPrintSettings, makePDFUrl]);

  const handleCreateBillDrawer = () => {
    setCreateBillDrawer(!createBillDrawer);
  };

  // Open create bill drawer when shouldOpenCreateBill prop is true
  useEffect(() => {
    if (shouldOpenCreateBill && !billData && !isLoading) {
      setCreateBillDrawer(true);
      // Notify parent that drawer has been opened
      if (onDrawerOpened) {
        onDrawerOpened();
      }
    }
  }, [shouldOpenCreateBill, billData, isLoading, onDrawerOpened]);

  // Open add advance drawer when shouldOpenAddAdvance prop is true
  useEffect(() => {
    if (shouldOpenAddAdvance) {
      setAddAdvanceDrawer(true);
      if (onAddAdvanceDrawerOpened) {
        onAddAdvanceDrawerOpened();
      }
    }
  }, [shouldOpenAddAdvance, onAddAdvanceDrawerOpened]);

  const showHideBackModal = () => {
    setIsBackModalOpen(!isBackModalOpen);
  };

  const handleBillCreated = async (newBillData) => {
    // Close drawer and set the new bill data
    setCreateBillDrawer(false);
    // Refetch the bill to get complete data

    if (admissionId) {
      try {
        setIsLoading(true);
        const response = await fetchBillsByAdmissionIds([admissionId]);
        if (response?.[admissionId]?.bills) {
          const bills = response[admissionId].bills;
          // If bills is an array, get the first one, otherwise use the bill object directly
          setBillData(Array.isArray(bills) ? bills[0] : bills);
        } else if (newBillData) {
          // Fallback to the new bill data if refetch fails
          setBillData(newBillData);
        }
      } catch (error) {
        console.error("Error fetching bill after creation:", error);
        // Fallback to the new bill data if refetch fails
        if (newBillData) {
          setBillData(newBillData);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDrawerConfigureSettings = () => {
    setShowConfigureSettings(!showConfigureSettings);
  };

  const handlePrintClick = () => {
    printContent(printBlob, billData?.patientId, setStartLoader);
  };

  const handleDownloadClick = () => {
    handleDownload(pdfUrl, printBlob, billData?.patientId, setStartLoader);
  };

  const handleEditBill = () => {
    setEditBillDrawer(true);
  };

  const handleEditBillDrawer = () => {
    setEditBillDrawer(!editBillDrawer);
  };

  const handleSendToWhatsapp = async () => {
    if (!billData) return;

    setIsWhatsappLoading(true);
    try {
      let token = getBillToken();
      if (!token) {
        token = await generateBillToken();
        setBillToken(token);
      }

      const doctorId = billData?.doctorId || userId;
      const clinic = getClinic(profile?.hospital_data);
      const { patient = {} } = billData || {};

      const shortLink = await createShortLink(
        `${config.doctor_portal_url}/opd-bill?token=${token}${
          billData?.billNumber ? `&billNumber=${billData?.billNumber}` : ""
        }${billData?.patientId ? `&patientId=${billData?.patientId}` : ""}${
          doctorId ? `&doctorId=${doctorId}` : ""
        }${
          admissionId ? `&admissionId=${admissionId}` : ""
        }&receptionist=true&patientViewBill=true`
      );

      const messageData = {
        patient_name: patient?.name,
        clinic_name: clinic?.hm_name,
        bill_link: shortLink,
        clinic_name2: clinic?.hm_name,
      };

      const statusRes = await sendWhatsAppMessage({
        template_id: WhatsAppOpdBillTemplateId,
        text: JSON.stringify(messageData),
        mobile_number: patient?.phone,
      });

      if (statusRes === 200) {
        setWhatsappButtonText("Successfully Sent");
        message.success("Bill sent to WhatsApp successfully");

        // Track event
        trackEvent("TP_Billing_SendToWhatsApp", {
          patientName: patient?.name || "",
          patientId: patient?.id || "",
          doctorSpeciality: profile?.dp_name,
          doctorId: profile?.doctor_unique_id,
          doctorContact: profile?.um_contact,
          city: clinic?.hm_city,
          pincode: clinic?.hm_pincode,
          subscriptionStatus: planDetails?.currentPlanStatus,
        });
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      message.error("Failed to send bill to WhatsApp");
    } finally {
      setIsWhatsappLoading(false);
    }
  };

  const setStartLoader = () => {
    dispatch(setLoadingStatus(true));
  };

  // Handler to refetch bill data
  const refetchBillData = async () => {
    if (!admissionId) return;
    try {
      setIsLoading(true);
      const response = await fetchBillsByAdmissionIds([admissionId]);
      if (response?.[admissionId]?.bills) {
        const bills = response[admissionId].bills;
        setBillData(Array.isArray(bills) ? bills[0] : bills);
      }
    } catch (error) {
      console.error("Error refetching bill data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers for more actions drawers
  const handleRefundBillDrawer = () => {
    setRefundBillDrawer(!refundBillDrawer);
  };

  const handleAddForm3cDrawer = () => {
    setAddForm3cDrawer(!addForm3cDrawer);
  };

  const handleAddAdvanceDrawer = () => {
    setAddAdvanceDrawer(!addAdvanceDrawer);
  };

  const handleAddAdvanceSuccess = () => {
    // Refetch advance balance after successful add/refund
    if (transformedPatientData?.patient_unique_id && profile?.user_id) {
      const params = {
        status: "Deposit",
        sortBy: "date",
        sortOrder: "desc",
        page: 1,
        limit: 25,
        doctorIds: profile.user_id,
        search: "",
        patientId: transformedPatientData.patient_unique_id,
      };
      listAdvancedDepositByPatient(params)
        .then((advanceResponse) => {
          if (advanceResponse?.summary?.totalAdvanceBalance) {
            const balance = advanceResponse.summary.totalAdvanceBalance;
            setTotalAdvanceBalance(balance);
            if (onTotalAdvanceBalanceChange) {
              onTotalAdvanceBalanceChange(balance);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching advance balance:", error);
        });
    }
  };

  const handleRefundSuccess = () => {
    refetchBillData();
  };

  const handleClearDueSuccess = () => {
    refetchBillData();
  };

  const handleForm3cSuccess = () => {
    refetchBillData();
  };

  // Handler for message form 3c (placeholder - can be implemented if needed)
  const handleMessageForm3c = () => {
    // This can be implemented if needed for form 3c messaging
  };

  // Create menu items for more actions dropdown
  const moreActionsMenuItems = React.useMemo(() => {
    if (!billData) return [];

    const items = [];

    // Refund Bill - only show if refunded amount is not equal to total paid amount
    if (billData?.refundedAmount !== totalPaidAmount) {
      items.push({
        key: "refund",
        label: "Refund Bill",
        onClick: () => setRefundBillDrawer(true),
      });
    }

    // Add Bill to Form 3C
    items.push({
      key: "add-form3c",
      label: "Add Bill to Form 3C",
      onClick: () => setAddForm3cDrawer(true),
    });

    return items;
  }, [billData]);

  async function onDocumentLoadSuccess(successEvent) {
    setNumPages(successEvent?.numPages);
    const data = await successEvent.getData();
    const blob = new Blob([data], { type: "application/pdf" });
    setPrintBlob(blob);
  }

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // No bill exists - show create bill button
  if (!billData) {
    return (
      <div className="admission-billing-container">
        <div className="ipd-adm-assess-container-readable">
          <div
            className="d-flex flex-column gap-4 justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <img src={emptyFileIcon} width={165} height={165} alt="No Bill" />
            <p style={{ fontSize: "16px", color: "#A2A2A8", marginBottom: 0 }}>
              No bill has been created for this admission yet.
            </p>
            <Button
              type="primary"
              size="large"
              onClick={handleCreateBillDrawer}
              className="btn btn-primary3 btn-41 px-4"
            >
              Create New IPD Bill
            </Button>
          </div>
        </div>

        {createBillDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={handleCreateBillDrawer}
            open={createBillDrawer}
            width="100%"
            push={false}
          >
            <CreateBill
              handleCreateBillDrawer={handleCreateBillDrawer}
              isBackModalOpen={isBackModalOpen}
              showHideBackModal={showHideBackModal}
              patientData={transformedPatientData}
              admissionId={admissionId}
              onBillCreated={handleBillCreated}
            />
          </Drawer>
        )}
      </div>
    );
  }

  return (
    <div className="admission-billing-container">
      <div className="ipd-adm-assess-container-readable">
        <div className="billing-preview-wrapper">
          {/* PDF Preview */}
          <div className="pdf-preview-container">
            <div ref={divRef} className="pdf-preview-inner">
              {pdfUrl ? (
                <Document
                  loading={
                    <Spin
                      style={{
                        position: "absolute",
                        zIndex: 0,
                        left: "50%",
                        top: "50%",
                      }}
                    />
                  }
                  error={
                    <Spin
                      style={{
                        position: "absolute",
                        zIndex: 0,
                        left: "50%",
                        top: "50%",
                      }}
                      tip="Error loading PDF..."
                    />
                  }
                  noData={
                    <Spin
                      style={{
                        position: "absolute",
                        zIndex: 0,
                        left: "50%",
                        top: "50%",
                      }}
                      tip="Loading PDF..."
                    />
                  }
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  {Array.apply(null, Array(numPages))
                    .map((x, i) => i + 1)
                    .map((page) => {
                      return (
                        <Page
                          key={Math.random()}
                          className={
                            printBlob ? "react-pdf__Page_afterload" : null
                          }
                          loading={null}
                          width={divWidth}
                          pageNumber={page}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      );
                    })}
                </Document>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "100%", minHeight: "400px" }}
                >
                  <Spin size="large" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Configure Settings Drawer */}
        {showConfigureSettings && (
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={handleDrawerConfigureSettings}
            open={showConfigureSettings}
            width="100%"
            push={false}
          >
            <ConfigureBillSettings
              showConfigureSettings={showConfigureSettings}
              handleDrawerConfigureSettings={handleDrawerConfigureSettings}
              patientData={patientDataForPdf}
              billData={billData}
              totalAdvanceBalance={totalAdvanceBalance}
              isDepositReceipt={false}
              isIpdBill={true}
            />
          </Drawer>
        )}

        {/* Edit Bill Drawer */}
        {editBillDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={handleEditBillDrawer}
            open={editBillDrawer}
            width="100%"
            push={false}
          >
            <CreateBill
              handleCreateBillDrawer={handleEditBillDrawer}
              isBackModalOpen={isBackModalOpen}
              showHideBackModal={showHideBackModal}
              patientData={transformedPatientData}
              admissionId={admissionId}
              editBillData={billData}
              onBillCreated={handleBillCreated}
            />
          </Drawer>
        )}
      </div>
      {/* Toolbar Actions - Fixed at bottom */}
      <div className="toolbar-wrapper">
        <ToolbarActions
          showEditForm={true}
          editBtnText="Add/Edit Bill"
          showAddToDischarge={false}
          onEdit={handleEditBill}
          showPreview={false}
          onPrint={handlePrintClick}
          onSettings={handleDrawerConfigureSettings}
          onDownload={handleDownloadClick}
          onSendToWhatsapp={handleSendToWhatsapp}
          showMoreActions={moreActionsMenuItems.length > 0}
          moreActionsMenuItems={moreActionsMenuItems}
        />
      </div>

      {/* Refund Bill Drawer */}
      {refundBillDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleRefundBillDrawer}
          open={refundBillDrawer}
          width="100%"
          push={false}
        >
          <RefundBill
            billType="ipd"
            handleRefundBillDrawer={handleRefundBillDrawer}
            billData={billData}
            handleMessageForm3c={handleMessageForm3c}
            getPatientBills={refetchBillData}
            onRefundSuccess={handleRefundSuccess}
            patientAdvanceData={async () => {
              // Refetch advance balance
              if (
                transformedPatientData?.patient_unique_id &&
                profile?.user_id
              ) {
                try {
                  const advanceResponse = await listAdvancedDepositByPatient({
                    patientId: transformedPatientData.patient_unique_id,
                    doctorId: profile.user_id,
                  });
                  if (advanceResponse?.data) {
                    const totalBalance = advanceResponse.data.reduce(
                      (sum, item) => sum + (parseFloat(item.balance) || 0),
                      0
                    );
                    setTotalAdvanceBalance(totalBalance);
                  }
                } catch (error) {
                  console.error("Error fetching advance balance:", error);
                }
              }
            }}
          />
        </Drawer>
      )}

      {/* Add Form 3C Drawer */}
      {addForm3cDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleAddForm3cDrawer}
          open={addForm3cDrawer}
          width="100%"
          push={false}
        >
          <AddForm3cBills
            handleAddForm3cDrawer={handleAddForm3cDrawer}
            setForm3cData={setForm3cData}
            onSuccess={handleForm3cSuccess}
            isIpd
          />
        </Drawer>
      )}

      {/* Add Advance Drawer */}
      {addAdvanceDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleAddAdvanceDrawer}
          open={addAdvanceDrawer}
          width="100%"
          push={false}
        >
          <AddAdvance
            handleAddAdvanceDrawer={handleAddAdvanceDrawer}
            patientData={transformedPatientData}
            billData={billData}
            onSuccess={handleAddAdvanceSuccess}
            updateTotalAdvanceBalance={(balance) => {
              setTotalAdvanceBalance(balance);
              if (onTotalAdvanceBalanceChange) {
                onTotalAdvanceBalanceChange(balance);
              }
            }}
            isReceptionistDashboard={false}
          />
        </Drawer>
      )}

      {pastBillingHistoryDrawer && (
        <Drawer
          placement="right"
          onClose={() => setPastBillingHistoryDrawer(false)}
          open={pastBillingHistoryDrawer}
          width="1000px"
          push={false}
          title="Past IPD Billing History"
          className="ipd-patient-billing-history-drawer"
        >
          <div
            style={{
              marginTop: "24px",
            }}
          >
            <TableBillingDashboard
              ref={billingTableRef}
              onTabChange={() => {}}
              patientData={patientDetails}
              handleTotalAdvanceUpdate={() => {}}
              totalAdvanceBalance={totalAdvanceBalance}
              createBillDrawer={() => {}}
              addAdvanceDrawer={() => {}}
              showHideSubModal={() => {}}
              fromPath="ipdDashboard"
              ipdAdmissionId={admissionId}
            />
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default React.memo(AdmissionBilling);
