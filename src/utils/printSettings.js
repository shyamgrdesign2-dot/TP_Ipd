const tryParseSasExpiry = (url) => {
  if (!url || typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    const se = parsed.searchParams.get("se");
    if (!se) return null;
    const decoded = decodeURIComponent(se);
    const expiry = new Date(decoded);
    if (Number.isNaN(expiry.getTime())) return null;
    return expiry;
  } catch {
    return null;
  }
};

export const getSasExpiryInfo = (url, now = new Date()) => {
  const expiry = tryParseSasExpiry(url);
  if (!expiry) return null;
  return {
    url,
    expiry,
    expired: expiry.getTime() < now.getTime(),
  };
};

const isSasUrlExpired = (url, now = new Date()) => {
  const expiry = tryParseSasExpiry(url);
  if (!expiry) return false;
  return expiry.getTime() < now.getTime();
};

export const sanitizePrintSettingsForPdf = (settings) => {
  if (!settings) return settings;
  const next = JSON.parse(JSON.stringify(settings));
  const header = next?.headerFooter?.header;
  const other = next?.headerFooter?.otherSettings;

  if (header?.logo && isSasUrlExpired(header.logo)) {
    header.logo = "";
  }
  if (header?.headerImg && isSasUrlExpired(header.headerImg)) {
    header.headerImg = "";
  }
  if (other?.signatureImg && isSasUrlExpired(other.signatureImg)) {
    other.signatureImg = "";
  }
  if (other?.watermarkImg && isSasUrlExpired(other.watermarkImg)) {
    other.watermarkImg = "";
  }

  return next;
};
