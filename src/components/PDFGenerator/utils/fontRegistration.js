/**
 * Font Registration
 * Register fonts for PDF rendering
 */

import { Font } from "@react-pdf/renderer";

/**
 * Register all fonts
 * Should be called once at app initialization
 */
export const registerFonts = () => {
  // Roboto
  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/Roboto-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/Roboto-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/Roboto-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  // Arial (using Arimo as Arial alternative)
  Font.register({
    family: "Arial",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/Arimo-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/Arimo-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/Arimo-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  // Poppins (using OpenSans as alternative since Poppins is similar)
  Font.register({
    family: "Poppins",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/OpenSans-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/OpenSans-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/OpenSans-Bold.ttf"),
        fontWeight: 600,
      },
      {
        src: require("../../../assets/fonts/print-fonts/OpenSans-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  // Times Roman
  Font.register({
    family: "Times-Roman",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/EBGaramond-Regular.ttf"),
        fontWeight: 400,
      }, // Regular
      {
        src: require("../../../assets/fonts/print-fonts/EBGaramond-Medium.ttf"),
        fontWeight: 500,
      }, // Medium
      {
        src: require("../../../assets/fonts/print-fonts/EBGaramond-Bold.ttf"),
        fontWeight: 700,
      }, // Bold
    ],
  });

  // Verdana
  Font.register({
    family: "Verdana",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/Jost-Regular.ttf"),
        fontWeight: 400,
      }, // Regular
      {
        src: require("../../../assets/fonts/print-fonts/Jost-Medium.ttf"),
        fontWeight: 500,
      }, // Medium
      {
        src: require("../../../assets/fonts/print-fonts/Jost-Bold.ttf"),
        fontWeight: 700,
      }, // Bold
    ],
  });

  // Calibri
  Font.register({
    family: "Calibri",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/OpenSans-Regular.ttf"),
        fontWeight: 400,
      }, // Regular
      {
        src: require("../../../assets/fonts/print-fonts/OpenSans-Medium.ttf"),
        fontWeight: 500,
      }, // Medium
      {
        src: require("../../../assets/fonts/print-fonts/OpenSans-Bold.ttf"),
        fontWeight: 700,
      }, // Bold
    ],
  });

  // Tahoma
  Font.register({
    family: "Tahoma",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/Vazirmatn-Regular.ttf"),
        fontWeight: 400,
      }, // Regular
      {
        src: require("../../../assets/fonts/print-fonts/Vazirmatn-Medium.ttf"),
        fontWeight: 500,
      }, // Medium
      {
        src: require("../../../assets/fonts/print-fonts/Vazirmatn-Bold.ttf"),
        fontWeight: 700,
      }, // Bold
    ],
  });
};
