import { Col, Input, Row } from "antd";
import rxDisplayArea from "./../../../../assets/images/rx-display-area.svg";

const LetterheadOwn = ({ headerFooter, setPrintSettings }) => {
  //Own Letterhead
  const onMarginChange = (value, key) => {
    if (
      ((key === "top" || key === "bottom") && value <= 15) ||
      ((key === "left" || key === "right") && value <= 10)
    ) {
      setPrintSettings((prev) => {
        return {
          ...prev,
          headerFooter: {
            ...prev?.headerFooter,
            margin: {
              ...prev?.headerFooter?.margin,
              [key]: value,
            },
          },
        };
      });
    }
  };

  return (
    <div className="mt-5">
      <Row
        justify="space-between"
        className="align-items-center form_addnewpatient mb-1"
      >
        <Col lg="24">
          <div className="title-common">
            Set page margins to display your own letterhead
          </div>
        </Col>
      </Row>
      <div className="">
        <div className="my-3 text-center">
          <label className="mb-1">Top (cm)</label> <br />
          <Input
            className="inputheight41-group"
            value={headerFooter?.margin?.top}
            onChange={(e) => onMarginChange(e.target.value, "top")}
            style={{ width: 70 }}
          />
        </div>
        <Row className="align-items-center justify-content-around form_addnewpatient mb-1">
          <Col lg="6">
            <div className="text-center">
              <label className="mb-1">Left (cm)</label> <br />
              <Input
                className="inputheight41-group"
                value={headerFooter?.margin?.left}
                onChange={(e) => onMarginChange(e.target.value, "left")}
                style={{ width: 70 }}
              />
            </div>
          </Col>
          <Col lg="12">
            <img src={rxDisplayArea} />
          </Col>
          <Col lg="6">
            <div className="text-center">
              <label className="mb-1">Right (cm)</label> <br />
              <Input
                className="inputheight41-group"
                value={headerFooter?.margin?.right}
                onChange={(e) => onMarginChange(e.target.value, "right")}
                style={{ width: 70 }}
              />
            </div>
          </Col>
        </Row>
        <div className="my-3 text-center">
          <Input
            className="inputheight41-group"
            value={headerFooter?.margin?.bottom}
            onChange={(e) => onMarginChange(e.target.value, "bottom")}
            style={{ width: 70 }}
          />
          <br />
          <label className="mb-1">Bottom (cm)</label>
        </div>
      </div>
    </div>
  );
};

export default LetterheadOwn;
