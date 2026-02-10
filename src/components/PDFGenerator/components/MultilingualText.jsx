import React from "react";
import { Text as PDFText } from "@react-pdf/renderer";
import {
  buildMultilingualStyles,
  getMultilingualFontFamily,
} from "../utils/languageFonts";

/**
 * Wrapper around @react-pdf/renderer Text that picks the right font
 * for multilingual content based on Unicode ranges.
 */
const MultilingualText = ({ children, style, fallbackFont, ...rest }) => {
  const fontFamily = getMultilingualFontFamily({
    children,
    style,
    fallbackFont,
  });

  const computedStyle = buildMultilingualStyles({
    style,
    fontFamily,
  });

  return (
    <PDFText {...rest} style={computedStyle}>
      {children}
    </PDFText>
  );
};

export { MultilingualText as Text };
export default MultilingualText;
