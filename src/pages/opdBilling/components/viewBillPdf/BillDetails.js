import { Text, View } from "@react-pdf/renderer";
import { PX_TO_PT, styles } from "./constants";
import React from "react";

const BillDetails = ({ pageFormat, billData, totalAdvanceBalance, isIpdBill }) => {
  const {
    billItems,
    subTotal,
    lineItemDiscount,
    extraDiscount,
    extraDiscountType,
    applicableGst,
    payableAmount,
    paymentModes = [],
    paidAmount,
    dueFromPreviousBill,
    dueAmount,
    notes,
    paymentStatus,
    refundedAmount,
    refundModes = [],
    refundNotes,
    nextBillNumber,
  } = billData || {};

  const totalBillAmount = billItems?.reduce(
    (sum, service) => sum + (Number(service.totalAmount) || 0),
    0
  );

  const extraDiscountAmount =
    extraDiscountType === "percentage"
      ? (totalBillAmount * (Number(extraDiscount) || 0)) / 100 // Percentage based
      : Number(extraDiscount) || 0; // Flat/Rupee based

  const billInfo = [
    { label: "Subtotal:", value: `₹${subTotal}` },
    { label: "Line Item Discount:", value: `₹${lineItemDiscount}` },
    {
      label: "Applicable GST:",
      value: `₹${applicableGst}`,
      divider: dueFromPreviousBill === 0,
    },
    { label: "Extra Discount:", value: `₹${extraDiscountAmount?.toFixed(2)}` },
    dueFromPreviousBill > 0
      ? {
          label: "Due from Previous bill:",
          value: `₹${dueFromPreviousBill?.toFixed(2)}`,
          divider: true,
        }
      : undefined,
    {
      label: "Total Payable Amount:",
      value: `₹${payableAmount?.toFixed(2)}`,
      bold: true,
      divider: true,
    },
    ...paymentModes?.map((mode, index) => ({
      label: `Paid Via ${mode.paymentMode}:`,
      value: `₹${mode.amount.toFixed(2)}`,
      divider: index === paymentModes.length - 1,
    })),
    {
      label: "Total Amount Paid:",
      value: `₹${paidAmount?.toFixed(2)}`,
      color: "#3D8C40",
      bold: true,
    },
    dueAmount > 0
      ? {
          label: "Total Payment Due:",
          value: `₹${dueAmount?.toFixed(2)}`,
          color: "#ED8A00",
          bold: true,
          textDecoration: nextBillNumber,
        }
      : undefined,
    paymentStatus === "Refunded"
      ? {
          label: "Total Refund Amount:",
          value: `₹${refundedAmount?.toFixed(2)}`,
          color: "#FC5A5A",
          bold: true,
          divider: true,
        }
      : undefined,
    ...refundModes?.map((mode) => ({
      label: `Refunded Via ${mode.paymentMode}:`,
      value: `₹${mode.amount.toFixed(2)}`,
    })),
    totalAdvanceBalance > 0
      ? {
          label: "Advance Balance:",
          value: `₹${totalAdvanceBalance?.toFixed(2)}`,
          color: "#A461D8",
          bold: true,
        }
      : undefined,
  ]?.filter((item) => item);

  return (
    <>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text
            style={[
              styles.cell,
              {
                flex: 0.1,
                fontFamily: pageFormat?.fontFamily,
                fontSize: PX_TO_PT * pageFormat?.fontSize,
                fontWeight: 500,
                color: "#000",
                backgroundColor: "#F1F1F5",
              },
            ]}
          >
            #
          </Text>
          {isIpdBill && (
            <Text
              style={[
                styles.cell,
                {
                  flex: 0.3,
                  fontFamily: pageFormat?.fontFamily,
                  fontSize: PX_TO_PT * pageFormat?.fontSize,
                  fontWeight: 500,
                  color: "#000",
                  backgroundColor: "#F1F1F5",
                },
              ]}
            >
              DATE
            </Text>
          )}
          <Text
            style={[
              styles.cell,
              {
                flex: 0.8,
                fontFamily: pageFormat?.fontFamily,
                fontSize: PX_TO_PT * pageFormat?.fontSize,
                fontWeight: 500,
                color: "#000",
                backgroundColor: "#F1F1F5",
              },
            ]}
          >
            ITEMS
          </Text>
          <Text
            style={[
              styles.cell,
              {
                flex: isIpdBill ? 0.2 : 0.4,
                fontFamily: pageFormat?.fontFamily,
                fontSize: PX_TO_PT * pageFormat?.fontSize,
                fontWeight: 500,
                color: "#000",
                backgroundColor: "#F1F1F5",
              },
            ]}
          >
            QTY
          </Text>
          <Text
            style={[
              styles.cell,
              {
                flex: isIpdBill ? 0.3 : 0.4,
                fontFamily: pageFormat?.fontFamily,
                fontSize: PX_TO_PT * pageFormat?.fontSize,
                fontWeight: 500,
                color: "#000",
                backgroundColor: "#F1F1F5",
              },
            ]}
          >
            AMOUNT
          </Text>
          <Text
            style={[
              styles.cell,
              {
                flex: 0.4,
                fontFamily: pageFormat?.fontFamily,
                fontSize: PX_TO_PT * pageFormat?.fontSize,
                fontWeight: 500,
                color: "#000",
                backgroundColor: "#F1F1F5",
              },
            ]}
          >
            DISCOUNT
          </Text>
          <Text
            style={[
              styles.cell,
              {
                flex: 0.4,
                fontFamily: pageFormat?.fontFamily,
                fontSize: PX_TO_PT * pageFormat?.fontSize,
                fontWeight: 500,
                color: "#000",
                backgroundColor: "#F1F1F5",
              },
            ]}
          >
            GST(%)
          </Text>
          <Text
            style={[
              styles.cell,
              {
                flex: 0.5,
                fontFamily: pageFormat?.fontFamily,
                fontSize: PX_TO_PT * pageFormat?.fontSize,
                fontWeight: 500,
                color: "#000",
                backgroundColor: "#F1F1F5",
              },
            ]}
          >
            TOTAL AMOUNT
          </Text>
        </View>
        {billItems?.map((item, i) => (
          <View style={styles.row} key={i}>
            <Text
              style={[
                styles.cell,
                {
                  flex: 0.1,
                  color: "#171725",
                  fontFamily: pageFormat?.fontFamily,
                  fontSize: PX_TO_PT * pageFormat?.fontSize,
                  fontWeight: 400,
                },
              ]}
            >
              {i + 1}
            </Text>
            {isIpdBill && <Text
              style={[
                styles.cell,
                {
                  flex: 0.3,
                  color: "#171725",
                  fontFamily: pageFormat?.fontFamily,
                  fontSize: PX_TO_PT * pageFormat?.fontSize,
                  fontWeight: 400,
                },
              ]}
            >
              {item?.itemDate ?? ""}
            </Text>}
            <Text
              style={[
                styles.cell,
                {
                  flex: 0.8,
                  color: "#171725",
                  fontFamily: pageFormat?.fontFamily,
                  fontSize: PX_TO_PT * pageFormat?.fontSize,
                  fontWeight: 400,
                },
              ]}
            >
              {item?.name ?? ""}
            </Text>
            <Text
              style={[
                styles.cell,
                {
                  flex: isIpdBill ? 0.2 : 0.4,
                  color: "#171725",
                  fontFamily: pageFormat?.fontFamily,
                  fontSize: PX_TO_PT * pageFormat?.fontSize,
                  fontWeight: 400,
                },
              ]}
            >
              {item?.quantity ?? ""}
            </Text>
            <Text
              style={[
                styles.cell,
                {
                  flex: isIpdBill ? 0.3 : 0.4,
                  color: "#171725",
                  fontFamily: pageFormat?.fontFamily,
                  fontSize: PX_TO_PT * pageFormat?.fontSize,
                  fontWeight: 400,
                },
              ]}
            >
              {item?.amount ? `₹${item?.amount}` : ""}
            </Text>
            <Text
              style={[
                styles.cell,
                {
                  flex: 0.4,
                  color: "#171725",
                  fontFamily: pageFormat?.fontFamily,
                  fontSize: PX_TO_PT * pageFormat?.fontSize,
                  fontWeight: 400,
                },
              ]}
            >
              {item?.discount && item?.discountType === "flat"
                ? `₹${item?.discount}`
                : item?.discount
                ? `${item?.discount}%`
                : ""}
            </Text>
            <Text
              style={[
                styles.cell,
                {
                  flex: 0.4,
                  color: "#171725",
                  fontFamily: pageFormat?.fontFamily,
                  fontSize: PX_TO_PT * pageFormat?.fontSize,
                  fontWeight: 400,
                },
              ]}
            >
              {item.gst ? `${item?.gst}%` : ""}
            </Text>
            <Text
              style={[
                styles.cell,
                {
                  flex: 0.5,
                  color: "#171725",
                  fontFamily: pageFormat?.fontFamily,
                  fontSize: PX_TO_PT * pageFormat?.fontSize,
                  fontWeight: 400,
                },
              ]}
            >
              {item?.totalAmount ? `₹${item?.totalAmount}` : ""}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          width: "100%",
          marginTop: 10,
        }}
      >
        {billInfo.map((item, index) => (
          <React.Fragment key={index}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "45%",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: pageFormat?.fontFamily,
                  fontSize:
                    PX_TO_PT * (pageFormat?.fontSize + (item.bold ? 1 : 0)),
                  color: item?.color ?? "#000",
                  fontWeight: item.bold ? "500" : "400",
                  textAlign: "left",
                  width: "60%",
                  textDecoration: item.textDecoration ? "line-through" : "none",
                }}
              >
                {item.label}
              </Text>
              <Text
                style={{
                  fontFamily: pageFormat?.fontFamily,
                  fontSize:
                    PX_TO_PT * (pageFormat?.fontSize + (item.bold ? 1 : 0)),
                  color: item?.color ?? "#000",
                  fontWeight: item.bold ? "500" : "400",
                  textAlign: "right",
                  width: "40%",
                  textDecoration: item.textDecoration ? "line-through" : "none",
                }}
              >
                {item.value}
              </Text>
            </View>

            {item.divider && (
              <View
                style={{
                  width: "45%",
                  borderBottom: "1px solid #F1F1F5",
                  marginBottom: 8,
                }}
              />
            )}
          </React.Fragment>
        ))}
        {nextBillNumber && (
          <Text
            style={{
              fontFamily: pageFormat?.fontFamily,
              fontSize: PX_TO_PT * pageFormat?.fontSize,
              lineHeight: 1.4,
              width: "45%",
              textAlign: "right",
              backgroundColor: "#F1F1F5",
              borderRadius: 6,
              padding: 6,
              marginTop: 5,
              textAlign: "left",
            }}
          >
            This due amount of{" "}
            <Text style={{ fontWeight: 500 }}>₹{dueAmount?.toFixed(2)}</Text>{" "}
            has been automatically added to the patients next bill (Bill No:{" "}
            <Text style={{ fontWeight: 500 }}>{nextBillNumber}</Text>
            ).
          </Text>
        )}
      </View>

      {refundNotes && (
        <Text
          style={[
            {
              fontFamily: pageFormat?.fontFamily,
              fontSize: (pageFormat?.fontSize || 12) * PX_TO_PT,
              fontWeight: 500,
              color: "#000",
            },
          ]}
        >
          {"\n"}Credit Note:&nbsp;
          <Text
            style={{
              fontFamily: pageFormat?.fontFamily,
              fontWeight: 400,
            }}
          >
            {refundNotes}
          </Text>
        </Text>
      )}

      {notes && (
        <Text
          style={[
            {
              fontFamily: pageFormat?.fontFamily,
              fontSize: (pageFormat?.fontSize || 12) * PX_TO_PT,
              fontWeight: 500,
              color: "#000",
            },
          ]}
        >
          {"\n"}Notes:&nbsp;
          <Text
            style={{
              fontFamily: pageFormat?.fontFamily,
              fontWeight: 400,
            }}
          >
            {notes}
          </Text>
        </Text>
      )}
    </>
  );
};

export default BillDetails;
