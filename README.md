# 企业微信群助手定时发送消息

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

一个功能强大的企业微信群定时消息发送助手，支持多种消息类型和灵活的定时任务调度。

[快速开始](QUICKSTART.md) • [API 文档](#api-文档) • [配置示例](#配置示例)

</div>

---

## ✨ 功能特性

- ✅ **多种消息类型支持** - 文本、Markdown、图片、图文消息
- ✅ **灵活的任务调度** - 基于 Cron 表达式的定时任务
- ✅ **预定义消息模板** - 开箱即用的常用消息模板
- ✅ **自动重试机制** - 消息发送失败自动重试
- ✅ **详细的日志记录** - 支持文件和控制台日志
- ✅ **@提及功能** - 支持 @用户或 @电话
- ✅ **优雅关闭** - 收到关闭信号时安全释放资源
- ✅ **易于扩展** - 清晰的代码结构便于二次开发

## 📋 项目结构

```
src/
├── config/
│   └── logger.ts              # 日志配置
├── robot/
│   └── WeComRobot.ts          # 企微机器人核心类
├── scheduler/
│   └── MessageScheduler.ts    # 定时任务调度器
├── templates/
│   └── messageTemplates.ts    # 消息模板库
└── index.ts                   # 应用入口
```

## 🚀 快速开始

### 1. 获取 Webhook URL

1. 打开企业微信客户端
2. 选择目标群组
3. 右击群组菜单 → **添加群机器人**
4. 复制生成的 **Webhook URL**

### 2. 环境配置

```bash
# 复制环境模板
cp .env.example .env

# 编辑 .env，填入你的 Webhook URL
WECOM_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY
```

### 3. 安装并运行

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 生产模式编译并运行
npm run build
npm start
```

## 💡 使用示例

### 发送简单文本消息

```typescript
import WeComRobot from './robot/WeComRobot';

const robot = new WeComRobot({
  webhookUrl: process.env.WECOM_WEBHOOK_URL,
});

await robot.sendText('大家好，这是一条测试消息！');
```

### 发送 Markdown 消息

```typescript
await robot.sendMarkdown(`
# 标题
这是一条 **Markdown** 消息

- 支持 **粗体**
- 支持 *斜体*
- 支持 \`代码\`
`);
```

### 创建定时任务

```typescript
import MessageScheduler from './scheduler/MessageScheduler';
import { messageTemplates } from './templates/messageTemplates';

const scheduler = new MessageScheduler(robot);

scheduler.addTask({
  name: 'morning_greeting',
  cron: '0 9 * * *', // 每天早上 9 点
  message: messageTemplates.morningGreeting(),
  description: '早晨问候',
});
```

### 使用预定义模板

```typescript
import { createTaskFromTemplate, commonCronExpressions } from './templates/messageTemplates';

const task = createTaskFromTemplate(
  'dailyReportReminder',
  'daily_report',
  commonCronExpressions.workdays_18pm,
  '日报提醒'
);

scheduler.addTask(task);
```

## 🔧 API 文档

### WeComRobot

#### `sendText(content, mentionedList?, mentionedMobileList?)`

发送文本消息

```typescript
await robot.sendText(
  '各位同事请注意',
  ['user1', 'user2'],      // 提及用户
  ['13800138000']          // 提及电话
);
```

#### `sendMarkdown(content)`

发送 Markdown 消息

```typescript
await robot.sendMarkdown('# 标题\n支持 **Markdown** 格式');
```

#### `sendImage(mediaId)`

发送图片消息

```typescript
await robot.sendImage('media_id_from_wecom_api');
```

#### `sendNews(articles)`

发送图文消息

```typescript
await robot.sendNews([
  {
    title: '文章标题',
    description: '文章描述',
    url: 'https://example.com',
    picurl: 'https://example.com/pic.jpg',
  },
]);
```

### MessageScheduler

#### `addTask(task)`

添加单个定时任务

```typescript
scheduler.addTask({
  name: 'task_name',
  cron: '0 9 * * *',
  message: { type: 'text', content: 'message content' },
  description: '任务描述',
});
```

#### `addTasks(tasks)`

批量添加定时任务

```typescript
scheduler.addTasks([task1, task2, task3]);
```

#### `removeTask(taskName)`

删除指定任务

```typescript
scheduler.removeTask('task_name');
```

#### `stopAll()`

停止所有任务

```typescript
scheduler.stopAll();
```

#### `listTasks()`

获取所有任务列表

```typescript
const tasks = scheduler.listTasks();
console.log(tasks);
// [
//   { name: 'morning_greeting', cron: '0 9 * * *', description: '早晨问候', enabled: true },
//   ...
// ]
```

#### `testTask(taskName)`

测试任务（立即执行一次）

```typescript
await scheduler.testTask('morning_greeting');
```

## ⏰ Cron 表达式

基于 [node-cron](https://github.com/kelektiv/node-cron) 的 Cron 表达式语法：

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

### 常用表达式

| 表达式 | 说明 |
|--------|------|
| `0 9 * * *` | 每天早上 9:00 |
| `0 */2 * * *` | 每 2 小时 |
| `0 9,14,17 * * *` | 每天 9:00、14:00、17:00 |
| `0 9 * * 1-5` | 工作日早上 9:00 |
| `0 9 1 * *` | 每月 1 号早上 9:00 |
| `0 0 * * 0` | 每周日午夜 |

## 📚 预定义消息模板

以下模板已内置，开箱即用：

- `morningGreeting()` - 早晨问候
- `dailyReportReminder()` - 日报提醒
- `weeklyReportReminder()` - 周报提醒
- `offWorkReminder()` - 下班提醒
- `meetingReminder(name, time)` - 会议提醒
- `birthdayWish(name)` - 生日祝福
- `projectCompletion(projectName)` - 项目完成
- `securityReminder()` - 安全提示
- `announcement(title, content)` - 公告通知
- `custom(type, content)` - 自定义消息

## 🔍 调试和日志

### 查看日志

```bash
# 实时查看日志
tail -f logs/wecom-robot.log

# 查看最后 50 行
tail -50 logs/wecom-robot.log

# 搜索特定日志
grep "ERROR" logs/wecom-robot.log
```

### 调整日志级别

在 `.env` 中设置：

```bash
LOG_LEVEL=debug    # debug, info, warn, error
```

### 本地测试消息发送

```typescript
// 在代码中临时添加测试代码
const robot = new WeComRobot({
  webhookUrl: process.env.WECOM_WEBHOOK_URL,
});

// 立即发送
await robot.sendText('测试消息');
await robot.sendMarkdown('# 测试 Markdown');
```

## 🔒 安全建议

1. **不要提交 `.env` 文件** - 已在 `.gitignore` 中
2. **保护 Webhook URL** - 不要在公开场所暴露
3. **定期更新依赖** - `npm audit fix`
4. **使用环境变量** - 敏感信息通过环境变量传入
5. **检查发送内容** - 避免发送敏感或不当内容

## 🐛 常见问题

### Q: 消息没有发送？

**A:** 检查以下几点：
- ✅ Webhook URL 是否正确填入
- ✅ 企业���信群是否有权限
- ✅ 查看日志文件：`tail -f logs/wecom-robot.log`
- ✅ Cron 表达式是否正确（可用 [crontab.guru](https://crontab.guru) 验证）

### Q: 如何验证 Cron 表达式？

**A:** 可以使用在线工具 [crontab.guru](https://crontab.guru) 或运行测试：

```typescript
import cron from 'node-cron';
console.log(cron.validate('0 9 * * *')); // true or false
```

### Q: 如何自定义消息内容？

**A:** 创建自己的消息模板：

```typescript
const customMessage = {
  type: 'markdown',
  content: `
    # 自定义标题
    
    这是自定义内容
    
    **支持所有 Markdown 语法**
  `,
};

await robot.sendMarkdown(customMessage.content);
```

### Q: 支持哪些消息类型？

**A:** 目前支持：
- `text` - 纯文本消息
- `markdown` - Markdown 格式消息
- `image` - 图片消息
- `news` - 图文消息

## 📝 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `WECOM_WEBHOOK_URL` | 企业微信 Webhook URL（必需） | - |
| `LOG_LEVEL` | 日志级别 | `info` |
| `LOG_FILE` | 日志文件路径 | `logs/wecom-robot.log` |
| `MAX_RETRIES` | 最大重试次数 | `3` |
| `RETRY_DELAY` | 重试延迟（毫秒） | `2000` |
| `TIMEZONE` | 时区 | `Asia/Shanghai` |
| `NODE_ENV` | 运行环境 | `production` |

## 🤝 贡献

欢迎提交 Issue 或 Pull Request！

1. Fork 这个项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 📞 联系方式

- 提交 [Issue](https://github.com/dai2860082500-hash/1111/issues)
- 发送邮件：dai2860082500@gmail.com

---

<div align="center">

**[⬆ 返回顶部](#企业微信群助手定时发送消息)**

如果这个项目帮到了你，请给个 ⭐ Star

</div>
