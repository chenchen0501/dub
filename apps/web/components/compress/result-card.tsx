"use client";

import { Button } from "@dub/ui";
import { cn } from "@dub/utils";
import { Download, FileImage, RefreshCw } from "lucide-react";
import type { CompressionResult } from "./uploader";

interface ResultCardProps {
  result: CompressionResult;
  onReset: () => void;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function ResultCard({ result, onReset, className }: ResultCardProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(result.compressedFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed-${result.originalFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileImage className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">压缩完成</h3>
        </div>
        <Button
          text="重新压缩"
          variant="secondary"
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={onReset}
        />
      </div>

      <div className="space-y-4">
        {/* 文件信息 */}
        <div className="rounded-md bg-gray-50 p-4">
          <div className="mb-2 text-sm font-medium text-gray-700">文件名称</div>
          <div className="text-sm text-gray-600">
            {result.originalFile.name}
          </div>
        </div>

        {/* 压缩统计 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md border border-gray-200 p-4">
            <div className="mb-1 text-xs text-gray-500">原始大小</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatFileSize(result.originalSize)}
            </div>
          </div>

          <div className="rounded-md border border-gray-200 p-4">
            <div className="mb-1 text-xs text-gray-500">压缩后</div>
            <div className="text-lg font-semibold text-green-600">
              {formatFileSize(result.compressedSize)}
            </div>
          </div>
        </div>

        {/* 压缩率和耗时 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md bg-green-50 p-4">
            <div className="mb-1 text-xs text-green-700">压缩率</div>
            <div className="text-xl font-bold text-green-600">
              {result.compressionRatio.toFixed(1)}%
            </div>
          </div>

          <div className="rounded-md bg-blue-50 p-4">
            <div className="mb-1 text-xs text-blue-700">耗时</div>
            <div className="text-xl font-bold text-blue-600">
              {(result.duration / 1000).toFixed(2)}s
            </div>
          </div>
        </div>

        {/* 下载按钮 */}
        <Button
          text="下载压缩图片"
          icon={<Download className="h-4 w-4" />}
          onClick={handleDownload}
          className="w-full"
        />

        {/* 提示信息 */}
        <div className="rounded-md bg-blue-50 p-3">
          <p className="text-xs text-blue-800">
            💡 压缩在您的浏览器中完成，图片未上传到服务器
          </p>
        </div>
      </div>
    </div>
  );
}
