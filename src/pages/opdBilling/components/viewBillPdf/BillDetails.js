import { Text, View } from "@react-pdf/renderer";
import { PX_TO_PT, styles } from "./constants";
import React from "react";

const BillDetails = ({ pageFormat, billData }) => {
  const {
    billItems,
    subTotal,
    lineItemDiscount,
    extraDiscount,
    applicableGst,
    payableAmount,
    paymentModes = [],
    paidAmount,
    dueFromPreviousBill,
    dueAmount,
    notes,
  } = billData || {};

  const billInfo = [
    { label: "Subtotal:", value: `${subTotal}` },
    { label: "Line Item Discount:", value: lineItemDiscount },
    { label: "Extra Discount:", value: `${extraDiscount}` },
    {
      label: "Applicable GST:",
      value: `${applicableGst}`,
      divider: dueFromPreviousBill === 0,
    },
    dueFromPreviousBill > 0
      ? {
          label: "Due from Previous bill:",
          value: `${dueFromPreviousBill}`,
          divider: true,
        }
      : undefined,
    {
      label: "Total Payable Amount:",
      value: `${payableAmount}`,
      bold: true,
      divider: true,
    },
    ...paymentModes?.map((mode, index) => ({
      label: `Paid Via ${mode.paymentMode}:`,
      value: `${mode.amount.toFixed(2)}`,
      divider: index === paymentModes.length - 1,
    })),
    {
      label: "Total Amount Paid:",
      value: `${paidAmount}`,
      color: "#3D8C40",
      bold: true,
    },
    dueAmount > 0
      ? {
          label: "Payment Due:",
          value: `${dueAmount}`,
          color: "#ED8A00",
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
                flex: 0.4,
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
                flex: 0.4,
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
                  flex: 0.4,
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
                  flex: 0.4,
                  color: "#171725",
                  fontFamily: pageFormat?.fontFamily,
                  fontSize: PX_TO_PT * pageFormat?.fontSize,
                  fontWeight: 400,
                },
              ]}
            >
              {item?.amount ?? ""}
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
              {item?.discount ?? ""}
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
              {item.gst ?? ""}
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
              {item?.totalAmount ?? ""}
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
      </View>

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
