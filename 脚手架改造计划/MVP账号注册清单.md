# 📝 MVP 阶段账号注册清单

## 📋 概述

本文档详细列出了基于 Dub 构建国际化 SaaS 产品在 MVP 阶段需要注册的所有账号、服务和平台，包括注册步骤、配置要点和注意事项。

## 🎯 注册优先级

### 🔴 **必需账号** (MVP 核心功能)
### 🟡 **推荐账号** (增强功能)
### 🟢 **可选账号** (未来扩展)

---

## 🔴 必需账号 (MVP 核心)

### 1. **GitHub** - 代码托管
**用途**: 代码版本控制、CI/CD、项目管理

**注册链接**: https://github.com/join

**注册信息**:
```yaml
账号类型: 个人账号 (免费)
用户名: 选择专业的用户名
邮箱: 使用企业邮箱
```

**配置步骤**:
1. 创建账号并验证邮箱
2. 设置双因素认证 (2FA)
3. 创建新的私有仓库
4. 配置 SSH 密钥
5. 邀请团队成员 (如有)

**重要设置**:
- ✅ 启用双因素认证
- ✅ 设置 SSH 密钥
- ✅ 配置 Git 用户信息
- ✅ 创建 Personal Access Token

**费用**: 免费 (私有仓库 3 个协作者)

---

### 2. **Vercel** - 部署平台
**用途**: 前端部署、边缘函数、全球 CDN

**注册链接**: https://vercel.com/signup

**注册信息**:
```yaml
账号类型: Hobby (免费)
登录方式: 使用 GitHub 账号登录
团队名称: 你的项目名称
```

**配置步骤**:
1. 使用 GitHub 账号注册
2. 连接 GitHub 仓库
3. 配置项目设置
4. 设置环境变量
5. 配置自定义域名

**重要设置**:
- ✅ 连接 GitHub 仓库
- ✅ 配置构建命令: `pnpm build`
- ✅ 设置输出目录: `apps/web/.next`
- ✅ 配置环境变量

**费用**: 免费 (100GB 带宽/月)

---

### 3. **PlanetScale** - 数据库
**用途**: MySQL 数据库、分支管理、自动扩展

**注册链接**: https://planetscale.com/

**注册信息**:
```yaml
账号类型: Hobby (免费)
登录方式: 使用 GitHub 账号登录
数据库名称: your-app-db
地区: us-east (默认)
```

**配置步骤**:
1. 使用 GitHub 账号注册
2. 创建新数据库
3. 创建分支 (main, dev)
4. 获取连接字符串
5. 配置 Prisma 连接

**重要设置**:
- ✅ 创建 `main` 和 `dev` 分支
- ✅ 获取连接字符串
- ✅ 配置 IP 白名单 (如需要)
- ✅ 启用自动备份

**连接字符串格式**:
```
mysql://username:password@host/database?sslaccept=strict
```

**费用**: 免费 (5GB 存储, 1 亿行读取/月)

---

### 4. **Upstash** - Redis 缓存
**用途**: 缓存、会话存储、限流

**注册链接**: https://upstash.com/

**注册信息**:
```yaml
账号类型: 免费账号
登录方式: 使用 GitHub 账号登录
数据库名称: your-app-cache
地区: us-east-1
```

**配置步骤**:
1. 使用 GitHub 账号注册
2. 创建 Redis 数据库
3. 获取连接信息
4. 配置环境变量
5. 测试连接

**重要设置**:
- ✅ 选择合适的地区
- ✅ 获取 REST URL 和 Token
- ✅ 配置 TLS 连接
- ✅ 设置过期策略

**连接信息**:
```bash
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

**费用**: 免费 (10K 命令/天, 256MB 存储)

---

### 5. **Stripe** - 支付处理
**用途**: 订阅管理、支付处理、发票生成

**注册链接**: https://dashboard.stripe.com/register

**注册信息**:
```yaml
账号类型: 标准账号
企业类型: 个人/公司
国家: 你的注册国家
企业信息: 详细填写
```

**配置步骤**:
1. 注册并验证邮箱
2. 完善企业信息
3. 设置银行账户
4. 创建产品和价格
5. 配置 Webhook
6. 获取 API 密钥

**重要设置**:
- ✅ 完成身份验证
- ✅ 设置银行账户信息
- ✅ 创建订阅产品
- ✅ 配置 Webhook 端点
- ✅ 启用测试模式

**API 密钥**:
```bash
# 测试环境
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# 生产环境 (后续)
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

