import logger from './logger';
import axios, { AxiosError } from 'axios';

/**
 * 消息类型
 */
export type MessageType = 'text' | 'markdown' | 'image' | 'news';

/**
 * 消息接口
 */
export interface Message {
  type: MessageType;
  content: string;
}

/**
 * 图文消息文章
 */
export interface NewsArticle {
  title: string;
  description?: string;
  url?: string;
  picurl?: string;
}

/**
 * 图文消息
 */
export interface NewsMessage {
  articles: NewsArticle[];
}

/**
 * 企业微信机器人配置
 */
export interface WeComRobotConfig {
  webhookUrl: string;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * 企业微信机器人
 */
class WeComRobot {
  private webhookUrl: string;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: WeComRobotConfig) {
    this.webhookUrl = config.webhookUrl;
    this.maxRetries = config.maxRetries || parseInt(process.env.MAX_RETRIES || '3', 10);
    this.retryDelay = config.retryDelay || parseInt(process.env.RETRY_DELAY || '2000', 10);

    logger.info('WeComRobot initialized', {
      maxRetries: this.maxRetries,
      retryDelay: this.retryDelay,
    });
  }

  /**
   * 发送文本消息
   */
  async sendText(
    content: string,
    mentionedList?: string[],
    mentionedMobileList?: string[]
  ): Promise<void> {
    const data = {
      msgtype: 'text',
      text: {
        content,
        mentioned_list: mentionedList || [],
        mentioned_mobile_list: mentionedMobileList || [],
      },
    };

    await this.send(data, 'text');
  }

  /**
   * 发送 Markdown 消息
   */
  async sendMarkdown(content: string): Promise<void> {
    const data = {
      msgtype: 'markdown',
      markdown: {
        content,
      },
    };

    await this.send(data, 'markdown');
  }

  /**
   * 发送图片消息
   */
  async sendImage(mediaId: string): Promise<void> {
    const data = {
      msgtype: 'image',
      image: {
        media_id: mediaId,
      },
    };

    await this.send(data, 'image');
  }

  /**
   * 发送图文消息
   */
  async sendNews(articles: NewsArticle[]): Promise<void> {
    const data = {
      msgtype: 'news',
      news: {
        items: articles.map((article) => ({
          title: article.title,
          description: article.description || '',
          url: article.url || '',
          picurl: article.picurl || '',
        })),
      },
    };

    await this.send(data, 'news');
  }

  /**
   * 发送消息（带重试机制）
   */
  private async send(payload: any, messageType: string): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logger.debug(`Sending ${messageType} message (attempt ${attempt}/${this.maxRetries})`, {
          payload: JSON.stringify(payload).substring(0, 100),
        });

        const response = await axios.post(this.webhookUrl, payload, {
          timeout: 10000,
        });

        if (response.status === 200 && response.data.errcode === 0) {
          logger.info(`Successfully sent ${messageType} message`, {
            attempt,
            errcode: response.data.errcode,
          });
          return;
        }

        lastError = new Error(
          `WeChat API returned error: ${response.data.errmsg} (errcode: ${response.data.errcode})`
        );

        logger.warn(`WeChat API error (attempt ${attempt}/${this.maxRetries})`, {
          errcode: response.data.errcode,
          errmsg: response.data.errmsg,
        });
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error(String(error));

        logger.error(
          `Failed to send ${messageType} message (attempt ${attempt}/${this.maxRetries})`,
          {
            error: lastError.message,
          }
        );
      }

      // 不是最后一次尝试则延迟后重试
      if (attempt < this.maxRetries) {
        logger.info(`Retrying in ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay);
      }
    }

    // 所有重试都失败
    const finalError = new Error(
      `Failed to send ${messageType} message after ${this.maxRetries} attempts: ${lastError?.message}`
    );
    logger.error(finalError.message);
    throw finalError;
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default WeComRobot;
