import { Text, View } from "@react-pdf/renderer";
import { PX_TO_PT, styles } from "./constants";
import React from "react";

const BillData = [
  {
    items: "Consultaion",
    quantity: 10,
    amount: 100,
    discount: 10,
    gst: 18,
    total: 120,
  },
  {
    items: "Consultaion",
    quantity: 10,
    amount: 100,
    discount: 10,
    gst: 18,
    total: 120,
  },
  {
    items: "Consultaion",
    quantity: 10,
    amount: 100,
    discount: 10,
    gst: 18,
    total: 120,
  },
];

const BillDetails = ({ pageFormat }) => {
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
        {BillData?.map((item, i) => (
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
              {item?.items ?? ""}
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
              {item?.total ?? ""}
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
        {[
          { label: "Subtotal:", value: "$100.00" },
          { label: "Line Item Discount:", value: "10" },
          { label: "Extra Discount:", value: "$10.00" },
          { label: "Applicable GST:", value: "$18.00", divider: true },
          {
            label: "Total Payable Amount:",
            value: "$108.00",
            bold: true,
            divider: true,
          },
          { label: "Paid Via “Cash”:", value: "$10.00" },
          { label: "Paid Via UPI:", value: "$10.00", divider: true },
          {
            label: "Total Amount Paid:",
            value: "$108.00",
            color: "#3D8C40",
            bold: true,
          },
        ].map((item, index) => (
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
          Can take painkiller tablets during the menstrual time. However, make
          sure not to use more than 2 painkillers per day.
        </Text>
      </Text>
    </>
  );
};

export default BillDetails;
