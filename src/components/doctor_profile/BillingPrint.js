import React, { useRef } from "react";
import { Navbar, Col, Row } from "react-bootstrap";
import html2pdf from "html2pdf.js";

function BillingPrint({ handlePdfDrawer }) {

  const printableRef = useRef(null);

  const handleDownloadData = () => {
    const element = printableRef.current;
    const options = {
      filename: `billing_${Math.random() || "report"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      ?.from(element)
      ?.set(options)
      ?.output("blob")
      ?.then((blob) => {
        const blobURL = URL.createObjectURL(blob);
        // Remove all existing iframes
        document.querySelectorAll('iframe').forEach(function (iframe) {
          iframe.parentNode.removeChild(iframe);
        });
        var iframe = document.createElement('iframe'); //load content in an iframe to print later
        document.body.appendChild(iframe);
        iframe.style.display = 'none';
        iframe.src = blobURL;
        iframe.onload = function () {
          setTimeout(function () {
            iframe.focus();
            iframe.contentWindow.print();
            // Revoke the Blob URL to avoid memory leaks
            URL.revokeObjectURL(blobURL);
          }, 1);
        };
      })
      .catch((err) => {
        console.error("Error generating PDF:", err);
      });
  };
  return (
    <>
      <Navbar className="justify-content-between headerprescription p-0">
        <div className='h-100 d-flex align-items-center w-100 justify-content-between'>
          <div className='align-items-center d-flex h-100'>
            <div className='border-end h-100 text-center' onClick={handlePdfDrawer}>
              <div className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                <i className='icon-right'></i>
              </div>
            </div>
            <div className='ms-3 title-common'>Invoice</div>
          </div>
          <div className='align-items-center d-flex h-100'>
            <button className='btn' onClick={handleDownloadData}>
              <i className="fs-3 text-primary icon-Print"></i>
            </button>
            <button className='btn'>
              <i className="fs-3 text-primary icon-download"></i>
            </button>
          </div>
        </div>
      </Navbar>

      <div ref={printableRef}>
        <div className="m-4 p-4 rounded-20px" style={{ backgroundColor: '#F2F2F2' }}>
          <div className="text-center titleprint mb-3 text-main fw-semibold">Invoice</div>
          <Row className="justify-content-between">
            <Col lg={6}>
              <div className="d-flex my-1">
                <div className="fontroboto fw-medium text-welcome fs-15">Patient Name:&nbsp;</div>
                <div className="fontroboto text-welcome fs-15">Rahul Sharma</div>
              </div>
            </Col>
            <Col lg={5}>
              <div className="d-flex my-1">
                <div className="fontroboto fw-medium text-welcome fs-15">Bill No:&nbsp;</div>
                <div className="fontroboto text-welcome fs-15">INV_20240001</div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="d-flex my-1">
                <div className="fontroboto fw-medium text-welcome fs-15">Patient ID:&nbsp;</div>
                <div className="fontroboto text-welcome fs-15">PI202305003</div>
              </div>
            </Col>
            <Col lg={5}>
              <div className="d-flex my-1">
                <div className="fontroboto fw-medium text-welcome fs-15">Receipt No:&nbsp;</div>
                <div className="fontroboto text-welcome fs-15">REP_20240001</div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="d-flex my-1">
                <div className="fontroboto fw-medium text-welcome fs-15">Mobile number:&nbsp;</div>
                <div className="fontroboto text-welcome fs-15">Female, 28y</div>
              </div>
            </Col>
            <Col lg={5}>
              <div className="d-flex my-1">
                <div className="fontroboto fw-medium text-welcome fs-15">Bill Date:&nbsp;</div>
                <div className="fontroboto text-welcome fs-15">22/11/2023</div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="d-flex my-1">
                <div className="fontroboto fw-medium text-welcome fs-15">Bill Status:&nbsp;</div>
                <div className="fontroboto text-welcome fs-15">Paid</div>
              </div>
            </Col>
            <Col lg={5}>
              <div className="d-flex my-1">
                <div className="fontroboto fw-medium text-welcome fs-15">GSTIN:&nbsp;</div>
                <div className="fontroboto text-welcome fs-15">1293ADCF89</div>
              </div>
            </Col>
            <Col lg={12}>
              <div className="d-flex my-1">
                <div className="fontroboto fw-medium text-welcome fs-15">Address:&nbsp;</div>
                <div className="fontroboto text-welcome fs-15">Chennai</div>
              </div>
            </Col>
          </Row>
          <hr />

          <table cellpadding="5" cellspacing="5" style={{ width: '100%' }}>
            <tr>
              <th>#</th>
              <th>ITEMS </th>
              <th>QYT</th>
              <th>AMOUNT</th>
              <th>DISCOUNT</th>
              <th>GST(%)</th>
              <th>TOTAL</th>
            </tr>
            <tr>
              <th>1</th>
              <td>Consultation</td>
              <td>1</td>
              <td>₹500</td>
              <td>₹120</td>
              <td>5%</td>
              <th>₹399</th>
            </tr>
            <tr>
              <th>2</th>
              <td>Dressing (Fracture)</td>
              <td>1</td>
              <td>₹500</td>
              <td>₹120</td>
              <td>5%</td>
              <th>₹451</th>
            </tr>
          </table>

          <br />

          <Row className="justify-content-between">
            <Col lg={6}></Col>
            <Col lg={6}>
              <div className="d-flex justify-content-between my-2">
                <div className="fs-15">Subtotal:&nbsp;</div>
                <div className="fontroboto fs-15">₹950</div>
              </div>
            </Col>
            <Col lg={6}></Col>
            <Col lg={6}>
              <div className="d-flex justify-content-between my-2">
                <div className="fs-15">Line Item Discount:&nbsp;</div>
                <div className="fontroboto fs-15">-₹140</div>
              </div>
            </Col>
            <Col lg={6}></Col>
            <Col lg={6}>
              <div className="d-flex justify-content-between my-2">
                <div className="fs-15">Extra Discount:&nbsp;</div>
                <div className="fontroboto fs-15">-₹0</div>
              </div>
            </Col>
            <Col lg={6}></Col>
            <Col lg={6}>
              <div className="d-flex justify-content-between my-2">
                <div className="fs-15">Applicable GST:&nbsp;</div>
                <div className="fontroboto fs-15">₹40</div>
              </div>
            </Col>
            <Col lg={6}></Col>
            <Col lg={6}>
              <div className="d-flex justify-content-between my-2">
                <div className="fw-medium fs-18">Total Payable Amount:&nbsp;</div>
                <div className="fontroboto fw-medium fs-18">₹850</div>
              </div>
            </Col>
            <Col lg={6}></Col>
            <Col lg={6}>
              <div className="d-flex justify-content-between my-2">
                <div className="fs-15">Paid Via “Cash”:&nbsp;</div>
                <div className="fontroboto fs-15">₹800</div>
              </div>
            </Col>
            <Col lg={6}></Col>
            <Col lg={6}>
              <div className="d-flex justify-content-between my-2">
                <div className="fs-15">Paid Via “UPI”:&nbsp;</div>
                <div className="fontroboto fs-15">₹50</div>
              </div>
            </Col>
            <Col lg={6}></Col>
            <Col lg={6}>
              <div className="d-flex justify-content-between my-2">
                <div className="fw-medium text-green fs-18">Total Amount Paid:&nbsp;</div>
                <div className="fontroboto fw-medium text-green fs-18">₹850</div>
              </div>
            </Col>
          </Row>
          <div className="mt-4"><span className="fw-semibold">Notes:</span> Can take pain killer tablets during the menstrual time But make sure that there is no usage of more than 2  pain killers per day Can take pain killer tablets during the menstrual time.</div>
        </div>
      </div>

    </>
  );
}

export default React.memo(BillingPrint);
