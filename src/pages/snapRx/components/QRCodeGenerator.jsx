import React, { useEffect, useRef } from "react";

const QRCodeGenerator = ({ data, size = 120 }) => {
  const canvasRef = useRef(null);

  // Simple QR code generation function (basic implementation)
  // In a real application, you would use a proper QR code library like 'qrcode'
  const generateQRCode = (text, canvas) => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const moduleSize = Math.floor(size / 25); // 25x25 grid

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Generate a simple pattern based on the text
    ctx.fillStyle = "#000000";

    // Create a hash from the text to generate consistent pattern
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Generate pattern
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        // Position detection patterns (corners)
        if (
          (row < 9 && col < 9) ||
          (row < 9 && col > 15) ||
          (row > 15 && col < 9)
        ) {
          // Corner squares
          if (
            (row < 7 && col < 7) ||
            (row < 7 && col > 17) ||
            (row > 17 && col < 7)
          ) {
            if (
              row === 0 ||
              row === 6 ||
              col === 0 ||
              col === 6 ||
              (row > 1 && row < 5 && col > 1 && col < 5)
            ) {
              ctx.fillRect(
                col * moduleSize,
                row * moduleSize,
                moduleSize,
                moduleSize
              );
            }
          }
        } else {
          // Data area - use hash to determine if module is filled
          const moduleHash = (hash + row * 25 + col) % 3;
          if (moduleHash === 0) {
            ctx.fillRect(
              col * moduleSize,
              row * moduleSize,
              moduleSize,
              moduleSize
            );
          }
        }
      }
    }

    // Add timing patterns
    for (let i = 8; i < 17; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize);
        ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize);
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current && data) {
      generateQRCode(data, canvasRef.current);
    }
  }, [data]);

  return (
    <div className="qr-code-container">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          border: "4px solid #2d3748",
          borderRadius: "8px",
          background: "#ffffff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
};

export default QRCodeGenerator;
