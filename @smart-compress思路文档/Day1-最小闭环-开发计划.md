## Day 1 — 最小闭环（本地压缩管道）开发计划

目标：在本地端（浏览器）完成“选择图片 → 压缩 → 下载”的最小可用闭环，启用 Web Worker、展示进度与结果对比，为 Day 2 登录与配额、Day 3 AI 参数推荐打基础。

---

### 1. 范围与成果
- 范围：仅前端本地压缩（`browser-image-compression`），固定参数先跑通（quality=0.8, maxWidth=1920），不接 AI 与登录。
- 成果：
  - 首页可选择/拖拽上传图片
  - 显示压缩进度与结果信息（原图/压缩后体积、压缩率）
  - 一键下载压缩后的图片
  - 移动端基础可用，4K 大图 ≤ 3s（普通笔电）

---

### 2. UI 方案（沿用 dub 体系）
- 继续沿用 dub 的设计与组件体系，优先使用 `@dub/ui` 基础组件（Button、Card、Input、Progress、Modal 等）和 `@dub/utils` 的 `cn` 方法；样式使用共享 Tailwind 配置。
- 页面/业务层新增组件放在 `apps/web/components/`：
  - `Uploader.tsx`：文件选择与拖拽上传、校验、进度回调展示
  - `ResultCard.tsx`：压缩结果信息、下载按钮
- 原则：
  - 统一外观与语义（遵循 dub 的命名与层级），避免重复造轮子
  - 保持组件职责单一，便于 Day 2/3 复用

---

### 3. 目录与文件（Day 1 最小集）
```
apps/web/
  app/
    page.tsx                 # 首页：上传 & 压缩
  components/
    Uploader.tsx             # 上传/拖拽/进度
    ResultCard.tsx           # 结果信息与下载
```

---

### 4. 开发步骤
1) 依赖安装
   - 命令：`pnpm --filter web add browser-image-compression`

2) 首页骨架 `app/page.tsx`
   - 引入 `Uploader` 与 `ResultCard`（空壳先挂载）
   - 布局采用 dub 风格容器（居中栅格/卡片）

3) `components/Uploader.tsx`
   - 支持点击选择与拖拽（`<input type="file" accept="image/*" />`）
   - 基本校验：类型（jpeg/png/webp）、大小（≤ 20MB，Day1 可写死）
   - 调用 `imageCompression(file, { maxWidthOrHeight: 1920, initialQuality: 0.8, useWebWorker: true, onProgress })`
   - 通过回调将压缩后的 `Blob/File`、时间耗时、进度百分比回传给父组件

4) `components/ResultCard.tsx`
   - 展示原图体积/压缩后体积/压缩率/用时
   - 提供下载按钮（创建 `ObjectURL` + `a[download]`）

5) 交互与状态
   - `page.tsx` 维持 `sourceFile`, `compressedFile`, `progress`, `stats`（size/time）
   - 进度条使用 `@dub/ui` 的进度组件或自定义简单进度条
   - 错误提示（文件不合法/压缩失败）采用统一 Toast（沿用 dub 的提示组件）

---

### 5. 边界与性能
- 大图策略：宽高 > 4000px 时提示“将先缩放至 1920 边再压缩”（本日采用固定参数）
- 进度反馈：启用 `onProgress`，提升用户感知；提供“重置/重新选择”
- 内存与阻塞：开启 `useWebWorker: true`，避免主线程卡顿

---

### 6. 测试清单（验收）
- 功能：
  - JPG/PNG/WebP 各 1 张，均可完成选择→压缩→下载
  - 4K（≈8MP）大图 ≤ 3s；5MB 图像 ≤ 3s（普通笔电）
  - 非图片类型/超大文件（>20MB）被拒绝并有清晰提示
- 兼容：
  - 桌面 Chrome/Safari/Edge 各 1 次
  - 移动端 iOS Safari、Android Chrome 走通主线
- 观感：
  - 进度条工作正常；错误提示不遮挡主流程
  - 下载文件名带上 `-compressed` 后缀

---

### 7. 完成定义（DoD）
- 本地端完整闭环跑通；无 AI、无登录前提下单图压缩可用
- 进度/错误/下载可见可用；4K/5MB 图像≤3s
- 代码符合 dub 规范（导入顺序/导出方式/类型/Tailwind 风格）

---

### 8. 提交与后续衔接
- 提交信息建议：`feat(smart-compress): day1 local compression flow with progress`
- 为 Day 2 预留：
  - `Uploader` 提供 `onBeforeCompress` / `onAfterCompress` 钩子（后续接配额）
  - `page.tsx` 保留参数入口（后续接 AI 推荐覆盖默认参数）


