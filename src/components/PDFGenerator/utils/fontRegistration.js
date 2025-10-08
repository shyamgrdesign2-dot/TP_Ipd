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

  // OpenSans
  Font.register({
    family: "OpenSans",
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
};
