import { useEffect, useReducer } from "react";

import ApiIpdService from "../api/services/ipd/ipdService";

const cache = new Map();
const inFlight = new Map();

const toKey = (patientUniqueId) => {
  if (patientUniqueId == null || patientUniqueId === "") return null;
  return String(patientUniqueId);
};

const fetchAndCache = (key) => {
  if (inFlight.has(key)) return inFlight.get(key);

  const promise = ApiIpdService.getTpmlReferenceId({ patientUniqueId: key })
    .then((res) => {
      const value = res?.tpml_refrence_id ?? res?.tpml_reference_id ?? null;
      cache.set(key, value);
      return value;
    })
    .catch((err) => {
      // Do not cache transient failures; the next mount will retry.
      console.error("Error fetching TPML reference id:", err);
      return null;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
};

export const clearTpmlReferenceIdCache = (patientUniqueId) => {
  const key = toKey(patientUniqueId);
  if (key == null) {
    cache.clear();
    inFlight.clear();
    return;
  }
  cache.delete(key);
  inFlight.delete(key);
};

/**
 * Resolves the patient's MRN (TPML reference id) for use BEFORE invoking
 * `pdf(...).toBlob()` from @react-pdf/renderer, whose one-shot render
 * pipeline cannot await async state updates from within the PDF tree.
 *
 * The cache is read synchronously in render keyed by the current
 * `patientUniqueId`, so a prop change immediately yields the new patient's
 * value (or `null` while pending) — never the previous patient's.
 *
 * Concurrent consumers of the same id share a single in-flight request and
 * are all notified on resolution.
 *
 * @param {string | number | null | undefined} patientUniqueId
 * @returns {string | null} The resolved MRN, or `null` if missing / pending.
 */
const useTpmlReferenceId = (patientUniqueId) => {
  const [, forceRerender] = useReducer((tick) => tick + 1, 0);
  const key = toKey(patientUniqueId);

  useEffect(() => {
    if (key == null || cache.has(key)) return undefined;

    let cancelled = false;
    fetchAndCache(key).then(() => {
      if (!cancelled) forceRerender();
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return key != null ? cache.get(key) ?? null : null;
};

export default useTpmlReferenceId;
