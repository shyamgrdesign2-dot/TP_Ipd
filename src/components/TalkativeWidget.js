import { useEffect } from 'react';

const TalkativeWidget = ({ region = 'eu', configUuid = '3f5d31d7-aae5-43f2-903a-2dc2d90a36f3' }) => {
  useEffect(() => {
    // Initialize talkativeCustomConfig on the window object
    // window.talkativeCustomConfig = {
    //   events: {
    //     enterStandby() {
    //       if (!window.triggered) {
    //         const queryString = window.location.search;
    //         const urlParams = new URLSearchParams(queryString);
    //         const interactionData = [];

    //         const data = [
    //           { name: 'foo', label: 'Foo Label', type: 'string' },
    //           { name: 'bar', label: 'Bar Label', type: 'string' },
    //         ];

    //         for (const entry of urlParams.entries()) {
    //           const key = entry[0];
    //           const value = entry[1];

    //           const base = data.find((x) => x.name === key);

    //           if (base) {
    //             interactionData.push({ data: value, ...base });
    //           }
    //         }

    //         window.talkativeApi.interactionData.appendInteractionData(interactionData);
    //         window.talkativeApi.actions.triggerAction('start-chat');
    //         window.triggered = true;
    //       }
    //     },
    //   },
    // };

    // Dynamically load the external script
    const script = document.createElement('script');
    script.src = `https://${region}.engage.app/api/ecs/v1/loader/${configUuid}.js?path=${encodeURIComponent(window.location.origin + window.location.pathname)}&selectedVersion=${(new URLSearchParams(window.location.search)).get('ecsSelectedVersion') || ''}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up the script when the component unmounts
    };
  }, [region, configUuid]);

  return null; // This component doesn't render anything visually
};

export default TalkativeWidget;
