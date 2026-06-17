import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setFooterDimensions } from "../redux/ipd/printSettingsSlice";
import { getFooterImageHeight } from "../utils/utils";

/**
 * Ensures footer image height is calculated and cached in Redux for a module.
 * Returns the currently known rendered footer height (or null while pending).
 */
const useFooterImageHeight = ({ moduleType, footerImg, enabled = true }) => {
  const dispatch = useDispatch();

  const { fileStates, printSettings, draftSettings } = useSelector(
    (state) => state.printSettings || {}
  );

  const moduleFileStates = useMemo(
    () => (fileStates && moduleType ? fileStates[moduleType] || {} : {}),
    [fileStates, moduleType]
  );

  const fileFooter = moduleFileStates.fileFooter || {};
  const settingsFooter =
    printSettings?.[moduleType]?.headerFooter?.footer ||
    draftSettings?.[moduleType]?.headerFooter?.footer ||
    {};
  const fileFooterMatches = !fileFooter.showFile || fileFooter.showFile === footerImg;
  const settingsFooterMatches =
    !settingsFooter.footerImg || settingsFooter.footerImg === footerImg;

  const renderedFooterImageHeight =
    (fileFooterMatches ? fileFooter.renderedFooterImageHeight : null) ??
    (settingsFooterMatches ? settingsFooter.renderedFooterImageHeight : null) ??
    null;

  useEffect(() => {
    if (!enabled || !moduleType || !footerImg) return;
    if (typeof renderedFooterImageHeight === "number") return;

    let cancelled = false;

    const computeHeight = async () => {
      try {
        const height = await getFooterImageHeight(footerImg);
        if (cancelled || height == null) return;

        dispatch(
          setFooterDimensions({
            moduleType,
            dimensions: {
              renderedFooterImageHeight: height,
              showFile: footerImg,
              imageShow: true,
            },
          })
        );
      } catch (error) {
        console.error("Failed to compute footer image height", error);
      }
    };

    computeHeight();

    return () => {
      cancelled = true;
    };
  }, [dispatch, enabled, footerImg, moduleType, renderedFooterImageHeight]);

  return renderedFooterImageHeight;
};

export default useFooterImageHeight;
