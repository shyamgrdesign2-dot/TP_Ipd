import { useEffect, useMemo, useState } from "react";

import ApiIpdService from "../api/services/ipd/ipdService";
import { getPatientInformation } from "../utils/utils";

const EMPTY = { mrnNo: null, pmPid: null };

const cache = new Map();
const inFlight = new Map();
// Bumped by `clearTpmlReferenceIdCache` so that responses still in flight at
// clear-time (e.g. logout) cannot repopulate the cache afterwards.
let generation = 0;

const toKey = (patientUniqueId) => {
  if (patientUniqueId == null) return null;
  const str = String(patientUniqueId).trim();
  return str === "" ? null : str;
};

const fetchIds = (key) => {
  if (inFlight.has(key)) return inFlight.get(key);
  const requested = generation;

  const promise = ApiIpdService.getTpmlReferenceId({ patientUniqueId: key })
    .then((res) => {
      const value = {
        mrnNo: res?.tpml_refrence_id ?? res?.tpml_reference_id ?? null,
        pmPid: res?.pm_pid ?? null,
      };
      if (requested === generation) cache.set(key, value);
      return value;
    })
    .catch((error) => {
      // Do not cache transient failures; the next mount will retry.
      console.error("Failed to fetch TPML reference id", error);
      return EMPTY;
    })
    .finally(() => inFlight.delete(key));

  inFlight.set(key, promise);
  return promise;
};

const overlay = (patientDetails, { mrnNo, pmPid }) => ({
  ...getPatientInformation(patientDetails),
  mrnNo: mrnNo ?? "",
  patientId: pmPid ?? "",
});

/**
 * Resolves `{ mrnNo, pmPid }` for a patient from `/patients/tpml-reference-id`.
 * Cached per patient, de-duplicated across concurrent callers, and read
 * synchronously in render so a prop change never returns a previous patient's value.
 */
const useTpmlReferenceId = (patientUniqueId) => {
  const key = toKey(patientUniqueId);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (key == null || cache.has(key)) return undefined;
    let cancelled = false;
    fetchIds(key).then(() => !cancelled && setTick((tick) => tick + 1));
    return () => {
      cancelled = true;
    };
  }, [key]);

  return (key != null && cache.get(key)) || EMPTY;
};

/** `getPatientInformation(patientDetails)` with `patientId`/`mrnNo` overridden by the API once resolved. */
export const useResolvedPatientInfo = (patientDetails) => {
  const ids = useTpmlReferenceId(patientDetails?.details?.id);
  return useMemo(
    () => (patientDetails ? overlay(patientDetails, ids) : undefined),
    [patientDetails, ids]
  );
};

/** Async variant for non-React callers (e.g. print/download utilities). */
export const resolvePatientInfoForPdf = async (patientDetails) => {
  if (!patientDetails) return undefined;
  const key = toKey(patientDetails?.details?.id);
  const ids =
    key == null
      ? EMPTY
      : cache.has(key)
      ? cache.get(key)
      : await fetchIds(key);
  return overlay(patientDetails, ids);
};

/** Clears the cache (call on logout, or pass an id to invalidate one patient). */
export const clearTpmlReferenceIdCache = (patientUniqueId) => {
  generation += 1;
  const key = toKey(patientUniqueId);
  if (key == null) {
    cache.clear();
    inFlight.clear();
    return;
  }
  cache.delete(key);
  inFlight.delete(key);
};

export default useTpmlReferenceId;
