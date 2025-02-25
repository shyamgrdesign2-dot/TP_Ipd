import React, { useEffect, useRef } from "react";
import SiriWave from "siriwave";

const VoiceWaveVisualizer = ({ isRecording, isPaused }) => {
  const containerRef = useRef(null);
  const waveRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize SiriWave
  useEffect(() => {
    if (containerRef.current && !waveRef.current) {
      waveRef.current = new SiriWave({
        container: containerRef.current,
        width: containerRef.current.clientWidth,
        height: 60,
        style: "ios9",
        speed: 0.3,
        amplitude: 1.2,
        frequency: 6,
        autostart: false, // Changed to false to manually control
      });

      // Start the wave immediately if not paused
      if (!isPaused) {
        waveRef.current.start();
      }
    }

    return () => {
      if (waveRef.current) {
        waveRef.current.dispose();
        waveRef.current = null;
      }
    };
  }, []);

  // Handle pause state changes
  useEffect(() => {
    if (waveRef.current) {
      if (isPaused) {
        waveRef.current.stop();
      } else if (isRecording) {
        waveRef.current.start();
      }
    }
  }, [isPaused, isRecording]);

  // Handle audio analysis and wave control
  useEffect(() => {
    const setupAudio = async () => {
      try {
        if (isRecording && !isPaused) {
          // Initialize audio context and analyzer
          if (
            !audioContextRef.current ||
            audioContextRef.current.state === "closed"
          ) {
            audioContextRef.current = new (window.AudioContext ||
              window.webkitAudioContext)();
          }
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;

          // Get audio stream
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          streamRef.current = stream;

          // Connect audio nodes
          const source =
            audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);

          const dataArray = new Uint8Array(
            analyserRef.current.frequencyBinCount
          );

          // Animation function
          const updateWave = () => {
            if (!isPaused && isRecording && waveRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              const average =
                dataArray.reduce((a, b) => a + b) / dataArray.length;
              const amplitude = Math.max(0.1, Math.min(1.5, average / 128));
              waveRef.current.setAmplitude(amplitude * 15);
              animationFrameRef.current = requestAnimationFrame(updateWave);
            }
          };

          updateWave();
        } else {
          // Clean up resources
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          if (
            audioContextRef.current &&
            audioContextRef.current.state !== "closed"
          ) {
            audioContextRef.current.close();
            audioContextRef.current = null;
          }
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          if (waveRef.current) {
            waveRef.current.setAmplitude(0.1);
            if (!isRecording) {
              waveRef.current.stop();
            }
          }
        }
      } catch (error) {
        console.error("Error setting up audio:", error);
      }
    };

    setupAudio();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, isPaused]);

  return (
    <div className="wave-container">
      <div ref={containerRef} />
      <style jsx>{`
        .wave-container {
          width: 100%;
          height: 70px;
          background: transparent;
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default VoiceWaveVisualizer;
