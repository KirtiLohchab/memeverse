"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { uploadMeme } from "@/redux/memeSlice";
import NextImage from "next/image";

const UploadPage = () => {
  const dispatch = useAppDispatch();
  const uploading = useAppSelector((state) => state.memes.uploading);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setFinalImage(null);
    }
  };

  // Generate meme preview on canvas
  const updatePreview = useCallback(() => {
    if (!previewUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = previewUrl;

    img.onload = () => {
      const maxWidth = 500;
      const maxHeight = 500;
      let width = img.width;
      let height = img.height;

      // Resize image to fit within max dimensions
      if (width > height && width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      } else if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      // Add meme text
      ctx.font = "bold 30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;

      ctx.strokeText(topText, width / 2, 40);
      ctx.fillText(topText, width / 2, 40);
      ctx.strokeText(bottomText, width / 2, height - 20);
      ctx.fillText(bottomText, width / 2, height - 20);
    };
  }, [previewUrl, topText, bottomText]);

  // Automatically update preview when inputs change
  useEffect(() => {
    if (previewUrl) {
      updatePreview();
    }
  }, [previewUrl, updatePreview]);

  // Upload Meme
  const handleUpload = async () => {
    if (!finalImage) return alert("Generate meme before uploading");

    try {
      const blob = await fetch(finalImage).then((res) => res.blob());
      const file = new File([blob], "meme.png", { type: "image/png" });

      dispatch(uploadMeme({ file, caption: `${topText} - ${bottomText}` }));
      alert("Meme uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  // Download Meme
  const handleDownload = () => {
    if (!finalImage) return;
    const link = document.createElement("a");
    link.href = finalImage;
    link.download = "meme.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-8 m-10 border bg-gray-200 dark:bg-slate-800 rounded-lg flex flex-col items-center gap-6">
      {/* Upload and Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="flex flex-col text-black gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 text-slate-400 rounded"
          />
          <input
            type="text"
            placeholder="Top Text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            className="border p-2 rounded text-center"
          />
          <input
            type="text"
            placeholder="Bottom Text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            className="border p-2 rounded text-center"
          />
        </div>

        {/* Meme Preview */}
        <div className="flex justify-center items-center">
          {previewUrl ? (
            <canvas
              ref={canvasRef}
              className="border rounded-lg shadow-lg w-100 h-100"
            />
          ) : (
            <p className="text-gray-500">No preview available</p>
          )}
        </div>
      </div>

      {/* Generate Meme Button */}
      <button
        onClick={() => {
          if (canvasRef.current) {
            setFinalImage(canvasRef.current.toDataURL());
          }
        }}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={!previewUrl}
      >
        Generate Meme
      </button>

      {/* Upload & Download Buttons */}
      {finalImage && (
        <div className="flex flex-col items-center gap-4">
          <NextImage
            src={finalImage}
            alt="Final Meme"
            width={400}
            height={400}
          />
          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              className="bg-green-500 text-white p-2 rounded disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Meme"}
            </button>
            <button
              onClick={handleDownload}
              className="bg-gray-700 text-white p-2 rounded"
            >
              Download Meme
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
