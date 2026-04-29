"use client";
import { useEffect, useRef, useState } from "react";

export default function AnimeMatrixInteractive({
  images = ["/Assets/logo1.png", "/Assets/logo2.png", "/Assets/logo3.png"],
  pixelSize = 6,
  color = "#00ffea",
  fadeOpacity = 0.15, // میزان محو شدن تصویر
  switchInterval = 4000,
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;

    let imgDataCache = [];

    // بارگذاری قبلی تصاویر
    images.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const temp = document.createElement("canvas");
        temp.width = w;
        temp.height = h;
        const tctx = temp.getContext("2d")!;
        tctx.drawImage(img, 0, 0, w, h);
        const data = tctx.getImageData(0, 0, w, h);
        imgDataCache[i] = data;
      };
    });

    const cols = Math.floor(w / pixelSize);
    const rows = Math.floor(h / pixelSize);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const data = imgDataCache[currentIdx];
      if (!data) {
        requestAnimationFrame(draw);
        return;
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * pixelSize * data.width + x * pixelSize) * 4;
          const brightness =
            (data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3 / 255;

          // فاصله از موس
          const dx = x * pixelSize - mouse.x;
          const dy = y * pixelSize - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let intensity = brightness;

          // در حالت hover کل تصویر محو بشه، فقط جای موس واضح بمونه
          if (hovered) {
            intensity = Math.max(0, brightness - fadeOpacity);
            if (dist < 60) intensity = Math.min(1, brightness + 0.6);
          }

          ctx.fillStyle = `rgba(0,255,240,${intensity})`;
          ctx.beginPath();
          ctx.arc(
            x * pixelSize + pixelSize / 2,
            y * pixelSize + pixelSize / 2,
            pixelSize * 0.4,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }

      requestAnimationFrame(draw);
    }

    draw();
  }, [currentIdx, images, pixelSize, color, fadeOpacity, hovered, mouse]);

  // سوییچ اتومات تصویرا
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((p) => (p + 1) % images.length);
    }, switchInterval);
    return () => clearInterval(interval);
  }, []);

  // رویداد ماوس
  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={160}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMouse({ x: -1000, y: -1000 });
      }}
      className="cursor-crosshair"
    />
  );
}
