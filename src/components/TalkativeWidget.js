import { useEffect } from 'react';
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { GB_TALKATIVE } from '../utils/constants';

const TalkativeWidget = ({ region = 'eu', configUuid = '3f5d31d7-aae5-43f2-903a-2dc2d90a36f3' }) => {
  
  const isTalktiveAccessableFromGB = useFeatureIsOn(
    GB_TALKATIVE
  );

  useEffect(() => {

    if (!isTalktiveAccessableFromGB) return;

    // // Initialize talkativeCustomConfig on the window object
    // window.talkativeCustomConfig = {
    //   events: {
    //     enterStandby() {
    //       const data = [
    //         {
    //           name: 'username',
    //           label: 'Username',
    //           type: 'string',
    //           data: "abc",
    //         },
    //         {
    //           name: 'email',
    //           label: 'Email Address',
    //           type: 'string',
    //           data: "a@a.com",
    //         },
    //         {
    //           name: 'accountNumber',
    //           label: 'Account Number',
    //           type: 'string',
    //           data: "78777777",
    //         }
    //       ];

    //       window.talkativeApi.interactionData.appendInteractionData(data);
    //     },
    //     resumeInteraction() {
    //       const data = [
    //         {
    //           name: 'username',
    //           label: 'Username',
    //           type: 'string',
    //           data: "abc",
    //         },
    //         {
    //           name: 'email',
    //           label: 'Email Address',
    //           type: 'string',
    //           data: "a@a.com",
    //         },
    //         {
    //           name: 'accountNumber',
    //           label: 'Account Number',
    //           type: 'string',
    //           data: "78777777",
    //         }
    //       ];
    //       window.talkativeApi.interactionData.appendInteractionData(data);
    //     }
    //     },
    // }

    const script = document.createElement('script');
    script.src = `https://${region}.engage.app/api/ecs/v1/loader/${configUuid}.js?path=${encodeURIComponent(window.location.origin + window.location.pathname)}&selectedVersion=${(new URLSearchParams(window.location.search)).get('ecsSelectedVersion') || ''}`;
    script.async = true;
    // Add an id to the script to identify it uniquely
    script.id = 'talkative-widget-script';
    document.body.appendChild(script);

    return () => {
      // Remove the talkative script added by this component
      const existingScript = document.getElementById('talkative-widget-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [isTalktiveAccessableFromGB,region, configUuid]);

  return null; // This component doesn't render anything visually
};

export default TalkativeWidget;