## AI 智能图片压缩参数推荐 — MVP 改造计划 To-Do List

适用范围：基于 Next.js（apps/web）、DeepSeek API、browser-image-compression、Dub 登录体系（NextAuth + Supabase）

---

### 0. 准备与基线（Prerequisites）
- [ ] 在 Vercel/Supabase 控制台创建项目（或复用现有 dub 项目）
- [ ] 配置环境变量（本地和 Vercel）：
  - [ ] `DEEPSEEK_API_KEY`
  - [ ] `NEXTAUTH_URL`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `SUPABASE_URL` / `SUPABASE_ANON_KEY`（若需要云端配额/后续演进）
- [ ] 复用 dub 已有的 NextAuth + Supabase 登录配置（无需另起账号体系）
- [ ] （V1 预留）Stripe 变量：`STRIPE_SECRET_KEY`、`STRIPE_WEBHOOK_SECRET`
- [ ] 在 `apps/web` 安装依赖：`browser-image-compression`
- [ ] 预置基础 UI 规范与错误处理约定（沿用项目统一风格与 Zod 校验）

验收标准：本地 `pnpm --filter web dev` 可启动；环境变量就绪；能渲染首页空白框架。

---

### Day 1：最小闭环（本地压缩管道）
- [ ] 新建页面结构：
  - [ ] `apps/web/app/page.tsx`（首页：上传&压缩）
  - [ ] `apps/web/components/Uploader.tsx`（文件选择/拖拽上传）
- [ ] 引入并打通 `browser-image-compression`：
  - [ ] 固定参数（quality=0.8、maxWidth=1920）先跑通
  - [ ] 启用 `useWebWorker: true`
- [ ] 输出结果与下载：
  - [ ] 显示原图/压缩后体积、压缩率
  - [ ] 一键下载压缩后图片
- [ ] 访客试用（无登录）：
  - [ ] 当日允许 1 次 AI 请求与压缩闭环（`localStorage` 记录）
  - [ ] 试用结束后弹出登录引导（进入 Day 2 登录流）

验收标准：选择本地图像→完成压缩→能下载；常见 JPG/PNG 正常；桌面/移动端基础可用。

---

### Day 2：登录与配额（MVP 本地版）
- [ ] 接入 dub 已有登录（NextAuth + Supabase：Google/GitHub）
  - [ ] 登录态显示在首页（头像/昵称/登录按钮）
  - [ ] 压缩操作需登录（除“访客试用”配额外）
- [ ] 本地配额（MVP）：
  - [ ] `apps/web/lib/quota.ts`（`localStorage`：{date, usedCount}，每日上限=10）
  - [ ] `apps/web/components/QuotaBar.tsx`（展示剩余额度）
  - [ ] 压缩前检查与压缩后更新用量；超限提示
- [ ] 试用转化引导：超过访客额度或首次成功后，提示登录以获得每日 10 次

验收标准：登录后方可压缩；超限被阻止并提示；刷新后额度仍正确（按日重置）。

---

### Day 3：AI 参数推荐链路
- [ ] 服务端 API（仅接收元数据，不上传原图）：
  - [ ] `apps/web/app/api/deepseek/route.ts`
  - [ ] 读取 `DEEPSEEK_API_KEY`，调用 DeepSeek Chat API（严格 JSON 模式）
  - [ ] 输入/输出使用 Zod 校验：
    - 输入：width、height、sizeKB、type、complexityHint
    - 输出：`{ quality: number, maxWidth: number, maxHeight: number }`
  - [ ] 失败回退：返回本地启发式参数（不阻塞主流程）
  - [ ] 超时与重试（指数退避，最多 2 次）；统一错误码与提示文案
  - [ ] 基础安全：校验 `Origin`，过滤可疑 prompt 注入字段
- [ ] 前端封装：
  - [ ] `apps/web/lib/deepseek.ts`（请求封装、结果校验、异常降级）
  - [ ] 特征提取（前端）：分辨率/文件大小/类型/简单复杂度估计
  - [ ] “轻/中/重”三档推荐（基于一个结果派生：±quality/尺寸）
