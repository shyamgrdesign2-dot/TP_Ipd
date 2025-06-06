import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Dropdown, Drawer, Input, Button, Popover, Checkbox, Form } from "antd";
import { DownOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import yearlyPlan from '../../../assets/images/year-plan-corner.svg'

import logoSm from '../../../assets/images/logo-sm.svg';
import iconEdit from "../../../assets/images/edit.svg";
import { currencyFormat, errorMessage, formatAmount, getClinic, getClinicName, getDeviceSdkData, getTokenData, isNumeric, isValidGST, onlyDecimalFormat, onlyNumberFormat, removeBeforeWhiteSpace } from "../../../utils/utils";
import { kamList, otpSend, otpVerify, paymentOrder, purchaseDetails, verifyPayment } from "../../../redux/monetizationSlice";
import { fetchSubscriptionDetails } from "../../../redux/subscriptionSlice";
import { searchPincode } from "../../../redux/appointmentsSlice";
import { services } from "../../../redux/doctorsSlice";
import { S_SMARTSYNC, S_TATVA_PRACTICE } from "../../../utils/constants";
import config from "../../../config";

import "../GetUnlimitedAccess.scss";
import { deviceType, osName } from "react-device-detect";

function UnlimitedAccessSummary({ selectedServices, setSelectedServices }) {

    const { profile } = useSelector((state) => state.doctors);
    const { pincodeInfo } = useSelector((state) => state.records);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [flag, setFlag] = useState(1);
    const [kamDetails, setKamDetails] = useState(null);
    const [mobileNo, setMobileNo] = useState('');
    const [otp, setOTP] = useState('');
    const [salesDiscount, setSalesDiscount] = useState('');

    const [taxInvoice, setTaxInvoice] = useState(false);
    const [doctorName, setDoctorName] = useState('');
    const [clinicName, setClinicName] = useState('');
    const [clinicPincode, setClinicPincode] = useState('');
    const [clinicCity, setClinicCity] = useState('');
    const [clinicState, setClinicState] = useState('');
    const [clinicAddress, setClinicAddress] = useState('');
    const [gstNo, setGstNo] = useState('');

    const [c_doctorName, setC_DoctorName] = useState('');
    const [c_clinicPincode, setC_ClinicPincode] = useState('');
    const [c_clinicCity, setC_ClinicCity] = useState('');
    const [c_clinicState, setC_ClinicState] = useState('');
    const [c_clinicAddress, setC_ClinicAddress] = useState('');
    const [billingModal, setBillingModal] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile?.hospital_data !== null && profile?.hospital_data !== undefined) {
            setDoctorName(profile?.um_name)

            setC_DoctorName(profile?.um_name)

            const clinic_name = getClinic(profile?.hospital_data);
            setClinicName(clinic_name?.hm_name);
            setClinicPincode(isNumeric(clinic_name?.hm_pincode) ? clinic_name?.hm_pincode : '');
            setClinicCity(isNumeric(clinic_name?.hm_pincode) ? clinic_name?.hm_city : '');
            setClinicState(isNumeric(clinic_name?.hm_pincode) ? clinic_name?.hm_state : '');
            setClinicAddress(clinic_name?.hm_address1);

            setC_ClinicPincode(isNumeric(clinic_name?.hm_pincode) ? clinic_name?.hm_pincode : '');
            setC_ClinicCity(isNumeric(clinic_name?.hm_pincode) ? clinic_name?.hm_city : '');
            setC_ClinicState(isNumeric(clinic_name?.hm_pincode) ? clinic_name?.hm_state : '');
            setC_ClinicAddress(clinic_name?.hm_address1);
        }
    }, [profile?.hospital_data]);

    const handleValidity = useCallback((item, newValidity) => {
        if (item.service_name === S_TATVA_PRACTICE) {
            setSelectedServices(prev =>
                prev.map(e =>
                    (e.service_name === item.service_name || e.validity > newValidity)
                        ? { ...e, validity: newValidity }
                        : e
                )
            );
        } else {
            const EMR_validity = selectedServices.find(e => e.service_name === S_TATVA_PRACTICE)?.validity
            if (newValidity > EMR_validity) {
                setSelectedServices(prev =>
                    prev.map(e =>
                        (e.service_name === item.service_name || e.service_name === S_TATVA_PRACTICE)
                            ? { ...e, validity: newValidity }
                            : e
                    )
                );
            } else {
                setSelectedServices(prev =>
                    prev.map(e =>
                        e.service_name === item.service_name
                            ? { ...e, validity: newValidity }
                            : e
                    )
                );
            }
        }
    }, [selectedServices]);

    const getMenuItems = (item) => {
        return [
            {
                label: <div onClick={() => handleValidity(item, 12)}>1 Year</div>,
                key: '12',
            },
            {
                label: <div onClick={() => handleValidity(item, 24)}>2 Year</div>,
                key: '24',
            },
            {
                label: <div onClick={() => handleValidity(item, 36)}>3 Year</div>,
                key: '36',
            }
        ]
    };

    const subDiscount = useMemo(() => {
        return selectedServices.reduce(
            (sum, item) => sum + ((parseFloat(item.strike_off_cost) - parseFloat(item.service_cost)) * (item.validity / 12)),
            0
        );
    }, [selectedServices]);

    const subTotal = useMemo(() => {
        return selectedServices.reduce(
            (sum, item) => sum + (parseFloat(item.strike_off_cost) * (item.validity / 12)),
            0
        );
    }, [selectedServices]);

    const salesDiscountAmount = useMemo(() => {
        return selectedServices.reduce(
            (sum, item) => sum + parseFloat(item.max_applicable_discount),
            0
        );
    }, [selectedServices]);

    const totalAmount = useMemo(() => {
        return Math.ceil(formatAmount(subTotal - subDiscount - parseFloat(salesDiscount ? salesDiscount : 0)));
    }, [selectedServices, salesDiscount]);

    const clickBuyNow = async () => {
        if (taxInvoice && !clinicName) {
            errorMessage('Enter clinic name')
        } else if (taxInvoice && !gstNo) {
            errorMessage('Enter gst no.')
        } else if (taxInvoice && !isValidGST(gstNo)) {
            errorMessage('Enter Valid gst no.')
        } else if (taxInvoice && !doctorName) {
            errorMessage('Enter doctor name')
        } else if (taxInvoice && !clinicPincode) {
            errorMessage('Enter clinic pincode')
        } else if (taxInvoice && !clinicCity) {
            errorMessage('Enter Valid clinic pincode')
        } else if (taxInvoice && !clinicState) {
            errorMessage('Enter Valid clinic pincode')
        } else {
            setLoading(true)
            let sendData = {
                amount: totalAmount,
            }
            const action = await dispatch(paymentOrder(sendData));
            if (action.meta.requestStatus === "fulfilled") {
                if (action?.payload?.hasOwnProperty("id")) {
                    initRazorPayPayment(action?.payload);
                } else {
                    setLoading(false)
                    typeof action?.payload?.data?.error === 'object' ?
                        errorMessage(action?.payload?.data?.error?.description)
                        :
                        errorMessage(action?.payload?.data?.message)
                }
            } else {
                setLoading(false)
                errorMessage(action.payload.message)
            }
        }
        const clinic_name = getClinicName(profile?.hospital_data);
        const tokenData = getTokenData(); 
        const deviceSdkData = getDeviceSdkData();
        window.Moengage.track_event("TP_Monetization_ProceedtoPay", {
            doctor_name: profile?.um_name,
            doctor_number: profile?.um_contact,
            doctor_unique_id: profile?.doctor_unique_id,
            doctor_specialty: profile?.dp_name,
            clinic_id: tokenData?.clinic_id,
            um_id: tokenData?.user_id,
            clinic_Name: clinic_name,
            ...deviceSdkData
        });
    }

    const initRazorPayPayment = (data) => {
        const options = {
            key: config.razorPay_key,
            amount: data.amount,
            currency: data.currency,
            name: 'Tatvacare',
            description: 'Credit Top-Up',
            image: logoSm,
            order_id: data.id,
            handler: async (response) => {
                try {
                    verifyRazorPayPayment(response, data)
                } catch (error) {
                    setLoading(false)
                    console.log(error);
                }
            },
            prefill: {
                contact: profile?.um_contact,
                name: profile?.um_name,
                email: profile?.um_email,
            },
            theme: {
                color: "#4B4AD5",
            },
            modal: {
                ondismiss: function () {
                    setLoading(false)
                }
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    function generateDiscountId() {
        const prefix = 'DIS-';
        const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
        return prefix + randomNumber;
    }

    const verifyRazorPayPayment = async (r_response, data) => {
        const action = await dispatch(verifyPayment(r_response));
        if (action.meta.requestStatus === "fulfilled") {
            if (action?.payload?.hasOwnProperty("id") && action?.payload?.status === 'captured') {
                const summaryData = selectedServices.map(({ service_name, service_type, service_cost, validity }) => ({
                    service_name,
                    service_type,
                    plan_validity_months: validity,
                    plan_amount: formatAmount(parseFloat(service_cost))
                }));
                let sendData = {
                    b2c_id: profile?.b2c,
                    purchase_city: "Ahmedabad",
                    purchase_state: "Gujarat",
                    purchase_date: moment().toISOString(),
                    purchase_amount: totalAmount,
                    purchase_type: "subscription",
                    purchase_status: "completed",
                    discount_applied: true,
                    payment_id: action?.payload?.id,
                    campaign_applied: null,
                    campaign_id: null,
                    gst_applied: taxInvoice,
                    organization_name: taxInvoice ? clinicName : '',
                    gst_no: taxInvoice ? gstNo : '',
                    billing_address: taxInvoice ? `${clinicAddress}, ${clinicCity}, ${clinicState}, ${clinicPincode}` : '',
                    summary: summaryData,
                    discount_details: [
                        {
                            "kam_id": kamDetails ? kamDetails : '',
                            "discount_id": generateDiscountId(),
                            "discount_given": salesDiscount ? formatAmount(parseFloat(salesDiscount)) : 0
                        }
                    ]
                }
                const actionPurchaseDetails = await dispatch(purchaseDetails(sendData));
                if (actionPurchaseDetails.meta.requestStatus === "fulfilled") {
                    if (actionPurchaseDetails?.payload?.hasOwnProperty("b2c_id")) {
                        dispatch(fetchSubscriptionDetails())
                        dispatch(services(profile?.b2c));
                        navigate(`/?upgrade_services=true&service_list=${selectedServices.map(item => item.service_name)}`, { replace: true })
                        setLoading(false)
                    } else {
                        setLoading(false)
                        errorMessage('Something went wrong! please try again later')
                    }
                } else {
                    setLoading(false)
                    errorMessage(actionPurchaseDetails.payload.message)
                }
            } else {
                setLoading(false)
                typeof action?.payload?.data?.error === 'object' ?
                    errorMessage(action?.payload?.data?.error?.description)
                    :
                    errorMessage(action?.payload?.data?.message)
            }
        } else {
            setLoading(false)
            errorMessage(action.payload.message)
        }
    }

    const handleInvoiceChange = useCallback((event) => {
        setTaxInvoice(event.target.checked);
        const clinic_name = getClinicName(profile?.hospital_data);
        const tokenData = getTokenData(); 
        const deviceSdkData = getDeviceSdkData();
        window.Moengage.track_event("TP_Monetization_GST_Tax_invoice", {
        doctor_name: profile?.um_name,
        doctor_number: profile?.um_contact,
        doctor_unique_id: profile?.doctor_unique_id,
        doctor_specialty: profile?.dp_name,
        clinic_id: tokenData?.clinic_id,
        um_id: tokenData?.user_id,
        clinic_Name: clinic_name,
        ...deviceSdkData,
        Subscription_Plan: '',
        Payment_Status: '',
        count_of_items: '',
        Name_of_items: ''
        });
    }, [taxInvoice]);

    const handleBillingModal = useCallback(() => {
        setBillingModal(!billingModal);
    }, [billingModal]);

    const onClinicNameChange = useCallback((e) => {
        const updateQuery = removeBeforeWhiteSpace(e.target.value)
        setClinicName(updateQuery);
    }, [clinicName]);

    const onGstNoChange = useCallback((e) => {
        const updateQuery = removeBeforeWhiteSpace(e.target.value)
        setGstNo(updateQuery);
    }, [gstNo]);

    const onDoctorNameChange = useCallback((e) => {
        const updateQuery = removeBeforeWhiteSpace(e.target.value)
        setC_DoctorName(updateQuery);
    }, [c_doctorName]);

    const onClinicPincodeChange = useCallback((e) => {
        const updateQuery = removeBeforeWhiteSpace(onlyNumberFormat(e.target.value))
        setC_ClinicPincode(updateQuery);
    }, [c_clinicPincode]);

    const onClinicAddressChange = useCallback((e) => {
        const updateQuery = removeBeforeWhiteSpace(e.target.value)
        setC_ClinicAddress(updateQuery);
    }, [c_clinicAddress]);

    useEffect(() => {
        if (c_clinicPincode) {
            const timeOutId = setTimeout(() => {
                // pincode.length === 6 && dispatch(searchPincode(pincode));
                dispatch(searchPincode(c_clinicPincode));
            }, 500);
            return () => {
                clearTimeout(timeOutId);
            };
        }
    }, [c_clinicPincode]);

    useEffect(() => {
        if (pincodeInfo && Object.keys(pincodeInfo).length > 0) {
            setC_ClinicCity(pincodeInfo?.city)
            setC_ClinicState(pincodeInfo?.state)
        } else {
            setC_ClinicCity('')
            setC_ClinicState('')
        }
    }, [pincodeInfo]);

    const clickBillingData = () => {
        if (!c_doctorName) {
            errorMessage('Enter doctor name')
        } else if (!c_clinicPincode) {
            errorMessage('Enter clinic pincode')
        } else if (!c_clinicCity) {
            errorMessage('Enter Valid clinic pincode')
        } else if (!c_clinicState) {
            errorMessage('Enter Valid clinic pincode')
        } else {
            setDoctorName(c_doctorName)
            setClinicPincode(c_clinicPincode);
            setClinicCity(c_clinicCity);
            setClinicState(c_clinicState);
            setClinicAddress(c_clinicAddress);
            setBillingModal(false);
        }
    }

    const handleDrawer = useCallback(() => {
        setSalesDiscount('')
        setDrawerOpen(!drawerOpen);
    }, [drawerOpen]);

    const clickReferralCode = () => {
        if (selectedServices?.length > 0) {
            setFlag(1)
            setDrawerOpen(true);
        } else {
            errorMessage('Please add any service')
        }
        const clinic_name = getClinicName(profile?.hospital_data);
        const tokenData = getTokenData(); 
        const deviceSdkData = getDeviceSdkData();
        window.Moengage.track_event("TP_Monetization_RefferalCode", {
            doctor_name: profile?.um_name,
            doctor_number: profile?.um_contact,
            doctor_unique_id: profile?.doctor_unique_id,
            doctor_specialty: profile?.dp_name,
            clinic_id: tokenData?.clinic_id,
            um_id: tokenData?.user_id,
            clinic_Name: clinic_name,
            ...deviceSdkData
        });
    }

    const onMobileNoChange = useCallback((e) => {
        const updateQuery = removeBeforeWhiteSpace(onlyNumberFormat(e.target.value))
        setMobileNo(updateQuery);
    }, [mobileNo]);

    const kamValidation = async () => {
        if (mobileNo?.length < 10) {
            errorMessage('Enter valid mobile number')
        } else {
            let sendData = {
                page: 0,
                size: 1,
                search: mobileNo
            }
            const action = await dispatch(kamList(sendData));
            if (action.meta.requestStatus === "fulfilled") {
                if (action?.payload?.body?.content?.length > 0 && action?.payload?.body?.content[0]?.active) {
                    setKamDetails(action?.payload?.body?.content[0]?.id)
                    sendOTP()
                } else {
                    errorMessage('Please provide valid BDM mobile number')
                }
            } else {
                errorMessage(action.payload.message)
            }
        }
        const clinic_name = getClinicName(profile?.hospital_data);
        const tokenData = getTokenData(); 
        const deviceSdkData = getDeviceSdkData();
        window.Moengage.track_event("TP_Monetization_ContinueSalesRefferalStep1", {
            doctor_name: profile?.um_name,
            doctor_number: profile?.um_contact,
            doctor_unique_id: profile?.doctor_unique_id,
            doctor_specialty: profile?.dp_name,
            clinic_id: tokenData?.clinic_id,
            um_id: tokenData?.user_id,
            clinic_Name: clinic_name,
            KAM_Mobile_Number: mobileNo,
            ...deviceSdkData
        });
    }

    const sendOTP = async () => {
        let sendData = {
            mobileNumber: `91${mobileNo}`,
        }
        const action = await dispatch(otpSend(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            if (action?.payload?.type === 'success') {
                setFlag(2)
                const clinic_name = getClinicName(profile?.hospital_data);
                const tokenData = getTokenData(); 
                const deviceSdkData = getDeviceSdkData();
                window.Moengage.track_event("TP_Monetization_SaleRefOTPtrigger", {
                    doctor_name: profile?.um_name,
                    doctor_number: profile?.um_contact,
                    doctor_unique_id: profile?.doctor_unique_id,
                    doctor_specialty: profile?.dp_name,
                    clinic_id: tokenData?.clinic_id,
                    um_id: tokenData?.user_id,
                    clinic_Name: clinic_name,
                    KAM_Mobile_Number: mobileNo,
                    ...deviceSdkData
                });
            } else {
                errorMessage('Something went wrong! please try again later')
            }
        } else {
            errorMessage(action.payload.message)
        }
    }

    const onOTPChange = useCallback((value) => {
        const updateQuery = removeBeforeWhiteSpace(onlyNumberFormat(value))
        setOTP(updateQuery);
    }, [otp]);

    const verifyOTP = async () => {
        if (otp?.length != 6) {
            errorMessage('Enter valid otp')
        } else {
            let sendData = {
                mobileNumber: `91${mobileNo}`,
                otp: otp
            }
            const action = await dispatch(otpVerify(sendData));
            if (action.meta.requestStatus === "fulfilled") {
                if (action?.payload?.type === 'success') {
                    setFlag(3)
                } else {
                    errorMessage(action.payload.message)
                }
            } else {
                errorMessage(action.payload.message)
            }
            const clinic_name = getClinicName(profile?.hospital_data);
            const tokenData = getTokenData(); 
            const deviceSdkData = getDeviceSdkData();
            window.Moengage.track_event("TP_Monetization_OTPVerification", {
                doctor_name: profile?.um_name,
                doctor_number: profile?.um_contact,
                doctor_unique_id: profile?.doctor_unique_id,
                doctor_specialty: profile?.dp_name,
                clinic_id: tokenData?.clinic_id,
                um_id: tokenData?.user_id,
                clinic_Name: clinic_name,
                KAM_Mobile_Number: mobileNo,
                ...deviceSdkData
            });
        }
    }

    const onSalesDiscountChange = useCallback((e) => {
        const updateQuery = removeBeforeWhiteSpace(onlyDecimalFormat(e.target.value))
        setSalesDiscount(updateQuery);
    }, [salesDiscount]);

    const clickSalesDiscount = () => {
        setDrawerOpen(false);
    }

    const handeYearDD = (e) => {
        e.preventDefault();
        const clinic_name = getClinicName(profile?.hospital_data);
        const tokenData = getTokenData(); 
        const deviceSdkData = getDeviceSdkData();
        window.Moengage.track_event("TP_Monetization_yearsofPruchaseValue", {
            doctor_name: profile?.um_name,
            doctor_number: profile?.um_contact,
            doctor_unique_id: profile?.doctor_unique_id,
            doctor_specialty: profile?.dp_name,
            clinic_id: tokenData?.clinic_id,
            um_id: tokenData?.user_id,
            clinic_Name: clinic_name,
            ...deviceSdkData
        });
    }

    return (
        <>
            <div className="unlimited-access-summary position-sticky top-0">
                <div className="fs-4 fw-semibold">Summary</div>
                {selectedServices?.map((item, index) => {
                    return (
                        <div key={index} className="d-flex justify-content-between my-4">
                            <div className="fs-18">{`${item?.service_display_name} ${item?.service_name !== S_TATVA_PRACTICE && item?.service_name !== S_SMARTSYNC ? '(Addon)' : item?.service_name === S_SMARTSYNC ? '(Device)' : ''}:`}
                                {item?.service_name !== S_SMARTSYNC && (
                                    <div className="d-flex align-items-baseline">
                                        <img className="ms-1" src={yearlyPlan} alt="icon" />
                                        <div className="d-flex align-items-center">
                                            <Dropdown menu={{ items: getMenuItems(item) }} className="fs-14 fw-medium text-primary py-1 px-2 dd-yearly" trigger={['click']}>
                                                <a onClick={handeYearDD}>
                                                    {`${item?.validity / 12} Year`}
                                                    <DownOutlined className="ps-2 fs-14 fw -medium text-primary" />
                                                </a>
                                            </Dropdown>
                                            <Popover trigger="hover" content={<div className="py-2">{`₹${currencyFormat(formatAmount(parseFloat(item.strike_off_cost)))} X ${currencyFormat(formatAmount(item.validity / 12))} = ₹${currencyFormat(formatAmount(parseFloat(item.strike_off_cost) * (item.validity / 12)))}`}</div>}>
                                                <i className="icon-info fs-5 text-black-50 ms-2"></i>
                                            </Popover>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="fs-18 fw-medium">
                                {`₹${currencyFormat(formatAmount(parseFloat(item.strike_off_cost) * (item.validity / 12)))}`}
                            </div>
                        </div>
                    )
                })}
                <hr />
                <div className="d-flex justify-content-between my-3">
                    <div className="fs-18">Subtotal:</div>
                    <div className="fs-18 fw-medium">{`₹${currencyFormat(formatAmount(subTotal))}`}</div>
                </div>
                {formatAmount(subDiscount) > 0 && (
                    <div className="d-flex justify-content-between my-3">
                        <div className="fs-18">Flat Discount:</div>
                        <div className="fs-18 fw-medium text-discount">{`-₹${currencyFormat(formatAmount(subDiscount))}`}</div>
                    </div>
                )}
                {salesDiscount && formatAmount(parseFloat(salesDiscount)) > 0 && (
                    <div className="d-flex justify-content-between my-3">
                        <div className="fs-18">Sales Discount{salesDiscount && ` (${formatAmount(salesDiscount * 100 / subTotal)}%)`}:</div>
                        <div className="fs-18 fw-medium text-discount">{`-₹${salesDiscount ? currencyFormat(formatAmount(parseFloat(salesDiscount))) : 0}`}</div>
                    </div>
                )}
                <hr />
                <div className="d-flex justify-content-between my-3">
                    <div className="fs-4 text-welcome fw-semibold">Total Amount <span className="fs-14 fw-normal text-welcome">(Inc GST)</span>:</div>
                    <div className="fs-4 text-welcome fw-semibold">{`₹${currencyFormat(totalAmount)}`}</div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <Checkbox className="switch-name-check"
                        checked={taxInvoice}
                        onChange={handleInvoiceChange}>
                        Need a GST tax invoice ?
                    </Checkbox>
                </div>

                {taxInvoice && (
                    <div className="mt-4">
                        <div className="mb-3">
                            <div className="fontroboto mb-1">Organisation Name<sup className="text-danger-custom fs-14">*</sup></div>
                            <Input className="inputheight45 rounded-10px" placeholder="Enter organisation name" value={clinicName} onChange={onClinicNameChange} />
                        </div>
                        <div className="mb-3">
                            <div className="fontroboto mb-1">GSTIN No<sup className="text-danger-custom fs-14">*</sup></div>
                            <Input className="inputheight45 rounded-10px" placeholder="Enter GSTIN no" value={gstNo} onChange={onGstNoChange} />
                        </div>
                        <div className="p-3 border rounded-10px d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="fw-semibold">{doctorName}</h6>
                                <div className="fs-14">{`${clinicAddress && clinicAddress + ', '}${clinicCity}, ${clinicState}, ${clinicPincode}`}</div>
                            </div>
                            <Button className="ms-3 btn btn-icon btn-delete-prescription" onClick={handleBillingModal}>
                                <i className="icon-Edit"></i>
                            </Button>
                        </div>
                    </div>
                )}

                <Button className="btn btn-proceed btn-primary3 my-4" onClick={clickBuyNow} loading={loading}>
                    {`Proceed to Pay ₹${currencyFormat(totalAmount)}`}
                </Button>
                <div className="text-center">
                    <Link className="text-decoration-underline fw-medium text-primary" onClick={clickReferralCode}>Have a sales referral code?</Link>
                </div>
            </div>

            <Drawer
                placement="right"
                open={drawerOpen}
                className='bg-body'
                closeIcon={false}
                width={539}
            >
                <div className="modalCard-header h-60 position-sticky top-0 z-2">
                    <div className="align-items-center d-flex h-100">
                        <div className="border-end h-100 text-center me-3">
                            <div onClick={handleDrawer}
                                className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer">
                                <i className="icon-right"></i>
                            </div>
                        </div>
                        <div className="title-common">Referral Code</div>
                    </div>
                    <div className="p-4">
                        {flag === 1 ? (
                            <>
                                <div className="fontroboto mb-2">Enter Sales Mobile Number <sup className="text-danger-custom fs-14">*</sup></div>
                                <Input className="inputheight45 rounded-10px" value={mobileNo} maxLength={10} onChange={onMobileNoChange} />
                                <Button className="btn btn-proceed btn-primary3 fs-18 my-4" onClick={kamValidation}>
                                    Continue
                                </Button>
                            </>
                        ) : flag === 2 ? (
                            <>
                                <div className="fontroboto mb-2 text-1F2933">Enter OTP sent to <span className="fw-bold text-decoration-underline text-1F2933">{mobileNo}</span> <img className="ms-2 cursor-pointer" height={16} src={iconEdit} onClick={() => setFlag(1)} /></div>
                                <Input.OTP className="input-otp-size45" length={6} value={String(otp)} formatter={str => onlyNumberFormat(str)} onChange={onOTPChange} />
                                <div className="fontroboto mt-3">Didn’t receive OTP? <Link className="text-decoration-underline fw-semibold text-primary" onClick={sendOTP}>Resend OTP</Link></div>
                                <Button className="btn btn-proceed btn-primary3 my-4 fs-18" onClick={verifyOTP}>
                                    Continue
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="fontroboto mb-2">Enter Sales Discount Amount <sup className="text-danger-custom fs-14">*</sup></div>
                                <Input className="inputheight45 rounded-10px fw-medium" placeholder="0" prefix="₹" value={salesDiscount} onChange={onSalesDiscountChange} />
                                {parseFloat(salesDiscount) > parseFloat(salesDiscountAmount) && (
                                    <div className="text-danger-custom fs-12">The discount amount entered is too high. Please try a valid amount within the allowed range.</div>
                                )}
                                <div className="discount-amount-box p-4 mt-4">

                                    {selectedServices?.map((item, index) => {
                                        return (
                                            <div key={index} className="d-flex align-items-center justify-content-between py-2">
                                                <div>{`${item?.service_display_name} ${item?.service_name !== S_SMARTSYNC ? `(${item.validity / 12} year)` : '(Device)'}:`}</div>
                                                <div className="fw-medium text-green">{`₹${currencyFormat(formatAmount(parseFloat(item.strike_off_cost) * (item.validity / 12)))}`}</div>
                                            </div>
                                        )
                                    })}
                                    {formatAmount(subDiscount) > 0 && (
                                        <div className="d-flex align-items-center justify-content-between py-2">
                                            <div>Flat Discount:</div>
                                            <div className="fw-medium text-green">{`-₹${currencyFormat(formatAmount(subDiscount))}`}</div>
                                        </div>
                                    )}
                                    {salesDiscount && formatAmount(parseFloat(salesDiscount)) > 0 && (
                                        <div className="d-flex align-items-center justify-content-between py-2">
                                            <div>Sales Discount{salesDiscount && ` (${formatAmount(salesDiscount * 100 / subTotal)}%)`}:</div>
                                            <div className="fw-medium text-green">{`-₹${salesDiscount ? currencyFormat(formatAmount(parseFloat(salesDiscount))) : 0}`}</div>
                                        </div>
                                    )}
                                    <hr />
                                    <div className="d-flex align-items-center justify-content-between py-2">
                                        <div className="text-welcome fw-semibold fs-18">Total Amount <span className="fs-14 fw-normal text-welcome">(Inc GST)</span>:</div>
                                        <div className="text-welcome fw-semibold fs-18">{`₹${currencyFormat(totalAmount)}`}</div>
                                    </div>
                                </div>

                                <Button disabled={(parseFloat(salesDiscount) > parseFloat(salesDiscountAmount)) || !salesDiscount ? true : false} className="btn btn-proceed btn-primary3 fs-18 my-4" onClick={clickSalesDiscount}>
                                    Continue
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Drawer>

            <Drawer
                placement="right"
                open={billingModal}
                className='bg-body'
                closeIcon={false}
                onClose={handleBillingModal}
                width={600}
            >
                <div className="modalCard-header h-60 position-sticky top-0 z-2">
                    <div className="align-items-center d-flex h-100">
                        <div className="border-end h-100 text-center me-3">
                            <div onClick={handleBillingModal}
                                className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer">
                                <i className="icon-right"></i>
                            </div>
                        </div>
                        <div className="title-common">Billing Address</div>
                        <Button className="ant-btn btn btn-41 btn-primary3 me-4 ms-auto" onClick={clickBillingData}>
                            Save
                        </Button>
                    </div>
                    <div className="p-4">
                        <div className="mb-3">
                            <div className="fontroboto mb-1">Full Name<sup className="text-danger-custom fs-14">*</sup></div>
                            <Input className="inputheight45 rounded-10px" value={c_doctorName} onChange={onDoctorNameChange} />
                        </div>
                        <div className="mb-3">
                            <div className="fontroboto mb-1">Pincode<sup className="text-danger-custom fs-14">*</sup></div>
                            <Input className="inputheight45 suffix-end rounded-10px"
                                suffix={c_clinicCity && c_clinicState ? `${c_clinicCity}, ${c_clinicState}` : ''} value={c_clinicPincode} onChange={onClinicPincodeChange} />
                        </div>
                        <div className="mb-3">
                            <div className="fontroboto mb-1">Address</div>
                            <Input className="inputheight45 rounded-10px" value={c_clinicAddress} onChange={onClinicAddressChange} />
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
}

export default UnlimitedAccessSummary;
