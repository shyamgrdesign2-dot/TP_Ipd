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
      {
        src: require("../../../assets/fonts/print-fonts/Roboto-Italic.ttf"),
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: require("../../../assets/fonts/print-fonts/Roboto-BoldItalic.ttf"),
        fontWeight: 700,
        fontStyle: "italic",
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

  Font.register({
    family: "AnekDevanagari",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/AnekDevanagari-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/AnekDevanagari-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/AnekDevanagari-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "NotoSansBengali",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansBengali-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansBengali-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansBengali-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "NotoSansTamil",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansTamil-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansTamil-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansTamil-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "NotoSansTelugu",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansTelugu-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansTelugu-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansTelugu-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "NotoSansKannada",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansKannada-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansKannada-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansKannada-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "NotoSansMalayalam",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansMalayalam-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansMalayalam-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansMalayalam-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "NotoSansGujarati",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansGujarati-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansGujarati-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansGujarati-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "NotoSansGurmukhi",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansGurmukhi-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansGurmukhi-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansGurmukhi-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "NotoSansOriya",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansOriya-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansOriya-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoSansOriya-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "NotoNastaliqUrdu",
    fonts: [
      {
        src: require("../../../assets/fonts/print-fonts/NotoNastaliqUrdu-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoNastaliqUrdu-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: require("../../../assets/fonts/print-fonts/NotoNastaliqUrdu-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });
};
