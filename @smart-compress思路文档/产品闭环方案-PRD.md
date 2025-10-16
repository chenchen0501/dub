## smart-compress × dub — 产品闭环方案（PRD）

面向 MVP → V1.0 的端到端产品方案，覆盖：登录/注册、计费与支付、AI 接入策略、数据与配额、风控与合规、指标与埋点、迭代路线。

---

### 1. 产品目标与定位
- **定位**：一键智能图片压缩工具，AI 推荐最佳压缩参数；前端本地压缩，隐私友好，极低成本。
- **目标用户**：设计师、产品与前端、内容运营、独立站主。
- **核心价值**：节省调参时间、默认隐私安全、跨端可用、性价比高。

---

### 2. 用户旅程（闭环）
1) 未注册访问首页 → 上传样例图片 → 体验一次压缩（访客试用额度）
2) 触发登录注册（Google/GitHub/邮箱）→ 完成注册 → 获取基础日额度
3) 正常使用：上传 → 提取元数据 → /api/deepseek 推荐参数 → 本地压缩 → 下载
4) 达到配额上限 → 引导购买 Pro 订阅（Stripe）→ 升级后额度/并发/高级功能解锁
5) Dashboard 查看近 7 日使用、账单与订阅状态 → 续费/取消/退款入口

---

### 3. 账号与认证（基于 dub）
- **登录方式**：
  - OAuth：Google、GitHub（首选）
  - 邮箱登录（后续）
- **实现**：NextAuth + Supabase；用户表沿用 dub 结构；会话在 App Router 下复用现有中间件。
- **注册流程**：
  - 首次登录即注册，初始化用户档位为 `Free`，写入默认每日额度
  - 支持注销账号（导出/清除个人数据）
- **安全**：
  - 服务端仅保管 `DEEPSEEK_API_KEY`、Stripe 密钥；RLS 保护个人数据
  - CSRF、OAuth 状态校验、Rate Limit（后续 Upstash）

---

### 4. 计费与订阅
- **档位设计（MVP）**：
  - Free：每日 10 次 AI 调参、单次 20MB、单图压缩
  - Pro（月付）：每日 500 次、单次 100MB、批量压缩（V2）、格式自动决策（V2）
- **价格（占位）**：$5/月（后续 A/B）
- **实现**：Stripe Checkout / Billing Portal
  - 订阅创建/取消/续费由 Stripe 托管
  - Webhook 同步订阅状态 → 更新 Supabase 用户档位与配额阈值
- **发票与税务**：完全交由 Stripe 处理，前端展示下载入口

---

### 5. AI 接入策略（DeepSeek）
- **输入不含原图**：仅上传元数据（`width/height/sizeKB/type/complexityHint`）
- **输出**：严格 JSON `{ quality, maxWidth, maxHeight }`
- **稳定性**：
  - 服务端强校验（Zod），异常回退到本地启发式参数
  - 结果本地缓存（尺寸区间×类型×大小分档×复杂度）减少重复调用
  - 统一超时与重试（指数退避，最多 2 次）
- **演进**：V2 引入格式推荐（WebP/AVIF），V3 引入质量/PSNR 预估

---

### 6. 产品功能范围（MVP → V1.0）
- MVP：
  - 上传/拖拽、进度/取消、前端 Worker 压缩
  - AI 参数推荐（服务端代理）、“轻/中/重”三档
  - 登录/注册、Free 配额、本地缓存、Dashboard 基础
  - 简单埋点与错误上报
- V1.0（在 MVP 基础上）：
  - 订阅付费/退款流程、账单中心
  - 批量压缩、格式自动推荐
  - 云端配额与多端同步、限流与风控

---

### 7. 数据模型与配额
- 本地（MVP）：`localStorage` 保存 `{ date, usedCount }`
- 云端（V1.0）：`quota_usage(user_id, date, used_count)`（Supabase）
  - 每次成功获取 AI 参数后 +1（失败不计费）
  - 结合订阅档位计算 `daily_limit`；RLS 保证用户仅读写自己的记录
- 订阅状态：`users.subscription_tier`、`subscription_status`、`stripe_customer_id`

---

### 8. 支付流程（Stripe）
1) 用户在 Pricing 中选择 Pro → 跳转到 Stripe Checkout
2) 支付成功 → 回跳成功页；Stripe Webhook 通知后端
3) 后端根据 Webhook 更新用户档位与 `daily_limit`
4) Dashboard 实时展示订阅状态、下次扣款日、发票下载
5) 取消订阅 → 订阅到期日后降级 `Free`

---

### 9. 关键页面与接口
- 页面：
  - `/`：上传/压缩页（核心任务流）
  - `/dashboard`：配额与历史、订阅信息
  - `/pricing`：定价与权益对比，进入 Stripe Checkout
- API：
  - `POST /api/deepseek`：输入元数据 → 返回 JSON 参数
  - `GET/POST /api/quota`（V1.0）：查询/写入配额
  - `POST /api/stripe/webhook`：订阅事件同步

---

### 10. 指标与埋点
- 转化漏斗：访问→试用→登录→首次压缩→到达上限→进入支付→成功订阅
- 体验指标：平均压缩时长、错误率、AI JSON 失败率、降级比例
- 业务指标：DAU、订阅转化率、留存、ARPU、退款率
- 技术指标：API 错误分布、超时率、缓存命中率

---

### 11. 风控与合规
- 不上传原图像像素数据；仅传元数据（在隐私政策中说明）
- DeepSeek/Stripe 密钥仅在服务端保存；前端不暴露
- 基础速率限制与 Origin 校验，防止 API 滥用（后续 Upstash）
- 数据合规：GDPR/CCPA 最小化收集；用户删除账号一键清除数据

---

### 12. 上线标准（DoD）
- 95% 图片可一次完成“上传→推荐→压缩→下载”
- 平均 AI 调用成本 < $0.001；常规图像 ≤ 3s 完成
- 订阅流程端到端可用：购买/取消/发票下载
- 错误可见、可重试、可降级；隐私合规

---

### 13. 里程碑与排期（建议）
- Week 1：MVP（体验闭环、访客试用、登录、AI 推荐、本地配额、部署）
- Week 2：V1.0（Stripe 订阅、Dashboard 强化、云端配额、限流）
- Week 3：V1.1（批量、格式自动推荐、性能优化与缓存策略）

---

### 14. 依赖与风险
- 依赖：DeepSeek 稳定性、Stripe 可用性、Vercel 免费层限额
- 风险：AI JSON 偶发不稳、大图端性能、移动端兼容、Payment 失败与退款处理
- 应对：严格 JSON + Zod、Worker/先缩后压、Progress/取消、Webhook 幂等与重试


