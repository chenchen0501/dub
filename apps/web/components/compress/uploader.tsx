"use client";

import { Button } from "@dub/ui";
import { cn } from "@dub/utils";
import imageCompression from "browser-image-compression";
import { Upload } from "lucide-react";
import { useCallback, useState } from "react";

export type CompressionMode = "high-quality" | "balanced" | "minimum-size";

interface UploaderProps {
  onCompressionComplete: (result: CompressionResult) => void;
  className?: string;
}

export interface CompressionResult {
  originalFile: File;
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  duration: number;
  mode: CompressionMode;
}

const COMPRESSION_MODES = [
  {
    id: "high-quality" as CompressionMode,
    name: "高品质",
    description: "保持高画质,适度压缩",
    quality: 0.92,
    maxSize: 10,
  },
  {
    id: "balanced" as CompressionMode,
    name: "平衡",
    description: "画质与体积平衡",
    quality: 0.8,
    maxSize: 5,
  },
  {
    id: "minimum-size" as CompressionMode,
    name: "最小体积",
    description: "最大压缩率",
    quality: 0.6,
    maxSize: 1,
  },
];

export function Uploader({ onCompressionComplete, className }: UploaderProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<CompressionMode>("balanced");

  const compressImage = useCallback(
    async (file: File, mode: CompressionMode) => {
      setIsCompressing(true);
      setProgress(0);
      setError(null);

      const startTime = Date.now();

      try {
        const modeConfig = COMPRESSION_MODES.find((m) => m.id === mode)!;

        const options = {
          maxSizeMB: modeConfig.maxSize,
          maxWidthOrHeight: 1920,
          initialQuality: modeConfig.quality,
          useWebWorker: true,
          onProgress: (p: number) => {
            setProgress(p);
          },
        };

        const compressedFile = await imageCompression(file, options);
        const duration = Date.now() - startTime;

        const result: CompressionResult = {
          originalFile: file,
          compressedFile,
          originalSize: file.size,
          compressedSize: compressedFile.size,
          compressionRatio:
            ((file.size - compressedFile.size) / file.size) * 100,
          duration,
          mode,
        };

        onCompressionComplete(result);
      } catch (err) {
        console.error("压缩失败:", err);
        setError(err instanceof Error ? err.message : "压缩失败");
      } finally {
        setIsCompressing(false);
        setProgress(0);
      }
    },
    [onCompressionComplete],
  );

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];

      // 校验文件类型
      if (!file.type.startsWith("image/")) {
        setError("请选择图片文件");
        return;
      }

      // 校验文件大小（20MB）
      if (file.size > 20 * 1024 * 1024) {
        setError("文件大小不能超过 20MB");
        return;
      }

      compressImage(file, selectedMode);
    },
    [compressImage, selectedMode],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  return (
    <div className={cn("w-full", className)}>
      {/* 压缩模式选择 */}
      <div className="mb-6">
        <label className="mb-3 block text-sm font-medium text-gray-700">
          压缩模式
        </label>
        <div className="grid grid-cols-3 gap-3">
          {COMPRESSION_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setSelectedMode(mode.id)}
              disabled={isCompressing}
              className={cn(
                "rounded-lg border-2 p-4 text-left transition-all",
                selectedMode === mode.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300",
                isCompressing && "cursor-not-allowed opacity-50",
              )}
            >
              <div className="font-semibold text-gray-900">{mode.name}</div>
              <div className="mt-1 text-xs text-gray-500">
                {mode.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 上传区域 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:border-gray-400",
          isCompressing && "pointer-events-none opacity-50",
        )}
      >
        <Upload className="mb-4 h-12 w-12 text-gray-400" />

        <div className="mb-4 text-center">
          <p className="text-lg font-medium text-gray-900">
            {isCompressing ? "正在压缩..." : "上传图片"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {isCompressing
              ? `进度: ${progress}%`
              : "拖拽图片到此处,或点击选择文件"}
          </p>
          {!isCompressing && (
            <p className="mt-1 text-xs text-gray-400">
              支持 JPG、PNG、WebP,最大 20MB
            </p>
          )}
        </div>

        {!isCompressing && (
          <Button
            text="选择文件"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                handleFileSelect(target.files);
              };
              input.click();
            }}
          />
        )}

        {isCompressing && (
          <div className="mt-4 w-full max-w-xs">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
