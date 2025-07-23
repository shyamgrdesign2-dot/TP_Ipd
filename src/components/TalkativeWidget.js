import { useEffect, useMemo } from "react";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { useLocation } from "react-router-dom";
import { GB_TALKATIVE, HIDE_ROUTES } from "../utils/constants";

const TalkativeWidget = ({
  region = "eu",
  configUuid = "3f5d31d7-aae5-43f2-903a-2dc2d90a36f3",
}) => {
  const location = useLocation();

  const shouldHideWidget = useMemo(() => {
    return HIDE_ROUTES.TALKATIVE.some(
      (route) =>
        location.pathname.includes(route)
    );
  }, [location.pathname]);

  const isTalktiveAccessableFromGB = useFeatureIsOn(GB_TALKATIVE);

  useEffect(() => {
    if (!isTalktiveAccessableFromGB || shouldHideWidget) return;

    const script = document.createElement("script");
    script.src = `https://${region}.engage.app/api/ecs/v1/loader/${configUuid}.js?path=${encodeURIComponent(
      window.location.origin + window.location.pathname
    )}&selectedVersion=${
      new URLSearchParams(window.location.search).get("ecsSelectedVersion") ||
      ""
    }`;
    script.async = true;
    // Add an id to the script to identify it uniquely
    script.id = "talkative-widget-script";
    if (!shouldHideWidget) {
      document.body.appendChild(script);
    }
    if (shouldHideWidget) {
      const existingScript = document.getElementById("talkative-widget-script");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    }

    return () => {
      // Remove the talkative script added by this component
      const existingScript = document.getElementById("talkative-widget-script");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [isTalktiveAccessableFromGB, region, configUuid, shouldHideWidget]);

  return null; // This component doesn't render anything visually
};

export default TalkativeWidget;
