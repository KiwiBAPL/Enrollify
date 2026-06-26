import type { Logger } from '../lib/logger.js'
import type { ChannelAdapter } from './ChannelAdapter.js'

export class MockChannelAdapter implements ChannelAdapter {
  constructor(private readonly logger: Logger) {}

  async sendMessage(recipientId: string, text: string): Promise<void> {
    this.logger.info({ recipientId, textLength: text.length }, 'MockChannel: sendMessage')
  }

  async sendTypingOn(recipientId: string): Promise<void> {
    this.logger.debug({ recipientId }, 'MockChannel: typing_on')
  }

  async sendTypingOff(recipientId: string): Promise<void> {
    this.logger.debug({ recipientId }, 'MockChannel: typing_off')
  }

  async markSeen(recipientId: string): Promise<void> {
    this.logger.debug({ recipientId }, 'MockChannel: mark_seen')
  }
}
