import { Input, Radio } from "antd";
import CommonModal from "../../../../common/CommonModal";
import { Button } from "react-bootstrap";

const ServiceItemPopup = ({ popupType, onCancel, title, ancDetails }) => {
  return (
    <div>
      <CommonModal
        isModalOpen={true}
        onCancel={onCancel}
        modalWidth={500}
        title={title}
        modalBody={
          <>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex gap-5 align-items-center">
                <label
                  className="d-flex"
                  style={{ fontWeight: 500, width: 110 }}
                >
                  Name <span className="bdg-danger">*</span>
                </label>
                <Input value={"name"} style={{ height: 38 }} />
              </div>

              <div className="d-flex gap-5 align-items-center">
                <label
                  className="d-flex"
                  style={{ fontWeight: 500, width: 110 }}
                >
                  Price/Unit <span className="bdg-danger">*</span>
                </label>
                <Input
                  value={56}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  style={{ height: 38 }}
                  prefix={
                    <i style={{ fontFamily: "Roboto", fontSize: 14 }}>₹</i>
                  }
                />
              </div>

              <div className="d-flex gap-5 align-items-center">
                <label
                  className="d-flex"
                  style={{ fontWeight: 500, width: 110 }}
                >
                  GST
                </label>
                <Input
                  value={56}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  style={{ height: 38 }}
                  suffix={
                    <i style={{ fontFamily: "Roboto", fontSize: 14 }}>%</i>
                  }
                />
              </div>

              <div className="d-flex gap-5 align-items-center">
                <label
                  className="d-flex"
                  style={{ fontWeight: 500, width: 110 }}
                >
                  Discount
                </label>
                <Input
                  value={56}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  style={{ height: 38 }}
                  suffix={
                    <i style={{ fontFamily: "Roboto", fontSize: 14 }}>%</i>
                  }
                />
              </div>

              <div className="d-flex gap-5 align-items-center">
                <label
                  className="d-flex"
                  style={{ fontWeight: 500, width: 110 }}
                >
                  Type <span className="bdg-danger">*</span>
                </label>
                <Radio.Group
                  //    value={pastPregnancyData.gender}
                  style={{ display: "flex", width: "100%" }}
                >
                  <Radio.Button
                    value={"Service"}
                    style={{
                      width: "50%",
                      height: "41px",
                      padding: "5px 0 0 20px",
                    }}
                    className="custom-radio-button"
                  >
                    Service
                  </Radio.Button>
                  <Radio.Button
                    value={"Consumables"}
                    style={{
                      width: "50%",
                      height: "41px",
                      padding: "5px 0 0 20px",
                    }}
                    className="custom-radio-button"
                  >
                    Consumables
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div>

            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div
                  onClick={onCancel}
                  className="me-4 text-decoration-underline btn p-0 text-main"
                >
                  {popupType === "delete" ? "No, Keep it" : "Cancel"}
                </div>
                <Button
                  //   onClick={addOrEditCustomScheduler}
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                >
                  <span>Add</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default ServiceItemPopup;
