import BillingDashboard from "../../opdBilling/components/billingDashboard/BillingDashboard";

const IpdBillingHistory = () => {
  return (
    <div className="billing-page-wrap">
      <BillingDashboard
        patientData={null}
        fromPath="ipdDashboard"
        isIpd={true}
      />
    </div>
  );
};

export default IpdBillingHistory;
