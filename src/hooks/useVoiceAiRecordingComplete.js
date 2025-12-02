import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { voiceRx } from "../redux/ipd/ipdSlice";
import { isEmptyRichText } from "../utils/utils";

const buildParagraphFromText = (text = "") => [
  {
    type: "paragraph",
    children: [{ text }],
  },
];

export const parseVoiceAiRichText = (
  response,
  { selector, fallbackToTranscription = true } = {}
) => {
  if (response?.meta?.requestStatus !== "fulfilled") {
    return { data: null, success: false };
  }

  const historyEntry = response?.payload?.data?.rxDigitizationHistory?.[0];
  const transcription = historyEntry?.payload?.transcription;

  let updatedData =
    typeof selector === "function"
      ? selector(historyEntry?.response || {})
      : historyEntry?.response || [];

  if (fallbackToTranscription && isEmptyRichText(updatedData)) {
    if (transcription) {
      updatedData = buildParagraphFromText(transcription);
    }
  }

  if (fallbackToTranscription && isEmptyRichText(updatedData)) {
    return { data: null, success: true };
  }

  return { data: updatedData, success: true };
};

export const useVoiceAiRecordingComplete = ({ patientId, admissionId }) => {
  const dispatch = useDispatch();

  const submitVoiceAiRecording = useCallback(
    async ({
      payload,
      schemaKey,
      previousOutput,
      onSuccess,
      callback,
      parseResponse = parseVoiceAiRichText,
      selector,
      fallbackToTranscription = true,
      requestOverrides = {},
    }) => {
      if (!patientId || !admissionId || !schemaKey) {
        callback?.();
        return;
      }

      const response = await dispatch(
        voiceRx({
          patientId,
          admissionId,
          schemaKey,
          audioFile: payload?.audioBlob,
          filename: payload?.filename,
          mimeType: payload?.mimeType,
          previousOutput:
            typeof previousOutput === "function"
              ? previousOutput()
              : previousOutput,
          ...requestOverrides,
        })
      );

      const { data, success } = parseResponse(response, {
        selector,
        fallbackToTranscription,
      });

      if (success && data !== null && data !== undefined) {
        onSuccess?.(data, response);
      }

      callback?.();
    },
    [admissionId, dispatch, patientId]
  );

  return { submitVoiceAiRecording };
};
