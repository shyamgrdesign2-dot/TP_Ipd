import { Input, Radio } from "antd";
import CommonModal from "../../../../common/CommonModal";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { upsertBillItem } from "../../service";
import { useSelector } from "react-redux";

const ServiceItemPopup = ({
  popupType,
  onCancel,
  editIndex,
  item,
  setDataSource,
}) => {
  const { advancedSettings } = useSelector((state) => state.billing);
  const [serviceItem, setServiceItem] = useState({
    id: item?.id,
    name: item?.name,
    type: item?.type,
    price: item?.price || item?.amount,
    discount: item?.discount || 0,
    discountType: item?.discountType || advancedSettings?.defaultDiscountType,
    gst: item?.gst || 0,
    totalAmount: item?.totalAmount,
  });

  const handleServiceItem = (key, value) => {
    setServiceItem((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const addOrEditServieItem = async () => {
    serviceItem.totalAmount =
      (Number(serviceItem.price) -
        (serviceItem.discountType === "flat"
          ? Number(serviceItem.discount)
          : (Number(serviceItem.discount) / 100) * Number(serviceItem.price))) *
      (1 + Number(serviceItem.gst) / 100);
    handleServiceItem(serviceItem);
    const billItemRes = await upsertBillItem(serviceItem);
    if (billItemRes?.id) {
      setDataSource((prev) => {
        const updatedData = [...prev];
        const updateIndex = editIndex > -1 ? editIndex : item?.index;

        if (updateIndex > -1 && updatedData[updateIndex]) {
          updatedData[updateIndex] = {
            ...updatedData[updateIndex], // Keep existing values
            masterId: billItemRes?.id,
            quantity: 1,
            name: serviceItem?.name,
            amount: serviceItem?.price,
            discount: serviceItem?.discount,
            discountType: serviceItem?.discountType,
            type: serviceItem?.type,
            gst: serviceItem?.gst,
            totalAmount: serviceItem?.totalAmount,
            createdBy: billItemRes?.createdBy,
          };
        } else {
          // If no valid index, add a new item
          updatedData.push({
            masterId: billItemRes?.id,
            quantity: 1,
            name: serviceItem?.name,
            amount: serviceItem?.price,
            discount: serviceItem?.discount,
            discountType: serviceItem?.discountType,
            type: serviceItem?.type,
            gst: serviceItem?.gst,
            totalAmount: serviceItem?.totalAmount,
            createdBy: billItemRes?.createdBy,
          });
        }
        return updatedData;
      });
      onCancel();
    }
  };

  return (
    <div>
      <CommonModal
        isModalOpen={true}
        onCancel={onCancel}
        modalWidth={500}
        title={editIndex === -1 ? "Add New Item" : "Edit Item"}
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
                <Input
                  value={serviceItem.name}
                  style={{ height: 38 }}
                  onChange={(e) => handleServiceItem("name", e.target.value)}
                />
              </div>

              <div className="d-flex gap-5 align-items-center">
                <label
                  className="d-flex"
                  style={{ fontWeight: 500, width: 110 }}
                >
                  Price/Unit <span className="bdg-danger">*</span>
                </label>
                <Input
                  value={serviceItem.price}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  onChange={(e) => handleServiceItem("price", e.target.value)}
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
                  value={serviceItem.gst}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  onChange={(e) => handleServiceItem("gst", e.target.value)}
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
                  value={serviceItem.discount}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  onChange={(e) =>
                    handleServiceItem("discount", e.target.value)
                  }
                  style={{ height: 38 }}
                />
                <div
                  style={{ position: "absolute", right: "35px", zIndex: 10 }}
                >
                  <Radio.Group
                    value={serviceItem.discountType}
                    style={{ display: "flex", width: "60px" }}
                    onChange={(e) =>
                      handleServiceItem("discountType", e.target.value)
                    }
                  >
                    <Radio.Button
                      value={"percentage"}
                      style={{
                        width: "50%",
                        height: "23px",
                      }}
                      className="custom-radio-button d-flex align-items-center justify-content-center"
                    >
                      %
                    </Radio.Button>
                    <Radio.Button
                      value={"flat"}
                      style={{
                        width: "50%",
                        height: "23px",
                      }}
                      className="custom-radio-button  d-flex align-items-center justify-content-center"
                    >
                      ₹
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </div>

              <div className="d-flex gap-5 align-items-center">
                <label
                  className="d-flex"
                  style={{ fontWeight: 500, width: 110 }}
                >
                  Type <span className="bdg-danger">*</span>
                </label>
                <Radio.Group
                  value={serviceItem.type}
                  style={{ display: "flex", width: "100%" }}
                  onChange={(e) => handleServiceItem("type", e.target.value)}
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
                  onClick={addOrEditServieItem}
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                  disabled={
                    !serviceItem.type || !serviceItem.name || !serviceItem.price
                  }
                >
                  <span>{editIndex === -1 ? "Add" : "Save"}</span>
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
