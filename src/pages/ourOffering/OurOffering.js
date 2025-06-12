import React from 'react'
import LeftArrowSVG from "../../assets/images/Arrow-left.svg"
import ShethoscopeImg from "../../assets/images/offerings/Shethoscope.webp"
import TatvaShotsImg from "../../assets/images/offerings/Tatvashots.webp"
import TatvaPediaImg from "../../assets/images/offerings/Tatvapedia.webp"
import RemoteCareImg from "../../assets/images/offerings/Remote_Care.webp"
import AskTatvaImg from "../../assets/images/offerings/Ask_Tatva.webp"
import GenerateDDxImg from "../../assets/images/offerings/DDx.webp"
import QrImg from "../../assets/images/offerings/qr.webp"
import WhiteGridImg from "../../assets/images/offerings/white_grid.svg"
import TatvaCareLogo from "../../assets/images/Tatvacare.webp"
import "./OurOffering.scss"
import { useNavigate, useSearchParams } from 'react-router-dom'

const OurOffering = () => {
    const [searchParams] = useSearchParams();
    const name = searchParams.get("name");
    // Remove 'Dr' or 'dr' from name if present
    const formattedName = name?.replace(/^Dr\s+|^dr\s+/i, '');
    const mobileNumber = searchParams.get("mobileNumber");
    const from = searchParams.get("from")
    const speciality = searchParams.get("speciality");
    const navigate = useNavigate()
    const CardData = [
        {
            title: "TatvaPractice",
            image: ShethoscopeImg,
            key: "tatva_practice"
        },
        {
            title: "TatvaShots",
            image: TatvaShotsImg,
            key: "tatva_shots"
        },
        {
            title: "TatvaPedia",
            image: TatvaPediaImg,
            key: "tatva_pedia"
        },
        {
            title: "Remote Care",
            image: RemoteCareImg,
            key: "remote_care"
        },
        {
            title: "Ask Tatva",
            image: AskTatvaImg,
            key: "ask_tatva"
        },
        {
            title: "Generative DDx",
            image: GenerateDDxImg,
            key: "generate_ddx"
        },
    ]
    const handleOfferingClick = (key) => {
        switch (key) {
            case "tatva_practice":
                if (from === "home") {
                    navigate(-1);
                } else {
                    localStorage.setItem("mobileNumber", mobileNumber);
                    navigate(`/final-setup?fullName=${formattedName}&speciality=${speciality}&fromOffering=true`);
                }
                break;
            default:
                break;
        }
    }
    return (
        <div className='medeco'>
            {/* Header */}
            <div className='medeco_header'>
                <img src={TatvaCareLogo} className='tatva_care_logo' />
            </div>
            <div className='medeco_container'>
                <div className='gradient_container'>
                    <img src={WhiteGridImg} className='header_white_grid' />
                </div>
                <div className='data_container'>
                    <div>
                        <p className='doctor_name'>Welcome Dr. {formattedName}!</p>
                        <p className='sub_text'>Seamlessly access your practice tools all in one place.</p>
                    </div>
                    <div className='offering_container'>
                        <div className='offering_text_container'>
                            <p className='offering_text'>Our Offerings </p>
                            <p className='offering_subtext'>We offers a whole host of services that will assist you in your practice journey</p>
                        </div>
                        <div className='offering_cards_container'>
                            {CardData.map(card => (
                                <div className='offering_container_card' onClick={() => handleOfferingClick(card.key)} >
                                    <img src={WhiteGridImg} className='card_white_grid' />
                                    <img src={card.image} className='card_img' />
                                    <p className='card_title'>{card.title}</p>
                                </div>
                            ))}
                        </div>
                        {/* <div className='qr_container'>
                            <div className='qr_content'>
                                <p className='qr_heading'>Scan QR to Download MedEco Mobile App</p>
                                <p>Download the MedEco Mobile App to manage your practice on the go, access real-time medical insights, and deliver better patient care anytime, anywhere. <span className='qr_know_more'>Know More</span></p>
                            </div>
                            <div className='qr_img_container'>
                                <img src={QrImg} className='qr_img' />
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OurOffering