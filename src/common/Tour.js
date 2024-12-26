import React, { useState } from "react";
import Joyride from "react-joyride";
import { updateTour } from "../pages/obstetric/service";

const Tour = ({ run = false, steps = [] }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const callback = (data) => {
    if (data.action === "next") {
      setStepIndex(stepIndex + 1);
    }
    if (data.action === "last" || data.status === "finished") {
      // This triggers when "Got It" is clicked or the tour ends
      updateTour({
        anc: true,
        immunisation: true,
      });
    }
  };

  return (
    <div>
      <Joyride
        steps={steps}
        run={run} // Controls whether the tour is running
        continuous={true} // Automatically continue after each step
        disableOverlayClose={true}
        callback={callback}
        styles={{
          options: {
            zIndex: 1000,
            width: 320,
          },
          tooltipContent: {
            padding: "0px", // Remove all padding from the tooltip content section
          },
          buttonNext: {
            backgroundColor: "black", // Set "Next" button to blue
            color: "white", // Set text color for "Next" button to white
          },
          buttonBack: {
            color: "black", // Set "Back" button text color to blue
          },
          buttonClose: {
            display: "none", // Hide the close button
          },
          buttonLast: {
            backgroundColor: "black !important", // Set "Got It" button to black
            color: "white", // Set text color for "Got It" button to white
          },
        }}
        locale={{
          last: "Got It", // Change the "Last" button text to "Got It"
        }}
      />
    </div>
  );
};

export default Tour;
