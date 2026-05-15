import 'dotenv/config';
import logger from './config/logger';
import WeComRobot from './robot/WeComRobot';
import MessageScheduler from './scheduler/MessageScheduler';
import { predefinedTasks } from './templates/messageTemplates';

async function main() {
  try {
    // 检查必要的环境变量
    if (!process.env.WECOM_WEBHOOK_URL) {
      throw new Error('WECOM_WEBHOOK_URL is not set in environment variables');
    }

    logger.info('Starting WeChat Enterprise Robot...');
    logger.info(`Environment: ${process.env.NODE_ENV || 'production'}`);
    logger.info(`Timezone: ${process.env.TIMEZONE || 'Asia/Shanghai'}`);

    // 创建机器人实例
    const robot = new WeComRobot({
      webhookUrl: process.env.WECOM_WEBHOOK_URL,
    });

    logger.info('Robot initialized successfully');

    // 创建任务调度器
    const scheduler = new MessageScheduler(robot);

    // 添加预定义任务
    scheduler.addTasks(predefinedTasks);
    logger.info(`Added ${predefinedTasks.length} predefined tasks`);

    // 列出所有任务
    const tasks = scheduler.listTasks();
    logger.info('Scheduled tasks:');
    tasks.forEach((task) => {
      logger.info(`  - ${task.name} (${task.cron}) - ${task.description}`);
    });

    // 优雅关闭处理
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      scheduler.stopAll();
      process.exit(0);
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      scheduler.stopAll();
      process.exit(0);
    });

    logger.info('WeChat Enterprise Robot is running...');
    logger.info('Press Ctrl+C to stop');

    // 可选：测试一条消息（开发时取消注释）
    // await robot.sendText('测试消息：企微群助手已启动！');
  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