**费用**: 2.9% + $0.30/笔 (美国)

---

### 6. **Resend** - 邮件服务
**用途**: 事务邮件、营销邮件、邮件模板

**注册链接**: https://resend.com/signup

**注册信息**:
```yaml
账号类型: 免费账号
邮箱: 企业邮箱
用途: Transactional emails
```

**配置步骤**:
1. 注册并验证邮箱
2. 验证发送域名
3. 创建 API 密钥
4. 配置 DNS 记录
5. 测试邮件发送

**重要设置**:
- ✅ 验证发送域名
- ✅ 配置 SPF/DKIM 记录
- ✅ 创建 API 密钥
- ✅ 设置发件人信息

**DNS 配置** (以 yourdomain.com 为例):
```dns
# SPF 记录
TXT @ "v=spf1 include:_spf.resend.com ~all"

# DKIM 记录
CNAME resend._domainkey resend._domainkey.resend.com
```

**API 配置**:
```bash
RESEND_API_KEY=re_xxx
```

**费用**: 免费 (3K 邮件/月, 100 邮件/天)

---

### 7. **域名注册商** - 域名管理
**用途**: 域名注册、DNS 管理

**推荐注册商**:
1. **Namecheap** (推荐): https://www.namecheap.com/
2. **Cloudflare**: https://www.cloudflare.com/products/registrar/
3. **Google Domains**: https://domains.google/

**注册信息**:
```yaml
域名: yourdomain.com (.com 推荐)
注册年限: 1-2 年
隐私保护: 启用
自动续费: 启用
```

**配置步骤**:
1. 搜索并注册域名
2. 配置 DNS 记录
3. 设置子域名
4. 配置邮件记录
5. 启用 SSL 证书

**DNS 配置**:
```dns
# 主域名指向 Vercel
A @ 76.76.19.61
AAAA @ 2606:4700:10::6816:4b3d

# 子域名
CNAME app cname.vercel-dns.com
CNAME api cname.vercel-dns.com
CNAME www yourdomain.com

# 邮件记录 (Resend)
TXT @ "v=spf1 include:_spf.resend.com ~all"
CNAME resend._domainkey resend._domainkey.resend.com
```

**费用**: $10-15/年 (.com 域名)

---

## 🟡 推荐账号 (增强功能)

### 8. **Google OAuth** - 社交登录
**用途**: Google 账号登录

**注册链接**: https://console.developers.google.com/

**配置步骤**:
1. 创建新项目
2. 启用 Google+ API
3. 创建 OAuth 2.0 凭据
4. 配置授权回调 URL
5. 获取客户端 ID 和密钥

**重要设置**:
- ✅ 项目名称: YourApp
- ✅ 授权域名: yourdomain.com
- ✅ 回调 URL: https://yourdomain.com/api/auth/callback/google

**环境变量**:
```bash
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

**费用**: 免费

---

### 9. **GitHub OAuth** - 社交登录
**用途**: GitHub 账号登录

**注册链接**: https://github.com/settings/applications/new

**配置步骤**:
1. 创建 OAuth App
2. 配置应用信息
3. 设置回调 URL
4. 获取客户端 ID 和密钥

**重要设置**:
- ✅ 应用名称: YourApp
- ✅ 主页 URL: https://yourdomain.com
- ✅ 回调 URL: https://yourdomain.com/api/auth/callback/github

**环境变量**:
```bash
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```

**费用**: 免费

---

### 10. **Axiom** - 日志管理
**用途**: 应用日志、错误追踪、性能监控

**注册链接**: https://axiom.co/signup

**配置步骤**:
1. 注册免费账号
2. 创建数据集
3. 获取 API Token
4. 配置日志收集
5. 设置告警规则

**重要设置**:
- ✅ 数据集名称: your-app-logs
- ✅ 保留期: 30 天
- ✅ 创建 API Token
- ✅ 配置告警

**环境变量**:
```bash
AXIOM_TOKEN=xaat-xxx
AXIOM_DATASET=your-app-logs
```

**费用**: 免费 (0.5GB 日志/月)

---

### 11. **Sentry** - 错误监控
**用途**: 错误追踪、性能监控、用户反馈

**注册链接**: https://sentry.io/signup/

**配置步骤**:
1. 注册免费账号
2. 创建项目
3. 安装 SDK
4. 配置错误收集
5. 设置告警规则

**重要设置**:
- ✅ 项目类型: Next.js
- ✅ 错误采样率: 100%
- ✅ 性能采样率: 10%
- ✅ 配置告警邮箱

**环境变量**:
```bash
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**费用**: 免费 (5K 错误/月)

