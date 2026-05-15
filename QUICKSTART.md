# 企微群助手定时发送消息 - 快速配置指南

## 🚀 快速开始（3 分钟）

### 1️⃣ 获取企业微信 Webhook URL

1. 打开企业微信客户端
2. 选择需要的群组
3. 右击群组 → **添加群机器人**
4. 复制生成的 **Webhook URL**

### 2️⃣ 配置环境变量

```bash
# 复制 .env.example 到 .env
cp .env.example .env

# 编辑 .env，填入你的 Webhook URL
WECOM_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY
```

### 3️⃣ 安装并运行

```bash
npm install
npm start
```

## 📋 常用任务配置

### 早晨问候（每天 9:00）
```typescript
{
  name: 'morning_greeting',
  cron: '0 9 * * *',
  message: {
    type: 'markdown',
    content: '# 早上好！祝大家有美好的一天！'
  }
}
```

### 日报提醒（工作日下午 5:00）
```typescript
{
  name: 'daily_report',
  cron: '0 17 * * 1-5',
  message: {
    type: 'markdown',
    content: '# 📝 别忘了提交日报！'
  }
}
```

### 周报提醒（周五 4:00）
```typescript
{
  name: 'weekly_report',
  cron: '0 16 * * 5',
  message: {
    type: 'text',
    content: '亲爱的同事们，周报提交截止时间为明天 3:00'
  }
}
```

## ⏰ Cron 表达式详解

```
┌───────────── 秒 (0 - 59)
│ ┌───────────── 分 (0 - 59)
│ │ ┌───────────── 时 (0 - 23)
│ │ │ ┌───────────── 日 (1 - 31)
│ │ │ │ ┌───────────── 月 (1 - 12)
│ │ │ │ │ ┌───────────── 周几 (0 - 6) (0 = 周日)
│ │ │ │ │ │
* * * * * *
```

### 常见例子

| Cron | 说明 |
|------|------|
| `0 9 * * *` | 每天早上 9:00 |
| `0 */2 * * *` | 每 2 小时 |
| `0 9,14,17 * * *` | 每天 9:00, 14:00, 17:00 |
| `0 9 * * 1-5` | 工作日早上 9:00 |
| `0 9 1 * *` | 每月 1 号早上 9:00 |
| `0 0 * * 0` | 每周日午夜 |

## 🎨 消息类型

### 文本消息
```typescript
{
  type: 'text',
  content: '这是一条文本消息'
}
```

### Markdown 消息（推荐）
```typescript
{
  type: 'markdown',
  content: `# 标题
**粗体** 
*斜体*
> 引用
\`\`\`
代码
\`\`\``
}
```

### @提及
```typescript
await robot.sendText(
  '各位同事请注意',
  [],
  ['user1', 'user2'], // 提及用户
  ['13800138000']      // 提及电话
);
```

## 🔧 高级配置

### 自定义日志级别
```bash
LOG_LEVEL=debug  # debug, info, warn, error
```

### 消息重试
```bash
MAX_RETRIES=5        # 最大重试次数
RETRY_DELAY=2000     # 重试延迟（毫秒）
```

### 时区设置
```bash
TIMEZONE=Asia/Shanghai
```

## 🐛 常见问题排查

### Q: 消息没有发送？
- ✅ 检查 Webhook URL 是否正确
- ✅ 查看 logs/wecom-robot.log 日志
- ✅ 确认 Cron 表达式是否正确

### Q: 如何查看日志？
```bash
tail -f logs/wecom-robot.log
```

### Q: 如何测试消息？
```typescript
const robot = new WeComRobot({ webhookUrl: process.env.WECOM_WEBHOOK_URL });
await robot.sendText('测试消息');
```

## 📚 更多资源

- [企业微信 API 文档](https://work.weixin.qq.com/api/doc/90000/90136/92572)
- [Node-Cron 文档](https://github.com/kelektiv/node-cron)
- [本项目 GitHub](https://github.com/dai2860082500-hash/1111)

---

需要帮助？提交 Issue 或 PR！ 🤝
