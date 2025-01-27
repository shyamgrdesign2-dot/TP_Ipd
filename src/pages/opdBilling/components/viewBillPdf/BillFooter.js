import { Image, Text, View } from "@react-pdf/renderer";
import { getMarginByFormat } from "./helper";
import { PX_TO_PT } from "./constants";

const BillFooter = ({ printSettings }) => {
  const { headerFooter } = printSettings;
  const { footer } = headerFooter || {};

  const billData = {
    createdBy: "Harish",
    createdAt: "24/12/2024",
  };
  return (
    <View
      style={{
        position: "absolute",
        bottom: getMarginByFormat(
          headerFooter?.letterHeadFormat,
          headerFooter,
          "bottom",
          0.5
        ),
        left: getMarginByFormat(
          printSettings?.letterhead_format,
          headerFooter,
          "left",
          0.5
        ),
        right: getMarginByFormat(
          headerFooter?.letterHeadFormat,
          headerFooter,
          "right",
          0.5
        ),
      }}
      fixed
    >
      <Text
        style={{
          marginTop: PX_TO_PT * 8,
          marginBottom: PX_TO_PT * 8,
          color: "#A2A2A8",
          fontFamily: "Roboto",
          fontSize: PX_TO_PT * footer?.fontSize,
          fontWeight: 400,
          maxLines: 1,
        }}
      >
        Bill Created By : {billData?.createdBy} | Created on :{" "}
        {billData?.createdAt}
      </Text>

      {headerFooter?.letterHeadFormat === 0 ? (
        <View>
          <View
            style={{
              backgroundColor: "#171725",
              height: PX_TO_PT * 2,
              width: "100%",
            }}
          />
          <Text
            style={{
              marginTop: PX_TO_PT * 8,
              color: "#171725",
              fontFamily: "Roboto",
              fontSize: PX_TO_PT * footer?.fontSize,
              fontWeight: 400,
              maxLines: 1,
            }}
          >
            {footer?.title}
          </Text>
        </View>
      ) : (
        headerFooter?.letterHeadFormat === 1 &&
        footer?.file && (
          <Image
            style={{ width: "100%", objectFit: "cover" }}
            src={
              footer?.file instanceof File
                ? URL.createObjectURL(footer?.file)
                : footer?.file
            }
          />
        )
      )}
    </View>
  );
};

export default BillFooter;
