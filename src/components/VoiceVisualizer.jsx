// VoiceVisualizer.jsx
import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";

const VoiceVisualizer = ({
  audioStream,
  isRecording,
  isPaused = false,
  width = 250,
  maxHeight = 40,
  smoothness = 0.8,
  barsCount = 48,
  minHeight = 1,
  sensitivity = 2.5, // higher = easier to reach max
}) => {
  const [bars, setBars] = useState(() => new Array(barsCount).fill(minHeight));

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);
  const levelRef = useRef(0);

  // Reset bars when config changes
  useEffect(() => {
    setBars(new Array(barsCount).fill(minHeight));
  }, [barsCount, minHeight]);

  useEffect(() => {
    if (!audioStream || !isRecording) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      console.warn("Web Audio API not supported");
      return;
    }

    let source = null;

    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      audioContextRef.current = new AudioCtx();
    }
    const audioContext = audioContextRef.current;

    try {
      source = audioContext.createMediaStreamSource(audioStream);
    } catch (e) {
      console.error("Error creating MediaStreamSource", e);
      return;
    }

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.3;

    source.connect(analyser);
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    dataArrayRef.current = dataArray;

    const heightScale = maxHeight - minHeight;

    const renderFrame = () => {
      if (!analyserRef.current) return;

      if (!isPaused) {
        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

        // SIMPLE PEAK AMPLITUDE (works reliably)
        let max = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = Math.abs(dataArrayRef.current[i] - 128);
          if (v > max) max = v;
        }

        // Normalize & boost
        let amplitude = (max / 128) * sensitivity; // 0..>1
        if (amplitude > 1) amplitude = 1;
        if (amplitude < 0) amplitude = 0;

        // Gentle curve so mid volumes go higher
        const curved = Math.pow(amplitude, 0.7);

        levelRef.current =
          levelRef.current * smoothness + curved * (1 - smoothness);
      } else {
        // decay to dots when paused
        levelRef.current = levelRef.current * smoothness;
      }

      const currentHeight = minHeight + levelRef.current * heightScale;

      setBars((prev) => {
        const next = prev.slice(1);
        next.push(currentHeight);
        return next;
      });

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (source) {
        try {
          source.disconnect();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [
    audioStream,
    isRecording,
    isPaused,
    maxHeight,
    smoothness,
    barsCount,
    minHeight,
    sensitivity,
  ]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div
      className="wave-visualizer"
      style={{ width: `${width}px`, height: `${maxHeight}px` }}
    >
      <div className="wave-visualizer__bars">
        {bars.map((h, idx) => (
          <div
            key={idx}
            className="wave-visualizer__bar"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
    </div>
  );
};

export default VoiceVisualizer;
