"use client";

import { ResultCard } from "@/components/compress/result-card";
import {
  Uploader,
  type CompressionResult,
} from "@/components/compress/uploader";
import { Wordmark } from "@dub/ui";
import { useState } from "react";

export default function CompressPage() {
  const [result, setResult] = useState<CompressionResult | null>(null);

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wordmark className="h-8" />
              <span className="text-sm text-gray-500">/ 图片压缩</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">AI 智能图片压缩</h1>
          <p className="mt-2 text-gray-600">在浏览器中完成压缩，保护您的隐私</p>
        </div>

        {/* 上传或结果 */}
        <div className="mx-auto max-w-2xl">
          {!result ? (
            <Uploader onCompressionComplete={setResult} />
          ) : (
            <ResultCard result={result} onReset={handleReset} />
          )}
        </div>

        {/* 功能说明 */}
        {!result && (
          <div className="mt-12">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <span className="text-xl">🔒</span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">隐私安全</h3>
                <p className="text-sm text-gray-600">
                  所有压缩在您的浏览器中完成，图片不会上传到服务器
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <span className="text-xl">⚡</span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">快速高效</h3>
                <p className="text-sm text-gray-600">
                  使用 Web Worker 技术，不阻塞页面，压缩速度快
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">智能优化</h3>
                <p className="text-sm text-gray-600">
                  自动选择最佳压缩参数，在质量和大小间取得平衡
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          <p>
            基于{" "}
            <span className="font-semibold">browser-image-compression</span>{" "}
            构建 · Day 1 MVP
          </p>
        </div>
      </footer>
    </div>
  );
}