---

## 🟢 可选账号 (未来扩展)

### 12. **Tinybird** - 实时分析
**用途**: 实时数据分析、用户行为追踪

**注册链接**: https://www.tinybird.co/

**费用**: 免费 (1M 行/月)

---

### 13. **Cloudflare** - CDN 和安全
**用途**: CDN 加速、DDoS 防护、DNS 管理

**注册链接**: https://dash.cloudflare.com/sign-up

**费用**: 免费 (基础 CDN)

---

### 14. **PostHog** - 产品分析
**用途**: 用户行为分析、A/B 测试、功能标志

**注册链接**: https://posthog.com/signup

**费用**: 免费 (1M 事件/月)

---

### 15. **Intercom** - 客户支持
**用途**: 在线客服、用户反馈、帮助文档

**注册链接**: https://www.intercom.com/

**费用**: $39/月起

---

## 📋 注册检查清单

### **第一天 - 核心基础设施**
- [ ] GitHub 账号注册和配置
- [ ] Vercel 账号注册和项目连接
- [ ] 域名注册和 DNS 配置
- [ ] PlanetScale 数据库创建
- [ ] Upstash Redis 配置

### **第二天 - 支付和邮件**
- [ ] Stripe 账号注册和配置
- [ ] Resend 邮件服务配置
- [ ] 域名邮件记录配置
- [ ] 支付产品创建
- [ ] 邮件模板测试

### **第三天 - 认证和监控**
- [ ] Google OAuth 应用创建
- [ ] GitHub OAuth 应用创建
- [ ] Axiom 日志服务配置
- [ ] Sentry 错误监控配置
- [ ] 环境变量配置完成

### **第四天 - 测试和验证**
- [ ] 所有服务连接测试
- [ ] 认证流程测试
- [ ] 支付流程测试
- [ ] 邮件发送测试
- [ ] 监控和日志测试

## 🔐 安全配置建议

### **账号安全**
- ✅ 所有账号启用双因素认证 (2FA)
- ✅ 使用强密码或密码管理器
- ✅ 定期更新 API 密钥
- ✅ 限制 API 密钥权限

### **环境变量管理**
```bash
# 开发环境 (.env.local)
DATABASE_URL="mysql://..."
STRIPE_SECRET_KEY="sk_test_..."
RESEND_API_KEY="re_..."

# 生产环境 (Vercel Dashboard)
DATABASE_URL="mysql://..."
STRIPE_SECRET_KEY="sk_live_..."
RESEND_API_KEY="re_..."
```

### **访问控制**
- ✅ 最小权限原则
- ✅ 定期审查访问权限
- ✅ 使用服务账号而非个人账号
- ✅ 记录所有管理操作

## 💰 总成本估算

### **免费服务** ($0/月)
- GitHub (免费层)
- Vercel (免费层)
- PlanetScale (免费层)
- Upstash (免费层)
- Resend (免费层)
- Google/GitHub OAuth (免费)
- Axiom (免费层)
- Sentry (免费层)

### **必需付费** (~$15/年)
- 域名注册: $10-15/年

### **按使用付费**
- Stripe: 2.9% + $0.30/笔交易

### **总计 MVP 成本**
- **固定成本**: ~$15/年 (域名)
- **变动成本**: 支付手续费 (按收入比例)
- **月度预算**: < $50/月 (包含预期收入的手续费)

## 📞 支持联系方式

### **技术支持**
- Vercel: support@vercel.com
- PlanetScale: support@planetscale.com
- Stripe: support@stripe.com
- Resend: support@resend.com

### **紧急联系**
- 保存所有服务的紧急联系方式
- 建立内部联系人清单
- 设置服务状态监控

## 🎯 注册完成后的下一步

1. **环境配置**: 配置所有环境变量
2. **服务测试**: 测试所有服务连接
3. **监控设置**: 配置监控和告警
4. **文档更新**: 更新内部文档
5. **团队培训**: 培训团队成员使用

---

**🎉 完成这个清单后，你就拥有了一个完整的国际化 SaaS 产品技术栈！**

记住要保存好所有的账号信息和 API 密钥，建议使用密码管理器来安全存储这些敏感信息。
