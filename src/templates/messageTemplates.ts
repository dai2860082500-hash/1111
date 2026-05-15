import { Message, NewsArticle } from '../robot/WeComRobot';
import { Task } from '../scheduler/MessageScheduler';

/**
 * 常用 Cron 表达式预设
 */
export const commonCronExpressions = {
  // 每小时
  every_hour: '0 * * * *',
  // 每 2 小时
  every_2_hours: '0 */2 * * *',
  // 工作日上午 9 点
  workdays_9am: '0 9 * * 1-5',
  // 工作日下午 2 点
  workdays_2pm: '0 14 * * 1-5',
  // 工作日下午 5 点
  workdays_5pm: '0 17 * * 1-5',
  // 工作日下午 6 点
  workdays_6pm: '0 18 * * 1-5',
  // 周一上午 9 点
  monday_9am: '0 9 * * 1',
  // 周五下午 4 点
  friday_4pm: '0 16 * * 5',
  // 每天上午 9 点
  daily_9am: '0 9 * * *',
};

/**
 * 消息模板库
 */

/**
 * 早晨问候消息
 */
export function morningGreeting(): Message {
  return {
    type: 'markdown',
    content: `# 🌅 早上好！

新的一天开始了，希望大家有美好的一天！

💪 加油！`,
  };
}

/**
 * 日报提醒
 */
export function dailyReportReminder(): Message {
  return {
    type: 'markdown',
    content: `# 📝 日报提醒

亲爱的同事们，别忘了提交今天的日报哦！

提交截止时间：**下班前**

感谢配合！`,
  };
}

/**
 * 周报提醒
 */
export function weeklyReportReminder(): Message {
  return {
    type: 'markdown',
    content: `# 📊 周报提醒

亲爱的同事们，周报提交截止时间为**明天下午 3:00**

请大家及时提交周报，感谢配合！

- 📅 提交截止：明天 15:00
- 📌 联系人：HR`,
  };
}

/**
 * 下班提醒
 */
export function offWorkReminder(): Message {
  return {
    type: 'markdown',
    content: `# 🏃 下班时间到了！

亲爱的同事们，下班时间到了！

请检查一下：
- ✅ 工作是否完成
- ✅ 电脑是否关机
- ✅ 门窗是否关好

祝大家晚上愉快！`,
  };
}

/**
 * 会议提醒
 */
export function meetingReminder(meetingName: string, meetingTime: string): Message {
  return {
    type: 'markdown',
    content: `# 📌 会议提醒

**会议名称：** ${meetingName}

**会议时间：** ${meetingTime}

请大家准时参加！`,
  };
}

/**
 * 生日祝福
 */
export function birthdayWish(name: string): Message {
  return {
    type: 'markdown',
    content: `# 🎂 生日快乐！

祝 **${name}** 生日快乐！

🎉 希望你的每一天都充满欢笑和温馨！

全体同事敬上`,
  };
}

/**
 * 项目完成通知
 */
export function projectCompletion(projectName: string): Message {
  return {
    type: 'markdown',
    content: `# ✅ 项目完成

恭喜各位！**${projectName}** 项目已完成！

感谢大家的辛勤付出，让我们继续为下一个目标努力！

🚀 加油！`,
  };
}

/**
 * 安全提示
 */
export function securityReminder(): Message {
  return {
    type: 'markdown',
    content: `# 🔒 安全提示

各位同事，请提醒大家：

1. **不要在公共场所使用公司账号**
2. **定期修改密码**
3. **不要打开陌生链接**
4. **不要分享敏感信息**
5. **及时安装安全补丁**

感谢配合！`,
  };
}

/**
 * 公告通知
 */
export function announcement(title: string, content: string): Message {
  return {
    type: 'markdown',
    content: `# 📢 ${title}

${content}`,
  };
}

/**
 * 自定义消息
 */
export function custom(type: 'text' | 'markdown', content: string): Message {
  return {
    type,
    content,
  };
}

/**
 * 从模板创建任务
 */
export function createTaskFromTemplate(
  templateName: string,
  taskName: string,
  cronExpression: string,
  description: string
): Task {
  let message: Message;

  switch (templateName) {
    case 'morningGreeting':
      message = morningGreeting();
      break;
    case 'dailyReportReminder':
      message = dailyReportReminder();
      break;
    case 'weeklyReportReminder':
      message = weeklyReportReminder();
      break;
    case 'offWorkReminder':
      message = offWorkReminder();
      break;
    case 'securityReminder':
      message = securityReminder();
      break;
    default:
      throw new Error(`Unknown template: ${templateName}`);
  }

  return {
    name: taskName,
    cron: cronExpression,
    message,
    description,
  };
}

/**
 * 预定义的 5 个任务
 */
export const predefinedTasks: Task[] = [
  {
    name: 'morning_greeting',
    cron: commonCronExpressions.daily_9am,
    message: morningGreeting(),
    description: '早晨问候',
  },
  {
    name: 'daily_report_reminder',
    cron: commonCronExpressions.workdays_5pm,
    message: dailyReportReminder(),
    description: '日报提醒 - 工作日下午 5:00',
  },
  {
    name: 'weekly_report_reminder',
    cron: commonCronExpressions.friday_4pm,
    message: weeklyReportReminder(),
    description: '周报提醒 - 周五下午 4:00',
  },
  {
    name: 'off_work_reminder',
    cron: commonCronExpressions.workdays_6pm,
    message: offWorkReminder(),
    description: '下班提醒 - 工作日下午 6:00',
  },
  {
    name: 'security_reminder',
    cron: commonCronExpressions.monday_9am,
    message: securityReminder(),
    description: '安全提示 - 周一上午 9:00',
  },
];
