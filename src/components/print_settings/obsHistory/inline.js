import React from "react";
import moment from "moment";
import { Text, View } from "@react-pdf/renderer";

function ObsHistoryInlineView({ PX_TO_PT, printSettings, obsHistoryData }) {
  let obsInlineViewCounter = 1;

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

      <Text style={{ marginTop: PX_TO_PT * 6, lineHeight: 1.4 }}>
        {(obsHistoryData?.lmp ||
          obsHistoryData?.edd ||
          obsHistoryData?.ceed ||
          obsHistoryData?.gestationWeeks ||
          obsHistoryData?.gestationDays ||
          obsHistoryData?.blood ||
          obsHistoryData?.husbandsBlood ||
          obsHistoryData?.consang ||
          obsHistoryData?.maritialStatus) && (
          <>
            <Text
              style={{
                color: "#171725",
                fontFamily: printSettings?.page_format?.font_family,
                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                fontWeight: 500,
              }}
            >
              {obsInlineViewCounter++}.&nbsp;Patient diagnosis&nbsp;
            </Text>
            <Text
              style={{
                color: "#171725",
                fontFamily: printSettings?.page_format?.font_family,
                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                fontWeight: 500,
              }}
            >
              (
            </Text>
            {obsHistoryData?.lmp && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  LMP&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {moment(obsHistoryData?.lmp).format("DD MMM YYYY")}
                </Text>

                {(obsHistoryData?.edd ||
                  obsHistoryData?.ceed ||
                  obsHistoryData?.gestationWeeks ||
                  obsHistoryData?.gestationDays ||
                  obsHistoryData?.blood ||
                  obsHistoryData?.husbandsBlood ||
                  obsHistoryData?.consang ||
                  obsHistoryData?.maritialStatus) && (
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

            {obsHistoryData?.edd && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  E.D.D.&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {moment(obsHistoryData?.edd).format("DD MMM YYYY")}
                </Text>
                {(obsHistoryData?.ceed ||
                  obsHistoryData?.gestationWeeks ||
                  obsHistoryData?.gestationDays ||
                  obsHistoryData?.blood ||
                  obsHistoryData?.husbandsBlood ||
                  obsHistoryData?.consang ||
                  obsHistoryData?.maritialStatus) && (
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

            {obsHistoryData?.ceed && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  C.E.D.D.&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {moment(obsHistoryData?.ceed).format("DD MMM YYYY")}
                </Text>
                {(obsHistoryData?.gestationWeeks ||
                  obsHistoryData?.gestationDays ||
                  obsHistoryData?.blood ||
                  obsHistoryData?.husbandsBlood ||
                  obsHistoryData?.consang ||
                  obsHistoryData?.maritialStatus) && (
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

            {(Boolean(obsHistoryData?.gestationWeeks) ||
              Boolean(obsHistoryData?.gestationDays)) && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  Gestation&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {obsHistoryData?.gestationWeeks
                    ? `${obsHistoryData?.gestationWeeks}W`
                    : ""}
                  {obsHistoryData?.gestationWeeks &&
                  obsHistoryData?.gestationDays
                    ? `,`
                    : ``}
                  {obsHistoryData?.gestationDays
                    ? `${obsHistoryData?.gestationDays}D`
                    : ""}
                </Text>
              </>
            )}

            {obsHistoryData?.blood && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  &nbsp;{"\n"}
                  &nbsp;&nbsp;&nbsp;&nbsp;Blood group&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {obsHistoryData?.blood}
                </Text>
                {(obsHistoryData?.husbandsBlood ||
                  obsHistoryData?.consang ||
                  obsHistoryData?.maritialStatus) && (
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

            {obsHistoryData?.husbandsBlood && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  Husband's blood group&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {obsHistoryData?.husbandsBlood}
                </Text>
                {(obsHistoryData?.consang ||
                  obsHistoryData?.maritialStatus) && (
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

            {obsHistoryData?.consang && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  Consanguineous&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {Boolean(obsHistoryData?.consang) ? `Yes` : `No`}
                </Text>
                {obsHistoryData?.maritialStatus && (
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

            {obsHistoryData?.maritialStatus && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  Marital status&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {obsHistoryData?.maritialStatus}
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

      <Text style={{ marginTop: PX_TO_PT * 6, lineHeight: 1.4 }}>
        {(obsHistoryData?.gravidity ||
          obsHistoryData?.parity ||
          obsHistoryData?.livingChildren ||
          obsHistoryData?.abortion ||
          obsHistoryData?.ectopicPregnancies) && (
          <>
            <Text
              style={{
                color: "#171725",
                fontFamily: printSettings?.page_format?.font_family,
                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                fontWeight: 500,
              }}
            >
              {obsInlineViewCounter++}.&nbsp;GPLAE&nbsp;
            </Text>
            <Text
              style={{
                color: "#171725",
                fontFamily: printSettings?.page_format?.font_family,
                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                fontWeight: 500,
              }}
            >
              (
            </Text>

            {obsHistoryData?.gravidity && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  Gravida&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {(obsHistoryData?.gravidity).toString().padStart(2, "0")}
                </Text>
                {(obsHistoryData?.parity ||
                  obsHistoryData?.livingChildren ||
                  obsHistoryData?.abortion ||
                  obsHistoryData?.ectopicPregnancies) && (
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

            {obsHistoryData?.parity && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  Para&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {(obsHistoryData?.parity).toString().padStart(2, "0")}
                </Text>
                {(obsHistoryData?.livingChildren ||
                  obsHistoryData?.abortion ||
                  obsHistoryData?.ectopicPregnancies) && (
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

            {obsHistoryData?.livingChildren && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  Living&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {(obsHistoryData?.livingChildren).toString().padStart(2, "0")}
                </Text>
                {(obsHistoryData?.abortion ||
                  obsHistoryData?.ectopicPregnancies) && (
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

            {obsHistoryData?.abortion && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  Abortion&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {(obsHistoryData?.abortion).toString().padStart(2, "0")}
                </Text>
                {obsHistoryData?.ectopicPregnancies && (
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

            {obsHistoryData?.ectopicPregnancies && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  Ectopic&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {(obsHistoryData?.ectopicPregnancies)
                    .toString()
                    .padStart(2, "0")}
                </Text>
                {obsHistoryData?.diagnosisNotes && (
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

            {obsHistoryData?.diagnosisNotes && (
              <>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 500,
                  }}
                >
                  Notes&nbsp;:&nbsp;
                </Text>
                <Text
                  style={{
                    color: "#171725",
                    fontFamily: printSettings?.page_format?.font_family,
                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                    fontWeight: 400,
                  }}
                >
                  {obsHistoryData?.diagnosisNotes}
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

      <Text style={{ marginTop: PX_TO_PT * 6, lineHeight: 1.4 }}>
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
              {obsInlineViewCounter++}.&nbsp;Pregancy history
            </Text>

            {obsHistoryData?.pregnancyHistory.map((item, i) => (
              <View key={i}>
                {(item?.gravidaNumber ||
                  item?.outcome ||
                  item?.termLength ||
                  item?.deliveryMode ||
                  item?.gestationPeriod ||
                  item?.location ||
                  item?.modeOfManagement ||
                  item?.typeOfAbortion ||
                  item?.modeOfAbortion ||
                  item?.dateOfDelivery ||
                  item?.gender ||
                  item?.babysWeight ||
                  item?.remarks) && (
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
                      <>
                        {i > 0 ? (
                          <Text style={{ marginTop: 15 }}>
                            &nbsp;{`\n`}
                            &nbsp;&nbsp;&nbsp;&nbsp;(
                          </Text>
                        ) : (
                          <Text>&nbsp;(</Text>
                        )}
                      </>
                    </Text>

                    {item?.gravidaNumber && (
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
                          Gravida number&nbsp;:&nbsp;
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
                          {(item?.gravidaNumber).toString().padStart(2, "0")}
                        </Text>
                        {(item?.outcome ||
                          item?.termLength ||
                          item?.deliveryMode ||
                          item?.gestationPeriod ||
                          item?.location ||
                          item?.modeOfManagement ||
                          item?.typeOfAbortion ||
                          item?.modeOfAbortion ||
                          item?.dateOfDelivery ||
                          item?.gender ||
                          item?.babysWeight ||
                          item?.remarks) && (
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

                    {item?.outcome && (
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
                          Outcome&nbsp;:&nbsp;
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
                          {item?.outcome}
                        </Text>
                        {(item?.termLength ||
                          item?.deliveryMode ||
                          item?.gestationPeriod ||
                          item?.location ||
                          item?.modeOfManagement ||
                          item?.typeOfAbortion ||
                          item?.modeOfAbortion ||
                          item?.dateOfDelivery ||
                          item?.gender ||
                          item?.babysWeight ||
                          item?.remarks) && (
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

                    {item?.termLength && (
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
                          Term length&nbsp;:&nbsp;
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
                          {item?.termLength}
                        </Text>
                        {(item?.deliveryMode ||
                          item?.gestationPeriod ||
                          item?.location ||
                          item?.modeOfManagement ||
                          item?.typeOfAbortion ||
                          item?.modeOfAbortion ||
                          item?.dateOfDelivery ||
                          item?.gender ||
                          obsHistoryData?.babysWeight ||
                          item?.remarks) && (
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

                    {item?.deliveryMode && (
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
                          Delivery mode&nbsp;:&nbsp;
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
                          {item?.deliveryMode}
                        </Text>
                        {(item?.gestationPeriod ||
                          item?.location ||
                          item?.modeOfManagement ||
                          item?.typeOfAbortion ||
                          item?.modeOfAbortion ||
                          item?.dateOfDelivery ||
                          item?.gender ||
                          item?.babysWeight ||
                          item?.remarks) && (
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

                    {item?.gestationPeriod && (
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
                          Period of gestation&nbsp;:&nbsp;
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
                          {item?.gestationPeriod}
                        </Text>
                        {(item?.location ||
                          item?.modeOfManagement ||
                          item?.typeOfAbortion ||
                          item?.modeOfAbortion ||
                          item?.dateOfDelivery ||
                          item?.gender ||
                          item?.babysWeight ||
                          item?.remarks) && (
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

                    {item?.location && (
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
                          Location&nbsp;:&nbsp;
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
                          {item?.location}
                        </Text>
                        {(item?.modeOfManagement ||
                          item?.typeOfAbortion ||
                          item?.modeOfAbortion ||
                          item?.dateOfDelivery ||
                          item?.gender ||
                          item?.babysWeight ||
                          item?.remarks) && (
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

                    {item?.modeOfManagement && (
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
                          Management mode&nbsp;:&nbsp;
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
                          {item?.modeOfManagement}
                        </Text>
                        {(item?.typeOfAbortion ||
                          item?.modeOfAbortion ||
                          item?.dateOfDelivery ||
                          item?.gender ||
                          item?.babysWeight ||
                          item?.remarks) && (
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

                    {item?.typeOfAbortion && (
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
                          Type of abortion&nbsp;:&nbsp;
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
                          {item?.typeOfAbortion}
                        </Text>
                        {(item?.modeOfAbortion ||
                          item?.dateOfDelivery ||
                          item?.gender ||
                          item?.babysWeight ||
                          item?.remarks) && (
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

                    {item?.modeOfAbortion && (
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
                          Mode of abortion&nbsp;:&nbsp;
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
                          {item?.modeOfAbortion}
                        </Text>
                      </>
                    )}

                    {item?.dateOfDelivery && (
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
                          &nbsp;&nbsp;&nbsp;&nbsp;Date of delivery&nbsp;:&nbsp;
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
                          {moment(item?.dateOfDelivery).format("DD MMM YYYY")}
                        </Text>
                        {(item?.gender ||
                          item?.babysWeight ||
                          item?.remarks) && (
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

                    {item?.gender && (
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
                          Gender&nbsp;:&nbsp;
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
                          {item?.gender}
                        </Text>
                        {(item?.babysWeight || item?.remarks) && (
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

                    {item?.babysWeight && (
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
                          Baby's weight&nbsp;:&nbsp;
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
                          {item?.babysWeight}
                          {`kgs`}
                        </Text>
                        {item?.remarks && (
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

                    {item?.remarks && (
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
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Remarks&nbsp;:&nbsp;
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
                          {item?.remarks}
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
              </View>
            ))}
          </>
        )}
      </Text>

      <Text style={{ marginTop: PX_TO_PT * 6, lineHeight: 1.4 }}>
        {obsHistoryData?.examinationHistory.length > 0 && (
          <>
            <Text
              style={{
                color: "#171725",
                fontFamily: printSettings?.page_format?.font_family,
                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                fontWeight: 500,
              }}
            >
              {obsInlineViewCounter++}.&nbsp;Examination
            </Text>
            {obsHistoryData?.examinationHistory.map((item, i) => (
              <View key={i}>
                {("pallor" in item ||
                  "oedema" in item ||
                  item?.mothersBMI ||
                  item?.diastolic ||
                  item?.systolic ||
                  item?.heightOfFundus ||
                  item?.presentation ||
                  item?.foetalHeartRate ||
                  item?.fluidIndex ||
                  item?.notes) && (
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
                      {("pallor" in item ||
                        "oedema" in item ||
                        item?.mothersBMI) && (
                        <>
                          {i > 0 ? (
                            <Text style={{ marginTop: 15 }}>
                              &nbsp;{`\n`}
                              &nbsp;&nbsp;&nbsp;&nbsp;(
                            </Text>
                          ) : (
                            <Text>&nbsp;(</Text>
                          )}
                        </>
                      )}
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
                      Visit&nbsp;:&nbsp;
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
                      {(i + 1).toString().padStart(2, "0")}
                    </Text>
                    {("pallor" in item ||
                      "oedema" in item ||
                      item?.mothersBMI) && (
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
                        {("oedema" in item || item?.mothersBMI) && (
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
                        {item?.mothersBMI && (
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

                    {item?.mothersBMI && (
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
                      item?.mothersBMI) && (
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

                    {(item?.diastolic ||
                      item?.systolic ||
                      item?.heightOfFundus ||
                      item?.presentation ||
                      item?.foetalHeartRate ||
                      item?.fluidIndex ||
                      item?.notes) && (
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

                        {(item?.diastolic || item?.systolic) && (
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
                              {item?.diastolic && item?.systolic ? `/` : ``}
                              {item?.systolic}
                              {` mmHg`}
                            </Text>
                          </>
                        )}

                        {item?.heightOfFundus && (
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
                              &nbsp;&nbsp;&nbsp;&nbsp;Fundus height&nbsp;:&nbsp;
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
                            {(item?.presentation ||
                              item?.foetalHeartRate ||
                              item?.fluidIndex ||
                              item?.notes) && (
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

                        {item?.presentation && (
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
                            {(item?.foetalHeartRate ||
                              item?.fluidIndex ||
                              item?.notes) && (
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

                        {item?.foetalHeartRate && (
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
                            {(item?.fluidIndex || item?.notes) && (
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

                        {item?.fluidIndex && (
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
                            {item?.notes && (
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

                        {item?.notes && (
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
          </>
        )}
      </Text>
    </View>
  );
}

export default ObsHistoryInlineView;
