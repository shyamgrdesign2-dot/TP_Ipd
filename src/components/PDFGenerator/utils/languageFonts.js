import React from "react";

/**
 * Identify the appropriate font family for Indian language ranges.
 * Falls back to the provided default when no match is found.
 */
export const getUnicodeFontFamily = (text = "", defaultFont = "Roboto") => {
  const content = typeof text === "string" ? text : String(text || "");

  // Devanagari (Hindi, Marathi, Sanskrit, Nepali, etc.)
  if (/[\u0900-\u097F]/.test(content)) {
    return "AnekDevanagari";
  }

  // Bengali/Assamese
  if (/[\u0980-\u09FF]/.test(content)) {
    return "NotoSansBengali";
  }

  // Gujarati
  if (/[\u0A80-\u0AFF]/.test(content)) {
    return "NotoSansGujarati";
  }

  // Punjabi/Gurmukhi
  if (/[\u0A00-\u0A7F]/.test(content)) {
    return "NotoSansGurmukhi";
  }

  // Oriya/Odia
  if (/[\u0B00-\u0B7F]/.test(content)) {
    return "NotoSansOriya";
  }

  // Tamil
  if (/[\u0B80-\u0BFF]/.test(content)) {
    return "NotoSansTamil";
  }

  // Telugu
  if (/[\u0C00-\u0C7F]/.test(content)) {
    return "NotoSansTelugu";
  }

  // Kannada
  if (/[\u0C80-\u0CFF]/.test(content)) {
    return "NotoSansKannada";
  }

  // Malayalam
  if (/[\u0D00-\u0D7F]/.test(content)) {
    return "NotoSansMalayalam";
  }

  // Urdu
  if (/[\u0600-\u06FF\u0750-\u077F]/.test(content)) {
    return "NotoNastaliqUrdu";
  }

  return defaultFont;
};

const extractTextContent = (node) => {
  if (node === null || node === undefined || node === false) return "";

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => extractTextContent(child)).join(" ");
  }

  if (React.isValidElement(node)) {
    return extractTextContent(node.props?.children);
  }

  return "";
};

const resolveFontFromStyle = (style) => {
  const stylesArray = Array.isArray(style) ? style : style ? [style] : [];
  const styleWithFont = stylesArray.find(
    (styleItem) => styleItem && styleItem.fontFamily
  );
  return styleWithFont?.fontFamily;
};

export const getMultilingualFontFamily = ({
  children,
  style,
  fallbackFont,
}) => {
  const baseFont = fallbackFont || resolveFontFromStyle(style) || "Roboto";
  const textContent = extractTextContent(children);
  return getUnicodeFontFamily(textContent, baseFont);
};

export const buildMultilingualStyles = ({ style, fontFamily }) => {
  const stylesArray = Array.isArray(style) ? style : style ? [style] : [];
  const merged = fontFamily ? [...stylesArray, { fontFamily }] : stylesArray;
  if (merged.length === 0) return undefined;
  if (merged.length === 1) return merged[0];
  return merged;
};
