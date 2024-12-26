import React from "react";

const mockAncScheduler = [
  {
    id: 1,
    title: "Dating and viability Pregnancy",
    dueDate: "14/01/2024",
    status: "Due",
    description: "Lorem ipsum dolor sit amet",
  },
  {
    id: 2,
    title: "Nuchal Translucency",
    dueDate: "22/04/2023",
    status: "Given",
    description: "Lorem ipsum dolor sit amet",
  },
  {
    id: 2,
    title: "Anomaly Scan",
    dueDate: "22/04/2023",
    status: "Due",
    description: "Lorem ipsum dolor sit amet",
  },
  {
    id: 2,
    title: "Fetal Echo Scan",
    dueDate: "22/04/2023",
    status: "Due",
    description: "Lorem ipsum dolor sit amet",
  },
];

const mockImmunisationVaccine = [
  {
    id: 1,
    title: "Td/TT",
    status: "Due",
    description: "Lorem ipsum dolor sit amet",
  },
  {
    id: 2,
    title: "Flue Vaccine",
    status: "Given",
    description: "Lorem ipsum dolor sit amet",
  },
  {
    id: 3,
    title: "Tdap",
    status: "Due",
    description: "Lorem ipsum dolor sit amet",
  },
];

const AncImmunisationList = ({ handleDrawerObstetric }) => {
  return (
    <div>
      {mockAncScheduler?.length > 0 && (
        <div
          className="cardbody-data border rounded"
          style={{ padding: "0 14px", marginTop: "8px" }}
        >
          <div className="mt-2 d-flex flex-column">
            <div className="d-flex justify-content-between">
              <div style={{ fontWeight: 600, marginBottom: 14 }}>
                ANC Scheduler
              </div>
              <div>
                <i
                  className="icon-Edit me-1 fs-5"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDrawerObstetric("ancScheduler")}
                />
              </div>
            </div>
            <ol
              style={{
                listStyle: "none",
                fontSize: 12,
                fontWeight: 500,
                paddingLeft: 0,
              }}
            >
              {mockAncScheduler?.map((item, index) => (
                <li key={index} style={{ fontWeight: 400 }}>
                  <span style={{ fontWeight: 500 }}>{index + 1}. </span>
                  <span style={{ fontWeight: 500 }}>{item.title}</span> (Due
                  Date from {item.dueDate}, {item.status}, {item.description})
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {mockImmunisationVaccine?.length > 0 && (
        <div
          className="cardbody-data border rounded"
          style={{ padding: "0 14px", marginTop: "8px" }}
        >
          <div className="mt-2 d-flex flex-column">
            <div className="d-flex justify-content-between">
              <div style={{ fontWeight: 600, marginBottom: 14 }}>
                Immunization Vaccines
              </div>
              <div>
                <i
                  className="icon-Edit me-1 fs-5"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDrawerObstetric("immunizationHistory")}
                />
              </div>
            </div>
            <ol
              style={{
                listStyle: "none",
                fontSize: 12,
                fontWeight: 500,
                paddingLeft: 0,
              }}
            >
              {mockImmunisationVaccine?.map((item, index) => (
                <li key={index} style={{ fontWeight: 400 }}>
                  <span style={{ fontWeight: 500 }}>{index + 1}. </span>
                  <span style={{ fontWeight: 500 }}>{item.title}</span> (
                  {item.status}, {item.description})
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
export default React.memo(AncImmunisationList);
