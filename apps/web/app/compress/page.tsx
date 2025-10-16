"use client";

import { ResultCard } from "@/components/compress/result-card";
import {
  Uploader,
  type CompressionResult,
} from "@/components/compress/uploader";
import { useState } from "react";

export default function CompressPage() {
  const [result, setResult] = useState<CompressionResult | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white py-4">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
              S
            </div>
            <span className="text-xl font-bold text-gray-900">
              Smart Compress
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              AI 智能图片压缩
            </h1>
            <p className="mt-2 text-gray-600">
              在浏览器中完成压缩,保护您的隐私
            </p>
          </div>

          {/* 上传器或结果卡片 */}
          <div className="mx-auto max-w-3xl">
            {result ? (
              <ResultCard result={result} onReset={() => setResult(null)} />
            ) : (
              <Uploader onCompressionComplete={setResult} />
            )}
          </div>

          {/* 特性说明 */}
          {!result && (
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
                  🔒
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">隐私安全</h3>
                <p className="text-sm text-gray-600">本地压缩,不上传服务器</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
                  ⚡
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">快速高效</h3>
                <p className="text-sm text-gray-600">多线程处理,秒级完成</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-2xl">
                  🎯
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">智能优化</h3>
                <p className="text-sm text-gray-600">三档模式,灵活选择</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          <p>
            <span className="font-semibold">Smart Compress</span> · 基于{" "}
            <span className="font-semibold">browser-image-compression</span>{" "}
            构建
          </p>
        </div>
      </footer>
    </div>
  );
}
