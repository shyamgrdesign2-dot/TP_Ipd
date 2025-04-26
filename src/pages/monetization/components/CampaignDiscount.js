import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

function CampaignDiscount({ flag }) {

    const { campaignsData } = useSelector((state) => state.doctors);
    const [countdown, setCountdown] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
    });

    useEffect(() => {
        if (campaignsData && campaignsData.campaign_active) {
            const updateCountdown = () => {
                const now = moment();
                const future = moment(campaignsData?.campaign_enddate);

                const duration = moment.duration(future.diff(now));

                const days = String(Math.floor(duration.asDays())).padStart(2, '0');
                const hours = String(duration.hours()).padStart(2, '0');
                const minutes = String(duration.minutes()).padStart(2, '0');

                if (duration.asMilliseconds() <= 0) {
                    setCountdown({ days: '00', hours: '00', minutes: '00' });
                } else {
                    setCountdown({ days, hours, minutes });
                }
            };

            updateCountdown(); // Run immediately on mount/update

            const interval = setInterval(updateCountdown, 60000); // Then run every 1 minute

            return () => clearInterval(interval);
        }
    }, [campaignsData]);
    return (
        <>
            {flag === 1 ? (
                <div className="flat-20 py-3">
                    🎉<span>&nbsp;Flat {campaignsData?.campaign_value}% off</span>&nbsp;on EMR—limited time offer!&nbsp;&nbsp;
                    <div className="rounded-pill px-2 py-1">{countdown.days} Days : {countdown.hours} Hours : {countdown.minutes} Min ⏳ </div>
                </div>
            ) : (
                <div class="my-3 flat-20 lh-lg d-block fs-12-1 fs-12 py-3">🔥Unlock Unlimited Access&nbsp;<span>- Flat 20% OFF!</span><br />⏳ Offer ends in
                    <div className="rounded-pill fs-12-1 mt-2 w-75 mx-auto px-2 py-1">02 Days : 08 Hours : 24 Min </div>
                </div>
            )}
        </>
    );
}

export default React.memo(CampaignDiscount);
