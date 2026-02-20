import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getFileUrlByFilename,
  setFile,
  setFooterDimensions,
  updatePrintSettings,
} from "../redux/ipd/printSettingsSlice";
import { getFooterImageHeight } from "../utils/utils";

const isHttpUrl = (value) =>
  typeof value === "string" && /^https?:\/\//i.test(value);

const extractFilename = (value) => {
  if (!value || typeof value !== "string") return null;
  try {
    const url = new URL(value);
    const qpFilename =
      url.searchParams.get("filename") || url.searchParams.get("fileName");
    if (qpFilename) return decodeURIComponent(qpFilename);
    const path = url.pathname || "";
    const last = path.split("/").filter(Boolean).pop();
    return last ? decodeURIComponent(last) : null;
  } catch {
    return null;
  }
};

const setPath = (obj, path, value) => {
  if (!Array.isArray(path) || !path.length) return obj;
  let cursor = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!cursor[key] || typeof cursor[key] !== "object") {
      cursor[key] = {};
    }
    cursor = cursor[key];
  }
  cursor[path[path.length - 1]] = value;
  return obj;
};

/**
 * Generic resolver for assets that are saved as filenames but may still exist as (expired) URLs.
 * Resolves to a fresh signed URL, caches it in fileStates, and heals persisted settings by
 * rewriting the stored value to the filename.
 */
const useResolvedAssetUrl = ({
  moduleType,
  assetKey, // e.g., "headerImg", "footerImg", "logo"
  assetValue,
  fileType, // e.g., "fileHeader", "fileFooter", "fileLogo"
  settingsPath, // array path in printSettings to store filename, e.g., ["headerFooter","header","headerImg"]
}) => {
  const dispatch = useDispatch();
  const settingsPathKey = Array.isArray(settingsPath)
    ? settingsPath.join(".")
    : "";

  const moduleFileStates = useSelector(
    (state) => state.printSettings.fileStates?.[moduleType] || {}
  );
  const doctorIdFromState = useSelector(
    (state) => state.ipd?.patientDetails?.doctor?.id
  );
  const savedPrintSettings = useSelector(
    (state) => state.printSettings.printSettings
  );

  const fileState = moduleFileStates[fileType];
  const resolvedUrl = moduleFileStates[`${assetKey}Url`];
  const hasHealed = moduleFileStates[`${assetKey}Healed`];
  const cachedFooterHeight =
    moduleFileStates?.fileFooter?.renderedFooterImageHeight;

  useEffect(() => {
    if (!assetValue || hasHealed) return;

    const isUrl = isHttpUrl(assetValue);
    const filename = isUrl ? extractFilename(assetValue) : assetValue;
    if (!filename) return;

    const shouldResolve =
      !resolvedUrl ||
      !isHttpUrl(resolvedUrl) ||
      (fileState?.showFile && !isHttpUrl(fileState.showFile));

    if (!shouldResolve && !isUrl) return;

    const resolveAndHeal = async () => {
      try {
        const response = await dispatch(
          getFileUrlByFilename(filename)
        ).unwrap();
        const fileUrl = response.fileUrl || response;

        dispatch(
          setFile({
            moduleType,
            fileType: `${assetKey}Url`,
            fileData: fileUrl,
          })
        );

        dispatch(
          setFile({
            moduleType,
            fileType,
            fileData: {
              ...(fileState || {}),
              imageShow: true,
              showFile: fileUrl,
            },
          })
        );

        // Pre-compute footer height once we have a usable URL
        if (
          assetKey === "footerImg" &&
          moduleType &&
          fileUrl &&
          cachedFooterHeight == null
        ) {
          getFooterImageHeight(fileUrl)
            .then((height) => {
              if (height == null) return;
              dispatch(
                setFooterDimensions({
                  moduleType,
                  dimensions: {
                    renderedFooterImageHeight: height,
                    showFile: fileUrl,
                    imageShow: true,
                  },
                })
              );
            })
            .catch((error) =>
              console.error("Failed to compute footer height", error)
            );
        }

        const doctorId =
          doctorIdFromState ||
          savedPrintSettings?.doctorId ||
          savedPrintSettings?.doctor?.id ||
          savedPrintSettings?.doctor_id;

        if (isUrl && doctorId && savedPrintSettings?.[moduleType]) {
          const nextSettings = JSON.parse(JSON.stringify(savedPrintSettings));
          setPath(nextSettings, settingsPath, filename);

          const {
            _id,
            hospitalId,
            createdAt,
            createdBy,
            updatedAt,
            updatedBy,
            message,
            doctorId: _doctorId,
            ...payload
          } = nextSettings;

          const action = await dispatch(
            updatePrintSettings({
              printSettings: payload,
              doctorId,
            })
          );

          if (action.meta?.requestStatus === "fulfilled") {
            dispatch(
              setFile({
                moduleType,
                fileType: `${assetKey}Healed`,
                fileData: true,
              })
            );
          }
        } else {
          dispatch(
            setFile({
              moduleType,
              fileType: `${assetKey}Healed`,
              fileData: true,
            })
          );
        }
      } catch (error) {
        console.error(`Failed to resolve ${assetKey} URL`, error);
      }
    };

    resolveAndHeal();
  }, [
    dispatch,
    moduleType,
    assetKey,
    assetValue,
    resolvedUrl,
    fileState?.showFile,
    doctorIdFromState,
    savedPrintSettings,
    hasHealed,
    fileType,
    settingsPathKey,
  ]);

  return useMemo(() => {
    if (fileState?.showFile && isHttpUrl(fileState.showFile)) {
      return fileState.showFile;
    }
    if (resolvedUrl) {
      return resolvedUrl;
    }
    if (isHttpUrl(assetValue)) {
      return assetValue;
    }
    return null;
  }, [fileState?.showFile, resolvedUrl, assetValue]);
};

export default useResolvedAssetUrl;
