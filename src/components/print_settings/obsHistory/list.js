import React from "react";
import moment from "moment";
import { Text, View } from "@react-pdf/renderer";

function ObsHistoryListView({
  PX_TO_PT,
  printSettings,
  options,
  obsHistoryData,
}) {
  let obsListViewCounter = 1;

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
          <Text style={{ marginTop: 5, lineHeight: 1.4 }}>
            {("lmp" in obsHistoryData ||
              "edd" in obsHistoryData ||
              "ceed" in obsHistoryData ||
              "gestationWeeks" in obsHistoryData ||
              "gestationDays" in obsHistoryData ||
              "blood" in obsHistoryData ||
              "husbandsBlood" in obsHistoryData ||
              "consang" in obsHistoryData ||
              "maritialStatus" in obsHistoryData ||
              "marriageDurationYears" in obsHistoryData ||
              "marriageDurationMonths" in obsHistoryData) && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  &nbsp;{obsListViewCounter++}.&nbsp;Patient diagnosis&nbsp;
                </Text>

                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  &nbsp;{"\n"}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;Details&nbsp;(
                </Text>
                {"lmp" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      LMP&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {moment(obsHistoryData?.lmp).format("DD MMM YYYY")}
                    </Text>

                    {("edd" in obsHistoryData ||
                      "ceed" in obsHistoryData ||
                      "gestationWeeks" in obsHistoryData ||
                      "gestationDays" in obsHistoryData ||
                      "blood" in obsHistoryData ||
                      "husbandsBlood" in obsHistoryData ||
                      "consang" in obsHistoryData ||
                      "maritialStatus" in obsHistoryData ||
                      "marriageDurationYears" in obsHistoryData ||
                      "marriageDurationMonths" in obsHistoryData) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                        }}
                      >
                        &nbsp;|&nbsp;
                      </Text>
                    )}
                  </>
                )}

                {"edd" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      E.D.D.&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {moment(obsHistoryData?.edd).format("DD MMM YYYY")}
                    </Text>
                    {("ceed" in obsHistoryData ||
                      "gestationWeeks" in obsHistoryData ||
                      "gestationDays" in obsHistoryData ||
                      "blood" in obsHistoryData ||
                      "husbandsBlood" in obsHistoryData ||
                      "consang" in obsHistoryData ||
                      "maritialStatus" in obsHistoryData ||
                      "marriageDurationYears" in obsHistoryData ||
                      "marriageDurationMonths" in obsHistoryData) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                        }}
                      >
                        &nbsp;|&nbsp;
                      </Text>
                    )}
                  </>
                )}

                {"ceed" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      C.E.D.D.&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {moment(obsHistoryData?.ceed).format("DD MMM YYYY")}
                    </Text>
                    {("gestationWeeks" in obsHistoryData ||
                      "gestationDays" in obsHistoryData ||
                      "blood" in obsHistoryData ||
                      "husbandsBlood" in obsHistoryData ||
                      "consang" in obsHistoryData ||
                      "maritialStatus" in obsHistoryData ||
                      "marriageDurationYears" in obsHistoryData ||
                      "marriageDurationMonths" in obsHistoryData) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                        }}
                      >
                        &nbsp;|&nbsp;
                      </Text>
                    )}
                  </>
                )}

                {("gestationWeeks" in obsHistoryData ||
                  "gestationDays" in obsHistoryData) && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      Gestation&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {"gestationWeeks" in obsHistoryData
                        ? `${obsHistoryData?.gestationWeeks}W`
                        : ""}
                      {"gestationWeeks" in obsHistoryData &&
                      "gestationDays" in obsHistoryData
                        ? `,`
                        : ``}
                      {"gestationDays" in obsHistoryData
                        ? `${obsHistoryData?.gestationDays}D`
                        : ""}
                    </Text>
                  </>
                )}

                {"blood" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      &nbsp;{"\n"}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blood
                      group&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {obsHistoryData?.blood}
                    </Text>
                    {("husbandsBlood" in obsHistoryData ||
                      "consang" in obsHistoryData ||
                      "maritialStatus" in obsHistoryData ||
                      "marriageDurationYears" in obsHistoryData ||
                      "marriageDurationMonths" in obsHistoryData) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                        }}
                      >
                        &nbsp;|&nbsp;
                      </Text>
                    )}
                  </>
                )}

                {"husbandsBlood" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      Husband's blood group&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {obsHistoryData?.husbandsBlood}
                    </Text>
                    {("consang" in obsHistoryData ||
                      "maritialStatus" in obsHistoryData ||
                      "marriageDurationYears" in obsHistoryData ||
                      "marriageDurationMonths" in obsHistoryData) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                        }}
                      >
                        &nbsp;|&nbsp;
                      </Text>
                    )}
                  </>
                )}

                {"consang" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      Consanguineous&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {Boolean(obsHistoryData?.consang) ? `Yes` : `No`}
                    </Text>
                    {("maritialStatus" in obsHistoryData ||
                      "marriageDurationYears" in obsHistoryData ||
                      "marriageDurationMonths" in obsHistoryData) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                        }}
                      >
                        &nbsp;|&nbsp;
                      </Text>
                    )}
                  </>
                )}

                {"maritialStatus" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      Marital status&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {obsHistoryData?.maritialStatus}
                    </Text>
                    {("marriageDurationYears" in obsHistoryData ||
                      "marriageDurationMonths" in obsHistoryData) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                        }}
                      >
                        &nbsp;|&nbsp;
                      </Text>
                    )}
                  </>
                )}

                {("marriageDurationYears" in obsHistoryData ||
                  "marriageDurationMonths" in obsHistoryData) && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      Marriage duration&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {"marriageDurationYears" in obsHistoryData
                        ? obsHistoryData?.marriageDurationYears
                        : ``}
                      {"marriageDurationYears" in obsHistoryData &&
                      "marriageDurationMonths" in obsHistoryData
                        ? `.`
                        : ``}
                      {"marriageDurationMonths" in obsHistoryData
                        ? obsHistoryData?.marriageDurationMonths
                        : ``}
                      {"marriageDurationYears" in obsHistoryData &&
                      "marriageDurationMonths" in obsHistoryData
                        ? ` years`
                        : "marriageDurationYears" in obsHistoryData &&
                          !obsHistoryData.hasOwnProperty(
                            "marriageDurationMonths"
                          )
                        ? ` years`
                        : !obsHistoryData.hasOwnProperty(
                            "marriageDurationYears"
                          ) && "marriageDurationMonths" in obsHistoryData
                        ? ` months`
                        : ``}
                    </Text>
                  </>
                )}

                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  )
                </Text>
              </>
            )}
          </Text>
        </View>
      )}

      {options?.includes("gplae") && (
        <View>
          <Text style={{ lineHeight: 1.4 }}>
            {("gravidity" in obsHistoryData ||
              "parity" in obsHistoryData ||
              "livingChildren" in obsHistoryData ||
              "abortion" in obsHistoryData ||
              "ectopicPregnancies" in obsHistoryData ||
              "diagnosisNotes" in obsHistoryData) && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  &nbsp;{obsListViewCounter++}.&nbsp;GPLAE&nbsp;:
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  &nbsp;{"\n"}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;
                </Text>

                {"gravidity" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      Gravida&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {(obsHistoryData?.gravidity)?.toString().padStart(2, "0")}
                    </Text>
                    {("parity" in obsHistoryData ||
                      "livingChildren" in obsHistoryData ||
                      "abortion" in obsHistoryData ||
                      "ectopicPregnancies" in obsHistoryData ||
                      "diagnosisNotes" in obsHistoryData) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                        }}
                      >
                        &nbsp;|&nbsp;
                      </Text>
                    )}
                  </>
                )}

                {"parity" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      Para&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {(obsHistoryData?.parity)?.toString().padStart(2, "0")}
                    </Text>
                    {("livingChildren" in obsHistoryData ||
                      "abortion" in obsHistoryData ||
                      "ectopicPregnancies" in obsHistoryData ||
                      "diagnosisNotes" in obsHistoryData) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                        }}
                      >
                        &nbsp;|&nbsp;
                      </Text>
                    )}
                  </>
                )}

                {"livingChildren" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      Living&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {(obsHistoryData?.livingChildren)
                        ?.toString()
                        .padStart(2, "0")}
                    </Text>
                    {("abortion" in obsHistoryData ||
                      "ectopicPregnancies" in obsHistoryData ||
                      "diagnosisNotes" in obsHistoryData) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                        }}
                      >
                        &nbsp;|&nbsp;
                      </Text>
                    )}
                  </>
                )}

                {"abortion" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      Abortion&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {(obsHistoryData?.abortion)?.toString().padStart(2, "0")}
                    </Text>
                    {("ectopicPregnancies" in obsHistoryData ||
                      "diagnosisNotes" in obsHistoryData) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                        }}
                      >
                        &nbsp;|&nbsp;
                      </Text>
                    )}
                  </>
                )}

                {"ectopicPregnancies" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      Ectopic&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {(obsHistoryData?.ectopicPregnancies)
                        ?.toString()
                        .padStart(2, "0")}
                    </Text>
                    {"diagnosisNotes" in obsHistoryData && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 400,
                        }}
                      >
                        &nbsp;|&nbsp;
                      </Text>
                    )}
                  </>
                )}
                {"diagnosisNotes" in obsHistoryData && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      Notes&nbsp;:&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {obsHistoryData?.diagnosisNotes}
                    </Text>
                  </>
                )}
              </>
            )}
          </Text>
        </View>
      )}

      {options?.includes("history") && (
        <View>
          <Text style={{ lineHeight: 1.4 }}>
            {obsHistoryData?.pregnancyHistory.length > 0 && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  &nbsp;{obsListViewCounter++}.&nbsp;Pregnancy history&nbsp;:
                </Text>

                {obsHistoryData?.pregnancyHistory.map((item, i) => {
                  return (
                    <View key={i}>
                      {("outcome" in item ||
                        "termLength" in item ||
                        "deliveryMode" in item ||
                        "gestationPeriod" in item ||
                        "location" in item ||
                        "modeOfManagement" in item ||
                        "typeOfAbortion" in item ||
                        "modeOfAbortion" in item ||
                        "dateOfDelivery" in item ||
                        "gender" in item ||
                        "babysWeight" in item ||
                        "remarks" in item) && (
                        <>
                          <Text
                            style={{
                              color: "#171725",
                              fontFamily:
                                printSettings?.page_format?.font_family,
                              fontSize:
                                PX_TO_PT *
                                printSettings?.page_format?.font_size,
                              fontWeight: 500,
                            }}
                          >
                            &nbsp;{"\n"}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            {String.fromCharCode(97 + i)}.&nbsp;
                          </Text>

                          {"gravidaNumber" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                Gravida&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {(item?.gravidaNumber)
                                  ?.toString()
                                  .padStart(2, "0")}
                              </Text>
                            </>
                          )}

                          <Text
                            style={{
                              color: "#171725",
                              fontFamily:
                                printSettings?.page_format?.font_family,
                              fontSize:
                                PX_TO_PT *
                                printSettings?.page_format?.font_size,
                              fontWeight: 500,
                            }}
                          >
                            &nbsp;(
                          </Text>

                          {"outcome" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                Outcome&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {item?.outcome}
                              </Text>
                              {("termLength" in item ||
                                "deliveryMode" in item ||
                                "gestationPeriod" in item ||
                                "location" in item ||
                                "modeOfManagement" in item ||
                                "typeOfAbortion" in item ||
                                "modeOfAbortion" in item ||
                                "dateOfDelivery" in item ||
                                "gender" in item ||
                                "babysWeight" in item ||
                                "remarks" in item) && (
                                <Text
                                  style={{
                                    color: "#171725",
                                    fontFamily:
                                      printSettings?.page_format?.font_family,
                                    fontSize:
                                      PX_TO_PT *
                                      printSettings?.page_format?.font_size,
                                    fontWeight: 400,
                                  }}
                                >
                                  &nbsp;|&nbsp;
                                </Text>
                              )}
                            </>
                          )}

                          {"termLength" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                Term length&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {item?.termLength}
                              </Text>
                              {("deliveryMode" in item ||
                                "gestationPeriod" in item ||
                                "location" in item ||
                                "modeOfManagement" in item ||
                                "typeOfAbortion" in item ||
                                "modeOfAbortion" in item ||
                                "dateOfDelivery" in item ||
                                "gender" in item ||
                                "babysWeight" in item ||
                                "remarks" in item) && (
                                <Text
                                  style={{
                                    color: "#171725",
                                    fontFamily:
                                      printSettings?.page_format?.font_family,
                                    fontSize:
                                      PX_TO_PT *
                                      printSettings?.page_format?.font_size,
                                    fontWeight: 400,
                                  }}
                                >
                                  &nbsp;|&nbsp;
                                </Text>
                              )}
                            </>
                          )}

                          {"deliveryMode" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                Delivery mode&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {item?.deliveryMode}
                              </Text>
                              {("gestationPeriod" in item ||
                                "location" in item ||
                                "modeOfManagement" in item ||
                                "typeOfAbortion" in item ||
                                "modeOfAbortion" in item ||
                                "dateOfDelivery" in item ||
                                "gender" in item ||
                                "babysWeight" in item ||
                                "remarks" in item) && (
                                <Text
                                  style={{
                                    color: "#171725",
                                    fontFamily:
                                      printSettings?.page_format?.font_family,
                                    fontSize:
                                      PX_TO_PT *
                                      printSettings?.page_format?.font_size,
                                    fontWeight: 400,
                                  }}
                                >
                                  &nbsp;|&nbsp;
                                </Text>
                              )}
                            </>
                          )}

                          {"gestationPeriod" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                Period of gestation&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {item?.gestationPeriod}{" "}
                                {Number(item?.gestationPeriod) > 1
                                  ? `weeks`
                                  : `week`}
                              </Text>
                              {("location" in item ||
                                "modeOfManagement" in item ||
                                "typeOfAbortion" in item ||
                                "modeOfAbortion" in item ||
                                "dateOfDelivery" in item ||
                                "gender" in item ||
                                "babysWeight" in item ||
                                "remarks" in item) && (
                                <Text
                                  style={{
                                    color: "#171725",
                                    fontFamily:
                                      printSettings?.page_format?.font_family,
                                    fontSize:
                                      PX_TO_PT *
                                      printSettings?.page_format?.font_size,
                                    fontWeight: 400,
                                  }}
                                >
                                  &nbsp;|&nbsp;
                                </Text>
                              )}
                            </>
                          )}

                          {"location" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                Location&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {item?.location}
                              </Text>
                              {("modeOfManagement" in item ||
                                "typeOfAbortion" in item ||
                                "modeOfAbortion" in item ||
                                "dateOfDelivery" in item ||
                                "gender" in item ||
                                "babysWeight" in item ||
                                "remarks" in item) && (
                                <Text
                                  style={{
                                    color: "#171725",
                                    fontFamily:
                                      printSettings?.page_format?.font_family,
                                    fontSize:
                                      PX_TO_PT *
                                      printSettings?.page_format?.font_size,
                                    fontWeight: 400,
                                  }}
                                >
                                  &nbsp;|&nbsp;
                                </Text>
                              )}
                            </>
                          )}

                          {"modeOfManagement" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                Management mode&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {item?.modeOfManagement}
                              </Text>
                              {("typeOfAbortion" in item ||
                                "modeOfAbortion" in item ||
                                "dateOfDelivery" in item ||
                                "gender" in item ||
                                "babysWeight" in item ||
                                "remarks" in item) && (
                                <Text
                                  style={{
                                    color: "#171725",
                                    fontFamily:
                                      printSettings?.page_format?.font_family,
                                    fontSize:
                                      PX_TO_PT *
                                      printSettings?.page_format?.font_size,
                                    fontWeight: 400,
                                  }}
                                >
                                  &nbsp;|&nbsp;
                                </Text>
                              )}
                            </>
                          )}

                          {"typeOfAbortion" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                Type of abortion&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {item?.typeOfAbortion}
                              </Text>
                              {("modeOfAbortion" in item ||
                                "dateOfDelivery" in item ||
                                "gender" in item ||
                                "babysWeight" in item ||
                                "remarks" in item) && (
                                <Text
                                  style={{
                                    color: "#171725",
                                    fontFamily:
                                      printSettings?.page_format?.font_family,
                                    fontSize:
                                      PX_TO_PT *
                                      printSettings?.page_format?.font_size,
                                    fontWeight: 400,
                                  }}
                                >
                                  &nbsp;|&nbsp;
                                </Text>
                              )}
                            </>
                          )}

                          {"modeOfAbortion" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                Mode of abortion&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {item?.modeOfAbortion}
                              </Text>
                              {("dateOfDelivery" in item ||
                                "gender" in item ||
                                "babysWeight" in item ||
                                "remarks" in item) && (
                                <Text
                                  style={{
                                    color: "#171725",
                                    fontFamily:
                                      printSettings?.page_format?.font_family,
                                    fontSize:
                                      PX_TO_PT *
                                      printSettings?.page_format?.font_size,
                                    fontWeight: 400,
                                  }}
                                >
                                  &nbsp;|&nbsp;
                                </Text>
                              )}
                            </>
                          )}

                          {"dateOfDelivery" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                &nbsp;{"\n"}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date
                                of delivery&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {moment(item?.dateOfDelivery).format(
                                  "DD MMM YYYY"
                                )}
                              </Text>
                              {("gender" in item ||
                                "babysWeight" in item ||
                                "remarks" in item) && (
                                <Text
                                  style={{
                                    color: "#171725",
                                    fontFamily:
                                      printSettings?.page_format?.font_family,
                                    fontSize:
                                      PX_TO_PT *
                                      printSettings?.page_format?.font_size,
                                    fontWeight: 400,
                                  }}
                                >
                                  &nbsp;|&nbsp;
                                </Text>
                              )}
                            </>
                          )}

                          {"gender" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                Gender&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {item?.gender}
                              </Text>
                              {("babysWeight" in item || "remarks" in item) && (
                                <Text
                                  style={{
                                    color: "#171725",
                                    fontFamily:
                                      printSettings?.page_format?.font_family,
                                    fontSize:
                                      PX_TO_PT *
                                      printSettings?.page_format?.font_size,
                                    fontWeight: 400,
                                  }}
                                >
                                  &nbsp;|&nbsp;
                                </Text>
                              )}
                            </>
                          )}

                          {"babysWeight" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                Baby's weight&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {item?.babysWeight}
                                {`kgs`}
                              </Text>
                              {"remarks" in item && (
                                <Text
                                  style={{
                                    color: "#171725",
                                    fontFamily:
                                      printSettings?.page_format?.font_family,
                                    fontSize:
                                      PX_TO_PT *
                                      printSettings?.page_format?.font_size,
                                    fontWeight: 400,
                                  }}
                                >
                                  &nbsp;|&nbsp;
                                </Text>
                              )}
                            </>
                          )}

                          {"remarks" in item && (
                            <>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 500,
                                }}
                              >
                                &nbsp;{"\n"}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Remarks&nbsp;:&nbsp;
                              </Text>
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                {item?.remarks}
                              </Text>
                            </>
                          )}
                          <Text
                            style={{
                              color: "#171725",
                              fontFamily:
                                printSettings?.page_format?.font_family,
                              fontSize:
                                PX_TO_PT *
                                printSettings?.page_format?.font_size,
                              fontWeight: 500,
                            }}
                          >
                            )
                          </Text>
                        </>
                      )}
                    </View>
                  );
                })}
              </>
            )}
          </Text>
        </View>
      )}

      {options?.includes("examination") && (
        <View>
          <Text style={{ lineHeight: 1.4 }}>
            <Text
              style={{
                color: "#171725",
                fontFamily: printSettings?.page_format?.font_family,
                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                fontWeight: 500,
              }}
            >
              &nbsp;{obsListViewCounter++}.&nbsp;Examination&nbsp;:
            </Text>

            {obsHistoryData?.examinationHistory.map((item, i) => (
              <View key={i}>
                {("pallor" in item ||
                  "oedema" in item ||
                  "mothersBMI" in item ||
                  "diastolic" in item ||
                  "systolic" in item ||
                  "heightOfFundus" in item ||
                  "presentation" in item ||
                  "foetalHeartRate" in item ||
                  "fluidIndex" in item ||
                  "notes" in item) && (
                  <>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      &nbsp;{"\n"}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </Text>

                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 500,
                      }}
                    >
                      Visit&nbsp;
                    </Text>
                    <Text
                      style={{
                        color: "#171725",
                        fontFamily: printSettings?.page_format?.font_family,
                        fontSize:
                          PX_TO_PT * printSettings?.page_format?.font_size,
                        fontWeight: 400,
                      }}
                    >
                      {i + 1}
                    </Text>

                    {("pallor" in item ||
                      "oedema" in item ||
                      "mothersBMI" in item) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 500,
                        }}
                      >
                        &nbsp;(
                      </Text>
                    )}

                    {"pallor" in item && (
                      <>
                        <Text
                          style={{
                            color: "#171725",
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                          }}
                        >
                          Pallor&nbsp;:&nbsp;
                        </Text>
                        <Text
                          style={{
                            color: "#171725",
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 400,
                          }}
                        >
                          {Boolean(item?.pallor) ? `Yes` : `No`}
                        </Text>
                        {("oedema" in item || "mothersBMI" in item) && (
                          <Text
                            style={{
                              color: "#171725",
                              fontFamily:
                                printSettings?.page_format?.font_family,
                              fontSize:
                                PX_TO_PT *
                                printSettings?.page_format?.font_size,
                              fontWeight: 400,
                            }}
                          >
                            &nbsp;|&nbsp;
                          </Text>
                        )}
                      </>
                    )}

                    {"oedema" in item && (
                      <>
                        <Text
                          style={{
                            color: "#171725",
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                          }}
                        >
                          Oedema&nbsp;:&nbsp;
                        </Text>
                        <Text
                          style={{
                            color: "#171725",
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 400,
                          }}
                        >
                          {Boolean(item?.oedema) ? `Yes` : `No`}
                        </Text>
                        {"mothersBMI" in item && (
                          <Text
                            style={{
                              color: "#171725",
                              fontFamily:
                                printSettings?.page_format?.font_family,
                              fontSize:
                                PX_TO_PT *
                                printSettings?.page_format?.font_size,
                              fontWeight: 400,
                            }}
                          >
                            &nbsp;|&nbsp;
                          </Text>
                        )}
                      </>
                    )}

                    {"mothersBMI" in item && (
                      <>
                        <Text
                          style={{
                            color: "#171725",
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                          }}
                        >
                          Mother's BMI&nbsp;:&nbsp;
                        </Text>
                        <Text
                          style={{
                            color: "#171725",
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 400,
                          }}
                        >
                          {item?.mothersBMI}
                          {`kg/m2`}
                        </Text>
                      </>
                    )}

                    {("pallor" in item ||
                      "oedema" in item ||
                      "mothersBMI" in item) && (
                      <Text
                        style={{
                          color: "#171725",
                          fontFamily: printSettings?.page_format?.font_family,
                          fontSize:
                            PX_TO_PT * printSettings?.page_format?.font_size,
                          fontWeight: 500,
                        }}
                      >
                        )
                      </Text>
                    )}

                    {("diastolic" in item ||
                      "systolic" in item ||
                      "heightOfFundus" in item ||
                      "presentation" in item ||
                      "foetalHeartRate" in item ||
                      "fluidIndex" in item ||
                      "notes" in item) && (
                      <>
                        <Text
                          style={{
                            color: "#171725",
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                          }}
                        >
                          ,&nbsp;(
                        </Text>

                        {("diastolic" in item || "systolic" in item) && (
                          <>
                            <Text
                              style={{
                                color: "#171725",
                                fontFamily:
                                  printSettings?.page_format?.font_family,
                                fontSize:
                                  PX_TO_PT *
                                  printSettings?.page_format?.font_size,
                                fontWeight: 500,
                              }}
                            >
                              BP&nbsp;:&nbsp;
                            </Text>
                            <Text
                              style={{
                                color: "#171725",
                                fontFamily:
                                  printSettings?.page_format?.font_family,
                                fontSize:
                                  PX_TO_PT *
                                  printSettings?.page_format?.font_size,
                                fontWeight: 400,
                              }}
                            >
                              {item?.diastolic}
                              {"diastolic" in item && "systolic" in item
                                ? `/`
                                : ``}
                              {item?.systolic}
                              {` mmHg`}
                            </Text>
                          </>
                        )}

                        {"heightOfFundus" in item && (
                          <>
                            <Text
                              style={{
                                color: "#171725",
                                fontFamily:
                                  printSettings?.page_format?.font_family,
                                fontSize:
                                  PX_TO_PT *
                                  printSettings?.page_format?.font_size,
                                fontWeight: 500,
                              }}
                            >
                              &nbsp;{"\n"}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fundus
                              height&nbsp;:&nbsp;
                            </Text>
                            <Text
                              style={{
                                color: "#171725",
                                fontFamily:
                                  printSettings?.page_format?.font_family,
                                fontSize:
                                  PX_TO_PT *
                                  printSettings?.page_format?.font_size,
                                fontWeight: 400,
                              }}
                            >
                              {item?.heightOfFundus}
                              {item?.heightOfFundusUnit}
                            </Text>
                            {("presentation" in item ||
                              "foetalHeartRate" in item ||
                              "fluidIndex" in item ||
                              "notes" in item) && (
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                &nbsp;|&nbsp;
                              </Text>
                            )}
                          </>
                        )}

                        {"presentation" in item && (
                          <>
                            <Text
                              style={{
                                color: "#171725",
                                fontFamily:
                                  printSettings?.page_format?.font_family,
                                fontSize:
                                  PX_TO_PT *
                                  printSettings?.page_format?.font_size,
                                fontWeight: 500,
                              }}
                            >
                              Presentation&nbsp;:&nbsp;
                            </Text>
                            <Text
                              style={{
                                color: "#171725",
                                fontFamily:
                                  printSettings?.page_format?.font_family,
                                fontSize:
                                  PX_TO_PT *
                                  printSettings?.page_format?.font_size,
                                fontWeight: 400,
                              }}
                            >
                              {item?.presentation}
                            </Text>
                            {("foetalHeartRate" in item ||
                              "fluidIndex" in item ||
                              "notes" in item) && (
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                &nbsp;|&nbsp;
                              </Text>
                            )}
                          </>
                        )}

                        {"foetalHeartRate" in item && (
                          <>
                            <Text
                              style={{
                                color: "#171725",
                                fontFamily:
                                  printSettings?.page_format?.font_family,
                                fontSize:
                                  PX_TO_PT *
                                  printSettings?.page_format?.font_size,
                                fontWeight: 500,
                              }}
                            >
                              Fetal heart rate&nbsp;:&nbsp;
                            </Text>
                            <Text
                              style={{
                                color: "#171725",
                                fontFamily:
                                  printSettings?.page_format?.font_family,
                                fontSize:
                                  PX_TO_PT *
                                  printSettings?.page_format?.font_size,
                                fontWeight: 400,
                              }}
                            >
                              {item?.foetalHeartRate}
                              {` BPM`}
                            </Text>
                            {("fluidIndex" in item || "notes" in item) && (
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                &nbsp;|&nbsp;
                              </Text>
                            )}
                          </>
                        )}

                        {"fluidIndex" in item && (
                          <>
                            <Text
                              style={{
                                color: "#171725",
                                fontFamily:
                                  printSettings?.page_format?.font_family,
                                fontSize:
                                  PX_TO_PT *
                                  printSettings?.page_format?.font_size,
                                fontWeight: 500,
                              }}
                            >
                              Fluid index&nbsp;:&nbsp;
                            </Text>
                            <Text
                              style={{
                                color: "#171725",
                                fontFamily:
                                  printSettings?.page_format?.font_family,
                                fontSize:
                                  PX_TO_PT *
                                  printSettings?.page_format?.font_size,
                                fontWeight: 400,
                              }}
                            >
                              {item?.fluidIndex}
                              {`cm`}
                            </Text>
                            {"notes" in item && (
                              <Text
                                style={{
                                  color: "#171725",
                                  fontFamily:
                                    printSettings?.page_format?.font_family,
                                  fontSize:
                                    PX_TO_PT *
                                    printSettings?.page_format?.font_size,
                                  fontWeight: 400,
                                }}
                              >
                                &nbsp;|&nbsp;
                              </Text>
                            )}
                          </>
                        )}

                        {"notes" in item && (
                          <>
                            <Text
                              style={{
                                color: "#171725",
                                fontFamily:
                                  printSettings?.page_format?.font_family,
                                fontSize:
                                  PX_TO_PT *
                                  printSettings?.page_format?.font_size,
                                fontWeight: 500,
                              }}
                            >
                              Notes&nbsp;:&nbsp;
                            </Text>
                            <Text
                              style={{
                                color: "#171725",
                                fontFamily:
                                  printSettings?.page_format?.font_family,
                                fontSize:
                                  PX_TO_PT *
                                  printSettings?.page_format?.font_size,
                                fontWeight: 400,
                              }}
                            >
                              {item?.notes}
                            </Text>
                          </>
                        )}
                        <Text
                          style={{
                            color: "#171725",
                            fontFamily: printSettings?.page_format?.font_family,
                            fontSize:
                              PX_TO_PT * printSettings?.page_format?.font_size,
                            fontWeight: 500,
                          }}
                        >
                          )
                        </Text>
                      </>
                    )}
                  </>
                )}
              </View>
            ))}
          </Text>
        </View>
      )}
    </View>
  );
}

export default ObsHistoryListView;
