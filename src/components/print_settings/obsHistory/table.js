import React from "react";
import moment from "moment";
import { Text, View } from "@react-pdf/renderer";

function ObsHistoryTableView({
  PX_TO_PT,
  styles,
  printSettings,
  options,
  obsHistoryData,
}) {
  return (
    <View style={{ marginTop: PX_TO_PT * 15 }}>
      <Text
        style={{
          color: "#171725",
          fontFamily: printSettings?.page_format?.font_family,
          fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
          fontWeight: 700,
        }}
      >
        Obstetric History&nbsp;:&nbsp;
      </Text>

      {options?.includes("diagnosis") && (
        <View>
          <Text
            style={{
              color: "#000",
              marginTop: PX_TO_PT * 12,
              fontFamily: printSettings?.page_format?.font_family,
              fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
              fontWeight: 500,
              padding: 6,
              borderTop: "1px solid #171725",
              borderLeft: "1px solid #171725",
              borderRight: "1px solid #171725",
              backgroundColor: "#E2E2EA",
            }}
          >
            Patient diagnosis
          </Text>
          <View style={[styles.table, { marginTop: 0 }]}>
            <View
              style={[
                styles.row,
                { alignItems: "center", justifyContent: "center" },
              ]}
            >
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                  styles.minHeight38,
                ]}
              >
                LMP
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                  styles.minHeight38,
                ]}
              >
                E.D.D.
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                  styles.minHeight38,
                ]}
              >
                C.E.E.D.
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                  styles.minHeight38,
                ]}
              >
                Gestation
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                  styles.minHeight38,
                ]}
              >
                Blood group
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                  styles.minHeight38,
                ]}
              >
                Husband's blood group
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                  styles.minHeight38,
                ]}
              >
                Consng
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                  styles.minHeight38,
                ]}
              >
                Marital status
              </Text>
            </View>

            <View
              style={[
                styles.row,
                { alignItems: "center", justifyContent: "center" },
              ]}
            >
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {obsHistoryData?.lmp
                  ? moment(obsHistoryData?.lmp).format("DD MMM YYYY")
                  : `-`}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {obsHistoryData?.edd
                  ? moment(obsHistoryData?.edd).format("DD MMM YYYY")
                  : `-`}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {obsHistoryData?.ceed
                  ? moment(obsHistoryData?.ceed).format("DD MMM YYYY")
                  : `-`}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {obsHistoryData?.gestationWeeks
                  ? `${obsHistoryData?.gestationWeeks}W`
                  : ""}
                {obsHistoryData?.gestationWeeks && obsHistoryData?.gestationDays
                  ? `,`
                  : `-`}
                {obsHistoryData?.gestationDays
                  ? `${obsHistoryData?.gestationDays}D`
                  : ""}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {obsHistoryData?.blood || `-`}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {obsHistoryData?.husbandsBlood || `-`}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {Boolean(obsHistoryData?.consang) ? `Yes` : `No`}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {obsHistoryData?.maritialStatus || `-`}
              </Text>
            </View>
          </View>
        </View>
      )}

      {options?.includes("gplae") && (
        <View>
          <Text
            style={{
              color: "#000",
              marginTop: PX_TO_PT * 12,
              fontFamily: printSettings?.page_format?.font_family,
              fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
              fontWeight: 500,
              padding: 6,
              borderTop: "1px solid #171725",
              borderLeft: "1px solid #171725",
              borderRight: "1px solid #171725",
              backgroundColor: "#E2E2EA",
            }}
          >
            GPLAE
          </Text>
          <View style={[styles.table, { marginTop: 0 }]}>
            <View
              style={[
                styles.row,
                { alignItems: "center", justifyContent: "center" },
              ]}
            >
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                Gravida
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                Para
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                Living
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                Abortion
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                Ectopic
              </Text>
            </View>

            <View
              style={[
                styles.row,
                { alignItems: "center", justifyContent: "center" },
              ]}
            >
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {obsHistoryData?.gravidity
                  ? (obsHistoryData?.gravidity).toString().padStart(2, "0")
                  : `-`}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {obsHistoryData?.parity
                  ? (obsHistoryData?.parity).toString().padStart(2, "0")
                  : `-`}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {obsHistoryData?.livingChildren
                  ? (obsHistoryData?.livingChildren).toString().padStart(2, "0")
                  : `-`}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {obsHistoryData?.abortion
                  ? (obsHistoryData?.abortion).toString().padStart(2, "0")
                  : `-`}
              </Text>
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                    color: "#000",
                    textAlign: "center",
                  },
                ]}
              >
                {obsHistoryData?.ectopicPregnancies
                  ? (obsHistoryData?.ectopicPregnancies)
                      .toString()
                      .padStart(2, "0")
                  : `-`}
              </Text>
            </View>
            <Text
              style={{
                color: "#000",
                fontFamily: printSettings?.page_format?.font_family,
                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                fontWeight: 500,
                padding: 6,
                borderBottom: "1px solid #171725",
                borderRight: "1px solid #171725",
              }}
            >
              Remarks&nbsp;:&nbsp;{obsHistoryData?.diagnosisNotes || `-`}
            </Text>
          </View>
        </View>
      )}

      {options?.includes("history") && (
        <View>
          <Text
            style={{
              color: "#000",
              marginTop: PX_TO_PT * 12,
              fontFamily: printSettings?.page_format?.font_family,
              fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
              fontWeight: 500,
              padding: 6,
              borderTop: "1px solid #171725",
              borderLeft: "1px solid #171725",
              borderRight: "1px solid #171725",
              backgroundColor: "#E2E2EA",
            }}
          >
            Pregnancy history
          </Text>
          {obsHistoryData?.pregnancyHistory.map((item, i) => {
            return (
              <View key={i} wrap={false}>
                <View style={[styles.table, { marginTop: 0 }]}>
                  <View
                    style={[
                      styles.row,
                      { alignItems: "center", justifyContent: "center" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.cell,
                        {
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 500,
                          color: "#000",
                          textAlign: "center",
                        },
                      ]}
                    >
                      Gravida no
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        {
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 500,
                          color: "#000",
                          textAlign: "center",
                        },
                      ]}
                    >
                      Outcome
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        {
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 500,
                          color: "#000",
                          textAlign: "center",
                        },
                      ]}
                    >
                      Term length
                    </Text>
                    {item?.deliveryMode && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        Delivery mode
                      </Text>
                    )}

                    {item?.gestationPeriod && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        Period of gestation
                      </Text>
                    )}

                    {item?.location && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        Location
                      </Text>
                    )}

                    {item?.modeOfManagement && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        Management mode
                      </Text>
                    )}

                    {item?.typeOfAbortion && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        Type of abortion
                      </Text>
                    )}

                    {item?.modeOfAbortion && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        Mode of abortion
                      </Text>
                    )}

                    {item?.dateOfDelivery && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        Delivery date
                      </Text>
                    )}

                    {item?.gender && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        Gender
                      </Text>
                    )}

                    {item?.babysWeight && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        Baby's weight
                      </Text>
                    )}
                  </View>

                  <View
                    style={[
                      styles.row,
                      { alignItems: "center", justifyContent: "center" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.cell,
                        {
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                          color: "#000",
                          textAlign: "center",
                        },
                      ]}
                    >
                      {item?.gravidaNumber
                        ? (item?.gravidaNumber).toString().padStart(2, "0")
                        : `-`}
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        {
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                          color: "#000",
                          textAlign: "center",
                        },
                      ]}
                    >
                      {item?.outcome || `-`}
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        {
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                          color: "#000",
                          textAlign: "center",
                        },
                      ]}
                    >
                      {item?.termLength || `-`}
                    </Text>

                    {item?.deliveryMode && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 400,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        {item?.deliveryMode || `-`}
                      </Text>
                    )}

                    {item?.gestationPeriod && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 400,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        {item?.gestationPeriod
                          ? `${item.gestationPeriod} ${
                              item.gestationPeriod > 1 ? "weeks" : "week"
                            }`
                          : "-"}
                      </Text>
                    )}

                    {item?.location && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 400,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        {item?.location || `-`}
                      </Text>
                    )}

                    {item?.modeOfManagement && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 400,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        {item?.modeOfManagement || `-`}
                      </Text>
                    )}

                    {item?.typeOfAbortion && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 400,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        {item?.typeOfAbortion || `-`}
                      </Text>
                    )}

                    {item?.modeOfAbortion && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 400,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        {item?.modeOfAbortion || `-`}
                      </Text>
                    )}

                    {item?.dateOfDelivery && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 400,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        {item?.dateOfDelivery
                          ? moment(item?.dateOfDelivery).format("DD MMM YYYY")
                          : `-`}
                      </Text>
                    )}

                    {item?.gender && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 400,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        {item?.gender || `-`}
                      </Text>
                    )}

                    {item?.babysWeight && (
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 400,
                            color: "#000",
                            textAlign: "center",
                          },
                        ]}
                      >
                        {item?.babysWeight || ``}
                        {item?.babysWeight ? `kgs` : `-`}
                      </Text>
                    )}
                  </View>
                </View>
                <Text
                  style={{
                    color: "#000",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                    padding: 6,
                    borderBottom: "1px solid #171725",
                    borderLeft: "1px solid #171725",
                    borderRight: "1px solid #171725",
                  }}
                >
                  Remarks&nbsp;:&nbsp;{item?.remarks || `-`}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {options?.includes("examination") && (
        <View>
          <Text
            style={{
              color: "#000",
              marginTop: PX_TO_PT * 12,
              fontFamily: printSettings?.page_format?.font_family,
              fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
              fontWeight: 500,
              padding: 6,
              borderTop: "1px solid #171725",
              borderLeft: "1px solid #171725",
              borderRight: "1px solid #171725",
              backgroundColor: "#E2E2EA",
            }}
            wrap={false}
          >
            Examination
          </Text>
          {obsHistoryData?.examinationHistory.map((item, i) => (
            <View key={i} wrap={false}>
              <View style={[styles.table, { marginTop: 0 }]}>
                <View
                  style={[
                    styles.row,
                    { alignItems: "center", justifyContent: "center" },
                  ]}
                >
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 0.5,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    Rx
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 0.5,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    Pallor
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 0.7,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    Oedema
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1.3,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    BMI
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1.5,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    BP
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    Fundus
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1.5,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    Presentation
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    Fluid
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    FHR
                  </Text>
                </View>

                <View
                  style={[
                    styles.row,
                    { alignItems: "center", justifyContent: "center" },
                  ]}
                >
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 0.5,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {i + 1}
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 0.5,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {Boolean(item?.pallor) ? `Yes` : `No`}
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 0.7,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {Boolean(item?.oedema) ? `Yes` : `No`}
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1.3,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {item?.mothersBMI || ``}
                    {item?.mothersBMI ? `kg/m2` : `-`}
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1.5,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {item?.diastolic || ``}
                    {item?.diastolic ? `/` : `-`}
                    {item?.systolic || ``}
                    {item?.diastolic ? ` mmHg` : ``}
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {item?.heightOfFundus || ``}
                    {item?.heightOfFundusUnit || `-`}
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1.5,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {item?.presentation || `-`}
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {item?.fluidIndex || ``}
                    {item?.fluidIndex ? ` cm` : `-`}
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1,
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                        color: "#000",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {item?.foetalHeartRate || ``}
                    {item?.foetalHeartRate ? ` BPM` : `-`}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  color: "#000",
                  fontFamily: printSettings?.page_format?.font_family,
                  fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                  fontWeight: 500,
                  padding: 6,
                  borderBottom: "1px solid #171725",
                  borderLeft: "1px solid #171725",
                  borderRight: "1px solid #171725",
                }}
              >
                Remarks&nbsp;:&nbsp;{item?.notes || `-`}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default ObsHistoryTableView;