- [ ] 接入压缩管道：拿到参数→执行前端压缩→下载

验收标准：常见图片可获得稳定 JSON；解析失败率 < 2%，失败自动降级后仍可完成压缩。

---

### Day 4：体验与稳定性优化
- [ ] Worker/并发安全：
  - [ ] 进度条、取消操作、错误可视化
  - [ ] 大图（>4000px）提示先缩放再压缩
- [ ] 结果展示：
  - [ ] `apps/web/components/ResultCard.tsx`（原图/结果体积、压缩率、再次压缩）
- [ ] 简单缓存：
  - [ ] 对“尺寸区间 × 类型 × 大小分档 × 复杂度”的推荐结果做本地缓存（localStorage/IndexedDB）
- [ ] 统一错误提示文案与重试逻辑
 - [ ] 基础埋点：试用→登录→首压缩→达到上限→进入支付（事件占位）

验收标准：5MB、4000×3000 图片 ≤ 3s 完成；UI 有进度与取消；异常可重试；缓存命中降低 AI 调用。

---

### Day 5：Dashboard 与部署
- [ ] Dashboard：`apps/web/app/dashboard/page.tsx`
  - [ ] 近 7 日配额使用折线/柱状（本地存储聚合）
  - [ ] 最近压缩记录（仅本地缓存版）
- [ ] 多语言占位（与 dub i18n 兼容的结构占位，不强制翻译）
- [ ] README 与环境变量模板更新（根目录或 `apps/web`）
- [ ] Vercel 部署：
  - [ ] 绑定环境变量，私有 Key 不下发到客户端
  - [ ] 基础速率限制（可先基于 Vercel 防抖/简易校验，后续 Upstash）
- [ ] Pricing 页面占位：`apps/web/app/pricing/page.tsx`（权益对比与升级 CTA）
- [ ] Stripe 占位（V1 准备）：
  - [ ] `apps/web/app/api/stripe/webhook/route.ts` 空实现（记录 TODO）
  - [ ] Dashboard 中订阅卡片占位（仅展示“即将上线”）

验收标准：线上可用；移动端基础可用；Dashboard 数据与本地配额一致；README 指南完整。

---

### 定义完成（Definition of Done）
- [ ] 95% 常见图片类型可一键完成“上传→AI 推荐→压缩→下载”
- [ ] 平均单次 AI 成本 < $0.001；日活 100 成本 < $0.1
- [ ] 性能：普通笔电 5MB/4K 图 ≤ 3s 完成（Worker 下）
- [ ] 稳定性：AI JSON 解析失败率 < 2%，全部可降级完成
- [ ] 隐私：仅传输元数据，不上传原图；服务端密钥不下发
- [ ] 访客可在无登录状态完成 1 次完整试用并得到明确登录引导

---

### 风险与对策清单（速查）
- [ ] JSON 解析不稳 → 严格 JSON + Zod 校验 + 本地降级
- [ ] 大图内存与耗时 → Worker、先缩后压、进度与取消
- [ ] 兼容性差异 → MVP 以 JPEG/WebP；AVIF 放入 V2
- [ ] 滥用与成本 → 本地配额；服务端基础限流；后续 Upstash
- [ ] 安全 → Key 仅在服务端；过滤 Prompt 注入；校验 Origin

---

### 目录与文件（建议最小集）
```
apps/web/
  app/
    page.tsx
    dashboard/page.tsx
    pricing/page.tsx
    api/
      deepseek/route.ts
      stripe/webhook/route.ts
  lib/
    deepseek.ts
    quota.ts
  components/
    Uploader.tsx
    ResultCard.tsx
    QuotaBar.tsx
```

---

### 后续演进（占位）
- [ ] V2：格式自动决策（WebP/AVIF）、批量处理、Upstash 限流、云端配额
- [ ] V3：质量估计可视化、历史记录云端化、团队空间
- [ ] V4：Stripe 支付与高级档位、完整 i18n 接入


